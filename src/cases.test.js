import test from 'node:test'
import assert from 'node:assert/strict'
import { CASES, LEGACY_CASES, STAGES } from './casebook.js'
import { CASE_RECALL } from './case-recall.js'
import deployment from '../vercel.json' with { type: 'json' }
import { CASE_PROGRESS_KEY, LEGACY_CASE_PROGRESS_KEY, answerLabel, attemptStep, canSubmitStep, caseProgressReducer, caseStatus, caseSummary, checkCaseAnswer, createCaseAttempt, decisionPoints, dueCases, loadCaseProgress, nextCase, parseCaseNumber, saveCaseProgress, winningPath } from './case-practice.js'

const item = CASES[0]
const start = (state = loadCaseProgress(), caseId = item.id) => caseProgressReducer(state, { type: 'start', caseId, options: { now: 0, id: 'test-attempt', random: () => .5 } })
const act = (state, type, extra = {}) => caseProgressReducer(state, { type, caseId: item.id, ...extra })
const memory = () => {
  const data = new Map()
  return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
}

function finish({ wrong = false, hint = false, previous, now = 1000 } = {}) {
  let state = start(previous)
  for (let stage = 0; stage < item.steps.length; stage++) {
    state = act(state, 'stage', { stage })
    const step = item.steps[stage]
    if (state.drafts[item.id].entries[stage].submitted) continue
    if (step.kind === 'select') for (const id of step.correct) state = act(state, 'select', { id })
    else if (step.kind === 'build') for (const part of step.parts) state = act(state, 'pick', { part: part.id, answer: part.correct })
    else {
      if (step.kind === 'calculation') state = act(state, 'reveal')
      const answer = wrong && stage === 0 ? step.options.find(option => option.id !== step.correct).id : step.options.find(option => checkCaseAnswer(step, option.id)).id
      state = act(state, 'answer', { answer })
    }
    if (hint && stage === 0) state = act(state, 'hint')
    state = act(state, 'submit')
  }
  return act(state, 'complete', { now })
}

function oldAttempt({ stage = 4, completed = true, id = 'old-attempt' } = {}) {
  const old = LEGACY_CASES[0]
  return { id, caseId: old.id, stage, startedAt: 0, entries: old.steps.map((step, index) => ({
    answer: index <= stage ? step.kind === 'choice' ? step.correct : step.kind === 'number' ? String(step.answer) : `My original written response ${index}` : '',
    submitted: completed || index < stage,
    hinted: false, elapsed: 2, self: step.kind === 'reflection' && (completed || index < stage) ? [0, 1] : [],
    order: step.kind === 'choice' ? step.options.map(option => option.id) : [],
  })) }
}

function legacyStore({ draft = null, record = true } = {}) {
  return { version: 1, timed: true, drafts: draft ? { [item.id]: draft } : {}, records: record ? { [item.id]: { attempts: 2, level: 2, completedAt: 100, dueAt: 700, summary: {}, lastAttempt: oldAttempt() } } : {} }
}

test('Vercel supports direct loads of the app routes', () => {
  for (const source of ['/brain', '/cases', '/cards', '/mental', '/about']) assert.equal(deployment.rewrites.find(route => route.source === source)?.destination, '/index.html')
  assert.ok(!deployment.redirects?.some(route => route.source === '/'))
})

test('every case provides a complete no-typing exercise and case-specific feedback', () => {
  assert.equal(CASES.length, 58)
  assert.equal(new Set(CASES.map(item => item.id)).size, CASES.length)
  for (const item of CASES) {
    assert.ok(item.pages && item.sourceNote && item.brief)
    assert.deepEqual(item.steps.map(step => step.kind), ['choice', 'select', 'calculation', 'choice', 'build'])
    assert.equal(item.steps.length, STAGES.length)
    for (const step of item.steps) {
      assert.ok(step.prompt && step.hint)
      for (const options of step.kind === 'build' ? step.parts.map(part => part.options) : [step.options]) {
        assert.equal(new Set(options.map(option => option.id)).size, options.length)
        assert.ok(options.every(option => option.label && option.feedback))
      }
      if (step.kind === 'choice') assert.equal(step.options.filter(option => option.id === step.correct).length, 1)
      if (step.kind === 'select') assert.equal(step.correct.length, step.required)
      if (step.kind === 'build') {
        assert.deepEqual(step.parts.map(part => part.id), ['action', 'evidence', 'risk'])
        assert.ok(step.parts.every(part => part.options.some(option => option.id === part.correct)))
      }
      if (step.kind === 'calculation') assert.equal(step.options.filter(option => checkCaseAnswer(step, option.id)).length, 1)
    }
    assert.equal(caseSummary(item, createCaseAttempt(item)).total, 8)
  }
})

