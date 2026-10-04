// Shared app-shell layout: a sticky sidebar nav, a content column, and an
// optional filter rail on laptops. On phones the nav collapses to the
// scroll-snapped section row (`tabs`) and the rail folds into one disclosure.
export default function AppShell({ tabs, nav, aside, children }) {
  return <div className={`app-shell${aside ? '' : ' app-shell-no-aside'}`}>
    {tabs && <div className="app-shell-tabs">{tabs}</div>}
    <nav className="app-nav" aria-label="Sections and categories">{nav}</nav>
    <div className="app-main">{children}</div>
    {aside && <details className="app-filters"><summary>Filters</summary><div className="app-filters-body">{aside}</div></details>}
    {aside && <aside className="app-aside">{aside}</aside>}
  </div>
}
