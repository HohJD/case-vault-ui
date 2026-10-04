import { CASES } from './casebook.js'
import { CASE_RECALL } from './case-recall.js'

export const QUIZ_MIN_CASES = 3
export const QUIZ_LENGTH = 6

function shuffled(values, random) {
  const result = [...values]
  for (let i = result.length - 1; i > 0; i--) {
    const index = Math.floor(random() * (i + 1))
    ;[result[i], result[index]] = [result[index], result[i]]
  }
  return result
}

// Distractors for card-level questions come only from other finished cases, so unplayed cases are never spoiled.
const cardQuestion = (kind, prompt, field) => (item, others, random) => {
  const options = shuffled([item, ...shuffled(others, random).slice(0, 2)], random).map(other => ({ id: other.id, label: CASE_RECALL[other.id][field] }))
  return { kind, caseId: item.id, prompt: prompt(item), options, correct: item.id }
}

const stepQuestion = (kind, prompt, pickStep) => (item, _others, random) => {
  const { options, correct } = pickStep(item)
  return { kind, caseId: item.id, prompt: prompt(item), options: shuffled(options.map(option => ({ id: option.id, label: option.label, feedback: option.feedback })), random), correct }
}

const QUESTION_TYPES = [
  cardQuestion('takeaway', item => `Which lesson belongs to “${item.title}”?`, 'takeaway'),
  cardQuestion('number', item => `Which key number comes from “${item.title}”?`, 'keyNumber'),
  cardQuestion('trap', item => `Which is the common trap in “${item.title}”?`, 'trap'),
  stepQuestion('opening', item => `“${item.title}”: what is the strongest first question?`, item => item.steps[0]),
  stepQuestion('action', item => `“${item.title}”: which action is best supported?`, item => {
    const part = item.steps[4].parts.find(part => part.id === 'action')
    return { options: part.options, correct: part.correct }
  }),
]

export function buildRecallQuiz(finishedIds, { random = Math.random, length = QUIZ_LENGTH } = {}) {
  const finished = CASES.filter(item => finishedIds.includes(item.id))
  if (finished.length < QUIZ_MIN_CASES) return []
  // Spread questions across cases first, then vary the question type.
  const order = shuffled(finished, random)
  const types = shuffled(QUESTION_TYPES, random)
  return Array.from({ length }, (_, index) => {
    const item = order[index % order.length]
    const make = types[(index + Math.floor(index / order.length)) % types.length]
    return make(item, finished.filter(other => other.id !== item.id), random)
  })
}

export const recallExplanation = (question, item) => question.kind === 'opening' || question.kind === 'action'
  ? question.options.find(option => option.id === question.correct).feedback
  : CASE_RECALL[item.id].takeaway
