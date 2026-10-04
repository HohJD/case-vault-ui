import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react/ArrowLeft'
import { ArrowRight } from '@phosphor-icons/react/ArrowRight'
import { ArrowCounterClockwise } from '@phosphor-icons/react/ArrowCounterClockwise'
import { Check } from '@phosphor-icons/react/Check'
import { Shuffle } from '@phosphor-icons/react/Shuffle'
import { SpeakerSimpleHigh } from '@phosphor-icons/react/SpeakerSimpleHigh'
import { SpeakerSimpleSlash } from '@phosphor-icons/react/SpeakerSimpleSlash'
import { X } from '@phosphor-icons/react/X'
import { CARDS, DECKS } from './flashcards.js'
import { AGAIN_CHOICES, CARD_MASTERY, GRADES, ROUND_LENGTH, buildCardRound, cardQuestion, deckCards, deckName, deckStats, gradeCard, gradeLabel, loadFlashcards, saveFlashcards, setSetting } from './flashcard-practice.js'
import { recordActivity } from './study-plan.js'
import Verdict from './Verdict.jsx'
import CardFigure from './CardFigure.jsx'
import { playCorrect, playDone, playWrong, setSoundOn, soundOn } from './sound.js'
import './flashcards.css'

const GRADE_LABELS = { again: 'Again', hard: 'Hard', good: 'Good', easy: 'Easy' }
const card = id => CARDS.find(item => item.id === id)

function Meter({ level }) {
  return <span className="card-meter" role="img" aria-label={`Mastery ${level} of ${CARD_MASTERY}`}>{Array.from({ length: CARD_MASTERY }, (_, index) => <span key={index} className={index < level ? 'filled' : ''} />)}</span>
}

// Mental renders this in the shared sidebar; the callbacks get registered once Flashcards mounts.
export const flashcardsNav = { browse: null, home: null }
export function DecksNav({ onBrowse, onAll }) {
  return <>
    <h3>Decks</h3>
    <button type="button" onClick={onAll}><span>All decks</span><span className="count">{CARDS.length}</span></button>
    {DECKS.map(deck => <button type="button" key={deck.id} onClick={() => onBrowse(deck.id)}><span>{deck.name}</span><span className="count">{deckCards(deck.id).length}</span></button>)}
  </>
}

