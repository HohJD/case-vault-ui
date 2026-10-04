// Interview prep ticks, kept apart from every other progress key.
export const INTERVIEW_PROGRESS_KEY = 'case-prep-interview-v1'
const defaultStorage = () => { try { return globalThis.localStorage } catch { return null } }

export function loadInterviewProgress(storage = defaultStorage()) {
  try {
    const data = JSON.parse(storage?.getItem(INTERVIEW_PROGRESS_KEY))
    if (data && data.version === 1 && data.records && typeof data.records === 'object') return { version: 1, records: { ...data.records } }
  } catch { }
  return { version: 1, records: {} }
}

// Ticks or unticks one item. A cleared tick is kept as done: false.
export function setInterviewItem(progress, id, done, { now = Date.now(), storage = defaultStorage() } = {}) {
  const updated = { version: 1, records: { ...progress.records, [id]: { done: Boolean(done), at: now } } }
  try { storage?.setItem(INTERVIEW_PROGRESS_KEY, JSON.stringify(updated)) } catch { }
  return updated
}

export const interviewDone = (progress, ids) => ids.filter(id => progress.records[id]?.done).length
