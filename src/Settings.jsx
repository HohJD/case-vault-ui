import { useEffect, useState } from 'react'
import { DownloadSimple } from '@phosphor-icons/react/DownloadSimple'
import { SpeakerSimpleHigh } from '@phosphor-icons/react/SpeakerSimpleHigh'
import { SpeakerSimpleSlash } from '@phosphor-icons/react/SpeakerSimpleSlash'
import { NAMESPACE_ORDER, summarizeNamespace } from './account-summary.js'
import PlanRow from './PlanRow.jsx'
import { loadStudyPlan, saveStudyPlan, setTarget, subscribeStudyPlan, weekProgress } from './study-plan.js'
import { playCorrect, setSoundOn, soundOn } from './sound.js'

function PracticeSection() {
  const [plan, setPlan] = useState(loadStudyPlan)
  useEffect(() => subscribeStudyPlan(() => setPlan(loadStudyPlan())), [])
  const [sound, setSound] = useState(() => soundOn())
  const step = kind => delta => {
    const updated = setTarget(plan, kind, plan.targets[kind] + delta)
    saveStudyPlan(updated)
    setPlan(updated)
  }
  const week = weekProgress(plan, Date.now())
  return <section className="settings-card surface" aria-labelledby="settings-practice">
    <h2 id="settings-practice">Practice</h2>
    <p className="settings-line">Weekly targets</p>
    <PlanRow label="Cases finished" done={week.cases.done} target={week.cases.target} onChange={step('cases')} />
    <PlanRow label="Drills checked" done={week.drills.done} target={week.drills.target} onChange={step('drills')} />
    <PlanRow label="Cards reviewed" done={week.cards.done} target={week.cards.target} onChange={step('cards')} />
    <div className="settings-sound">
      <button type="button" className="quiet-button" aria-pressed={sound} onClick={() => { setSoundOn(!sound); setSound(!sound); if (!sound) playCorrect() }}>{sound ? <SpeakerSimpleHigh size={16} aria-hidden="true" /> : <SpeakerSimpleSlash size={16} aria-hidden="true" />} Sound {sound ? 'on' : 'off'}</button>
    </div>
  </section>
}

// Every practice key lives in this browser's storage; nothing leaves the device.
const readLocal = () => Object.fromEntries(NAMESPACE_ORDER.map(namespace => {
  try { return [namespace, JSON.parse(localStorage.getItem(namespace))] } catch { return [namespace, null] }
}))

function DataSection({ active }) {
  const [data, setData] = useState(readLocal)
  useEffect(() => { if (active) setData(readLocal()) }, [active])
  const download = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), progress: data }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'case-vault-progress.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }
  return <section className="settings-card surface" aria-labelledby="settings-data">
    <h2 id="settings-data">Your data</h2>
    <p className="settings-line">Saved in this browser</p>
    <ul className="account-rows">
      {NAMESPACE_ORDER.map(namespace => {
        const summary = summarizeNamespace(namespace, data[namespace])
        return <li key={namespace} className="account-row">
          <div><strong>{summary.label}</strong>{summary.lines.map((line, index) => <span key={index} className="account-line">{line}</span>)}</div>
        </li>
      })}
    </ul>
    <button type="button" className="account-button" onClick={download}><DownloadSimple size={16} /> Download my data</button>
    <p className="account-footnote">Progress stays on this device. Clearing site data or switching browsers starts you fresh.</p>
  </section>
}

export default function Settings({ active }) {
  return <div className="settings screen-enter">
    <PracticeSection />
    <DataSection active={active} />
  </div>
}
