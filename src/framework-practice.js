import { FRAMEWORKS, FRAMEWORK_DRILLS, makeFrameworkQuestion, seededRandom } from './frameworks.js'

export const FRAMEWORK_PROGRESS_KEY = 'case-prep-frameworks-v1'
const DAY = 86400000
const empty = () => ({ version: 1, records: {}, session: null })
const byId = id => FRAMEWORK_DRILLS.find(item => item.id === id)
const validTime = value => Number.isFinite(value) && value >= 0
const shuffle = (values, random) => {
  const result = [...values]
  for (let i = result.length - 1; i > 0; i--) {
    const index = Math.floor(random() * (i + 1))
    ;[result[i], result[index]] = [result[index], result[i]]
  }
  return result
}

export const frameworkQuestion = card => makeFrameworkQuestion(card.drillId, card.variant, card.seed)
export const frameworkCardCorrect = card => card.checked && card.answer === frameworkQuestion(card).correct
export const spacedRecall = record => Boolean(record && record.level >= 2 && record.successfulVariants.length >= 2)

export function frameworkStats(progress, frameworkId, now = Date.now()) {
  const drills = FRAMEWORK_DRILLS.filter(item => !frameworkId || item.frameworkId === frameworkId)
  return {
    total: drills.length,
    practised: drills.filter(item => progress.records[item.id]).length,
    due: drills.filter(item => progress.records[item.id]?.dueAt <= now).length,
    spaced: drills.filter(item => spacedRecall(progress.records[item.id])).length,
  }
}

function diverse(items, count) {
  const result = [], used = new Set()
  for (const item of items) if (!used.has(item.frameworkId) && result.length < count) { result.push(item); used.add(item.frameworkId) }
  for (const item of items) if (!result.includes(item) && result.length < count) result.push(item)
  return result
}

export function planFrameworkRound(progress, mode = 'mix', frameworkId, now = Date.now(), random = Math.random) {
  if (mode === 'framework') return shuffle(FRAMEWORK_DRILLS.filter(item => item.frameworkId === frameworkId), random).slice(0, 6)
  if (mode === 'retry') {
    const ids = new Set(progress.session?.cards.filter(card => card.checked && (!frameworkCardCorrect(card) || card.assisted)).map(card => card.drillId))
    return shuffle(FRAMEWORK_DRILLS.filter(item => ids.has(item.id)), random).slice(0, 6)
  }
  if (!['mix', 'review'].includes(mode)) return []
  const due = shuffle(FRAMEWORK_DRILLS.filter(item => progress.records[item.id]?.dueAt <= now), random).sort((a, b) => progress.records[a.id].dueAt - progress.records[b.id].dueAt)
  if (mode === 'review') return diverse(due, 6)
  const unseen = shuffle(FRAMEWORK_DRILLS.filter(item => !progress.records[item.id]), random)
  const scheduled = shuffle(FRAMEWORK_DRILLS.filter(item => progress.records[item.id]?.dueAt > now), random).sort((a, b) => progress.records[a.id].lastAnsweredAt - progress.records[b.id].lastAnsweredAt)
  const selected = diverse(due, 6)
  for (const group of [unseen, scheduled]) {
    const used = new Set(selected.map(item => item.frameworkId))
    const candidates = [...group.filter(item => !used.has(item.frameworkId)), ...group.filter(item => used.has(item.frameworkId))]
    selected.push(...diverse(candidates, 6 - selected.length))
  }
  return selected
}

export function createFrameworkRound(progress, { mode = 'mix', frameworkId, now = Date.now(), random = Math.random, id = crypto.randomUUID() } = {}) {
  const drills = planFrameworkRound(progress, mode, frameworkId, now, random)
  if (!drills.length) return null
  return {
    id, mode, index: 0, startedAt: now, finished: false,
    cards: drills.map(drill => {
      const previous = progress.records[drill.id]
      const variant = previous ? (previous.lastVariant + 1) % drill.variants.length : 0
      const seed = Math.floor(random() * 4294967296)
      const q = makeFrameworkQuestion(drill.id, variant, seed)
      return { drillId: drill.id, variant, seed, order: shuffle(q.options.map(option => option.id), seededRandom(seed)), answer: '', checked: false, assisted: false, methodOpen: false, revealed: !q.calculation }
    }),
  }
}

export function reviewFrameworkRecord(previous, card, now) {
  const correct = card.answer === frameworkQuestion(card).correct
  const independent = correct && !card.assisted
  const canAdvance = !previous || previous.lastCountedAt === null || now - previous.lastCountedAt >= DAY
  const level = independent ? canAdvance ? Math.min(4, (previous?.level ?? 0) + 1) : Math.max(1, previous.level) : 0
  const dueAt = !independent ? now : canAdvance ? now + [0, 1, 3, 7, 14][level] * DAY : previous.dueAt > now ? previous.dueAt : now + DAY
  return {
    attempts: (previous?.attempts ?? 0) + 1,
    correctCount: (previous?.correctCount ?? 0) + (correct ? 1 : 0),
    assistedCount: (previous?.assistedCount ?? 0) + (card.assisted ? 1 : 0),
    level, dueAt, lastAnsweredAt: now, lastCountedAt: independent && canAdvance ? now : previous?.lastCountedAt ?? null,
    lastVariant: card.variant,
    successfulVariants: [...new Set([...(previous?.successfulVariants ?? []), ...(independent ? [card.variant] : [])])],
  }
}

