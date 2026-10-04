import test from 'node:test'
import assert from 'node:assert/strict'
import { CASE_MATH_LESSONS, makeCaseMathExercise } from './case-maths.js'
import { MATH_LESSON_PROGRESS_KEY, loadMathLessonProgress, saveMathLessonProgress, mathLessonReducer, mathLessonSummary } from './case-maths-practice.js'

const empty = () => loadMathLessonProgress({ getItem: () => null })
const begin = (state = empty(), lessonId = 'units') => mathLessonReducer(state, { type: 'start', lessonId, random: () => 0.4 })
function finish(state, wrong = false) {
  while (!state.session.finished) {
    const q = makeCaseMathExercise(state.session.lessonId, state.session.variant).steps[state.session.index]
    state = mathLessonReducer(state, { type: 'reveal' })
    state = mathLessonReducer(state, { type: 'answer', answer: wrong ? 'trap' : q.correct })
    state = mathLessonReducer(state, { type: 'check' })
    state = mathLessonReducer(state, { type: 'next' })
  }
  return state
}

function independent({ kind, inputs: x }) {
  if (kind === 'units') return x.annualRevenue / (x.monthlyOrders * 12)
  if (kind === 'percentages') return (x.after / x.before - 1) * 100
  if (kind === 'weighted') return (x.countA * x.priceA + x.countB * x.priceB) / (x.countA + x.countB)
  if (kind === 'margins') return (x.price * x.volume - x.variableCost * x.volume - x.fixedCost) / (x.price * x.volume) * 100
  if (kind === 'break-even') return Math.ceil(x.fixedCost / (x.price - x.variableCost))
  if (kind === 'growth') return x.initialRevenue * (1 + x.rate / 100) ** x.years
  if (kind === 'sizing') return x.population * x.eligible / 100 * x.penetration / 100 * x.frequency * x.weeks * x.price
  if (kind === 'capacity') return Math.min(...x.rates) * x.hours
  if (kind === 'payback') return x.investment / (x.grossSaving - x.runningCost)
  if (kind === 'breakeven-share') return Math.ceil(x.fixedCost / (x.price - x.variableCost)) / x.market * 100
  if (kind === 'price-change') return ((x.price - x.variableCost) / (x.price * (1 - x.cut / 100) - x.variableCost) - 1) * 100
  if (kind === 'lifetime-value') return x.revenue * x.margin / 100 / (x.churn / 100)
  if (kind === 'perpetuity') return x.cash / ((x.rate - x.growth) / 100)
  assert.fail(`Missing independent calculation: ${kind}`)
}

test('case maths teaches thirteen methods through setup, calculation, and interpretation', () => {
  assert.equal(CASE_MATH_LESSONS.length, 13)
  assert.equal(new Set(CASE_MATH_LESSONS.map(item => item.id)).size, 13)
  for (const lesson of CASE_MATH_LESSONS) {
    assert.ok(lesson.title && lesson.description && lesson.formula && lesson.trap)
    assert.equal(lesson.method.length, 3)
    assert.ok(lesson.sources.length)
    for (let variant = 0; variant < 240; variant++) {
      const q = makeCaseMathExercise(lesson.id, variant)
      assert.equal(q.steps.length, 3)
      assert.deepEqual(q.steps.map(step => step.stage), ['Set up', 'Calculate', 'Interpret'])
      assert.ok(Math.abs(q.math.expected - independent(q.math)) < 1e-7)
      for (const step of q.steps) {
        assert.equal(step.options.length, 3)
        assert.equal(new Set(step.options.map(option => option.label)).size, 3)
        assert.equal(step.options.filter(option => option.id === step.correct).length, 1)
        assert.ok(step.options.every(option => option.feedback && option.label))
      }
      const next = makeCaseMathExercise(lesson.id, variant + 1)
      assert.notEqual(q.context, next.context)
      assert.notDeepEqual(q.math.inputs, next.math.inputs)
      if (lesson.id === 'payback') assert.ok(q.math.expected <= 10)
    }
  }
  assert.throws(() => makeCaseMathExercise('missing', 0), /Unknown/)
  assert.throws(() => makeCaseMathExercise('units', -1), /variant/)
})

test('first attempts are locked, calculation choices stay hidden, and checks cannot be skipped', () => {
  let state = begin()
  assert.equal(mathLessonReducer(state, { type: 'next' }), state)
  assert.equal(mathLessonReducer(state, { type: 'check' }), state)
  assert.equal(mathLessonReducer(state, { type: 'answer', answer: 'invalid' }), state)
  state = mathLessonReducer(state, { type: 'answer', answer: 'trap' })
  state = mathLessonReducer(state, { type: 'check' })
  assert.equal(mathLessonReducer(state, { type: 'answer', answer: 'reasoned' }), state)
  assert.equal(mathLessonReducer(state, { type: 'check' }), state)
  state = mathLessonReducer(state, { type: 'next' })
  assert.equal(state.session.index, 1)
  assert.equal(state.session.cards[1].revealed, false)
  assert.equal(mathLessonReducer(state, { type: 'answer', answer: 'reasoned' }), state)
})

