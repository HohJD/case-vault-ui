import { CASE_MATH_LESSONS, makeCaseMathExercise } from './case-maths.js'

export const MATH_LESSON_PROGRESS_KEY = 'case-prep-case-maths-v1'
const empty = () => ({ version: 1, records: {}, session: null })
const knownLesson = id => CASE_MATH_LESSONS.some(item => item.id === id)
const integer = (value, min, max) => Number.isInteger(value) && value >= min && value <= max
const shuffled = (values, random) => {
  const result = [...values]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function mathLessonSummary(session) {
  const steps = makeCaseMathExercise(session.lessonId, session.variant).steps
  return { checked: session.cards.filter(card => card.checked).length, correct: session.cards.filter((card, index) => card.checked && card.answer === steps[index].correct).length, assisted: session.cards.filter(card => card.checked && card.assisted).length, variant: session.variant }
}

function finish(state) {
  const session = { ...state.session, finished: true }, last = mathLessonSummary(session), record = state.records[session.lessonId]
  return { ...state, session, records: { ...state.records, [session.lessonId]: { ...record, completed: record.completed + (last.checked === 3 ? 1 : 0), last } } }
}

export function mathLessonReducer(state, action) {
  if (action.type === 'start') {
    if (state.session && !state.session.finished || !knownLesson(action.lessonId)) return state
    const record = state.records[action.lessonId] ?? { started: 0, completed: 0, last: null }
    if (record.started >= 1000000) return state
    const exercise = makeCaseMathExercise(action.lessonId, record.started)
    const session = { lessonId: action.lessonId, variant: record.started, index: 0, finished: false, cards: exercise.steps.map(step => ({ answer: '', checked: false, revealed: !step.calculation, assisted: false, helpOpen: false, order: shuffled(step.options.map(option => option.id), action.random ?? Math.random) })) }
    return { ...state, records: { ...state.records, [action.lessonId]: { ...record, started: record.started + 1 } }, session }
  }
  const session = state.session
  if (!session || session.finished) return state
  if (action.type === 'end') return finish(state)
  if (action.type === 'study' && action.lessonId === session.lessonId || action.type === 'method') {
    return { ...state, session: { ...session, cards: session.cards.map((card, index) => card.checked ? card : { ...card, assisted: true, helpOpen: card.helpOpen || action.type === 'method' && index === session.index }) } }
  }
  const card = session.cards[session.index], step = makeCaseMathExercise(session.lessonId, session.variant).steps[session.index]
  if (action.type === 'next' && card.checked) return session.index === 2 ? finish(state) : { ...state, session: { ...session, index: session.index + 1 } }
  let next = card
  if (action.type === 'reveal' && !card.checked) next = { ...card, revealed: true }
  if (action.type === 'answer' && !card.checked && card.revealed && step.options.some(option => option.id === action.answer)) next = { ...card, answer: action.answer }
  if (action.type === 'check' && !card.checked && card.revealed && step.options.some(option => option.id === card.answer)) next = { ...card, checked: true }
  return next === card ? state : { ...state, session: { ...session, cards: session.cards.map((item, index) => index === session.index ? next : item) } }
}

function validSummary(summary) {
  return summary && integer(summary.checked, 0, 3) && integer(summary.correct, 0, summary.checked) && integer(summary.assisted, 0, summary.checked) && integer(summary.variant, 0, 999999)
}

function validSession(session) {
  if (!session || !knownLesson(session.lessonId) || !integer(session.variant, 0, 999999) || !integer(session.index, 0, 2) || typeof session.finished !== 'boolean' || !Array.isArray(session.cards) || session.cards.length !== 3) return false
  const steps = makeCaseMathExercise(session.lessonId, session.variant).steps
  return session.cards.every((card, index) => {
    const ids = steps[index].options.map(option => option.id)
    return card && ['checked', 'revealed', 'assisted', 'helpOpen'].every(key => typeof card[key] === 'boolean') && Array.isArray(card.order) && card.order.length === ids.length && new Set(card.order).size === ids.length && card.order.every(id => ids.includes(id)) && (card.answer === '' || ids.includes(card.answer)) && (!card.checked || card.revealed && card.answer !== '') && (index >= session.index || card.checked) && (index <= session.index || !card.checked) && (!card.helpOpen || card.assisted)
  })
}

export function loadMathLessonProgress(storage) {
  try {
    const saved = JSON.parse((storage ?? globalThis.localStorage).getItem(MATH_LESSON_PROGRESS_KEY))
    if (saved?.version !== 1) return empty()
    const state = empty()
    for (const { id } of CASE_MATH_LESSONS) {
      const record = saved.records?.[id]
      const completed = record?.completed ?? (record?.last?.checked === 3 ? 1 : 0)
      if (record && integer(record.started, 1, 1000000) && integer(completed, 0, record.started) && (record.last === null || validSummary(record.last) && record.last.variant < record.started)) state.records[id] = { ...record, completed }
    }
    if (validSession(saved.session)) {
      state.session = saved.session
      const record = state.records[state.session.lessonId] ?? { started: 0, completed: 0, last: null }
      state.records[state.session.lessonId] = { ...record, started: Math.max(record.started, state.session.variant + 1) }
    }
    return state
  } catch { return empty() }
}

export function saveMathLessonProgress(progress, storage) {
  try { (storage ?? globalThis.localStorage).setItem(MATH_LESSON_PROGRESS_KEY, JSON.stringify(progress)); return true }
  catch { return false }
}
