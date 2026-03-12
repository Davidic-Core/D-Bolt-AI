import React, { ReactNode, ErrorInfo } from 'react'
import './ErrorBoundary.css'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h1>Something Went Wrong</h1>
            <p className="error-message">
              We encountered an unexpected error. Please try reloading the application.
            </p>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <pre className="error-details">{this.state.error.toString()}</pre>
            )}
            <button className="reload-btn" onClick={this.handleReload}>
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
