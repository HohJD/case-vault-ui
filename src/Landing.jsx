import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { ArrowRight } from '@phosphor-icons/react/ArrowRight'
import { ArrowsClockwise } from '@phosphor-icons/react/ArrowsClockwise'
import { Brain } from '@phosphor-icons/react/Brain'
import { Briefcase } from '@phosphor-icons/react/Briefcase'
import { Buildings } from '@phosphor-icons/react/Buildings'
import { Calculator } from '@phosphor-icons/react/Calculator'
import { Cards } from '@phosphor-icons/react/Cards'
import { House } from '@phosphor-icons/react/House'
import { Lightning } from '@phosphor-icons/react/Lightning'
import { Lock } from '@phosphor-icons/react/Lock'
import { MathOperations } from '@phosphor-icons/react/MathOperations'
import { TreeStructure } from '@phosphor-icons/react/TreeStructure'
import { Trophy } from '@phosphor-icons/react/Trophy'
import { CASES, STAGES } from './casebook.js'
import { CASE_MATH_LESSONS, makeCaseMathExercise } from './case-maths.js'
import { FRAMEWORK_DRILLS, FRAMEWORKS } from './frameworks.js'
import { INDUSTRIES } from './industries.js'
import { CARDS, DECKS } from './flashcards.js'
import Verdict from './Verdict.jsx'

const teaserCase = CASES[0]
const teaserStep = teaserCase.steps[0]
const correctOption = teaserStep.options.find(option => option.id === teaserStep.correct)

const CATEGORIES = [...new Set(CASES.map(item => item.category))]
const sectors = new Set(CASES.map(item => item.sector)).size
const LEVEL_ORDER = ['Foundation', 'Intermediate', 'Advanced']
const levels = [...new Set(CASES.map(item => item.level))].sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b))

const mathLesson = CASE_MATH_LESSONS.find(lesson => makeCaseMathExercise(lesson.id, 0).exhibit) ?? CASE_MATH_LESSONS[0]
const flipCards = DECKS.slice(0, 4).map(deck => ({ deck, card: CARDS.find(card => card.deck === deck.id) })).filter(item => item.card)
const marqueeRows = [CASES.filter((_, index) => index % 2 === 0), CASES.filter((_, index) => index % 2 === 1)]

// The same sections, in the same order, as the dashboard sidebar (AppShell).
const DASHBOARD_SECTIONS = [
  { label: 'Overview', Icon: House },
  { label: 'Case maths', Icon: MathOperations },
  { label: 'Frameworks', Icon: TreeStructure },
  { label: 'Industries', Icon: Buildings },
  { label: 'Full cases', Icon: Briefcase },
  { label: 'Mental maths', Icon: Calculator },
  { label: 'Cards', Icon: Cards },
]
// Illustrative progress for the dashboard preview only: totals come from the data, the done counts are an example week.
const PREVIEW_WEEK = [{ label: 'Cases finished', done: 2, target: 3 }, { label: 'Drills checked', done: 7, target: 10 }, { label: 'Cards reviewed', done: 24, target: 30 }]
const PREVIEW_MASTERY = CATEGORIES.slice(0, 5).map((category, index) => {
  const total = CASES.filter(item => item.category === category).length
  return { category, total, done: Math.min(total, [3, 2, 1, 2, 0][index] ?? 0), seen: Math.min(total, [2, 2, 3, 1, 1][index] ?? 0) }
})

const rise = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: .7, ease: [.2, .7, .2, 1] } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: .08 } } }

function Reveal({ children, className, as = 'div', delay = 0, ...rest }) {
  const Tag = motion[as]
  return <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={rise} transition={{ delay }} {...rest}>{children}</Tag>
}

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const [value, setValue] = useState(reduced ? to : 0)
  useEffect(() => {
    if (!inView || reduced) { if (reduced) setValue(to); return }
    const controls = animate(0, to, { duration: 1.6, ease: [.2, .7, .2, 1], onUpdate: latest => setValue(Math.round(latest)) })
    return () => controls.stop()
  }, [inView, reduced, to])
  return <span ref={ref}>{value}{suffix}</span>
}

