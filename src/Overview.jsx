import { useEffect, useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react/ArrowRight'
import { Lightning } from '@phosphor-icons/react/Lightning'
import { MathOperations } from '@phosphor-icons/react/MathOperations'
import { TreeStructure } from '@phosphor-icons/react/TreeStructure'
import { Buildings } from '@phosphor-icons/react/Buildings'
import { Briefcase } from '@phosphor-icons/react/Briefcase'
import { Calculator } from '@phosphor-icons/react/Calculator'
import { Cards } from '@phosphor-icons/react/Cards'
import { Flame } from '@phosphor-icons/react/Flame'
import { CASES, STAGES } from './casebook.js'
import { caseStatus, dueCases, masteryLevel, nextCase } from './case-practice.js'
import { FRAMEWORKS } from './frameworks.js'
import { frameworkStats, loadFrameworkProgress } from './framework-practice.js'
import { CASE_MATH_LESSONS } from './case-maths.js'
import { loadMathLessonProgress } from './case-maths-practice.js'
import { deckStats, loadFlashcards } from './flashcard-practice.js'
import { INDUSTRIES } from './industries.js'
import { loadStudyPlan, saveStudyPlan, setTarget, streak, subscribeStudyPlan, weekProgress } from './study-plan.js'
import PlanRow from './PlanRow.jsx'
import { industriesRead, loadIndustryProgress } from './industry-progress.js'
import { interviewDone, loadInterviewProgress } from './interview-progress.js'
import { INTERVIEW_CHECKLIST } from './interview-guide.js'
import { Handshake } from '@phosphor-icons/react/Handshake'

const refresh = () => ({ frameworks: loadFrameworkProgress(), maths: loadMathLessonProgress(), cards: loadFlashcards(), plan: loadStudyPlan(), sectors: loadIndustryProgress(), interview: loadInterviewProgress() })
const caseCategories = [...new Set(CASES.map(item => item.category))]
const greeting = (hour = new Date().getHours()) => hour < 5 ? 'Late-night prep' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'



export default function Overview({ progress, active, onOpenSection, onOpenCase, onOpenReview, onOpenQuiz }) {
  const [snapshot, setSnapshot] = useState(refresh)
  useEffect(() => subscribeStudyPlan(() => setSnapshot(refresh())), [])
  useEffect(() => { if (active) setSnapshot(refresh()) }, [active])

  const now = Date.now()
  const { frameworks: fw, maths, cards, plan, sectors, interview } = snapshot
  const interviewReady = interviewDone(interview, INTERVIEW_CHECKLIST.map(item => item.id))
  const sectorsRead = industriesRead(sectors, INDUSTRIES.map(item => item.id))
  const fwStats = frameworkStats(fw)
  const cardStats = deckStats(cards, null, now)
  const week = weekProgress(plan, now)
  const dayStreak = streak(plan, now)
  const dueList = dueCases(progress)
  const mastered = CASES.filter(item => caseStatus(progress, item) === 'mastered').length
  const practised = CASES.filter(item => progress.records[item.id]).length
  const mathsDone = CASE_MATH_LESSONS.filter(item => maths.records[item.id]?.completed > 0).length
  const mathsOpen = Boolean(maths.session && !maths.session.finished)
  const drillOpen = Boolean(fw.session && !fw.session.finished)
  const { item: next, reason } = nextCase(progress, now)
  const nextDraft = progress.drafts[next.id]

  const status = [
    dueList.length ? `${dueList.length} recall${dueList.length === 1 ? '' : 's'} due` : '',
    fwStats.due ? `${fwStats.due} drill${fwStats.due === 1 ? '' : 's'} due` : '',
    cardStats.due ? `${cardStats.due} card${cardStats.due === 1 ? '' : 's'} due` : '',
    dayStreak ? `${dayStreak}-day streak` : '',
  ].filter(Boolean).join(' · ') || 'Nothing due. Pick anything below.'

  const continueCopy = {
    draft: ['Paused at ' + STAGES[nextDraft?.stage ?? 0].toLowerCase(), 'Continue'],
    due: ['Try it from memory before the takeaway fades.', 'Recall due'],
    new: [next.focus + '.', 'New case'],
    waiting: ['All caught up. Warm up with a quick recall, or review the takeaways.', 'Review'],
    mastered: ['All cases mastered. Keep them fresh with a quick recall.', 'Review'],
  }[reason]

  const stepTarget = kind => delta => {
    const updated = setTarget(plan, kind, plan.targets[kind] + delta)
    saveStudyPlan(updated)
    setSnapshot(current => ({ ...current, plan: updated }))
  }

  const leastPractised = [...FRAMEWORKS].sort((a, b) => frameworkStats(fw, a.id, now).practised - frameworkStats(fw, b.id, now).practised)[0]
  const dueFramework = FRAMEWORKS.find(item => frameworkStats(fw, item.id, now).due > 0)
  const suggestions = [
    reason === 'due' ? { text: `Recall “${next.title}”`, action: () => onOpenCase(next.id) }
      : reason === 'new' || reason === 'draft' ? { text: `${reason === 'draft' ? 'Continue' : 'Start'} “${next.title}”`, action: () => onOpenCase(next.id) } : null,
    dueFramework ? { text: `${frameworkStats(fw, dueFramework.id, now).due} drills due in “${dueFramework.title}”`, action: () => onOpenSection('frameworks') }
      : leastPractised ? { text: `Try “${leastPractised.title}” drills`, action: () => onOpenSection('frameworks') } : null,
    cardStats.due ? { text: `${cardStats.due} cards due`, action: () => onOpenSection('cards') } : null,
  ].filter(Boolean).slice(0, 3)

  const tiles = [
    { label: 'Full cases', Icon: Briefcase, ratio: mastered / CASES.length, lines: [`${mastered}/${CASES.length} mastered · ${practised} practised`, dueList.length ? `${dueList.length} ready to recall` : 'Nothing due'], action: 'Open', open: () => onOpenSection('cases') },
    { label: 'Case maths', Icon: MathOperations, ratio: mathsDone / CASE_MATH_LESSONS.length, lines: [`${mathsDone}/${CASE_MATH_LESSONS.length} lessons completed`, mathsOpen ? 'Unfinished practice' : 'Three checks per lesson'], action: 'Practise', open: () => onOpenSection('maths') },
    { label: 'Frameworks', Icon: TreeStructure, ratio: fwStats.total ? fwStats.spaced / fwStats.total : 0, lines: [`${fwStats.spaced}/${fwStats.total} on spaced recall`, fwStats.due ? `${fwStats.due} due` : 'Nothing due'], action: 'Drill', open: () => onOpenSection('frameworks') },
    { label: 'Cards', Icon: Cards, ratio: cardStats.total ? cardStats.mastered / cardStats.total : 0, lines: [`${cardStats.mastered}/${cardStats.total} mastered`, cardStats.due ? `${cardStats.due} due` : 'Nothing due'], action: 'Review', open: () => onOpenSection('cards') },
    { label: 'Industries', Icon: Buildings, ratio: sectorsRead / INDUSTRIES.length, lines: [`${sectorsRead}/${INDUSTRIES.length} sector notes read`, 'Value chains, drivers and trends'], action: 'Read', open: () => onOpenSection('industries') },
    { label: 'Interview', Icon: Handshake, ratio: interviewReady / INTERVIEW_CHECKLIST.length, lines: [`${interviewReady}/${INTERVIEW_CHECKLIST.length} answers and stories ready`, 'Motivation, experience, your questions'], action: 'Prepare', open: () => onOpenSection('interview') },
    { label: 'Mental maths', Icon: Calculator, lines: ['Timed rounds against the clock', 'Beat your personal best'], action: 'Play', open: () => onOpenSection('mental') },
  ]

  const openNext = () => reason === 'waiting' || reason === 'mastered' ? (progress.records[next.id] ? onOpenReview(next.id) : onOpenQuiz()) : onOpenCase(next.id)
  const dueTotal = dueList.length + fwStats.due + cardStats.due

  return <div className="overview screen-enter">
    <section className="overview-hero" aria-label="Next step">
      <div className="overview-hero-copy">
        <p className="overview-greeting">{greeting()}</p>
        <p className="overview-status">{status}</p>
        <div className="case-next-up overview-continue">
          <div>
            <span className="case-eyebrow">{reason === 'draft' ? 'Continue where you left off' : reason === 'due' ? 'Recall due' : ['waiting', 'mastered'].includes(reason) ? 'All caught up' : 'Your next case'}</span>
            <h3>{['waiting', 'mastered'].includes(reason) ? 'Revise your takeaways' : next.title}</h3>
            <p>{continueCopy[0]}{!['waiting', 'mastered'].includes(reason) && next.category ? <span className="overview-next-meta"> · {next.category} · {next.level}</span> : null}</p>
          </div>
          <button className="math-button" onClick={openNext}>{continueCopy[1]} <ArrowRight size={16} weight="bold" /></button>
        </div>
      </div>
      <dl className="overview-stats">
        <div><dt>Day streak</dt><dd><Flame size={18} weight="fill" aria-hidden="true" />{dayStreak}</dd></div>
        <div><dt>Due today</dt><dd>{dueTotal}</dd></div>
        <div><dt>Cases mastered</dt><dd>{mastered}<small>/{CASES.length}</small></dd></div>
      </dl>
    </section>
    {drillOpen && <div className="quick-recall-card overview-resume"><div><strong>Unfinished drill round</strong><p>A saved round is waiting in Frameworks.</p></div><button className="quiet-button" onClick={() => onOpenSection('frameworks')}>Return <ArrowRight size={15} /></button></div>}

    <section className="overview-tiles" aria-label="Practice sections">{tiles.map(({ Icon, ...tile }) => <article className="overview-tile" key={tile.label}>
      <header><span className="overview-tile-icon" aria-hidden="true"><Icon size={18} weight="duotone" /></span><h3>{tile.label}</h3></header>
      {tile.lines.map(line => <p key={line}>{line}</p>)}
      {tile.ratio !== undefined && <span className="overview-tile-bar" aria-hidden="true"><span style={{ width: `${Math.round(tile.ratio * 100)}%` }} /></span>}
      <button className="case-start-button" onClick={tile.open}>{tile.action} <ArrowRight size={15} /></button>
    </article>)}</section>

    <div className="overview-columns">
    <section className="overview-plan" aria-labelledby="plan-heading">
      <header><h2 id="plan-heading">This week</h2><p>Targets, not scores. Resets Monday.</p></header>
      <PlanRow label="Cases finished" done={week.cases.done} target={week.cases.target} onChange={stepTarget('cases')} />
      <PlanRow label="Drills checked" done={week.drills.done} target={week.drills.target} onChange={stepTarget('drills')} />
      <PlanRow label="Cards reviewed" done={week.cards.done} target={week.cards.target} onChange={stepTarget('cards')} />
      <p className="plan-extra">{week.maths.done} maths exercise{week.maths.done === 1 ? '' : 's'} this week{dayStreak ? ` · ${dayStreak}-day streak` : ''}</p>
    </section>

    <section className="overview-mastery" aria-labelledby="mastery-heading">
      <header><h2 id="mastery-heading">Mastery by category</h2></header>
      {caseCategories.map(category => {
        const items = CASES.filter(item => item.category === category)
        const done = items.filter(item => caseStatus(progress, item) === 'mastered').length
        const seen = items.filter(item => progress.records[item.id]).length - done
        return <div className="mastery-row" key={category}>
          <span className="mastery-label">{category}</span>
          <span className="mastery-bar" role="img" aria-label={`${category}: ${done} of ${items.length} mastered`}>
            <span className="mastery-mastered" style={{ width: `${done / items.length * 100}%` }} />
            <span className="mastery-seen" style={{ width: `${seen / items.length * 100}%` }} />
          </span>
          <span className="mastery-count">{done}/{items.length}</span>
        </div>
      })}
    </section>
    </div>

    {suggestions.length > 0 && <section className="overview-suggestions" aria-labelledby="suggestions-heading">
      <header><h2 id="suggestions-heading">Suggested next</h2></header>
      {suggestions.map((item, index) => <div className="suggestion-row" key={index}><span>{index === 0 && <Lightning size={14} aria-hidden="true" />}{item.text}</span><button className="quiet-button" onClick={item.action}>Open <ArrowRight size={15} /></button></div>)}
    </section>}
  </div>
}
