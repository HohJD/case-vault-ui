import { CASES, LEGACY_CASES, STAGES } from './casebook.js'

export const LEGACY_CASE_PROGRESS_KEY = 'case-prep-cases-v1'
export const CASE_PROGRESS_KEY = 'case-prep-cases-v2'
export const STAGE_TARGETS = [45, 60, 90, 45, 90]
export const MASTERY_LEVEL = 3
const DAY = 86400000
const emptyProgress = () => ({ version: 2, timed: false, drafts: {}, records: {} })
const legacyCase = item => LEGACY_CASES.find(previous => previous.id === item.id)

export function parseCaseNumber(value) {
  if (typeof value !== 'string') return null
  const text = value.trim()
  const plain = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/
  const grouped = /^[+-]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})*,\d{3})(?:\.\d+)?$/
  if (!plain.test(text) && !grouped.test(text)) return null
  const number = Number(text.replaceAll(',', ''))
  return Number.isFinite(number) ? number : null
}

export function attemptStep(item, attempt, index) {
  return attempt.format === 1 || attempt.entries[index].legacy ? legacyCase(item).steps[index] : item.steps[index]
}

export const entryAnswer = entry => entry.legacy ? entry.legacy.answer : entry.answer
const optionExists = (options, value) => options.some(option => option.id === value)
const isSubset = (values, options) => Array.isArray(values) && new Set(values).size === values.length && values.every(value => optionExists(options, value))
const pointCount = step => step.kind === 'reflection' ? 0 : step.kind === 'select' ? step.required : step.kind === 'build' ? step.parts.length : 1

export function canSubmitStep(step, entry) {
  if (!entry || entry.submitted) return false
  const answer = entry.answer
  if (step.kind === 'select') return isSubset(answer, step.options) && answer.length === step.required
  if (step.kind === 'build') return Boolean(answer && typeof answer === 'object' && !Array.isArray(answer) && Object.keys(answer).length === step.parts.length && step.parts.every(part => optionExists(part.options, answer[part.id])))
  if (step.kind === 'choice' || step.kind === 'calculation') return typeof answer === 'string' && optionExists(step.options, answer) && (step.kind !== 'calculation' || entry.revealed === true)
  if (step.kind === 'number') return parseCaseNumber(answer) !== null
  return typeof answer === 'string' && answer.trim().length > 0 && answer.length <= 4000
}

export function decisionPoints(step, answer) {
  if (step.kind === 'reflection') return 0
  if (step.kind === 'select') return isSubset(answer, step.options) && answer.length === step.required ? answer.filter(id => step.correct.includes(id)).length : 0
  if (step.kind === 'build') return step.parts.filter(part => answer?.[part.id] === part.correct).length
  if (step.kind === 'choice') return answer === step.correct ? 1 : 0
  const number = step.kind === 'calculation' ? step.options.find(option => option.id === answer)?.value : parseCaseNumber(answer)
  return Number.isFinite(number) && Math.abs(number - step.answer) <= step.tolerance + 1e-9 ? 1 : 0
}

export function checkCaseAnswer(step, answer) {
  return step.kind === 'reflection' ? null : decisionPoints(step, answer) === pointCount(step)
}

export function answerLabel(step, answer) {
  if (step.kind === 'select') return step.options.filter(option => answer?.includes(option.id)).map(option => option.label).join('\n')
  if (step.kind === 'build') return step.parts.map(part => `${part.title}: ${part.options.find(option => option.id === answer?.[part.id])?.label ?? 'Not selected'}`).join('\n')
  if (step.kind === 'choice' || step.kind === 'calculation') return step.options.find(option => option.id === answer)?.label ?? ''
  return answer
}

function shuffled(values, random) {
  const result = [...values]
  for (let i = result.length - 1; i > 0; i--) {
    const index = Math.floor(random() * (i + 1))
    ;[result[i], result[index]] = [result[index], result[i]]
  }
  return result
}

function createEntry(step, random) {
  return {
    answer: step.kind === 'select' ? [] : step.kind === 'build' ? Object.fromEntries(step.parts.map(part => [part.id, ''])) : '',
    submitted: false, hinted: false, elapsed: 0,
    order: shuffled(step.options?.map(option => option.id) ?? [], random),
    revealed: step.kind !== 'calculation', part: 0,
    partOrder: Object.fromEntries((step.parts ?? []).map(part => [part.id, shuffled(part.options.map(option => option.id), random)])),
  }
}

export function createCaseAttempt(item, { random = Math.random, now = Date.now(), id = crypto.randomUUID() } = {}) {
  return { format: 2, id, caseId: item.id, stage: 0, startedAt: now, entries: item.steps.map(step => createEntry(step, random)) }
}