function RotatingWord({ words }) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (reduced) return
    const timer = setInterval(() => setIndex(current => (current + 1) % words.length), 2200)
    return () => clearInterval(timer)
  }, [reduced, words.length])
  return <span className="lp-rotator" aria-hidden="true">
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span key={words[index]} className="lp-rotator-word" initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: .5, ease: [.2, .7, .2, 1] }}>{words[index]}</motion.span>
    </AnimatePresence>
  </span>
}

// The Overview dashboard, drawn as a picture: same sections, same tiles, same plan and mastery rows.
function DashboardPreview({ onOpen }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-.5, .5], [7, -7]), { stiffness: 140, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-.5, .5], [-9, 9]), { stiffness: 140, damping: 18 })
  const track = event => {
    if (reduced || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - box.left) / box.width - .5)
    y.set((event.clientY - box.top) / box.height - .5)
  }
  const reset = () => { x.set(0); y.set(0) }
  const fill = (ratio, delay) => ({ initial: { scaleX: 0 }, animate: inView ? { scaleX: ratio } : { scaleX: 0 }, transition: { duration: 1.2, delay, ease: [.2, .7, .2, 1] } })

  return <div className="lp-dash-stage" onPointerMove={track} onPointerLeave={reset}>
    <motion.div ref={ref} className="lp-dash" style={{ rotateX, rotateY }} initial={{ opacity: 0, y: 40, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .9, delay: .25, ease: [.2, .7, .2, 1] }} role="img" aria-label="Preview of the Case Vault dashboard: next case, practice sections, a weekly plan and mastery by category">
      <div className="lp-dash-bar" aria-hidden="true"><span /><span /><span /><em>hohjd.com/cases#overview</em></div>
      <div className="lp-dash-body" aria-hidden="true">
        <nav className="lp-dash-nav">
          <small>Sections</small>
          {DASHBOARD_SECTIONS.map(({ label, Icon }, index) => <span key={label} className={index === 0 ? 'active' : ''}><Icon size={13} />{label}</span>)}
        </nav>
        <div className="lp-dash-main">
          <div className="lp-dash-next">
            <div><small>New case</small><strong>{teaserCase.title}</strong><p>{teaserCase.focus ?? teaserCase.category}</p></div>
            <span className="lp-dash-cta">Start <ArrowRight size={11} weight="bold" /></span>
          </div>
          <div className="lp-dash-tiles">
            {[['Case maths', `${CASE_MATH_LESSONS.length} lessons`], ['Frameworks', `${FRAMEWORK_DRILLS.length} drills`], ['Full cases', `${CASES.length} cases`], ['Cards', `${CARDS.length} cards`]].map(([label, line], index) =>
              <motion.div className="lp-dash-tile" key={label} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .5 + index * .08 }}><strong>{label}</strong><span>{line}</span></motion.div>)}
          </div>
          <div className="lp-dash-split">
            <div className="lp-dash-panel">
              <strong>This week</strong>
              {PREVIEW_WEEK.map((row, index) => <div className="lp-dash-row" key={row.label}>
                <span>{row.label}</span>
                <i><motion.b {...fill(row.done / row.target, .7 + index * .12)} /></i>
                <em>{row.done}/{row.target}</em>
              </div>)}
              <p className="lp-dash-streak"><Lightning size={11} weight="fill" /> 5-day streak</p>
            </div>
            <div className="lp-dash-panel">
              <strong>Mastery by category</strong>
              {PREVIEW_MASTERY.map((row, index) => <div className="lp-dash-row" key={row.category}>
                <span>{row.category}</span>
                <i><motion.b {...fill(row.done / row.total, .9 + index * .1)} /><motion.b className="seen" {...fill((row.done + row.seen) / row.total, .8 + index * .1)} /></i>
                <em>{row.done}/{row.total}</em>
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    <motion.button type="button" className="lp-dash-badge" onClick={onOpen} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} whileHover={reduced ? undefined : { y: -3 }}>
      <span className="lp-pulse" aria-hidden="true" />Open your dashboard <ArrowRight size={14} weight="bold" aria-hidden="true" />
    </motion.button>
  </div>
}

