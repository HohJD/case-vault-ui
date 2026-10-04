import { lazy, Suspense, useEffect, useReducer, useRef, useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react/ArrowLeft'
import { ArrowRight } from '@phosphor-icons/react/ArrowRight'
import { Check } from '@phosphor-icons/react/Check'
import { Clock } from '@phosphor-icons/react/Clock'
import { Lightbulb } from '@phosphor-icons/react/Lightbulb'
import { Lock } from '@phosphor-icons/react/Lock'
import { ArrowCounterClockwise } from '@phosphor-icons/react/ArrowCounterClockwise'
import { X } from '@phosphor-icons/react/X'
import { Lightning } from '@phosphor-icons/react/Lightning'
import { House } from '@phosphor-icons/react/House'
import { Calculator } from '@phosphor-icons/react/Calculator'
import { MathOperations } from '@phosphor-icons/react/MathOperations'
import { TreeStructure } from '@phosphor-icons/react/TreeStructure'
import { Buildings } from '@phosphor-icons/react/Buildings'
import { Briefcase } from '@phosphor-icons/react/Briefcase'
import { Handshake } from '@phosphor-icons/react/Handshake'
import { Cards } from '@phosphor-icons/react/Cards'
import { Gear } from '@phosphor-icons/react/Gear'
import { CASES, STAGES } from './casebook.js'
import { CASE_RECALL } from './case-recall.js'
import { QUIZ_MIN_CASES, buildRecallQuiz } from './recall-quiz.js'
import { MASTERY_LEVEL, STAGE_TARGETS, answerLabel, attemptStep, canSubmitStep, caseProgressReducer, caseStatus, checkCaseAnswer, decisionPoints, dueCases, entryAnswer, loadCaseProgress, masteryLevel, nextCase, saveCaseProgress, winningPath } from './case-practice.js'
import { recordActivity } from './study-plan.js'
import { playCorrect, playWrong } from './sound.js'
import Verdict from './Verdict.jsx'
import { filterCases, sortCases } from './cases-filter.js'
import AppShell from './AppShell.jsx'
import Overview from './Overview.jsx'
import './cases.css'

const Frameworks = lazy(() => import('./Frameworks.jsx'))
const Industries = lazy(() => import('./Industries.jsx'))
const CaseMaths = lazy(() => import('./CaseMaths.jsx'))
const MathPractice = lazy(() => import('./MathPractice.jsx'))
const MathAside = lazy(() => import('./MathPractice.jsx').then(module => ({ default: module.MathAside })))
const Flashcards = lazy(() => import('./Flashcards.jsx'))
const DecksNav = lazy(() => import('./Flashcards.jsx').then(module => ({ default: module.DecksNav })))
const Settings = lazy(() => import('./Settings.jsx'))
const InterviewGuide = lazy(() => import('./InterviewGuide.jsx'))
const studySections = [
  { id: 'home', hash: '#overview', label: 'Overview', hint: 'Plan' },
  { id: 'maths', hash: '#case-maths', label: 'Case maths', hint: 'Learn' },
  { id: 'frameworks', hash: '#frameworks', label: 'Frameworks', hint: 'Drill' },
  { id: 'industries', hash: '#industries', label: 'Industries', hint: 'Know' },
  { id: 'cases', hash: '#full-cases', label: 'Full cases', hint: 'Apply' },
  { id: 'mental', hash: '#mental-maths', label: 'Mental maths', hint: 'Speed' },
  { id: 'cards', hash: '#cards', label: 'Cards', hint: 'Recall' },
  { id: 'interview', hash: '#interview', label: 'Interview', hint: 'Prepare' },
  { id: 'settings', hash: '#settings', label: 'Settings', hint: 'You' },
]
const initialStudySection = () => studySections.find(item => item.hash === window.location.hash)?.id ?? 'home'
const SECTION_ICONS = { home: House, maths: MathOperations, frameworks: TreeStructure, industries: Buildings, cases: Briefcase, mental: Calculator, cards: Cards, interview: Handshake, settings: Gear }
const wideQuery = '(min-width: 1024px)'
const STATUS_KEYS = ['new', 'draft', 'due', 'learning', 'mastered']
const LEVEL_KEYS = [...new Set(CASES.map(item => item.level))]
const SECTOR_LIST = [...CASES.reduce((map, item) => map.set(item.sector, (map.get(item.sector) ?? 0) + 1), new Map())].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

const clock = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
const categories = ['All', ...new Set(CASES.map(item => item.category))]
const promptType = step => ({ select: 'Pick two priorities', calculation: 'Mental maths', build: 'Build a recommendation', reflection: 'Saved written response', number: 'Saved number check' }[step.kind] ?? 'Make a choice')

function Feedback({ step, entry }) {
  const answer = entryAnswer(entry)
  if (step.kind === 'reflection') return <section className="case-feedback reflection-feedback" aria-label="Earlier written response reference">
    <h3>Earlier written response (not graded)</h3><p>{step.model}</p><p className="self-review-label">Your original self-review is preserved below. It is not an automatic evaluation.</p>
    <ul className="legacy-checks">{step.rubric.map((criterion, index) => <li key={criterion}>{(entry.legacy?.self ?? entry.self ?? []).includes(index) ? <Check size={14} aria-label="Previously self-checked" /> : <span className="legacy-unchecked" aria-label="Not previously checked" />}<span>{criterion}</span></li>)}</ul>
  </section>
  const correct = checkCaseAnswer(step, answer)
  const points = decisionPoints(step, answer)
  const total = step.kind === 'select' ? step.required : step.kind === 'build' ? step.parts.length : 1
  const selected = step.options?.find(option => option.id === answer)
  const numeric = ['number', 'calculation'].includes(step.kind)
  const value = numeric && `${/^\$/.test(step.unit) ? '$' : ''}${step.answer.toLocaleString(undefined, { maximumFractionDigits: 2 })}${step.unit.startsWith('%') ? '' : ' '}${step.unit.replace(/^\$ ?/, '')}`
  return <section className={`case-feedback ${correct ? 'correct-feedback' : 'review-feedback'}`} aria-label="Decision feedback">
    <Verdict correct={correct} partial={total > 1 ? { got: points, of: total } : null} detail={numeric ? value : undefined} />
    {numeric && <>{!correct && <p className="verdict-answer"><strong>Correct answer:</strong> {value}</p>}{!correct && selected && <p>{selected.feedback}</p>}<p className="case-working">{step.working}</p></>}
    {step.kind === 'choice' && <><p>{selected?.feedback}</p>{!correct && <p className="verdict-answer"><strong>Correct answer:</strong> {step.options.find(option => option.id === step.correct).label}</p>}</>}
    {step.kind === 'select' && <><ul className="decision-feedback-list">{step.options.filter(option => answer.includes(option.id)).map(option => step.correct.includes(option.id)
      ? <li key={option.id} className="supported-line"><Check size={14} aria-hidden="true" /><span><span className="sr-only">Supported: </span>{option.label}</span></li>
      : <li key={option.id} className="missed-line"><X size={14} aria-hidden="true" /><span><strong>{option.label}</strong><p>{option.feedback}</p></span></li>)}</ul>
      {!correct && <div className="missed-priorities"><strong>Correct answer:</strong>{step.options.filter(option => step.correct.includes(option.id) && !answer.includes(option.id)).map(option => <p key={option.id}>{option.label} {option.feedback}</p>)}</div>}<p className="reference-approach"><strong>How it fits together</strong>{step.model}</p></>}
    {step.kind === 'build' && <><ul className="decision-feedback-list">{step.parts.map(part => {
      const chosen = part.options.find(option => option.id === answer[part.id])
      return answer[part.id] === part.correct
        ? <li key={part.id} className="supported-line"><Check size={14} aria-hidden="true" /><span><strong>{part.title}:</strong> {chosen.label}</span></li>
        : <li key={part.id} className="missed-line"><X size={14} aria-hidden="true" /><span><strong>{part.title}: {chosen.label}</strong><p>{chosen.feedback}</p><p className="verdict-answer"><strong>Correct answer:</strong> {part.options.find(option => option.id === part.correct).label}</p></span></li>
    })}</ul><p className="reference-approach"><strong>One complete recommendation</strong>{step.model}</p></>}
    {entry.hinted && <span className="case-muted">You used a hint on this prompt.</span>}
  </section>
}

const shortDate = time => new Date(time).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
const statusLabel = { new: 'New', draft: 'In progress', due: 'Ready to recall', learning: 'Learning', mastered: 'Mastered' }

function MasteryMeter({ level }) {
  return <span className="mastery-meter" role="img" aria-label={`Mastery ${level} of ${MASTERY_LEVEL}`}>{Array.from({ length: MASTERY_LEVEL }, (_, index) => <span key={index} className={index < level ? 'filled' : ''} />)}</span>
}

function RecallCard({ item }) {
  const recall = CASE_RECALL[item.id]
  return <div className="recall-card">
    <p className="recall-takeaway">{recall.takeaway}</p>
    <dl><div><dt>Key number</dt><dd>{recall.keyNumber}</dd></div><div><dt>Common trap</dt><dd>{recall.trap}</dd></div></dl>
  </div>
}

function CorrectPath({ item, attempt }) {
  return <ol className="correct-path">{winningPath(item).map((stage, index) => {
    const entry = attempt?.entries[index]
    const step = attempt && attemptStep(item, attempt, index)
    const result = !attempt || step.kind === 'reflection' ? null : checkCaseAnswer(step, entryAnswer(entry))
    return <li key={stage.stage} className={result === false ? 'path-missed' : ''}>
      <span className="path-marker" aria-hidden="true">{result === true ? <Check size={13} /> : result === false ? <X size={13} /> : index + 1}</span>
      <div><strong>{stage.stage}{result === false && <span className="sr-only"> (you chose differently)</span>}{result === true && <span className="sr-only"> (you got this)</span>}</strong>{stage.answers.map(answer => <p key={answer}>{answer}</p>)}</div>
    </li>
  })}</ol>
}

function AttemptReview({ item, attempt }) {
  return <div className="case-review-list">{item.steps.map((_, index) => {
    const step = attemptStep(item, attempt, index)
    const entry = attempt.entries[index]
    const answer = entryAnswer(entry)
    const result = step.kind === 'reflection' ? null : checkCaseAnswer(step, answer)
    return <details key={STAGES[index]} className="case-review-step"><summary><span>{index + 1}. {STAGES[index]}</span><span className={result === false ? 'review-flag' : result === true ? 'review-correct' : ''}>{result === null ? 'Not graded' : result ? 'Correct' : 'Incorrect'}</span></summary><div className="case-review-body"><p>{step.prompt}</p><p className="your-case-answer"><strong>Your first response</strong><span>{answerLabel(step, answer)}</span></p>{entry.previousDraft && <details className="previous-case-draft"><summary>Your earlier written draft</summary><p>{entry.previousDraft}</p></details>}<Feedback step={step} entry={entry} /></div></details>
  })}</div>
}

function CaseReview({ item, record, onReplay, onLibrary, onNext, next, resume = false }) {
  const { summary, lastAttempt } = record
  const headingRef = useRef(null)
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }) }, [])
  const clean = lastAttempt.format === 2 && summary.correct === summary.total && summary.hints === 0
  const level = masteryLevel(record)
  return <section className="case-review screen-enter" aria-labelledby="review-heading">
    <button className="quiet-button" onClick={onLibrary}><ArrowLeft size={16} /> All cases</button>
    <header className="case-page-heading"><span className="case-eyebrow">Review & remember</span><h1 id="review-heading" ref={headingRef} tabIndex={-1}>{clean ? 'Clean run.' : `${summary.correct} of ${summary.total} checks right.`}</h1><p>{item.title}{summary.hints > 0 && ` · ${summary.hints} hint${summary.hints > 1 ? 's' : ''} used`}</p></header>
    <section className="review-remember" aria-labelledby="remember-heading"><h2 id="remember-heading">Remember this</h2><RecallCard item={item} /></section>
    <div className="case-next-review"><ArrowCounterClockwise size={18} /><div><strong>Mastery {level}/{MASTERY_LEVEL} <MasteryMeter level={level} /></strong><p>{level >= MASTERY_LEVEL ? `Mastered. Keep it fresh with a recall on ${shortDate(record.dueAt)}.` : `Next recall: ${shortDate(record.dueAt)}. Try it without notes then.`} Clean runs on or after the recall date build mastery; a mistake or hint brings the case back tomorrow.</p></div></div>
    <section className="review-path" aria-labelledby="path-heading"><h2 id="path-heading">The correct path</h2><p className="case-muted">The story of the case in five steps. Say it aloud once.</p><CorrectPath item={item} attempt={lastAttempt} /></section>
    <h2 className="review-detail-heading">Why, stage by stage</h2>
    <AttemptReview item={item} attempt={lastAttempt} />
    {record.legacyReviews?.length > 0 && <details className="previous-case-review"><summary>Previous written work & reviews</summary><p>Your earlier work is preserved as originally answered. Written responses have not been regraded.</p>{record.legacyReviews.map((review, index) => <section key={review.lastAttempt.id}><h3>Saved attempt {index + 1}</h3><AttemptReview item={item} attempt={review.lastAttempt} /></section>)}</details>}
    {summary.legacyWritten > 0 && <p className="case-review-note">Preserved written responses from the earlier format are not graded.</p>}
    <div className="case-review-actions">{next && next.item.id !== item.id && ['new', 'due', 'draft'].includes(next.reason) ? <><button className="math-button" onClick={onNext}>{next.reason === 'new' ? 'Next case' : next.reason === 'due' ? 'Recall a due case' : 'Continue draft'}: {next.item.title} <ArrowRight size={16} /></button><button className="quiet-button" onClick={onReplay}>{resume ? 'Continue this draft' : 'Practise this again'} <ArrowCounterClockwise size={16} /></button></> : <><button className="math-button" onClick={onReplay}>{resume ? 'Continue draft' : 'Practise again'} <ArrowCounterClockwise size={16} /></button><button className="quiet-button" onClick={onLibrary}>All cases <ArrowRight size={16} /></button></>}</div>
  </section>
}