export function caseSummary(item, attempt) {
  const summary = { correct: 0, total: 0, hints: 0, elapsed: 0, legacyWritten: 0, selfChecked: 0, selfTotal: 0, missedSkills: [] }
  item.steps.forEach((_, index) => {
    const entry = attempt.entries[index]
    const step = attemptStep(item, attempt, index)
    const possible = pointCount(step)
    const earned = entry.submitted ? decisionPoints(step, entryAnswer(entry)) : 0
    summary.total += possible
    summary.correct += earned
    summary.hints += entry.hinted ? 1 : 0
    summary.elapsed += entry.elapsed
    if (entry.submitted && earned < possible) summary.missedSkills.push(STAGES[index])
    if (step.kind === 'reflection') {
      summary.legacyWritten++
      summary.selfChecked += (entry.legacy?.self ?? entry.self ?? []).length
      summary.selfTotal += step.rubric.length
    }
  })
  return summary
}

const validSelf = (self, step) => Array.isArray(self) && new Set(self).size === self.length && self.every(index => Number.isInteger(index) && index >= 0 && index < (step.rubric?.length ?? 0))
const validOrder = (order, options) => isSubset(order, options) && order.length === options.length
const validBase = entry => entry && typeof entry.submitted === 'boolean' && typeof entry.hinted === 'boolean' && Number.isInteger(entry.elapsed) && entry.elapsed >= 0 && entry.elapsed <= 86400
const validAttemptBase = (item, value) => value && value.caseId === item.id && typeof value.id === 'string' && Number.isInteger(value.stage) && value.stage >= 0 && value.stage < item.steps.length && Number.isFinite(value.startedAt) && Array.isArray(value.entries) && value.entries.length === item.steps.length

function validLegacyAttempt(item, value) {
  const original = legacyCase(item)
  return validAttemptBase(item, value) && value.entries.every((entry, index) => {
    const step = original.steps[index]
    return validBase(entry) && typeof entry.answer === 'string' && entry.answer.length <= 4000 && validSelf(entry.self, step) && Array.isArray(entry.order) && (step.kind !== 'choice' || validOrder(entry.order, step.options)) && (!entry.submitted || canSubmitStep(step, { ...entry, submitted: false }))
  }) && value.entries.slice(0, value.stage).every(entry => entry.submitted)
}

function validAttempt(item, value) {
  if (value?.format === 1) return validLegacyAttempt(item, value)
  if (value?.format !== 2 || !validAttemptBase(item, value)) return false
  return value.entries.every((entry, index) => {
    if (!validBase(entry)) return false
    if (entry.previousDraft !== undefined && (typeof entry.previousDraft !== 'string' || entry.previousDraft.length > 4000)) return false
    const step = item.steps[index]
    if (entry.legacy) {
      const old = legacyCase(item).steps[index]
      return entry.submitted && ['number', 'reflection'].includes(old.kind) && entry.legacy.kind === old.kind && typeof entry.legacy.answer === 'string' && entry.legacy.answer.length <= 4000 && validSelf(entry.legacy.self, old) && canSubmitStep(old, { answer: entry.legacy.answer, submitted: false })
    }
    if (typeof entry.revealed !== 'boolean' || !Number.isInteger(entry.part) || entry.part < 0 || !entry.partOrder || typeof entry.partOrder !== 'object') return false
    if (step.kind === 'build') {
      if (!entry.answer || typeof entry.answer !== 'object' || Array.isArray(entry.answer) || entry.part >= step.parts.length || Object.keys(entry.answer).length !== step.parts.length) return false
      if (!step.parts.every(part => validOrder(entry.partOrder[part.id], part.options) && (entry.answer[part.id] === '' || optionExists(part.options, entry.answer[part.id])))) return false
      if (!step.parts.slice(0, entry.part).every(part => optionExists(part.options, entry.answer[part.id]))) return false
    } else {
      if (!validOrder(entry.order, step.options)) return false
      if (step.kind === 'select' ? !isSubset(entry.answer, step.options) || entry.answer.length > step.required : typeof entry.answer !== 'string' || entry.answer !== '' && !optionExists(step.options, entry.answer)) return false
    }
    return !entry.submitted || canSubmitStep(step, { ...entry, submitted: false })
  }) && value.entries.slice(0, value.stage).every(entry => entry.submitted)
}

