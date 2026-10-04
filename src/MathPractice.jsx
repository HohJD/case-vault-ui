import { useEffect, useReducer, useRef, useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react/ArrowLeft'
import { Trophy } from '@phosphor-icons/react/Trophy'
import { SkipForward } from '@phosphor-icons/react/SkipForward'
import { SpeakerSimpleHigh } from '@phosphor-icons/react/SpeakerSimpleHigh'
import { SpeakerSimpleSlash } from '@phosphor-icons/react/SpeakerSimpleSlash'
import { DEFAULT_SETTINGS, OPERATIONS, hasSingleQuestion, initialSession, isCorrectAnswer, sessionReducer, validateSettings } from './arithmetic.js'
import { playCorrect, playDone, setSoundOn, soundOn } from './sound.js'

const BEST_KEY = 'case-prep-brain-best-v1'
const BEST_EVENT = 'cases:brain-best'
const SHORT_NAMES = { addition: 'Add', subtraction: 'Subtract', multiplication: 'Multiply', division: 'Divide' }
const span = (values, from) => `${values[from]}–${values[from + 1]}`
const rangeSummary = settings => [
  settings.operations.some(id => ['addition', 'subtraction'].includes(id)) && `${span(settings.addition, 0)} + ${span(settings.addition, 2)}`,
  settings.operations.some(id => ['multiplication', 'division'].includes(id)) && `${span(settings.multiplication, 0)} × ${span(settings.multiplication, 2)}`,
].filter(Boolean).join(' · ')
const clock = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

function RangeControls({ group, title, settings, onChange, disabled }) {
  return <fieldset className="range-group" disabled={disabled}><legend>{title}</legend>
    <div className="range-expression">{[0, 2].map((offset, index) => <div className="range-part" key={offset}>
      {index === 1 && <span className="range-operator" aria-hidden="true">{group === 'addition' ? '+' : '×'}</span>}<div className="range-pair">
        <input type="number" aria-label={`${title}, ${index === 0 ? 'first' : 'second'} number minimum`} min={group === 'addition' ? 0 : 1} max={1000} step={1} required value={settings[group][offset]} onChange={event => onChange(group, offset, event.target.value)} />
        <span>to</span>
        <input type="number" aria-label={`${title}, ${index === 0 ? 'first' : 'second'} number maximum`} min={group === 'addition' ? 0 : 1} max={1000} step={1} required value={settings[group][offset + 1]} onChange={event => onChange(group, offset + 1, event.target.value)} />
      </div>
    </div>)}</div>
  </fieldset>
}

const wideQuery = '(min-width: 1024px)'

// Personal bests per settings combination, kept in this browser only.
const loadBests = () => {
  try { const data = JSON.parse(localStorage.getItem(BEST_KEY)); return data && typeof data === 'object' ? data : {} }
  catch { return {} }
}
function saveBest(session) {
  const bests = loadBests()
  const previous = bests[session.key]?.score ?? 0
  if (session.score <= previous) return false
  bests[session.key] = { score: session.score, settings: session.settings, at: Date.now() }
  try { localStorage.setItem(BEST_KEY, JSON.stringify(bests)) } catch {}
  window.dispatchEvent(new Event(BEST_EVENT))
  return true
}
const settingsLabel = settings => `${settings.duration % 60 === 0 ? `${settings.duration / 60} min` : `${settings.duration} sec`} · ${OPERATIONS.filter(operation => settings.operations.includes(operation.id)).map(operation => operation.symbol).join(' ')}`

function PersonalBests() {
  const [bests, setBests] = useState(loadBests)
  useEffect(() => {
    const update = () => setBests(loadBests())
    window.addEventListener(BEST_EVENT, update)
    return () => window.removeEventListener(BEST_EVENT, update)
  }, [])
  const rows = Object.values(bests).filter(entry => entry?.settings).sort((a, b) => b.score - a.score).slice(0, 10)
  return <div className="brain-side-panel">
    <h2 className="brain-side-title">Your bests</h2>
    {rows.length === 0 ? <p className="leaderboard-message">No rounds yet. Finish a full round to set your first best.</p> : <ol className="aside-board">{rows.map((entry, index) => <li key={index}><span className="aside-rank">{index + 1}</span><span className="aside-name">{settingsLabel(entry.settings)}<small>{new Date(entry.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</small></span><span className="aside-score">{entry.score}</span></li>)}</ol>}
  </div>
}

// Rendered by Cases in the shell's aside so the setup screen stays in the main column.
export function MathAside() {
  return <>
    <PersonalBests />
    <details className="brain-side-panel"><summary>How rounds work</summary><p>Questions are generated in your browser from the ranges you pick. Your best score for each combination of operations and duration is saved on this device.</p></details>
  </>
}

export default function MathPractice({ onPhaseChange, hideSide = false }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const validation = validateSettings(settings)
  const [session, dispatch] = useReducer(sessionReducer, initialSession)
  const [rangesOpen, setRangesOpen] = useState(false)
  const [sound, setSound] = useState(() => soundOn())
  const [newBest, setNewBest] = useState(false)
  const inputRef = useRef(null)
  const resultRef = useRef(null)
  // The desktop aside only mounts on wide screens.
  const [wide, setWide] = useState(() => window.matchMedia(wideQuery).matches)
  useEffect(() => {
    const query = window.matchMedia(wideQuery)
    const update = () => setWide(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  // The Cases shell drops its sidebar/tabs whenever a round or results are on screen.
  useEffect(() => { onPhaseChange?.(session.phase) }, [session.phase, onPhaseChange])
  useEffect(() => {
    if (session.phase !== 'playing') return
    if (!document.getElementById('cases-page')?.hidden) inputRef.current?.focus()
    const tick = () => dispatch({ type: 'tick', now: performance.now() })
    const interval = setInterval(tick, 100)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [session.phase])

  useEffect(() => {
    if (session.phase !== 'results') return
    playDone()
    setNewBest(!session.endedEarly && saveBest(session))
    if (!document.getElementById('cases-page')?.hidden) resultRef.current?.focus()
  }, [session.phase])

  const start = () => {
    if (validation) return
    dispatch({ type: 'start', now: performance.now(), settings: { ...settings, addition: settings.addition.map(Number), multiplication: settings.multiplication.map(Number) } })
  }
  const updateRange = (group, index, value) => setSettings(current => ({ ...current, [group]: current[group].map((number, position) => position === index ? value : number) }))
  const toggleOperation = id => setSettings(current => ({ ...current, operations: current.operations.includes(id) ? current.operations.filter(operation => operation !== id) : [...current.operations, id] }))
  const skip = () => { dispatch({ type: 'skip', now: performance.now() }); inputRef.current?.focus() }
  const answerChanged = value => {
    if (!/^\d*$/.test(value)) return
    if (isCorrectAnswer(value, session.question.answer)) playCorrect()
    dispatch({ type: 'answer', value, now: performance.now() })
  }
  const reset = () => dispatch({ type: 'setup' })
  const best = session.key ? loadBests()[session.key]?.score ?? 0 : 0

  return <div className="math-page">
    <div>
      {session.phase === 'setup' && <section className="brain-setup screen-enter" aria-labelledby="math-heading">
        <h1 className="sr-only" id="math-heading">Maths</h1>
        <div className="brain-setup-grid">
        <div className="brain-setup-main">
        <form className="setup-card" onSubmit={event => { event.preventDefault(); start() }}>
          <fieldset className="settings-controls">
            <legend className="sr-only">Round settings</legend>
            <fieldset className="operation-fieldset"><legend>Operations</legend><div className="operation-grid">{OPERATIONS.map(operation => <label key={operation.id} className={`operation-choice ${settings.operations.includes(operation.id) ? 'is-selected' : ''}`}>
              <input type="checkbox" aria-label={operation.name} checked={settings.operations.includes(operation.id)} onChange={() => toggleOperation(operation.id)} /><span className="op-symbol" aria-hidden="true">{operation.symbol}</span><span className="op-name" aria-hidden="true">{SHORT_NAMES[operation.id]}</span>
            </label>)}</div></fieldset>
            <fieldset className="duration-fieldset"><legend>Duration</legend><div className="duration-options">{[[30, '30s'], [60, '1 min'], [120, '2 min'], [300, '5 min']].map(([duration, label]) => <label key={duration} className={settings.duration === duration ? 'is-selected' : ''}><input type="radio" name="duration" checked={settings.duration === duration} onChange={() => setSettings(current => ({ ...current, duration }))} />{label}</label>)}</div></fieldset>
            <details className="range-details" open={rangesOpen || /range/i.test(validation)} onToggle={event => setRangesOpen(event.currentTarget.open)}>
              <summary><span>Number ranges</span><span className="range-summary">{rangeSummary(settings)}</span></summary>
              <div className="ranges-grid"><RangeControls group="addition" title="Addition & subtraction" settings={settings} onChange={updateRange} disabled={!settings.operations.some(id => ['addition', 'subtraction'].includes(id))} /><RangeControls group="multiplication" title="Multiplication & division" settings={settings} onChange={updateRange} disabled={!settings.operations.some(id => ['multiplication', 'division'].includes(id))} /></div>
              <p className="range-note">Subtraction and division use these ranges in reverse.</p>
            </details>
          </fieldset>
          {validation && <p className="settings-error" role="alert">{validation}</p>}
          {hasSingleQuestion(settings) && <p className="range-note" role="status">These ranges allow only one question. Widen them for variety.</p>}
          <button className="math-button start-button" type="submit" disabled={Boolean(validation)}>Start</button>
        </form>
        <div className="setup-footer">
          <button type="button" className="quiet-button" aria-pressed={sound} onClick={() => { setSoundOn(!sound); setSound(!sound); if (!sound) playCorrect() }}>{sound ? <SpeakerSimpleHigh size={16} aria-hidden="true" /> : <SpeakerSimpleSlash size={16} aria-hidden="true" />} Sound {sound ? 'on' : 'off'}</button>
        </div>
        </div>
        {wide && !hideSide && <aside className="brain-side"><MathAside /></aside>}
        </div>
      </section>}

      {session.phase === 'playing' && <section className="play-screen screen-enter" aria-labelledby="play-heading">
        <div className="round-topline"><h1 id="play-heading" className="sr-only">Maths round</h1><span className="question-counter">Question {String(session.score + session.skipped + 1).padStart(2, '0')}</span><button className="quiet-button" onClick={() => dispatch({ type: 'end', now: performance.now() })}>Finish <span aria-hidden="true">×</span></button></div>
        <div className="round-stats"><div><span>Correct<strong>{session.score}</strong></span></div><div className={session.remaining <= 10 ? 'timer urgent' : 'timer'} role="timer" aria-label={`${session.remaining} seconds remaining`}><span>Time left<strong>{clock(session.remaining)}</strong></span></div><div><span>Streak<strong>{session.streak}</strong></span></div></div>
        <div className="question-card">
          <div className="equation" aria-hidden="true" key={session.score + session.skipped}><span>{session.question.left}</span><span className="equation-symbol">{session.question.symbol}</span><span>{session.question.right}</span><span className="equals">=</span><span className="question-mark">?</span></div>
          <label className="sr-only" htmlFor="math-answer">{session.question.left} {session.question.operation === 'division' ? 'divided by' : session.question.operation === 'multiplication' ? 'times' : session.question.operation === 'subtraction' ? 'minus' : 'plus'} {session.question.right}. Your answer</label>
          <input ref={inputRef} id="math-answer" className="answer-input" type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" spellCheck={false} maxLength={8} placeholder="Your answer" value={session.answer} enterKeyHint="next" onChange={event => answerChanged(event.target.value)} aria-describedby="answer-help" />
          <p id="answer-help" className="answer-help" role="status">Type the answer. The next question appears when it’s right.</p>
          <button className="skip-button" onClick={skip}>Skip this one <SkipForward size={16} /></button>
          <span className="sr-only" aria-live="polite">{session.score > 0 ? `${session.score} correct. ` : ''}{session.question.left} {session.question.symbol} {session.question.right}</span>
        </div>
      </section>}

      {session.phase === 'results' && <section className="results-screen screen-enter" aria-labelledby="results-heading">
        <h1 id="results-heading" ref={resultRef} tabIndex={-1}>{session.endedEarly ? 'Round ended' : 'Round complete'}</h1>
        <div className="results-card"><span className="section-index">Your score</span><div className="result-score">{session.score}<span>correct answers</span></div>
          <div className="result-details"><div><strong>{session.skipped}</strong><span>Skipped</span></div><div><strong>{session.bestStreak}</strong><span>Best streak</span></div><div><strong>{(session.score / Math.max(1, (session.endedAt - session.startedAt) / 1000) * 60).toFixed(1)}</strong><span>Correct / min</span></div></div>
          <p className="result-context">{OPERATIONS.filter(operation => session.settings.operations.includes(operation.id)).map(operation => operation.symbol).join(' ')}<span>·</span>{Math.ceil((session.endedAt - session.startedAt) / 1000)} seconds played</p>
        </div>
        {!session.endedEarly && session.score > 0 && (newBest ? <p className="publish-success" role="status"><Trophy size={16} /> New personal best for these settings.</p> : <p className="results-note">Your best for these settings: {best}.</p>)}
        <div className="result-actions"><button className="math-button" onClick={start}>Play again</button><button className="quiet-button" onClick={reset}><ArrowLeft size={16} /> Change settings</button></div>
        {session.endedEarly && <p className="results-note">Finish the full round to count towards your best.</p>}
      </section>}
    </div>
  </div>
}
