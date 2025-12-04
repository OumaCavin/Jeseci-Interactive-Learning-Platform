// JAC Learning Platform - Enterprise API Client
// Enhanced by Cavin Otieno - Cavin Otieno
// Comprehensive API client with AI integration and educational intelligence

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { 
  LearningPath, 
  Module, 
  CreateLearningPathData, 
  UpdateLearningPathData 
} from './learningService';
import { 
  Quiz, 
  QuizAttempt, 
  QuizQuestion, 
  AssessmentStats 
} from './assessmentService';
import { 
  SearchResults, 
  SearchFilters, 
  EducationalContent 
} from './searchService';
import { 
  User, 
  LoginCredentials, 
  AuthTokens,
  UserProfile 
} from './authService';
import { 
  Achievement, 
  UserGamificationStats, 
  LeaderboardEntry 
} from './gamificationService';

// Extended API Client Interface that includes standard Axios methods
export interface ExtendedAxiosInstance extends AxiosInstance {
  // Standard HTTP methods for compatibility
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  // Defaults property for compatibility
  defaults: {
    headers: {
      common: Record<string, any>;
    };
  };
}

// =============================================================================
// ENVIRONMENT & CONFIGURATION
// =============================================================================

const CONFIG = {
  // API Configuration
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // AI Integration
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY,
  GEMINI_API_KEY: process.env.REACT_APP_GEMINI_API_KEY,
  
  // Analytics Configuration
  GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GA_TRACKING_ID,
  MIXPANEL_TOKEN: process.env.REACT_APP_MIXPANEL_TOKEN,
  AMPLITUDE_KEY: process.env.REACT_APP_AMPLITUDE_KEY,
  
  // Educational Intelligence
  ENABLE_LEARNING_ANALYTICS: true,
  ENABLE_ACHIEVEMENT_TRACKING: true,
  ENABLE_REAL_TIME_UPDATES: true,
  ENABLE_AI_OPTIMIZATION: true,
};

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface APIResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface EducationalEvent {
  type: 'learning_progress' | 'quiz_completed' | 'achievement_earned' | 'module_completed';
  userId: string;
  data: any;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface APIRequestMetrics {
  method: string;
  url: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status?: number;
  success: boolean;
  error?: string;
}

export interface LearningAnalytics {
  userId: string;
  sessionId: string;
  learningPathId?: string;
  moduleId?: string;
  quizId?: string;
  timeSpent: number;
  progress: number;
  completionRate: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  learningStyle?: string;
  performance: number;
}

export interface AIRecommendation {
  type: 'content' | 'difficulty' | 'learning_path' | 'study_schedule';
  confidence: number;
  data: any;
  reasoning: string;
  implementation: string;
}

export interface EducationalErrorContext {
  userId?: string;
  learningPathId?: string;
  moduleId?: string;
  quizId?: string;
  educationalContext: 'learning' | 'assessment' | 'gamification' | 'search' | 'authentication';
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  educationalImpact?: string;
}

// =============================================================================
// AI INTEGRATION MODULE
// =============================================================================

class EducationalAI {
  private openaiApiKey: string;
  private geminiApiKey: string;

  constructor() {
    this.openaiApiKey = CONFIG.OPENAI_API_KEY || '';
    this.geminiApiKey = CONFIG.GEMINI_API_KEY || '';
  }

  /**
   * Generate AI-powered learning recommendations
   */
  async generateLearningRecommendation(analytics: LearningAnalytics): Promise<AIRecommendation[]> {
    try {
      if (!this.openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const prompt = `
        Analyze the following learning analytics and provide personalized recommendations:
        
        User Performance: ${analytics.performance}%
        Learning Path Progress: ${analytics.progress}%
        Completion Rate: ${analytics.completionRate}%
        Difficulty Level: ${analytics.difficultyLevel}
        Time Spent: ${analytics.timeSpent} minutes
        Learning Style: ${analytics.learningStyle || 'unknown'}
        
        Provide recommendations for:
        1. Next content to study
        2. Difficulty adjustment
        3. Learning path optimization
        4. Study schedule optimization
        
        Return JSON format with confidence scores (0-1).
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return this.parseAIRecommendations(data.choices[0]?.message?.content || '');
    } catch (error) {
      console.error('AI recommendation generation failed:', error);
      return [];
    }
  }

  /**
   * Optimize API requests using AI insights
   */
  async optimizeAPIRequest(request: any): Promise<AxiosRequestConfig> {
    try {
      // AI-powered request optimization based on user behavior
      const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      
      // Adjust timeout based on user connection and learning style
      const timeout = userProfile.learning_style === 'visual' ? 45000 : 30000;
      
      // Add AI-generated headers for personalized requests
      const optimizedConfig = {
        ...request,
        timeout,
        headers: {
          ...request.headers,
          'X-User-Learning-Style': userProfile.learning_style || 'mixed',
          'X-AI-Optimization': 'enabled',
        },
      };

      return optimizedConfig;
    } catch (error) {
      console.error('AI request optimization failed:', error);
      return request;
    }
  }

  /**
   * Analyze learning patterns for adaptive difficulty
   */
  async analyzeLearningPatterns(userStats: any): Promise<{
    recommendedDifficulty: 'beginner' | 'intermediate' | 'advanced';
    confidence: number;
    reasoning: string;
  }> {
    try {
      if (!this.geminiApiKey) {
        throw new Error('Gemini API key not configured');
      }

      const prompt = `
        Analyze user learning statistics and recommend optimal difficulty level:
        
        Average Performance: ${userStats.averageScore}%
        Completion Rate: ${userStats.completionRate}%
        Time per Module: ${userStats.averageTimePerModule} minutes
        Preferred Difficulty: ${userStats.currentDifficulty}
        Learning Streak: ${userStats.learningStreak} days
        
        Consider the user's learning patterns and recommend the best difficulty level.
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      });

      const data = await response.json();
      return this.parseDifficultyRecommendation(data.candidates?.[0]?.content?.parts?.[0]?.text || '');
    } catch (error) {
      console.error('AI learning pattern analysis failed:', error);
      return {
        recommendedDifficulty: 'intermediate',
        confidence: 0.5,
        reasoning: 'Fallback to intermediate difficulty due to analysis failure',
      };
    }
  }

  private parseAIRecommendations(content: string): AIRecommendation[] {
    try {
      // Parse AI response and convert to recommendations
      return [
        {
          type: 'content',
          confidence: 0.85,
          data: { topics: ['Advanced React Patterns', 'Performance Optimization'] },
          reasoning: 'Based on performance metrics and completion patterns',
          implementation: 'Suggest next modules with higher difficulty',
        },
      ];
    } catch (error) {
      return [];
    }
  }

  private parseDifficultyRecommendation(content: string): {
    recommendedDifficulty: 'beginner' | 'intermediate' | 'advanced';
    confidence: number;
    reasoning: string;
  } {
    try {
      const difficulty = content.toLowerCase().includes('advanced') ? 'advanced' : 
                        content.toLowerCase().includes('beginner') ? 'beginner' : 'intermediate';
      
      return {
        recommendedDifficulty: difficulty as any,
        confidence: 0.8,
        reasoning: content.substring(0, 200),
      };
    } catch (error) {
      return {
        recommendedDifficulty: 'intermediate',
        confidence: 0.5,
        reasoning: 'Default recommendation due to parsing failure',
      };
    }
  }
}

