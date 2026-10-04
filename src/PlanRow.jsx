import { Minus } from '@phosphor-icons/react/Minus'
import { Plus } from '@phosphor-icons/react/Plus'

export default function PlanRow({ label, done, target, onChange }) {
  const met = done >= target
  return <div className="plan-row">
    <span className="plan-label">{label}</span>
    <span className={`plan-bar${met ? ' plan-met' : ''}`} role="progressbar" aria-valuenow={Math.min(done, target)} aria-valuemin={0} aria-valuemax={target} aria-label={`${label}: ${done} of ${target}`}><span style={{ width: `${Math.min(100, done / target * 100)}%` }} /></span>
    <span className="plan-count">{done} of {target}</span>
    <span className="plan-steppers">
      <button type="button" aria-label={`Lower the ${label.toLowerCase()} target`} disabled={target <= 1} onClick={() => onChange(-1)}><Minus size={15} /></button>
      <button type="button" aria-label={`Raise the ${label.toLowerCase()} target`} onClick={() => onChange(1)}><Plus size={15} /></button>
    </span>
  </div>
}
