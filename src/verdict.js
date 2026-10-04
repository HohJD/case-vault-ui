export function verdictText(correct, partial, detail) {
  const label = correct ? 'Correct' : 'Incorrect'
  const extra = !correct && partial ? `${partial.got} of ${partial.of} right` : detail
  return extra ? `${label} · ${extra}` : label
}