function migrateDraft(item, draft) {
  const next = createCaseAttempt(item, { id: draft.id, now: draft.startedAt })
  next.stage = draft.stage
  next.migrated = true
  next.entries = next.entries.map((entry, index) => {
    const old = draft.entries[index]
    const shared = { ...entry, hinted: old.hinted, elapsed: old.elapsed }
    if (legacyCase(item).steps[index].kind === 'choice') return { ...shared, answer: old.answer, submitted: old.submitted, order: old.order }
    if (old.submitted) return { ...shared, submitted: true, legacy: { kind: legacyCase(item).steps[index].kind, answer: old.answer, self: old.self } }
    return { ...shared, ...(old.answer ? { previousDraft: old.answer } : {}) }
  })
  return next
}

function readRecord(item, record, legacy = false) {
  if (!record) return null
  const attempt = legacy ? { ...record.lastAttempt, format: 1 } : record.lastAttempt
  if (!validAttempt(item, attempt) || !attempt.entries.every(entry => entry.submitted) || !Number.isInteger(record.attempts) || record.attempts < 1 || !Number.isInteger(record.level) || record.level < 0 || record.level > 3 || !Number.isFinite(record.completedAt) || !Number.isFinite(record.dueAt)) return null
  return { attempts: record.attempts, level: record.level, completedAt: record.completedAt, dueAt: record.dueAt, lastAttempt: attempt, summary: caseSummary(item, attempt) }
}

export function loadCaseProgress(storage) {
  try {
    const source = storage ?? globalThis.localStorage
    const current = source.getItem(CASE_PROGRESS_KEY)
    const saved = JSON.parse(current ?? source.getItem(LEGACY_CASE_PROGRESS_KEY))
    if (!saved || ![1, 2].includes(saved.version)) return emptyProgress()
    const progress = emptyProgress()
    progress.timed = saved.timed === true
    for (const item of CASES) {
      const draft = saved.drafts?.[item.id]
      if (saved.version === 1 ? validLegacyAttempt(item, draft) : validAttempt(item, draft) && draft.format === 2) progress.drafts[item.id] = saved.version === 1 ? migrateDraft(item, draft) : draft
      const record = readRecord(item, saved.records?.[item.id], saved.version === 1)
      if (record) {
        const savedRecord = saved.records[item.id]
        const archives = Array.isArray(savedRecord.legacyReviews) ? savedRecord.legacyReviews : savedRecord.legacyReview ? [savedRecord.legacyReview] : []
        const older = archives.map(archive => readRecord(item, archive)).filter(Boolean)
        const unique = [...new Map(older.map(archive => [archive.lastAttempt.id, archive])).values()]
        progress.records[item.id] = { ...record, ...(unique.length ? { legacyReviews: unique } : {}) }
      }
    }
    return progress
  } catch { return emptyProgress() }
}

export function saveCaseProgress(progress, storage) {
  try { (storage ?? globalThis.localStorage).setItem(CASE_PROGRESS_KEY, JSON.stringify(progress)); return true }
  catch { return false }
}

