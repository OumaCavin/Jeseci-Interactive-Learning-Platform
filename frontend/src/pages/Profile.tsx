import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  TrophyIcon, 
  ChartBarIcon, 
  CogIcon,
  StarIcon,
  FireIcon,
  ClockIcon,
  AcademicCapIcon,
  BadgeIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import { useUserStatsStore } from '../stores/userStatsStore';
import { ProgressTracker } from '../components/learning/ProgressTracker';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileTabs: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'achievements', label: 'Achievements', icon: TrophyIcon },
    { id: 'statistics', label: 'Statistics', icon: ChartBarIcon },
    { id: 'preferences', label: 'Preferences', icon: CogIcon },
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
  const { statistics, badges } = useUserStatsStore();

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">
                {user.first_name?.[0] || user.username[0]?.toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-xs font-bold text-white">Lv.{user.level}</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">
              {user.first_name && user.last_name 
                ? `${user.first_name} ${user.last_name}`
                : user.username
              }
            </h2>
            <p className="text-gray-600 mb-2">{user.email}</p>
            {user.profile.bio && (
              <p className="text-gray-700">{user.profile.bio}</p>
            )}
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">{user.total_points}</p>
              <p className="text-sm text-gray-600">Total Points</p>
            </div>
            <Badge variant="success" glass>
              Level {user.level}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <AcademicCapIcon className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{user.completed_modules}</p>
          <p className="text-sm text-gray-600">Modules Completed</p>
        </Card>

        <Card variant="glass" className="p-4 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <FireIcon className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{user.current_streak}</p>
          <p className="text-sm text-gray-600">Day Streak</p>
        </Card>

        <Card variant="glass" className="p-4 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <ClockIcon className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {Math.floor(user.total_study_time / 60)}h
          </p>
          <p className="text-sm text-gray-600">Study Time</p>
        </Card>

        <Card variant="glass" className="p-4 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <BadgeIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{badges.length}</p>
          <p className="text-sm text-gray-600">Badges Earned</p>
        </Card>
      </div>

      {/* Progress Tracker */}
      <Card variant="glass" className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Progress</h3>
        <ProgressTracker 
          progress={{
            totalLessonsCompleted: user.completed_modules,
            totalLessons: Math.max(user.completed_modules + 10, 50), // Estimate total lessons
            currentStreak: user.current_streak,
            totalScore: user.total_points,
            timeSpent: user.total_study_time,
            badges: badges.slice(0, 6), // Recent badges
            weeklyProgress: user.weekly_progress || 0
          }}
        />
      </Card>
    </motion.div>
  );
};