function RecallQuiz({ finishedIds, onLibrary, onOpenReview }) {
  const [round, setRound] = useState(() => ({ questions: buildRecallQuiz(finishedIds), index: 0, answers: [] }))
  const headingRef = useRef(null)
  const { questions, index, answers } = round
  const done = index >= questions.length
  const question = questions[index]
  const answer = answers[index]
  const item = question ? CASES.find(entry => entry.id === question.caseId) : null
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }) }, [index])
  if (!questions.length) return null
  const titleOf = id => CASES.find(item => item.id === id).title
  const score = answers.filter((value, position) => value === questions[position].correct).length
  if (done) {
    const missed = [...new Set(questions.filter((item, position) => answers[position] !== item.correct).map(item => item.caseId))]
    return <section className="case-review quick-recall" aria-labelledby="quiz-heading">
      <button className="quiet-button" onClick={onLibrary}><ArrowLeft size={16} /> All cases</button>
      <header className="case-page-heading"><span className="case-eyebrow"><Lightning size={14} /> Quick recall</span><h1 id="quiz-heading" ref={headingRef} tabIndex={-1}>{score === questions.length ? 'All six from memory.' : `${score} of ${questions.length} from memory.`}</h1><p>{missed.length ? 'Reread these takeaways, then try another round.' : 'Your recall is solid. Mastery still comes from full case runs on their recall dates.'}</p></header>
      {missed.length > 0 && <div className="recall-list">{missed.map(id => <div key={id} className="recall-item quiz-missed"><div className="quiz-missed-body"><strong>{titleOf(id)}</strong><p>{CASE_RECALL[id].takeaway}</p></div><button className="quiet-button" onClick={() => onOpenReview(id)}>Takeaways <ArrowRight size={15} /></button></div>)}</div>}
      <div className="case-review-actions"><button className="math-button" onClick={() => setRound({ questions: buildRecallQuiz(finishedIds), index: 0, answers: [] })}>Another round <ArrowCounterClockwise size={16} /></button><button className="quiet-button" onClick={onLibrary}>All cases <ArrowRight size={16} /></button></div>
    </section>
  }
  const answered = answer !== undefined
  const correct = answer === question.correct
  return <section className="case-workspace quick-recall" aria-labelledby="quiz-question">
    <div className="case-topline"><button className="quiet-button" onClick={onLibrary}><ArrowLeft size={16} /> All cases</button><span className="case-category">Quick recall · {index + 1} of {questions.length}</span></div>
    <div className="quiz-progress" aria-hidden="true">{questions.map((_, position) => <span key={position} className={position < index ? (answers[position] === questions[position].correct ? 'right' : 'wrong') : position === index ? 'current' : ''} />)}</div>
    <section className="case-prompt-panel screen-enter" key={index}>
      <span className="case-eyebrow">From memory · Tap to answer</span>
      <h2 id="quiz-question" ref={headingRef} tabIndex={-1}>{question.prompt}</h2>
      <div className="case-choices quiz-choices" role="group" aria-label="Answer choices">{question.options.map(option => {
        const state = !answered ? '' : option.id === question.correct ? 'quiz-right' : option.id === answer ? 'quiz-wrong' : 'quiz-dim'
        return <button type="button" key={option.id} className={state} disabled={answered} aria-pressed={answer === option.id} onClick={() => { option.id === question.correct ? playCorrect() : playWrong(); setRound(current => ({ ...current, answers: Object.assign([...current.answers], { [current.index]: option.id }) })) }}>{answered && option.id === question.correct && <Check size={15} aria-hidden="true" />}{answered && option.id === answer && !correct && <X size={15} aria-hidden="true" />}<span>{option.label}</span></button>
      })}</div>
      {answered && <section className={`case-feedback ${correct ? 'correct-feedback' : 'review-feedback'}`}><Verdict correct={correct} />{!correct && <p className="verdict-answer"><strong>Correct answer:</strong> {question.options.find(option => option.id === question.correct).label}</p>}{!correct && ['takeaway', 'number', 'trap'].includes(question.kind) && <p>That one is from “{titleOf(answer)}”.</p>}<p>{recallExplanation(question, item)}</p></section>}
      {answered && <button className="math-button case-next-button" onClick={() => setRound(current => ({ ...current, index: current.index + 1 }))}>{index === questions.length - 1 ? 'See results' : 'Next question'} <ArrowRight size={16} /></button>}
    </section>
  </section>
}

