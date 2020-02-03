import * as Sentry from '@sentry/browser';
import React, { Component, ErrorInfo } from 'react';

class ExampleBoundary extends Component {
  public static getDerivedStateFromError() {
    return { hasError: true };
  }
  public state = { eventId: undefined, hasError: false };

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  public render() {
    if (this.state.hasError) {
      // render fallback UI
      return (
        <button onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>
          Report feedback
        </button>
      );
    }

    // when there's not an error, render children untouched
    return this.props.children;
  }
}

export default ExampleBoundary;