const AchievementsTab: React.FC = () => {
  const { achievements, badges, isLoading } = useUserStatsStore();

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-500',
    epic: 'from-purple-400 to-purple-500',
    legendary: 'from-yellow-400 to-yellow-500',
  };

  const rarityLabels = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Your Achievements</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                variant="glass"
                className={`p-4 transition-all duration-200 hover:shadow-lg ${
                  achievement.unlocked ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${rarityColors[achievement.category as keyof typeof rarityColors] || rarityColors.common} rounded-lg flex items-center justify-center`}>
                    <span className="text-xl">{achievement.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    
                    {!achievement.unlocked && (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(achievement.progress / achievement.max_progress) * 100}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {achievement.progress}/{achievement.max_progress}
                        </p>
                      </div>
                    )}
                    
                    {achievement.unlocked && achievement.unlocked_date && (
                      <Badge variant="success" glass className="mt-2">
                        Unlocked {new Date(achievement.unlocked_date).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Badge Collection */}
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Badge Collection</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${rarityColors[badge.rarity]} rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg`}>
                <span className="text-2xl">{badge.icon}</span>
              </div>
              <p className="text-sm font-medium text-gray-800">{badge.name}</p>
              <p className="text-xs text-gray-500">{rarityLabels[badge.rarity]}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

const StatisticsTab: React.FC = () => {
  const { statistics, isLoading } = useUserStatsStore();

  if (!statistics) {
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
      {/* Learning Overview */}
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Learning Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{statistics.total_modules_completed}</p>
            <p className="text-sm text-gray-600">Modules Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{statistics.total_exercises_completed}</p>
            <p className="text-sm text-gray-600">Exercises Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{formatTime(statistics.total_study_time)}</p>
            <p className="text-sm text-gray-600">Total Study Time</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{formatTime(statistics.average_session_time)}</p>
            <p className="text-sm text-gray-600">Avg Session</p>
          </div>
        </div>
      </Card>

      {/* Streak Information */}
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Streak Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
            <FireIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{statistics.current_streak}</p>
            <p className="text-sm text-gray-600">Current Streak</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
            <StarIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{statistics.longest_streak}</p>
            <p className="text-sm text-gray-600">Longest Streak</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <TrophyIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{statistics.weekly_goals_met}</p>
            <p className="text-sm text-gray-600">Goals Met</p>
          </div>
        </div>
      </Card>

      {/* Learning Insights */}
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Learning Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Most Productive Day</h4>
            <p className="text-lg font-semibold text-gray-800">{statistics.most_productive_day}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Preferred Learning Time</h4>
            <p className="text-lg font-semibold text-gray-800">{statistics.favorite_learning_time}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Experience Level</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Level {statistics.level}</span>
                <span>{statistics.experience_to_next_level} XP to next level</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ 
                    width: `${100 - (statistics.experience_to_next_level / (statistics.level * 100)) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Achievement Progress</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Achievements</span>
                <span>{statistics.achievements_unlocked}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Badges</span>
                <span>{statistics.badges_earned}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const PreferencesTab: React.FC = () => {
  const { learningPreferences, updateLearningPreferences, isLoading } = useUserStatsStore();
  const [localPreferences, setLocalPreferences] = useState(learningPreferences);

  useEffect(() => {
    setLocalPreferences(learningPreferences);
  }, [learningPreferences]);

  const handleSave = async () => {
    await updateLearningPreferences(localPreferences);
  };

  const handlePreferenceChange = (key: keyof typeof learningPreferences, value: any) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Learning Preferences</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Difficulty
              </label>
              <select
                value={localPreferences.preferred_difficulty}
                onChange={(e) => handlePreferenceChange('preferred_difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Style
              </label>
              <select
                value={localPreferences.learning_style}
                onChange={(e) => handlePreferenceChange('learning_style', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="visual">Visual</option>
                <option value="auditory">Auditory</option>
                <option value="reading_writing">Reading/Writing</option>
                <option value="kinesthetic">Kinesthetic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Duration (minutes)
              </label>
              <Input
                type="number"
                value={localPreferences.session_duration}
                onChange={(e) => handlePreferenceChange('session_duration', parseInt(e.target.value))}
                min="10"
                max="120"
                step="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Frequency
              </label>
              <select
                value={localPreferences.reminder_frequency}
                onChange={(e) => handlePreferenceChange('reminder_frequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="bi_weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Notification Preferences</h4>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={localPreferences.study_reminders}
                  onChange={(e) => handlePreferenceChange('study_reminders', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Study Reminders</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={localPreferences.achievement_notifications}
                  onChange={(e) => handlePreferenceChange('achievement_notifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Achievement Notifications</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={localPreferences.streak_reminders}
                  onChange={(e) => handlePreferenceChange('streak_reminders', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Streak Reminders</span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuthStore();
  const { loadUserStats, isLoading } = useUserStatsStore();

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user, loadUserStats]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'achievements':
        return <AchievementsTab />;
      case 'statistics':
        return <StatisticsTab />;
      case 'preferences':
        return <PreferencesTab />;
      default:
        return <OverviewTab />;
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your profile and track your learning progress</p>
        </motion.div>

        {/* Tabs */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

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

export default Profile;