function QuickRecallCard({ finished, onStart }) {
  if (finished < QUIZ_MIN_CASES) return <p className="quick-recall-locked"><Lock size={13} aria-hidden="true" /> Quick recall unlocks after {QUIZ_MIN_CASES} finished cases ({finished}/{QUIZ_MIN_CASES}).</p>
  return <div className="quick-recall-card"><div><strong><Lightning size={15} aria-hidden="true" /> Quick recall</strong><p>Six rapid questions on the cases you have finished. About two minutes.</p></div><button className="quiet-button" onClick={onStart}>Start <ArrowRight size={15} /></button></div>
}

function NextUp({ progress, onOpen, onRecall }) {
  const now = Date.now()
  const { item, reason } = nextCase(progress, now)
  const draft = progress.drafts[item.id]
  const copy = {
    draft: ['Pick up where you left off', `Stage ${draft ? draft.stage + 1 : 1} of 5: ${STAGES[draft?.stage ?? 0]}.`, 'Continue'],
    due: ['Ready to recall', 'Try it from memory. A clean run moves it a step closer to mastered.', 'Start recall'],
    new: [Object.keys(progress.records).length ? 'Next new case' : 'Start here', item.focus + '.', 'Start case'],
    waiting: ['All caught up', `Next recall: ${item.title}, ${shortDate(progress.records[item.id]?.dueAt ?? now)}. Warm up with a quick recall in the meantime.`, 'Warm up'],
    mastered: ['All cases mastered', `Keep them fresh. Next recall: ${item.title}, ${shortDate(progress.records[item.id]?.dueAt ?? now)}.`, 'Warm up'],
  }[reason]
  const recallOnly = ['waiting', 'mastered'].includes(reason)
  return <section className={`case-next-up next-${reason}`} aria-labelledby="next-up-title">
    <div><span className="case-eyebrow">{copy[0]}</span><h3 id="next-up-title">{recallOnly ? 'Revise your takeaways' : item.title}</h3><p>{copy[1]}</p></div>
    <button className="math-button" onClick={() => recallOnly ? onRecall() : onOpen(item.id)}>{copy[2]} <ArrowRight size={16} /></button>
  </section>
}

