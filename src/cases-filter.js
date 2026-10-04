import { caseStatus } from './case-practice.js'

const LEVEL_ORDER = { Foundation: 0, Intermediate: 1, Advanced: 2 }
const STATUS_ORDER = { due: 0, draft: 1, learning: 2, new: 3, mastered: 4 }

export function filterCases(cases, progress, { search = '', category = 'all', status = 'all', level = 'all', sector = 'all' } = {}) {
  const query = search.trim().toLowerCase()
  return cases.filter(item =>
    (!query || [item.title, item.focus, item.sector].some(field => field.toLowerCase().includes(query)))
    && (category === 'all' || item.category === category)
    && (status === 'all' || caseStatus(progress, item) === status)
    && (level === 'all' || item.level === level)
    && (sector === 'all' || item.sector === sector))
}

export function sortCases(list, progress, order = 'library') {
  const copy = [...list]
  if (order === 'title') return copy.sort((a, b) => a.title.localeCompare(b.title))
  if (order === 'difficulty') return copy.sort((a, b) => (LEVEL_ORDER[a.level] ?? 0) - (LEVEL_ORDER[b.level] ?? 0))
  if (order === 'status') return copy.sort((a, b) => (STATUS_ORDER[caseStatus(progress, a)] ?? 0) - (STATUS_ORDER[caseStatus(progress, b)] ?? 0))
  return copy
}
