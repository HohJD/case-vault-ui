import test from 'node:test'
import assert from 'node:assert/strict'
import { FRAMEWORKS, FRAMEWORK_DRILLS, makeFrameworkQuestion, seededRandom } from './frameworks.js'
import { FRAMEWORK_PROGRESS_KEY, createFrameworkRound, frameworkCardCorrect, frameworkQuestion, frameworkReducer, frameworkRoundSummary, frameworkStats, loadFrameworkProgress, planFrameworkRound, reviewFrameworkRecord, saveFrameworkProgress, spacedRecall } from './framework-practice.js'

function independentlyCalculate({ kind, inputs: x }) {
  if (kind === 'margin') return x.profit / x.nextRevenue * 100
  if (kind === 'break-even') return Math.ceil(x.fixedCost / (x.price - x.variableCost))
  if (kind === 'capacity') return Math.min(...x.rates)
  if (kind === 'growth') return ((1 + x.marketGrowth / 100) * (1 + x.relativeShareGrowth / 100) - 1) * 100
  if (kind === 'entry-profit') return x.marketUnits * x.share / 100 * (x.price - x.variableCost) - x.fixedCost
  if (kind === 'value-payback') return x.price / ((x.replacement + x.labour) * x.replacements)
  if (kind === 'roce') return x.profit / x.nextCapital * 100
  return x.subtotal / (1 - x.share / 100)
}

test('framework pack has broad, internally sourced coverage and distinct drill families', () => {
  assert.equal(FRAMEWORKS.length, 16)
  assert.equal(FRAMEWORK_DRILLS.length, 42)
  assert.equal(new Set(FRAMEWORK_DRILLS.map(item => item.id)).size, 42)
  for (const item of FRAMEWORKS) {
    assert.ok(item.insight && item.when && item.formula && item.trap && item.ask && item.source.pages)
    assert.equal(item.steps.length, 3)
    assert.ok(item.drills.length >= 2)
  }
})

test('all scenarios have a single supported answer, specific feedback, and a changed context on repeat', () => {
  for (const drill of FRAMEWORK_DRILLS) {
    const first = makeFrameworkQuestion(drill.id, 0, 42)
    const second = makeFrameworkQuestion(drill.id, 1, 42)
    assert.notEqual(first.prompt, second.prompt)
    for (let seed = 0; seed < 50; seed++) for (let variant = 0; variant < 2; variant++) {
      const q = makeFrameworkQuestion(drill.id, variant, seed)
      assert.ok(q.prompt && q.explanation)
      assert.equal(q.options.length, 3)
      assert.equal(new Set(q.options.map(option => option.label)).size, 3)
      assert.equal(q.options.filter(option => option.id === q.correct).length, 1)
      assert.ok(q.options.every(option => option.label && option.feedback))
      if (q.math) assert.ok(Math.abs(q.math.expected - independentlyCalculate(q.math)) < 1e-7)
    }
  }
})

test('numerical variants are deterministic for resume but change with new seeds', () => {
  const id = 'market-entry/attainable-profit'
  assert.deepEqual(makeFrameworkQuestion(id, 0, 18), makeFrameworkQuestion(id, 0, 18))
  const prompts = new Set(Array.from({ length: 20 }, (_, seed) => makeFrameworkQuestion(id, 0, seed).prompt))
  assert.ok(prompts.size > 10)
  assert.throws(() => makeFrameworkQuestion('missing', 0, 0), /Unknown/)
})

const DAY = 86400000
const empty = () => loadFrameworkProgress({ getItem: () => null })
const begin = (state = empty(), mode = 'mix', frameworkId) => frameworkReducer(state, { type: 'start', options: { mode, frameworkId, random: seededRandom(10), now: 0, id: 'test-round' } })
function finish(state, { wrong = false, assisted = false, now = 0 } = {}) {
  while (!state.session.finished) {
    const card = state.session.cards[state.session.index]
    if (assisted) state = frameworkReducer(state, { type: 'method' })
    state = frameworkReducer(state, { type: 'reveal' })
    state = frameworkReducer(state, { type: 'answer', answer: wrong ? 'trap' : frameworkQuestion(card).correct })
    state = frameworkReducer(state, { type: 'check', now })
    state = frameworkReducer(state, { type: 'next' })
  }
  return state
}

test('mixed rounds are bounded, unique, and interleave frameworks', () => {
  const round = createFrameworkRound(empty(), { random: seededRandom(1), now: 0, id: 'mix' })
  assert.equal(round.cards.length, 6)
  assert.equal(new Set(round.cards.map(card => card.drillId)).size, 6)
  assert.equal(new Set(round.cards.map(card => FRAMEWORK_DRILLS.find(item => item.id === card.drillId).frameworkId)).size, 6)
  assert.equal(planFrameworkRound(empty(), 'review').length, 0)
  assert.equal(planFrameworkRound(empty(), 'framework', 'missing').length, 0)
})

test('due checks are prioritised and retry uses a different scenario', () => {
  const completed = finish(begin(empty(), 'framework', 'framing'), { wrong: true })
  assert.equal(frameworkStats(completed, null, 0).due, 2)
  const mix = planFrameworkRound(completed, 'mix', undefined, 100, seededRandom(1))
  assert.ok(completed.session.cards.every(card => mix.slice(0, 2).some(item => item.id === card.drillId)))
  const retry = begin(completed, 'retry')
  assert.equal(retry.session.cards.length, 2)
  for (const card of retry.session.cards) {
    const previous = completed.session.cards.find(item => item.drillId === card.drillId)
    assert.notEqual(card.variant, previous.variant)
    assert.notEqual(frameworkQuestion(card).prompt, frameworkQuestion(previous).prompt)
  }
})