function RecallSheet({ progress }) {
  const unlocked = CASES.filter(item => progress.records[item.id])
  return <section className="recall-sheet" id="case-recall" tabIndex={-1} aria-labelledby="recall-sheet-heading">
    <header><h2 id="recall-sheet-heading">Recall sheet</h2><p>One-minute summaries of every case you have finished. Read them before an interview. {unlocked.length < CASES.length && `${unlocked.length} of ${CASES.length} unlocked.`}</p></header>
    <div className="recall-list">{CASES.map(item => progress.records[item.id] ? <details key={item.id} className="recall-item"><summary><span>{item.title}</span><small>{item.category}</small></summary><RecallCard item={item} /><h4>Known facts</h4><ul className="recall-facts">{CASE_RECALL[item.id].facts.map(fact => <li key={fact}>{fact}</li>)}</ul><h4>The correct path</h4><CorrectPath item={item} /></details>
      : <div key={item.id} className="recall-item recall-locked"><Lock size={14} aria-hidden="true" /><span>{item.title}</span><small>Finish once to unlock</small></div>)}</div>
  </section>
}

function TapAnswer({ step, entry, name, onAction }) {
  if (step.kind === 'calculation' && !entry.revealed) return <div className="case-calculate-first"><p>Work it out mentally first. Reveal the choices when you have an answer in mind.</p><button type="button" className="case-start-button" onClick={() => onAction({ type: 'reveal' })}>Show answer choices</button></div>
  if (step.kind === 'build') {
    if (entry.submitted) return <p className="your-case-answer"><strong>Your recommendation</strong><span>{answerLabel(step, entry.answer)}</span></p>
    const part = step.parts[entry.part]
    return <div className="recommendation-builder">
      <nav className="recommendation-parts" aria-label="Recommendation parts">{step.parts.map((part, index) => <button type="button" key={part.id} aria-current={entry.part === index ? 'step' : undefined} disabled={!step.parts.slice(0, index).every(previous => entry.answer[previous.id])} onClick={() => onAction({ type: 'part', part: index })}><span>{index + 1}</span>{part.title}</button>)}</nav>
      <fieldset className="case-choices"><legend>{part.title}</legend>{entry.partOrder[part.id].map(id => {
        const option = part.options.find(option => option.id === id)
        return <label key={id} className={entry.answer[part.id] === id ? 'chosen' : ''}><input type="radio" name={`${name}-${part.id}`} checked={entry.answer[part.id] === id} onChange={() => onAction({ type: 'pick', part: part.id, answer: id })} /><span>{option.label}</span></label>
      })}</fieldset>
      {entry.part < step.parts.length - 1 ? <button type="button" className="case-start-button next-recommendation-part" disabled={!entry.answer[part.id]} onClick={() => onAction({ type: 'part', part: entry.part + 1 })}>Next: {step.parts[entry.part + 1].title} <ArrowRight size={15} /></button> : canSubmitStep(step, entry) && <details className="recommendation-preview"><summary>Review your assembled recommendation</summary><p>{answerLabel(step, entry.answer)}</p></details>}
    </div>
  }
  const multiple = step.kind === 'select'
  const correctIds = multiple ? step.correct : [step.kind === 'choice' ? step.correct : step.options.find(option => checkCaseAnswer(step, option.id))?.id]
  const mark = (id, selected) => !entry.submitted ? '' : correctIds.includes(id) ? selected ? 'right' : multiple ? 'missed' : 'right' : selected ? 'wrong' : ''
  return <>
    {multiple && <p className="case-selection-count" role="status">Choose exactly {step.required} · {entry.answer.length} selected</p>}
    {step.kind === 'calculation' && <p className="case-number-unit">Select your answer in {step.unit}.</p>}
    <fieldset className="case-choices" disabled={entry.submitted}><legend className="sr-only">{multiple ? 'Your priorities' : 'Your answer'}</legend>{entry.order.map(id => {
      const option = step.options.find(option => option.id === id)
      const selected = multiple ? entry.answer.includes(id) : entry.answer === id
      return <label key={id} className={`${selected && !entry.submitted ? 'chosen' : ''} ${mark(id, selected)}`}><input type={multiple ? 'checkbox' : 'radio'} name={name} checked={selected} disabled={multiple && !selected && entry.answer.length >= step.required} onChange={() => onAction(multiple ? { type: 'select', id } : { type: 'answer', answer: id })} /><span>{option.label}</span></label>
    })}</fieldset>
  </>
}

