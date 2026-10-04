import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_SETTINGS, OPERATIONS, bestScoreKey, createQuestion, initialSession, isCorrectAnswer, sessionReducer, validateSettings } from './arithmetic.js'

const settingsFor = (operation, ranges = {}) => ({ ...DEFAULT_SETTINGS, operations: [operation], ...ranges })

test('default settings are valid and empty or invalid settings cannot start', () => {
  assert.equal(validateSettings(DEFAULT_SETTINGS), '')
  assert.match(validateSettings({ ...DEFAULT_SETTINGS, operations: [] }), /operation/)
  assert.match(validateSettings({ ...DEFAULT_SETTINGS, operations: ['unknown'] }), /operation/)
  for (const addition of [['', 10, 2, 10], [10, 2, 2, 10], [-1, 10, 2, 10], [1.5, 10, 2, 10], [2, Infinity, 2, 10]]) {
    assert.ok(validateSettings(settingsFor('addition', { addition })))
  }
  assert.ok(validateSettings(settingsFor('division', { multiplication: [0, 12, 2, 100] })))
  assert.ok(validateSettings({ ...DEFAULT_SETTINGS, duration: 0 }))
  assert.equal(sessionReducer(initialSession, { type: 'start', settings: { ...DEFAULT_SETTINGS, operations: [] }, now: 0 }), initialSession)
})

test('inactive ranges do not block valid operations', () => {
  assert.equal(validateSettings(settingsFor('subtraction', { multiplication: ['', '', '', ''] })), '')
  assert.equal(validateSettings(settingsFor('division', { addition: ['', '', '', ''] })), '')
})

test('each operation uses inclusive range endpoints and inverse arithmetic', () => {
  const expected = {
    addition: [[2, 2, 4], [100, 100, 200]],
    subtraction: [[4, 2, 2], [200, 100, 100]],
    multiplication: [[2, 2, 4], [12, 100, 1200]],
    division: [[4, 2, 2], [1200, 100, 12]],
  }
  for (const { id } of OPERATIONS) {
    for (const [index, random] of [() => 0, () => 0.999999].entries()) {
      const question = createQuestion(settingsFor(id), random)
      assert.equal(question.operation, id)
      assert.deepEqual([question.left, question.right, question.answer], expected[id][index])
    }
  }
})

test('generated subtraction is non-negative and division is exact with nonzero divisors', () => {
  for (let i = 0; i < 1000; i++) {
    const subtraction = createQuestion(settingsFor('subtraction'))
    assert.equal(subtraction.left - subtraction.right, subtraction.answer)
    assert.ok(subtraction.answer >= 0)
    const division = createQuestion(settingsFor('division'))
    assert.ok(division.right > 0)
    assert.equal(division.left / division.right, division.answer)
    assert.ok(Number.isInteger(division.answer))
  }
})

test('answers must be nonempty whole numbers, including a valid zero', () => {
  assert.ok(isCorrectAnswer('12', 12))
  assert.ok(isCorrectAnswer('0', 0))
  for (const value of ['', ' ', '12e0', '12.0', '12x', '13', '-12']) assert.equal(isCorrectAnswer(value, 12), false)
  assert.equal(isCorrectAnswer('', 0), false)
})

test('rounds auto-score correct answers, retain incomplete answers, and track skips and streaks', () => {
  let state = sessionReducer(initialSession, { type: 'start', settings: DEFAULT_SETTINGS, now: 1000 })
  assert.equal(state.phase, 'playing')
  assert.equal(state.deadline, 121000)
  state = { ...state, question: { left: 5, right: 7, answer: 12, symbol: '+', operation: 'addition' } }
  state = sessionReducer(state, { type: 'answer', value: '1', now: 1500 })
  assert.equal(state.score, 0)
  assert.equal(state.answer, '1')
  state = sessionReducer(state, { type: 'answer', value: '12', now: 2000 })
  assert.equal(state.score, 1)
  assert.equal(state.streak, 1)
  assert.equal(state.bestStreak, 1)
  assert.equal(state.answer, '')
  state = sessionReducer(state, { type: 'skip', now: 2500 })
  assert.equal(state.skipped, 1)
  assert.equal(state.streak, 0)
  assert.equal(state.bestStreak, 1)
  assert.equal(state.score, 1)
})

test('deadline blocks late answers even before the timer callback runs', () => {
  const started = sessionReducer(initialSession, { type: 'start', settings: DEFAULT_SETTINGS, now: 0 })
  for (const type of ['answer', 'skip', 'tick', 'end']) {
    const ended = sessionReducer(started, { type, value: String(started.question.answer), now: 120000 })
    assert.equal(ended.phase, 'results')
    assert.equal(ended.score, 0)
    assert.equal(ended.skipped, 0)
    assert.equal(ended.remaining, 0)
    assert.equal(ended.endedAt, 120000)
    assert.equal(ended.endedEarly, false)
    assert.equal(sessionReducer(ended, { type: 'answer', value: '12', now: 121000 }), ended)
  }
})

test('early finish records elapsed time and replay resets the round', () => {
  let state = sessionReducer(initialSession, { type: 'start', settings: DEFAULT_SETTINGS, now: 1000 })
  state = sessionReducer(state, { type: 'tick', now: 2200 })
  assert.equal(state.remaining, 119)
  state = sessionReducer(state, { type: 'end', now: 4000 })
  assert.equal(state.endedAt - state.startedAt, 3000)
  assert.equal(state.endedEarly, true)
  state = sessionReducer(state, { type: 'start', settings: DEFAULT_SETTINGS, now: 5000 })
  assert.equal(state.score, 0)
  assert.equal(state.remaining, 120)
  assert.equal(state.deadline, 125000)
  assert.equal(sessionReducer(state, { type: 'setup' }).phase, 'setup')
})

test('personal bests distinguish difficulty and duration, but ignore operation ordering and inactive ranges', () => {
  const key = bestScoreKey(DEFAULT_SETTINGS)
  assert.equal(bestScoreKey({ ...DEFAULT_SETTINGS, operations: [...DEFAULT_SETTINGS.operations].reverse() }), key)
  assert.notEqual(bestScoreKey({ ...DEFAULT_SETTINGS, duration: 60 }), key)
  assert.notEqual(bestScoreKey({ ...DEFAULT_SETTINGS, addition: [2, 50, 2, 50] }), key)
  assert.equal(bestScoreKey(settingsFor('addition')), bestScoreKey(settingsFor('addition', { multiplication: [1, 5, 1, 5] })))
})