test('calculation choices agree with independently checked exercise assumptions', () => {
  assert.deepEqual(CASES.map(item => Math.round(item.steps[2].answer * 1e6) / 1e6), [(1 - 1.5 / 2) * 100, (16 + 2 - 10) / 1.5, 4000 / ((500 + 2 * 200) * 2), Math.floor((480 - 60) / (45 + 5)) * 80, ((3000 / 120 - 2850 / 150) / (3000 / 120)) * 100, 200 * 4 * (250 + .5 * 150 + .5 * 50),
    (50 - 10) / 50 * 100, 10000 * .5 + 200000 * .01, (1600000 + 200000 + 400000 + 100000 + 60 * 75 * 8 * 25) / (8 * 4 * 25), 20 * 1.05 / (100 * 1.1) * 100, (72 - 36) / 36 * 100, 500 * 1000000 * .03 + 300 * 2000 * .4 + 300 * 6000 - 2500000,
    100000 * (17400 - 14000) / 1e6, 150e5 * .4 * .2 * .75 * (8 * 3 * 90) / 1e6, 250e7 * 1.1 / (1000 * 2000), 1800 / 2000 * 100, ((1.25 * .8 - .5) * 2 * 3 + (600 / 30) * 10 * .015 + 1 - 1) / 1.2, 600 * .5 * .3 * .8 * 5 * 12,
    5e7 / 250, (60 - 45) / 60 * 100, (6 - 4) / .4, 52.5 * .6 * .5 + 52.5 * .4 * .3 + 42 * .25 * .4 + 42 * .15 * .2, 350 / .75, .8 * 40 * 20 + 160,
    20 * (.4 - .15), (5000 * .1 * .8 * .05 - 5) / (.2 - .15) * 10, .7 * .4 * 100, 10 * 30000 * .25 * .4 / 3 * 2 * .5, (1 - (4 / 36) / (2.5 / 18)) * 100, (30 + 4) * 1.5,
    99e3 * 6500 / 1e6, 500 * (.05 - .02), 60000 * (.7 * .25 + .5 * .2), 32.8 + 43.5 + 2000 * .25 * .1 + 2 * 2000 * .1 * .1, 900 / 2, 18 * 22 + .15 * 420,
    .75e5 * 1200 * 24 / 1e6, 10000 / 30, 250 * .8, 4.62e6 * 4 / 60 * .6 * 400 / 1e6, 408 / 60, 80e3 * 200 * .05 / 1e3,
    (3 * 1375 + 4500) * 40 * 365 / 1e6, (300 * 5 * 20000 * .7 / .1 / 150e6 - 1) * 100, 1.5e9 / (10e9 * .1 * .5),
    ((1200 * 36 + 6400 * 16 + 32400 * 4) * 360 / 1e6 - 24) * 20 - 100, 795e6 * .05 / 1e6 - 50000 * 12 * 200 / 1e6, 2280000 / 10000,
    650 * 180 * .8 * 365 / 1e6, 3000 / (360 * 23 - 230 * 33), 95 * 1.1 - 83.5 - 2,
    200 * .15, 140 / .1, 2e6 * .9 / 9 * 300 * .5 / 1e6,
    50 - 34 - 2, 3459400 / 6175400 * 100,
    2.4 / (1.8 - 1.2), 27 + 13.5 + 6 + 15 + 15 + 3 + 18 + 15].map(value => Math.round(value * 1e6) / 1e6))
  assert.ok(checkCaseAnswer(CASES[1].steps[2], 'incremental'))
  assert.ok(checkCaseAnswer(CASES[2].steps[2], 'full-cost'))
  assert.equal(checkCaseAnswer(CASES[2].steps[2], 'rounded'), false)
  assert.equal(checkCaseAnswer(CASES[3].steps[2], 'fractional'), false)
})

test('legacy numerical answers remain readable and are not mistaken for tap selections', () => {
  for (const [input, value] of [['25', 25], ['2.22', 2.22], ['280,000', 280000], ['2,80,000', 280000], [' .5 ', .5], ['-1', -1]]) assert.equal(parseCaseNumber(input), value)
  for (const input of ['', ' ', '1,2', '$25', '25%', 'Infinity', '1e3', '2.2.2', null]) assert.equal(parseCaseNumber(input), null)
  assert.ok(checkCaseAnswer(LEGACY_CASES[2].steps[2], '2.22'))
  assert.equal(checkCaseAnswer(CASES[2].steps[2], '2.22'), false)
})

test('first answers are locked and future stages cannot be skipped', () => {
  let state = start()
  assert.equal(act(state, 'stage', { stage: 4 }), state)
  assert.equal(act(state, 'submit'), state)
  assert.equal(act(state, 'answer', { answer: 'arbitrary text' }), state)
  const wrong = item.steps[0].options.find(option => option.id !== item.steps[0].correct).id
  state = act(act(state, 'answer', { answer: wrong }), 'submit')
  assert.equal(act(state, 'answer', { answer: item.steps[0].correct }), state)
  assert.equal(caseSummary(item, state.drafts[item.id]).correct, 0)
  assert.equal(act(state, 'complete'), state)
  state = act(state, 'stage', { stage: 1 })
  assert.equal(state.drafts[item.id].stage, 1)
})

test('priority selection requires exactly two, supports changes, and gives granular feedback', () => {
  let state = start()
  state = act(act(state, 'answer', { answer: item.steps[0].correct }), 'submit')
  state = act(state, 'stage', { stage: 1 })
  const step = item.steps[1]
  state = act(state, 'select', { id: step.correct[0] })
  assert.equal(canSubmitStep(step, state.drafts[item.id].entries[1]), false)
  const wrong = step.options.find(option => !step.correct.includes(option.id)).id
  state = act(state, 'select', { id: wrong })
  assert.ok(canSubmitStep(step, state.drafts[item.id].entries[1]))
  assert.equal(act(state, 'select', { id: step.correct[1] }), state)
  assert.equal(decisionPoints(step, state.drafts[item.id].entries[1].answer), 1)
  state = act(state, 'submit')
  assert.equal(act(state, 'select', { id: wrong }), state)
  assert.deepEqual(caseSummary(item, state.drafts[item.id]).missedSkills, ['Structure'])
})

test('calculations require revealing choices and cannot accept typed numbers', () => {
  let state = finish()
  state = start(state)
  const draft = state.drafts[item.id]
  draft.stage = 2
  const step = item.steps[2]
  const correct = step.options.find(option => checkCaseAnswer(step, option.id)).id
  assert.equal(act(state, 'answer', { answer: correct }), state)
  assert.equal(canSubmitStep(step, { ...draft.entries[2], answer: correct }), false)
  state = act(state, 'reveal')
  assert.equal(act(state, 'answer', { answer: '25' }), state)
  state = act(state, 'answer', { answer: correct })
  assert.ok(canSubmitStep(step, state.drafts[item.id].entries[2]))
})

test('recommendations require all three parts and score each part separately', () => {
  let state = start()
  state.drafts[item.id].stage = 4
  const step = item.steps[4]
  assert.equal(act(state, 'part', { part: 2 }), state)
  state = act(state, 'pick', { part: 'action', answer: step.parts[0].correct })
  state = act(state, 'part', { part: 1 })
  assert.equal(state.drafts[item.id].entries[4].part, 1)
  assert.equal(canSubmitStep(step, state.drafts[item.id].entries[4]), false)
  const badEvidence = step.parts[1].options.find(option => option.id !== step.parts[1].correct).id
  state = act(state, 'pick', { part: 'evidence', answer: badEvidence })
  state = act(state, 'part', { part: 2 })
  state = act(state, 'pick', { part: 'risk', answer: step.parts[2].correct })
  assert.ok(canSubmitStep(step, state.drafts[item.id].entries[4]))
  assert.equal(decisionPoints(step, state.drafts[item.id].entries[4].answer), 2)
  state = act(state, 'submit')
  assert.equal(act(state, 'pick', { part: 'evidence', answer: step.parts[1].correct }), state)
  assert.match(answerLabel(step, state.drafts[item.id].entries[4].answer), /Action:/)
})