export function caseProgressReducer(state, action) {
  if (action.type === 'timer') return { ...state, timed: action.enabled === true }
  const item = CASES.find(item => item.id === action.caseId)
  if (!item) return state
  if (action.type === 'start') return state.drafts[item.id] ? state : { ...state, drafts: { ...state.drafts, [item.id]: createCaseAttempt(item, action.options) } }
  const draft = state.drafts[item.id]
  if (!draft) return state
  const step = item.steps[draft.stage]
  const entry = draft.entries[draft.stage]
  let next = entry
  if (!entry.submitted) {
    if (action.type === 'answer' && ['choice', 'calculation'].includes(step.kind) && optionExists(step.options, action.answer) && (step.kind !== 'calculation' || entry.revealed)) next = { ...entry, answer: action.answer }
    if (action.type === 'select' && step.kind === 'select' && optionExists(step.options, action.id)) {
      if (entry.answer.includes(action.id)) next = { ...entry, answer: entry.answer.filter(id => id !== action.id) }
      else if (entry.answer.length < step.required) next = { ...entry, answer: [...entry.answer, action.id] }
    }
    if (action.type === 'pick' && step.kind === 'build' && step.parts.some(part => part.id === action.part && optionExists(part.options, action.answer))) next = { ...entry, answer: { ...entry.answer, [action.part]: action.answer } }
    if (action.type === 'part' && step.kind === 'build' && Number.isInteger(action.part) && action.part >= 0 && action.part < step.parts.length && step.parts.slice(0, action.part).every(part => optionExists(part.options, entry.answer[part.id]))) next = { ...entry, part: action.part }
    if (action.type === 'reveal' && step.kind === 'calculation') next = { ...entry, revealed: true }
    if (action.type === 'hint') next = { ...entry, hinted: true }
    if (action.type === 'tick' && state.timed && action.stage === draft.stage && Number.isInteger(action.seconds) && action.seconds > 0) next = { ...entry, elapsed: Math.min(86400, entry.elapsed + action.seconds) }
    if (action.type === 'submit' && canSubmitStep(step, entry)) next = { ...entry, submitted: true }
  }
  if (action.type === 'stage' && Number.isInteger(action.stage) && action.stage >= 0 && action.stage < item.steps.length && draft.entries.slice(0, action.stage).every(entry => entry.submitted)) return { ...state, drafts: { ...state.drafts, [item.id]: { ...draft, stage: action.stage } } }
  if (action.type === 'complete' && draft.entries.every(entry => entry.submitted)) {
    const summary = caseSummary(item, draft)
    const previous = state.records[item.id]
    const strong = summary.correct === summary.total && summary.hints === 0 && summary.legacyWritten === 0
    const completedAt = action.now ?? Date.now()
    const previousLevel = previous?.lastAttempt.format === 2 ? previous.level : 0
    // A clean replay before the review is due keeps the current level and date: only spaced recall builds mastery.
    const early = strong && previous?.lastAttempt.format === 2 && completedAt < previous.dueAt
    const level = early ? previous.level : strong ? Math.min(MASTERY_LEVEL, previousLevel + 1) : 0
    const dueAt = early ? previous.dueAt : completedAt + [1, 3, 7, 14][level] * DAY
    const drafts = { ...state.drafts }
    delete drafts[item.id]
    const archives = new Map((previous?.legacyReviews ?? []).map(record => [record.lastAttempt.id, record]))
    if (previous && (previous.lastAttempt.format === 1 || previous.lastAttempt.entries.some(entry => entry.legacy || entry.previousDraft))) {
      const snapshot = readRecord(item, previous)
      if (snapshot) archives.set(snapshot.lastAttempt.id, snapshot)
    }
    const legacyReviews = [...archives.values()]
    return { ...state, drafts, records: { ...state.records, [item.id]: { attempts: (previous?.attempts ?? 0) + 1, completedAt, dueAt, level, summary, lastAttempt: draft, ...(legacyReviews.length ? { legacyReviews } : {}) } } }
  }
  if (next === entry) return state
  return { ...state, drafts: { ...state.drafts, [item.id]: { ...draft, entries: draft.entries.map((value, index) => index === draft.stage ? next : value) } } }
}

export function dueCases(progress, now = Date.now()) {
  return CASES.filter(item => progress.records[item.id]?.dueAt <= now).sort((a, b) => progress.records[a.id].dueAt - progress.records[b.id].dueAt)
}

// new → in progress → due → learning → mastered. Mastered means three clean, spaced runs in a row.
export function caseStatus(progress, item, now = Date.now()) {
  const record = progress.records[item.id]
  if (progress.drafts[item.id]) return 'draft'
  if (!record) return 'new'
  if (record.dueAt <= now) return 'due'
  return record.level >= MASTERY_LEVEL && record.lastAttempt.format === 2 ? 'mastered' : 'learning'
}

export const masteryLevel = record => record?.lastAttempt.format === 2 ? record.level : 0

// The single most useful case to open next, with the reason shown to the learner.
export function nextCase(progress, now = Date.now()) {
  const draft = CASES.find(item => progress.drafts[item.id])
  if (draft) return { item: draft, reason: 'draft' }
  const due = dueCases(progress, now)[0]
  if (due) return { item: due, reason: 'due' }
  const fresh = CASES.find(item => !progress.records[item.id])
  if (fresh) return { item: fresh, reason: 'new' }
  const upcoming = [...CASES].sort((a, b) => progress.records[a.id].dueAt - progress.records[b.id].dueAt)[0]
  return { item: upcoming, reason: CASES.every(item => caseStatus(progress, item, now) === 'mastered') ? 'mastered' : 'waiting' }
}

// The fully supported answer at every stage, used for the review and recall sheet.
export function winningPath(item) {
  return item.steps.map((step, index) => {
    const answers = step.kind === 'select' ? step.options.filter(option => step.correct.includes(option.id)).map(option => option.label)
      : step.kind === 'build' ? step.parts.map(part => `${part.title}: ${part.options.find(option => option.id === part.correct).label}`)
      : step.kind === 'calculation' ? [step.options.find(option => checkCaseAnswer(step, option.id)).label]
      : [step.options.find(option => option.id === step.correct).label]
    return { stage: STAGES[index], prompt: step.prompt, answers }
  })
}
