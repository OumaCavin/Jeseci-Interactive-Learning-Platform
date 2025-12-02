// JAC Learning Platform - Enhanced Learning Paths Component
// TypeScript utilities by Cavin Otieno

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  PlayIcon,
  AcademicCapIcon,
  TrophyIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid';
import { learningService, LearningPath } from '../../services/learningService';
import { toast } from 'react-hot-toast';
import { useCallback } from 'react';

interface FilterOptions {
  difficulty: string[];
  search: string;
  sortBy: 'title' | 'rating' | 'duration' | 'modules' | 'enrollments';
  sortOrder: 'asc' | 'desc';
  featured?: boolean;
}

interface ViewOptions {
  type: 'grid' | 'list';
  showFeatured: boolean;
}

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800', bgColor: 'from-green-400 to-green-600' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800', bgColor: 'from-yellow-400 to-orange-500' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800', bgColor: 'from-red-400 to-red-600' },
];

// Mock learner count - in real app this would come from API
const LEARNER_COUNT = 1200;

// Featured tags for quick filtering
const POPULAR_TAGS = ['javascript', 'react', 'nodejs', 'typescript', 'css', 'fullstack'];

interface LearningPathCardProps {
  path: LearningPath;
  delay: number;
  viewType: 'grid' | 'list';
  onFavorite?: (pathId: string) => void;
  onBookmark?: (pathId: string) => void;
  isFavorited?: boolean;
  isBookmarked?: boolean;
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({
  path,
  delay,
  viewType,
  onFavorite,
  onBookmark,
  isFavorited = false,
  isBookmarked = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const difficultyConfig = DIFFICULTY_LEVELS.find(d => d.value === path.difficulty_level) || DIFFICULTY_LEVELS[0];

  if (viewType === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex">
          {/* Thumbnail */}
          <div className="w-48 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 relative overflow-hidden flex-shrink-0">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img
              src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop&crop=center`}
              alt={path.title}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                <PlayIcon className="h-6 w-6 text-primary-600" />
              </div>
            </div>

            {/* Difficulty Badge */}
            <div className="absolute top-2 left-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${difficultyConfig.color}`}>
                {difficultyConfig.label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {path.title}
                  </h3>
                  {path.is_featured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <TrophyIcon className="h-3 w-3 mr-1" />
                      Featured
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {path.description}
                </p>

                {/* Meta Information */}
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{Math.floor(path.estimated_duration / 60)}h {path.estimated_duration % 60}m</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpenIcon className="h-4 w-4" />
                    <span>{path.modules_count} modules</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{path.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UserGroupIcon className="h-4 w-4" />
                    <span>{path.enrollment_count?.toLocaleString() || '1.2k'} learners</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {path.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {path.tags.length > 4 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{path.tags.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onFavorite?.(path.id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  {isFavorited ? (
                    <HeartIconSolid className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                </button>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onBookmark?.(path.id);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {isBookmarked ? (
                    <BookmarkIconSolid className="h-5 w-5 text-blue-500" />
                  ) : (
                    <BookmarkIcon className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle share
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Action Button */}
            <Link to={`/learning-paths/${path.id}`} className="inline-block">
              <button className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors group/btn">
                <span>Start Learning</span>
                <ChevronRightIcon className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Learning Path Image */}
      <div className={`h-48 bg-gradient-to-br ${difficultyConfig.bgColor} relative overflow-hidden`}>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop&crop=center`}
          alt={path.title}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
            <PlayIcon className="h-6 w-6 text-primary-600" />
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyConfig.color}`}>
            {difficultyConfig.label}
          </span>
          {path.is_featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <TrophyIcon className="h-3 w-3 mr-1" />
              Featured
            </span>
          )}
        </div>
        
        {/* Rating and Actions */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-900">{path.rating.toFixed(1)}</span>
          </div>
          
          {/* Action Buttons */}
          <div className={`flex items-center space-x-1 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                onFavorite?.(path.id);
              }}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition-colors"
            >
              {isFavorited ? (
                <HeartIconSolid className="h-4 w-4 text-red-500" />
              ) : (
                <HeartIcon className="h-4 w-4" />
              )}
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                onBookmark?.(path.id);
              }}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-blue-500 transition-colors"
            >
              {isBookmarked ? (
                <BookmarkIconSolid className="h-4 w-4 text-blue-500" />
              ) : (
                <BookmarkIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors flex-1">
            {path.title}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {path.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {path.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
          {path.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              +{path.tags.length - 3}
            </span>
          )}
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-4 w-4" />
              <span>{Math.floor(path.estimated_duration / 60)}h {path.estimated_duration % 60}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpenIcon className="h-4 w-4" />
              <span>{path.modules_count}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <UserGroupIcon className="h-4 w-4" />
            <span>{(path.enrollment_count || LEARNER_COUNT) > 1000 
              ? `${((path.enrollment_count || LEARNER_COUNT) / 1000).toFixed(1)}k` 
              : (path.enrollment_count || LEARNER_COUNT).toLocaleString()} learners</span>
          </div>
        </div>

        {/* Completion Rate */}
        {path.completion_rate && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Completion Rate</span>
              <span>{path.completion_rate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${path.completion_rate}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link to={`/learning-paths/${path.id}`}>
          <button className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors group/btn">
            <span>Start Learning</span>
            <ChevronRightIcon className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
  popularTags: string[];
  onTagSelect: (tag: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
  popularTags,
  onTagSelect,
}) => {
  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={onToggle}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FunnelIcon className="h-4 w-4" />
          <span>Filters</span>
          {(filters.difficulty.length > 0 || filters.search) && (
            <span className="bg-primary-500 text-white rounded-full px-2 py-0.5 text-xs">Active</span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="lg:block lg:relative lg:inset-0 lg:bg-transparent overflow-hidden"
      >
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 lg:mb-0 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          
          {/* Featured Toggle */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.featured || false}
                onChange={(e) => onFiltersChange({ ...filters, featured: e.target.checked || undefined })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Featured Only</span>
              <TrophyIcon className="h-4 w-4 text-yellow-500 ml-1" />
            </label>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                placeholder="Search learning paths..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Popular Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Popular Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagSelect(tag)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-primary-100 hover:text-primary-800 transition-colors"
                >
                  <FireIcon className="h-3 w-3 mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div className="space-y-2">
              {DIFFICULTY_LEVELS.map((level) => (
                <label key={level.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.difficulty.includes(level.value)}
                    onChange={(e) => {
                      const newDifficulty = e.target.checked
                        ? [...filters.difficulty, level.value]
                        : filters.difficulty.filter(d => d !== level.value);
                      onFiltersChange({ ...filters, difficulty: newDifficulty });
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [FilterOptions['sortBy'], FilterOptions['sortOrder']];
                onFiltersChange({ ...filters, sortBy, sortOrder });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="rating-desc">Rating (High to Low)</option>
              <option value="rating-asc">Rating (Low to High)</option>
              <option value="duration-asc">Duration (Short to Long)</option>
              <option value="duration-desc">Duration (Long to Short)</option>
              <option value="modules-asc">Modules (Few to Many)</option>
              <option value="modules-desc">Modules (Many to Few)</option>
              <option value="enrollments-desc">Popularity (Most to Least)</option>
              <option value="enrollments-asc">Popularity (Least to Most)</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => onFiltersChange({
              difficulty: [],
              search: '',
              sortBy: 'title',
              sortOrder: 'asc',
              featured: undefined,
            })}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </motion.div>
    </>
  );
};

export const LearningPaths: React.FC = () => {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [filteredPaths, setFilteredPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [viewOptions, setViewOptions] = useState<ViewOptions>({
    type: 'grid',
    showFeatured: false,
  });
  const [filters, setFilters] = useState<FilterOptions>({
    difficulty: [],
    search: '',
    sortBy: 'title',
    sortOrder: 'asc',
    featured: undefined,
  });

  const applyFilters = useCallback(() => {
    let filtered = [...learningPaths];

    // Apply featured filter
    if (filters.featured !== undefined) {
      filtered = filtered.filter(path => path.is_featured === filters.featured);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(path =>
        path.title.toLowerCase().includes(searchLower) ||
        path.description.toLowerCase().includes(searchLower) ||
        path.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply difficulty filter
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(path =>
        filters.difficulty.includes(path.difficulty_level)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'duration':
          aValue = a.estimated_duration;
          bValue = b.estimated_duration;
          break;
        case 'modules':
          aValue = a.modules_count;
          bValue = b.modules_count;
          break;
        case 'enrollments':
          aValue = a.enrollment_count || 0;
          bValue = b.enrollment_count || 0;
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (typeof aValue === 'string') {
        return filters.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return filters.sortOrder === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
    });

    setFilteredPaths(filtered);
  }, [filters, learningPaths]);

  useEffect(() => {
    loadLearningPaths();
    
    // Load user preferences from localStorage
    const savedFavorites = localStorage.getItem('learning-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
    
    const savedBookmarks = localStorage.getItem('learning-bookmarks');
    if (savedBookmarks) {
      setBookmarks(new Set(JSON.parse(savedBookmarks)));
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, learningPaths, applyFilters]);

  const loadLearningPaths = async () => {
    try {
      setIsLoading(true);
      const paths = await learningService.getLearningPaths();
      setLearningPaths(paths);
    } catch (error) {
      console.error('Failed to load learning paths:', error);
      toast.error('Failed to load learning paths');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = (pathId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(pathId)) {
      newFavorites.delete(pathId);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(pathId);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
    localStorage.setItem('learning-favorites', JSON.stringify([...newFavorites]));
  };

  const handleBookmark = (pathId: string) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(pathId)) {
      newBookmarks.delete(pathId);
      toast.success('Removed from bookmarks');
    } else {
      newBookmarks.add(pathId);
      toast.success('Added to bookmarks');
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('learning-bookmarks', JSON.stringify([...newBookmarks]));
  };

  const handleTagSelect = (tag: string) => {
    setFilters(prev => ({ ...prev, search: tag }));
    setFiltersOpen(false); // Close mobile filters
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Paths</h1>
          <p className="text-gray-600 mt-2">
            Choose from curated learning paths designed to master JAC programming and modern development
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewOptions(prev => ({ ...prev, type: 'grid' }))}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewOptions.type === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewOptions(prev => ({ ...prev, type: 'list' }))}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewOptions.type === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>

          <span className="text-sm text-gray-500">
            {filteredPaths.length} of {learningPaths.length} paths
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Paths</p>
              <p className="text-2xl font-semibold text-gray-900">{learningPaths.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <TrophyIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Featured</p>
              <p className="text-2xl font-semibold text-gray-900">
                {learningPaths.filter(p => p.is_featured).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <HeartIcon className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Favorites</p>
              <p className="text-2xl font-semibold text-gray-900">{favorites.size}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <BookmarkIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Bookmarks</p>
              <p className="text-2xl font-semibold text-gray-900">{bookmarks.size}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
            popularTags={POPULAR_TAGS}
            onTagSelect={handleTagSelect}
          />
        </div>

        {/* Learning Paths Grid/List */}
        <div className="flex-1">
          {filteredPaths.length > 0 ? (
            <motion.div
              layout
              className={
                viewOptions.type === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredPaths.map((path, index) => (
                <LearningPathCard
                  key={path.id}
                  path={path}
                  delay={index * 0.1}
                  viewType={viewOptions.type}
                  onFavorite={handleFavorite}
                  onBookmark={handleBookmark}
                  isFavorited={favorites.has(path.id)}
                  isBookmarked={bookmarks.has(path.id)}
                />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No learning paths found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => setFilters({
                  difficulty: [],
                  search: '',
                  sortBy: 'title',
                  sortOrder: 'asc',
                  featured: undefined,
                })}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPaths;