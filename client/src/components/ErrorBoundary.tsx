import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { TEXTS } from '../constants/texts';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of the component tree that crashed.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for debugging
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Show toast notification to user
    toast.error(TEXTS.TOAST.ERROR_PREFIX + TEXTS.ERRORS.UNEXPECTED_ERROR);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
          background: 'linear-gradient(to bottom, #0b0c10, #1f2833)',
          color: '#ffffff'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ffffff' }}>
            {TEXTS.ERROR_BOUNDARY.TITLE}
          </h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#cccccc' }}>
            {TEXTS.ERROR_BOUNDARY.MESSAGE}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#4a90e2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#357abd'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a90e2'}
          >
            {TEXTS.ERROR_BOUNDARY.REFRESH_BUTTON}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 