export function frameworkRoundSummary(session) {
  const checked = session.cards.filter(card => card.checked)
  const retryIds = [...new Set(checked.filter(card => !frameworkCardCorrect(card) || card.assisted).map(card => card.drillId))]
  return { checked: checked.length, total: session.cards.length, correct: checked.filter(frameworkCardCorrect).length, assisted: checked.filter(card => card.assisted).length, retryIds }
}

export function frameworkReducer(state, action) {
  if (action.type === 'start') {
    if (state.session && !state.session.finished) return state
    const session = createFrameworkRound(state, action.options)
    return session ? { ...state, session } : state
  }
  const session = state.session
  if (!session || session.finished) return state
  if (action.type === 'study' && FRAMEWORKS.some(item => item.id === action.frameworkId)) {
    return { ...state, session: { ...session, cards: session.cards.map(card => !card.checked && byId(card.drillId).frameworkId === action.frameworkId ? { ...card, assisted: true } : card) } }
  }
  const card = session.cards[session.index]
  const q = frameworkQuestion(card)
  let nextCard = card
  if (action.type === 'end') return { ...state, session: { ...session, finished: true } }
  if (action.type === 'answer' && !card.checked && card.revealed && q.options.some(option => option.id === action.answer)) nextCard = { ...card, answer: action.answer }
  if (action.type === 'reveal' && !card.checked) nextCard = { ...card, revealed: true }
  if (action.type === 'method') nextCard = { ...card, methodOpen: true, assisted: card.assisted || !card.checked }
  if (action.type === 'check' && !card.checked && card.revealed && q.options.some(option => option.id === card.answer)) {
    const now = action.now ?? Date.now()
    if (!validTime(now)) return state
    const record = reviewFrameworkRecord(state.records[card.drillId], card, now)
    return { ...state, records: { ...state.records, [card.drillId]: record }, session: { ...session, cards: session.cards.map((item, index) => index === session.index ? { ...card, checked: true } : item) } }
  }
  if (action.type === 'next' && card.checked) return { ...state, session: session.index === session.cards.length - 1 ? { ...session, finished: true } : { ...session, index: session.index + 1 } }
  if (nextCard === card) return state
  return { ...state, session: { ...session, cards: session.cards.map((item, index) => index === session.index ? nextCard : item) } }
}

function validRecord(drill, record) {
  return record && Number.isInteger(record.attempts) && record.attempts > 0 && Number.isInteger(record.correctCount) && record.correctCount >= 0 && record.correctCount <= record.attempts && Number.isInteger(record.assistedCount) && record.assistedCount >= 0 && record.assistedCount <= record.attempts && Number.isInteger(record.level) && record.level >= 0 && record.level <= 4 && validTime(record.dueAt) && validTime(record.lastAnsweredAt) && (record.lastCountedAt === null || validTime(record.lastCountedAt)) && Number.isInteger(record.lastVariant) && record.lastVariant >= 0 && record.lastVariant < drill.variants.length && Array.isArray(record.successfulVariants) && new Set(record.successfulVariants).size === record.successfulVariants.length && record.successfulVariants.every(index => Number.isInteger(index) && index >= 0 && index < drill.variants.length)
}

function validSession(session) {
  if (!session || typeof session.id !== 'string' || !['mix', 'review', 'framework', 'retry'].includes(session.mode) || !validTime(session.startedAt) || typeof session.finished !== 'boolean' || !Array.isArray(session.cards) || !session.cards.length || session.cards.length > 6 || !Number.isInteger(session.index) || session.index < 0 || session.index >= session.cards.length) return false
  if (new Set(session.cards.map(card => card?.drillId)).size !== session.cards.length) return false
  return session.cards.every(card => {
    const drill = byId(card?.drillId)
    if (!drill || !Number.isInteger(card.variant) || card.variant < 0 || card.variant >= drill.variants.length || !Number.isInteger(card.seed) || card.seed < 0 || card.seed > 4294967295 || !['checked', 'assisted', 'methodOpen', 'revealed'].every(key => typeof card[key] === 'boolean')) return false
    const q = frameworkQuestion(card)
    return Array.isArray(card.order) && card.order.length === q.options.length && new Set(card.order).size === card.order.length && card.order.every(id => q.options.some(option => option.id === id)) && typeof card.answer === 'string' && (card.answer === '' || q.options.some(option => option.id === card.answer)) && (!card.checked || card.revealed && card.answer !== '')
  }) && session.cards.slice(0, session.index).every(card => card.checked)
}

export function loadFrameworkProgress(storage) {
  try {
    const saved = JSON.parse((storage ?? globalThis.localStorage).getItem(FRAMEWORK_PROGRESS_KEY))
    if (!saved || saved.version !== 1) return empty()
    const progress = empty()
    for (const drill of FRAMEWORK_DRILLS) if (validRecord(drill, saved.records?.[drill.id])) progress.records[drill.id] = saved.records[drill.id]
    if (validSession(saved.session)) progress.session = saved.session
    return progress
  } catch { return empty() }
}

export function saveFrameworkProgress(progress, storage) {
  try { (storage ?? globalThis.localStorage).setItem(FRAMEWORK_PROGRESS_KEY, JSON.stringify(progress)); return true }
  catch { return false }
}

export function frameworkForDrill(drillId) {
  const drill = byId(drillId)
  return FRAMEWORKS.find(item => item.id === drill?.frameworkId)
}