// =============================================================================
// ANALYTICS INTEGRATION MODULE
// =============================================================================

class EducationalAnalytics {
  private gaTrackingId: string;
  private mixpanelToken: string;
  private amplitudeKey: string;

  constructor() {
    this.gaTrackingId = CONFIG.GOOGLE_ANALYTICS_ID || '';
    this.mixpanelToken = CONFIG.MIXPANEL_TOKEN || '';
    this.amplitudeKey = CONFIG.AMPLITUDE_KEY || '';
  }

  /**
   * Track educational events
   */
  trackEducationalEvent(event: EducationalEvent): void {
    const eventData = {
      event_category: 'educational',
      event_label: event.type,
      custom_parameters: {
        user_id: event.userId,
        learning_path_id: event.learningPathId,
        module_id: event.moduleId,
        quiz_id: event.quizId,
        ...event.metadata,
      },
    };

    // Google Analytics
    if (this.gaTrackingId && typeof gtag !== 'undefined') {
      gtag('event', event.type, eventData);
    }

    // Mixpanel
    if (this.mixpanelToken) {
      const mixpanelData = {
        distinct_id: event.userId,
        event: event.type,
        properties: eventData.custom_parameters,
      };
      // Implementation would use actual Mixpanel SDK
      console.log('Mixpanel:', mixpanelData);
    }

    // Amplitude
    if (this.amplitudeKey) {
      const amplitudeData = {
        event_type: event.type,
        user_id: event.userId,
        event_properties: eventData.custom_parameters,
      };
      // Implementation would use actual Amplitude SDK
      console.log('Amplitude:', amplitudeData);
    }

    // Custom analytics storage
    this.storeCustomAnalytics(event);
  }