function Marquee() {
  return <div className="lp-marquee" aria-label={`${CASES.length} cases in the library`}>
    {marqueeRows.map((row, rowIndex) => <div className={`lp-marquee-track${rowIndex ? ' reverse' : ''}`} key={rowIndex}>
      {[0, 1].map(copy => <ul key={copy} aria-hidden={copy === 1 || undefined}>
        {row.map(item => <li key={item.id}><strong>{item.title}</strong><span>{item.sector} · {item.level}</span></li>)}
      </ul>)}
    </div>)}
  </div>
}

// A genuinely interactive first step: local state only, never touches progress storage.
function TryStep({ onOpen }) {
  const [choice, setChoice] = useState(null)
  const [checked, setChecked] = useState(false)
  const correct = choice === teaserStep.correct
  const chosen = teaserStep.options.find(option => option.id === choice)
  return <div className="lp-try">
    <div className="lp-try-head">
      <span className="lp-eyebrow">Case 01 · {teaserCase.sector}</span>
      <ol className="lp-try-stages" aria-label="Case stages">
        {STAGES.map((stage, index) => <li key={stage} className={index === 0 ? (checked ? 'done' : 'current') : ''}>
          {index > 0 && <Lock size={11} aria-hidden="true" />}{stage}
        </li>)}
      </ol>
    </div>
    <p className="lp-try-prompt">{teaserStep.prompt}</p>
    <fieldset className="lp-try-options" disabled={checked}>
      <legend className="sr-only">Choose one</legend>
      {teaserStep.options.map((option, index) => <label key={option.id} className={checked && option.id === teaserStep.correct ? 'right' : checked && option.id === choice ? 'wrong' : ''}>
        <input type="radio" name="landing-try" checked={choice === option.id} onChange={() => setChoice(option.id)} />
        <span className="lp-try-key" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
        <span>{option.label}</span>
      </label>)}
    </fieldset>
    {!checked && <button type="button" className="lp-button" onClick={() => setChecked(true)} disabled={!choice}>Check answer</button>}
    <AnimatePresence>
      {checked && <motion.div className="lp-try-result" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: .4 }}>
        <Verdict correct={correct} />
        {chosen && <p>{chosen.feedback}</p>}
        {!correct && correctOption && <p className="verdict-answer">Correct answer: <strong>{correctOption.label}</strong></p>}
        <div className="lp-try-next">
          <p>Four more stages to go. Your browser saves every step.</p>
          <button type="button" className="lp-button" onClick={onOpen}>Continue to Structure <ArrowRight size={16} weight="bold" aria-hidden="true" /></button>
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>
}

function MathsShuffle() {
  const [variant, setVariant] = useState(0)
  const exercise = makeCaseMathExercise(mathLesson.id, variant)
  return <div className="lp-maths">
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={variant} initial={{ opacity: 0, rotateX: -50 }} animate={{ opacity: 1, rotateX: 0 }} exit={{ opacity: 0, rotateX: 50 }} transition={{ duration: .35 }}>
        <span className="lp-eyebrow">Attempt {variant + 1}</span>
        <p className="lp-maths-context">{exercise.context}</p>
        {exercise.exhibit && <table className="lp-exhibit"><thead><tr>{exercise.exhibit[0].map(cell => <th scope="col" key={cell}>{cell}</th>)}</tr></thead><tbody>{exercise.exhibit.slice(1).map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, column) => column === 0 ? <th scope="row" key={column}>{cell}</th> : <td key={column}>{cell}</td>)}</tr>)}</tbody></table>}
      </motion.div>
    </AnimatePresence>
    <button type="button" className="lp-ghost" onClick={() => setVariant(current => current + 1)}><ArrowsClockwise size={15} aria-hidden="true" /> New numbers</button>
  </div>
}

