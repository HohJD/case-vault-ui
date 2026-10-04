import test from 'node:test'
import assert from 'node:assert/strict'
import { CASES } from './casebook.js'
import { INDUSTRIES } from './industries.js'
import { CARDS, DECKS } from './flashcards.js'
import { readFileSync } from 'node:fs'
import { notes, playCorrect, playDone, setSoundOn, soundOn } from './sound.js'

// CardFigure is JSX, which the node test runner cannot import, so read the keys it defines.
const FIGURE_KEYS = [...readFileSync(new URL('./CardFigure.jsx', import.meta.url), 'utf8').matchAll(/^ {2}'?([a-z-]+)'?: \{$/gm)].map(match => match[1])
import { AGAIN_CHOICES, CARD_MASTERY, FLASHCARD_KEY, GRADES, ROUND_LENGTH, buildCardRound, cardQuestion, deckStats, gradeCard, gradeLabel, loadFlashcards, roundCards, saveFlashcards, setSetting } from './flashcard-practice.js'

const MINUTE = 60000
const DAY = 86400000
const memory = () => {
  const data = new Map()
  return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
}
const fresh = () => loadFlashcards(memory())
const seeded = seed => { let value = seed; return () => (value = (value * 16807) % 2147483647) / 2147483647 }

test('sector notes are complete and only link to cases that exist', () => {
  assert.equal(new Set(INDUSTRIES.map(item => item.id)).size, INDUSTRIES.length)
  assert.equal(INDUSTRIES.length, 34, 'one note per industry report in the 2026-27 prep book')
  const texts = []
  const walk = value => typeof value === 'string' ? texts.push(value) : Array.isArray(value) ? value.forEach(walk) : value && typeof value === 'object' ? Object.values(value).forEach(walk) : null
  for (const industry of INDUSTRIES) {
    assert.ok(industry.name && industry.summary && industry.tag && industry.editions?.length && industry.source?.length, industry.id)
    for (const key of ['overview', 'segments', 'valueChain', 'pestel', 'kpis', 'terms', 'growth', 'challenges', 'models', 'facts', 'news']) assert.ok(industry[key]?.length >= 1, `${industry.id}: ${key}`)
    assert.ok(industry.valueChain.length >= 5 && industry.valueChain.every(stage => stage.stage && stage.items.length), `${industry.id}: value chain`)
    assert.ok(['Revenue drivers', 'Cost drivers'].every(title => industry.drivers.some(group => group.title === title && group.items.length)), `${industry.id}: drivers`)
    for (const pair of [...industry.kpis, ...industry.terms, ...industry.models, ...industry.pestel]) assert.ok(pair.term && pair.note, industry.id)
    assert.equal(industry.forces.length, 5, industry.id)
    for (const force of industry.forces) assert.match(force.level, /^(Low|Low to medium|Medium|High)$/)
    for (const id of industry.caseIds) assert.ok(CASES.some(item => item.id === id), `${industry.id} links to a missing case: ${id}`)
    const { source, ...content } = industry
    walk(content)
  }
  for (const text of texts) assert.doesNotMatch(text, /—/, `avoid em dashes: ${text}`)
})

test('every flashcard belongs to a deck and carries a definition and a trap', () => {
  assert.equal(new Set(CARDS.map(card => card.id)).size, CARDS.length)
  assert.ok(CARDS.length >= 500, 'the decks should be worth coming back to')
  for (const card of CARDS) {
    assert.ok(DECKS.some(deck => deck.id === card.deck), card.id)
    assert.ok(card.term && card.definition && card.trap, card.id)
    assert.ok(card.definition.length >= (card.deck === 'vocab' ? 30 : 60), `${card.id}: explain it properly`)
    if (card.deck === 'vocab') assert.ok(card.short && card.example && card.trap, `${card.id}: a word needs its part of speech, a sentence and the word it is confused with`)
    for (const text of [card.term, card.definition, card.trap, card.short ?? '', card.example ?? '']) assert.doesNotMatch(text, /—/, `${card.id}: avoid em dashes`)
    if (card.figure) assert.ok(FIGURE_KEYS.includes(card.figure), `${card.id}: unknown figure ${card.figure}`)
  }
  for (const deck of DECKS) assert.ok(CARDS.filter(card => card.deck === deck.id).length >= 20, `${deck.id} needs enough cards`)
  assert.ok(CARDS.filter(card => card.example).length >= 300, 'most cards deserve an example')
  assert.ok(FIGURE_KEYS.every(key => CARDS.some(card => card.figure === key)), 'every diagram is used by a card')
})

test('sound is on by default, can be switched off, and never throws without audio', async () => {
  const store = new Map()
  const storage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) }
  assert.equal(soundOn(storage), true)
  assert.ok(setSoundOn(false, storage))
  assert.equal(soundOn(storage), false)
  assert.ok(setSoundOn(true, storage))
  assert.equal(soundOn(storage), true)
  const broken = { getItem: () => { throw Error('blocked') }, setItem: () => { throw Error('blocked') } }
  assert.equal(soundOn(broken), true, 'sound still works when storage is blocked')
  assert.equal(setSoundOn(false, broken), false)
  for (const kind of ['correct', 'wrong', 'done']) assert.ok(notes(kind).length >= 1)
  assert.deepEqual(notes('unknown'), [])
  // No AudioContext in Node: the helpers must return false instead of throwing.
  assert.equal(playCorrect(), false)
  assert.equal(playDone(), false)
})

