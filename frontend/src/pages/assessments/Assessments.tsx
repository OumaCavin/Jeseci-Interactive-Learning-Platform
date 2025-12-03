// JAC Learning Platform - TypeScript utilities by Cavin Otieno

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore, useAssessmentFilters, useAssessmentData, useAssessmentActions } from '../../stores/assessmentStore';
import { 
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  TrophyIcon,
  PlayIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  FireIcon,
  BookmarkIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const difficultyColors = {
  easy: 'from-green-400 to-green-600',
  medium: 'from-yellow-400 to-yellow-600',
  hard: 'from-red-400 to-red-600'
};

const difficultyLabels = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard'
};

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  not_started: 'bg-gray-100 text-gray-800'
};

const statusIcons = {
  completed: <CheckCircleIcon className="w-4 h-4" />,
  in_progress: <ClockIcon className="w-4 h-4" />,
  not_started: <PlayIcon className="w-4 h-4" />
};

const Assessments: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'available' | 'history' | 'analytics'>('overview');
  
  // Store hooks
  const { isLoading, isSubmitting, error, clearError } = useAssessmentStore();
  const { difficulty, status, search, setDifficulty, setStatus, setSearch, clearAll } = useAssessmentFilters();
  const { quizzes, attempts, stats } = useAssessmentData();
  const { fetchQuizzes, fetchUserAttempts, fetchAssessmentStats, submitAttempt } = useAssessmentActions();

  // Format time helper function
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Format date helper function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-blue-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Progress color helper
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-400 to-green-600';
    if (percentage >= 60) return 'from-blue-400 to-blue-600';
    if (percentage >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchQuizzes(),
          fetchUserAttempts(),
          fetchAssessmentStats()
        ]);
      } catch (error) {
        console.error('Failed to load assessment data:', error);
      }
    };

    loadData();
  }, [fetchQuizzes, fetchUserAttempts, fetchAssessmentStats]);

  // Clear error when tab changes
  useEffect(() => {
    if (error) clearError();
  }, [activeTab, error, clearError]);

  // Computed values
  const filteredQuizzes = useAssessmentStore(state => state.getFilteredQuizzes());
  
  // Create custom hooks for individual quiz data
  const useQuizStatus = (quizId: string) => useAssessmentStore(state => state.getQuizStatus(quizId));
  const useBestScore = (quizId: string) => useAssessmentStore(state => state.getBestScore(quizId));
  const useAttemptsRemaining = (quizId: string) => useAssessmentStore(state => state.getAttemptsRemaining(quizId));
  const useQuizProgress = (quizId: string) => useAssessmentStore(state => state.getQuizProgress(quizId));

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'available', label: 'Available', icon: DocumentTextIcon },
    { id: 'history', label: 'History', icon: ClockIcon },
    { id: 'analytics', label: 'Analytics', icon: TrophyIcon }
  ];

  // Handle quiz start
  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  // Handle quiz retake
  const handleRetakeQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  // Render Overview Tab
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">
                {stats ? Math.round((stats.completedQuizzes / stats.totalQuizzes) * 100) : 0}%
              </p>
            </div>
            <div className="text-3xl">
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <p className="text-white/85 text-xs mt-2">
            {stats?.completedQuizzes || 0} of {stats?.totalQuizzes || 0} quizzes
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 text-sm">Average Score</p>
              <p className="text-2xl font-bold text-green-400">{stats?.averageScore || 0}%</p>
            </div>
            <div className="text-3xl">
              <TrophyIcon className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <p className="text-white/85 text-xs mt-2">Best: {stats?.bestScore || 0}%</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 text-sm">Pass Rate</p>
              <p className="text-2xl font-bold text-blue-400">{stats?.passRate || 0}%</p>
            </div>
            <div className="text-3xl">
              <AcademicCapIcon className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <p className="text-white/85 text-xs mt-2">+{stats?.improvement || 0}% this month</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 text-sm">Time Spent</p>
              <p className="text-2xl font-bold text-purple-400">{stats?.totalTimeSpent || '0m'}</p>
            </div>
            <div className="text-3xl">
              <FireIcon className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          <p className="text-white/85 text-xs mt-2">Current streak: {stats?.currentStreak || 0} days</p>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {attempts.slice(-5).reverse().map((attempt, index) => {
            const quiz = quizzes.find(q => q.id === attempt.quiz);
            const quizTitle = quiz?.title || 'Unknown Quiz';
            
            return (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {attempt.passed ? '✅' : '❌'}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{quizTitle}</h4>
                    <p className="text-white/85 text-sm">
                      {formatDate(attempt.completed_at || attempt.started_at)} • {formatTime(attempt.time_taken)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(attempt.percentage)}`}>
                    {attempt.percentage}%
                  </div>
                  <div className="text-xs text-white/85">
                    Attempt {attempts.filter(a => a.quiz === attempt.quiz).length}
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {attempts.length === 0 && (
            <div className="text-center py-8">
              <DocumentTextIcon className="w-12 h-12 text-white/50 mx-auto mb-4" />
              <p className="text-white/70">No assessment attempts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render Available Tab
  const renderAvailable = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white backdrop-blur-sm"
            >
              <option value="all" className="bg-gray-800">All Levels</option>
              <option value="easy" className="bg-gray-800">Easy</option>
              <option value="medium" className="bg-gray-800">Medium</option>
              <option value="hard" className="bg-gray-800">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white backdrop-blur-sm"
            >
              <option value="all" className="bg-gray-800">All Quizzes</option>
              <option value="not_started" className="bg-gray-800">Not Started</option>
              <option value="in_progress" className="bg-gray-800">In Progress</option>
              <option value="completed" className="bg-gray-800">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search quizzes..."
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-3 py-2 text-white placeholder-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-white/85 text-sm">
            {filteredQuizzes.length} of {quizzes.length} quizzes
          </span>
          <button
            onClick={clearAll}
            className="text-white/70 hover:text-white text-sm underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Quiz Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz, index) => {
          const quizStatus = getQuizStatus(quiz.id);
          const bestScore = getBestScore(quiz.id);
          const attemptsRemaining = getAttemptsRemaining(quiz.id);
          const progress = getQuizProgress(quiz.id);

          return (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{quiz.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${difficultyColors[quiz.difficulty]} text-white`}>
                      {difficultyLabels[quiz.difficulty]}
                    </span>
                  </div>
                  <p className="text-white/90 text-sm mb-3">{quiz.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/85">Questions:</span>
                      <span className="text-white">{quiz.questionCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/85">Points:</span>
                      <span className="text-white">{quiz.totalPoints}</span>
                    </div>
                    {quiz.time_limit && (
                      <div className="flex justify-between">
                        <span className="text-white/85">Time Limit:</span>
                        <span className="text-white">{quiz.time_limit} min</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-white/85">Passing Score:</span>
                      <span className="text-white">{quiz.passing_score}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress and Status */}
              <div className="mb-4">
                {quizStatus !== 'not_started' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/90">Progress</span>
                      <span className="text-white">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${
                      quizStatus === 'completed' ? 'bg-green-400' :
                      quizStatus === 'in_progress' ? 'bg-yellow-400' :
                      'bg-gray-400'
                    }`}></span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[quizStatus as keyof typeof statusColors]}`}>
                      {statusIcons[quizStatus as keyof typeof statusIcons]}
                      <span className="capitalize">{quizStatus.replace('_', ' ')}</span>
                    </span>
                  </div>
                  
                  {quizStatus !== 'not_started' && bestScore > 0 && (
                    <div className="text-sm">
                      <span className="text-white/90">Best: </span>
                      <span className={getScoreColor(bestScore)}>{bestScore}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-white/85">
                  {attemptsRemaining > 0 ? (
                    <span>{attemptsRemaining} attempts remaining</span>
                  ) : (
                    <span className="text-red-400">No attempts left</span>
                  )}
                </div>
                
                <button 
                  onClick={() => quizStatus === 'completed' ? handleRetakeQuiz(quiz.id) : handleStartQuiz(quiz.id)}
                  disabled={attemptsRemaining === 0 && quizStatus === 'not_started'}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    quizStatus === 'not_started' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600' 
                      : quizStatus === 'completed' 
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {quizStatus === 'not_started' ? 'Start Quiz' :
                   quizStatus === 'completed' ? 'Retake' :
                   'Continue'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No quizzes found</h3>
          <p className="text-white/90">Try adjusting your filters to see more quizzes</p>
        </div>
      )}
    </div>
  );

  // Render History Tab
  const renderHistory = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">Assessment History</h3>
        
        <div className="space-y-4">
          {attempts.slice().reverse().map((attempt, index) => {
            const quiz = quizzes.find(q => q.id === attempt.quiz);
            const quizTitle = quiz?.title || 'Unknown Quiz';
            const quizDifficulty = quiz?.difficulty || 'medium';
            
            return (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {attempt.passed ? '✅' : '❌'}
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium">{quizTitle}</h4>
                      <div className="flex items-center space-x-4 text-sm text-white/90">
                        <span>{formatDate(attempt.completed_at || attempt.started_at)}</span>
                        <span>Attempt {attempt.attemptNumber}</span>
                        <span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${difficultyColors[quizDifficulty as keyof typeof difficultyColors]} text-white`}>
                          {difficultyLabels[quizDifficulty as keyof typeof difficultyLabels]}
                        </span>
                        <span>{formatTime(attempt.time_taken)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getScoreColor(attempt.percentage)}`}>
                      {attempt.percentage}%
                    </div>
                    <div className="text-sm text-white/85">
                      {attempt.score}/{attempt.max_score} points
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/90">Result:</span>
                    <span className={attempt.passed ? 'text-green-400' : 'text-red-400'}>
                      {attempt.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {attempts.length === 0 && (
            <div className="text-center py-12">
              <ClockIcon className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No attempts yet</h3>
              <p className="text-white/90">Start taking quizzes to see your history here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render Analytics Tab
  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Performance by Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Performance by Difficulty</h3>
          <div className="space-y-4">
            {['easy', 'medium', 'hard'].map(difficultyLevel => {
              const difficultyAttempts = attempts.filter(a => {
                const quiz = quizzes.find(q => q.id === a.quiz);
                return quiz?.difficulty === difficultyLevel;
              });
              
              const averageScore = difficultyAttempts.length > 0 
                ? Math.round(difficultyAttempts.reduce((sum, a) => sum + a.percentage, 0) / difficultyAttempts.length)
                : 0;
              const passRate = difficultyAttempts.length > 0
                ? Math.round((difficultyAttempts.filter(a => a.passed).length / difficultyAttempts.length) * 100)
                : 0;

              return (
                <div key={difficultyLevel} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium capitalize">
                      {difficultyLabels[difficultyLevel as keyof typeof difficultyLabels]}
                    </span>
                    <span className="text-white/85 text-sm">{difficultyAttempts.length} attempts</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/85">Average Score: {averageScore}%</span>
                    <span className="text-white/85">Pass Rate: {passRate}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${difficultyColors[difficultyLevel as keyof typeof difficultyColors]}`}
                      style={{ width: `${averageScore}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white">
              <div className="flex items-center gap-3">
                <BookmarkIcon className="w-5 h-5 text-blue-400" />
                <span>Bookmark Difficult Questions</span>
              </div>
            </button>
            
            <button className="w-full text-left px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white">
              <div className="flex items-center gap-3">
                <ShareIcon className="w-5 h-5 text-green-400" />
                <span>Share Progress Report</span>
              </div>
            </button>
            
            <button className="w-full text-left px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white">
              <div className="flex items-center gap-3">
                <ArrowPathIcon className="w-5 h-5 text-orange-400" />
                <span>Reset All Filters</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">Detailed Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">{attempts.length}</div>
            <div className="text-white/70 text-sm">Total Attempts</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {attempts.filter(a => a.passed).length}
            </div>
            <div className="text-white/70 text-sm">Passed Attempts</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-2">
              {attempts.filter(a => !a.passed).length}
            </div>
            <div className="text-white/70 text-sm">Failed Attempts</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">
              {attempts.length > 0 
                ? formatTime(Math.round(attempts.reduce((sum, a) => sum + a.time_taken, 0) / attempts.length))
                : '0m'
              }
            </div>
            <div className="text-white/70 text-sm">Average Time</div>
          </div>
        </div>
      </div>

      {/* Improvement Trends */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">Improvement Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Score Improvement</span>
              <span className="text-green-400">+{stats?.improvement || 0}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                style={{ width: `${(stats?.improvement || 0) * 5}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Completion Rate</span>
              <span className="text-blue-400">
                {stats ? Math.round((stats.completedQuizzes / stats.totalQuizzes) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                style={{ width: `${stats ? (stats.completedQuizzes / stats.totalQuizzes) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Current Streak</span>
              <span className="text-orange-400">{stats?.currentStreak || 0} days</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                style={{ width: `${Math.min((stats?.currentStreak || 0) * 10, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Assessments</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Test your knowledge with comprehensive assessments and track your learning progress
        </p>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-100"
        >
          <p>{error}</p>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-1 border border-white/20" role="tablist" aria-label="Assessment categories">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                className={`px-6 py-3 rounded-md transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === tab.id 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center border border-white/20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading assessment data...</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="min-h-[600px]" role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'available' && renderAvailable()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default Assessments;