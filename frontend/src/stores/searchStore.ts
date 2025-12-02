import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  content_type: 'learning_path' | 'module' | 'assessment' | 'knowledge_node' | 'content' | 'user';
  relevance_score: number;
  popularity_score: number;
  tags: string[];
  metadata: {
    difficulty?: string;
    type?: string;
    estimated_hours?: number;
    author?: string;
    rating?: number;
    duration?: number;
  };
}

export interface ContentTypeFacets {
  learning_path: number;
  module: number;
  assessment: number;
  knowledge_node: number;
  content: number;
  user: number;
}

export interface SearchFilters {
  contentTypes: string[];
  difficulties: string[];
  minRating: number;
  maxDuration: number;
}

interface SearchState {
  // Search query and results
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  totalResults: number;
  facets: ContentTypeFacets;
  
  // Filters and sorting
  filters: SearchFilters;
  sortBy: 'relevance' | 'popularity' | 'date';
  
  // Search history
  searchHistory: string[];
  
  // Actions
  setQuery: (query: string) => void;
  setResults: (results: SearchResult[]) => void;
  setLoading: (isLoading: boolean) => void;
  setTotalResults: (total: number) => void;
  setFacets: (facets: ContentTypeFacets) => void;
  setFilters: (filters: SearchFilters) => void;
  setSortBy: (sortBy: 'relevance' | 'popularity' | 'date') => void;
  addToHistory: (query: string) => void;
  clearResults: () => void;
  performSearch: (query: string, filters?: SearchFilters) => Promise<void>;
  clearSearch: () => void;
}

const defaultFilters: SearchFilters = {
  contentTypes: [],
  difficulties: [],
  minRating: 0,
  maxDuration: 0,
};

const defaultFacets: ContentTypeFacets = {
  learning_path: 0,
  module: 0,
  assessment: 0,
  knowledge_node: 0,
  content: 0,
  user: 0,
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      // Initial state
      query: '',
      results: [],
      isLoading: false,
      totalResults: 0,
      facets: defaultFacets,
      filters: defaultFilters,
      sortBy: 'relevance',
      searchHistory: [],

      // Actions
      setQuery: (query: string) => set({ query }),
      
      setResults: (results: SearchResult[]) => set({ results }),
      
      setLoading: (isLoading: boolean) => set({ isLoading }),
      
      setTotalResults: (totalResults: number) => set({ totalResults }),
      
      setFacets: (facets: ContentTypeFacets) => set({ facets }),
      
      setFilters: (filters: SearchFilters) => set({ filters }),
      
      setSortBy: (sortBy) => set({ sortBy }),
      
      addToHistory: (query: string) => {
        const { searchHistory } = get();
        if (query && !searchHistory.includes(query)) {
          set({ searchHistory: [query, ...searchHistory.slice(0, 9)] }); // Keep last 10
        }
      },
      
      clearResults: () => set({ 
        results: [], 
        totalResults: 0, 
        facets: defaultFacets 
      }),
      
      clearSearch: () => set({
        query: '',
        results: [],
        totalResults: 0,
        facets: defaultFacets,
        filters: defaultFilters,
        sortBy: 'relevance'
      }),
      
      performSearch: async (query: string, filters = defaultFilters) => {
        set({ query, isLoading: true, filters });
        
        try {
          // Simulate API call - replace with actual API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock results for demonstration
          const mockResults: SearchResult[] = [
            {
              id: '1',
              title: `Introduction to ${query}`,
              description: `A comprehensive guide to understanding ${query} concepts and principles.`,
              url: '/learning-path/1',
              content_type: 'learning_path',
              relevance_score: 0.95,
              popularity_score: 8.7,
              tags: [query, 'beginner', 'fundamentals'],
              metadata: {
                difficulty: 'beginner',
                estimated_hours: 4,
                author: 'Dr. Smith'
              }
            },
            {
              id: '2',
              title: `${query} - Practical Exercises`,
              description: `Hands-on exercises and examples for ${query}.`,
              url: '/module/2',
              content_type: 'module',
              relevance_score: 0.88,
              popularity_score: 7.2,
              tags: [query, 'practice', 'exercises'],
              metadata: {
                difficulty: 'intermediate',
                estimated_hours: 2,
                author: 'Prof. Johnson'
              }
            },
            {
              id: '3',
              title: `${query} Assessment`,
              description: `Test your knowledge with this comprehensive assessment on ${query}.`,
              url: '/assessment/3',
              content_type: 'assessment',
              relevance_score: 0.82,
              popularity_score: 6.9,
              tags: [query, 'test', 'quiz'],
              metadata: {
                difficulty: 'advanced',
                estimated_hours: 1,
                author: 'Assessment Team'
              }
            }
          ];
          
          // Apply filters
          let filteredResults = mockResults;
          if (filters.contentTypes.length > 0) {
            filteredResults = filteredResults.filter(result => 
              filters.contentTypes.includes(result.content_type)
            );
          }
          if (filters.difficulties.length > 0) {
            filteredResults = filteredResults.filter(result => 
              result.metadata.difficulty && filters.difficulties.includes(result.metadata.difficulty)
            );
          }
          if (filters.minRating > 0) {
            filteredResults = filteredResults.filter(result => 
              (result.metadata.rating || 0) >= filters.minRating
            );
          }
          
          // Calculate facets
          const facets: ContentTypeFacets = {
            learning_path: mockResults.filter(r => r.content_type === 'learning_path').length,
            module: mockResults.filter(r => r.content_type === 'module').length,
            assessment: mockResults.filter(r => r.content_type === 'assessment').length,
            knowledge_node: mockResults.filter(r => r.content_type === 'knowledge_node').length,
            content: mockResults.filter(r => r.content_type === 'content').length,
            user: mockResults.filter(r => r.content_type === 'user').length,
          };
          
          // Add to history
          get().addToHistory(query);
          
          set({ 
            results: filteredResults,
            totalResults: filteredResults.length,
            facets,
            isLoading: false
          });
          
        } catch (error) {
          console.error('Search error:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'search-storage',
      partialize: (state) => ({ 
        searchHistory: state.searchHistory,
        filters: state.filters,
        sortBy: state.sortBy
      }),
    }
  )
);