test('same-day repeats cannot advance spaced recall or postpone its review date', () => {
  const card = { ...createFrameworkRound(empty(), { mode: 'framework', frameworkId: 'framing', random: seededRandom(1) }).cards[0], answer: 'reasoned' }
  let record = reviewFrameworkRecord(undefined, card, 0)
  assert.equal(record.level, 1)
  assert.equal(record.dueAt, DAY)
  record = reviewFrameworkRecord(record, { ...card, variant: 1 }, 1000)
  assert.equal(record.level, 1)
  assert.equal(record.dueAt, DAY)
  assert.equal(spacedRecall(record), false)
  record = reviewFrameworkRecord(record, card, DAY)
  assert.equal(record.level, 2)
  assert.equal(record.dueAt, 4 * DAY)
  assert.equal(spacedRecall(record), true)
  record = reviewFrameworkRecord(record, card, DAY + 1000)
  assert.equal(record.level, 2)
  assert.equal(record.dueAt, 4 * DAY)
})

test('mistakes or method assistance reset the interval and stay reviewable', () => {
  const card = { ...createFrameworkRound(empty(), { mode: 'framework', frameworkId: 'framing', random: seededRandom(1) }).cards[0], answer: 'reasoned' }
  const learned = reviewFrameworkRecord(undefined, card, 0)
  for (const change of [{ answer: 'trap' }, { assisted: true }]) {
    const record = reviewFrameworkRecord(learned, { ...card, ...change }, DAY)
    assert.equal(record.level, 0)
    assert.equal(record.dueAt, DAY)
    assert.equal(spacedRecall(record), false)
  }
})

test('answers lock after checking and scoring happens exactly once', () => {
  let state = begin(empty(), 'framework', 'framing')
  assert.equal(frameworkReducer(state, { type: 'next' }), state)
  assert.equal(frameworkReducer(state, { type: 'check' }), state)
  state = frameworkReducer(state, { type: 'answer', answer: 'reasoned' })
  state = frameworkReducer(state, { type: 'check', now: 0 })
  const card = state.session.cards[0]
  assert.ok(frameworkCardCorrect(card))
  assert.equal(frameworkReducer(state, { type: 'check', now: 100 }), state)
  assert.equal(frameworkReducer(state, { type: 'answer', answer: 'trap' }), state)
  assert.equal(state.records[card.drillId].attempts, 1)
  const afterMethod = frameworkReducer(state, { type: 'method' })
  assert.deepEqual(afterMethod.records, state.records)
  assert.equal(afterMethod.session.cards[0].assisted, false)
})

test('reading a method during a saved round marks matching unanswered checks as assisted', () => {
  let state = begin(empty(), 'framework', 'profit')
  state = frameworkReducer(state, { type: 'study', frameworkId: 'profit' })
  assert.ok(state.session.cards.every(card => card.assisted))
  state = finish(state)
  assert.equal(frameworkRoundSummary(state.session).assisted, 3)
  assert.ok(Object.values(state.records).every(record => record.level === 0))
})

test('calculation choices require deliberate reveal before selection', () => {
  let state = begin(empty(), 'framework', 'sizing')
  const index = state.session.cards.findIndex(card => frameworkQuestion(card).calculation)
  state.session.index = index
  const card = state.session.cards[index]
  assert.equal(card.revealed, false)
  assert.equal(frameworkReducer(state, { type: 'answer', answer: 'reasoned' }), state)
  state = frameworkReducer(state, { type: 'reveal' })
  state = frameworkReducer(state, { type: 'answer', answer: 'reasoned' })
  assert.equal(state.session.cards[index].answer, 'reasoned')
})

test('ending early does not grade unattempted questions or discard the selected draft', () => {
  let state = begin()
  state = frameworkReducer(state, { type: 'answer', answer: 'reasoned' })
  const answer = state.session.cards[0].answer
  state = frameworkReducer(state, { type: 'end' })
  assert.equal(state.session.cards[0].answer, answer)
  assert.equal(frameworkRoundSummary(state.session).checked, 0)
  assert.deepEqual(state.records, {})
})

test('unfinished rounds resume unchanged, and storage remains separate from Cases progress', () => {
  const data = new Map([['case-prep-cases-v1', 'original writing'], ['case-prep-cases-v2', 'current cases']])
  const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
  let state = begin()
  assert.equal(begin(state, 'framework', 'pricing'), state)
  assert.ok(saveFrameworkProgress(state, storage))
  assert.deepEqual(loadFrameworkProgress(storage), state)
  state = finish(state)
  saveFrameworkProgress(state, storage)
  assert.deepEqual(loadFrameworkProgress(storage), state)
  assert.equal(data.get('case-prep-cases-v1'), 'original writing')
  assert.equal(data.get('case-prep-cases-v2'), 'current cases')
  assert.equal(saveFrameworkProgress(state, { setItem: () => { throw Error('blocked') } }), false)
  data.set(FRAMEWORK_PROGRESS_KEY, '{bad')
  assert.deepEqual(loadFrameworkProgress(storage), empty())
})

test('a corrupt session does not destroy valid aggregate review records', () => {
  const state = finish(begin())
  state.session.cards[0].variant = 999
  const loaded = loadFrameworkProgress({ getItem: () => JSON.stringify(state) })
  assert.equal(loaded.session, null)
  assert.deepEqual(loaded.records, state.records)
})
