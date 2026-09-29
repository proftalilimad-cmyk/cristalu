import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode; fallback?: ReactNode; label?: string }
type State = { hasError: boolean }

/**
 * Keeps an optional experience (WebGL scene, a route) from taking the whole
 * site down. Falls back to static content instead.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error(`[${this.props.label ?? 'ErrorBoundary'}]`, error, info.componentStack)
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}