test('rounds put due cards first, ask both directions, and shuffle on request', () => {
  const now = 10 * DAY
  let progress = fresh()
  const [first, second] = CARDS
  progress = gradeCard(progress, first.id, 'good', now - 9 * DAY)
  progress = gradeCard(progress, second.id, 'good', now)
  assert.equal(roundCards(progress, null, { now })[0].id, first.id, 'the overdue card leads')
  assert.ok(!roundCards(progress, null, { now }).some(card => card.id === second.id), 'a card not yet due waits')
  const round = buildCardRound(progress, null, { now, random: seeded(3) })
  assert.equal(round.length, ROUND_LENGTH)
  assert.deepEqual([round[0].kind, round[1].kind], ['define', 'name'])
  for (const question of round) {
    assert.equal(question.options.length, 3)
    assert.equal(question.options.filter(option => option.id === question.correct).length, 1)
    assert.equal(new Set(question.options.map(option => option.id)).size, 3)
  }
  const ordered = roundCards(progress, 'finance', { now }).map(card => card.id)
  const shuffledRound = roundCards(setSetting(progress, 'shuffle', true), 'finance', { now, random: seeded(11) }).map(card => card.id)
  assert.notDeepEqual(shuffledRound, ordered)
  assert.equal(new Set(shuffledRound).size, shuffledRound.length)
})

test('the learner chooses when a card returns, and Again resets mastery', () => {
  const now = DAY
  let progress = fresh()
  const id = CARDS[0].id
  assert.deepEqual(GRADES.map(grade => gradeLabel(progress, id, grade)), ['1 min', '5 min', '3 days', '7 days'])
  progress = setSetting(progress, 'againMinutes', 10)
  assert.deepEqual(GRADES.slice(0, 2).map(grade => gradeLabel(progress, id, grade)), ['10 min', '50 min'])
  assert.ok(AGAIN_CHOICES.includes(10))
  const again = gradeCard(progress, id, 'again', now)
  assert.deepEqual([again.records[id].level, again.records[id].dueAt - now], [0, 10 * MINUTE])
  let good = gradeCard(fresh(), id, 'good', now)
  assert.deepEqual([good.records[id].level, good.records[id].dueAt - now], [1, 3 * DAY])
  good = gradeCard(good, id, 'easy', good.records[id].dueAt)
  assert.equal(good.records[id].level, CARD_MASTERY)
  assert.equal(gradeCard(good, id, 'again', now).records[id].level, 0, 'Again sends a mastered card back to the start')
  assert.equal(gradeCard(good, 'not-a-card', 'good', now), good)
  assert.equal(gradeCard(good, id, 'sort-of', now), good)
})

test('flashcard progress round-trips and survives blocked or broken storage', () => {
  const storage = memory()
  let progress = gradeCard(setSetting(fresh(), 'shuffle', true), CARDS[0].id, 'good')
  assert.ok(saveFlashcards(progress, storage))
  assert.deepEqual(loadFlashcards(storage), progress)
  storage.setItem(FLASHCARD_KEY, '{"version":1,"records":{"nope":{"level":9,"dueAt":0,"seen":1}}}')
  assert.deepEqual(loadFlashcards(storage).records, {})
  storage.setItem(FLASHCARD_KEY, 'not json')
  assert.deepEqual(loadFlashcards(storage).records, {})
  assert.equal(saveFlashcards(progress, { setItem: () => { throw Error('blocked') } }), false)
  const stats = deckStats(gradeCard(fresh(), CARDS[0].id, 'good', 0), CARDS[0].deck, DAY * 30)
  assert.equal(stats.due, 1)
  assert.equal(stats.seen, 1)
  assert.equal(cardQuestion(CARDS[0].id, 1, seeded(5)).kind, 'name')
})
