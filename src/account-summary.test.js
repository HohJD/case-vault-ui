import test from 'node:test'
import assert from 'node:assert/strict'
import { NAMESPACE_ORDER, relativeTime, summarizeNamespace } from './account-summary.js'
import { CASES } from './casebook.js'
import { CASE_MATH_LESSONS } from './case-maths.js'

const DAY = 86400000
const now = new Date(2026, 9, 2, 15, 0, 0).getTime() // a Friday

const validAttempt = { format: 2, entries: [{ submitted: true }, { submitted: true }, { submitted: true }, { submitted: true }, { submitted: true }] }

test('full cases summary counts mastery, drafts and recalls due', () => {
  const data = {
    version: 2, timed: false,
    drafts: { 'some-draft': { stage: 1 } },
    records: Object.fromEntries(CASES.slice(0, 4).map((item, index) => [item.id, {
      attempts: 3, level: index === 0 ? 3 : 1, completedAt: now - DAY, dueAt: index === 1 ? now - 1000 : now + DAY,
      lastAttempt: { ...validAttempt, id: `a${index}` }, summary: { missedSkills: [] },
    }])),
  }
  const { label, lines } = summarizeNamespace('case-prep-cases-v2', data, now)
  assert.equal(label, 'Full cases')
  assert.match(lines[0], new RegExp(`^1 of ${CASES.length} mastered · 4 practised$`))
  assert.ok(lines.includes('1 paused draft'))
  assert.ok(lines.includes('1 recall due'))
})

test('framework drills summary uses spaced recall stats', () => {
  const data = {
    version: 1,
    records: { 'framing/objective': { attempts: 3, correctCount: 2, assistedCount: 0, level: 2, dueAt: now - 1, lastAnsweredAt: now - DAY, lastCountedAt: now - DAY, lastVariant: 0, successfulVariants: [0, 1] } },
    session: null,
  }
  const { label, lines } = summarizeNamespace('case-prep-frameworks-v1', data, now)
  assert.equal(label, 'Framework drills')
  assert.match(lines[0], /^1 of 42 drills on spaced recall$/)
  assert.ok(lines.includes('1 due'))
})

test('case maths summary counts completed lessons and unfinished practice', () => {
  const data = {
    version: 1,
    records: Object.fromEntries(CASE_MATH_LESSONS.slice(0, 2).map(lesson => [lesson.id, { started: 3, completed: 2, last: null }])),
    session: { lessonId: CASE_MATH_LESSONS[0].id, variant: 0, index: 1, finished: false, cards: [] },
  }
  const { label, lines } = summarizeNamespace('case-prep-case-maths-v1', data, now)
  assert.equal(label, 'Case maths')
  assert.match(lines[0], new RegExp(`^2 of ${CASE_MATH_LESSONS.length} lessons completed$`))
  assert.ok(lines.includes('Unfinished practice saved'))
})

test('cards summary uses deck stats', () => {
  const data = {
    version: 1, settings: { shuffle: false, againMinutes: 1 },
    records: { mece: { level: 3, dueAt: now + DAY, seen: 5, correct: 4 }, 'issue-tree': { level: 1, dueAt: now - 1, seen: 2, correct: 1 } },
  }
  const { label, lines } = summarizeNamespace('case-prep-flashcards-v1', data, now)
  assert.equal(label, 'Cards')
  assert.match(lines[0], /of \d+ cards mastered$/)
  assert.ok(lines[0].startsWith('1 of '))
  assert.ok(lines.includes('1 due'))
})

test('plan summary reports this week and the streak', () => {
  const dayKey = time => {
    const date = new Date(time)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }
  const data = {
    version: 1, targets: { cases: 3, drills: 10, cards: 30 },
    log: { [dayKey(now)]: { cases: 2, cards: 5 }, [dayKey(now - DAY)]: { drills: 3 }, [dayKey(now - 10 * DAY)]: { cases: 9 } },
  }
  const { label, lines } = summarizeNamespace('case-prep-plan-v1', data, now)
  assert.equal(label, 'This week')
  assert.match(lines[0], /cases · 3 drills · 5 cards this week$/)
  assert.ok(lines.includes('2-day streak'))
})

test('malformed or empty data degrades to "Nothing saved yet."', () => {
  for (const ns of NAMESPACE_ORDER) {
    for (const data of [null, undefined, 'junk', 42, [], { records: 'nope' }]) {
      const { label, lines } = summarizeNamespace(ns, data, now)
      assert.equal(lines[0], 'Nothing saved yet.', `${ns} ${JSON.stringify(data)}`)
      assert.equal(typeof label, 'string')
    }
  }
  assert.deepEqual(NAMESPACE_ORDER, ['case-prep-cases-v2', 'case-prep-frameworks-v1', 'case-prep-case-maths-v1', 'case-prep-flashcards-v1', 'case-prep-industries-v1', 'case-prep-interview-v1', 'case-prep-plan-v1'])
})

test('relativeTime covers now, minutes, hours, days and dates', () => {
  assert.equal(relativeTime(now - 10000, now), 'just now')
  assert.equal(relativeTime(now - 3 * 60000, now), '3 minutes ago')
  assert.equal(relativeTime(now - 2 * 3600000, now), '2 hours ago')
  assert.equal(relativeTime(now - DAY - 3600000, now), 'yesterday')
  assert.equal(relativeTime(now - 5 * DAY, now), '5 days ago')
  assert.equal(relativeTime(now - 20 * DAY, now), new Date(now - 20 * DAY).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }))
})
