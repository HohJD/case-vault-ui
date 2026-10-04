import test from 'node:test'
import assert from 'node:assert/strict'
import { loadInterviewProgress, setInterviewItem } from './interview-progress.js'
import { loadIndustryProgress, markIndustryRead } from './industry-progress.js'

const memory = () => {
  const data = new Map()
  return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
}
const blocked = () => ({ getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } })

test('marking a sector note read saves it and survives blocked storage', () => {
  const storage = memory()
  let progress = markIndustryRead(loadIndustryProgress(storage), 'telecom', { now: 100, storage })
  progress = markIndustryRead(progress, 'telecom', { now: 200, storage })
  assert.deepEqual(loadIndustryProgress(storage).records.telecom, { firstReadAt: 100, readAt: 200, visits: 2 })
  assert.equal(markIndustryRead(loadIndustryProgress(blocked()), 'telecom', { now: 1, storage: blocked() }).records.telecom.visits, 1)
})

test('interview prep ticks save, and an untick is kept as done: false', () => {
  const storage = memory()
  let progress = setInterviewItem(loadInterviewProgress(storage), 'why-firm', true, { now: 10, storage })
  progress = setInterviewItem(progress, 'why-firm', false, { now: 20, storage })
  assert.deepEqual(loadInterviewProgress(storage).records['why-firm'], { done: false, at: 20 })
  assert.equal(setInterviewItem(loadInterviewProgress(blocked()), 'cv-walk', true, { now: 1, storage: blocked() }).records['cv-walk'].done, true)
})
