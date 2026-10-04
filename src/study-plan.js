
export const STUDY_PLAN_KEY = 'case-prep-plan-v1'
const DAY = 86400000
const PRUNE_DAYS = 90
const KINDS = ['cases', 'drills', 'cards', 'maths']
const LIMITS = { cases: [1, 50], drills: [1, 100], cards: [1, 200] }
const DEFAULT_TARGETS = { cases: 3, drills: 10, cards: 30 }
const empty = () => ({ version: 1, targets: { ...DEFAULT_TARGETS }, log: {} })

const dayKey = time => {
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const clamp = (kind, value) => Math.min(LIMITS[kind][1], Math.max(LIMITS[kind][0], value))
const validCount = value => Number.isInteger(value) && value >= 0 && value <= 1000000

// A copy kept only when storage is blocked, so the dashboard still reflects the session.
let memoryCopy = null
const listeners = new Set()
const notify = () => { for (const listener of listeners) { try { listener() } catch { /* keep recording */ } } }

export function subscribeStudyPlan(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function loadStudyPlan(storage, now = Date.now()) {
  let raw
  try { raw = (storage ?? globalThis.localStorage).getItem(STUDY_PLAN_KEY) }
  catch { return memoryCopy ?? empty() }
  let saved = null
  try { saved = JSON.parse(raw) } catch { saved = null }
  if (!saved || saved.version !== 1) return empty()
  const plan = empty()
  for (const kind of Object.keys(LIMITS)) {
    const value = saved.targets?.[kind]
    if (Number.isInteger(value)) plan.targets[kind] = clamp(kind, value)
  }
  const cutoff = dayKey(now - PRUNE_DAYS * DAY)
  for (const [key, entry] of Object.entries(saved.log ?? {})) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || key < cutoff) continue
    const clean = {}
    for (const kind of KINDS) if (validCount(entry?.[kind])) clean[kind] = entry[kind]
    if (Object.keys(clean).length) plan.log[key] = clean
  }
  return plan
}

export function saveStudyPlan(plan, storage) {
  try { (storage ?? globalThis.localStorage).setItem(STUDY_PLAN_KEY, JSON.stringify(plan)); return true }
  catch { return false }
}

export function setTarget(plan, kind, value) {
  if (!LIMITS[kind] || !Number.isInteger(value)) return plan
  return { ...plan, targets: { ...plan.targets, [kind]: clamp(kind, value) } }
}

export function recordActivity(kind, count = 1, { now = Date.now(), storage } = {}) {
  try {
    if (!KINDS.includes(kind) || !Number.isInteger(count) || count <= 0) return
    const plan = loadStudyPlan(storage, now)
    const key = dayKey(now)
    const entry = plan.log[key] ?? {}
    plan.log[key] = { ...entry, [kind]: (entry[kind] ?? 0) + count }
    memoryCopy = saveStudyPlan(plan, storage) ? null : plan
    notify()
  } catch { /* activity tracking must never break practice */ }
}

export function weekStart(now = Date.now()) {
  const date = new Date(now)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - (date.getDay() + 6) % 7)
  return date.getTime()
}

export function weekProgress(plan, now = Date.now()) {
  const start = dayKey(weekStart(now))
  const end = dayKey(now)
  const done = kind => {
    let total = 0
    for (const [key, entry] of Object.entries(plan.log)) if (key >= start && key <= end) total += entry[kind] ?? 0
    return total
  }
  return {
    cases: { done: done('cases'), target: plan.targets.cases },
    drills: { done: done('drills'), target: plan.targets.drills },
    cards: { done: done('cards'), target: plan.targets.cards },
    maths: { done: done('maths') },
  }
}

export function streak(plan, now = Date.now()) {
  const active = key => {
    const entry = plan.log[key]
    return Boolean(entry) && KINDS.some(kind => entry[kind] > 0)
  }
  let cursor = new Date(now)
  if (!active(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!active(dayKey(cursor))) return 0
  }
  let days = 0
  while (active(dayKey(cursor))) {
    days += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return days
}
