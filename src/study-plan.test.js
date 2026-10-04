import test from 'node:test'
import assert from 'node:assert/strict'
import { STUDY_PLAN_KEY, loadStudyPlan, recordActivity, saveStudyPlan, setTarget, streak, subscribeStudyPlan, weekProgress, weekStart } from './study-plan.js'

const DAY = 86400000
const memory = () => {
  const data = new Map()
  return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
}
const blocked = () => ({ getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } })
// A fixed Wednesday so week boundaries are unambiguous.
const wednesday = new Date(2026, 8, 30, 12, 0, 0).getTime()
const at = (base, days, hours = 12, minutes = 0) => {
  const date = new Date(base)
  date.setDate(date.getDate() + days)
  date.setHours(hours, minutes, 0, 0)
  return date.getTime()
}

test('empty plan carries default weekly targets', () => {
  const plan = loadStudyPlan(memory())
  assert.deepEqual(plan.targets, { cases: 3, drills: 10, cards: 30 })
  assert.deepEqual(plan.log, {})
})

test('weeks start on local Monday: Sunday night and Monday morning land in different weeks', () => {
  const plan = loadStudyPlan(memory())
  const monday = weekStart(wednesday)
  assert.equal(new Date(monday).getDay(), 1)
  const sundayNight = monday - 60000 // Sunday 23:59 local
  assert.equal(new Date(sundayNight).getDay(), 0)
  const before = weekProgress({ ...plan, log: { [key(sundayNight)]: { cases: 2 } } }, monday + DAY)
  assert.equal(before.cases.done, 0)
  const mondayMorning = monday + 60000
  const after = weekProgress({ ...plan, log: { [key(sundayNight)]: { cases: 2 }, [key(mondayMorning)]: { cases: 1 } } }, monday + DAY)
  assert.equal(after.cases.done, 1)
})

test('weekly progress sums from Monday to now and ignores earlier days', () => {
  const plan = loadStudyPlan(memory())
  const monday = weekStart(wednesday)
  plan.log[key(monday)] = { cases: 1, drills: 4 }
  plan.log[key(wednesday)] = { cases: 2, cards: 10, maths: 1 }
  plan.log[key(monday - DAY)] = { cases: 9 }
  const week = weekProgress(plan, wednesday)
  assert.deepEqual(week.cases, { done: 3, target: 3 })
  assert.deepEqual(week.drills, { done: 4, target: 10 })
  assert.deepEqual(week.cards, { done: 10, target: 30 })
  assert.deepEqual(week.maths, { done: 1 })
})

test('streak counts consecutive days ending today or yesterday', () => {
  const plan = loadStudyPlan(memory())
  const day = offset => key(wednesday + offset * DAY)
  assert.equal(streak(plan, wednesday), 0)
  plan.log[day(-1)] = { cards: 3 }
  assert.equal(streak(plan, wednesday), 1)
  plan.log[day(0)] = { drills: 1 }
  assert.equal(streak(plan, wednesday), 2)
  plan.log[day(-2)] = { cases: 1 }
  plan.log[day(-4)] = { cases: 1 }
  assert.equal(streak(plan, wednesday), 3)
})

test('log entries older than 90 days are pruned on load', () => {
  const storage = memory()
  saveStudyPlan({ version: 1, targets: { cases: 3, drills: 10, cards: 30 }, log: { [key(wednesday - 91 * DAY)]: { cases: 5 }, [key(wednesday - 89 * DAY)]: { cases: 2 } } }, storage)
  const plan = loadStudyPlan(storage, wednesday)
  assert.equal(Object.keys(plan.log).length, 1)
  assert.deepEqual(Object.values(plan.log)[0], { cases: 2 })
})

test('targets clamp to their bounds and setTarget rejects non-target kinds', () => {
  const storage = memory()
  saveStudyPlan({ version: 1, targets: { cases: 500, drills: 0, cards: 999 }, log: {} }, storage)
  assert.deepEqual(loadStudyPlan(storage).targets, { cases: 50, drills: 1, cards: 200 })
  const plan = loadStudyPlan(memory())
  assert.equal(setTarget(plan, 'cases', 0).targets.cases, 1)
  assert.equal(setTarget(plan, 'drills', 500).targets.drills, 100)
  assert.equal(setTarget(plan, 'maths', 5).targets.maths, undefined)
  assert.equal(setTarget(plan, 'cases', 2.5).targets.cases, 3)
})

test('malformed or foreign storage falls back to an empty plan', () => {
  for (const raw of ['not json', '{"version":2}', '{"version":1,"targets":"x","log":[]}', '4']) {
    const storage = memory()
    storage.setItem(STUDY_PLAN_KEY, raw)
    const plan = loadStudyPlan(storage)
    assert.equal(plan.version, 1)
    assert.equal(plan.targets.cases, 3)
    assert.deepEqual(plan.log, {})
  }
  const storage = memory()
  storage.setItem(STUDY_PLAN_KEY, JSON.stringify({ version: 1, targets: {}, log: { 'oops': { cases: 1 }, '2026-09-30': { cases: 1.5, rockets: 9, cards: 2 } } }))
  const plan = loadStudyPlan(storage, wednesday)
  assert.deepEqual(plan.log, { '2026-09-30': { cards: 2 } })
})

test('recording only writes the plan key, never other storage keys', () => {
  const storage = memory()
  storage.setItem('case-prep-cases-v1', 'sentinel')
  recordActivity('cases', 1, { now: wednesday, storage })
  recordActivity('drills', 2, { now: wednesday, storage })
  recordActivity('cards', 5, { now: wednesday, storage })
  recordActivity('maths', 1, { now: wednesday, storage })
  assert.equal(storage.getItem('case-prep-cases-v1'), 'sentinel')
  assert.deepEqual([...storage.data.keys()].sort(), ['case-prep-cases-v1', STUDY_PLAN_KEY].sort())
  const week = weekProgress(loadStudyPlan(storage, wednesday), wednesday)
  assert.deepEqual([week.cases.done, week.drills.done, week.cards.done, week.maths.done], [1, 2, 5, 1])
})

test('blocked storage never throws and the in-memory copy keeps the session', () => {
  const storage = blocked()
  assert.doesNotThrow(() => recordActivity('cases', 1, { now: wednesday, storage }))
  assert.doesNotThrow(() => recordActivity('drills', 1, { now: wednesday, storage }))
  const plan = loadStudyPlan(storage, wednesday)
  const key = keyAt(wednesday)
  assert.equal(plan.log[key].cases, 1)
  assert.equal(plan.log[key].drills, 1)
  assert.equal(streak(plan, wednesday), 1)
})

test('subscribers are notified when activity is recorded', () => {
  const storage = memory()
  let calls = 0
  const unsubscribe = subscribeStudyPlan(() => { calls += 1 })
  recordActivity('cards', 1, { now: wednesday, storage })
  unsubscribe()
  recordActivity('cards', 1, { now: wednesday, storage })
  assert.equal(calls, 1)
})

test('unknown kinds, non-integers and non-positive counts are ignored', () => {
  const storage = memory()
  recordActivity('reading', 1, { now: wednesday, storage })
  recordActivity('cases', 0, { now: wednesday, storage })
  recordActivity('cases', 1.5, { now: wednesday, storage })
  assert.equal(storage.getItem(STUDY_PLAN_KEY), null)
})

function key(time) {
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const keyAt = key
