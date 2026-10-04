import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react/ArrowLeft'
import { ArrowRight } from '@phosphor-icons/react/ArrowRight'
import { CaretRight } from '@phosphor-icons/react/CaretRight'
import { CheckCircle } from '@phosphor-icons/react/CheckCircle'
import { MagnifyingGlass } from '@phosphor-icons/react/MagnifyingGlass'
import { CASES } from './casebook.js'
import { INDUSTRIES, INDUSTRY_AS_OF } from './industries.js'
import { industriesRead, loadIndustryProgress, markIndustryRead } from './industry-progress.js'
import './industries.css'

const levelClass = level => `force-${level.split(' ')[0].toLowerCase()}`
const TAGS = ['All', ...[...new Set(INDUSTRIES.map(item => item.tag))].sort()]
const SECTIONS = [
  ['glance', 'At a glance'], ['chain', 'Value chain'], ['money', 'Money'], ['forces', 'Forces'],
  ['outlook', 'Outlook'], ['models', 'Models'], ['news', 'News'], ['terms', 'Terms'],
]
const searchText = item => [item.name, item.tag, item.summary, ...item.segments].join(' ').toLowerCase()

function Pairs({ items, className = '' }) {
  return <dl className={`industry-pairs ${className}`}>{items.map(item => <div key={item.term}><dt>{item.term}</dt><dd>{item.note}</dd></div>)}</dl>
}

function Note({ industry, onBack, onOpenCase, headingRef }) {
  const related = industry.caseIds.map(id => CASES.find(entry => entry.id === id)).filter(Boolean)
  const jump = id => event => {
    event.preventDefault()
    const target = document.getElementById(`industry-${id}`)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' })
  }
  return <section className="industries industry-detail screen-enter" aria-label={`${industry.name} sector note`}>
    <button className="quiet-button" onClick={onBack}><ArrowLeft size={16} /> All industries</button>
    <header className="industry-heading">
      <span className="case-eyebrow">{industry.tag} · as of {industry.editions.join(', ')}</span>
      <h2 ref={headingRef} tabIndex={-1}>{industry.name}</h2>
      <p>{industry.summary}</p>
    </header>
    <nav className="industry-jump" aria-label="Sections of this note">{SECTIONS.map(([id, label]) => <a key={id} href={`#industry-${id}`} onClick={jump(id)}>{label}</a>)}</nav>

    <section id="industry-glance" className="industry-block" aria-labelledby="industry-glance-h">
      <h3 className="industry-section" id="industry-glance-h">At a glance</h3>
      <ul className="industry-overview">{industry.overview.map(point => <li key={point}>{point}</li>)}</ul>
      <h4 className="industry-sub">Segments</h4>
      <ul className="industry-segments">{industry.segments.map(point => <li key={point}>{point}</li>)}</ul>
    </section>

    <section id="industry-chain" className="industry-block" aria-labelledby="industry-chain-h">
      <h3 className="industry-section" id="industry-chain-h">Value chain</h3>
      <ol className="industry-chain">{industry.valueChain.map((stage, index) => <li key={stage.stage}>
        <span className="industry-chain-step" aria-hidden="true">{index + 1}</span>
        <strong>{stage.stage}</strong>
        <ul>{stage.items.map(item => <li key={item}>{item}</li>)}</ul>
      </li>)}</ol>
    </section>

    <section id="industry-money" className="industry-block" aria-labelledby="industry-money-h">
      <h3 className="industry-section" id="industry-money-h">How the money works</h3>
      <div className="industry-columns">{industry.drivers.map(group => <div className="industry-column" key={group.title}><h4>{group.title}</h4><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}</div>
      <h4 className="industry-sub">Metrics to quote</h4>
      <Pairs items={industry.kpis} />
    </section>

    <section id="industry-forces" className="industry-block" aria-labelledby="industry-forces-h">
      <h3 className="industry-section" id="industry-forces-h">Five forces</h3>
      <ul className="industry-forces">{industry.forces.map(force => <li key={force.name}>
        <div><strong>{force.name}</strong><span className={`force-level ${levelClass(force.level)}`}>{force.level}</span></div>
        <p>{force.note}</p>
      </li>)}</ul>
      <h4 className="industry-sub">PESTEL highlights</h4>
      <Pairs items={industry.pestel} className="industry-pairs-tags" />
    </section>

    <section id="industry-outlook" className="industry-block" aria-labelledby="industry-outlook-h">
      <h3 className="industry-section" id="industry-outlook-h">Outlook</h3>
      <div className="industry-outlook">
        <div className="industry-column industry-up"><h4>Growth drivers</h4><ul>{industry.growth.map(point => <li key={point}>{point}</li>)}</ul></div>
        <div className="industry-column industry-down"><h4>Challenges</h4><ul>{industry.challenges.map(point => <li key={point}>{point}</li>)}</ul></div>
      </div>
      <h4 className="industry-sub">Worth knowing</h4>
      <ul className="industry-list">{industry.facts.map(point => <li key={point}>{point}</li>)}</ul>
    </section>

    <section id="industry-models" className="industry-block" aria-labelledby="industry-models-h">
      <h3 className="industry-section" id="industry-models-h">Business models</h3>
      <Pairs items={industry.models} className="industry-pairs-cards" />
    </section>

    <section id="industry-news" className="industry-block" aria-labelledby="industry-news-h">
      <h3 className="industry-section" id="industry-news-h">Recent developments</h3>
      <ul className="industry-list industry-news">{industry.news.map(point => <li key={point}>{point}</li>)}</ul>
    </section>

    <section id="industry-terms" className="industry-block" aria-labelledby="industry-terms-h">
      <h3 className="industry-section" id="industry-terms-h">Terms</h3>
      <Pairs items={industry.terms} />
    </section>

    {related.length > 0 && <div className="industry-related"><h3>Practise it</h3>{related.map(item => <button className="quiet-button" key={item.id} onClick={() => onOpenCase(item.id)}>{item.title} <ArrowRight size={15} /></button>)}</div>}
    <p className="case-local-note">Figures are as of the {INDUSTRY_AS_OF} edition of the sector report this note is based on. Treat them as practice context and state your assumptions; they are not live market data.</p>
  </section>
}

export default function Industries({ active = true, onOpenCase }) {
  const [openId, setOpenId] = useState(null)
  const [tag, setTag] = useState('All')
  const [query, setQuery] = useState('')
  const [progress, setProgress] = useState(loadIndustryProgress)
  const headingRef = useRef(null)
  const industry = INDUSTRIES.find(item => item.id === openId)
  const shown = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return INDUSTRIES.filter(item => (tag === 'All' || item.tag === tag) && words.every(word => searchText(item).includes(word)))
  }, [tag, query])
  const read = industriesRead(progress, INDUSTRIES.map(item => item.id))

  // Reload reads whenever the tab comes back into view.
  useEffect(() => { if (active) setProgress(loadIndustryProgress()) }, [active])
  useEffect(() => {
    if (!active) return
    headingRef.current?.focus({ preventScroll: true })
    if (openId) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [active, openId])
  useEffect(() => {
    if (active && openId) setProgress(current => markIndustryRead(current, openId))
  }, [active, openId])

  if (industry) return <Note industry={industry} onBack={() => setOpenId(null)} onOpenCase={onOpenCase} headingRef={headingRef} />

  return <section className="industries" aria-label="Industry notes">
    <h2 className="sr-only" ref={headingRef} tabIndex={-1}>Sector notes</h2>
    <div className="industry-toolbar">
      <label className="industry-search"><MagnifyingGlass size={17} aria-hidden="true" /><span className="sr-only">Search industries</span>
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search ${INDUSTRIES.length} industries`} />
      </label>
      <p className="industry-read-count" aria-live="polite"><strong>{read}</strong> of {INDUSTRIES.length} read<span className="industry-read-bar" aria-hidden="true"><span style={{ width: `${read / INDUSTRIES.length * 100}%` }} /></span></p>
    </div>
    <div className="case-filters industry-tags-row" role="group" aria-label="Filter by sector group">{TAGS.map(value => <button key={value} aria-pressed={tag === value} onClick={() => setTag(value)}>{value}</button>)}</div>
    {shown.length === 0 && <p className="industry-empty">No industry matches “{query}”. <button type="button" className="account-link" onClick={() => { setQuery(''); setTag('All') }}>Clear search</button></p>}
    <ol className="industry-grid">{shown.map(item => {
      const seen = Boolean(progress.records[item.id])
      return <li key={item.id}>
        <button onClick={() => setOpenId(item.id)} className={seen ? 'read' : ''}>
          <span className="industry-card-top"><span className="industry-card-tag">{item.tag}</span>{seen && <span className="industry-card-read"><CheckCircle size={15} weight="fill" aria-hidden="true" /> Read</span>}</span>
          <span className="industry-card-title">{item.name}</span>
          <span className="industry-card-summary">{item.summary}</span>
          <span className="industry-card-meta">{item.caseIds.length > 0 ? `${item.caseIds.length} linked case${item.caseIds.length > 1 ? 's' : ''}` : 'Sector note'}<CaretRight size={15} aria-hidden="true" /></span>
        </button>
      </li>
    })}</ol>
    <p className="case-local-note">Notes reflect the {INDUSTRY_AS_OF} sector reports. They are dated context, not live market data.</p>
  </section>
}
