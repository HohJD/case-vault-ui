import { lazy, Suspense, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/ibm-plex-sans'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import ErrorBoundary from './ErrorBoundary.jsx'
import './styles.css'
import './math.css'
import './landing.css'
import './app-skin.css'

const Cases = lazy(() => import('./Cases.jsx'))
const Landing = lazy(() => import('./Landing.jsx'))

// Old URLs keep working: the client rewrites them to the matching Cases section.
const LEGACY_PATHS = {
  '/brain': '/cases#mental-maths',
  '/cards': '/cases#cards',
  '/mental': () => window.location.hash === '#cards' ? '/cases#cards' : '/cases#mental-maths',
  '/about': '/',
}

const currentPage = () => window.location.pathname.replace(/\/$/, '') === '' ? 'landing' : 'cases'

function App() {
  const [page, setPage] = useState(currentPage)
  const [casesOpened, setCasesOpened] = useState(() => currentPage() === 'cases')
  useEffect(() => { if (page === 'cases') setCasesOpened(true) }, [page])
  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, '')
    const legacy = LEGACY_PATHS[path]
    if (legacy) window.history.replaceState(null, '', typeof legacy === 'function' ? legacy() : legacy)
    const navigate = () => setPage(currentPage())
    window.addEventListener('hashchange', navigate)
    window.addEventListener('popstate', navigate)
    return () => {
      window.removeEventListener('hashchange', navigate)
      window.removeEventListener('popstate', navigate)
    }
  }, [])
  useEffect(() => {
    document.title = page === 'cases' ? 'Main · Case Vault' : 'Case Vault'
  }, [page])
  const navigate = (event, path) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (window.location.pathname !== path || window.location.hash || window.history.state) {
      window.history.pushState(null, '', path)
      // Let pages that keep sub-screens in history (Cases) return to their start.
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
    }
    setPage(currentPage())
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  return <>
    <a className="skip-content" href={page === 'landing' ? '#landing-content' : '#cases-content'}>Skip to content</a>
    <header className="site-header"><div className="site-header-inner">
      <a className="site-brand" href="/" onClick={event => navigate(event, '/')} aria-label="Case Vault home">Case Vault</a>
      {page === 'landing' && <div className="site-header-actions">
        <button type="button" className="lp-button lp-button-small" onClick={event => navigate(event, '/cases#overview')}>Open dashboard</button>
      </div>}
    </div></header>
    {page === 'landing' && <ErrorBoundary><Suspense fallback={<main className="page-container cases-loading" role="status">Loading…</main>}><Landing onOpenDashboard={event => navigate(event, '/cases#overview')} /></Suspense></ErrorBoundary>}
    {(casesOpened || page === 'cases') && <div id="cases-page" hidden={page !== 'cases'}><ErrorBoundary><Suspense fallback={<main className="page-container cases-loading" role="status">Loading cases…</main>}><Cases active={page === 'cases'} /></Suspense></ErrorBoundary></div>}
  </>
}

createRoot(document.getElementById('root')).render(<App />)
