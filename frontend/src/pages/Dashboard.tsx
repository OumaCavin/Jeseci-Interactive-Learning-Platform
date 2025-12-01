import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useLearningStore } from '../stores/learningStore';
import { 
  BookOpenIcon, 
  TrophyIcon, 
  ClockIcon, 
  ChartBarIcon,
  PlayIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  averageScore: number;
  studyTime: number;
  streak: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    initializeLearning, 
    getSkillMap, 
    skillMap, 
    isLoading,
    error 
  } = useLearningStore();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalLessons: 0,
    completedLessons: 0,
    totalQuizzes: 0,
    averageScore: 0,
    studyTime: 0,
    streak: 0
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (user) {
          await initializeLearning(user.id);
          await getSkillMap();
          // Mock stats data - in real implementation, this would come from API
          setStats({
            totalLessons: 12,
            completedLessons: 8,
            totalQuizzes: 6,
            averageScore: 85,
            studyTime: 420,
            streak: 7
          });
        }
      } catch (err) {
        toast.error('Failed to initialize dashboard data');
      }
    };

    initializeData();
  }, [user, initializeLearning, getSkillMap]);

  const recentActivities = [
    {
      id: 1,
      type: 'lesson',
      title: 'Variables and Data Types',
      score: 88,
      date: '2025-12-01',
      duration: 45
    },
    {
      id: 2,
      type: 'quiz',
      title: 'Control Structures Quiz',
      score: 92,
      date: '2025-11-30',
      duration: 30
    },
    {
      id: 3,
      type: 'lesson',
      title: 'Introduction to Functions',
      score: 85,
      date: '2025-11-29',
      duration: 50
    }
  ];

  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Resume your current lesson',
      icon: PlayIcon,
      color: 'bg-blue-500',
      action: () => console.log('Continue learning')
    },
    {
      title: 'Take Quiz',
      description: 'Test your knowledge',
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      action: () => console.log('Take quiz')
    },
    {
      title: 'View Progress',
      description: 'Check your skill map',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      action: () => console.log('View progress')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600 mt-1">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Current Streak</div>
            <div className="text-3xl font-bold text-orange-500">{stats.streak} days</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-600">Lessons</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.completedLessons}/{stats.totalLessons}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-600">Average Score</div>
              <div className="text-2xl font-bold text-gray-900">{stats.averageScore}%</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-600">Study Time</div>
              <div className="text-2xl font-bold text-gray-900">{Math.floor(stats.studyTime / 60)}h {stats.studyTime % 60}m</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-600">Quizzes</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="p-4 text-left rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                >
                  <div className={`p-2 ${action.color} rounded-lg w-fit group-hover:scale-105 transition-transform duration-200`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 mt-3">{action.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'lesson' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {activity.type === 'lesson' ? (
                        <BookOpenIcon className="h-4 w-4 text-blue-600" />
                      ) : (
                        <AcademicCapIcon className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{activity.title}</div>
                      <div className="text-sm text-gray-600">{activity.duration} min • {activity.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">{activity.score}%</div>
                    <div className="text-sm text-gray-600">
                      {activity.score >= 90 ? 'Excellent' : activity.score >= 80 ? 'Good' : 'Needs Work'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Progress Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{Math.round((stats.completedLessons / stats.totalLessons) * 100)}%</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.completedLessons / stats.totalLessons) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Skill Mastery</span>
                  <span>75%</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-3/4" />
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <div className="font-medium">First Steps</div>
                  <div className="text-sm text-gray-600">Completed your first lesson</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🔥</div>
                <div>
                  <div className="font-medium">Week Warrior</div>
                  <div className="text-sm text-gray-600">7-day learning streak</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">⭐</div>
                <div>
                  <div className="font-medium">High Scorer</div>
                  <div className="text-sm text-gray-600">Scored 90%+ on assessment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-center mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;