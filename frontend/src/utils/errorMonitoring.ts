/**
 * Error Monitoring Utility for JAC Learning Platform
 * Provides centralized error tracking and reporting
 */

interface ErrorInfo {
  componentStack: string;
  errorBoundary: string;
}

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  lineNumber: number;
  columnNumber: number;
  timestamp: string;
  userAgent: string;
  userId?: string;
  sessionId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

class ErrorMonitor {
  private isEnabled: boolean;
  private errors: ErrorReport[] = [];
  private maxErrors = 100;
  private reportingEndpoint?: string;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production' || 
                     process.env.REACT_APP_ENABLE_ERROR_MONITORING === 'true';
    this.reportingEndpoint = process.env.REACT_APP_ERROR_REPORTING_ENDPOINT;
    
    if (this.isEnabled) {
      console.log('🔍 Error monitoring initialized');
    }
  }

  /**
   * Initialize error monitoring with external service (Sentry, etc.)
   */
  public initExternalService(): void {
    if (!this.isEnabled) return;

    // Example: Initialize Sentry if DSN is provided
    const sentryDsn = process.env.REACT_APP_SENTRY_DSN;
    if (sentryDsn) {
      this.initSentry(sentryDsn);
    }

    // Example: Initialize LogRocket or other services
    const logRocketId = process.env.REACT_APP_LOGROCKET_ID;
    if (logRocketId) {
      this.initLogRocket(logRocketId);
    }
  }

  /**
   * Initialize Sentry for error monitoring
   */
  private initSentry(dsn: string): void {
    // This would require @sentry/react dependency
    // import * as Sentry from '@sentry/react';
    // 
    // Sentry.init({
    //   dsn,
    //   environment: process.env.NODE_ENV,
    //   beforeSend(event) {
    //     // Filter out certain errors in development
    //     if (process.env.NODE_ENV === 'development' && 
    //         event.exception?.values?.[0]?.type === 'ChunkLoadError') {
    //       return null;
    //     }
    //     return event;
    //   },
    // });
    
    console.log('📊 Sentry initialization configured (requires @sentry/react dependency)');
  }

  /**
   * Initialize LogRocket for session replay
   */
  private initLogRocket(appId: string): void {
    // This would require logrocket dependency
    // import { init as initLogRocket } from 'logrocket';
    // 
    // initLogRocket(appId, {
    //   dom: {
    //     inputPaddingSeconds: 5,
    //     isSensitive: (input) => {
    //       return input.type === 'password' || input.type === 'email';
    //     }
    //   }
    // });
    
    console.log('🎥 LogRocket initialization configured (requires logrocket dependency)');
  }

  /**
   * Capture and report an error
   */
  public captureException(error: Error, context?: Record<string, any>): void {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      lineNumber: this.extractLineNumber(error.stack),
      columnNumber: 0, // Would need stack parsing
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      severity: this.determineSeverity(error),
      context: {
        ...context,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        memory: (performance as any).memory ? {
          used: Math.round((performance as any).memory.usedJSHeapSize / 1048576),
          total: Math.round((performance as any).memory.totalJSHeapSize / 1048576)
        } : null
      }
    };

    // Store locally
    this.errors.push(errorReport);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Captured');
      console.error('Error:', error);
      console.log('Context:', context);
      console.log('Report:', errorReport);
      console.groupEnd();
    }

    // Send to external service if configured
    if (this.reportingEndpoint) {
      this.sendToEndpoint(errorReport);
    }

    // Also send to browser console for immediate visibility
    console.error('JAC Platform Error:', {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  /**
   * Capture React component errors
   */
  public captureComponentError(error: Error, errorInfo: ErrorInfo): void {
    this.captureException(error, {
      type: 'react_component_error',
      componentStack: errorInfo.componentStack,
      errorBoundary: errorInfo.errorBoundary
    });
  }

  /**
   * Capture API errors
   */
  public captureApiError(response: Response, context?: Record<string, any>): void {
    const errorReport: ErrorReport = {
      message: `API Error: ${response.status} ${response.statusText}`,
      stack: `Status: ${response.status}\nURL: ${response.url}`,
      url: response.url,
      lineNumber: 0,
      columnNumber: 0,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      severity: response.status >= 500 ? 'high' : 'medium',
      context: {
        type: 'api_error',
        status: response.status,
        statusText: response.statusText,
        ...context
      }
    };

    this.errors.push(errorReport);
    console.error('API Error:', errorReport);
  }

  /**
   * Send error report to external endpoint
   */
  private async sendToEndpoint(errorReport: ErrorReport): Promise<void> {
    try {
      await fetch(this.reportingEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });
    } catch (fetchError) {
      console.warn('Failed to send error report:', fetchError);
    }
  }

  /**
   * Extract line number from error stack
   */
  private extractLineNumber(stack?: string): number {
    if (!stack) return 0;
    const match = stack.match(/:(\d+):(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Determine error severity
   */
  private determineSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    const message = error.message.toLowerCase();
    
    if (message.includes('chunk load error') || message.includes('network error')) {
      return 'low';
    }
    
    if (message.includes('render error') || message.includes('component error')) {
      return 'medium';
    }
    
    if (message.includes('authentication') || message.includes('authorization')) {
      return 'high';
    }
    
    if (message.includes('syntax error') || message.includes('type error')) {
      return 'critical';
    }
    
    return 'medium';
  }

  /**
   * Get current user ID from storage or context
   */
  private getCurrentUserId(): string | undefined {
    try {
      const user = localStorage.getItem('jac_user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser.id || parsedUser.userId;
      }
    } catch {
      // Ignore parsing errors
    }
    return undefined;
  }

  /**
   * Get or generate session ID
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('jac_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('jac_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get all captured errors (for debugging)
   */
  public getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  /**
   * Clear error history
   */
  public clearErrors(): void {
    this.errors = [];
  }
}

// Create global instance
export const errorMonitor = new ErrorMonitor();

// Initialize external services
errorMonitor.initExternalService();

// Make available globally for React components
(window as any).errorMonitor = errorMonitor;

// Export initialization function
export const initErrorMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Error monitoring ready');
  }
  return errorMonitor;
};