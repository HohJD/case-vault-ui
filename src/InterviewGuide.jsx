import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react/ArrowRight'
import { CheckCircle } from '@phosphor-icons/react/CheckCircle'
import { Circle } from '@phosphor-icons/react/Circle'
import { INTERVIEW_CHECKLIST, INTERVIEW_PARTS, INTERVIEW_PREP } from './interview-guide.js'
import { interviewDone, loadInterviewProgress, setInterviewItem } from './interview-progress.js'
import './interview.css'

export default function InterviewGuide({ active = true, onOpenSection }) {
  const [progress, setProgress] = useState(loadInterviewProgress)
  const [partId, setPartId] = useState(INTERVIEW_PARTS[0].id)
  const headingRef = useRef(null)
  const part = INTERVIEW_PARTS.find(item => item.id === partId)
  const items = INTERVIEW_CHECKLIST.filter(item => item.part === partId)
  const done = interviewDone(progress, INTERVIEW_CHECKLIST.map(item => item.id))

  // Reload ticks whenever the tab comes back into view.
  useEffect(() => { if (active) setProgress(loadInterviewProgress()) }, [active])
  useEffect(() => { if (active) headingRef.current?.focus({ preventScroll: true }) }, [active])

  const toggle = id => setProgress(current => setInterviewItem(current, id, !current.records[id]?.done))

  return <section className="interview screen-enter" aria-label="Interview guide">
    <h2 className="sr-only" ref={headingRef} tabIndex={-1}>Interview guide</h2>
    <header className="interview-head">
      <div>
        <span className="case-eyebrow">The whole interview, not just the case</span>
        <p>Top firms run interviews in four parts. Work through each one and tick an item once you can say it out loud, without notes.</p>
      </div>
      <p className="interview-count" aria-live="polite"><strong>{done}</strong> of {INTERVIEW_CHECKLIST.length} ready<span className="industry-read-bar" aria-hidden="true"><span style={{ width: `${done / INTERVIEW_CHECKLIST.length * 100}%` }} /></span></p>
    </header>

    <ol className="interview-parts" role="tablist" aria-label="Parts of the interview">{INTERVIEW_PARTS.map((item, index) => {
      const own = INTERVIEW_CHECKLIST.filter(entry => entry.part === item.id)
      const ready = interviewDone(progress, own.map(entry => entry.id))
      return <li key={item.id}>
        <button role="tab" aria-selected={item.id === partId} onClick={() => setPartId(item.id)}>
          <span className="interview-part-num" aria-hidden="true">{index + 1}</span>
          <span><strong>{item.title}</strong><small>{ready}/{own.length} ready</small></span>
        </button>
      </li>
    })}</ol>

    <div className="interview-body" role="tabpanel" aria-label={part.title}>
      <div className="interview-main">
        <p className="interview-tests"><span>What it tests</span>{part.tests}</p>
        <h3>What to expect</h3>
        <ul className="industry-list">{part.about.map(point => <li key={point}>{point}</li>)}</ul>
        <h3>How to answer well</h3>
        <ul className="industry-list">{part.how.map(point => <li key={point}>{point}</li>)}</ul>
        {part.links && <div className="interview-links">{part.links.map(([id, label]) => <button key={id} type="button" className="quiet-button" onClick={() => onOpenSection?.(id)}>{label} <ArrowRight size={15} /></button>)}</div>}
      </div>
      <div className="interview-checklist">
        <h3>Prepare and rehearse</h3>
        <ul>{items.map(item => {
          const checked = Boolean(progress.records[item.id]?.done)
          return <li key={item.id}>
            <button type="button" role="checkbox" aria-checked={checked} className={checked ? 'done' : ''} onClick={() => toggle(item.id)}>
              {checked ? <CheckCircle size={22} weight="fill" aria-hidden="true" /> : <Circle size={22} aria-hidden="true" />}
              <span>{item.label}</span>
            </button>
          </li>
        })}</ul>
      </div>
    </div>

    <details className="interview-prep">
      <summary>How to prepare</summary>
      <ul className="industry-list">{INTERVIEW_PREP.map(point => <li key={point}>{point}</li>)}</ul>
    </details>
  </section>
}
