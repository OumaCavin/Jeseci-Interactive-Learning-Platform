// JAC Learning Platform - Enhanced Learning Path Detail Component
// TypeScript utilities by Cavin Otieno

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  PlayIcon,
  CheckCircleIcon,
  LockClosedIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  ArrowLeftIcon,
  CalendarIcon,
  TrophyIcon,
  ChartBarIcon,
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  ChatBubbleLeftEllipsisIcon,
  EyeIcon,
  FireIcon,
  LightBulbIcon,
  ArrowRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid';
import { 
  learningService, 
  LearningPath, 
  Module, 
  ModuleProgress,
  LearningPathProgress 
} from '../../services/learningService';
import { toast } from 'react-hot-toast';

interface TabId {
  id: 'overview' | 'modules' | 'progress' | 'discussions' | 'resources';
}

const LearningPathDetail: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const navigate = useNavigate();
  
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [pathProgress, setPathProgress] = useState<LearningPathProgress | null>(null);
  const [relatedPaths, setRelatedPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId['id']>('overview');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    if (pathId) {
      loadLearningPathData();
      loadUserPreferences();
    }
  }, [pathId]);

  const loadLearningPathData = async () => {
    if (!pathId) return;
    
    try {
      setIsLoading(true);
      
      // Load all data concurrently
      const [pathData, modulesData, progressData, relatedData] = await Promise.all([
        learningService.getLearningPath(pathId),
        learningService.getModules(pathId),
        learningService.getPathProgress(pathId),
        learningService.getRelatedPaths(pathId)
      ]);
      
      setLearningPath(pathData);
      setModules(modulesData);
      setModuleProgress(progressData);
      setRelatedPaths(relatedData);
      
      // Calculate overall progress
      const completedModules = progressData.filter(p => p.status === 'completed').length;
      const totalTimeSpent = progressData.reduce((total, p) => total + p.time_spent, 0);
      const scores = progressData.filter(p => p.score !== undefined).map(p => p.score!);
      const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
      
      setPathProgress({
        overall_progress: modulesData.length > 0 ? (completedModules / modulesData.length) * 100 : 0,
        completed_modules: completedModules,
        total_modules: modulesData.length,
        time_spent: totalTimeSpent,
        average_score: averageScore,
        last_accessed: progressData[0]?.last_accessed || new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Failed to load learning path:', error);
      toast.error('Failed to load learning path');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserPreferences = () => {
    // Load from localStorage
    const favorites = localStorage.getItem('learning-favorites');
    const bookmarks = localStorage.getItem('learning-bookmarks');
    
    if (favorites && pathId) {
      const favoriteList = JSON.parse(favorites);
      setIsFavorited(favoriteList.includes(pathId));
    }
    
    if (bookmarks && pathId) {
      const bookmarkList = JSON.parse(bookmarks);
      setIsBookmarked(bookmarkList.includes(pathId));
    }
  };

  const handleFavorite = () => {
    if (!pathId) return;
    
    const favorites = JSON.parse(localStorage.getItem('learning-favorites') || '[]');
    let newFavorites;
    
    if (isFavorited) {
      newFavorites = favorites.filter((id: string) => id !== pathId);
      toast.success('Removed from favorites');
    } else {
      newFavorites = [...favorites, pathId];
      toast.success('Added to favorites');
    }
    
    localStorage.setItem('learning-favorites', JSON.stringify(newFavorites));
    setIsFavorited(!isFavorited);
  };

  const handleBookmark = () => {
    if (!pathId) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('learning-bookmarks') || '[]');
    let newBookmarks;
    
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id: string) => id !== pathId);
      toast.success('Removed from bookmarks');
    } else {
      newBookmarks = [...bookmarks, pathId];
      toast.success('Added to bookmarks');
    }
    
    localStorage.setItem('learning-bookmarks', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    const shareData = {
      title: learningPath?.title || 'Learning Path',
      text: `Check out this learning path: ${learningPath?.description}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
    setShowShareModal(false);
  };

  const getModuleProgress = (moduleId: number) => {
    return moduleProgress.find(p => p.id === moduleId);
  };

  const getModuleStatus = (module: Module) => {
    const progress = getModuleProgress(module.id);
    if (!progress) return 'not_started';
    
    // Check prerequisites
    const prerequisitesMet = module.prerequisites.every(prereqId => {
      const prereqProgress = getModuleProgress(prereqId);
      return prereqProgress?.status === 'completed';
    });
    
    if (!prerequisitesMet) return 'locked';
    return progress.status;
  };

  const isModuleUnlocked = (module: Module) => {
    if (module.prerequisites.length === 0) return true;
    return module.prerequisites.every(prereqId => {
      const prereqProgress = getModuleProgress(prereqId);
      return prereqProgress?.status === 'completed';
    });
  };

  const handleStartLearning = (moduleId: number) => {
    if (!pathId) return;
    navigate(`/learning-paths/${pathId}/modules/${moduleId}`);
  };

  const handleEnroll = async () => {
    if (!pathId) return;
    
    try {
      await learningService.enrollInPath(pathId);
      toast.success('Successfully enrolled in learning path!');
      // Reload data to reflect enrollment
      loadLearningPathData();
    } catch (error) {
      toast.error('Failed to enroll in learning path');
    }
  };

  const getModuleTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpenIcon className="w-5 h-5" />;
      case 'exercise': return <CodeBracketIcon className="w-5 h-5" />;
      case 'assessment': return <AcademicCapIcon className="w-5 h-5" />;
      default: return <BookOpenIcon className="w-5 h-5" />;
    }
  };

  const getModuleTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-100 text-blue-800';
      case 'exercise': return 'bg-green-100 text-green-800';
      case 'assessment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <PlayIcon className="w-5 h-5 text-blue-500" />;
      case 'locked': return <LockClosedIcon className="w-5 h-5 text-gray-400" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading learning path...</p>
        </div>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Learning Path Not Found</h1>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              The learning path you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/learning-paths" 
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Learning Paths
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/learning-paths" 
            className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Learning Paths
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(learningPath.difficulty_level)}`}>
                  {learningPath.difficulty_level.charAt(0).toUpperCase() + learningPath.difficulty_level.slice(1)}
                </span>
                
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{learningPath.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({learningPath.enrollment_count || 1200} learners)</span>
                </div>

                {learningPath.is_featured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <TrophyIcon className="w-3 h-3 mr-1" />
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {learningPath.title}
              </h1>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6 max-w-4xl">
                {learningPath.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleEnroll}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Start Learning
                </button>
                
                <button
                  onClick={handleFavorite}
                  className={`inline-flex items-center px-4 py-3 rounded-lg border transition-colors ${
                    isFavorited 
                      ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isFavorited ? (
                    <HeartIconSolid className="w-5 h-5 mr-2 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 mr-2" />
                  )}
                  {isFavorited ? 'Favorited' : 'Add to Favorites'}
                </button>
                
                <button
                  onClick={handleBookmark}
                  className={`inline-flex items-center px-4 py-3 rounded-lg border transition-colors ${
                    isBookmarked 
                      ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isBookmarked ? (
                    <BookmarkIconSolid className="w-5 h-5 mr-2 text-blue-500" />
                  ) : (
                    <BookmarkIcon className="w-5 h-5 mr-2" />
                  )}
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
                
                <button
                  onClick={() => setShowShareModal(true)}
                  className="inline-flex items-center px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ShareIcon className="w-5 h-5 mr-2" />
                  Share
                </button>
              </div>
            </div>
            
            {/* Progress Overview Card */}
            {pathProgress && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6 min-w-80 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Overall Progress</span>
                      <span className="font-semibold text-gray-900">{pathProgress.overall_progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pathProgress.overall_progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {pathProgress.completed_modules}
                      </div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.floor(pathProgress.time_spent / 60)}h {pathProgress.time_spent % 60}m
                      </div>
                      <div className="text-xs text-gray-500">Time Spent</div>
                    </div>
                  </div>
                  
                  {pathProgress.average_score > 0 && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600">Average Score</span>
                      <div className="flex items-center gap-1">
                        <TrophyIcon className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-gray-900">{pathProgress.average_score.toFixed(0)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8 bg-white rounded-t-xl">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: <BookOpenIcon className="w-4 h-4" /> },
              { id: 'modules', label: 'Modules', icon: <CodeBracketIcon className="w-4 h-4" /> },
              { id: 'progress', label: 'Progress', icon: <ChartBarIcon className="w-4 h-4" /> },
              { id: 'discussions', label: 'Discussions', icon: <ChatBubbleLeftEllipsisIcon className="w-4 h-4" /> },
              { id: 'resources', label: 'Resources', icon: <LightBulbIcon className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId['id'])}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-gray-200"
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* What You'll Learn */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                      What You'll Learn
                    </h3>
                    {learningPath.learning_objectives ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {learningPath.learning_objectives.map((objective, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">{objective}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Master fundamental JAC programming concepts',
                          'Build real-world applications with confidence',
                          'Understand object-oriented programming principles',
                          'Learn debugging and error handling techniques',
                          'Develop problem-solving skills',
                          'Create professional-quality code projects'
                        ].map((skill, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{skill}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Prerequisites */}
                  {learningPath.prerequisites && learningPath.prerequisites.length > 0 && (
                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <LightBulbIcon className="w-6 h-6 text-amber-600 mr-2" />
                        Prerequisites
                      </h3>
                      <div className="space-y-2">
                        {learningPath.prerequisites.map((prereq, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-600 rounded-full" />
                            <span className="text-gray-700">{prereq}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Course Structure */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Structure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600 mb-2">
                          {learningPath.modules_count}
                        </div>
                        <div className="text-sm text-gray-600">Total Modules</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-secondary-600 mb-2">
                          {Math.floor(learningPath.estimated_duration / 60)}h {learningPath.estimated_duration % 60}m
                        </div>
                        <div className="text-sm text-gray-600">Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {learningPath.rating.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {learningPath.tags && learningPath.tags.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Technologies Covered</h3>
                      <div className="flex flex-wrap gap-2">
                        {learningPath.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                          >
                            <CodeBracketIcon className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Ready to Start?</h3>
                    <p className="text-primary-100 mb-4 text-sm">
                      Begin your journey to master JAC programming with hands-on exercises
                    </p>
                    <button
                      onClick={() => {
                        const firstModule = modules.find(m => isModuleUnlocked(m));
                        if (firstModule) {
                          handleStartLearning(firstModule.id);
                        } else {
                          handleEnroll();
                        }
                      }}
                      className="w-full bg-white text-primary-600 font-semibold py-3 px-4 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      Continue Learning
                    </button>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {moduleProgress
                        .filter(p => p.last_accessed)
                        .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime())
                        .slice(0, 3)
                        .map((progress) => {
                          const module = modules.find(m => m.id === progress.id);
                          return (
                            <div key={progress.id} className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {module?.title || `Module ${progress.id}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(progress.last_accessed).toLocaleDateString()}
                                </p>
                              </div>
                              {progress.status === 'completed' && (
                                <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Related Learning Paths */}
                  {relatedPaths.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Paths</h3>
                      <div className="space-y-3">
                        {relatedPaths.slice(0, 3).map((path) => (
                          <Link
                            key={path.id}
                            to={`/learning-paths/${path.id}`}
                            className="block p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                          >
                            <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                              {path.title}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{path.modules_count} modules</span>
                              <div className="flex items-center gap-1">
                                <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                                {path.rating.toFixed(1)}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'modules' && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Modules</h2>
                  <p className="text-gray-600">
                    {modules.length} modules • {learningPath.estimated_duration} minutes total
                  </p>
                </div>
                
                <div className="space-y-4">
                  {modules.map((module, index) => {
                    const progress = getModuleProgress(module.id);
                    const status = getModuleStatus(module);
                    const unlocked = isModuleUnlocked(module);

                    return (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Module Number & Icon */}
                            <div className="flex-shrink-0">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                status === 'completed' ? 'bg-green-100' :
                                status === 'in_progress' ? 'bg-blue-100' :
                                unlocked ? 'bg-gray-100' : 'bg-gray-50'
                              }`}>
                                {getStatusIcon(status)}
                              </div>
                              <div className="text-center mt-2">
                                <span className="text-xs font-medium text-gray-500">Module {module.order_index}</span>
                              </div>
                            </div>

                            {/* Module Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className={`text-lg font-semibold ${
                                  !unlocked ? 'text-gray-400' : 'text-gray-900'
                                }`}>
                                  {module.title}
                                </h3>
                                
                                <div className="flex items-center gap-2 ml-4">
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getModuleTypeColor(module.module_type)}`}>
                                    {getModuleTypeIcon(module.module_type)}
                                    {module.module_type}
                                  </span>
                                </div>
                              </div>

                              <p className={`text-sm mb-4 ${
                                !unlocked ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {module.description}
                              </p>

                              <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-1">
                                  <ClockIcon className="w-4 h-4" />
                                  <span>{module.estimated_duration} min</span>
                                </div>
                                
                                {progress && (
                                  <>
                                    <div className="flex items-center gap-1">
                                      <UserGroupIcon className="w-4 h-4" />
                                      <span>{progress.attempts} attempts</span>
                                    </div>
                                    
                                    {progress.score && (
                                      <div className="flex items-center gap-1">
                                        <TrophyIcon className="w-4 h-4" />
                                        <span>{progress.score}% score</span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>

                              {/* Prerequisites */}
                              {module.prerequisites.length > 0 && !unlocked && (
                                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                  <p className="text-sm text-amber-800">
                                    <LockClosedIcon className="w-4 h-4 inline mr-1" />
                                    Complete previous modules to unlock
                                  </p>
                                </div>
                              )}

                              {/* Progress Bar */}
                              {progress && progress.status !== 'not_started' && (
                                <div className="mb-4">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ 
                                        width: progress.status === 'completed' ? '100%' : 
                                               progress.status === 'in_progress' ? '50%' : '0%' 
                                      }}
                                      transition={{ duration: 0.8, delay: index * 0.1 }}
                                      className={`h-2 rounded-full ${
                                        progress.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                                      }`}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Action Button */}
                              <motion.button
                                onClick={() => unlocked && handleStartLearning(module.id)}
                                disabled={!unlocked}
                                whileHover={{ scale: unlocked ? 1.02 : 1 }}
                                whileTap={{ scale: unlocked ? 0.98 : 1 }}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                  !unlocked
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : status === 'completed'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : status === 'in_progress'
                                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                    : 'bg-primary-600 text-white hover:bg-primary-700'
                                }`}
                              >
                                {status === 'completed' ? 'Review' :
                                 status === 'in_progress' ? 'Continue' :
                                 status === 'locked' ? 'Locked' : 'Start'}
                                {status !== 'locked' && <PlayIcon className="w-4 h-4" />}
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'progress' && pathProgress && (
              <div className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Progress</h2>
                  <p className="text-gray-600">
                    Track your learning journey and achievements
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Progress Stats */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Learning Statistics</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {pathProgress.completed_modules}
                        </div>
                        <div className="text-sm text-gray-600">Completed Modules</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {pathProgress.overall_progress.toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-600">Overall Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-1">
                          {Math.floor(pathProgress.time_spent / 60)}h {pathProgress.time_spent % 60}m
                        </div>
                        <div className="text-sm text-gray-600">Time Invested</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-1">
                          {pathProgress.average_score.toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-600">Average Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Module Progress Chart */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Module Progress</h3>
                    <div className="space-y-4">
                      {modules.map((module) => {
                        const progress = getModuleProgress(module.id);
                        const percentage = progress?.status === 'completed' ? 100 :
                                         progress?.status === 'in_progress' ? 50 : 0;
                        
                        return (
                          <div key={module.id} className="flex items-center gap-4">
                            <div className="w-12 text-sm text-gray-600 font-medium">
                              M{module.order_index}
                            </div>
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.8, delay: module.order_index * 0.1 }}
                                  className={`h-2 rounded-full ${
                                    progress?.status === 'completed' ? 'bg-green-500' :
                                    progress?.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="w-12 text-sm text-gray-600 text-right font-medium">
                              {percentage}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Achievement Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrophyIcon className="w-6 h-6 text-yellow-600 mr-2" />
                    Achievements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="font-semibold text-gray-900">First Steps</div>
                      <div className="text-sm text-gray-600">Started your learning journey</div>
                    </div>
                    {pathProgress.completed_modules >= 3 && (
                      <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                        <div className="text-2xl mb-2">🔥</div>
                        <div className="font-semibold text-gray-900">On Fire</div>
                        <div className="text-sm text-gray-600">Completed 3+ modules</div>
                      </div>
                    )}
                    {pathProgress.completed_modules >= modules.length && (
                      <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                        <div className="text-2xl mb-2">🏆</div>
                        <div className="font-semibold text-gray-900">Course Master</div>
                        <div className="text-sm text-gray-600">Completed entire course</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'discussions' && (
              <div className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Discussions</h2>
                  <p className="text-gray-600">
                    Connect with fellow learners and get help from instructors
                  </p>
                </div>
                
                <div className="text-center py-12">
                  <ChatBubbleLeftEllipsisIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Discussion Forum Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Join the conversation with other learners and instructors
                  </p>
                  <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Get Notified
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Resources</h2>
                  <p className="text-gray-600">
                    Download materials and access supplementary content
                  </p>
                </div>
                
                <div className="text-center py-12">
                  <LightBulbIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Resources Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Access supplementary materials, exercises, and reference guides
                  </p>
                  <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Notify Me
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Share Learning Path</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ShareIcon className="w-5 h-5 text-gray-600" />
                  <span>Copy Link</span>
                </button>
                
                {navigator.share && (
                  <button
                    onClick={() => {
                      navigator.share({
                        title: learningPath.title,
                        text: learningPath.description,
                        url: window.location.href
                      });
                      setShowShareModal(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <ShareIcon className="w-5 h-5 text-gray-600" />
                    <span>Share via System Dialog</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningPathDetail;