// JAC Learning Platform - Analytics Integration Hooks
// Enhanced by Cavin Otieno - Cavin Otieno
// Comprehensive analytics system for Button Intelligence Platform

import { useState, useEffect, useCallback, useRef } from 'react';
import { ButtonAnalytics } from './Button';

/**
 * Analytics service configuration
 */
interface AnalyticsConfig {
  provider: 'google' | 'mixpanel' | 'amplitude' | 'custom';
  trackingId?: string;
  apiKey?: string;
  endpoint?: string;
  enableRealTime?: boolean;
  enableBatching?: boolean;
  batchSize?: number;
  flushInterval?: number;
}

/**
 * Analytics event data structure
 */
interface AnalyticsEvent {
  timestamp: number;
  event: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId?: string;
  buttonId?: string;
  buttonVariant?: string;
  buttonSize?: string;
}

/**
 * Custom hook for comprehensive analytics integration
 */
export const useAnalytics = (config: Partial<AnalyticsConfig> = {}) => {
  const {
    provider = 'google',
    trackingId = process.env.REACT_APP_GA_TRACKING_ID,
    apiKey = process.env.REACT_APP_MIXPANEL_TOKEN,
    enableRealTime = true,
    enableBatching = true,
    batchSize = 10,
    flushInterval = 5000,
  } = config;

  const [isInitialized, setIsInitialized] = useState(false);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const batchRef = useRef<AnalyticsEvent[]>([]);
  const sessionIdRef = useRef<string>(generateSessionId());

  // Initialize analytics provider
  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        switch (provider) {
          case 'google':
            if (trackingId && typeof window !== 'undefined') {
              // Initialize Google Analytics
              (window as any).gtag = (window as any).gtag || function() {
                ((window as any).gtag.q = (window as any).gtag.q || []).push(arguments);
              };
              (window as any).gtag('js', new Date());
              (window as any).gtag('config', trackingId);
            }
            break;
          
          case 'mixpanel':
            if (apiKey && typeof window !== 'undefined') {
              // Initialize Mixpanel
              (window as any).mixpanel = (window as any).mixpanel || (window as any).mixpanel;
              if ((window as any).mixpanel) {
                (window as any).mixpanel.init(apiKey);
              }
            }
            break;
          
          case 'amplitude':
            if (apiKey && typeof window !== 'undefined') {
              // Initialize Amplitude
              (window as any).amplitude = (window as any).amplitude || {};
            }
            break;
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.warn('Analytics initialization failed:', error);
      }
    };

    initializeAnalytics();
  }, [provider, trackingId, apiKey]);

  // Flush events periodically if batching is enabled
  useEffect(() => {
    if (!enableBatching || batchRef.current.length === 0) return;

    const flushTimeout = setTimeout(() => {
      flushEvents();
    }, flushInterval);

    return () => clearTimeout(flushTimeout);
  }, [enableBatching, flushInterval]);

  /**
   * Generate unique session ID
   */
  function generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Track button interaction event
   */
  const trackButtonEvent = useCallback((
    eventType: string,
    buttonProps: any,
    analytics: ButtonAnalytics,
    additionalProperties: Record<string, any> = {}
  ) => {
    if (!isInitialized) return;

    const event: AnalyticsEvent = {
      timestamp: Date.now(),
      event: `button_${eventType}`,
      properties: {
        buttonVariant: buttonProps.variant,
        buttonSize: buttonProps.size,
        buttonAnimation: buttonProps.animation,
        isLoading: buttonProps.isLoading,
        isDisabled: buttonProps.isDisabled,
        clickCount: analytics.clickCount,
        hoverCount: analytics.hoverCount,
        interactionTime: analytics.interactionTime,
        conversionRate: analytics.conversionRate,
        userSatisfaction: analytics.userSatisfaction,
        screenReaderLabel: buttonProps.screenReaderLabel,
        educationalType: buttonProps.educationalType,
        theme: buttonProps.theme,
        ...additionalProperties,
      },
      userId: getCurrentUserId(),
      sessionId: sessionIdRef.current,
      buttonId: buttonProps.id || generateButtonId(buttonProps),
    };

    if (enableBatching) {
      batchRef.current.push(event);
      
      if (batchRef.current.length >= batchSize) {
        flushEvents();
      }
    } else {
      sendEvent(event);
    }

    setEvents(prev => [...prev, event]);
  }, [isInitialized, enableBatching, batchSize]);

  /**
   * Flush all pending events
   */
  const flushEvents = useCallback(() => {
    if (batchRef.current.length === 0) return;

    const eventsToSend = [...batchRef.current];
    batchRef.current = [];

    eventsToSend.forEach(sendEvent);
  }, []);

  /**
   * Send event to analytics provider
   */
  const sendEvent = useCallback((event: AnalyticsEvent) => {
    switch (provider) {
      case 'google':
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', event.event, event.properties);
        }
        break;
      
      case 'mixpanel':
        if (typeof window !== 'undefined' && (window as any).mixpanel) {
          (window as any).mixpanel.track(event.event, event.properties);
        }
        break;
      
      case 'amplitude':
        if (typeof window !== 'undefined' && (window as any).amplitude) {
          (window as any).amplitude.getInstance().logEvent(event.event, event.properties);
        }
        break;
      
      case 'custom':
        if (config.endpoint) {
          sendToCustomEndpoint(event);
        }
        break;
    }

    if (enableRealTime) {
      console.log('Analytics Event:', event);
    }
  }, [provider, config.endpoint, enableRealTime]);

  /**
   * Send event to custom endpoint
   */
  const sendToCustomEndpoint = async (event: AnalyticsEvent) => {
    try {
      await fetch(config.endpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.warn('Failed to send event to custom endpoint:', error);
    }
  };

  /**
   * Get current user ID (placeholder - should integrate with auth system)
   */
  const getCurrentUserId = (): string | undefined => {
    // This should integrate with your authentication system
    // For now, return undefined to use anonymous tracking
    return undefined;
  };

  /**
   * Generate unique button ID for tracking
   */
  const generateButtonId = (buttonProps: any): string => {
    const id = buttonProps.id || buttonProps.name || 'unnamed';
    const variant = buttonProps.variant || 'unknown';
    const size = buttonProps.size || 'unknown';
    
    return `${id}-${variant}-${size}-${Date.now()}`;
  };

  /**
   * Track conversion event
   */
  const trackConversion = useCallback((
    buttonProps: any,
    analytics: ButtonAnalytics,
    conversionValue: number = 1
  ) => {
    trackButtonEvent('conversion', buttonProps, analytics, {
      conversionValue,
      conversionRate: analytics.conversionRate,
    });
  }, [trackButtonEvent]);

  /**
   * Track error event
   */
  const trackError = useCallback((
    buttonProps: any,
    analytics: ButtonAnalytics,
    errorMessage: string,
    errorStack?: string
  ) => {
    trackButtonEvent('error', buttonProps, analytics, {
      errorMessage,
      errorStack,
      errorCount: analytics.errorCount + 1,
    });
  }, [trackButtonEvent]);

  /**
   * Track performance event
   */
  const trackPerformance = useCallback((
    buttonProps: any,
    analytics: ButtonAnalytics,
    metrics: {
      renderTime?: number;
      interactionTime?: number;
      loadTime?: number;
    }
  ) => {
    trackButtonEvent('performance', buttonProps, analytics, metrics);
  }, [trackButtonEvent]);

  /**
   * Get aggregated analytics data
   */
  const getAggregatedData = useCallback(() => {
    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);
    const recentEvents = events.filter(e => e.timestamp > last24Hours);

    const aggregation = {
      totalEvents: recentEvents.length,
      uniqueButtons: new Set(recentEvents.map(e => e.buttonId)).size,
      mostPopularVariants: {} as Record<string, number>,
      mostPopularSizes: {} as Record<string, number>,
      conversionRate: 0,
      averageInteractionTime: 0,
      errorRate: 0,
    };

    // Aggregate variant data
    recentEvents.forEach(event => {
      if (event.properties.buttonVariant) {
        aggregation.mostPopularVariants[event.properties.buttonVariant] = 
          (aggregation.mostPopularVariants[event.properties.buttonVariant] || 0) + 1;
      }
      
      if (event.properties.buttonSize) {
        aggregation.mostPopularSizes[event.properties.buttonSize] = 
          (aggregation.mostPopularSizes[event.properties.buttonSize] || 0) + 1;
      }
    });

    // Calculate conversion rate
    const conversionEvents = recentEvents.filter(e => e.event === 'button_conversion');
    const clickEvents = recentEvents.filter(e => e.event === 'button_click');
    
    if (clickEvents.length > 0) {
      aggregation.conversionRate = (conversionEvents.length / clickEvents.length) * 100;
    }

    // Calculate average interaction time
    const interactionTimes = recentEvents
      .filter(e => e.properties.interactionTime)
      .map(e => e.properties.interactionTime);
    
    if (interactionTimes.length > 0) {
      aggregation.averageInteractionTime = interactionTimes.reduce((a, b) => a + b, 0) / interactionTimes.length;
    }

    // Calculate error rate
    const errorEvents = recentEvents.filter(e => e.event === 'button_error');
    aggregation.errorRate = recentEvents.length > 0 ? (errorEvents.length / recentEvents.length) * 100 : 0;

    return aggregation;
  }, [events]);

  return {
    trackButtonEvent,
    trackConversion,
    trackError,
    trackPerformance,
    flushEvents,
    getAggregatedData,
    isInitialized,
    events,
    sessionId: sessionIdRef.current,
  };
};