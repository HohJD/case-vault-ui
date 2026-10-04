import { CARDS, DECKS } from './flashcards.js'

export const FLASHCARD_KEY = 'case-prep-flashcards-v1'
export const ROUND_LENGTH = 10
export const CARD_MASTERY = 3
export const AGAIN_CHOICES = [1, 5, 10]
export const GRADES = ['again', 'hard', 'good', 'easy']
const MINUTE = 60000
const DAY = 86400000
const INTERVALS = [1, 3, 7, 14]
const empty = () => ({ version: 1, settings: { shuffle: false, againMinutes: 1 }, records: {} })
const byId = id => CARDS.find(card => card.id === id)

export const deckCards = deckId => CARDS.filter(card => !deckId || (Array.isArray(deckId) ? deckId.includes(card.deck) : card.deck === deckId))

export function loadFlashcards(storage) {
  try {
    const saved = JSON.parse((storage ?? globalThis.localStorage).getItem(FLASHCARD_KEY))
    if (!saved || saved.version !== 1 || !saved.records || typeof saved.records !== 'object') return empty()
    const progress = empty()
    progress.settings = {
      shuffle: saved.settings?.shuffle === true,
      againMinutes: AGAIN_CHOICES.includes(saved.settings?.againMinutes) ? saved.settings.againMinutes : 1,
    }
    for (const card of CARDS) {
      const record = saved.records[card.id]
      if (!record || !Number.isInteger(record.level) || record.level < 0 || record.level > CARD_MASTERY) continue
      if (!Number.isFinite(record.dueAt) || !Number.isInteger(record.seen) || record.seen < 1) continue
      progress.records[card.id] = { level: record.level, dueAt: record.dueAt, seen: record.seen, correct: Number.isInteger(record.correct) && record.correct >= 0 ? record.correct : 0 }
    }
    return progress
  } catch { return empty() }
}

export function saveFlashcards(progress, storage) {
  try { (storage ?? globalThis.localStorage).setItem(FLASHCARD_KEY, JSON.stringify(progress)); return true }
  catch { return false }
}

export const setSetting = (progress, key, value) => ({ ...progress, settings: { ...progress.settings, [key]: value } })

export function deckStats(progress, deckId, now = Date.now()) {
  const cards = deckCards(deckId)
  const records = cards.map(card => progress.records[card.id]).filter(Boolean)
  return {
    total: cards.length,
    seen: records.length,
    mastered: records.filter(record => record.level >= CARD_MASTERY).length,
    due: records.filter(record => record.dueAt <= now).length,
    fresh: cards.length - records.length,
  }
}

function shuffled(values, random) {
  const result = [...values]
  for (let i = result.length - 1; i > 0; i--) {
    const index = Math.floor(random() * (i + 1))
    ;[result[i], result[index]] = [result[index], result[i]]
  }
  return result
}

// Due cards first, then cards never seen, then whatever returns soonest. Shuffle picks at random instead.
export function roundCards(progress, deckId, { now = Date.now(), length = ROUND_LENGTH, random = Math.random } = {}) {
  const cards = deckCards(deckId)
  if (progress.settings?.shuffle) return shuffled(cards, random).slice(0, length)
  const rank = card => {
    const record = progress.records[card.id]
    if (!record) return [1, 0]
    return record.dueAt <= now ? [0, record.dueAt] : [2, record.dueAt]
  }
  return [...cards]
    .map((card, index) => ({ card, key: rank(card), index }))
    .sort((a, b) => a.key[0] - b.key[0] || a.key[1] - b.key[1] || a.index - b.index)
    .slice(0, length)
    .map(entry => entry.card)
}

export function cardQuestion(cardId, position, random = Math.random) {
  const card = byId(cardId)
  const kind = position % 2 === 0 ? 'define' : 'name'
  const pool = CARDS.filter(other => other.id !== card.id && other.deck === card.deck)
  const others = shuffled(pool.length >= 2 ? pool : CARDS.filter(other => other.id !== card.id), random).slice(0, 2)
  const label = other => kind === 'define' ? other.definition : other.term
  return {
    cardId: card.id, deck: card.deck, kind,
    prompt: kind === 'define' ? card.term : card.definition,
    options: shuffled([card, ...others], random).map(option => ({ id: option.id, label: label(option) })),
    correct: card.id,
  }
}

// Half the questions ask for the meaning, half for the term, so recall works both ways.
export function buildCardRound(progress, deckId, { now = Date.now(), random = Math.random, length = ROUND_LENGTH } = {}) {
  return roundCards(progress, deckId, { now, length, random }).map((card, index) => cardQuestion(card.id, index, random))
}

const minutesFor = (progress, grade) => grade === 'again' ? (progress.settings?.againMinutes ?? 1) : (progress.settings?.againMinutes ?? 1) * 5

export function gradeDelay(progress, cardId, grade) {
  if (grade === 'again' || grade === 'hard') return minutesFor(progress, grade) * MINUTE
  const previous = progress.records[cardId]
  const level = Math.min(CARD_MASTERY, (previous?.level ?? 0) + (grade === 'easy' ? 2 : 1))
  return INTERVALS[level] * DAY
}

export function gradeLabel(progress, cardId, grade) {
  const delay = gradeDelay(progress, cardId, grade)
  if (delay < DAY) return `${Math.round(delay / MINUTE)} min`
  const days = Math.round(delay / DAY)
  return `${days} day${days > 1 ? 's' : ''}`
}

export function gradeCard(progress, cardId, grade, now = Date.now()) {
  if (!byId(cardId) || !GRADES.includes(grade)) return progress
  const previous = progress.records[cardId]
  const level = grade === 'again' ? 0 : grade === 'hard' ? (previous?.level ?? 0) : Math.min(CARD_MASTERY, (previous?.level ?? 0) + (grade === 'easy' ? 2 : 1))
  return {
    ...progress,
    records: {
      ...progress.records,
      [cardId]: {
        level,
        dueAt: now + gradeDelay(progress, cardId, grade),
        seen: (previous?.seen ?? 0) + 1,
        correct: (previous?.correct ?? 0) + (grade === 'again' ? 0 : 1),
      },
    },
  }
}

export const deckName = deckId => DECKS.find(deck => deck.id === deckId)?.name ?? 'All decks'