export default function Flashcards({ active = true }) {
  const [progress, setProgress] = useState(() => loadFlashcards())
  const [view, setView] = useState('decks')
  const [deckId, setDeckId] = useState(null)
  const [round, setRound] = useState(null)
  const [storageWarning, setStorageWarning] = useState(false)
  const [sound, setSound] = useState(() => soundOn())
  const headingRef = useRef(null)

  useEffect(() => { if (!saveFlashcards(progress)) setStorageWarning(true) }, [progress])
  useEffect(() => {
    if (!active) return
    headingRef.current?.focus({ preventScroll: true })
    headingRef.current?.scrollIntoView({ block: 'nearest' })
  }, [active, view, round?.index])

  const overall = useMemo(() => deckStats(progress, null), [progress])
  const start = id => {
    const pool = id ?? null
    setDeckId(pool)
    setRound({ questions: buildCardRound(progress, pool), index: 0, answers: [], graded: [], repeats: 0 })
    setView('round')
  }
  const browse = id => {
    setDeckId(id); setView('browse')
  }
  const backToDecks = () => { setView('decks'); setRound(null) }
  useEffect(() => {
    flashcardsNav.browse = browse
    flashcardsNav.home = backToDecks
    return () => { flashcardsNav.browse = null; flashcardsNav.home = null }
  }, [])

  const answerCard = option => setRound(current => {
    const question = current.questions[current.index]
    if (option === question.correct) playCorrect(); else playWrong()
    return { ...current, answers: Object.assign([...current.answers], { [current.index]: option }) }
  })
  // Again and Hard put the card back at the end of this round, so minutes mean something in the session.
  const gradeAndAdvance = grade => {
    const question = round.questions[round.index]
    setProgress(state => gradeCard(state, question.cardId, grade))
    recordActivity('cards')
    setRound(current => {
      const repeat = ['again', 'hard'].includes(grade) && current.repeats < ROUND_LENGTH
      if (current.index + 1 >= current.questions.length + (repeat ? 1 : 0)) playDone()
      return {
        ...current,
        questions: repeat ? [...current.questions, cardQuestion(question.cardId, current.questions.length)] : current.questions,
        graded: Object.assign([...current.graded], { [current.index]: grade }),
        repeats: current.repeats + (repeat ? 1 : 0),
        index: current.index + 1,
      }
    })
  }

  if (view === 'round' && round) {
    const { questions, index, answers, graded } = round
    if (index >= questions.length) {
      const first = questions.slice(0, ROUND_LENGTH)
      const score = first.filter((question, position) => answers[position] === question.correct).length
      const missed = [...new Set(questions.filter((question, position) => graded[position] === 'again').map(question => question.cardId))]
      return <section className="cards-screen screen-enter" aria-labelledby="cards-result">
        <button className="quiet-button" onClick={backToDecks}><ArrowLeft size={16} /> All decks</button>
        <header className="page-heading"><span className="case-eyebrow">{deckName(deckId)}</span><h2 id="cards-result" ref={headingRef} tabIndex={-1} className="card-screen-heading">{score === first.length ? 'All of them.' : `${score} of ${first.length} recalled.`}</h2><p>{missed.length ? 'These come back soonest. Read them once more.' : 'Cards you mark Good or Easy come back later, spaced further out each time.'}</p></header>
        {missed.length > 0 && <ul className="card-missed">{missed.map(id => <li key={id}><strong>{card(id).term}</strong><p>{card(id).definition}</p></li>)}</ul>}
        <div className="card-actions"><button className="math-button" onClick={() => start(deckId)}>Another round <ArrowCounterClockwise size={16} /></button><button className="quiet-button" onClick={backToDecks}>All decks <ArrowRight size={16} /></button></div>
      </section>
    }
    const question = questions[index]
    const answer = answers[index]
    const answered = answer !== undefined
    const correct = answer === question.correct
    const item = card(question.cardId)
    return <section className="cards-screen cards-round screen-enter" aria-labelledby="card-prompt">
      <div className="card-topline"><button className="quiet-button" onClick={backToDecks}><ArrowLeft size={16} /> All decks</button><span className="card-count">{index + 1} of {questions.length}</span></div>
      <div className="card-progress" aria-hidden="true">{questions.map((_, position) => <span key={position} className={position < index ? (graded[position] === 'again' ? 'wrong' : 'right') : position === index ? 'current' : ''} />)}</div>
      <section className="card-panel" key={index}>
        <span className="case-eyebrow">{question.kind === 'define' ? 'What does this mean?' : 'Which term is this?'}</span>
        <h2 id="card-prompt" ref={headingRef} tabIndex={-1} className={question.kind === 'name' ? 'card-prompt-long' : ''}>{question.prompt}</h2>
        <div className="card-choices" role="group" aria-label="Answers">{question.options.map(option => {
          const state = !answered ? '' : option.id === question.correct ? 'card-right' : option.id === answer ? 'card-wrong' : 'card-dim'
          return <button type="button" key={option.id} className={state} disabled={answered} onClick={() => answerCard(option.id)}>{answered && option.id === question.correct && <Check size={15} aria-hidden="true" />}{answered && option.id === answer && answer !== question.correct && <X size={15} aria-hidden="true" />}<span>{option.label}</span></button>
        })}</div>
        {answered && <>
          <Verdict correct={correct} />
          {!correct && <p className="verdict-answer"><strong>Correct answer:</strong> {question.options.find(option => option.id === question.correct).label}</p>}
          <div className="card-feedback">
            <p><strong>{item.term}</strong>{item.short ? ` · ${item.short}` : ''}</p>
            {question.kind === 'name' && <p>{item.definition}</p>}
            {item.example && <p className="card-example"><strong>For example:</strong> {item.example}</p>}
            <p className="card-trap"><strong>Trap:</strong> {item.trap}</p>
            {item.figure && <CardFigure name={item.figure} />}
          </div>
          <p className="card-grade-label" id="grade-help">When should this come back?</p>
          <div className="card-grades" role="group" aria-describedby="grade-help">{GRADES.map(grade => <button key={grade} type="button" className={`card-grade grade-${grade} ${answer !== question.correct && grade === 'again' ? 'suggested' : ''}`} onClick={() => gradeAndAdvance(grade)}>
            <span>{GRADE_LABELS[grade]}</span><small>{gradeLabel(progress, question.cardId, grade)}</small>
          </button>)}</div>
        </>}
      </section>
    </section>
  }

  if (view === 'browse') {
    return <section className="cards-screen screen-enter" aria-labelledby="browse-heading">
      <button className="quiet-button" onClick={backToDecks}><ArrowLeft size={16} /> All decks</button>
      <header className="page-heading"><h2 id="browse-heading" ref={headingRef} tabIndex={-1} className="card-screen-heading">{deckName(deckId)}</h2><p>{DECKS.find(deck => deck.id === deckId)?.blurb}</p></header>
      <ul className="card-browse">{deckCards(deckId).map(item => {
        const record = progress.records[item.id]
        return <li key={item.id}>
          <div className="card-browse-head"><strong>{item.term}</strong>{record && <Meter level={record.level} />}</div>
          {item.short && <p className="card-short">{item.short}</p>}
          <p>{item.definition}</p>
          {item.example && <p className="card-example"><strong>For example:</strong> {item.example}</p>}
          <p className="card-trap"><strong>Trap:</strong> {item.trap}</p>
          {item.figure && <CardFigure name={item.figure} />}
        </li>
      })}</ul>
      <div className="card-actions"><button className="math-button" onClick={() => start(deckId)}>Practise this deck <ArrowRight size={16} /></button></div>
    </section>
  }

  return <section className="cards-screen screen-enter" aria-labelledby="cards-heading">
    {storageWarning && <p className="case-storage-warning" role="status">Browser storage is unavailable. Progress lasts only until you reload or close this page.</p>}
    <h2 className="sr-only" id="cards-heading" ref={headingRef} tabIndex={-1}>Cards</h2>
    <div className="card-next-up">
      <div><span className="case-eyebrow">{overall.due > 0 ? `${overall.due} due for recall` : overall.seen === 0 ? 'Start here' : 'Nothing due'}</span><h2>Mixed round</h2><p>{ROUND_LENGTH} cards from every deck, {progress.settings.shuffle ? 'in random order' : 'due ones first'}.</p></div>
      <button className="math-button" onClick={() => start(null)}>Start <ArrowRight size={16} /></button>
    </div>
    <div className="card-toolbar">
      <div className="card-overall"><span><strong>{overall.mastered}/{overall.total}</strong> mastered</span><span><strong>{overall.seen}</strong> seen</span><span><strong>{overall.due}</strong> due</span></div>
      <div className="card-settings">
      <label className="card-toggle"><input type="checkbox" checked={progress.settings.shuffle} onChange={event => setProgress(state => setSetting(state, 'shuffle', event.target.checked))} /><Shuffle size={15} aria-hidden="true" /> Shuffle</label>
      <button type="button" className="card-toggle card-sound" aria-pressed={sound} onClick={() => { setSoundOn(!sound); setSound(!sound); if (!sound) playCorrect() }}>{sound ? <SpeakerSimpleHigh size={16} aria-hidden="true" /> : <SpeakerSimpleSlash size={16} aria-hidden="true" />} Sound {sound ? 'on' : 'off'}</button>
      <div className="card-again" role="group" aria-label="Repeat Again after"><span>Again after</span>{AGAIN_CHOICES.map(minutes => <button key={minutes} type="button" aria-pressed={progress.settings.againMinutes === minutes} onClick={() => setProgress(state => setSetting(state, 'againMinutes', minutes))}>{minutes} min</button>)}</div>
      </div>
    </div>
    <ul className="deck-grid">{DECKS.map(deck => {
      const stats = deckStats(progress, deck.id)
      return <li key={deck.id}>
        <div className="deck-copy">
          <h2>{deck.name}</h2>
          <p>{deck.blurb}</p>
          <span className="deck-meta">{stats.total} cards · {stats.mastered} mastered{stats.due > 0 ? ` · ${stats.due} due` : ''}</span>
        </div>
        <div className="deck-actions"><button className="case-start-button" onClick={() => start(deck.id)}>Practise</button><button className="quiet-button" onClick={() => browse(deck.id)}>Read</button></div>
      </li>
    })}</ul>
  </section>
}
