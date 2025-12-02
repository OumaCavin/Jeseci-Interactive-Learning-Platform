import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Video, 
  FileText, 
  Code, 
  Star,
  Clock,
  User,
  Tag,
  ArrowRight,
  ChevronDown,
  X
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'lesson' | 'quiz' | 'video' | 'code' | 'article';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  rating: number;
  tags: string[];
  author: string;
  thumbnail?: string;
  matchScore: number;
  highlights: string[];
}

interface SearchFilters {
  type: string[];
  difficulty: string[];
  duration: { min: number; max: number };
  rating: number;
}

interface AdvancedSearchResultsProps {
  query: string;
  results: SearchResult[];
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onResultClick: (result: SearchResult) => void;
  isLoading?: boolean;
}

export const AdvancedSearchResults: React.FC<AdvancedSearchResultsProps> = ({
  query,
  results,
  filters,
  onFilterChange,
  onResultClick,
  isLoading = false
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'newest' | 'duration'>('relevance');

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="h-5 w-5" />;
      case 'quiz': return <FileText className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'code': return <Code className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-100 text-blue-700';
      case 'quiz': return 'bg-green-100 text-green-700';
      case 'video': return 'bg-red-100 text-red-700';
      case 'code': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredResults = React.useMemo(() => {
    let filtered = results;

    // Apply filters
    if (filters.type.length > 0) {
      filtered = filtered.filter(result => filters.type.includes(result.type));
    }

    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(result => filters.difficulty.includes(result.difficulty));
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(result => result.rating >= filters.rating);
    }

    filtered = filtered.filter(result => 
      result.duration >= filters.duration.min && result.duration <= filters.duration.max
    );

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.matchScore - a.matchScore; // Assuming newer content has better match score
        case 'duration':
          return a.duration - b.duration;
        default:
          return b.matchScore - a.matchScore;
      }
    });

    return filtered;
  }, [results, filters, sortBy]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const highlightText = (text: string, highlights: string[]) => {
    if (!highlights.length) return text;

    let highlightedText = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
      );
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Searching...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Search Results for "{query}"
            </h2>
            <p className="text-gray-600">
              {filteredResults.length} results found
            </p>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="relevance">Relevance</option>
            <option value="rating">Rating</option>
            <option value="newest">Newest</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-50 rounded-lg p-6 mb-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Content Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <div className="space-y-2">
                  {['lesson', 'quiz', 'video', 'code'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.type.includes(type)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...filters.type, type]
                            : filters.type.filter(t => t !== type);
                          onFilterChange({ ...filters, type: newTypes });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <div className="space-y-2">
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.difficulty.includes(level)}
                        onChange={(e) => {
                          const newLevels = e.target.checked
                            ? [...filters.difficulty, level]
                            : filters.difficulty.filter(d => d !== level);
                          onFilterChange({ ...filters, difficulty: newLevels });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={filters.duration.max}
                    onChange={(e) => {
                      onFilterChange({
                        ...filters,
                        duration: { ...filters.duration, max: parseInt(e.target.value) }
                      });
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>0</span>
                    <span>{filters.duration.max}min</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.rating}
                  onChange={(e) => {
                    onFilterChange({ ...filters, rating: parseFloat(e.target.value) });
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Any</span>
                  <span>{filters.rating}+ stars</span>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              {(filters.type.length > 0 || filters.difficulty.length > 0) && (
                <span className="text-sm text-gray-600">Active filters:</span>
              )}
              {[...filters.type, ...filters.difficulty].map(filter => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {filter}
                  <button
                    onClick={() => {
                      const newType = filters.type.filter(t => t !== filter);
                      const newDifficulty = filters.difficulty.filter(d => d !== filter);
                      onFilterChange({
                        ...filters,
                        type: newType,
                        difficulty: newDifficulty
                      });
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onResultClick(result)}
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail/Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(result.type)}`}>
                  {getResultIcon(result.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {highlightText(result.title, result.highlights)}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="h-4 w-4 text-yellow-400" />
                      {result.rating}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {highlightText(result.content.substring(0, 200) + '...', result.highlights)}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {result.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {result.duration} min
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(result.difficulty)}`}>
                      {result.difficulty}
                    </span>
                  </div>

                  {/* Tags */}
                  {result.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <div className="flex gap-2 flex-wrap">
                        {result.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
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
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0">
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};