test('review scheduling uses checked decisions and hints, never self-ticked ratings', () => {
  const strong = finish()
  assert.equal(strong.records[item.id].summary.correct, 8)
  assert.equal(strong.records[item.id].summary.total, 8)
  assert.equal(strong.records[item.id].summary.selfTotal, 0)
  assert.equal(strong.records[item.id].dueAt, 1000 + 3 * 86400000)
  const onTime = finish({ previous: strong, now: strong.records[item.id].dueAt })
  assert.equal(onTime.records[item.id].level, 2)
  assert.equal(onTime.records[item.id].dueAt, strong.records[item.id].dueAt + 7 * 86400000)
  for (const options of [{ wrong: true }, { hint: true }]) assert.equal(finish(options).records[item.id].dueAt, 1000 + 86400000)
  assert.equal(dueCases(strong, 1000).length, 0)
  assert.equal(dueCases(strong, 1000 + 3 * 86400000)[0].id, item.id)
  assert.equal(act(strong, 'complete'), strong)
})

test('tap drafts and completed attempts round-trip without reshuffling', () => {
  const storage = memory()
  let state = start()
  state = act(state, 'answer', { answer: item.steps[0].correct })
  assert.equal(start(state), state)
  assert.ok(saveCaseProgress(state, storage))
  assert.deepEqual(loadCaseProgress(storage), state)
  const completed = finish()
  assert.ok(saveCaseProgress(completed, storage))
  assert.deepEqual(loadCaseProgress(storage), completed)
  storage.setItem(CASE_PROGRESS_KEY, '{broken')
  assert.deepEqual(loadCaseProgress(storage).drafts, {})
  assert.equal(saveCaseProgress(completed, { setItem: () => { throw Error('Blocked') } }), false)
})

test('unsubmitted legacy writing is retained as a read-only draft, with old storage untouched', () => {
  const storage = memory()
  const original = legacyStore({ draft: oldAttempt({ stage: 1, completed: false }), record: false })
  storage.setItem(LEGACY_CASE_PROGRESS_KEY, JSON.stringify(original))
  const state = loadCaseProgress(storage)
  const migrated = state.drafts[item.id]
  assert.equal(state.version, 2)
  assert.equal(migrated.format, 2)
  assert.equal(migrated.stage, 1)
  assert.equal(migrated.entries[0].submitted, true)
  assert.equal(migrated.entries[1].previousDraft, 'My original written response 1')
  assert.deepEqual(migrated.entries[1].answer, [])
  saveCaseProgress(state, storage)
  assert.deepEqual(JSON.parse(storage.getItem(LEGACY_CASE_PROGRESS_KEY)), original)
  assert.deepEqual(loadCaseProgress(storage), state)
})

test('submitted legacy responses retain their meaning and are never regraded as new decisions', () => {
  const storage = memory()
  storage.setItem(LEGACY_CASE_PROGRESS_KEY, JSON.stringify(legacyStore({ draft: oldAttempt({ stage: 3, completed: false }) })))
  const state = loadCaseProgress(storage)
  const draft = state.drafts[item.id]
  assert.equal(attemptStep(item, draft, 1).kind, 'reflection')
  assert.equal(checkCaseAnswer(attemptStep(item, draft, 1), draft.entries[1].legacy.answer), null)
  assert.equal(attemptStep(item, draft, 2).kind, 'number')
  assert.equal(draft.entries[2].legacy.answer, '25')
  assert.equal(state.records[item.id].lastAttempt.format, 1)
  assert.equal(state.records[item.id].summary.correct, 3)
  assert.equal(state.records[item.id].summary.total, 3)
  assert.equal(state.records[item.id].summary.legacyWritten, 2)
  assert.equal(state.records[item.id].dueAt, 700)
  assert.equal(state.records[item.id].attempts, 2)
  saveCaseProgress(state, storage)
  assert.deepEqual(loadCaseProgress(storage), state)
})