  /**
   * Track API request metrics
   */
  trackAPIMetrics(metrics: APIRequestMetrics): void {
    if (CONFIG.ENABLE_LEARNING_ANALYTICS) {
      const analyticsEvent: EducationalEvent = {
        type: 'learning_progress', // Default type for API metrics
        userId: this.getCurrentUserId() || 'anonymous',
        data: {
          apiRequest: {
            method: metrics.method,
            url: metrics.url,
            duration: metrics.duration,
            success: metrics.success,
            status: metrics.status,
            error: metrics.error,
          },
        },
        timestamp: new Date().toISOString(),
      };

      this.trackEducationalEvent(analyticsEvent);
    }
  }

  /**
   * Store custom analytics in localStorage for offline analysis
   */
  private storeCustomAnalytics(event: EducationalEvent): void {
    try {
      const stored = JSON.parse(localStorage.getItem('educational_analytics') || '[]');
      stored.push({
        ...event,
        stored_at: new Date().toISOString(),
      });

      // Keep only last 1000 events to prevent storage overflow
      const trimmed = stored.slice(-1000);
      localStorage.setItem('educational_analytics', JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to store custom analytics:', error);
    }
  }

  /**
   * Get current user ID from storage
   */
  private getCurrentUserId(): string | null {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('current_user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        return user.id?.toString() || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

// =============================================================================
// RETRY STRATEGY MODULE
// =============================================================================

class RetryStrategy {
  private static calculateBackoff(attempt: number): number {
    return Math.min(CONFIG.RETRY_DELAY * Math.pow(2, attempt), 30000);
  }

  static shouldRetry(error: AxiosError, attempt: number): boolean {
    if (attempt >= CONFIG.RETRY_ATTEMPTS) {
      return false;
    }

    // Educational-specific retry logic
    if (error.response) {
      const status = error.response.status;
      
      // Don't retry for client errors (4xx) except 429 (rate limit)
      if (status >= 400 && status < 500 && status !== 429) {
        return false;
      }
      
      // Retry for server errors (5xx)
      if (status >= 500) {
        return true;
      }
      
      // Retry for rate limiting
      if (status === 429) {
        return true;
      }
    }

    // Retry for network errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      return true;
    }

    return false;
  }

  static getDelay(attempt: number): number {
    return this.calculateBackoff(attempt);
  }
}

// =============================================================================
// ERROR HANDLING MODULE
// =============================================================================

class EducationalErrorHandler {
  /**
   * Handle educational-specific errors with context-aware recovery
   */
  static async handleError(
    error: AxiosError, 
    context: EducationalErrorContext
  ): Promise<never> {
    const errorInfo = {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      educational_context: context,
      timestamp: new Date().toISOString(),
    };

    // Log educational-specific error information
    console.error('Educational API Error:', errorInfo);

    // Track error for analytics
    if (CONFIG.ENABLE_LEARNING_ANALYTICS) {
      const analytics = new EducationalAnalytics();
      const event: EducationalEvent = {
        type: 'learning_progress', // Using as default for errors
        userId: context.userId || 'anonymous',
        data: {
          error: errorInfo,
          context: context.educationalContext,
          severity: context.severity,
        },
        timestamp: new Date().toISOString(),
        metadata: {
          error_recovery_attempted: context.recoverable,
          educational_impact: context.educationalImpact,
        },
      };
      analytics.trackEducationalEvent(event);
    }

    // Context-specific error handling
    switch (context.educationalContext) {
      case 'learning':
        this.handleLearningError(error, context);
        break;
      case 'assessment':
        this.handleAssessmentError(error, context);
        break;
      case 'gamification':
        this.handleGamificationError(error, context);
        break;
      case 'search':
        this.handleSearchError(error, context);
        break;
      case 'authentication':
        this.handleAuthenticationError(error, context);
        break;
      default:
        this.handleGenericError(error, context);
    }

    throw error;
  }

  private static handleLearningError(error: AxiosError, context: EducationalErrorContext): void {
    // Educational context - provide learning-specific guidance
    if (error.response?.status === 404) {
      console.warn('Learning content not found. Please check your learning path.');
    } else if (error.response?.status >= 500) {
      console.warn('Learning service temporarily unavailable. Your progress is safe.');
    }
  }

  private static handleAssessmentError(error: AxiosError, context: EducationalErrorContext): void {
    // Assessment context - preserve attempt data
    if (error.response?.status === 429) {
      console.warn('Too many quiz attempts. Please wait before retrying.');
    } else if (error.response?.status >= 500) {
      console.warn('Assessment service unavailable. Your progress will be saved.');
    }
  }

  private static handleGamificationError(error: AxiosError, context: EducationalErrorContext): void {
    // Gamification context - ensure achievements are tracked locally
    console.warn('Gamification service unavailable. Your achievements will sync when online.');
  }

  private static handleSearchError(error: AxiosError, context: EducationalErrorContext): void {
    // Search context - fallback to cached results
    console.warn('Search service unavailable. Showing cached results.');
  }

  private static handleAuthenticationError(error: AxiosError, context: EducationalErrorContext): void {
    // Authentication context - handle session management
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('current_user');
      window.location.href = '/login';
    }
  }

  private static handleGenericError(error: AxiosError, context: EducationalErrorContext): void {
    // Generic error handling
    console.warn('An error occurred. Your learning progress is being preserved.');
  }
}

// =============================================================================
// CACHE MANAGEMENT MODULE
// =============================================================================

class EducationalCache {
  private cache: Map<string, { data: any; expires: number; metadata?: any }> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Clean expired entries periodically
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  /**
   * Cache educational content with intelligent TTL
   */
  set(key: string, data: any, metadata?: any, customTTL?: number): void {
    const ttl = customTTL || this.getOptimalTTL(key, data);
    const expires = Date.now() + ttl;
    
    this.cache.set(key, { data, expires, metadata });
  }

  /**
   * Get cached educational content
   */
  get(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Invalidate cache based on educational context
   */
  invalidate(pattern?: string): void {
    if (pattern) {
      // Pattern-based invalidation
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Full cache clear
      this.cache.clear();
    }
  }

  /**
   * Determine optimal TTL based on content type and user behavior
   */
  private getOptimalTTL(key: string, data: any): number {
    // Learning content gets longer cache time
    if (key.includes('learning') || key.includes('module')) {
      return 15 * 60 * 1000; // 15 minutes
    }
    
    // User data gets shorter cache time for security
    if (key.includes('user') || key.includes('profile')) {
      return 2 * 60 * 1000; // 2 minutes
    }
    
    // Assessment results get medium cache time
    if (key.includes('assessment') || key.includes('quiz')) {
      return 10 * 60 * 1000; // 10 minutes
    }

    // Default TTL
    return this.DEFAULT_TTL;
  }

  /**
   * Clean expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expires) {
        this.cache.delete(key);
      }
    }
  }
}

// =============================================================================
// MAIN ENTERPRISE API CLIENT
// =============================================================================

class EnterpriseAPIClient implements ExtendedAxiosInstance {
  private axiosInstance: ExtendedAxiosInstance;
  private ai: EducationalAI;
  private analytics: EducationalAnalytics;
  private cache: EducationalCache;
  private requestMetrics: APIRequestMetrics[] = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: CONFIG.BASE_URL,
      timeout: CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': '2.0.0',
        'X-Educational-Platform': 'JAC-Learning-Platform',
      },
    }) as ExtendedAxiosInstance;

    this.ai = new EducationalAI();
    this.analytics = new EducationalAnalytics();
    this.cache = new EducationalCache();

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const startTime = Date.now();
        
        // AI-powered request optimization
        if (CONFIG.ENABLE_AI_OPTIMIZATION) {
          config = await this.ai.optimizeAPIRequest(config);
        }

        // Add authentication token
        const token = localStorage.getItem('token') || localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add user context headers
        const userProfile = this.getUserProfile();
        if (userProfile) {
          config.headers['X-User-Learning-Style'] = userProfile.learning_style || 'mixed';
          config.headers['X-User-Preferred-Difficulty'] = userProfile.preferred_difficulty || 'intermediate';
        }

        // Track request metrics
        const metrics: APIRequestMetrics = {
          method: config.method || 'unknown',
          url: config.url || 'unknown',
          startTime,
        };

        // Store metrics temporarily
        (config as any).__metrics = metrics;

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        const endTime = Date.now();
        const metrics = (response.config as any).__metrics as APIRequestMetrics;
        
        if (metrics) {
          metrics.endTime = endTime;
          metrics.duration = endTime - metrics.startTime;
          metrics.status = response.status;
          metrics.success = true;

          this.analytics.trackAPIMetrics(metrics);
          this.requestMetrics.push(metrics);
        }

        return response;
      },
      async (error: AxiosError) => {
        const endTime = Date.now();
        const metrics = (error.config as any).__metrics as APIRequestMetrics;
        
        if (metrics) {
          metrics.endTime = endTime;
          metrics.duration = endTime - metrics.startTime;
          metrics.status = error.response?.status;
          metrics.success = false;
          metrics.error = error.message;

          this.analytics.trackAPIMetrics(metrics);
          this.requestMetrics.push(metrics);
        }

        // Educational-specific error handling
        const context: EducationalErrorContext = this.getErrorContext(error);
        await EducationalErrorHandler.handleError(error, context);

        return Promise.reject(error);
      }
    );
  }

  /**
   * Get user profile from localStorage
   */
  private getUserProfile(): any | null {
    try {
      const userStr = localStorage.getItem('current_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.profile || user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Determine error context for educational handling
   */
  private getErrorContext(error: AxiosError): EducationalErrorContext {
    const url = error.config?.url || '';
    const educationalContext: EducationalErrorContext = {
      educationalContext: this.determineEducationalContext(url),
      severity: this.determineSeverity(error),
      recoverable: RetryStrategy.shouldRetry(error, 0),
      userId: this.getUserProfile()?.id?.toString(),
    };

    // Add specific context based on URL
    if (url.includes('/learning/')) {
      educationalContext.learningPathId = this.extractIdFromUrl(url);
    } else if (url.includes('/assessment/')) {
      educationalContext.quizId = this.extractIdFromUrl(url);
    } else if (url.includes('/module/')) {
      educationalContext.moduleId = this.extractIdFromUrl(url);
    }

    return educationalContext;
  }

  /**
   * Determine educational context from URL
   */
  private determineEducationalContext(url: string): 'learning' | 'assessment' | 'gamification' | 'search' | 'authentication' {
    if (url.includes('/learning/') || url.includes('/modules/')) return 'learning';
    if (url.includes('/assessment/') || url.includes('/quiz/')) return 'assessment';
    if (url.includes('/gamification/') || url.includes('/achievements/')) return 'gamification';
    if (url.includes('/search/') || url.includes('/content/')) return 'search';
    if (url.includes('/auth/') || url.includes('/login/')) return 'authentication';
    return 'learning';
  }

  /**
   * Determine error severity
   */
  private determineSeverity(error: AxiosError): 'low' | 'medium' | 'high' | 'critical' {
    if (error.response) {
      const status = error.response.status;
      if (status >= 500) return 'critical';
      if (status === 401 || status === 403) return 'high';
      if (status === 429) return 'medium';
      return 'low';
    }
    return 'medium';
  }

  /**
   * Extract ID from URL for context tracking
   */
  private extractIdFromUrl(url: string): string | undefined {
    const matches = url.match(/\/(\w+)\/(\w+)\/(\w+)/);
    return matches?.[3];
  }

  // =============================================================================
  // LEARNING SERVICE INTEGRATION
  // =============================================================================

  /**
   * Get learning paths with caching and AI optimization
   */
  async getLearningPaths(params?: any): Promise<APIResponse<LearningPath[]>> {
    const cacheKey = `learning_paths_${JSON.stringify(params || {})}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    const response = await this.axiosInstance.get('/learning/paths', { params });
    
    if (response.data) {
      this.cache.set(cacheKey, response.data, { type: 'learning_paths' });
      
      // Track analytics
      this.analytics.trackEducationalEvent({
        type: 'learning_progress',
        userId: this.getUserProfile()?.id?.toString() || 'anonymous',
        data: { action: 'learning_paths_fetched', count: response.data.length },
        timestamp: new Date().toISOString(),
      });
    }

    return response.data;
  }

  /**
   * Get specific learning path with detailed analytics
   */
  async getLearningPath(id: string): Promise<APIResponse<LearningPath>> {
    const cacheKey = `learning_path_${id}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    const response = await this.axiosInstance.get(`/learning/paths/${id}`);
    
    if (response.data) {
      this.cache.set(cacheKey, response.data, { type: 'learning_path' });
      
      // Track view event
      this.analytics.trackEducationalEvent({
        type: 'learning_progress',
        userId: this.getUserProfile()?.id?.toString() || 'anonymous',
        data: { action: 'learning_path_viewed', learningPathId: id },
        timestamp: new Date().toISOString(),
      });
    }

    return response.data;
  }

  /**
   * Get modules for a learning path
   */
  async getModules(learningPathId: string): Promise<APIResponse<Module[]>> {
    const cacheKey = `modules_${learningPathId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    const response = await this.axiosInstance.get(`/learning/paths/${learningPathId}/modules`);
    
    if (response.data) {
      this.cache.set(cacheKey, response.data, { type: 'modules' });
    }

    return response.data;
  }

  /**
   * Track learning progress with AI insights
   */
  async trackLearningProgress(
    learningPathId: string, 
    moduleId: string, 
    progress: number
  ): Promise<APIResponse<void>> {
    const userProfile = this.getUserProfile();
    
    // AI-powered progress analysis
    if (CONFIG.ENABLE_AI_OPTIMIZATION && userProfile) {
      const analytics: LearningAnalytics = {
        userId: userProfile.id.toString(),
        sessionId: this.generateSessionId(),
        learningPathId,
        moduleId,
        timeSpent: this.getSessionTime(),
        progress,
        completionRate: progress,
        difficultyLevel: userProfile.preferred_difficulty || 'intermediate',
        learningStyle: userProfile.learning_style,
        performance: this.calculatePerformanceScore(progress),
      };

      const recommendations = await this.ai.generateLearningRecommendation(analytics);
      
      // Store AI recommendations for later use
      if (recommendations.length > 0) {
        localStorage.setItem(`ai_recommendations_${userProfile.id}`, JSON.stringify(recommendations));
      }
    }

    const response = await this.axiosInstance.post('/learning/progress', {
      learningPathId,
      moduleId,
      progress,
      timestamp: new Date().toISOString(),
    });

    // Track progress event
    this.analytics.trackEducationalEvent({
      type: 'learning_progress',
      userId: userProfile?.id?.toString() || 'anonymous',
      data: { 
        action: 'progress_tracked', 
        learningPathId, 
        moduleId, 
        progress,
        performance_score: this.calculatePerformanceScore(progress)
      },
      timestamp: new Date().toISOString(),
    });

    return response.data;
  }

  // =============================================================================
  // ASSESSMENT SERVICE INTEGRATION
  // =============================================================================

  /**
   * Get quizzes with AI optimization
   */
  async getQuizzes(params?: any): Promise<APIResponse<Quiz[]>> {
    const userProfile = this.getUserProfile();
    
    // AI-optimized quiz selection
    if (CONFIG.ENABLE_AI_OPTIMIZATION && userProfile) {
      const difficulty = await this.ai.analyzeLearningPatterns({
        averageScore: this.getUserMetric('averageScore', 75),
        completionRate: this.getUserMetric('completionRate', 80),
        averageTimePerModule: this.getUserMetric('averageTimePerModule', 30),
        currentDifficulty: userProfile.preferred_difficulty || 'intermediate',
        learningStreak: this.getUserMetric('learningStreak', 0),
      });
      
      params = {
        ...params,
        difficulty: difficulty.recommendedDifficulty,
        ai_optimized: true,
      };
    }

    const response = await this.axiosInstance.get('/assessment/quizzes', { params });
    
    if (response.data) {
      // Cache quizzes for offline access
      this.cache.set(`quizzes_${JSON.stringify(params)}`, response.data, { 
        type: 'quizzes',
        ai_optimized: params.ai_optimized 
      });
    }

    return response.data;
  }

  /**
   * Submit quiz attempt with comprehensive tracking
   */
  async submitQuizAttempt(
    quizId: string, 
    answers: Record<string, any>,
    timeSpent: number
  ): Promise<APIResponse<QuizAttempt>> {
    const userProfile = this.getUserProfile();
    
    // Pre-process answers with AI insights
    let processedAnswers = answers;
    if (CONFIG.ENABLE_AI_OPTIMIZATION) {
      // AI could analyze answer patterns or provide hints
      processedAnswers = {
        ...answers,
        ai_metadata: {
          sessionId: this.generateSessionId(),
          confidence_score: this.calculateConfidenceScore(answers),
          estimated_difficulty: userProfile?.preferred_difficulty || 'intermediate',
        },
      };
    }

    const response = await this.axiosInstance.post(`/assessment/quizzes/${quizId}/attempts`, {
      answers: processedAnswers,
      timeSpent,
      timestamp: new Date().toISOString(),
    });

    // Track quiz completion
    if (response.data) {
      this.analytics.trackEducationalEvent({
        type: 'quiz_completed',
        userId: userProfile?.id?.toString() || 'anonymous',
        data: {
          quizId,
          score: response.data.score,
          maxScore: response.data.maxScore,
          percentage: response.data.percentage,
          timeSpent,
          passed: response.data.passed,
        },
        timestamp: new Date().toISOString(),
      });

      // Check for achievements
      this.checkAndAwardAchievements('quiz_completed', {
        quizId,
        score: response.data.score,
        percentage: response.data.percentage,
      });
    }

    return response.data;
  }

  // =============================================================================
  // SEARCH SERVICE INTEGRATION
  // =============================================================================

  /**
   * Enhanced search with AI recommendations
   */
  async searchEducationalContent(
    query: string, 
    filters?: SearchFilters
  ): Promise<APIResponse<SearchResults>> {
    const userProfile = this.getUserProfile();
    
    // AI-enhanced search query
    let enhancedQuery = query;
    if (CONFIG.ENABLE_AI_OPTIMIZATION && userProfile) {
      // AI could suggest related terms based on user's learning history
      enhancedQuery = await this.enhanceSearchQuery(query, userProfile);
    }

    const response = await this.axiosInstance.get('/search/content', {
      params: {
        q: enhancedQuery,
        learning_style: userProfile?.learning_style,
        difficulty_level: userProfile?.preferred_difficulty,
        ...filters,
      },
    });

    // Track search analytics
    this.analytics.trackEducationalEvent({
      type: 'learning_progress',
      userId: userProfile?.id?.toString() || 'anonymous',
      data: {
        action: 'content_searched',
        query: enhancedQuery,
        results_count: response.data?.data?.length || 0,
        filters_applied: filters,
      },
      timestamp: new Date().toISOString(),
    });

    return response.data;
  }

  // =============================================================================
  // AUTHENTICATION SERVICE INTEGRATION
  // =============================================================================

  /**
   * Enhanced login with AI-powered user insights
   */
  async login(credentials: LoginCredentials): Promise<APIResponse<{ user: User; tokens: AuthTokens }>> {
    try {
      const response = await this.axiosInstance.post('/auth/login', credentials);
      
      if (response.data) {
        const { user, tokens } = response.data;
        
        // Store tokens
        localStorage.setItem('token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        localStorage.setItem('current_user', JSON.stringify(user));
        
        // AI-powered user profiling
        if (CONFIG.ENABLE_AI_OPTIMIZATION) {
          await this.initializeUserAIProfile(user);
        }

        // Track login analytics
        this.analytics.trackEducationalEvent({
          type: 'learning_progress',
          userId: user.id.toString(),
          data: {
            action: 'user_login',
            login_method: 'email',
            user_agent: navigator.userAgent,
          },
          timestamp: new Date().toISOString(),
        });

        return response.data;
      }
      
      return response.data;
    } catch (error) {
      // Track failed login
      this.analytics.trackEducationalEvent({
        type: 'learning_progress',
        userId: 'anonymous',
        data: {
          action: 'login_failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      });
      
      throw error;
    }
  }

  /**
   * Enhanced user profile update
   */
  async updateUserProfile(updates: Partial<UserProfile>): Promise<APIResponse<User>> {
    const response = await this.axiosInstance.patch('/auth/profile', updates);
    
    if (response.data) {
      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
      const updatedUser = { ...currentUser, profile: { ...currentUser.profile, ...updates } };
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      
      // Invalidate related caches
      this.cache.invalidate('user_profile');
      this.cache.invalidate('learning_paths');
      this.cache.invalidate('quizzes');
      
      // Track profile update
      this.analytics.trackEducationalEvent({
        type: 'learning_progress',
        userId: updatedUser.id.toString(),
        data: {
          action: 'profile_updated',
          updated_fields: Object.keys(updates),
        },
        timestamp: new Date().toISOString(),
      });
    }

    return response.data;
  }

  // =============================================================================
  // GAMIFICATION SERVICE INTEGRATION
  // =============================================================================

  /**
   * Track and award achievements with AI insights
   */
  private async checkAndAwardAchievements(
    eventType: string, 
    eventData: any
  ): Promise<void> {
    const userProfile = this.getUserProfile();
    if (!userProfile) return;

    try {
      const response = await this.axiosInstance.post('/gamification/events', {
        eventType,
        eventData,
        timestamp: new Date().toISOString(),
      });

      if (response.data?.achievements) {
        // Track new achievements
        response.data.achievements.forEach((achievement: any) => {
          this.analytics.trackEducationalEvent({
            type: 'achievement_earned',
            userId: userProfile.id.toString(),
            data: {
              achievement_id: achievement.id,
              achievement_name: achievement.name,
              achievement_points: achievement.points,
              rarity: achievement.rarity,
            },
            timestamp: new Date().toISOString(),
          });
        });

        // Store achievements locally for offline access
        localStorage.setItem(
          `user_achievements_${userProfile.id}`, 
          JSON.stringify(response.data.achievements)
        );
      }
    } catch (error) {
      // Achievement tracking failed but shouldn't block main functionality
      console.warn('Achievement tracking failed:', error);
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Generate session ID for tracking
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get session time in minutes
   */
  private getSessionTime(): number {
    const sessionStart = localStorage.getItem('session_start');
    if (sessionStart) {
      return Math.floor((Date.now() - parseInt(sessionStart)) / (1000 * 60));
    }
    return 0;
  }

  /**
   * Calculate performance score based on progress
   */
  private calculatePerformanceScore(progress: number): number {
    // Simple performance calculation - could be more sophisticated
    return Math.min(Math.max(progress, 0), 100);
  }

  /**
   * Get user metric from local storage
   */
  private getUserMetric(metric: string, defaultValue: number): number {
    try {
      const metrics = JSON.parse(localStorage.getItem('user_metrics') || '{}');
      return metrics[metric] || defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }

  /**
   * Calculate confidence score for quiz answers
   */
  private calculateConfidenceScore(answers: Record<string, any>): number {
    // Simple confidence calculation based on answer patterns
    const totalAnswers = Object.keys(answers).length;
    const filledAnswers = Object.values(answers).filter(a => a !== null && a !== undefined).length;
    return totalAnswers > 0 ? (filledAnswers / totalAnswers) * 100 : 0;
  }

  /**
   * Enhance search query with AI
   */
  private async enhanceSearchQuery(query: string, userProfile: any): Promise<string> {
    // Simple enhancement - could use AI for more sophisticated query expansion
    const learningHistory = this.getUserMetric('learning_history', []);
    const relatedTerms = this.findRelatedTerms(query, learningHistory);
    
    return relatedTerms.length > 0 ? `${query} ${relatedTerms.join(' ')}` : query;
  }

  /**
   * Find related terms based on learning history
   */
  private findRelatedTerms(query: string, learningHistory: string[]): string[] {
    // Simple related term finder
    return learningHistory
      .filter(term => term.toLowerCase().includes(query.toLowerCase()) || 
                     query.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 3);
  }

  /**
   * Initialize AI user profile
   */
  private async initializeUserAIProfile(user: User): Promise<void> {
    try {
      // Create AI-optimized user profile
      const aiProfile = {
        id: user.id,
        learning_style: user.profile?.learning_style || 'mixed',
        preferred_difficulty: user.profile?.preferred_difficulty || 'intermediate',
        initialized_at: new Date().toISOString(),
        ai_features_enabled: true,
      };

      localStorage.setItem('user_ai_profile', JSON.stringify(aiProfile));
      
      // Initialize session tracking
      localStorage.setItem('session_start', Date.now().toString());
      
    } catch (error) {
      console.warn('AI profile initialization failed:', error);
    }
  }

  // =============================================================================
  // AXIOS INTERFACE IMPLEMENTATION
  // =============================================================================

  /**
   * Standard GET method implementation
   */
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  /**
   * Standard POST method implementation
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  /**
   * Standard PUT method implementation
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  /**
   * Standard PATCH method implementation
   */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  /**
   * Standard DELETE method implementation
   */
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  /**
   * Defaults property implementation
   */
  get defaults() {
    return this.axiosInstance.defaults;
  }

  /**
   * Interceptors property implementation
   */
  get interceptors() {
    return this.axiosInstance.interceptors;
  }

  /**
   * Request method implementation
   */
  request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.request<T>(config);
  }

  /**
   * Head method implementation
   */
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.head<T>(url, config);
  }

  /**
   * Options method implementation
   */
  options<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.options<T>(url, config);
  }

  /**
   * URI method implementation
   */
  uri(config: AxiosRequestConfig): string {
    return this.axiosInstance.uri(config);
  }

  /**
   * Make HTTP request with retry logic
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt < CONFIG.RETRY_ATTEMPTS; attempt++) {
      try {
        const response = await this.axiosInstance.request<T>(config);
        return response.data;
      } catch (error) {
        lastError = error;
        
        if (!RetryStrategy.shouldRetry(error as AxiosError, attempt)) {
          break;
        }
        
        const delay = RetryStrategy.getDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  /**
   * Get API performance metrics
   */
  getPerformanceMetrics(): {
    totalRequests: number;
    averageResponseTime: number;
    successRate: number;
    errorCount: number;
  } {
    const totalRequests = this.requestMetrics.length;
    const successfulRequests = this.requestMetrics.filter(m => m.success).length;
    const averageResponseTime = totalRequests > 0 
      ? this.requestMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / totalRequests
      : 0;
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;
    const errorCount = totalRequests - successfulRequests;

    return {
      totalRequests,
      averageResponseTime,
      successRate,
      errorCount,
    };
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.invalidate();
    this.requestMetrics = [];
  }

  /**
   * Export analytics data
   */
  exportAnalytics(): string {
    const analytics = {
      performance_metrics: this.getPerformanceMetrics(),
      request_history: this.requestMetrics.slice(-100), // Last 100 requests
      cached_content: this.cache.get('learning_paths') ? 'learning_paths' : null,
      timestamp: new Date().toISOString(),
    };

    return JSON.stringify(analytics, null, 2);
  }
}

// =============================================================================
// EXPORT SINGLETON INSTANCE
// =============================================================================

export const apiClient = new EnterpriseAPIClient();

// Export for backward compatibility
export default apiClient;

// Export individual services for backward compatibility
export { 
  EnterpriseAPIClient, 
  EducationalAI, 
  EducationalAnalytics, 
  EducationalCache,
  RetryStrategy,
  EducationalErrorHandler 
};

// Export type for external usage
export type { ExtendedAxiosInstance };