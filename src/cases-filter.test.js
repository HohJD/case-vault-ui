import test from 'node:test'
import assert from 'node:assert/strict'
import { CASES } from './casebook.js'
import { filterCases, sortCases } from './cases-filter.js'

const empty = { version: 2, records: {}, drafts: {}, timed: false }

test('search matches title, focus and sector case-insensitively', () => {
  assert.ok(filterCases(CASES, empty, { search: 'PRICING' }).every(item => /pricing/i.test(`${item.title} ${item.focus} ${item.sector}`)))
  assert.ok(filterCases(CASES, empty, { search: 'pricing' }).length > 0)
  assert.equal(filterCases(CASES, empty, { search: 'zzz-no-such-case' }).length, 0)
})

test('each filter applies on its own and combines', () => {
  const category = CASES[0].category
  assert.ok(filterCases(CASES, empty, { category }).every(item => item.category === category))
  assert.ok(filterCases(CASES, empty, { level: 'Advanced' }).every(item => item.level === 'Advanced'))
  assert.ok(filterCases(CASES, empty, { sector: 'Manufacturing' }).every(item => item.sector === 'Manufacturing'))
  assert.ok(filterCases(CASES, empty, { status: 'new' }).length === CASES.length)
  const combined = filterCases(CASES, empty, { category, level: 'Foundation', search: 'the' })
  assert.ok(combined.every(item => item.category === category && item.level === 'Foundation' && `${item.title} ${item.focus} ${item.sector}`.toLowerCase().includes('the')))
})

test('status filter uses caseStatus with progress', () => {
  const progress = { ...empty, drafts: { [CASES[0].id]: { stage: 0, entries: [] } } }
  const draftsOnly = filterCases(CASES, progress, { status: 'draft' })
  assert.deepEqual(draftsOnly.map(item => item.id), [CASES[0].id])
})

test('sort orders are deterministic and do not mutate the input', () => {
  const list = CASES.slice(0, 10)
  const before = list.map(item => item.id)
  assert.deepEqual(sortCases(list, empty, 'library').map(item => item.id), before)
  assert.deepEqual(list.map(item => item.id), before)
  const titled = sortCases(CASES, empty, 'title')
  for (let i = 1; i < titled.length; i++) assert.ok(titled[i - 1].title.localeCompare(titled[i].title) <= 0)
  const leveled = sortCases(CASES, empty, 'difficulty')
  const rank = { Foundation: 0, Intermediate: 1, Advanced: 2 }
  for (let i = 1; i < leveled.length; i++) assert.ok(rank[leveled[i - 1].level] <= rank[leveled[i].level])
  const byStatus = sortCases(CASES, empty, 'status')
  assert.equal(byStatus.length, CASES.length)
  // Stable: equal keys keep library order.
  const dup = [CASES[5], CASES[3], CASES[5], CASES[3]]
  assert.deepEqual(sortCases(dup, empty, 'title').map(item => item.id), [CASES[3].id, CASES[3].id, CASES[5].id, CASES[5].id])
})
