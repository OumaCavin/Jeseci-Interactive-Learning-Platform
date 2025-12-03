// JAC Learning Platform - Enhanced Entry Point by Cavin Otieno
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Error monitoring and analytics (to be implemented)
import { initErrorMonitoring } from './utils/errorMonitoring';
import { initAnalytics } from './utils/analytics';
import { initPerformanceMonitoring } from './utils/performance';

// Development utilities
import { setupDevelopmentTools } from './utils/development';

// Initialize application monitoring and analytics
initErrorMonitoring();
initAnalytics();
initPerformanceMonitoring();

// Development environment setup
if (process.env.NODE_ENV === 'development') {
  setupDevelopmentTools();
}

// Service Worker registration for PWA capabilities
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, prompt user to refresh
              if (window.confirm('New version available! Would you like to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      console.log('SW registration failed: ', error);
    }
  }
};

// Initialize service worker in production
if (process.env.NODE_ENV === 'production') {
  registerServiceWorker();
}

// Performance monitoring
const measureAppLoadTime = () => {
  if ('performance' in window && 'measure' in window.performance) {
    window.performance.mark('app-start');
  }
};

// Global error handler
const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Send to error monitoring service
    if (window.errorMonitor) {
      window.errorMonitor.captureException(event.reason);
    }
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.errorMonitor) {
      window.errorMonitor.captureException(event.error);
    }
  });
};

// Environment-based configuration
const getAppConfig = () => {
  return {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enableServiceWorker: process.env.REACT_APP_ENABLE_PWA === 'true',
    enableDebugMode: process.env.NODE_ENV === 'development',
    sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    analyticsId: process.env.REACT_APP_ANALYTICS_ID,
  };
};

// Initialize application
const initializeApp = async () => {
  // Measure initial load time
  measureAppLoadTime();
  
  // Setup global error handling
  setupGlobalErrorHandling();
  
  // Get application configuration
  const config = getAppConfig();
  
  console.log('🚀 JAC Learning Platform Initializing...', {
    environment: process.env.NODE_ENV,
    config,
    timestamp: new Date().toISOString(),
  });

  // Create root element
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  // Create React root with enhanced configuration
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  // Render application with error boundaries and performance tracking
  try {
    await root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Mark app load completion
    if ('performance' in window && 'measure' in window.performance) {
      window.performance.mark('app-loaded');
      window.performance.measure('app-load-time', 'app-start', 'app-loaded');
      
      const measure = window.performance.getEntriesByName('app-load-time')[0];
      console.log(`⚡ App Load Time: ${measure.duration.toFixed(2)}ms`);
    }
    
    console.log('✅ JAC Learning Platform Ready!');
  } catch (error) {
    console.error('❌ Failed to render application:', error);
    
    // Fallback error display
    rootElement.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: 'Inter', sans-serif;
        text-align: center;
        padding: 2rem;
      ">
        <div>
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">⚠️ Application Error</h1>
          <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">
            We're sorry, but something went wrong loading the application.
          </p>
          <button 
            onclick="window.location.reload()" 
            style="
              background: rgba(255,255,255,0.2);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              cursor: pointer;
              font-size: 1rem;
            "
          >
            Reload Application
          </button>
        </div>
      </div>
    `;
    
    // Report error to monitoring service
    if (window.errorMonitor) {
      window.errorMonitor.captureException(error);
    }
  }
};

// Start the application
initializeApp();

// Export for testing and development
export { initializeApp };