/**
 * Search Service
 * Handles search operations, data management, and analytics
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Types
export interface SearchResult {
  id: string | number;
  title: string;
  description: string;
  content_type: 'course' | 'lesson' | 'quiz' | 'resource' | 'module';
  url: string;
  relevance_score?: number;
  metadata?: {
    duration?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
    thumbnail?: string;
  };
}

export interface SearchQuery {
  query: string;
  filters?: {
    content_type?: string[];
    difficulty?: string[];
    duration?: string[];
    tags?: string[];
  };
  sort_by?: 'relevance' | 'date' | 'popularity';
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  suggestions: string[];
  facets: {
    content_types: { [key: string]: number };
    difficulties: { [key: string]: number };
    tags: { [key: string]: number };
  };
  query_time: number;
}

export interface SearchAnalytics {
  query: string;
  results_count: number;
  clicked_result?: SearchResult;
  timestamp: Date;
  session_id: string;
}

// Mock data for development
const MOCK_RESULTS: SearchResult[] = [
  {
    id: '1',
    title: 'Introduction to JavaScript',
    description: 'Learn the fundamentals of JavaScript programming with hands-on exercises',
    content_type: 'course',
    url: '/courses/javascript-basics',
    relevance_score: 0.95,
    metadata: {
      duration: '2 hours',
      difficulty: 'beginner',
      tags: ['programming', 'web development', 'javascript']
    }
  },
  {
    id: '2',
    title: 'React Components Deep Dive',
    description: 'Master React components, props, state, and lifecycle methods',
    content_type: 'lesson',
    url: '/lessons/react-components',
    relevance_score: 0.88,
    metadata: {
      duration: '45 minutes',
      difficulty: 'intermediate',
      tags: ['react', 'components', 'frontend']
    }
  },
  {
    id: '3',
    title: 'Python Basics Quiz',
    description: 'Test your knowledge of Python fundamentals with this interactive quiz',
    content_type: 'quiz',
    url: '/quizzes/python-basics',
    relevance_score: 0.82,
    metadata: {
      duration: '15 minutes',
      difficulty: 'beginner',
      tags: ['python', 'programming', 'quiz']
    }
  }
];

class SearchService {
  private analyticsQueue: SearchAnalytics[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupPeriodicFlush();
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Perform a search query
   */
  async search(query: SearchQuery): Promise<SearchResponse> {
    try {
      // In development, return mock data
      if (process.env.NODE_ENV === 'development') {
        return this.getMockSearchResponse(query);
      }

      const response = await axios.post(`${API_BASE_URL}/search/`, query, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      // Fallback to mock data on error
      return this.getMockSearchResponse(query);
    }
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return this.getMockSuggestions(query, limit);
      }

      const response = await axios.get(`${API_BASE_URL}/search/suggestions/`, {
        params: { q: query, limit }
      });

      return response.data.suggestions;
    } catch (error) {
      console.error('Suggestions API error:', error);
      return this.getMockSuggestions(query, limit);
    }
  }

  /**
   * Get popular searches
   */
  async getPopularSearches(limit: number = 10): Promise<string[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return [
          'JavaScript Basics',
          'Python Fundamentals',
          'React Components',
          'HTML CSS',
          'Node.js',
          'Data Structures',
          'Machine Learning',
          'Web Development'
        ].slice(0, limit);
      }

      const response = await axios.get(`${API_BASE_URL}/search/popular/`, {
        params: { limit }
      });

      return response.data.searches;
    } catch (error) {
      console.error('Popular searches API error:', error);
      return [];
    }
  }

  /**
   * Get trending searches
   */
  async getTrendingSearches(limit: number = 10): Promise<string[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return [
          'Machine Learning',
          'Data Science',
          'Web Development',
          'React Hooks',
          'TypeScript',
          'Docker',
          'DevOps',
          'Cloud Computing'
        ].slice(0, limit);
      }

      const response = await axios.get(`${API_BASE_URL}/search/trending/`, {
        params: { limit }
      });

      return response.data.searches;
    } catch (error) {
      console.error('Trending searches API error:', error);
      return [];
    }
  }

  /**
   * Track search analytics
   */
  trackSearch(query: string, resultsCount: number): void {
    const analytics: SearchAnalytics = {
      query,
      results_count: resultsCount,
      timestamp: new Date(),
      session_id: this.sessionId
    };

    this.analyticsQueue.push(analytics);

    // Flush analytics periodically
    if (this.analyticsQueue.length >= 10) {
      this.flushAnalytics();
    }
  }

  /**
   * Track result click
   */
  trackResultClick(query: string, result: SearchResult): void {
    const analytics: SearchAnalytics = {
      query,
      results_count: 1,
      clicked_result: result,
      timestamp: new Date(),
      session_id: this.sessionId
    };

    this.analyticsQueue.push(analytics);

    if (this.analyticsQueue.length >= 5) {
      this.flushAnalytics();
    }
  }

  /**
   * Get search history for user
   */
  async getSearchHistory(limit: number = 10): Promise<string[]> {
    try {
      const history = localStorage.getItem('searchHistory');
      return history ? JSON.parse(history).slice(0, limit) : [];
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  /**
   * Add query to search history
   */
  addToHistory(query: string): void {
    try {
      this.getSearchHistory().then(history => {
        const newHistory = [query, ...history.filter((q: string) => q !== query)].slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      }).catch(error => {
        console.error('Error getting search history:', error);
      });
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  /**
   * Utility methods for UI
   */
  getContentTypeIcon(contentType: string): string {
    const icons: { [key: string]: string } = {
      'course': '📚',
      'lesson': '📖',
      'quiz': '❓',
      'resource': '📎',
      'module': '📋'
    };
    return icons[contentType] || '📄';
  }

  formatContentType(contentType: string): string {
    return contentType.charAt(0).toUpperCase() + contentType.slice(1);
  }

  highlightSearchTerms(text: string, query: string): string {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  }

  /**
   * Private methods
   */
  private getMockSearchResponse(query: SearchQuery): SearchResponse {
    const filteredResults = MOCK_RESULTS.filter(result =>
      result.title.toLowerCase().includes(query.query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.query.toLowerCase()) ||
      result.metadata?.tags?.some(tag => 
        tag.toLowerCase().includes(query.query.toLowerCase())
      )
    );

    return {
      results: filteredResults.slice(0, query.limit || 10),
      total: filteredResults.length,
      suggestions: this.getMockSuggestions(query.query, 5),
      facets: {
        content_types: {
          course: filteredResults.filter(r => r.content_type === 'course').length,
          lesson: filteredResults.filter(r => r.content_type === 'lesson').length,
          quiz: filteredResults.filter(r => r.content_type === 'quiz').length
        },
        difficulties: {
          beginner: filteredResults.filter(r => r.metadata?.difficulty === 'beginner').length,
          intermediate: filteredResults.filter(r => r.metadata?.difficulty === 'intermediate').length,
          advanced: filteredResults.filter(r => r.metadata?.difficulty === 'advanced').length
        },
        tags: {}
      },
      query_time: Math.random() * 100 + 50 // Mock query time
    };
  }

  private getMockSuggestions(query: string, limit: number): string[] {
    const allSuggestions = [
      `${query} tutorial`,
      `${query} course`,
      `${query} basics`,
      `${query} advanced`,
      `${query} examples`,
      `${query} projects`,
      `${query} certification`,
      `${query} interview questions`
    ];
    
    return allSuggestions
      .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit);
  }

  private setupPeriodicFlush(): void {
    // Flush analytics every 30 seconds
    setInterval(() => {
      if (this.analyticsQueue.length > 0) {
        this.flushAnalytics();
      }
    }, 30000);
  }

  private async flushAnalytics(): Promise<void> {
    if (this.analyticsQueue.length === 0) return;

    try {
      if (process.env.NODE_ENV === 'development') {
        // In development, just log analytics
        console.log('Search Analytics:', this.analyticsQueue);
      } else {
        await axios.post(`${API_BASE_URL}/search/analytics/`, {
          events: this.analyticsQueue
        });
      }
    } catch (error) {
      console.error('Failed to flush analytics:', error);
    } finally {
      this.analyticsQueue = [];
    }
  }
}

// Export singleton instance
const searchService = new SearchService();
export default searchService;