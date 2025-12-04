/**
 * Development Tools Utility for JAC Learning Platform
 * Provides development-time utilities and debugging helpers
 */

interface DevToolConfig {
  enableConsoleLogging: boolean;
  enableDebugMode: boolean;
  enableHotReload: boolean;
  enableReduxDevTools: boolean;
  enableReactQueryDevtools: boolean;
}

class DevelopmentTools {
  private config: DevToolConfig;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.config = this.loadConfig();
    
    if (this.isDevelopment) {
      console.log('🛠️ Development tools initialized');
      this.setupGlobalHelpers();
      this.performanceHelpers;
      this.debugHelpers;
      this.setupConsoleEnhancements();
    }
  }

  /**
   * Load development configuration
   */
  private loadConfig(): DevToolConfig {
    return {
      enableConsoleLogging: process.env.REACT_APP_DEV_CONSOLE_LOGGING !== 'false',
      enableDebugMode: process.env.REACT_APP_DEBUG_MODE === 'true',
      enableHotReload: process.env.REACT_APP_ENABLE_HOT_RELOAD !== 'false',
      enableReduxDevTools: process.env.REACT_APP_ENABLE_REDUX_DEVTOOLS !== 'false',
      enableReactQueryDevtools: process.env.REACT_APP_ENABLE_QUERY_DEVTOOLS !== 'false'
    };
  }

  /**
   * Setup global development helpers
   */
  private setupGlobalHelpers(): void {
    // Make utilities globally available
    (window as any).JACDev = {
      utils: this,
      performance: this.performanceHelpers,
      debug: this.debugHelpers,
      console: this.consoleHelpers
    };

    // Add development keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Setup error overlay for development
    this.setupErrorOverlay();
  }

  /**
   * Setup keyboard shortcuts for development
   */
  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + Shift + D: Toggle debug mode
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        this.toggleDebugMode();
      }

      // Ctrl/Cmd + Shift + P: Performance panel
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        this.togglePerformancePanel();
      }

      // Ctrl/Cmd + Shift + C: Clear console
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        console.clear();
        this.log('🧹 Console cleared', 'info');
      }

      // Ctrl/Cmd + Shift + R: Reset local storage
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        this.clearLocalStorage();
      }
    });
  }

  /**
   * Setup error overlay for development
   */
  private setupErrorOverlay(): void {
    // Listen for unhandled errors and display overlay
    window.addEventListener('error', (event) => {
      if (this.config.enableDebugMode) {
        this.showErrorOverlay(event.error);
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      if (this.config.enableDebugMode) {
        this.showErrorOverlay(event.reason);
      }
    });
  }

  /**
   * Performance helpers
   */
  private performanceHelpers = {
    /**
     * Measure function execution time
     */
    measure: (name: string, fn: Function) => {
      if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark(`${name}-start`);
        const result = fn();
        
        if (result && typeof result.then === 'function') {
          return result.finally(() => {
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);
          });
        } else {
          performance.mark(`${name}-end`);
          performance.measure(name, `${name}-start`, `${name}-end`);
          return result;
        }
      }
      return fn();
    },

    /**
     * Measure async function execution time
     */
    measureAsync: async (name: string, fn: () => Promise<any>) => {
      if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark(`${name}-start`);
        const result = await fn();
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        return result;
      }
      return await fn();
    },

    /**
     * Get performance marks
     */
    getMarks: () => {
      if (typeof performance !== 'undefined' && performance.getEntriesByType) {
        return performance.getEntriesByType('mark');
      }
      return [];
    },

    /**
     * Get performance measures
     */
    getMeasures: () => {
      if (typeof performance !== 'undefined' && performance.getEntriesByType) {
        return performance.getEntriesByType('measure');
      }
      return [];
    },

    /**
     * Clear performance entries
     */
    clearMarks: () => {
      if (typeof performance !== 'undefined' && performance.clearMarks) {
        performance.clearMarks();
        performance.clearMeasures();
      }
    },

    /**
     * Monitor component render time
     */
    monitorRender: (componentName: string) => {
      const start = performance.now();
      return () => {
        const end = performance.now();
        const duration = end - start;
        console.log(`⚡ ${componentName} render time: ${duration.toFixed(2)}ms`);
      };
    }
  };

  /**
   * Debug helpers
   */
  private debugHelpers = {
    /**
     * Log with timestamp and context
     */
    log: (message: string, type: 'info' | 'warn' | 'error' | 'success' = 'info', data?: any) => {
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
      const prefix = `[${timestamp}] [${type.toUpperCase()}]`;
      
      switch (type) {
        case 'error':
          console.error(prefix, message, data);
          break;
        case 'warn':
          console.warn(prefix, message, data);
          break;
        case 'success':
          console.log(`✅ ${prefix}`, message, data);
          break;
        default:
          console.log(`ℹ️ ${prefix}`, message, data);
      }
    },

    /**
     * Inspect component props and state
     */
    inspectComponent: (componentName: string) => {
      // This would need to be integrated with React DevTools
      console.log(`🔍 Component inspection for ${componentName} would be available via React DevTools`);
    },

    /**
     * Monitor state changes
     */
    monitorState: (stateName: string, state: any) => {
      console.log(`📊 State "${stateName}" changed:`, state);
    },

    /**
     * Network request monitoring
     */
    monitorNetwork: () => {
      // Override fetch to monitor requests
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const start = performance.now();
        console.log(`🌐 Network request: ${args[0]}`);
        
        try {
          const response = await originalFetch(...args);
          const end = performance.now();
          console.log(`✅ Network response: ${args[0]} (${(end - start).toFixed(2)}ms)`);
          return response;
        } catch (error) {
          const end = performance.now();
          console.error(`❌ Network error: ${args[0]} (${(end - start).toFixed(2)}ms)`, error);
          throw error;
        }
      };
    },

    /**
     * Log React fiber tree (for advanced debugging)
     */
    logFiberTree: () => {
      // This would require react-dom's internals
      console.log('🌳 React fiber tree debugging requires React DevTools extension');
    }
  };

  /**
   * Console enhancements
   */
  private consoleHelpers = {
    /**
     * Enhanced console.log with styling
     */
    styled: (message: string, style: string = 'color: #00ff00') => {
      console.log(`%c${message}`, style);
    },

    /**
     * Table display for arrays/objects
     */
    table: (data: any, columns?: string[]) => {
      if (Array.isArray(data) || typeof data === 'object') {
        console.table(data, columns);
      }
    },

    /**
     * Grouped console output
     */
    group: (title: string, fn: () => void) => {
      console.group(`🔍 ${title}`);
      try {
        fn();
      } finally {
        console.groupEnd();
      }
    },

    /**
     * Time measurement
     */
    time: (label: string) => {
      console.time(label);
      return () => console.timeEnd(label);
    },

    /**
     * Assert with better error messages
     */
    assert: (condition: boolean, message: string, data?: any) => {
      if (!condition) {
        console.error(`❌ Assertion failed: ${message}`, data);
      } else {
        console.log(`✅ Assertion passed: ${message}`);
      }
    }
  };

  /**
   * Toggle debug mode
   */
  private toggleDebugMode(): void {
    this.config.enableDebugMode = !this.config.enableDebugMode;
    
    if (this.config.enableDebugMode) {
      document.body.classList.add('debug-mode');
      this.log('Debug mode enabled', 'success');
    } else {
      document.body.classList.remove('debug-mode');
      this.log('Debug mode disabled', 'info');
    }

    // Dispatch custom event for components to respond
    window.dispatchEvent(new CustomEvent('debugModeChanged', {
      detail: { enabled: this.config.enableDebugMode }
    }));
  }

  /**
   * Toggle performance panel
   */
  private togglePerformancePanel(): void {
    this.log('Performance panel toggle requested', 'info');
    // This would show/hide a performance monitoring panel
    // Implementation would depend on chosen performance monitoring library
  }

  /**
   * Clear local storage and session storage
   */
  private clearLocalStorage(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.log('Local storage and session storage cleared', 'success');
  }

  /**
   * Show error overlay
   */
  private showErrorOverlay(error: Error): void {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 0, 0, 0.1);
      z-index: 10000;
      pointer-events: none;
    `;

    const message = document.createElement('div');
    message.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff4444;
      color: white;
      padding: 20px;
      border-radius: 8px;
      font-family: monospace;
      max-width: 80%;
      pointer-events: auto;
    `;
    message.innerHTML = `
      <h3>Development Error</h3>
      <p><strong>Message:</strong> ${error.message}</p>
      <p><strong>Stack:</strong></p>
      <pre style="white-space: pre-wrap; font-size: 12px;">${error.stack || 'No stack trace'}</pre>
      <button onclick="this.parentElement.parentElement.remove()" style="
        margin-top: 10px;
        padding: 5px 10px;
        background: white;
        color: #ff4444;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      ">Dismiss</button>
    `;

    overlay.appendChild(message);
    document.body.appendChild(overlay);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (overlay.parentElement) {
        overlay.remove();
      }
    }, 10000);
  }

  /**
   * Setup console enhancements
   */
  private setupConsoleEnhancements(): void {
    if (!this.config.enableConsoleLogging) return;

    // Add console styles
    const style = document.createElement('style');
    style.textContent = `
      .debug-mode * {
        outline: 1px solid rgba(255, 0, 0, 0.2) !important;
      }
      .debug-mode [data-testid] {
        outline: 2px solid #00ff00 !important;
      }
    `;
    document.head.appendChild(style);

    // Enhance console methods
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog('ℹ️', ...args);
    };

    console.warn = (...args) => {
      originalWarn('⚠️', ...args);
    };

    console.error = (...args) => {
      originalError('❌', ...args);
    };

    this.log('Console enhancements loaded', 'success');
  }

  /**
   * Log with timestamp
   */
  private log(message: string, type: 'info' | 'warn' | 'error' | 'success' = 'info'): void {
    if (!this.config.enableConsoleLogging) return;

    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = `[${timestamp}] [DEV] [${type.toUpperCase()}]`;
    
    switch (type) {
      case 'error':
        console.error(prefix, message);
        break;
      case 'warn':
        console.warn(prefix, message);
        break;
      case 'success':
        console.log(`✅ ${prefix}`, message);
        break;
      default:
        console.log(`ℹ️ ${prefix}`, message);
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): DevToolConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  public updateConfig(updates: Partial<DevToolConfig>): void {
    this.config = { ...this.config, ...updates };
    this.log('Development configuration updated', 'info');
  }

  /**
   * Check if development mode is enabled
   */
  public isEnabled(): boolean {
    return this.isDevelopment;
  }

  /**
   * Cleanup development tools
   */
  public cleanup(): void {
    // Remove event listeners
    document.removeEventListener('keydown', this.setupKeyboardShortcuts);
    
    // Remove debug mode class
    document.body.classList.remove('debug-mode');
    
    this.log('Development tools cleaned up', 'info');
  }
}

// Create global instance
export const developmentTools = new DevelopmentTools();

// Export initialization function
export const setupDevelopmentTools = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🛠️ Development tools ready');
    console.log('Available shortcuts:');
    console.log('- Ctrl+Shift+D: Toggle debug mode');
    console.log('- Ctrl+Shift+P: Performance panel');
    console.log('- Ctrl+Shift+C: Clear console');
    console.log('- Ctrl+Shift+R: Clear storage');
  }
  return developmentTools;
};