export default function Cases({ active = true }) {
  const [progress, dispatch] = useReducer(caseProgressReducer, undefined, () => loadCaseProgress())
  const [category, setCategory] = useState('All')
  const [filters, setFilters] = useState({ status: 'all', level: 'all', sector: 'all' })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('library')
  const [showAllSectors, setShowAllSectors] = useState(false)
  const [libraryTab, setLibraryTab] = useState(initialStudySection)
  const [frameworkOpened, setFrameworkOpened] = useState(() => initialStudySection() === 'frameworks')
  const [mathsOpened, setMathsOpened] = useState(() => initialStudySection() === 'maths')
  const [industriesOpened, setIndustriesOpened] = useState(() => initialStudySection() === 'industries')
  const [mentalOpened, setMentalOpened] = useState(() => initialStudySection() === 'mental')
  const [cardsOpened, setCardsOpened] = useState(() => initialStudySection() === 'cards')
  const [settingsOpened, setSettingsOpened] = useState(() => initialStudySection() === 'settings')
  const [interviewOpened, setInterviewOpened] = useState(() => initialStudySection() === 'interview')
  const [mathFocus, setMathFocus] = useState(false)
  // The maths aside only exists on wide screens.
  const [wide, setWide] = useState(() => window.matchMedia(wideQuery).matches)
  // A reload keeps the open case: history.state survives it, and the saved draft or record backs it up.
  const [restored] = useState(() => {
    const entry = window.history.state
    return entry?.caseScreen === 'quiz' || entry?.caseScreen && CASES.some(item => item.id === entry.caseId) ? entry : null
  })
  const [activeId, setActiveId] = useState(restored?.caseId ?? null)
  const [screenChoice, setScreen] = useState(restored?.caseScreen ?? 'library')
  const [storageWarning, setStorageWarning] = useState(false)
  const headingRef = useRef(null)
  const feedbackRef = useRef(null)
  const searchRef = useRef(null)
  const item = CASES.find(item => item.id === activeId)
  const draft = item ? progress.drafts[item.id] : null
  // Fall back to the library if the requested screen has nothing to show (e.g. a finished draft).
  const quizReady = CASES.filter(item => progress.records[item.id]).length >= QUIZ_MIN_CASES
  const screen = screenChoice === 'play' && draft || screenChoice === 'review' && item && progress.records[item.id] || screenChoice === 'quiz' && quizReady ? screenChoice : 'library'
  const stage = draft?.stage ?? 0
  const step = item && draft ? attemptStep(item, draft, stage) : null
  const entry = draft?.entries[stage]
  const due = dueCases(progress)
  const mastered = CASES.filter(item => caseStatus(progress, item) === 'mastered').length
  const finishedIds = CASES.filter(item => progress.records[item.id]).map(item => item.id)
  const visible = sortCases(filterCases(CASES, progress, { search, category: category === 'All' ? 'all' : category, status: filters.status, level: filters.level, sector: filters.sector }), progress, sort)
  const facts = item && draft ? item.steps.slice(0, stage + 1).flatMap((step, index) => draft.entries[index].submitted ? step.reveal ?? [] : []) : []
  const showCheck = step && !(step.kind === 'calculation' && !entry.revealed) && !(step.kind === 'build' && entry.part < step.parts.length - 1)

  const selectSection = id => {
    setLibraryTab(id)
    setScreen('library')
    if (id === 'frameworks') setFrameworkOpened(true)
    if (id === 'maths') setMathsOpened(true)
    if (id === 'industries') setIndustriesOpened(true)
    if (id === 'mental') setMentalOpened(true)
    if (id === 'cards') setCardsOpened(true)
    if (id === 'settings') setSettingsOpened(true)
    if (id === 'interview') setInterviewOpened(true)
  }
  const openSection = id => { selectSection(id); window.location.hash = studySections.find(item => item.id === id).hash }

  useEffect(() => {
    const followSection = () => {
      if (window.location.pathname.replace(/\/$/, '') !== '/cases') return
      const section = studySections.find(item => item.hash === window.location.hash)
      if (section || !window.location.hash) selectSection(section?.id ?? 'home')
    }
    const followHistory = () => {
      const entry = window.history.state
      if (entry?.caseScreen === 'quiz' || entry?.caseScreen && CASES.some(item => item.id === entry.caseId)) { setLibraryTab('cases'); setActiveId(entry.caseId ?? null); setScreen(entry.caseScreen) }
      else followSection()
    }
    window.addEventListener('hashchange', followSection)
    window.addEventListener('popstate', followHistory)
    return () => { window.removeEventListener('hashchange', followSection); window.removeEventListener('popstate', followHistory) }
  }, [])
  useEffect(() => { if (!saveCaseProgress(progress)) setStorageWarning(true) }, [progress])
  useEffect(() => {
    const query = window.matchMedia(wideQuery)
    const update = () => setWide(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  // On phones the section bar is a scrollable row, so keep the active tab visible.
  useEffect(() => {
    document.querySelector('.case-library-switch a[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [libraryTab])
  // '/' focuses the case search, like a problem bank.
  useEffect(() => {
    const onKey = event => {
      if (event.key !== '/' || libraryTab !== 'cases' || screen !== 'library') return
      const tag = document.activeElement?.tagName
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return
      event.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [libraryTab, screen])
  useEffect(() => {
    if (!active) return
    headingRef.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [active, activeId, screen, stage])
  useEffect(() => {
    if (!active || screen !== 'play' || !draft || entry.submitted || !progress.timed) return
    let last = performance.now()
    const reset = () => { last = performance.now() }
    const interval = setInterval(() => {
      if (document.hidden) { reset(); return }
      const seconds = Math.floor((performance.now() - last) / 1000)
      if (seconds > 0) { last += seconds * 1000; dispatch({ type: 'tick', caseId: activeId, stage, seconds }) }
    }, 1000)
    document.addEventListener('visibilitychange', reset)
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', reset) }
  }, [active, activeId, draft?.id, entry?.submitted, progress.timed, screen, stage])

  // Case screens get their own history entry so Back (and the header link) returns to the library.
  const enterScreen = (id, view) => {
    const entry = { caseScreen: view, caseId: id }
    if (window.history.state?.caseScreen) window.history.replaceState(entry, '', '#full-cases')
    else window.history.pushState(entry, '', '#full-cases')
    setLibraryTab('cases'); setActiveId(id); setScreen(view)
  }
  const openCase = id => {
    dispatch({ type: 'start', caseId: id }); enterScreen(id, 'play')
  }
  const openReview = id => enterScreen(id, 'review')
  const openQuiz = () => enterScreen(null, 'quiz')
  const showLibrary = () => { if (window.history.state?.caseScreen) window.history.back(); else setScreen('library') }
  const openRecall = () => document.getElementById('case-recall')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  // Cards and maths live in lazy chunks; these reach the modules once mounted.
  const openDeck = id => import('./Flashcards.jsx').then(module => module.flashcardsNav.browse?.(id))
  const openDecksHome = () => import('./Flashcards.jsx').then(module => module.flashcardsNav.home?.())
  const setFilter = (key, value) => setFilters(current => ({ ...current, [key]: value }))
  const clearFilters = () => { setSearch(''); setCategory('All'); setFilters({ status: 'all', level: 'all', sector: 'all' }) }
  const filterRow = (group, label, count, pressed, onClick) => <button type="button" key={`${group}-${label}`} aria-pressed={pressed} onClick={onClick}><span>{label}</span><span className="count">{count}</span></button>
  const categoryRows = <>
    {filterRow('category', 'All', CASES.length, category === 'All', () => setCategory('All'))}
    {categories.slice(1).map(value => filterRow('category', value, CASES.filter(item => item.category === value).length, category === value, () => setCategory(value)))}
  </>

  const sectionTabs = <nav className="case-library-switch" aria-label="Practice section">{studySections.map(section => <a key={section.id} href={section.hash} aria-current={libraryTab === section.id ? 'page' : undefined} onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) selectSection(section.id) }}><span>{section.label}</span><small>{section.hint}</small></a>)}</nav>
  const libraryNav = <>
    <h3>Sections</h3>
    {studySections.map(section => {
      const Icon = SECTION_ICONS[section.id]
      return <a key={section.id} href={section.hash} aria-current={libraryTab === section.id ? 'page' : undefined} onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) selectSection(section.id) }}><Icon size={16} aria-hidden="true" /><span>{section.label}</span></a>
    })}
    {libraryTab === 'cases' && <><h3>Categories</h3>{categoryRows}</>}
    {libraryTab === 'cards' && <Suspense fallback={null}><DecksNav onBrowse={openDeck} onAll={openDecksHome} /></Suspense>}
  </>
  const casesAside = libraryTab === 'cases' ? <>
    <div className="app-mobile-only"><h3>Categories</h3>{categoryRows}</div>
    <h3>Status</h3>
    {filterRow('status', 'All', CASES.length, filters.status === 'all', () => setFilter('status', 'all'))}
    {STATUS_KEYS.map(key => filterRow('status', statusLabel[key], CASES.filter(item => caseStatus(progress, item) === key).length, filters.status === key, () => setFilter('status', key)))}
    <h3>Difficulty</h3>
    {filterRow('level', 'All', CASES.length, filters.level === 'all', () => setFilter('level', 'all'))}
    {LEVEL_KEYS.map(key => filterRow('level', key, CASES.filter(item => item.level === key).length, filters.level === key, () => setFilter('level', key)))}
    <h3>Sector</h3>
    {filterRow('sector', 'All', CASES.length, filters.sector === 'all', () => setFilter('sector', 'all'))}
    {(showAllSectors ? SECTOR_LIST : SECTOR_LIST.slice(0, 12)).map(([sector, count]) => filterRow('sector', sector, count, filters.sector === sector, () => setFilter('sector', sector)))}
    {SECTOR_LIST.length > 12 && <button type="button" className="app-aside-show-all" onClick={() => setShowAllSectors(value => !value)}>{showAllSectors ? 'Show fewer' : `Show all ${SECTOR_LIST.length} sectors`}</button>}
  </> : libraryTab === 'mental' && wide && !mathFocus ? <Suspense fallback={null}><MathAside /></Suspense> : null
  const submit = event => {
    event.preventDefault()
    if (!canSubmitStep(step, entry)) return
    checkCaseAnswer(step, entryAnswer(entry)) ? playCorrect() : playWrong()
    dispatch({ type: 'submit', caseId: item.id })
    requestAnimationFrame(() => feedbackRef.current?.scrollIntoView({ block: 'nearest' }))
  }
  const next = () => {
    if (!entry.submitted) return
    if (stage === item.steps.length - 1) { dispatch({ type: 'complete', caseId: item.id }); recordActivity('cases'); enterScreen(item.id, 'review') }
    else dispatch({ type: 'stage', caseId: item.id, stage: stage + 1 })
  }

  return <main className="cases-page page-container" id="cases-content" tabIndex={-1}>
    {storageWarning && (screen !== 'library' || libraryTab === 'cases') && <p className="case-storage-warning" role="status">Browser storage is unavailable. Progress lasts only until you reload or close this page.</p>}
    {screen === 'library' && <AppShell tabs={sectionTabs} nav={libraryNav} aside={casesAside}>
      <h1 className="sr-only" ref={headingRef} tabIndex={-1}>Cases</h1>
      {libraryTab === 'home' && <Overview progress={progress} active={active} onOpenSection={openSection} onOpenCase={openCase} onOpenReview={openReview} onOpenQuiz={openQuiz} />}
      {libraryTab === 'cases' && <div className="screen-enter">
      <h2 className="sr-only">Full cases</h2>
      <NextUp progress={progress} onOpen={openCase} onRecall={finishedIds.length >= QUIZ_MIN_CASES ? openQuiz : openRecall} />
      <QuickRecallCard finished={finishedIds.length} onStart={openQuiz} />
      <div className="case-table-toolbar">
        <input ref={searchRef} type="search" className="case-search" placeholder="Search cases" aria-label="Search cases" value={search} onChange={event => setSearch(event.target.value)} />
        <label className="case-sort-label">Order <select className="case-sort" value={sort} onChange={event => setSort(event.target.value)}><option value="library">Library</option><option value="title">Title</option><option value="difficulty">Difficulty</option><option value="status">Status</option></select></label>
      </div>
      <div className="case-library-stats"><span><strong>{mastered}/{CASES.length}</strong> mastered</span><span><strong>{Object.keys(progress.records).length}/{CASES.length}</strong> practised</span><span><strong>{due.length}</strong> ready to recall</span></div>
      <ol className="case-rows">{visible.map(item => {
        const record = progress.records[item.id]
        const draft = progress.drafts[item.id]
        const status = caseStatus(progress, item)
        return <li className={`case-row case-${item.category.toLowerCase().replaceAll(' ', '-')}`} key={item.id}>
          <div className="case-row-lead">
            <span className={`status-dot status-${status}`} aria-hidden="true" /><span className="sr-only">{statusLabel[status]}</span>
            <span className="case-row-num" aria-hidden="true">{String(CASES.indexOf(item) + 1).padStart(2, '0')}</span>
            <div className="case-row-title"><strong>{item.title}</strong><span>{item.focus} · {item.sector}</span></div>
          </div>
          <div className="case-row-meta">
            <span className="case-category">{item.category}</span><span className="case-row-level">{item.level}</span>
          </div>
          <div className="case-row-progress">
            {record && <MasteryMeter level={masteryLevel(record)} />}
            {(draft || record) && <span className="case-row-note">{draft ? `Paused at ${STAGES[draft.stage].toLowerCase()}` : `${record.summary.correct}/${record.summary.total} last time · ${status === 'due' ? 'recall now' : `next recall ${shortDate(record.dueAt)}`}`}</span>}
          </div>
          <div className="case-row-actions"><button className="case-start-button" onClick={() => openCase(item.id)}>{draft ? 'Continue' : status === 'due' ? 'Recall now' : record ? 'Practise again' : 'Start case'} <ArrowRight size={16} /></button>{record && <button className="quiet-button" onClick={() => openReview(item.id)}>Takeaways</button>}</div>
        </li>
      })}</ol>
      {visible.length === 0 && <p className="lesson-empty">No cases match. Clear the filters. <button type="button" className="quiet-button" onClick={clearFilters}>Clear</button></p>}
      <RecallSheet progress={progress} />
      <details className="case-method"><summary>How this practice works</summary><label className="case-timer-toggle"><input type="checkbox" checked={progress.timed} onChange={event => dispatch({ type: 'timer', enabled: event.target.checked })} /><Clock size={15} /> Show a pace timer <span>(optional, no penalty)</span></label><ul><li>No typing: choose priorities, work out calculations mentally, then build a recommendation from action, evidence, and risk choices.</li><li>Commit before seeing the explanation. Checks use the stated case facts; they do not assess writing, speaking, or overall consulting ability.</li><li>Each priority and recommendation part earns its own check. Hints are recorded; the optional pace timer has no deadline or score penalty.</li><li>A case is mastered after three clean runs in a row, each on or after its recall date (3, 7, then 14 days apart). Practising early is fine but does not move mastery; a mistake or hint brings the case back the next day.</li><li>Each finished case unlocks a recall card: the takeaway, the key number, the common trap, and the correct path.</li><li>Earlier drafts and written reviews are preserved locally and not retroactively graded.</li><li>Practice assumptions are identified with the exercise data.</li><li>Checks test choices in each scenario, not how you write or speak. Your progress stays in this browser and is never sent to a server.</li></ul></details>
      </div>}
      <div className="screen-enter" hidden={libraryTab !== 'maths'}>{mathsOpened && <Suspense fallback={<p className="cases-loading" role="status">Loading maths lessons…</p>}><CaseMaths active={active && screen === 'library' && libraryTab === 'maths'} onOpenFrameworks={() => openSection('frameworks')} onOpenCases={() => openSection('cases')} /></Suspense>}</div>
      <div className="screen-enter" hidden={libraryTab !== 'industries'}>{industriesOpened && <Suspense fallback={<p className="cases-loading" role="status">Loading sector notes…</p>}><Industries active={active && screen === 'library' && libraryTab === 'industries'} onOpenCase={openCase} /></Suspense>}</div>
      <div className="screen-enter" hidden={libraryTab !== 'frameworks'}>{frameworkOpened && <Suspense fallback={<p className="cases-loading" role="status">Loading framework drills…</p>}><Frameworks active={active && screen === 'library' && libraryTab === 'frameworks'} onOpenCase={openCase} /></Suspense>}</div>
      <div className="screen-enter" hidden={libraryTab !== 'mental'}>{mentalOpened && <Suspense fallback={<p className="cases-loading" role="status">Loading mental maths…</p>}><MathPractice hideSide onPhaseChange={phase => setMathFocus(phase !== 'setup')} /></Suspense>}</div>
      <div className="screen-enter" hidden={libraryTab !== 'cards'}>{cardsOpened && <Suspense fallback={<p className="cases-loading" role="status">Loading cards…</p>}><Flashcards active={active && screen === 'library' && libraryTab === 'cards'} /></Suspense>}</div>
      <div className="screen-enter" hidden={libraryTab !== 'interview'}>{interviewOpened && <Suspense fallback={<p className="cases-loading" role="status">Loading the interview guide…</p>}><InterviewGuide active={active && screen === 'library' && libraryTab === 'interview'} onOpenSection={openSection} /></Suspense>}</div>
      <div className="screen-enter" hidden={libraryTab !== 'settings'}>{settingsOpened && <Suspense fallback={<p className="cases-loading" role="status">Loading settings…</p>}><Settings active={active && screen === 'library' && libraryTab === 'settings'} onOpenSection={openSection} /></Suspense>}</div>
    </AppShell>}

    {screen === 'play' && <section className="case-workspace screen-enter" aria-labelledby="case-title">
      <div className="case-topline"><button className="quiet-button" onClick={showLibrary}><ArrowLeft size={16} /> All cases</button><span className="case-category">{item.category}</span></div>
      <header className="case-session-heading"><h1 id="case-title">{item.title}</h1></header>
      {draft.migrated && <p className="case-migration-note">Your earlier work is preserved. Unanswered prompts now use tap-only decisions.</p>}
      <details className="case-brief" open={stage === 0 ? true : undefined}><summary>Client brief{facts.length > 0 && ` · ${facts.length} known facts`}</summary><p>{item.brief}</p>{facts.length > 0 && <ul>{facts.map(fact => <li key={fact}>{fact}</li>)}</ul>}</details>
      <nav className="case-stages" aria-label="Case stages">{STAGES.map((label, index) => <button key={label} aria-current={stage === index ? 'step' : undefined} disabled={index > 0 && !draft.entries.slice(0, index).every(entry => entry.submitted)} onClick={() => dispatch({ type: 'stage', caseId: item.id, stage: index })}><span>{draft.entries[index].submitted ? <Check size={15} /> : index + 1}</span><small aria-hidden="true">{label}</small><span className="sr-only">{label}</span></button>)}</nav>
      <section className="case-prompt-panel screen-enter" key={stage}>
        <div className="case-prompt-meta"><span className="case-eyebrow">{STAGES[stage]} · {promptType(step)}</span>{progress.timed && <span className={`case-pace ${entry.elapsed > STAGE_TARGETS[stage] ? 'pace-over' : ''}`} role="timer" aria-label={`${entry.elapsed} seconds spent on this prompt`}><Clock size={14} /> {clock(entry.elapsed)} <small>/ {clock(STAGE_TARGETS[stage])} guide</small></span>}</div>
        <h2 ref={headingRef} tabIndex={-1}>{step.prompt}</h2>
        {entry.previousDraft && <details className="previous-case-draft"><summary>Your earlier written draft</summary><p>{entry.previousDraft}</p><span className="case-muted">Kept for reference, not evaluated or sent anywhere.</span></details>}
        {step.exhibit && <><p className="case-data-note">{step.dataNote}</p><div className="case-exhibit-wrap"><table className="case-exhibit"><caption className="sr-only">Case data for the calculation</caption><thead><tr>{step.exhibit[0].map(cell => <th key={cell} scope="col">{cell}</th>)}</tr></thead><tbody>{step.exhibit.slice(1).map((row, index) => <tr key={index}>{row.map((cell, column) => column === 0 ? <th scope="row" key={column}>{cell}</th> : <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div></>}
        {entry.legacy ? <p className="your-case-answer"><strong>Saved response from the earlier format</strong><span>{entryAnswer(entry)}</span></p> : <form onSubmit={submit}>
          <TapAnswer step={step} entry={entry} name={`case-${item.id}-${stage}`} onAction={action => dispatch({ ...action, caseId: item.id })} />
          {!entry.submitted && <><div className="case-prompt-actions">{showCheck && <button className="math-button" disabled={!canSubmitStep(step, entry)}>{step.kind === 'build' ? 'Check recommendation' : step.kind === 'select' ? 'Check priorities' : 'Check answer'}</button>}<button className="quiet-button" type="button" onClick={() => dispatch({ type: 'hint', caseId: item.id })} disabled={entry.hinted}><Lightbulb size={16} /> {entry.hinted ? 'Hint used' : 'Need a hint?'}</button></div>{entry.hinted && <p className="case-hint" role="status">{step.hint}</p>}</>}
        </form>}
        {entry.submitted && <div ref={feedbackRef}><Feedback step={step} entry={entry} />{step.reveal && <div className="case-reveal"><h3>What the client tells you</h3><ul>{step.reveal.map(fact => <li key={fact}>{fact}</li>)}</ul></div>}<button className="math-button case-next-button" onClick={next}>{stage === STAGES.length - 1 ? 'Finish case' : `Next: ${STAGES[stage + 1]}`} <ArrowRight size={16} /></button></div>}
      </section>
    </section>}

    {screen === 'quiz' && <RecallQuiz finishedIds={finishedIds} onLibrary={showLibrary} onOpenReview={openReview} />}
    {screen === 'review' && <CaseReview key={item.id} item={item} record={progress.records[item.id]} resume={Boolean(draft)} next={nextCase(progress)} onReplay={() => openCase(item.id)} onNext={() => openCase(nextCase(progress).item.id)} onLibrary={showLibrary} />}
  </main>
}
