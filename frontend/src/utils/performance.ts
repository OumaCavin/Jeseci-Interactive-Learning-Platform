/**
 * Performance Monitoring Utility for JAC Learning Platform
 * Provides comprehensive performance tracking and optimization insights
 */

interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  category: 'navigation' | 'resource' | 'paint' | 'longtask' | 'custom';
  timestamp: string;
  url: string;
  connection?: string;
  customParameters?: Record<string, any>;
}

interface ResourceTiming {
  name: string;
  initiatorType: string;
  duration: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
}

interface LongTask {
  duration: number;
  startTime: number;
  attribution: any[];
}

class PerformanceMonitor {
  private isEnabled: boolean;
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 500;
  private resourceTimings: Map<string, ResourceTiming> = new Map();
  private longTasks: LongTask[] = [];
  private observers: PerformanceObserver[] = [];
  private reportEndpoint?: string;

  constructor() {
    this.isEnabled = process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true' || 
                     process.env.NODE_ENV === 'production';
    this.reportEndpoint = process.env.REACT_APP_PERFORMANCE_ENDPOINT;
    
    if (this.isEnabled && 'PerformanceObserver' in window) {
      console.log('⚡ Performance monitoring initialized');
      this.initializePerformanceTracking();
      this.startPerformanceMonitoring();
    } else {
      console.warn('⚠️ Performance monitoring not supported in this environment');
    }
  }

  /**
   * Initialize performance tracking
   */
  private initializePerformanceTracking(): void {
    // Mark start of application load
    if ('performance' in window && 'mark' in window.performance) {
      window.performance.mark('app-start');
    }

    // Setup automatic reporting in production
    if (process.env.NODE_ENV === 'production') {
      this.setupPeriodicReporting();
    }
  }

  /**
   * Start all performance monitoring
   */
  private startPerformanceMonitoring(): void {
    this.observeNavigationTiming();
    this.observeResourceTiming();
    this.observePaintTiming();
    this.observeLongTasks();
    this.observeLayoutShifts();
    this.trackMemoryUsage();
    this.trackConnectionInfo();
  }

