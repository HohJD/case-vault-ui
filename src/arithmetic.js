export const OPERATIONS = [
  { id: 'addition', name: 'Addition', symbol: '+', hint: 'Bring it together', colour: 'peach' },
  { id: 'subtraction', name: 'Subtraction', symbol: '−', hint: 'Take a little away', colour: 'lavender' },
  { id: 'multiplication', name: 'Multiplication', symbol: '×', hint: 'Think in multiples', colour: 'lime' },
  { id: 'division', name: 'Division', symbol: '÷', hint: 'Share it out', colour: 'blue' },
]

export const DEFAULT_SETTINGS = {
  operations: OPERATIONS.map(operation => operation.id),
  addition: [2, 100, 2, 100],
  multiplication: [2, 12, 2, 100],
  duration: 120,
}

export function validateSettings(settings) {
  if (!Array.isArray(settings?.operations) || !settings.operations.length || new Set(settings.operations).size !== settings.operations.length || settings.operations.some(id => !OPERATIONS.some(operation => operation.id === id))) return 'Choose at least one operation to play.'
  if (![30, 60, 120, 300].includes(settings.duration)) return 'Choose a round length.'
  for (const [group, operations, minimum] of [['addition', ['addition', 'subtraction'], 0], ['multiplication', ['multiplication', 'division'], 1]]) {
    if (!operations.some(id => settings.operations.includes(id))) continue
    if (!Array.isArray(settings[group])) return `Enter valid ${group} ranges.`
    const values = settings[group].map(value => !['number', 'string'].includes(typeof value) || String(value).trim() === '' ? NaN : Number(value))
    if (values.length !== 4 || values.some(value => !Number.isInteger(value) || value < minimum || value > 1000)) return `Use whole numbers from ${minimum} to 1,000 for ${group} ranges.`
    if (values[0] > values[1] || values[2] > values[3]) return `Each ${group} range must go from a smaller number to a larger one (or the same number).`
  }
  return ''
}

export function hasSingleQuestion(settings) {
  if (validateSettings(settings) || settings.operations.length !== 1) return false
  const group = ['addition', 'subtraction'].includes(settings.operations[0]) ? 'addition' : 'multiplication'
  const [minA, maxA, minB, maxB] = settings[group].map(Number)
  return minA === maxA && minB === maxB
}

export function createQuestion(settings, random = Math.random) {
  const operation = settings.operations[Math.floor(random() * settings.operations.length)]
  const group = ['addition', 'subtraction'].includes(operation) ? 'addition' : 'multiplication'
  const [minA, maxA, minB, maxB] = settings[group].map(Number)
  const a = minA + Math.floor(random() * (maxA - minA + 1))
  const b = minB + Math.floor(random() * (maxB - minB + 1))
  const [left, right, answer] = {
    addition: [a, b, a + b],
    subtraction: [a + b, b, a],
    multiplication: [a, b, a * b],
    division: [a * b, b, a],
  }[operation]
  return { left, right, answer, operation, symbol: OPERATIONS.find(item => item.id === operation).symbol }
}

export function isCorrectAnswer(value, answer) {
  return /^\d+$/.test(value) && Number(value) === answer
}

export function bestScoreKey(settings) {
  return JSON.stringify([
    [...settings.operations].sort(),
    settings.duration,
    settings.operations.some(id => ['addition', 'subtraction'].includes(id)) ? settings.addition.map(Number) : null,
    settings.operations.some(id => ['multiplication', 'division'].includes(id)) ? settings.multiplication.map(Number) : null,
  ])
}

export const initialSession = { phase: 'setup' }

export function sessionReducer(state, action) {
  if (action.type === 'setup') return initialSession
  if (action.type === 'start') {
    if (validateSettings(action.settings)) return state
    return {
      phase: 'playing', settings: action.settings, key: bestScoreKey(action.settings),
      startedAt: action.now, deadline: action.now + action.settings.duration * 1000,
      remaining: action.settings.duration, question: createQuestion(action.settings),
      answer: '', score: 0, skipped: 0, streak: 0, bestStreak: 0, endedEarly: false,
    }
  }
  if (state.phase !== 'playing') return state
  if (action.now >= state.deadline) return { ...state, phase: 'results', remaining: 0, endedAt: state.deadline }
  if (action.type === 'end') return { ...state, phase: 'results', endedAt: action.now, endedEarly: true }
  if (action.type === 'tick') {
    const remaining = Math.ceil((state.deadline - action.now) / 1000)
    return remaining === state.remaining ? state : { ...state, remaining }
  }
  if (action.type === 'skip') return { ...state, question: createQuestion(state.settings), answer: '', skipped: state.skipped + 1, streak: 0 }
  if (action.type === 'answer') {
    if (!isCorrectAnswer(action.value, state.question.answer)) return { ...state, answer: action.value }
    return {
      ...state, question: createQuestion(state.settings), answer: '', score: state.score + 1,
      streak: state.streak + 1, bestStreak: Math.max(state.bestStreak, state.streak + 1),
    }
  }
  return state
}
