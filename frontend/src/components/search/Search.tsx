/**
 * Search Component
 * Comprehensive search interface with autocomplete and results display
 * Adapted for Zustand state management
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ClockIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { useSearchStore } from '../../stores/searchStore';
import { useLearningStore } from '../../stores/learningStore';

// Search Component Props
interface SearchProps {
  className?: string;
  placeholder?: string;
  onResultClick?: (result: any) => void;
  showResults?: boolean;
  fullWidth?: boolean;
  navigateToResults?: boolean; // If true, navigate to SearchResultsPage on enter
}

// Mock search data and types
interface SearchResult {
  id: string;
  title: string;
  description: string;
  content_type: string;
  url: string;
  relevance_score?: number;
}

interface SearchState {
  query: string;
  results: SearchResult[];
  suggestions: string[];
  history: string[];
  popularSearches: string[];
  trendingSearches: string[];
  isLoading: boolean;
  showSuggestions: boolean;
}

// Mock search service
class MockSearchService {
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
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  }
}

const searchService = new MockSearchService();

// Main Search Component
export const Search: React.FC<SearchProps> = ({
  className = '',
  placeholder = 'Search learning paths, modules...',
  onResultClick,
  showResults = true,
  fullWidth = false,
  navigateToResults = false
}) => {
  const navigate = useNavigate();
  const { setQuery, performSearch, searchHistory, addToHistory } = useSearchStore();
  
  // Component state
  const [localQuery, setLocalQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    suggestions: [],
    history: searchHistory,
    popularSearches: ['JavaScript Basics', 'Python Fundamentals', 'React Components'],
    trendingSearches: ['Machine Learning', 'Data Science', 'Web Development'],
    isLoading: false,
    showSuggestions: false
  });
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Mock search function
  const performMockSearch = useCallback((query: string) => {
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: `Introduction to ${query}`,
        description: `Learn the fundamentals of ${query} with our comprehensive course`,
        content_type: 'course',
        url: '/course/intro-to-' + query.toLowerCase().replace(/\s+/g, '-')
      },
      {
        id: '2',
        title: `${query} - Advanced Techniques`,
        description: `Master advanced ${query} concepts and best practices`,
        content_type: 'lesson',
        url: '/lesson/' + query.toLowerCase().replace(/\s+/g, '-') + '-advanced'
      },
      {
        id: '3',
        title: `${query} Quiz`,
        description: `Test your knowledge with our interactive ${query} quiz`,
        content_type: 'quiz',
        url: '/quiz/' + query.toLowerCase().replace(/\s+/g, '-')
      }
    ];
    return mockResults;
  }, []);
  
  // Mock suggestions based on input
  const getMockSuggestions = useCallback((query: string) => {
    const allSuggestions = [
      `${query} tutorial`,
      `${query} course`,
      `${query} basics`,
      `${query} advanced`,
      `${query} examples`,
      `${query} projects`
    ];
    return allSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, []);
  
  // Handle input change with debounced suggestions
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalQuery(query);
    setSearchState(prev => ({ ...prev, query }));
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Fetch suggestions for non-empty queries
    if (query.trim().length >= 2) {
      const suggestions = getMockSuggestions(query);
      setSearchState(prev => ({ 
        ...prev, 
        suggestions,
        showSuggestions: true 
      }));
      setShowDropdown(true);
    } else {
      setSearchState(prev => ({ 
        ...prev, 
        suggestions: [],
        showSuggestions: false 
      }));
      setShowDropdown(false);
    }
    
    // Debounced search
    if (query.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        setSearchState(prev => ({ ...prev, isLoading: true }));
        
        // Simulate API delay
        setTimeout(() => {
          const results = performMockSearch(query);
          setSearchState(prev => ({ 
            ...prev, 
            results,
            isLoading: false 
          }));
        }, 300);
      }, 300);
    }
  }, [getMockSuggestions, performMockSearch]);
  
  // Handle key navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown && !searchState.showSuggestions) return;
    
    const totalItems = searchState.suggestions.length + searchState.history.length + searchState.popularSearches.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const item = getItemAtIndex(selectedIndex);
          if (item) {
            handleItemClick(item.type, item.value);
          }
        } else {
          handleSearch(localQuery);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  }, [selectedIndex, searchState.suggestions, searchState.history, searchState.popularSearches, localQuery]);
  
  // Handle search submission
  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    
    // Add to search history in the store
    addToHistory(query);
    
    // Update local state
    setSearchState(prev => ({ 
      ...prev, 
      query: query
    }));
    
    // Navigate to SearchResultsPage if navigateToResults is true
    if (navigateToResults) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      return;
    }
    
    // Perform local search if not navigating to results page
    const results = performMockSearch(query);
    setSearchState(prev => ({ 
      ...prev, 
      results,
      isLoading: false 
    }));
    
    // Close dropdown
    setShowDropdown(false);
    setSelectedIndex(-1);
    
    // Call optional callback
    if (onResultClick) {
      onResultClick({ query, type: 'search' });
    }
  }, [performMockSearch, navigate, onResultClick, navigateToResults, addToHistory]);
  
  // Handle dropdown item click
  const handleItemClick = useCallback((type: string, value: string) => {
    switch (type) {
      case 'suggestion':
      case 'history':
      case 'popular':
        setLocalQuery(value);
        setSearchState(prev => ({ ...prev, query: value }));
        handleSearch(value);
        break;
      case 'result':
        // Handle result click
        if (onResultClick) {
          onResultClick({ type: 'result', value });
        }
        break;
    }
  }, [handleSearch, onResultClick]);
  
  // Handle result click
  const handleResultClick = useCallback((result: SearchResult) => {
    // Track result click (analytics)
    console.log('Result clicked:', result);
    
    if (onResultClick) {
      onResultClick(result);
    } else {
      navigate(result.url);
    }
  }, [onResultClick, navigate]);
  
  // Get item at index for keyboard navigation
  const getItemAtIndex = (index: number) => {
    if (index < searchState.suggestions.length) {
      return { type: 'suggestion', value: searchState.suggestions[index] };
    }
    
    const historyStart = searchState.suggestions.length;
    if (index < historyStart + searchState.history.length) {
      return { type: 'history', value: searchState.history[index - historyStart] };
    }
    
    const popularStart = historyStart + searchState.history.length;
    if (index < popularStart + searchState.popularSearches.length) {
      return { type: 'popular', value: searchState.popularSearches[index - popularStart] };
    }
    
    return null;
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'max-w-lg'} ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={searchInputRef}
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (localQuery.trim()) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder}
          className={`
            block w-full border-0 py-0 pl-10 pr-12 text-gray-900 placeholder:text-gray-400 
            focus:ring-0 sm:text-sm bg-white rounded-md shadow-sm border border-gray-200
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20
            transition-all duration-200
          `}
        />
        
        {/* Clear button */}
        {localQuery && (
          <button
            type="button"
            onClick={() => {
              setLocalQuery('');
              setSearchState(prev => ({ ...prev, query: '', results: [] }));
              setShowDropdown(false);
              searchInputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
          >
            {/* Loading indicator */}
            {searchState.isLoading && (
              <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                Searching...
              </div>
            )}
            
            {/* Search Results */}
            {showResults && searchState.results.length > 0 && (
              <div className="p-2">
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Results ({searchState.results.length})
                </div>
                {searchState.results.slice(0, 5).map((result, index) => (
                  <button
                    key={`result-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className={`
                      w-full text-left px-3 py-2 text-sm rounded-md transition-colors
                      hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                      ${selectedIndex === index ? 'bg-gray-50' : ''}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{searchService.getContentTypeIcon(result.content_type)}</span>
                      <div className="flex-1 min-w-0">
                        <p 
                          className="font-medium text-gray-900 truncate"
                          dangerouslySetInnerHTML={{
                            __html: searchService.highlightSearchTerms(result.title, localQuery)
                          }}
                        />
                        <p 
                          className="text-gray-500 text-xs truncate"
                          dangerouslySetInnerHTML={{
                            __html: searchService.highlightSearchTerms(result.description, localQuery)
                          }}
                        />
                        <span className="text-xs text-gray-400">
                          {searchService.formatContentType(result.content_type)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Search Suggestions */}
            {!searchState.isLoading && (searchState.suggestions.length > 0 || searchState.history.length > 0 || searchState.popularSearches.length > 0) && (
              <div className="p-2 border-t border-gray-100">
                {/* Suggestions */}
                {searchState.suggestions.length > 0 && (
                  <div className="mb-3">
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                      <FireIcon className="h-3 w-3 mr-1" />
                      Suggestions
                    </div>
                    {searchState.suggestions.map((suggestion, index) => (
                      <button
                        key={`suggestion-${index}`}
                        onClick={() => handleItemClick('suggestion', suggestion)}
                        className={`
                          w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md transition-colors
                          hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                          ${selectedIndex === index ? 'bg-gray-50' : ''}
                        `}
                      >
                        <div className="flex items-center">
                          <MagnifyingGlassIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span dangerouslySetInnerHTML={{
                            __html: searchService.highlightSearchTerms(suggestion, localQuery)
                          }} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Search History */}
                {searchState.history.length > 0 && (
                  <div className="mb-3">
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      Recent
                    </div>
                    {searchState.history.slice(0, 3).map((historyItem, index) => {
                      const historyIndex = searchState.suggestions.length + index;
                      return (
                        <button
                          key={`history-${index}`}
                          onClick={() => handleItemClick('history', historyItem)}
                          className={`
                            w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md transition-colors
                            hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                            ${selectedIndex === historyIndex ? 'bg-gray-50' : ''}
                          `}
                        >
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {historyItem}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {/* Popular Searches */}
                {searchState.popularSearches.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                      <TrendingUpIcon className="h-3 w-3 mr-1" />
                      Popular
                    </div>
                    {searchState.popularSearches.slice(0, 3).map((popularItem, index) => {
                      const popularIndex = searchState.suggestions.length + searchState.history.length + index;
                      return (
                        <button
                          key={`popular-${index}`}
                          onClick={() => handleItemClick('popular', popularItem)}
                          className={`
                            w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md transition-colors
                            hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                            ${selectedIndex === popularIndex ? 'bg-gray-50' : ''}
                          `}
                        >
                          <div className="flex items-center">
                            <TrendingUpIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {popularItem}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* No results */}
            {!searchState.isLoading && !searchState.results.length && !searchState.suggestions.length && localQuery.trim() && (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No results found for "{localQuery}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;