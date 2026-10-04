import { useEffect, useReducer, useRef, useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react/ArrowLeft'
import { ArrowRight } from '@phosphor-icons/react/ArrowRight'
import { Check } from '@phosphor-icons/react/Check'
import { CaretRight } from '@phosphor-icons/react/CaretRight'
import { Lightbulb } from '@phosphor-icons/react/Lightbulb'
import { ArrowCounterClockwise } from '@phosphor-icons/react/ArrowCounterClockwise'
import { CASE_MATH_LESSONS, makeCaseMathExercise } from './case-maths.js'
import { loadMathLessonProgress, mathLessonReducer, mathLessonSummary, saveMathLessonProgress } from './case-maths-practice.js'
import { recordActivity } from './study-plan.js'
import { playCorrect, playWrong } from './sound.js'
import Verdict from './Verdict.jsx'
import './case-maths.css'
import { ESTIMATION_ANCHORS } from './estimation-anchors.js'

const groups = [...new Set(CASE_MATH_LESSONS.map(lesson => lesson.group))]
const needsReview = record => record?.last && (record.last.correct < 3 || record.last.assisted > 0)

function Exhibit({ rows }) {
  return rows && <div className="case-exhibit-wrap"><table className="case-exhibit"><caption className="sr-only">Exercise data</caption><thead><tr>{rows[0].map(cell => <th scope="col" key={cell}>{cell}</th>)}</tr></thead><tbody>{rows.slice(1).map((row, index) => <tr key={index}>{row.map((cell, column) => column === 0 ? <th scope="row" key={column}>{cell}</th> : <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div>
}

function Feedback({ question, card }) {
  const chosen = question.options.find(option => option.id === card.answer)
  const correct = card.answer === question.correct
  return <section className={`case-feedback ${correct ? 'correct-feedback' : 'review-feedback'}`} aria-label="Maths feedback">
    <Verdict correct={correct} /><p>{chosen?.feedback}</p>
    {!correct && <><p className="verdict-answer"><strong>Correct answer:</strong> {question.options.find(option => option.id === question.correct).label}</p><p>{question.options.find(option => option.id === question.correct).feedback}</p></>}
    {card.assisted && <p className="case-muted">Guidance used for this check.</p>}
  </section>
}

export default function CaseMaths({ active = true, onOpenFrameworks, onOpenCases }) {
  const [progress, dispatch] = useReducer(mathLessonReducer, undefined, () => loadMathLessonProgress())
  const [view, setView] = useState('library')
  const [lessonId, setLessonId] = useState(CASE_MATH_LESSONS[0].id)
  const [filter, setFilter] = useState('all')
  const [storageWarning, setStorageWarning] = useState(false)
  const headingRef = useRef(null), feedbackRef = useRef(null), practiceRef = useRef(null)
  const session = progress.session, running = Boolean(session && !session.finished)
  const lesson = CASE_MATH_LESSONS.find(item => item.id === (['practice', 'results'].includes(view) ? session?.lessonId : lessonId))
  const exercise = session ? makeCaseMathExercise(session.lessonId, session.variant) : null
  const question = exercise?.steps[session.index], card = session?.cards[session.index]
  const summary = session ? mathLessonSummary(session) : null
  const completed = CASE_MATH_LESSONS.filter(item => progress.records[item.id]?.completed > 0).length
  const revisit = CASE_MATH_LESSONS.filter(item => needsReview(progress.records[item.id]))
  const recommended = filter === 'review' ? revisit[0] : CASE_MATH_LESSONS.find(item => !progress.records[item.id]?.completed) ?? revisit[0] ?? CASE_MATH_LESSONS[0]
  const example = view === 'lesson' ? makeCaseMathExercise(lesson.id, ((progress.records[lesson.id]?.started ?? 0) + 7) % 1000000) : null

  useEffect(() => { if (!saveMathLessonProgress(progress)) setStorageWarning(true) }, [progress])
  useEffect(() => {
    if (!active) return
    headingRef.current?.focus({ preventScroll: true })
    if (view === 'practice') practiceRef.current?.scrollIntoView({ block: 'start' })
    else headingRef.current?.scrollIntoView({ block: 'nearest' })
  }, [active, view, lessonId, session?.index, session?.variant])
  useEffect(() => {
    if (active && view === 'practice' && card?.checked) {
      feedbackRef.current?.focus({ preventScroll: true })
      feedbackRef.current?.scrollIntoView({ block: 'nearest' })
    }
  }, [active, view, card?.checked, session?.index])

  const readLesson = id => {
    dispatch({ type: 'study', lessonId: id }); setLessonId(id); setView('lesson')
  }
  const start = id => { if (!running) { dispatch({ type: 'start', lessonId: id }); setView('practice') } }
  const next = () => { dispatch({ type: 'next' }); if (session.index === 2) { recordActivity('maths'); setView('results') } }

  return <section className="case-maths" aria-label="Case maths lessons and practice">
    {storageWarning && <p className="case-storage-warning" role="status">Browser storage is unavailable. Progress lasts only until you reload or close this page.</p>}
    {view === 'library' && <>
      <h2 className="sr-only" ref={headingRef} tabIndex={-1}>Case maths</h2>
      <div className="lesson-next"><div><span className="case-eyebrow">{running ? 'Pick up where you left off' : 'Your next step'}</span><h3>{running ? CASE_MATH_LESSONS.find(item => item.id === session.lessonId).title : recommended?.title ?? 'Nothing to revisit yet'}</h3><p>{running ? `Check ${session.index + 1} of 3 · progress kept as you go` : 'A short method, a worked example, then three checks.'}</p></div><button className="math-button" disabled={!running && !recommended} onClick={() => running ? setView('practice') : readLesson(recommended.id)}>{running ? 'Continue practice' : completed ? 'Keep learning' : 'Start learning'} <ArrowRight size={16} /></button></div>
      <div className="lesson-library-tools"><div className="case-filters" role="group" aria-label="Filter maths lessons"><button aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All lessons</button><button aria-pressed={filter === 'review'} onClick={() => setFilter('review')}>To revisit ({revisit.length})</button></div><span>{completed}/{CASE_MATH_LESSONS.length} practised</span></div>
      {filter === 'review' && !revisit.length && <p className="lesson-empty">No checks to revisit yet. Try a lesson, and topics with mistakes, help, or unfinished checks will appear here.</p>}
      {groups.map(group => {
        const items = CASE_MATH_LESSONS.filter(item => item.group === group && (filter === 'all' || needsReview(progress.records[item.id])))
        return items.length > 0 && <section className="lesson-group" key={group} aria-label={group}><h3>{group}</h3><ol>{items.map(item => {
          const index = CASE_MATH_LESSONS.indexOf(item), last = progress.records[item.id]?.last
          const result = last?.checked ? `${last.correct}/${last.checked} checked correctly` : 'Not checked yet'
          return <li key={item.id}><button className="math-lesson-row" aria-label={`Learn ${item.title}`} onClick={() => readLesson(item.id)}><span className={`lesson-number ${last?.checked === 3 && last.correct === 3 && !last.assisted ? 'lesson-practised' : ''}`} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span className="lesson-row-copy"><span className="lesson-row-title">{item.title}</span><span className="lesson-row-description">{item.description}</span><span className="lesson-row-status">{running && session.lessonId === item.id ? 'Practice in progress' : last ? `${result}${last.checked < 3 ? ` · ${3 - last.checked} unattempted` : ''}${last.assisted ? ' · with guidance' : ''}` : 'Learn + 3 checks'}</span></span><CaretRight size={18} aria-hidden="true" /></button></li>
        })}</ol></section>
      })}
      {session?.finished && <button className="quiet-button" onClick={() => setView('results')}>Last practice <ArrowRight size={15} /></button>}
      <details className="estimation-anchors">
        <summary><span><strong>Estimation anchors</strong><small>Round numbers to start a guesstimate from. State them as assumptions.</small></span></summary>
        <div className="estimation-grid">{ESTIMATION_ANCHORS.map(group => <section key={group.title}><h4>{group.title}</h4><dl>{group.items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>)}</div>
        <p className="case-local-note">Approximate figures for India, as of 2026. Check anything that decides the answer.</p>
      </details>
    </>}

    {view === 'lesson' && lesson && <div className="math-lesson-guide screen-enter">
      <button className="quiet-button" onClick={() => setView('library')}><ArrowLeft size={16} /> All maths lessons</button>
      <header className="study-section-heading"><span className="case-eyebrow">Lesson {String(CASE_MATH_LESSONS.indexOf(lesson) + 1).padStart(2, '0')} · {lesson.group}</span><h2 ref={headingRef} tabIndex={-1}>{lesson.title}</h2><p>{lesson.description}</p></header>
      <div className="lesson-method"><div className="lesson-formula">{lesson.formula}</div><ol className="lesson-method-steps">{lesson.method.map((text, index) => <li key={text}><span>{['Set up', 'Calculate', 'Interpret'][index]}</span><p>{text}</p></li>)}</ol></div>
      <details className="lesson-worked"><summary>See a worked example</summary><div><p>{example.context}</p><Exhibit rows={example.exhibit} /><ol>{example.steps.map(step => <li key={step.stage}><strong>{step.stage}</strong><p>{step.options.find(option => option.id === step.correct).feedback}</p></li>)}</ol></div></details>
      <aside className="lesson-trap"><Lightbulb size={18} aria-hidden="true" /><div><strong>Common trap</strong><p>{lesson.trap}</p></div></aside>
      <div className="lesson-actions"><button className="math-button" disabled={running} onClick={() => start(lesson.id)}>Try 3 checks <ArrowRight size={16} /></button>{running && <button className="case-start-button" onClick={() => setView('practice')}>Continue saved practice</button>}</div>
      {running && <p className="case-local-note">Finish or end your saved practice before starting another.</p>}
    </div>}

    {view === 'practice' && running && <div className="math-lesson-practice screen-enter" ref={practiceRef}>
      <div className="lesson-practice-top"><button className="quiet-button" onClick={() => setView('library')}><ArrowLeft size={16} /> Save & back</button><button className="quiet-button" onClick={() => { if (session.cards.every(card => card.checked)) recordActivity('maths'); dispatch({ type: 'end' }); setView('results') }}>End practice</button></div>
      <p className="lesson-practice-title">{lesson.title}</p>
      <ol className="lesson-stepper" aria-label="Maths practice steps">{exercise.steps.map((step, index) => <li key={step.stage} aria-current={index === session.index ? 'step' : undefined} className={session.cards[index].checked ? 'step-checked' : ''}><span aria-hidden="true">{session.cards[index].checked ? <Check size={13} /> : index + 1}</span>{step.stage}</li>)}</ol>
      <div className="lesson-scenario"><span className="case-eyebrow">Practice scenario · Invented figures</span><p>{exercise.context}</p><Exhibit rows={exercise.exhibit} /></div>
      <section className="case-prompt-panel screen-enter" key={`${session.variant}-${session.index}`}><h2 ref={headingRef} tabIndex={-1}>{question.prompt}</h2>
        <form onSubmit={event => { event.preventDefault(); card?.answer === question?.correct ? playCorrect() : playWrong(); dispatch({ type: 'check' }) }}>
          {!card.revealed ? <div className="case-calculate-first"><p>Estimate the size of the answer, then calculate. No rush.</p><button type="button" className="case-start-button" onClick={() => dispatch({ type: 'reveal' })}>Show answer choices</button></div> : <fieldset className="case-choices" disabled={card.checked}><legend className="sr-only">Your answer</legend>{card.order.map(id => {
            const option = question.options.find(option => option.id === id)
            return <label className={card.checked ? id === question.correct ? 'right' : card.answer === id ? 'wrong' : '' : card.answer === id ? 'chosen' : ''} key={id}><input type="radio" name="case-maths-answer" checked={card.answer === id} onChange={() => dispatch({ type: 'answer', answer: id })} /><span>{option.label}</span></label>
          })}</fieldset>}
          {!card.checked && <div className="case-prompt-actions">{card.revealed && <button className="math-button" disabled={!card.answer}>Check answer</button>}<button type="button" className="quiet-button" disabled={card.helpOpen} onClick={() => dispatch({ type: 'method' })}><Lightbulb size={16} /> {card.helpOpen ? 'Reminder shown' : 'Formula reminder'}</button></div>}
        </form>
        {card.helpOpen && <aside className="lesson-formula lesson-reminder"><p>{lesson.formula}</p><small>Remaining checks in this practice are marked as guided.</small></aside>}
        {card.checked && <div ref={feedbackRef} tabIndex={-1} className="lesson-feedback-focus"><Feedback question={question} card={card} /><button className="math-button case-next-button" onClick={next}>{session.index === 2 ? 'Finish practice' : `Next: ${exercise.steps[session.index + 1].stage.toLowerCase()}`} <ArrowRight size={16} /></button></div>}
      </section>
    </div>}

    {view === 'results' && session?.finished && <div className="math-lesson-results screen-enter">
      <button className="quiet-button" onClick={() => setView('library')}><ArrowLeft size={16} /> All maths lessons</button>
      <header className="study-section-heading"><span className="case-eyebrow">{lesson.title}</span><h2 ref={headingRef} tabIndex={-1}>{summary.checked === 3 ? 'Keep the reasoning. Try new numbers.' : 'Pick it up with a fresh scenario.'}</h2><p>{summary.checked ? `${summary.correct} of ${summary.checked} checked answers correct.` : 'No answers checked yet.'}{summary.checked < 3 ? ` ${3 - summary.checked} checks not attempted.` : ''}{summary.assisted > 0 ? ` ${summary.assisted} with guidance.` : ''}</p></header>
      <div className="lesson-actions"><button className="math-button" onClick={() => start(lesson.id)}><ArrowCounterClockwise size={16} /> Try new figures</button><button className="quiet-button" onClick={() => readLesson(lesson.id)}>Revisit the lesson</button></div>
      <div className="case-review-list">{exercise.steps.map((step, index) => {
        const item = session.cards[index]
        return <details className="case-review-step" key={`${session.variant}-${step.stage}`}><summary><span>{index + 1}. {step.stage}</span><span className={item.checked ? (item.answer === step.correct ? 'review-correct' : 'review-flag') : ''}>{!item.checked ? 'Not checked' : item.answer === step.correct ? (item.assisted ? 'Correct · assisted' : 'Correct') : 'Incorrect'}</span></summary><div className="case-review-body"><p>{step.prompt}</p>{item.checked ? <><p className="your-case-answer"><strong>Your choice</strong><span>{step.options.find(option => option.id === item.answer).label}</span></p><Feedback question={step} card={item} /></> : <p>Try a fresh scenario to practise this check. Unattempted checks do not earn progress.</p>}</div></details>
      })}</div>
      <div className="lesson-transfer"><h3>Use it in a bigger problem</h3><p>Practise choosing a framework, or apply your analysis in a full case.</p><div className="lesson-actions"><button className="case-start-button" onClick={onOpenFrameworks}>Framework drills <ArrowRight size={15} /></button><button className="quiet-button" onClick={onOpenCases}>Explore full cases <ArrowRight size={15} /></button></div></div>
    </div>}
  </section>
}
