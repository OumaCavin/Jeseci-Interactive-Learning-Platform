import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useLearningStore } from '../stores/learningStore';
import { useUserStatsStore } from '../stores/userStatsStore';
import { 
  BookOpenIcon, 
  TrophyIcon, 
  ClockIcon, 
  ChartBarIcon,
  PlayIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  ArrowRightIcon,
  FireIcon,
  StarIcon,
  SignalIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalModulesCompleted: number;
  totalTimeSpent: number;
  currentStreak: number;
  averageScore: number;
  completedPaths: number;
  weeklyProgress: number;
  totalPoints: number;
  level: number;
}

interface RecentActivity {
  id: string;
  type: 'module_completed' | 'code_executed' | 'assessment_completed' | 'lesson_completed';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
  duration?: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number;
  modules_count: number;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

// Real-time Connection Status Component
const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true); // Mock real-time connection
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
      <span className="text-sm text-white/80">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};

// Advanced Stat Card Component with Trends
const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: string;
  trend?: { value: number; isPositive: boolean };
}> = ({ title, value, subtitle, icon: Icon, color, trend }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${
          trend.isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend.isPositive ? '+' : ''}{trend.value}%
        </span>
        <span className="text-sm text-gray-500 ml-2">from last week</span>
      </div>
    )}
  </motion.div>
);

