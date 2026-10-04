import { useEffect, useReducer, useRef, useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react/ArrowLeft'
import { ArrowRight } from '@phosphor-icons/react/ArrowRight'
import { BookOpen } from '@phosphor-icons/react/BookOpen'
import { Lightbulb } from '@phosphor-icons/react/Lightbulb'
import { CASES } from './casebook.js'
import { FRAMEWORKS, FRAMEWORK_DRILLS } from './frameworks.js'
import { frameworkCardCorrect, frameworkForDrill, frameworkQuestion, frameworkReducer, frameworkRoundSummary, frameworkStats, loadFrameworkProgress, saveFrameworkProgress } from './framework-practice.js'
import { recordActivity } from './study-plan.js'
import { playCorrect, playWrong } from './sound.js'
import Verdict from './Verdict.jsx'
import './frameworks.css'

const groups = ['All', ...new Set(FRAMEWORKS.map(item => item.group))]

function MethodCard({ framework }) {
  return <div className="framework-method">
    <p className="framework-principle">{framework.insight}</p>
    <h3>When it helps</h3><p>{framework.when}</p>
    <h3>Build the analysis</h3><ol>{framework.steps.map(step => <li key={step}>{step}</li>)}</ol>
    <div className="framework-formula">{framework.formula}</div>
    {framework.lens && <><h3>A useful lens, not a script</h3><p>{framework.lens}</p></>}
    <div className="framework-trap"><strong>Watch out</strong><p>{framework.trap}</p></div>
    <h3>A useful client question</h3><p>{framework.ask}</p>
  </div>
}

function DrillFeedback({ card, framework }) {
  const q = frameworkQuestion(card)
  const correct = frameworkCardCorrect(card)
  const chosen = q.options.find(option => option.id === card.answer)
  return <section className={`case-feedback ${correct ? 'correct-feedback' : 'review-feedback'}`} aria-label="Drill feedback">
    <Verdict correct={correct} /><p>{chosen?.feedback}</p>
    {!correct && <><p className="verdict-answer"><strong>Correct answer:</strong> {q.options.find(option => option.id === q.correct).label}</p><p>{q.explanation}</p></>}
    {card.assisted && <p className="case-muted">Method-assisted: this check does not advance spaced recall.</p>}
  </section>
}

export default function Frameworks({ active = true, onOpenCase }) {
  const [progress, dispatch] = useReducer(frameworkReducer, undefined, () => loadFrameworkProgress())
  const [view, setView] = useState('library')
  const [group, setGroup] = useState('All')
  const [guideId, setGuideId] = useState(FRAMEWORKS[0].id)
  const [storageWarning, setStorageWarning] = useState(false)
  const headingRef = useRef(null)
  const feedbackRef = useRef(null)
  const session = progress.session
  const running = Boolean(session && !session.finished)
  const card = session?.cards[session.index]
  const q = card ? frameworkQuestion(card) : null
  const framework = view === 'guide' ? FRAMEWORKS.find(item => item.id === guideId) : card ? frameworkForDrill(card.drillId) : null
  const stats = frameworkStats(progress)
  const summary = session ? frameworkRoundSummary(session) : null

  useEffect(() => { if (!saveFrameworkProgress(progress)) setStorageWarning(true) }, [progress])
  useEffect(() => {
    if (!active) return
    headingRef.current?.focus({ preventScroll: true })
    headingRef.current?.scrollIntoView({ block: 'nearest' })
  }, [active, view, guideId, session?.id, session?.index])

  const start = (mode = 'mix', frameworkId) => {
    if (!running && (mode === 'review' && !stats.due || mode === 'retry' && !summary?.retryIds.length)) return
    dispatch({ type: 'start', options: { mode, frameworkId } })
    setView('session')
  }
  const guide = id => { dispatch({ type: 'study', frameworkId: id }); setGuideId(id); setView('guide') }
  const check = event => {
    event.preventDefault()
    frameworkCardCorrect(session.cards[session.index]) ? playCorrect() : playWrong()
    dispatch({ type: 'check' })
    recordActivity('drills')
    requestAnimationFrame(() => feedbackRef.current?.scrollIntoView({ block: 'nearest' }))
  }
  const next = () => { dispatch({ type: 'next' }); if (session.index === session.cards.length - 1) setView('results') }

  return <section className="frameworks" aria-label="Framework insights and practice">
    {storageWarning && <p className="case-storage-warning" role="status">Browser storage is unavailable. This practice progress lasts only until you reload or close the page.</p>}
    {view === 'library' && <>
      <h2 className="sr-only" ref={headingRef} tabIndex={-1}>Framework drills</h2>
      {running && <div className="framework-resume"><div><strong>Your round is saved</strong><p>Drill {session.index + 1} of {session.cards.length}</p></div><button className="math-button" onClick={() => setView('session')}>Continue <ArrowRight size={16} /></button></div>}
      {!running && <div className="framework-round-actions"><button className="math-button" onClick={() => start('mix')}>Start a 6-drill round <ArrowRight size={16} /></button>{stats.due > 0 && <button className="case-start-button" onClick={() => start('review')}>Review due ({stats.due})</button>}{session?.finished && <button className="quiet-button" onClick={() => setView('results')}>Last round</button>}</div>}
      <p className="framework-small">{stats.spaced}/{stats.total} drills recalled over time{stats.due ? ` · ${stats.due} due` : ''}</p>
      <div className="case-filters" role="group" aria-label="Filter frameworks">{groups.map(value => <button key={value} aria-pressed={group === value} onClick={() => setGroup(value)}>{value}</button>)}</div>
      <div className="framework-grid">{FRAMEWORKS.filter(item => group === 'All' || item.group === group).map(item => {
        const own = frameworkStats(progress, item.id)
        return <article className="framework-card" key={item.id} aria-labelledby={`framework-${item.id}`}><span className="case-category">{item.group}</span><h3 id={`framework-${item.id}`}>{item.title}</h3><p>{item.insight}</p>{own.practised > 0 && <div className="framework-card-progress"><span>{own.practised}/{own.total} practised · {own.spaced}/{own.total} recalled{own.due ? ` · ${own.due} due` : ''}</span></div>}<div className="framework-card-actions"><button className="quiet-button" onClick={() => guide(item.id)}><BookOpen size={15} /> Method</button><button className="case-start-button" disabled={running} onClick={() => start('framework', item.id)}>Practise {own.total} drills</button></div></article>
      })}</div>
      <details className="case-method"><summary>How repetition works here</summary><ul><li>Each drill has two scenario variants; retries switch context. Quantitative drills also vary their figures.</li><li>A mixed round prioritises due checks, then new methods, then less-recent practice. It mixes frameworks instead of drilling one answer repeatedly.</li><li>Wrong or method-assisted checks return to the review queue. A successful independent check starts a one-day review interval.</li><li>Further independent checks at least 24 hours apart can extend the interval to 3, 7, then 14 days. Same-day repeats do not advance spaced recall.</li><li>A spaced recall check requires progress across days and correct answers in both scenario variants. This is not a certification of consulting ability.</li><li>All scenarios are practice exercises. Frameworks are flexible reasoning tools, not scripts to force onto every client problem.</li><li>Progress stays in this browser, separate from full cases.</li></ul></details>
    </>}

    {view === 'guide' && framework && <div className="framework-guide screen-enter"><button className="quiet-button" onClick={() => setView('library')}><ArrowLeft size={16} /> All frameworks</button><header><span className="case-eyebrow">Method card</span><h2 ref={headingRef} tabIndex={-1}>{framework.title}</h2></header><MethodCard framework={framework} /><div className="framework-round-actions"><button className="math-button" disabled={running} onClick={() => start('framework', framework.id)}>Practise this method <ArrowRight size={16} /></button>{running && <button className="quiet-button" onClick={() => setView('session')}>Return to saved round</button>}</div><div className="framework-related"><h3>Related full cases</h3>{framework.caseIds.map(id => {
      const item = CASES.find(item => item.id === id)
      return item && <button className="quiet-button" key={id} onClick={() => onOpenCase(item.id)}>{item.title} <ArrowRight size={15} /></button>
    })}</div></div>}

    {view === 'session' && session && !session.finished && <div className="framework-session screen-enter">
      <div className="framework-session-top"><button className="quiet-button" onClick={() => setView('library')}><ArrowLeft size={16} /> Save & back</button><button className="quiet-button" onClick={() => { dispatch({ type: 'end' }); setView('results') }}>End round</button></div>
      <div className="framework-session-progress"><span>Drill {session.index + 1} of {session.cards.length}</span><span>{framework.title}</span></div><div className="framework-progress-track" aria-hidden="true"><span style={{ width: `${session.index / session.cards.length * 100}%` }} /></div>
      <section className="case-prompt-panel screen-enter" key={session.index}><span className="case-eyebrow">{q.calculation ? 'Apply the relationship' : 'Make a reasoned choice'}</span><h2 ref={headingRef} tabIndex={-1}>{q.prompt}</h2>{q.dataNote && <p className="case-data-note">{q.dataNote}</p>}
        <form onSubmit={check}>
          {!card.revealed ? <div className="case-calculate-first"><p>Work it out mentally before looking at the options.</p><button type="button" className="case-start-button" onClick={() => dispatch({ type: 'reveal' })}>Show answer choices</button></div> : <fieldset className="case-choices" disabled={card.checked}><legend className="sr-only">Your answer</legend>{card.order.map(id => {
            const option = q.options.find(option => option.id === id)
            return <label key={id} className={card.checked ? id === q.correct ? 'right' : card.answer === id ? 'wrong' : '' : card.answer === id ? 'chosen' : ''}><input type="radio" name="framework-answer" checked={card.answer === id} onChange={() => dispatch({ type: 'answer', answer: id })} /><span>{option.label}</span></label>
          })}</fieldset>}
          {!card.checked && <div className="case-prompt-actions">{card.revealed && <button className="math-button" disabled={!card.answer}>Check answer</button>}<button type="button" className="quiet-button" disabled={card.methodOpen} onClick={() => dispatch({ type: 'method' })}><Lightbulb size={16} /> {card.methodOpen ? 'Method shown' : 'View method'}</button></div>}
        </form>
        {card.methodOpen && <div className="framework-inline-method"><p className="framework-small">Method help is recorded; an assisted check will not advance spaced recall.</p><MethodCard framework={framework} /></div>}
        {card.checked && <div ref={feedbackRef}><DrillFeedback card={card} framework={framework} /><button className="math-button case-next-button" onClick={next}>{session.index === session.cards.length - 1 ? 'Finish round' : 'Next drill'} <ArrowRight size={16} /></button></div>}
      </section>
    </div>}

    {['session', 'results'].includes(view) && session?.finished && <div className="framework-results screen-enter"><button className="quiet-button" onClick={() => setView('library')}><ArrowLeft size={16} /> All frameworks</button><header className="case-page-heading"><span className="case-eyebrow">Round complete</span><h2 ref={headingRef} tabIndex={-1}>{summary.checked ? `${summary.correct} of ${summary.checked} right.` : 'No drills checked.'}</h2><p>{[summary.assisted && `${summary.assisted} with method help`, summary.total - summary.checked && `${summary.total - summary.checked} not attempted`].filter(Boolean).join(' · ') || 'Keep the method, not just the answer.'}</p></header>
      <div className="framework-round-actions"><button className="math-button" onClick={() => start('mix')}>Another mixed round</button>{summary.retryIds.length > 0 && <button className="case-start-button" onClick={() => start('retry')}>Retry weak checks ({summary.retryIds.length})</button>}</div>
      <div className="case-review-list">{session.cards.map((item, index) => {
        const framework = frameworkForDrill(item.drillId), question = frameworkQuestion(item), drill = FRAMEWORK_DRILLS.find(drill => drill.id === item.drillId)
        return <details className="case-review-step" key={item.drillId}><summary><span>{index + 1}. {drill.title}</span><span className={item.checked ? (frameworkCardCorrect(item) ? 'review-correct' : 'review-flag') : ''}>{!item.checked ? 'Not checked' : frameworkCardCorrect(item) ? (item.assisted ? 'Correct · assisted' : 'Correct') : 'Incorrect'}</span></summary><div className="case-review-body"><p>{question.prompt}</p>{item.answer && <p className="your-case-answer"><strong>Your choice{!item.checked ? ' (not checked)' : ''}</strong><span>{question.options.find(option => option.id === item.answer)?.label}</span></p>}{item.checked ? <DrillFeedback card={item} framework={framework} /> : <p>Unattempted drills do not earn progress. Try the method in a new round.</p>}<button className="quiet-button" onClick={() => guide(framework.id)}>Read the method <BookOpen size={15} /></button></div></details>
      })}</div>
    </div>}
  </section>
}