function FlipCard() {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const { deck, card } = flipCards[index]
  const next = () => { setFlipped(false); setIndex(current => (current + 1) % flipCards.length) }
  return <div className="lp-flip-wrap">
    <button type="button" className={`lp-flip${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(current => !current)} aria-label={flipped ? `${card.term}: ${card.definition}` : `${card.term}. Show the definition`}>
      <span className="lp-flip-face front"><small>{deck.name}</small><strong>{card.term}</strong><em>Tap to flip</em></span>
      <span className="lp-flip-face back"><small>Definition</small><span>{card.definition}</span><em>Trap: {card.trap}</em></span>
    </button>
    <button type="button" className="lp-ghost" onClick={next}>Next card <ArrowRight size={14} aria-hidden="true" /></button>
  </div>
}

function Bento({ icon: Icon, title, text, className = '', children }) {
  return <motion.article className={`lp-bento ${className}`} variants={rise}>
    <header><span className="lp-bento-icon" aria-hidden="true"><Icon size={18} weight="duotone" /></span><h3>{title}</h3></header>
    {text && <p>{text}</p>}
    {children}
  </motion.article>
}

export default function Landing({ onOpenDashboard }) {
  const open = onOpenDashboard
  const heroRef = useRef(null)
  const [heroGone, setHeroGone] = useState(false)
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setHeroGone(!entry.isIntersecting), { threshold: 0 })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return <MotionConfig reducedMotion="user">
    <main className="landing" id="landing-content" tabIndex={-1}>
      <h1 className="sr-only">Case Vault</h1>

      <section className="lp-hero" ref={heroRef}>
        <div className="lp-hero-grid" aria-hidden="true" />
        <div className="lp-hero-inner">
          <motion.div className="lp-hero-copy" initial="hidden" animate="show" variants={stagger}>
            <motion.span className="lp-pill" variants={rise}><span className="lp-pulse" aria-hidden="true" />{CASES.length} cases · {FRAMEWORK_DRILLS.length} drills · {CARDS.length} cards · free</motion.span>
            <motion.h2 variants={rise}>Crack the case.<br /><span className="lp-hero-sub">Start with <RotatingWord words={CATEGORIES} /></span></motion.h2>
            <span className="sr-only">Practice profitability, market entry, pricing, growth and more.</span>
            <motion.p variants={rise}>Case interview practice that feels like the real thing. Tap through structured cases, run the maths with fresh numbers every time and recall it all on a spaced schedule.</motion.p>
            <motion.div variants={rise}><button type="button" className="lp-button" onClick={onOpenDashboard}>Open your dashboard <ArrowRight size={16} weight="bold" aria-hidden="true" /></button><p className="landing-note">No account needed. Progress saves in your browser.</p></motion.div>
          </motion.div>
          <DashboardPreview onOpen={open} />
        </div>
      </section>

      <Marquee />

      <section className="lp-section lp-stats" aria-label="What is inside">
        {[[CASES.length, 'full cases', `${CATEGORIES.length} categories, ${sectors} sectors`], [CASE_MATH_LESSONS.length, 'maths lessons', 'new numbers every attempt'], [FRAMEWORK_DRILLS.length, 'framework drills', `across ${FRAMEWORKS.length} methods`], [CARDS.length, 'flashcards', `in ${DECKS.length} decks`]].map(([count, label, sub], index) =>
          <Reveal className="lp-stat" key={label} delay={index * .08}><strong><CountUp to={count} /></strong><span>{label}</span><small>{sub}</small></Reveal>)}
      </section>

      <section className="lp-section lp-try-section" aria-labelledby="lp-try-heading">
        <Reveal className="lp-section-head">
          <span className="lp-eyebrow">Try it now</span>
          <h2 id="lp-try-heading">One question. Thirty seconds.</h2>
          <p>Every case runs Clarify, Structure, Calculate, Challenge, Recommend. Here is the first step of a real one.</p>
        </Reveal>
        <Reveal><TryStep onOpen={open} /></Reveal>
      </section>

      <section className="lp-section" aria-labelledby="lp-bento-heading">
        <Reveal className="lp-section-head">
          <span className="lp-eyebrow">Everything in one dashboard</span>
          <h2 id="lp-bento-heading">Built to make the reps stick.</h2>
        </Reveal>
        <motion.div className="lp-bento-grid" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <Bento icon={MathOperations} title="Same lesson, new numbers" text={`${CASE_MATH_LESSONS.length} lessons. You cannot memorise your way through.`} className="lp-bento-wide"><MathsShuffle /></Bento>
          <Bento icon={Cards} title={`${CARDS.length} flashcards`} text="Checked answers, never self-rated."><FlipCard /></Bento>
          <Bento icon={TreeStructure} title={`${FRAMEWORKS.length} methods, drilled`}>
            <div className="lp-chips">{FRAMEWORKS.slice(0, 9).map(framework => <span key={framework.id}>{framework.title}</span>)}<span className="more">+{Math.max(0, FRAMEWORKS.length - 9)} more</span></div>
          </Bento>
          <Bento icon={Trophy} title="Mental maths, timed" text="Pick your operations and ranges, race the clock, beat your personal best." />
          <Bento icon={Buildings} title={`${INDUSTRIES.length} sector notes`} text="Value chains, money drivers, five forces and recent developments for every major sector. Dated context, labelled as such." className="lp-bento-wide lp-sectors-card">
            <ul className="lp-sectors">{INDUSTRIES.slice(0, 6).map(industry => <li key={industry.id}><strong>{industry.name}</strong><span>{industry.summary}</span></li>)}</ul>
            <p className="lp-sectors-more">Also {INDUSTRIES.slice(6).map(industry => industry.name.toLowerCase()).join(', ')}.</p>
          </Bento>
        </motion.div>
      </section>

      <section className="lp-section lp-mastery" aria-labelledby="lp-mastery-heading">
        <Reveal className="lp-section-head">
          <span className="lp-eyebrow">Spaced recall</span>
          <h2 id="lp-mastery-heading">Mastered in two weeks, not crammed in one night.</h2>
          <p>A clean run on each due date moves a case up. A slip sends it back to tomorrow.</p>
        </Reveal>
        <ol className="lp-days">
          {['Day 1', 'Day 3', 'Day 7', 'Day 14'].map((day, index) => <Reveal as="li" key={day} delay={index * .15}>
            <span className="lp-day-dot" aria-hidden="true">{index === 3 ? <Brain size={18} weight="fill" /> : index + 1}</span>
            <strong>{day}</strong>
            <span>{['First finish', 'First recall', 'Second recall', 'Mastered'][index]}</span>
          </Reveal>)}
        </ol>
      </section>

      <section className="lp-final" aria-labelledby="lp-final-heading">
        <div className="lp-hero-grid" aria-hidden="true" />
        <Reveal className="lp-final-inner">
          <h2 id="lp-final-heading">Your first case is waiting on your dashboard.</h2>
          <p>Free, no sign-up. {levels[0]} to {levels.at(-1)}.</p>
          <button type="button" className="lp-button" onClick={onOpenDashboard}>Open your dashboard <ArrowRight size={16} weight="bold" aria-hidden="true" /></button>
        </Reveal>
      </section>

      <footer className="landing-footer">
        Built by Hoh JD in Kuala Lumpur · <a href="https://github.com/HohJD" target="_blank" rel="noreferrer">GitHub</a> · <a href="https://www.linkedin.com/in/hohjd/" target="_blank" rel="noreferrer">LinkedIn</a> · <a href="https://x.com/hohjiada" target="_blank" rel="noreferrer">X</a>
      </footer>
      <AnimatePresence>
        {heroGone && <motion.div className="landing-sticky" initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}><button type="button" className="lp-button" onClick={open}>Open your dashboard <ArrowRight size={16} weight="bold" aria-hidden="true" /></button></motion.div>}
      </AnimatePresence>
    </main>
  </MotionConfig>
}