// Advanced Recent Activity Component
const RecentActivityCard: React.FC<{ activity: RecentActivity }> = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'module_completed':
      case 'lesson_completed':
        return <BookOpenIcon className="h-4 w-4 text-green-600" />;
      case 'code_executed':
        return <CodeBracketIcon className="h-4 w-4 text-blue-600" />;
      case 'assessment_completed':
        return <AcademicCapIcon className="h-4 w-4 text-purple-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: '#f9fafb' }}
      className="flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors"
    >
      <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-500">{activity.description}</p>
        <div className="flex items-center mt-1 space-x-2">
          <span className="text-xs text-gray-400">{activity.timestamp}</span>
          {activity.duration && (
            <span className="text-xs text-gray-400">{activity.duration}min</span>
          )}
          {activity.score && (
            <Badge variant="success" className="text-xs">
              {activity.score}% Score
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Advanced Learning Path Card with Radial Progress
const LearningPathCard: React.FC<{ path: LearningPath }> = ({ path }) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link to={`/learning-path?id=${path.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{path.title}</h3>
            <p className="text-gray-600 mt-1 text-sm">{path.description}</p>
            
            <div className="flex items-center mt-4 space-x-4">
              <Badge variant="default" className={getDifficultyColor(path.difficulty_level)}>
                {path.difficulty_level}
              </Badge>
              
              <div className="flex items-center text-gray-500 text-sm">
                <ClockIcon className="h-4 w-4 mr-1" />
                {path.estimated_duration}min
              </div>
              
              <div className="flex items-center text-gray-500 text-sm">
                <BookOpenIcon className="h-4 w-4 mr-1" />
                {path.modules_count} modules
              </div>
            </div>
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <div className="w-20 h-20 relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#e5e7eb"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#3b82f6"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - path.progress / 100)}`}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-900">
                  {Math.round(path.progress)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Badge variant={
            path.status === 'completed' ? 'success' : 
            path.status === 'in_progress' ? 'default' : 'secondary'
          }>
            {path.status === 'completed' ? 'Completed' : 
             path.status === 'in_progress' ? 'In Progress' : 'Not Started'}
          </Badge>
          <ArrowRightIcon className="h-4 w-4 text-gray-400" />
        </div>
      </motion.div>
    </Link>
  );
};

// Real-time Dashboard Placeholder Component
const RealTimeDashboard: React.FC<{ className?: string }> = ({ className }) => (
  <Card variant="glass" className={`p-6 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Real-time Learning Analytics</h3>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-sm text-gray-600">Live</span>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">1,247</div>
        <div className="text-sm text-gray-600">Active Learners</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">89%</div>
        <div className="text-sm text-gray-600">Completion Rate</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">24/7</div>
        <div className="text-sm text-gray-600">Platform Status</div>
      </div>
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    initializeLearning, 
    getSkillMap, 
    skillMap, 
    isLoading,
    error 
  } = useLearningStore();
  const { statistics, loadUserStats } = useUserStatsStore();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalModulesCompleted: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
    averageScore: 0,
    completedPaths: 0,
    weeklyProgress: 0,
    totalPoints: 0,
    level: 0
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (user) {
          await initializeLearning(user.id);
          await getSkillMap();
          await loadUserStats();
          
          // Enhanced stats from user data
          setStats({
            totalModulesCompleted: user.completed_modules || 0,
            totalTimeSpent: user.total_study_time || 0,
            currentStreak: user.current_streak || 0,
            averageScore: 85, // Could be calculated from actual assessment data
            completedPaths: Math.floor((user.completed_modules || 0) / 5), // Estimate
            weeklyProgress: user.weekly_progress || 0,
            totalPoints: user.total_points || 0,
            level: user.level || 1
          });

          // Enhanced recent activities
          setRecentActivities([
            {
              id: '1',
              type: 'lesson_completed',
              title: 'Introduction to JavaScript',
              description: 'Completed JavaScript fundamentals module',
              timestamp: '2 hours ago',
              score: 92,
              duration: 45
            },
            {
              id: '2',
              type: 'code_executed',
              title: 'Fibonacci Implementation',
              description: 'Successfully executed Python fibonacci code',
              timestamp: '4 hours ago',
              duration: 30
            },
            {
              id: '3',
              type: 'assessment_completed',
              title: 'JavaScript Fundamentals Quiz',
              description: 'Completed first assessment with excellent score',
              timestamp: '1 day ago',
              score: 88,
              duration: 25
            },
            {
              id: '4',
              type: 'module_completed',
              title: 'Control Structures',
              description: 'Mastered if statements and loops',
              timestamp: '2 days ago',
              score: 95,
              duration: 40
            }
          ]);

          // Mock learning paths with enhanced data
          setLearningPaths([
            {
              id: '1',
              title: 'JavaScript Fundamentals',
              description: 'Learn the basics of JavaScript programming language',
              difficulty_level: 'beginner',
              estimated_duration: 480,
              modules_count: 12,
              progress: 67,
              status: 'in_progress'
            },
            {
              id: '2',
              title: 'Advanced React Patterns',
              description: 'Master advanced React concepts and patterns',
              difficulty_level: 'advanced',
              estimated_duration: 720,
              modules_count: 15,
              progress: 23,
              status: 'in_progress'
            },
            {
              id: '3',
              title: 'Python Basics',
              description: 'Introduction to Python programming',
              difficulty_level: 'beginner',
              estimated_duration: 360,
              modules_count: 10,
              progress: 100,
              status: 'completed'
            }
          ]);
        }
      } catch (err) {
        toast.error('Failed to initialize dashboard data');
      }
    };

    initializeData();
  }, [user, initializeLearning, getSkillMap, loadUserStats]);

  const quickActions = [
    {
      name: 'Continue Learning',
      description: 'Resume your current module',
      icon: PlayIcon,
      href: '/learning-path',
      color: 'bg-blue-500',
    },
    {
      name: 'Code Editor',
      description: 'Practice coding',
      icon: CodeBracketIcon,
      href: '/code-editor',
      color: 'bg-green-500',
    },
    {
      name: 'Take Assessment',
      description: 'Test your knowledge',
      icon: AcademicCapIcon,
      href: '/skill-map',
      color: 'bg-purple-500',
    },
    {
      name: 'View Progress',
      description: 'Track your achievements',
      icon: ChartBarIcon,
      href: '/progress',
      color: 'bg-orange-500',
    },
  ];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.first_name || user?.username || 'Learner'}!
            </h1>
            <p className="text-blue-100 mt-2 text-lg">
              Ready to continue your learning journey?
            </p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center space-x-2">
                <TrophyIcon className="h-5 w-5 text-yellow-300" />
                <span className="text-blue-100">Level {stats.level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <StarIcon className="h-5 w-5 text-yellow-300" />
                <span className="text-blue-100">{stats.totalPoints} points</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <ConnectionStatus />
            <div className="flex items-center space-x-2 text-blue-100">
              <FireIcon className="h-5 w-5" />
              <span className="font-semibold">{stats.currentStreak} day streak!</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Real-time Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <RealTimeDashboard className="mb-8" />
      </motion.div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Modules Completed"
          value={stats.totalModulesCompleted}
          subtitle="out of 45 total"
          icon={BookOpenIcon}
          color="bg-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Time Invested"
          value={formatTime(stats.totalTimeSpent)}
          subtitle="this month"
          icon={ClockIcon}
          color="bg-green-500"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          subtitle="across all assessments"
          icon={StarIcon}
          color="bg-yellow-500"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Learning Paths"
          value={stats.completedPaths}
          subtitle="paths completed"
          icon={TrophyIcon}
          color="bg-purple-500"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Enhanced Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={action.name} to={action.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer transition-all hover:shadow-md group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <RecentActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
            <div className="mt-6">
              <Link
                to="/progress"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
              >
                View all activity
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Continue Learning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
          </div>
          <div className="p-6">
            {learningPaths.length > 0 ? (
              <div className="space-y-4">
                {learningPaths.map((path) => (
                  <LearningPathCard
                    key={path.id}
                    path={path}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No learning paths available
                </h3>
                <p className="text-gray-600 mb-4">
                  Start your learning journey by exploring available paths
                </p>
                <Link
                  to="/learning-path"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Paths
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Learning Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Weekly Progress */}
        <Card variant="glass" className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Goal Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Modules this week</span>
                <span>{stats.weeklyProgress} / 10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.weeklyProgress / 10) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {((stats.weeklyProgress / 10) * 100).toFixed(0)}% Complete
              </p>
            </div>
          </div>
        </Card>

        {/* Skills Overview */}
        <Card variant="glass" className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">JavaScript</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-3/4" />
                </div>
                <span className="text-sm text-gray-800">75%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Python</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-1/2" />
                </div>
                <span className="text-sm text-gray-800">50%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">React</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-1/4" />
                </div>
                <span className="text-sm text-gray-800">25%</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;