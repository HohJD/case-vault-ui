// Which sector notes a learner has read, stored apart from every other progress key.
export const INDUSTRY_PROGRESS_KEY = 'case-prep-industries-v1'
const empty = () => ({ version: 1, records: {} })
const defaultStorage = () => { try { return globalThis.localStorage } catch { return null } }

export function loadIndustryProgress(storage = defaultStorage()) {
  try {
    const data = JSON.parse(storage?.getItem(INDUSTRY_PROGRESS_KEY))
    if (data && data.version === 1 && data.records && typeof data.records === 'object') return { version: 1, records: { ...data.records } }
  } catch { }
  return empty()
}

// Marks a note read (first and latest visit). Never throws; returns the updated progress.
export function markIndustryRead(progress, id, { now = Date.now(), storage = defaultStorage() } = {}) {
  const previous = progress.records[id]
  const updated = { version: 1, records: { ...progress.records, [id]: { firstReadAt: previous?.firstReadAt ?? now, readAt: now, visits: (previous?.visits ?? 0) + 1 } } }
  try { storage?.setItem(INDUSTRY_PROGRESS_KEY, JSON.stringify(updated)) } catch { }
  return updated
}

export const industriesRead = (progress, ids) => ids.filter(id => progress.records[id]).length