test('a new completed attempt keeps the prior written review accessible', () => {
  const storage = memory()
  storage.setItem(LEGACY_CASE_PROGRESS_KEY, JSON.stringify(legacyStore()))
  const migrated = loadCaseProgress(storage)
  const next = finish({ previous: migrated })
  assert.equal(next.records[item.id].attempts, 3)
  assert.equal(next.records[item.id].summary.total, 8)
  assert.equal(next.records[item.id].legacyReviews[0].lastAttempt.entries[1].answer, 'My original written response 1')
  assert.equal(next.records[item.id].legacyReviews[0].summary.total, 3)
  assert.equal(next.records[item.id].level, 1)
  saveCaseProgress(next, storage)
  assert.deepEqual(loadCaseProgress(storage), next)
})

test('mixed migrated drafts can finish with their original submitted work preserved', () => {
  const storage = memory()
  storage.setItem(LEGACY_CASE_PROGRESS_KEY, JSON.stringify(legacyStore({ draft: oldAttempt({ stage: 3, completed: false }), record: false })))
  const completed = finish({ previous: loadCaseProgress(storage) })
  const record = completed.records[item.id]
  assert.equal(record.summary.total, 6)
  assert.equal(record.summary.legacyWritten, 1)
  assert.equal(record.lastAttempt.entries[1].legacy.answer, 'My original written response 1')
  assert.equal(record.level, 0)
  saveCaseProgress(completed, storage)
  assert.deepEqual(loadCaseProgress(storage), completed)
})

test('both an older completed review and a newer written draft survive subsequent replays', () => {
  for (const stage of [1, 3]) {
    const storage = memory()
    const original = legacyStore({ draft: oldAttempt({ stage, completed: false, id: 'old-draft' }) })
    storage.setItem(LEGACY_CASE_PROGRESS_KEY, JSON.stringify(original))
    const first = finish({ previous: loadCaseProgress(storage) })
    const second = finish({ previous: first })
    assert.equal(second.records[item.id].legacyReviews.length, 2)
    assert.equal(second.records[item.id].legacyReviews[0].lastAttempt.id, 'old-attempt')
    const keptDraft = second.records[item.id].legacyReviews[1].lastAttempt
    assert.equal(keptDraft.id, 'old-draft')
    assert.equal(stage === 1 ? keptDraft.entries[1].previousDraft : keptDraft.entries[1].legacy.answer, 'My original written response 1')
    saveCaseProgress(second, storage)
    assert.deepEqual(loadCaseProgress(storage), second)
    assert.deepEqual(JSON.parse(storage.getItem(LEGACY_CASE_PROGRESS_KEY)), original)
  }
})

test('corrupt stored choices cannot break the screen or discard other valid cases', () => {
  const storage = memory()
  let state = start()
  state = start(state, CASES[1].id)
  state.drafts[item.id].entries[0].order = ['unknown']
  saveCaseProgress(state, storage)
  const loaded = loadCaseProgress(storage)
  assert.equal(loaded.drafts[item.id], undefined)
  assert.ok(loaded.drafts[CASES[1].id])
})

test('pacing remains optional and stops on submitted prompts', () => {
  let state = start()
  assert.equal(act(state, 'tick', { stage: 0, seconds: 5 }), state)
  state = caseProgressReducer(state, { type: 'timer', enabled: true })
  state = act(state, 'tick', { stage: 0, seconds: 5 })
  assert.equal(state.drafts[item.id].entries[0].elapsed, 5)
  assert.equal(act(state, 'tick', { stage: 1, seconds: 10 }), state)
  state = act(act(state, 'answer', { answer: item.steps[0].correct }), 'submit')
  assert.equal(act(state, 'tick', { stage: 0, seconds: 10 }), state)
})

test('all answer and recommendation orders are valid permutations', () => {
  const attempt = createCaseAttempt(item, { random: () => 0, now: 0, id: 'fixed' })
  for (const [index, step] of item.steps.entries()) {
    if (step.options) assert.deepEqual([...attempt.entries[index].order].sort(), step.options.map(option => option.id).sort())
    if (step.parts) for (const part of step.parts) assert.deepEqual([...attempt.entries[index].partOrder[part.id]].sort(), part.options.map(option => option.id).sort())
  }
  assert.notDeepEqual(attempt.entries[0].order, item.steps[0].options.map(option => option.id))
})