test('all lessons finish with a bounded summary; retries change figures and keep other progress', () => {
  let state = empty()
  for (const lesson of CASE_MATH_LESSONS) {
    state = finish(begin(state, lesson.id))
    assert.deepEqual(mathLessonSummary(state.session), { checked: 3, correct: 3, assisted: 0, variant: 0 })
    assert.equal(state.records[lesson.id].last.correct, 3)
  }
  const records = state.records
  state = begin(state, 'units')
  assert.equal(state.session.variant, 1)
  assert.deepEqual(state.records.payback, records.payback)
  assert.equal(begin(state, 'weighted'), state)
  state = finish(state, true)
  assert.equal(state.records.units.last.correct, 0)
  assert.equal(state.records.units.started, 2)
})

test('method help and reading a saved lesson mark remaining checks assisted, not earlier checks', () => {
  let state = begin()
  state = mathLessonReducer(state, { type: 'answer', answer: 'reasoned' })
  state = mathLessonReducer(state, { type: 'check' })
  assert.equal(mathLessonReducer(state, { type: 'study', lessonId: 'weighted' }), state)
  state = mathLessonReducer(state, { type: 'study', lessonId: 'units' })
  assert.deepEqual(state.session.cards.map(card => card.assisted), [false, true, true])
  state = finish(state)
  assert.equal(state.records.units.last.assisted, 2)
  assert.equal(mathLessonReducer(state, { type: 'method' }), state)
})

test('ending early records only attempted checks and never completes a lesson', () => {
  let state = begin()
  state = mathLessonReducer(state, { type: 'end' })
  assert.equal(state.session.finished, true)
  assert.equal(state.records.units.last.checked, 0)
  assert.equal(state.records.units.last.correct, 0)
  state = begin(state)
  assert.equal(state.session.variant, 1)
})

test('ending a later retry does not erase an earlier completed practice', () => {
  let state = finish(begin())
  assert.equal(state.records.units.completed, 1)
  state = mathLessonReducer(begin(state), { type: 'end' })
  assert.equal(state.records.units.completed, 1)
  assert.equal(state.records.units.last.checked, 0)
})

test('storage round-trips exact question order, selections, and completion in an isolated namespace', () => {
  const values = new Map([['case-prep-cases-v1', 'keep legacy'], ['case-prep-cases-v2', 'keep cases'], ['case-prep-frameworks-v1', 'keep frameworks']])
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) }
  let state = begin()
  state = mathLessonReducer(state, { type: 'answer', answer: 'trap' })
  assert.equal(saveMathLessonProgress(state, storage), true)
  assert.deepEqual(loadMathLessonProgress(storage), state)
  assert.deepEqual(makeCaseMathExercise(state.session.lessonId, state.session.variant), makeCaseMathExercise(loadMathLessonProgress(storage).session.lessonId, loadMathLessonProgress(storage).session.variant))
  assert.equal(values.get('case-prep-cases-v1'), 'keep legacy')
  assert.equal(values.get('case-prep-cases-v2'), 'keep cases')
  assert.equal(values.get('case-prep-frameworks-v1'), 'keep frameworks')
  assert.ok(values.has(MATH_LESSON_PROGRESS_KEY))
  state = finish(state)
  saveMathLessonProgress(state, storage)
  assert.deepEqual(loadMathLessonProgress(storage), state)
})

test('corrupt or unavailable storage recovers without discarding valid lesson records', () => {
  const bad = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('blocked') } }
  assert.deepEqual(loadMathLessonProgress(bad), empty())
  assert.equal(saveMathLessonProgress(begin(), bad), false)
  assert.deepEqual(loadMathLessonProgress({ getItem: () => '{broken' }), empty())
  const state = finish(begin())
  const saved = value => loadMathLessonProgress({ getItem: () => JSON.stringify(value) })
  for (const change of [
    session => { session.index = 42 },
    session => { session.variant = -1 },
    session => { session.cards[0].order = ['reasoned', 'reasoned', 'reasoned'] },
    session => { session.cards[0].answer = 'missing' },
    session => { session.cards[0].revealed = false },
  ]) {
    const copy = structuredClone(state)
    change(copy.session)
    assert.equal(saved(copy).session, null)
    assert.deepEqual(saved(copy).records, state.records)
  }
})
