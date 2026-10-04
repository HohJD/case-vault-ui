import { INTERVIEW_CHECKLIST } from './interview-guide.js'
import { INDUSTRIES } from './industries.js'
import { CASES } from './casebook.js'
import { MASTERY_LEVEL, dueCases, masteryLevel } from './case-practice.js'
import { frameworkStats } from './framework-practice.js'
import { CASE_MATH_LESSONS } from './case-maths.js'
import { deckStats } from './flashcard-practice.js'
import { streak, weekProgress } from './study-plan.js'

export const NAMESPACE_ORDER = ['case-prep-cases-v2', 'case-prep-frameworks-v1', 'case-prep-case-maths-v1', 'case-prep-flashcards-v1', 'case-prep-industries-v1', 'case-prep-interview-v1', 'case-prep-plan-v1']

const plural = (n, word, words) => `${n} ${n === 1 ? word : (words ?? `${word}s`)}`
const nothing = label => ({ label, lines: ['Nothing saved yet.'] })

// One compact summary per practice key for the Settings page. Stored
// data may be partial or malformed, so every path degrades to "Nothing saved".
export function summarizeNamespace(namespace, data, now = Date.now()) {
  try {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return nothing(labelFor(namespace))
    if (namespace === 'case-prep-cases-v2') {
      const records = data.records && typeof data.records === 'object' ? data.records : {}
      const mastered = CASES.filter(item => masteryLevel(records[item.id]) >= MASTERY_LEVEL).length
      const practised = CASES.filter(item => records[item.id]).length
      if (!practised && !Object.keys(data.drafts ?? {}).length) return nothing('Full cases')
      const lines = [`${mastered} of ${CASES.length} mastered · ${practised} practised`]
      const drafts = Object.keys(data.drafts ?? {}).length
      if (drafts) lines.push(plural(drafts, 'paused draft'))
      const due = dueCases(data, now).length
      if (due) lines.push(plural(due, 'recall') + ' due')
      return { label: 'Full cases', lines }
    }
    if (namespace === 'case-prep-frameworks-v1') {
      if (!data.records || typeof data.records !== 'object' || !Object.keys(data.records).length) return nothing('Framework drills')
      const stats = frameworkStats(data, undefined, now)
      const lines = [`${stats.spaced} of ${stats.total} drills on spaced recall`]
      if (stats.due > 0) lines.push(`${stats.due} due`)
      return { label: 'Framework drills', lines }
    }
    if (namespace === 'case-prep-case-maths-v1') {
      const records = data.records && typeof data.records === 'object' ? data.records : {}
      const completed = CASE_MATH_LESSONS.filter(lesson => records[lesson.id]?.completed > 0).length
      if (!completed && !data.session) return nothing('Case maths')
      const lines = [`${completed} of ${CASE_MATH_LESSONS.length} lessons completed`]
      if (data.session && !data.session.finished) lines.push('Unfinished practice saved')
      return { label: 'Case maths', lines }
    }
    if (namespace === 'case-prep-flashcards-v1') {
      if (!data.records || typeof data.records !== 'object' || !Object.keys(data.records).length) return nothing('Cards')
      const stats = deckStats(data, null, now)
      const lines = [`${stats.mastered} of ${stats.total} cards mastered`]
      if (stats.due > 0) lines.push(`${stats.due} due`)
      return { label: 'Cards', lines }
    }
    if (namespace === 'case-prep-industries-v1') {
      const read = Object.keys(data.records ?? {}).filter(id => INDUSTRIES.some(item => item.id === id)).length
      if (!read) return nothing('Sector notes')
      return { label: 'Sector notes', lines: [`${read} of ${INDUSTRIES.length} notes read`] }
    }
    if (namespace === 'case-prep-interview-v1') {
      const done = INTERVIEW_CHECKLIST.filter(item => data.records?.[item.id]?.done).length
      if (!done) return nothing('Interview prep')
      return { label: 'Interview prep', lines: [`${done} of ${INTERVIEW_CHECKLIST.length} answers and stories prepared`] }
    }
    if (namespace === 'case-prep-plan-v1') {
      if (!data.log || typeof data.log !== 'object' || !Object.keys(data.log).length) return nothing('This week')
      const week = weekProgress({ targets: { cases: 3, drills: 10, cards: 30 }, ...data }, now)
      const days = streak({ targets: { cases: 3, drills: 10, cards: 30 }, ...data }, now)
      const lines = [`${week.cases.done} cases · ${week.drills.done} drills · ${week.cards.done} cards this week`]
      if (days > 0) lines.push(`${days}-day streak`)
      return { label: 'This week', lines }
    }
    return nothing(labelFor(namespace))
  } catch { return nothing(labelFor(namespace)) }
}

function labelFor(namespace) {
  return {
    'case-prep-cases-v2': 'Full cases',
    'case-prep-frameworks-v1': 'Framework drills',
    'case-prep-case-maths-v1': 'Case maths',
    'case-prep-flashcards-v1': 'Cards',
    'case-prep-plan-v1': 'This week',
    'case-prep-industries-v1': 'Sector notes',
    'case-prep-interview-v1': 'Interview prep',
  }[namespace] ?? namespace
}

export function relativeTime(then, now = Date.now()) {
  const elapsed = now - then
  if (!Number.isFinite(elapsed) || elapsed < 45000) return 'just now'
  const minutes = Math.round(elapsed / 60000)
  if (minutes < 60) return plural(minutes, 'minute') + ' ago'
  const hours = Math.round(elapsed / 3600000)
  if (hours < 24) return plural(hours, 'hour') + ' ago'
  const days = Math.round(elapsed / 86400000)
  if (days <= 1) return 'yesterday'
  if (days < 7) return plural(days, 'day') + ' ago'
  return new Date(then).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}
