import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useSearchStore, SearchFilters, ContentTypeFacets } from '../../stores/searchStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface FilterOption {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  count?: number;
}

const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search store
  const {
    query,
    results,
    isLoading,
    totalResults,
    facets,
    filters,
    sortBy,
    searchHistory,
    setQuery,
    setFilters,
    setSortBy,
    performSearch,
    clearSearch,
    addToHistory
  } = useSearchStore();
  
  // Component state
  const [selectedFilters, setSelectedFilters] = useState<SearchFilters>(filters);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get query from URL params
  const urlQuery = searchParams.get('q') || '';
  
  // Update search when URL changes
  useEffect(() => {
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
      performSearch(urlQuery, selectedFilters);
    }
  }, [urlQuery, setQuery, performSearch]);
  
  // Filter options based on available content types
  const filterOptions: FilterOption[] = [
    {
      key: 'learning_path',
      label: 'Learning Paths',
      icon: BookOpenIcon,
      count: facets?.learning_path || 0
    },
    {
      key: 'module',
      label: 'Modules',
      icon: AcademicCapIcon,
      count: facets?.module || 0
    },
    {
      key: 'assessment',
      label: 'Assessments',
      icon: ChartBarIcon,
      count: facets?.assessment || 0
    },
    {
      key: 'knowledge_node',
      label: 'Knowledge Nodes',
      icon: AcademicCapIcon,
      count: facets?.knowledge_node || 0
    },
    {
      key: 'content',
      label: 'Content',
      icon: DocumentTextIcon,
      count: facets?.content || 0
    },
    {
      key: 'user',
      label: 'Users',
      icon: UserIcon,
      count: facets?.user || 0
    }
  ];
  
  // Handle filter toggle
  const toggleFilter = (filterType: 'contentTypes' | 'difficulties', filterKey: string) => {
    const newFilters = { ...selectedFilters };
    
    if (filterType === 'contentTypes') {
      const currentFilters = newFilters.contentTypes || [];
      newFilters.contentTypes = currentFilters.includes(filterKey)
        ? currentFilters.filter(f => f !== filterKey)
        : [...currentFilters, filterKey];
    } else {
      const currentFilters = newFilters.difficulties || [];
      newFilters.difficulties = currentFilters.includes(filterKey)
        ? currentFilters.filter(f => f !== filterKey)
        : [...currentFilters, filterKey];
    }
    
    setSelectedFilters(newFilters);
    setFilters(newFilters);
    
    // Re-search with filters
    if (query) {
      performSearch(query, newFilters);
    }
  };
  
  // Handle sort change
  const handleSortChange = (newSortBy: 'relevance' | 'popularity' | 'date') => {
    setSortBy(newSortBy);
  };
  
  // Sort results based on selected sort option
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity_score - a.popularity_score;
      case 'relevance':
        return b.relevance_score - a.relevance_score;
      default:
        return b.relevance_score - a.relevance_score;
    }
  });
  
  // Handle result click with analytics
  const handleResultClick = (result: any) => {
    // Track click analytics
    console.log(`Search click: ${query} -> ${result.url}`);
    navigate(result.url);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters: SearchFilters = {
      contentTypes: [],
      difficulties: [],
      minRating: 0,
      maxDuration: 0,
    };
    setSelectedFilters(clearedFilters);
    setFilters(clearedFilters);
    
    if (query) {
      performSearch(query, clearedFilters);
    }
  };
  
  // Get content type color
  const getContentTypeColor = (contentType: string) => {
    const colors: Record<string, string> = {
      learning_path: 'bg-blue-100 text-blue-800',
      module: 'bg-green-100 text-green-800',
      assessment: 'bg-purple-100 text-purple-800',
      knowledge_node: 'bg-indigo-100 text-indigo-800',
      content: 'bg-gray-100 text-gray-800',
      user: 'bg-orange-100 text-orange-800'
    };
    return colors[contentType] || 'bg-gray-100 text-gray-800';
  };
  
  // Highlight search terms in text
  const highlightSearchTerms = (text: string, searchQuery: string) => {
    if (!searchQuery) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  };
  
  // Format content type for display
  const formatContentType = (contentType: string) => {
    return contentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results
            </h1>
          </div>
          
          {/* Search Query */}
          {query && (
            <div className="mb-4">
              <p className="text-gray-600">
                Showing results for{' '}
                <span className="font-semibold text-gray-900">"{query}"</span>
                {totalResults > 0 && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({totalResults} results found)
                  </span>
                )}
              </p>
            </div>
          )}
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
              {(selectedFilters.contentTypes.length > 0 || selectedFilters.difficulties.length > 0) && (
                <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  {selectedFilters.contentTypes.length + selectedFilters.difficulties.length}
                </span>
              )}
            </button>
            
            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as 'relevance' | 'popularity' | 'date')}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="relevance">Relevance</option>
                <option value="popularity">Popularity</option>
                <option value="date">Date</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
          >
            {/* Content Types Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Content Types</h3>
                {(selectedFilters.contentTypes.length > 0 || selectedFilters.difficulties.length > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {filterOptions.map((filter) => {
                  const IconComponent = filter.icon;
                  const isSelected = selectedFilters.contentTypes?.includes(filter.key);
                  
                  return (
                    <button
                      key={filter.key}
                      onClick={() => toggleFilter('contentTypes', filter.key)}
                      className={`
                        flex items-center space-x-2 p-3 rounded-lg border-2 transition-all
                        ${isSelected 
                          ? 'border-primary-500 bg-primary-50 text-primary-700' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }
                      `}
                    >
                      <IconComponent className="h-5 w-5" />
                      <div className="text-left">
                        <div className="text-sm font-medium">{filter.label}</div>
                        {filter.count !== undefined && (
                          <div className="text-xs text-gray-500">
                            {filter.count} results
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Difficulty Filter */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Difficulty Level</h4>
              <div className="flex flex-wrap gap-2">
                {['beginner', 'intermediate', 'advanced'].map((difficulty) => {
                  const isSelected = selectedFilters.difficulties?.includes(difficulty);
                  return (
                    <button
                      key={difficulty}
                      onClick={() => toggleFilter('difficulties', difficulty)}
                      className={`
                        px-3 py-1 rounded-full text-sm font-medium transition-all capitalize
                        ${isSelected 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {difficulty}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Results */}
        <div className="space-y-4">
          {isLoading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <LoadingSpinner size="large" />
              <p className="text-gray-600 mt-4">Searching...</p>
            </div>
          )}
          
          {!isLoading && sortedResults.length === 0 && query && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any content matching your search for "{query}"
              </p>
              <div className="text-sm text-gray-500">
                <p className="mb-2">Try:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Checking your spelling</li>
                  <li>Using different or more general keywords</li>
                  <li>Removing some filters</li>
                  {searchHistory.length > 0 && (
                    <li>Looking at your search history</li>
                  )}
                </ul>
              </div>
            </div>
          )}
          
          {!isLoading && sortedResults.length > 0 && (
            <div className="space-y-4">
              {sortedResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Content Type Badge */}
                      <div className="flex-shrink-0 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContentTypeColor(result.content_type)}`}>
                          {formatContentType(result.content_type)}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                            <span dangerouslySetInnerHTML={{
                              __html: highlightSearchTerms(result.title, query)
                            }} />
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          <span dangerouslySetInnerHTML={{
                            __html: highlightSearchTerms(result.description, query)
                          }} />
                        </p>
                        
                        {/* Tags */}
                        {result.tags && result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {result.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                              >
                                {tag}
                              </span>
                            ))}
                            {result.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{result.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Metadata */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            {result.metadata.difficulty && (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(result.metadata.difficulty)}`}>
                                {result.metadata.difficulty}
                              </span>
                            )}
                            {result.metadata.type && (
                              <span className="capitalize">
                                {result.metadata.type}
                              </span>
                            )}
                            {result.metadata.estimated_hours && (
                              <span className="flex items-center">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {result.metadata.estimated_hours}h
                              </span>
                            )}
                            {result.metadata.author && (
                              <span className="flex items-center">
                                <UserIcon className="h-3 w-3 mr-1" />
                                {result.metadata.author}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {result.relevance_score > 0 && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {Math.round(result.relevance_score * 100)}% match
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;