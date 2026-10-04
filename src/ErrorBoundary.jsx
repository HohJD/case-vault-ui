import { Component } from 'react'

// Last-resort catch so a render error never leaves a blank page.
export default class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error) { console.error(error) }
  render() {
    if (this.state.error) {
      return <main className="page-container error-boundary">
        <h1 className="sr-only">Something went wrong</h1>
        <div className="surface error-boundary-card">
          <p><strong>Something went wrong.</strong></p>
          <p>Reload to pick up where you left off. Your progress is saved.</p>
          <button type="button" className="case-start-button" onClick={() => window.location.reload()}>Reload</button>
        </div>
      </main>
    }
    return this.props.children
  }
}
