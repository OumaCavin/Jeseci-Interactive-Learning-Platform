import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  Award,
  BookOpen,
  CheckCircle,
  Star
} from 'lucide-react';

interface ProgressData {
  totalLessonsCompleted: number;
  totalLessons: number;
  currentStreak: number;
  totalScore: number;
  timeSpent: number; // in minutes
  badges: Badge[];
  weeklyProgress: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ProgressTrackerProps {
  progress: ProgressData;
  className?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  progress, 
  className = '' 
}) => {
  const completionPercentage = (progress.totalLessonsCompleted / progress.totalLessons) * 100;
  
  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '💪';
    return '🎯';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Your Learning Progress
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {getStreakEmoji(progress.currentStreak)} 
          <span className="font-medium">{progress.currentStreak} day streak</span>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Completion</span>
          <span className="text-sm text-gray-500">
            {progress.totalLessonsCompleted}/{progress.totalLessons} lessons
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="mt-1 text-right">
          <span className="text-lg font-bold text-blue-600">
            {completionPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{progress.totalScore}</div>
          <div className="text-xs text-blue-700">Total Score</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">
            {formatTimeSpent(progress.timeSpent)}
          </div>
          <div className="text-xs text-green-700">Time Spent</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">{progress.weeklyProgress}%</div>
          <div className="text-xs text-purple-700">This Week</div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <Award className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-600">{progress.badges.length}</div>
          <div className="text-xs text-yellow-700">Badges Earned</div>
        </div>
      </div>

      {/* Recent Badges */}
      {progress.badges.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </h4>
          <div className="flex flex-wrap gap-3">
            {progress.badges.slice(0, 6).map((badge) => (
              <motion.div
                key={badge.id}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg px-3 py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{badge.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">{badge.name}</div>
                  <div className="text-xs text-gray-600">{badge.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};