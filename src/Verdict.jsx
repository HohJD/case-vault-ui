import { CheckCircle } from '@phosphor-icons/react/CheckCircle'
import { XCircle } from '@phosphor-icons/react/XCircle'
import { verdictText } from './verdict.js'

export default function Verdict({ correct, partial, detail }) {
  const text = verdictText(correct, partial, detail)
  const split = text.indexOf('·')
  const label = split < 0 ? text : text.slice(0, split).trim()
  const extra = split < 0 ? null : text.slice(split + 1).trim()
  return <div className={`verdict ${correct ? 'verdict-correct' : 'verdict-wrong'}`} role="status" aria-live="polite">
    {correct ? <CheckCircle size={20} weight="fill" aria-hidden="true" /> : <XCircle size={20} weight="fill" aria-hidden="true" />}
    <span><strong>{label}</strong>{extra && <span className="verdict-detail"> · {extra}</span>}</span>
  </div>
}
