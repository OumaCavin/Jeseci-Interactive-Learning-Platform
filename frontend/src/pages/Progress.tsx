import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartPieIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import { useUserStatsStore } from '../stores/userStatsStore';
import { useLearningStore } from '../stores/learningStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface LearningPath {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  totalModules: number;
  completedModules: number;
  progressPercentage: number;
  timeSpent: string;
  startedAt: string;
  lastActivity: string;
  estimatedCompletion: string;
  averageScore: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
}

interface Module {
  id: string;
  title: string;
  learningPath: string;
  order: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  progressPercentage: number;
  timeSpent: string;
  quizScore?: number;
  codingScore?: number;
  overallScore?: number;
  lastAccessed: string;
  completedAt?: string;
}

interface WeeklyActivity {
  date: string;
  modules: number;
  timeSpent: number;
  score: number;
  streak: boolean;
}

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProgressTabs: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'paths', label: 'Learning Paths', icon: AcademicCapIcon },
    { id: 'modules', label: 'Modules', icon: BookOpenIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartPieIcon },
  ];

  return (
    <div className="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-lg p-1 mb-8">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isActive
                ? 'text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/5'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-lg border border-white/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

const OverviewTab: React.FC = () => {
  const { user } = useAuthStore();
  const { statistics, achievements, isLoading } = useUserStatsStore();

  if (!user) return null;

  const getOverallProgress = () => {
    // Estimate based on completed modules
    const totalEstimated = Math.max(user.completed_modules * 2, 50);
    return Math.round((user.completed_modules / totalEstimated) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-400 to-green-600';
    if (percentage >= 60) return 'from-blue-400 to-blue-600';
    if (percentage >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const weeklyActivity: WeeklyActivity[] = [
    { date: 'Mon', modules: 2, timeSpent: 45, score: 88, streak: true },
    { date: 'Tue', modules: 1, timeSpent: 25, score: 92, streak: true },
    { date: 'Wed', modules: 3, timeSpent: 60, score: 85, streak: true },
    { date: 'Thu', modules: 1, timeSpent: 30, score: 90, streak: true },
    { date: 'Fri', modules: 2, timeSpent: 50, score: 87, streak: true },
    { date: 'Sat', modules: 0, timeSpent: 0, score: 0, streak: false },
    { date: 'Sun', modules: 1, timeSpent: 20, score: 89, streak: true }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Progress Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-800">{getOverallProgress()}%</p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(getOverallProgress())}`}
                style={{ width: `${getOverallProgress()}%` }}
              />
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Current Streak</p>
              <p className="text-2xl font-bold text-orange-500">{user.current_streak} days</p>
            </div>
            <div className="text-3xl">🔥</div>
          </div>
          <p className="text-gray-600 text-xs mt-2">Longest: {user.longest_streak} days</p>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Modules Completed</p>
              <p className="text-2xl font-bold text-green-500">{user.completed_modules}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
          <p className="text-gray-600 text-xs mt-2">Total points: {user.total_points}</p>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Level {user.level}</p>
              <p className="text-2xl font-bold text-purple-500">{user.total_points} pts</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
          <p className="text-gray-600 text-xs mt-2">Experience: {user.experience_level}</p>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Weekly Activity</h3>
        <div className="grid grid-cols-7 gap-2">
          {weeklyActivity.map((day, index) => (
            <div key={day.date} className="text-center">
              <p className="text-xs text-gray-600 mb-2">{day.date}</p>
              <div className="space-y-1">
                <div className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-white text-sm font-medium"
                     style={{ backgroundColor: day.streak ? '#10B981' : '#6B7280' }}>
                  {day.modules}
                </div>
                <p className="text-xs text-gray-500">{day.timeSpent}m</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Goal Progress */}
        <Card variant="glass" className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Weekly Goal Progress</h4>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Modules this week</span>
            <span className="text-gray-800 font-semibold">{user.weekly_progress || 0} / {user.weekly_goal || 10}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(((user.weekly_progress || 0) / (user.weekly_goal || 10)) * 100)}`}
              style={{ width: `${((user.weekly_progress || 0) / (user.weekly_goal || 10)) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {(((user.weekly_progress || 0) / (user.weekly_goal || 10)) * 100).toFixed(0)}% Complete
          </p>
        </Card>

        {/* Recent Achievements */}
        <Card variant="glass" className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Achievements</h4>
          <div className="space-y-3">
            {achievements.slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">{achievement.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{achievement.name}</p>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

const LearningPathsTab: React.FC = () => {
  // Mock learning paths data - in real app, this would come from API
  const learningPaths: LearningPath[] = [
    {
      id: '1',
      name: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming language',
      difficulty: 'beginner',
      totalModules: 12,
      completedModules: 8,
      progressPercentage: 67,
      timeSpent: '4h 30m',
      startedAt: '2025-11-01',
      lastActivity: '2025-11-23',
      estimatedCompletion: '2025-12-15',
      averageScore: 87,
      status: 'in_progress'
    },
    {
      id: '2',
      name: 'Advanced React Patterns',
      description: 'Master advanced React concepts and patterns',
      difficulty: 'advanced',
      totalModules: 15,
      completedModules: 3,
      progressPercentage: 20,
      timeSpent: '2h 15m',
      startedAt: '2025-11-20',
      lastActivity: '2025-11-22',
      estimatedCompletion: '2026-01-30',
      averageScore: 92,
      status: 'in_progress'
    },
    {
      id: '3',
      name: 'Python Basics',
      description: 'Introduction to Python programming',
      difficulty: 'beginner',
      totalModules: 10,
      completedModules: 10,
      progressPercentage: 100,
      timeSpent: '6h 45m',
      startedAt: '2025-10-15',
      lastActivity: '2025-11-10',
      estimatedCompletion: 'Completed',
      averageScore: 94,
      status: 'completed'
    }
  ];

  const difficultyColors = {
    beginner: 'from-green-400 to-green-600',
    intermediate: 'from-yellow-400 to-yellow-600',
    advanced: 'from-red-400 to-red-600'
  };

  const statusColors = {
    completed: 'text-green-600',
    in_progress: 'text-blue-600',
    not_started: 'text-gray-400',
    paused: 'text-yellow-600',
    skipped: 'text-gray-500'
  };

  const statusLabels = {
    completed: 'Completed',
    in_progress: 'In Progress',
    not_started: 'Not Started',
    paused: 'Paused',
    skipped: 'Skipped'
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-400 to-green-600';
    if (percentage >= 60) return 'from-blue-400 to-blue-600';
    if (percentage >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {learningPaths.map((path, index) => (
        <motion.div
          key={path.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card variant="glass" className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{path.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${difficultyColors[path.difficulty]} text-white`}>
                    {path.difficulty.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[path.status]} bg-gray-100`}>
                    {statusLabels[path.status]}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{path.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Progress:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(path.progressPercentage)}`}
                          style={{ width: `${path.progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-gray-800 font-medium">{path.progressPercentage}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Modules:</span>
                    <p className="text-gray-800 font-medium">{path.completedModules} / {path.totalModules}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Time Spent:</span>
                    <p className="text-gray-800 font-medium">{path.timeSpent}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Average Score:</span>
                    <p className="text-gray-800 font-medium">{path.averageScore}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p>Started: {new Date(path.startedAt).toLocaleDateString()}</p>
                <p>Last activity: {new Date(path.lastActivity).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  <p>Est. completion: {path.estimatedCompletion}</p>
                </div>
                <Button
                  variant={path.status === 'completed' ? 'ghost' : 'primary'}
                  size="sm"
                >
                  {path.status === 'completed' ? 'Review' : 
                   path.status === 'in_progress' ? 'Continue' : 'Start'}
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

const ModulesTab: React.FC = () => {
  // Mock modules data - in real app, this would come from API
  const modules: Module[] = [
    {
      id: '1',
      title: 'Variables and Data Types',
      learningPath: 'JavaScript Fundamentals',
      order: 1,
      status: 'completed',
      progressPercentage: 100,
      timeSpent: '25m',
      quizScore: 95,
      codingScore: 88,
      overallScore: 92,
      lastAccessed: '2025-11-15',
      completedAt: '2025-11-15'
    },
    {
      id: '2',
      title: 'Control Structures',
      learningPath: 'JavaScript Fundamentals',
      order: 2,
      status: 'completed',
      progressPercentage: 100,
      timeSpent: '35m',
      quizScore: 90,
      codingScore: 85,
      overallScore: 88,
      lastAccessed: '2025-11-17',
      completedAt: '2025-11-17'
    },
    {
      id: '3',
      title: 'Functions and Methods',
      learningPath: 'JavaScript Fundamentals',
      order: 3,
      status: 'in_progress',
      progressPercentage: 65,
      timeSpent: '20m',
      quizScore: 85,
      codingScore: 78,
      overallScore: 82,
      lastAccessed: '2025-11-23'
    },
    {
      id: '4',
      title: 'Object-Oriented Programming',
      learningPath: 'JavaScript Fundamentals',
      order: 4,
      status: 'not_started',
      progressPercentage: 0,
      timeSpent: '0m',
      lastAccessed: 'Never'
    },
    {
      id: '5',
      title: 'Error Handling',
      learningPath: 'JavaScript Fundamentals',
      order: 5,
      status: 'not_started',
      progressPercentage: 0,
      timeSpent: '0m',
      lastAccessed: 'Never'
    }
  ];

  const statusColors = {
    completed: 'text-green-600',
    in_progress: 'text-blue-600',
    not_started: 'text-gray-400',
    paused: 'text-yellow-600',
    skipped: 'text-gray-500'
  };

  const statusLabels = {
    completed: 'Completed',
    in_progress: 'In Progress',
    not_started: 'Not Started',
    paused: 'Paused',
    skipped: 'Skipped'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '🔄';
      case 'skipped': return '⏭️';
      default: return '⭕';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-400 to-green-600';
    if (percentage >= 60) return 'from-blue-400 to-blue-600';
    if (percentage >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {modules.map((module, index) => (
        <motion.div
          key={module.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card variant="glass" className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {getStatusIcon(module.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="text-gray-800 font-medium">{module.title}</h4>
                    <span className="text-xs text-gray-600">{module.learningPath}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[module.status]} bg-gray-100`}>
                      {statusLabels[module.status]}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Order: {module.order}</span>
                    <span>Time: {module.timeSpent}</span>
                    {module.overallScore && <span>Score: {module.overallScore}%</span>}
                    <span>Last accessed: {module.lastAccessed}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {module.status !== 'not_started' && (
                  <div className="text-right">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(module.progressPercentage)}`}
                        style={{ width: `${module.progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">{module.progressPercentage}%</span>
                  </div>
                )}
                
                <Button
                  variant={module.status === 'not_started' ? 'primary' : 'ghost'}
                  size="sm"
                >
                  {module.status === 'not_started' ? 'Start' : 
                   module.status === 'in_progress' ? 'Continue' : 'Review'}
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            
            {module.status === 'in_progress' && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {module.quizScore && (
                    <div>
                      <span className="text-gray-600">Quiz Score:</span>
                      <span className="text-gray-800 ml-2">{module.quizScore}%</span>
                    </div>
                  )}
                  {module.codingScore && (
                    <div>
                      <span className="text-gray-600">Coding Score:</span>
                      <span className="text-gray-800 ml-2">{module.codingScore}%</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Completion Date:</span>
                    <span className="text-gray-800 ml-2">
                      {module.completedAt ? new Date(module.completedAt).toLocaleDateString() : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

const AnalyticsTab: React.FC = () => {
  const { user } = useAuthStore();
  const { statistics } = useUserStatsStore();

  if (!user || !statistics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Learning Streaks - Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" className="p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Learning Streaks</h4>
          <div className="flex justify-center items-center h-32">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">{user.current_streak}</div>
              <div className="text-gray-600 text-sm">Current Streak</div>
              <div className="text-2xl font-bold text-gray-800 mt-2">{user.longest_streak}</div>
              <div className="text-gray-600 text-sm">Longest Streak</div>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed Modules</span>
              <span className="text-gray-800 font-semibold">{user.completed_modules}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Points</span>
              <span className="text-gray-800 font-semibold">{user.total_points}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Level</span>
              <span className="text-gray-800 font-semibold">{user.level}</span>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Weekly Goal</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-800">{user.weekly_progress || 0}/{user.weekly_goal || 10}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                style={{ width: `${((user.weekly_progress || 0) / (user.weekly_goal || 10)) * 100}%` }}
              />
            </div>
            <div className="text-gray-600 text-sm">
              {(((user.weekly_progress || 0) / (user.weekly_goal || 10)) * 100).toFixed(0)}% Complete
            </div>
          </div>
        </Card>
      </div>

      {/* Advanced Analytics Placeholder */}
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">🚀 Advanced Analytics Suite</h3>
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center text-blue-600 mb-2">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Sophisticated Statistical Analysis • Enhanced ML Insights • Advanced Pattern Recognition • Integrated Personalized Recommendations</span>
          </div>
          <div className="text-xs text-blue-600/80">
            Multi-dimensional analysis using PCA, clustering, hypothesis testing, feature importance analysis, learning style detection, and integrated AI recommendations
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Analytics Coming Soon</h4>
          <p className="text-gray-600">
            ML-powered learning insights, predictive analytics, and personalized recommendations will be available in the next update.
          </p>
        </div>
      </Card>

      {/* Learning Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass" className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Learning Time:</span>
              <span className="text-gray-800 font-semibold">{formatTime(user.total_study_time)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Experience Points:</span>
              <span className="text-gray-800 font-semibold">{user.total_points}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To Next Level:</span>
              <span className="text-purple-600 font-semibold">{user.experience_level} XP</span>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Completion Rate:</span>
              <span className="text-green-600 font-semibold">
                {user.completed_modules > 0 ? '85%' : '0%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Consistency Score:</span>
              <span className="text-blue-600 font-semibold">
                {user.current_streak > 0 ? 'High' : 'Developing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Learning Velocity:</span>
              <span className="text-yellow-600 font-semibold">Steady</span>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

const Progress: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuthStore();
  const { loadUserStats, isLoading } = useUserStatsStore();

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user, loadUserStats]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'paths':
        return <LearningPathsTab />;
      case 'modules':
        return <ModulesTab />;
      case 'analytics':
        return <AnalyticsTab />;
      default:
        return <OverviewTab />;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Learning Progress</h1>
          <p className="text-gray-600">Track your learning journey and monitor your progress across all modules and learning paths</p>
        </motion.div>

        {/* Tabs */}
        <ProgressTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Progress;