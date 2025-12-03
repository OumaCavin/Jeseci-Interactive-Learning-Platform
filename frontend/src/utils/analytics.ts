/**
 * Analytics Utility for JAC Learning Platform
 * Provides comprehensive user behavior tracking and analytics
 */

interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId: string;
  page: string;
  url: string;
}

interface UserProperties {
  userId?: string;
  userType?: 'student' | 'instructor' | 'admin';
  learningLevel?: 'beginner' | 'intermediate' | 'advanced';
  subscriptionTier?: 'free' | 'premium' | 'enterprise';
  joinDate?: string;
  lastActive?: string;
  preferences?: Record<string, any>;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

class Analytics {
  private isEnabled: boolean;
  private events: AnalyticsEvent[] = [];
  private userProperties: UserProperties = {};
  private sessionId: string;
  private pageViewTime: Map<string, number> = new Map();
  private maxEvents = 1000;
  private analyticsEndpoint?: string;

  constructor() {
    this.isEnabled = process.env.REACT_APP_ENABLE_ANALYTICS === 'true' || 
                     process.env.NODE_ENV === 'production';
    this.sessionId = this.generateSessionId();
    this.analyticsEndpoint = process.env.REACT_APP_ANALYTICS_ENDPOINT;
    
    if (this.isEnabled) {
      console.log('📊 Analytics tracking initialized');
      this.initializeExternalServices();
      this.setupPageTracking();
      this.setupPerformanceTracking();
    }
  }

  /**
   * Initialize external analytics services
   */
  private initializeExternalServices(): void {
    // Google Analytics 4
    const gaMeasurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (gaMeasurementId) {
      this.initGoogleAnalytics(gaMeasurementId);
    }

    // Mixpanel
    const mixpanelToken = process.env.REACT_APP_MIXPANEL_TOKEN;
    if (mixpanelToken) {
      this.initMixpanel(mixpanelToken);
    }

    // Custom analytics endpoint
    if (this.analyticsEndpoint) {
      console.log('📈 Custom analytics endpoint configured');
    }
  }

  /**
   * Initialize Google Analytics 4
   */
  private initGoogleAnalytics(measurementId: string): void {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', measurementId);

    (window as any).gtag = gtag;
    console.log('📊 Google Analytics initialized');
  }

  /**
   * Initialize Mixpanel
   */
  private initMixpanel(token: string): void {
    // This would require mixpanel-browser dependency
    // import mixpanel from 'mixpanel-browser';
    // 
    // mixpanel.init(token, {
    //   debug: process.env.NODE_ENV === 'development',
    //   track_pageview: true,
    //   persistence: 'localStorage'
    // });
    
    console.log('📈 Mixpanel initialization configured (requires mixpanel-browser dependency)');
  }

  /**
   * Setup automatic page tracking
   */
  private setupPageTracking(): void {
    // Track initial page load
    this.trackPageView('initial_load');

    // Track page changes (for SPAs)
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = (...args) => {
      originalPushState.apply(window.history, args);
      setTimeout(() => this.trackPageView('navigation'), 0);
    };

    window.history.replaceState = (...args) => {
      originalReplaceState.apply(window.history, args);
      setTimeout(() => this.trackPageView('navigation'), 0);
    };

    // Track back/forward navigation
    window.addEventListener('popstate', () => {
      setTimeout(() => this.trackPageView('popstate'), 0);
    });
  }

  /**
   * Setup performance tracking
   */
  private setupPerformanceTracking(): void {
    if ('PerformanceObserver' in window) {
      // Observe navigation timing
      try {
        const navObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              this.trackPerformanceMetrics({
                pageLoadTime: entry.duration,
                timeToInteractive: this.getTTI(),
                firstContentfulPaint: this.getFCP(),
                largestContentfulPaint: this.getLCP(),
                cumulativeLayoutShift: this.getCLS(),
                firstInputDelay: this.getFID()
              });
            }
          });
        });
        navObserver.observe({ entryTypes: ['navigation'] });
      } catch (error) {
        console.warn('Performance navigation tracking failed:', error);
      }
    }
  }

  /**
   * Track page view
   */
  public trackPageView(pageName?: string): void {
    const event: AnalyticsEvent = {
      name: 'page_view',
      category: 'navigation',
      action: 'view',
      label: pageName || document.title,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      page: pageName || document.title,
      url: window.location.href,
      userId: this.userProperties.userId,
      customParameters: {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`
      }
    };

    this.trackEvent(event);
    this.updatePageViewTime();
  }

  /**
   * Track user interaction
   */
  public trackUserInteraction(
    action: string,
    element: string,
    value?: number,
    customParameters?: Record<string, any>
  ): void {
    const event: AnalyticsEvent = {
      name: 'user_interaction',
      category: 'engagement',
      action,
      label: element,
      value,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      page: document.title,
      url: window.location.href,
      userId: this.userProperties.userId,
      customParameters
    };

    this.trackEvent(event);
  }

  /**
   * Track learning activity
   */
  public trackLearningActivity(
    activity: 'start' | 'complete' | 'progress' | 'pause',
    contentType: 'lesson' | 'quiz' | 'assessment' | 'module',
    contentId: string,
    progress?: number,
    customParameters?: Record<string, any>
  ): void {
    const event: AnalyticsEvent = {
      name: 'learning_activity',
      category: 'learning',
      action: activity,
      label: `${contentType}_${contentId}`,
      value: progress,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      page: document.title,
      url: window.location.href,
      userId: this.userProperties.userId,
      customParameters: {
        contentType,
        contentId,
        progress,
        ...customParameters
      }
    };

    this.trackEvent(event);
  }

  /**
   * Track assessment activity
   */
  public trackAssessment(
    action: 'start' | 'submit' | 'complete' | 'review',
    assessmentId: string,
    score?: number,
    duration?: number,
    customParameters?: Record<string, any>
  ): void {
    const event: AnalyticsEvent = {
      name: 'assessment_activity',
      category: 'assessment',
      action,
      label: assessmentId,
      value: score,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      page: document.title,
      url: window.location.href,
      userId: this.userProperties.userId,
      customParameters: {
        assessmentId,
        score,
        duration,
        ...customParameters
      }
    };

    this.trackEvent(event);
  }

  /**
   * Track authentication events
   */
  public trackAuthEvent(
    action: 'login' | 'logout' | 'register' | 'password_reset',
    method?: string,
    success?: boolean,
    customParameters?: Record<string, any>
  ): void {
    const event: AnalyticsEvent = {
      name: 'authentication',
      category: 'auth',
      action,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      page: document.title,
      url: window.location.href,
      userId: this.userProperties.userId,
      customParameters: {
        method,
        success,
        ...customParameters
      }
    };

    this.trackEvent(event);
  }

  /**
   * Track custom event
   */
  public trackCustomEvent(
    eventName: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    customParameters?: Record<string, any>
  ): void {
    const event: AnalyticsEvent = {
      name: eventName,
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      page: document.title,
      url: window.location.href,
      userId: this.userProperties.userId,
      customParameters
    };

    this.trackEvent(event);
  }

  /**
   * Track performance metrics
   */
  public trackPerformanceMetrics(metrics: PerformanceMetrics): void {
    const event: AnalyticsEvent = {
      name: 'performance',
      category: 'technical',
      action: 'metrics',
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      page: document.title,
      url: window.location.href,
      customParameters: metrics
    };

    this.trackEvent(event);
  }

  /**
   * Set user properties
   */
  public setUserProperties(properties: UserProperties): void {
    this.userProperties = { ...this.userProperties, ...properties };
    
    // Update external services
    if ((window as any).gtag) {
      (window as any).gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
        user_id: properties.userId,
        custom_map: {
          user_type: properties.userType,
          learning_level: properties.learningLevel,
          subscription_tier: properties.subscriptionTier
        }
      });
    }
  }

  /**
   * Track individual event
   */
  private trackEvent(event: AnalyticsEvent): void {
    // Store locally
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Send to external services
    this.sendToExternalServices(event);

    // Send to custom endpoint if configured
    if (this.analyticsEndpoint) {
      this.sendToEndpoint(event);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }
  }

  /**
   * Send event to external analytics services
   */
  private sendToExternalServices(event: AnalyticsEvent): void {
    // Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameters: event.customParameters
      });
    }
  }

  /**
   * Send event to custom endpoint
   */
  private async sendToEndpoint(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch(this.analyticsEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.warn('Failed to send analytics event:', error);
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update page view time tracking
   */
  private updatePageViewTime(): void {
    const currentPage = window.location.pathname;
    const now = Date.now();
    
    // Track time spent on previous page
    const previousPage = this.pageViewTime.get('current_page');
    if (previousPage) {
      const timeSpent = now - previousPage;
      this.trackCustomEvent('time_spent', 'engagement', 'page_time', currentPage, timeSpent);
    }
    
    // Update current page tracking
    this.pageViewTime.set('current_page', now);
  }

  /**
   * Performance metric helpers
   */
  private getTTI(): number {
    // Time to Interactive - would need PerformanceNavigationTiming API
    return 0; // Placeholder
  }

  private getFCP(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : 0;
  }

  private getLCP(): number {
    // Largest Contentful Paint - would need PerformanceObserver
    return 0; // Placeholder
  }

  private getCLS(): number {
    // Cumulative Layout Shift - would need PerformanceObserver
    return 0; // Placeholder
  }

  private getFID(): number {
    // First Input Delay - would need PerformanceObserver
    return 0; // Placeholder
  }

  /**
   * Get all tracked events (for debugging)
   */
  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Clear event history
   */
  public clearEvents(): void {
    this.events = [];
  }

  /**
   * Get current session info
   */
  public getSessionInfo(): { sessionId: string; userProperties: UserProperties } {
    return {
      sessionId: this.sessionId,
      userProperties: this.userProperties
    };
  }
}

// Create global instance
export const analytics = new Analytics();

// Export initialization function
export const initAnalytics = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics ready');
  }
  return analytics;
};