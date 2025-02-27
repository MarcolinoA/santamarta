// components/ErrorBoundary.tsx
import React, { Component } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Caught an error:", error);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Qualcosa è andato storto. Riprova più tardi.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;