  /**
   * Observe navigation timing
   */
  private observeNavigationTiming(): void {
    if ('PerformanceObserver' in window) {
      try {
        const navObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
            }
          });
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);
      } catch (error) {
        console.warn('Navigation timing observation failed:', error);
      }
    }
  }

  /**
   * Record navigation timing metrics
   */
  private recordNavigationMetrics(entry: PerformanceNavigationTiming): void {
    const metrics: Partial<PerformanceMetric>[] = [
      { name: 'dns_lookup', value: entry.domainLookupEnd - entry.domainLookupStart, unit: 'ms' },
      { name: 'tcp_connection', value: entry.connectEnd - entry.connectStart, unit: 'ms' },
      { name: 'tls_handshake', value: entry.connectEnd - entry.secureConnectionStart, unit: 'ms' },
      { name: 'ttfb', value: entry.responseStart - entry.requestStart, unit: 'ms' },
      { name: 'response_download', value: entry.responseEnd - entry.responseStart, unit: 'ms' },
      { name: 'dom_processing', value: entry.domContentLoadedEventEnd - entry.responseEnd, unit: 'ms' },
      { name: 'dom_content_loaded', value: entry.domContentLoadedEventEnd - entry.startTime, unit: 'ms' },
      { name: 'load_complete', value: entry.loadEventEnd - entry.startTime, unit: 'ms' },
      { name: 'first_paint', value: entry.loadEventStart - entry.startTime, unit: 'ms' },
    ];

    metrics.forEach(metric => {
      if (metric.value !== undefined && metric.value >= 0) {
        this.recordMetric({
          ...metric,
          category: 'navigation',
          timestamp: new Date().toISOString(),
          url: window.location.href
        } as PerformanceMetric);
      }
    });

    // Mark navigation complete
    if ('performance' in window && 'mark' in window.performance) {
      window.performance.mark('navigation-complete');
    }
  }

  /**
   * Observe resource timing
   */
  private observeResourceTiming(): void {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'resource') {
              this.recordResourceMetrics(entry as PerformanceResourceTiming);
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource timing observation failed:', error);
      }
    }
  }

  /**
   * Record resource timing metrics
   */
  private recordResourceMetrics(entry: PerformanceResourceTiming): void {
    const resourceTiming: ResourceTiming = {
      name: entry.name,
      initiatorType: (entry as any).initiatorType || 'unknown',
      duration: entry.duration,
      transferSize: entry.transferSize,
      encodedBodySize: entry.encodedBodySize,
      decodedBodySize: entry.decodedBodySize
    };

    this.resourceTimings.set(entry.name, resourceTiming);

    // Record significant resources
    if (entry.duration > 100 || entry.transferSize > 100000) { // >100ms or >100KB
      this.recordMetric({
        name: `resource_${(entry as any).initiatorType}`,
        value: entry.duration,
        unit: 'ms',
        category: 'resource',
        timestamp: new Date().toISOString(),
        url: window.location.href,
        customParameters: resourceTiming
      } as PerformanceMetric);
    }
  }

  /**
   * Observe paint timing
   */
  private observePaintTiming(): void {
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.recordMetric({
              name: entry.name,
              value: entry.startTime,
              unit: 'ms',
              category: 'paint',
              timestamp: new Date().toISOString(),
              url: window.location.href
            } as PerformanceMetric);
          });
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (error) {
        console.warn('Paint timing observation failed:', error);
      }
    }
  }

  /**
   * Observe long tasks (>50ms)
   */
  private observeLongTasks(): void {
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const longTask: LongTask = {
              duration: entry.duration,
              startTime: entry.startTime,
              attribution: (entry as any).attribution || []
            };
            this.longTasks.push(longTask);

            this.recordMetric({
              name: 'long_task',
              value: entry.duration,
              unit: 'ms',
              category: 'longtask',
              timestamp: new Date().toISOString(),
              url: window.location.href,
              customParameters: longTask
            } as PerformanceMetric);

            // Log long tasks in development
            if (process.env.NODE_ENV === 'development' && entry.duration > 100) {
              console.warn('🐌 Long task detected:', {
                duration: `${entry.duration.toFixed(2)}ms`,
                startTime: `${entry.startTime.toFixed(2)}ms`,
                attribution: longTask.attribution
              });
            }
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (error) {
        console.warn('Long task observation failed:', error);
      }
    }
  }

  /**
   * Observe layout shifts (CLS)
   */
  private observeLayoutShifts(): void {
    if ('PerformanceObserver' in window) {
      try {
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            // Cast to LayoutShift interface which has value and hadRecentInput properties
            const layoutShift = entry as any;
            if (!layoutShift.hadRecentInput && layoutShift.value !== undefined) {
              this.recordMetric({
                name: 'layout_shift',
                value: layoutShift.value,
                unit: 'count',
                category: 'custom',
                timestamp: new Date().toISOString(),
                url: window.location.href,
                customParameters: {
                  sources: layoutShift.sources || []
                }
              } as PerformanceMetric);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('Layout shift observation failed:', error);
      }
    }
  }

  /**
   * Track memory usage
   */
  private trackMemoryUsage(): void {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.recordMetric({
          name: 'memory_used',
          value: Math.round(memory.usedJSHeapSize / 1048576), // Convert to MB
          unit: 'bytes',
          category: 'custom',
          timestamp: new Date().toISOString(),
          url: window.location.href,
          customParameters: {
            total: Math.round(memory.totalJSHeapSize / 1048576),
            limit: Math.round(memory.jsHeapSizeLimit / 1048576)
          }
        } as PerformanceMetric);
      }
    };

    // Check immediately and then every 30 seconds
    checkMemory();
    setInterval(checkMemory, 30000);
  }

  /**
   * Track connection information
   */
  private trackConnectionInfo(): void {
    const connection = (navigator as any).connection;
    if (connection) {
      this.recordMetric({
        name: 'connection_effective_type',
        value: connection.effectiveType === '4g' ? 4 : 
               connection.effectiveType === '3g' ? 3 :
               connection.effectiveType === '2g' ? 2 : 1,
        unit: 'count',
        category: 'custom',
        timestamp: new Date().toISOString(),
        url: window.location.href,
        customParameters: {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        }
      } as PerformanceMetric);
    }
  }

  /**
   * Record a performance metric
   */
  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log critical performance issues
    if (process.env.NODE_ENV === 'development') {
      if (metric.category === 'navigation' && metric.value > 3000) {
        console.warn('⚠️ Slow navigation detected:', metric);
      }
      if (metric.category === 'resource' && metric.value > 1000) {
        console.warn('⚠️ Slow resource loading:', metric);
      }
      if (metric.category === 'longtask' && metric.value > 100) {
        console.warn('🐌 Long running task:', metric);
      }
    }
  }

  /**
   * Track custom performance mark
   */
  public mark(name: string): void {
    if ('performance' in window && 'mark' in window.performance) {
      window.performance.mark(name);
    }
  }

  /**
   * Measure custom performance
   */
  public measure(name: string, startMark: string, endMark?: string): number | null {
    if ('performance' in window && 'measure' in window.performance) {
      try {
        if (endMark) {
          window.performance.measure(name, startMark, endMark);
        } else {
          window.performance.measure(name, startMark);
        }
        
        const measures = window.performance.getEntriesByName(name, 'measure');
        if (measures.length > 0) {
          const duration = measures[0].duration;
          
          this.recordMetric({
            name,
            value: duration,
            unit: 'ms',
            category: 'custom',
            timestamp: new Date().toISOString(),
            url: window.location.href
          });
          
          return duration;
        }
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    }
    return null;
  }

  /**
   * Get Largest Contentful Paint
   */
  public getLCP(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          observer.disconnect();
          resolve(lastEntry.startTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } else {
        resolve(0);
      }
    });
  }

  /**
   * Get First Input Delay
   */
  public getFID(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const firstEntry = entries[0];
            observer.disconnect();
            if ('processingStart' in firstEntry && 'startTime' in firstEntry) {
              const timing = firstEntry as PerformanceEventTiming;
              resolve(timing.processingStart - timing.startTime);
            } else {
              resolve(0);
            }
          } else {
            resolve(0);
          }
        });
        observer.observe({ entryTypes: ['first-input'] });
      } else {
        resolve(0);
      }
    });
  }

  /**
   * Setup periodic reporting
   */
  private setupPeriodicReporting(): void {
    // Report metrics every 5 minutes
    setInterval(() => {
      this.reportMetrics();
    }, 5 * 60 * 1000);
  }

  /**
   * Report metrics to external service
   */
  private async reportMetrics(): Promise<void> {
    if (!this.reportEndpoint || this.metrics.length === 0) return;

    try {
      const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        metrics: this.metrics.slice(-100), // Last 100 metrics
        summary: this.generateSummary()
      };

      await fetch(this.reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });

      // Clear reported metrics
      this.metrics = this.metrics.slice(-50); // Keep last 50 for debugging
      
    } catch (error) {
      console.warn('Failed to report performance metrics:', error);
    }
  }

  /**
   * Generate performance summary
   */
  private generateSummary(): any {
    const recentMetrics = this.metrics.filter(
      m => Date.now() - new Date(m.timestamp).getTime() < 5 * 60 * 1000
    );

    const summary: any = {
      totalMetrics: this.metrics.length,
      recentMetrics: recentMetrics.length,
      avgLoadTime: 0,
      slowResources: 0,
      longTasks: 0
    };

    const loadTimes = recentMetrics.filter(m => m.name === 'load_complete');
    if (loadTimes.length > 0) {
      summary.avgLoadTime = loadTimes.reduce((sum, m) => sum + m.value, 0) / loadTimes.length;
    }

    const slowResources = recentMetrics.filter(m => 
      m.category === 'resource' && m.value > 1000
    );
    summary.slowResources = slowResources.length;

    const longTasks = recentMetrics.filter(m => m.name === 'long_task');
    summary.longTasks = longTasks.length;

    return summary;
  }

  /**
   * Get all recorded metrics
   */
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get performance summary
   */
  public getPerformanceSummary(): any {
    return {
      totalMetrics: this.metrics.length,
      resourceCount: this.resourceTimings.size,
      longTaskCount: this.longTasks.length,
      summary: this.generateSummary()
    };
  }

  /**
   * Clear all metrics
   */
  public clearMetrics(): void {
    this.metrics = [];
    this.resourceTimings.clear();
    this.longTasks = [];
  }

  /**
   * Cleanup observers
   */
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create global instance
export const performanceMonitor = new PerformanceMonitor();

// Export initialization function
export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('⚡ Performance monitoring ready');
  }
  return performanceMonitor;
};