test('clean replays before the recall date do not inflate mastery; mistakes still reset it', () => {
  const day = 86400000
  const first = finish()
  const early = finish({ previous: first, now: 2000 })
  assert.equal(early.records[item.id].level, 1)
  assert.equal(early.records[item.id].dueAt, first.records[item.id].dueAt)
  assert.equal(early.records[item.id].attempts, 2)
  assert.equal(finish({ previous: first, now: 2000, wrong: true }).records[item.id].level, 0)
  let state = first
  for (let run = 0; run < 2; run++) state = finish({ previous: state, now: state.records[item.id].dueAt })
  assert.equal(state.records[item.id].level, 3)
  assert.equal(caseStatus(state, item, state.records[item.id].dueAt - 1), 'mastered')
  assert.equal(caseStatus(state, item, state.records[item.id].dueAt), 'due')
  assert.equal(state.records[item.id].dueAt - state.records[item.id].completedAt, 14 * day)
})

test('the next case prefers drafts, then due recalls, then new cases', () => {
  const empty = loadCaseProgress(memory())
  assert.deepEqual(nextCase(empty, 0), { item: CASES[0], reason: 'new' })
  assert.equal(caseStatus(empty, item, 0), 'new')
  const done = finish()
  assert.deepEqual(nextCase(done, 2000), { item: CASES[1], reason: 'new' })
  assert.equal(caseStatus(done, item, 2000), 'learning')
  assert.deepEqual(nextCase(done, done.records[item.id].dueAt), { item, reason: 'due' })
  const drafted = start(done, CASES[2].id)
  assert.deepEqual(nextCase(drafted, done.records[item.id].dueAt), { item: CASES[2], reason: 'draft' })
  assert.equal(caseStatus(drafted, CASES[2], 0), 'draft')
})

test('every case has a recall card and a fully supported path through all five stages', () => {
  for (const current of CASES) {
    const recall = CASE_RECALL[current.id]
    assert.ok(recall.takeaway && recall.keyNumber && recall.trap && recall.facts.length >= 3, current.id)
    for (const text of [recall.takeaway, recall.keyNumber, recall.trap, ...recall.facts]) assert.doesNotMatch(text, /—/, `${current.id}: avoid em dashes in recall copy`)
    const path = winningPath(current)
    assert.deepEqual(path.map(stage => stage.stage), STAGES)
    assert.deepEqual(path.map(stage => stage.answers.length), [1, 2, 1, 1, 3])
  }
  assert.deepEqual(Object.keys(CASE_RECALL).sort(), CASES.map(current => current.id).sort())
})

test('quick recall only quizzes finished cases, with one right answer per question', async () => {
  const { buildRecallQuiz, QUIZ_MIN_CASES, QUIZ_LENGTH } = await import('./recall-quiz.js')
  assert.deepEqual(buildRecallQuiz(CASES.slice(0, QUIZ_MIN_CASES - 1).map(item => item.id)), [])
  for (let seed = 1; seed <= 50; seed++) {
    let value = seed
    const random = () => (value = (value * 16807) % 2147483647) / 2147483647
    const finished = CASES.filter((_, index) => (index * 7 + seed) % 3 !== 0).slice(0, 3 + seed % 8).map(item => item.id)
    const quiz = buildRecallQuiz(finished, { random })
    assert.equal(quiz.length, QUIZ_LENGTH)
    assert.ok(new Set(quiz.map(question => question.caseId)).size >= Math.min(QUIZ_LENGTH, finished.length))
    for (const question of quiz) {
      assert.ok(finished.includes(question.caseId))
      assert.equal(new Set(question.options.map(option => option.id)).size, question.options.length)
      assert.equal(question.options.filter(option => option.id === question.correct).length, 1)
      assert.ok(question.options.length >= 3 && question.options.every(option => option.label))
      if (['takeaway', 'number', 'trap'].includes(question.kind)) assert.ok(question.options.every(option => finished.includes(option.id)), 'no spoilers from unfinished cases')
    }
  }
})
