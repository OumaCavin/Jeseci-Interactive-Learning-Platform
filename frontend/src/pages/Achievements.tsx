import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useUserStatsStore } from '../stores/userStatsStore';
import { useLearningStore } from '../stores/learningStore';
import { Card } from '../components/ui';
import { 
  TrophyIcon, 
  StarIcon, 
  FireIcon,
  SparklesIcon,
  TargetIcon,
  BookOpenIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

// Extended Achievement interface for our UI needs
interface AchievementWithUI extends Achievement {
  unlockedAt?: string;
  target?: number;
  criteria_type: string;
  criteria_value: number;
  criteria_operator: string;
}

// Categories configuration
const categories = [
  { id: 'all', label: 'All Achievements', icon: '🏆', value: '' },
  { id: 'learning', label: 'Learning', icon: '📚', value: 'learning' },
  { id: 'coding', label: 'Coding', icon: '💻', value: 'coding' },
  { id: 'streak', label: 'Streaks', icon: '🔥', value: 'streak' },
  { id: 'special', label: 'Special', icon: '✨', value: 'special' },
  { id: 'milestone', label: 'Milestones', icon: '🎯', value: 'milestone' }
];

// Difficulty levels
const difficulties = [
  { id: 'all', label: 'All Levels', value: '' },
  { id: 'bronze', label: 'Bronze', value: 'bronze' },
  { id: 'silver', label: 'Silver', value: 'silver' },
  { id: 'gold', label: 'Gold', value: 'gold' },
  { id: 'platinum', label: 'Platinum', value: 'platinum' }
];

// Rarity system
const rarities = {
  common: { color: 'text-gray-400', label: 'Common' },
  rare: { color: 'text-blue-400', label: 'Rare' },
  epic: { color: 'text-purple-400', label: 'Epic' },
  legendary: { color: 'text-yellow-400', label: 'Legendary' }
};

const Achievements: React.FC = () => {
  // Store integration
  const { user } = useAuthStore();
  const { 
    achievements, 
    statistics,
    loadUserStats,
    refreshAchievements
  } = useUserStatsStore();
  const { learningPaths } = useLearningStore();

  // Local state
  const [achievementList, setAchievementList] = useState<AchievementWithUI[]>([]);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementWithUI | null>(null);
  const [viewMode, setViewMode] = useState<'achievements' | 'badges'>('achievements');
  const [isLoading, setIsLoading] = useState(true);

  // Load user statistics and achievements on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await loadUserStats();
        await refreshAchievements();
      } catch (error) {
        console.error('Failed to load achievements data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate mock achievements based on user data (in production, this would come from API)
  useEffect(() => {
    const loadAchievements = async (): Promise<AchievementWithUI[]> => {
      try {
        const response = await fetch('/api/achievements');
        const allAchievements: Achievement[] = await response.json();
        
        // Calculate progress and unlock status based on user data
        const achievementsWithUI: AchievementWithUI[] = allAchievements.map(achievement => {
          let progress = 0;
          let unlocked = false;
          
          switch (achievement.criteria_type) {
            case 'modules':
              progress = Math.min(user?.completed_modules || 0, achievement.criteria_value);
              unlocked = (user?.completed_modules || 0) >= achievement.criteria_value;
              break;
            case 'points':
              progress = Math.min(user?.total_points || 0, achievement.criteria_value);
              unlocked = (user?.total_points || 0) >= achievement.criteria_value;
              break;
            case 'streak':
              progress = Math.min(user?.current_streak || 0, achievement.criteria_value);
              unlocked = (user?.current_streak || 0) >= achievement.criteria_value;
              break;
            // Add more criteria types as needed
            default:
              progress = 0;
              unlocked = false;
          }
          
          return {
            ...achievement,
            progress,
            unlocked,
            unlockedAt: unlocked ? new Date().toISOString() : undefined
          };
        });
        
        return achievementsWithUI;
      } catch (error) {
        console.error('Failed to load achievements:', error);
        // Return empty array on error
        return [];
      }
    };

    const generateMockAchievements = (): AchievementWithUI[] => {
      const mockAchievements: Achievement[] = [
        // Learning Achievements
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first learning module',
          icon: '🚀',
          category: 'learning',
          difficulty: 'bronze',
          rarity: 'common',
          points_reward: 10,
          unlocked: user?.completed_modules >= 1 || false,
          unlockedAt: user?.completed_modules >= 1 ? new Date().toISOString() : undefined,
          progress: Math.min(user?.completed_modules || 0, 1),
          target: 1,
          criteria_type: 'modules',
          criteria_value: 1,
          criteria_operator: '>='
        },
        {
          id: '2',
          title: 'Knowledge Seeker',
          description: 'Complete 5 learning modules',
          icon: '📚',
          category: 'learning',
          difficulty: 'silver',
          rarity: 'rare',
          points_reward: 50,
          unlocked: (user?.completed_modules || 0) >= 5,
          unlockedAt: (user?.completed_modules || 0) >= 5 ? new Date().toISOString() : undefined,
          progress: Math.min(user?.completed_modules || 0, 5),
          target: 5,
          criteria_type: 'modules',
          criteria_value: 5,
          criteria_operator: '>='
        },
        {
          id: '3',
          title: 'Learning Master',
          description: 'Complete 25 learning modules',
          icon: '🎓',
          category: 'learning',
          difficulty: 'gold',
          rarity: 'epic',
          points_reward: 250,
          unlocked: (user?.completed_modules || 0) >= 25,
          unlockedAt: (user?.completed_modules || 0) >= 25 ? new Date().toISOString() : undefined,
          progress: Math.min(user?.completed_modules || 0, 25),
          target: 25,
          criteria_type: 'modules',
          criteria_value: 25,
          criteria_operator: '>='
        },

        // Streak Achievements
        {
          id: '4',
          title: 'Getting Started',
          description: 'Maintain a 3-day learning streak',
          icon: '🔥',
          category: 'streak',
          difficulty: 'bronze',
          rarity: 'common',
          points_reward: 15,
          unlocked: (user?.current_streak || 0) >= 3,
          unlockedAt: (user?.current_streak || 0) >= 3 ? new Date().toISOString() : undefined,
          progress: Math.min(user?.current_streak || 0, 3),
          target: 3,
          criteria_type: 'streak',
          criteria_value: 3,
          criteria_operator: '>='
        },
        {
          id: '5',
          title: 'On Fire',
          description: 'Maintain a 7-day learning streak',
          icon: '🔥',
          category: 'streak',
          difficulty: 'silver',
          rarity: 'rare',
          points_reward: 75,
          unlocked: (user?.current_streak || 0) >= 7,
          unlockedAt: (user?.current_streak || 0) >= 7 ? new Date().toISOString() : undefined,
          progress: Math.min(user?.current_streak || 0, 7),
          target: 7,
          criteria_type: 'streak',
          criteria_value: 7,
          criteria_operator: '>='
        },
        {
          id: '6',
          title: 'Unstoppable',
          description: 'Maintain a 30-day learning streak',
          icon: '⚡',
          category: 'streak',
          difficulty: 'platinum',
          rarity: 'legendary',
          points_reward: 500,
          unlocked: (user?.current_streak || 0) >= 30,
          unlockedAt: (user?.current_streak || 0) >= 30 ? new Date().toISOString() : undefined,
          progress: Math.min(user?.current_streak || 0, 30),
          target: 30,
          criteria_type: 'streak',
          criteria_value: 30,
          criteria_operator: '>='
        },

        // Points Achievements
        {
          id: '7',
          title: 'Point Collector',
          description: 'Earn 100 total points',
          icon: '⭐',
          category: 'milestone',
          difficulty: 'bronze',
          rarity: 'common',
          points_reward: 5,
          unlocked: (user?.total_points || 0) >= 100,
          unlockedAt: (user?.total_points || 0) >= 100 ? new Date().toISOString() : undefined,
          progress: Math.min(user?.total_points || 0, 100),
          target: 100,
          criteria_type: 'points',
          criteria_value: 100,
          criteria_operator: '>='
        },
        {
          id: '8',
          title: 'High Scorer',
          description: 'Earn 1,000 total points',
          icon: '🏆',
          category: 'milestone',
          difficulty: 'gold',
          rarity: 'epic',
          points_reward: 25,
          unlocked: (user?.total_points || 0) >= 1000,
          unlockedAt: (user?.total_points || 0) >= 1000 ? new Date().toISOString() : undefined,
          progress: Math.min(user?.total_points || 0, 1000),
          target: 1000,
          criteria_type: 'points',
          criteria_value: 1000,
          criteria_operator: '>='
        },

        // Special Achievements
        {
          id: '9',
          title: 'Weekend Warrior',
          description: 'Study on weekends',
          icon: '🌟',
          category: 'special',
          difficulty: 'silver',
          rarity: 'rare',
          points_reward: 30,
          unlocked: false, // Would check weekend activity
          progress: 0,
          target: 1,
          criteria_type: 'weekend_activity',
          criteria_value: 1,
          criteria_operator: '>='
        },
        {
          id: '10',
          title: 'Night Owl',
          description: 'Study late at night (after 10 PM)',
          icon: '🦉',
          category: 'special',
          difficulty: 'bronze',
          rarity: 'common',
          points_reward: 20,
          unlocked: false, // Would check late-night activity
          progress: 0,
          target: 1,
          criteria_type: 'late_night_activity',
          criteria_value: 1,
          criteria_operator: '>='
        }
      ];

      return mockAchievements;
    };

    loadAchievements().then(setAchievementList);
  }, [user]);

  // Load user badges from database
  useEffect(() => {
    const loadUserBadges = async () => {
      try {
        const response = await fetch(`/api/user/${user?.id}/badges`);
        const userBadges: Badge[] = await response.json();
        setUserBadges(userBadges);
      } catch (error) {
        console.error('Failed to load user badges:', error);
        // Fallback to generating badges based on achievements
        const earnedAchievements = achievementList.filter(a => a.unlocked);
        const mockBadges: Badge[] = [
        {
          id: '1',
          name: 'First Achievement',
          description: 'Unlocked your first achievement',
          icon: '🎯',
          rarity: 'common',
          earned_date: earnedAchievements.length > 0 ? new Date().toISOString() : '',
          category: 'achievement'
        },
        {
          id: '2',
          name: 'Streak Keeper',
          description: 'Maintained a learning streak',
          icon: '🔥',
          rarity: 'rare',
          earned_date: (user?.current_streak || 0) >= 3 ? new Date().toISOString() : '',
          category: 'streak'
        },
        {
          id: '3',
          name: 'Point Master',
          description: 'Earned 500+ points',
          icon: '💎',
          rarity: 'epic',
          earned_date: (user?.total_points || 0) >= 500 ? new Date().toISOString() : '',
          category: 'points'
        }
      ];

      setUserBadges(mockBadges);
      }
    };

    loadUserBadges();
  }, [achievementList, user]);

  // Filter achievements based on current filters
  const filteredAchievements = achievementList.filter(achievement => {
    const categoryMatch = activeCategory === 'all' || achievement.category === activeCategory;
    const difficultyMatch = activeDifficulty === 'all' || achievement.difficulty === activeDifficulty;
    const unlockedMatch = !showUnlockedOnly || achievement.unlocked;
    
    return categoryMatch && difficultyMatch && unlockedMatch;
  });

  // Calculate statistics
  const stats = {
    total: achievementList.length,
    unlocked: achievementList.filter(a => a.unlocked).length,
    totalPoints: user?.total_points || 0,
    byCategory: {
      learning: achievementList.filter(a => a.category === 'learning' && a.unlocked).length,
      coding: achievementList.filter(a => a.category === 'coding' && a.unlocked).length,
      streak: achievementList.filter(a => a.category === 'streak' && a.unlocked).length,
      special: achievementList.filter(a => a.category === 'special' && a.unlocked).length,
      milestone: achievementList.filter(a => a.category === 'milestone' && a.unlocked).length
    },
    byDifficulty: {
      bronze: achievementList.filter(a => a.difficulty === 'bronze' && a.unlocked).length,
      silver: achievementList.filter(a => a.difficulty === 'silver' && a.unlocked).length,
      gold: achievementList.filter(a => a.difficulty === 'gold' && a.unlocked).length,
      platinum: achievementList.filter(a => a.difficulty === 'platinum' && a.unlocked).length
    }
  };

  const completionPercentage = stats.total > 0 ? Math.round((stats.unlocked / stats.total) * 100) : 0;

  // Utility functions
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-purple-400 to-pink-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-600/50 to-gray-800/50';
      case 'rare': return 'from-blue-600/50 to-blue-800/50';
      case 'epic': return 'from-purple-600/50 to-purple-800/50';
      case 'legendary': return 'from-yellow-600/50 to-yellow-800/50';
      default: return 'from-gray-600/50 to-gray-800/50';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card variant="glass" padding="lg" className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Loading Achievements...
            </h2>
            <p className="text-white/80">
              Fetching your gamification data
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Render achievement card
  const renderAchievementCard = (achievement: Achievement) => (
    <motion.div
      key={achievement.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white/10 backdrop-blur-lg rounded-lg p-6 cursor-pointer transition-all duration-300 ${
        achievement.unlocked ? 'border border-white/20 hover:bg-white/20' : 'border border-white/10 opacity-75'
      }`}
      onClick={() => setSelectedAchievement(achievement)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`text-4xl p-3 rounded-full bg-gradient-to-r ${getDifficultyColor(achievement.difficulty)} ${
            achievement.unlocked ? '' : 'grayscale opacity-50'
          }`}>
            {achievement.icon}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${achievement.unlocked ? 'text-white' : 'text-white/70'}`}>
              {achievement.title}
            </h3>
            <p className={`text-sm ${achievement.unlocked ? 'text-white/80' : 'text-white/50'}`}>
              {achievement.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(achievement.difficulty)} text-white font-medium`}>
            {achievement.difficulty.toUpperCase()}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${rarities[achievement.rarity].color} font-medium`}>
            {achievement.rarity}
          </span>
        </div>
      </div>

      {achievement.unlocked ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400 font-bold">{achievement.points_reward}</span>
            <span className="text-white/60 text-sm">points</span>
          </div>
          {achievement.unlockedAt && (
            <span className="text-white/60 text-sm">
              Unlocked {formatDate(achievement.unlockedAt)}
            </span>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {achievement.progress !== undefined && achievement.target && (
            <div>
              <div className="flex justify-between text-sm text-white/80 mb-1">
                <span>Progress</span>
                <span>{achievement.progress} / {achievement.target}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${getDifficultyColor(achievement.difficulty)}`}
                  style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">{achievement.points_reward} points</span>
            <span className="text-white/50 text-sm">Locked</span>
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-xs text-white/60">
          <strong>Requirements:</strong> {achievement.criteria_type.replace('_', ' ')} {achievement.criteria_operator} {achievement.criteria_value}
        </p>
      </div>
    </motion.div>
  );

  // Render badge card
  const renderBadge = (badge: Badge) => (
    <motion.div
      key={badge.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center transition-all duration-300 border border-white/20 ${
        badge.earned_date ? '' : 'opacity-50'
      }`}
    >
      <div className="text-4xl mb-3">
        {badge.icon}
      </div>
      <h3 className="font-semibold mb-2 text-white">
        {badge.name}
      </h3>
      <p className="text-sm mb-3 text-white/80">
        {badge.description}
      </p>
      <div className="flex flex-col items-center space-y-2">
        <span className={`text-xs px-3 py-1 rounded-full ${
          badge.rarity === 'common' ? 'bg-gray-500/20 text-gray-300' :
          badge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
          badge.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
          'bg-yellow-500/20 text-yellow-300'
        }`}>
          {badge.rarity}
        </span>
        {badge.earned_date && (
          <span className="text-xs text-white/60">
            Earned {formatDate(badge.earned_date)}
          </span>
        )}
        {!badge.earned_date && (
          <span className="text-xs text-white/50">
            Not earned yet
          </span>
        )}
      </div>
    </motion.div>
  );

  // Render stats overview
  const renderStatsOverview = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center"
      >
        <div className="text-2xl font-bold text-white mb-1">{stats.unlocked}</div>
        <div className="text-sm text-white/70">Unlocked</div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center"
      >
        <div className="text-2xl font-bold text-white mb-1">{stats.totalPoints}</div>
        <div className="text-sm text-white/70">Total Points</div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center"
      >
        <div className="text-2xl font-bold text-green-400 mb-1">{completionPercentage}%</div>
        <div className="text-sm text-white/70">Completed</div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center"
      >
        <div className="text-2xl font-bold text-purple-400 mb-1">{stats.byDifficulty.gold + stats.byDifficulty.platinum}</div>
        <div className="text-sm text-white/70">Rare+</div>
      </motion.div>
    </div>
  );

  // Render category progress
  const renderCategoryProgress = () => (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Progress by Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(stats.byCategory).map(([category, count]) => {
          const categoryData = categories.find(c => c.value === category);
          return (
            <div key={category} className="text-center">
              <div className="text-2xl mb-2">
                {categoryData?.icon || '🏆'}
              </div>
              <div className="text-lg font-bold text-white">{count}</div>
              <div className="text-sm text-white/70 capitalize">{category}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8" role="main" aria-label="Achievements and Badges dashboard">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Achievements & Badges</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Track your learning progress and unlock achievements as you advance through your JAC journey
        </p>
      </motion.div>

      {/* Stats Overview */}
      {renderStatsOverview()}

      {/* Category Progress */}
      {renderCategoryProgress()}

      {/* View Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-1">
          <button
            onClick={() => setViewMode('achievements')}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${
              viewMode === 'achievements' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            🏆 Achievements
          </button>
          <button
            onClick={() => setViewMode('badges')}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${
              viewMode === 'badges' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            🏅 Badges
          </button>
        </div>
      </div>

      {viewMode === 'achievements' ? (
        <>
          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id} className="bg-gray-800 text-white">
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Difficulty</label>
                <select
                  value={activeDifficulty}
                  onChange={(e) => setActiveDifficulty(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty.id} value={difficulty.id} className="bg-gray-800 text-white">
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unlocked Only Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="unlockedOnly"
                  checked={showUnlockedOnly}
                  onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                  className="rounded bg-white/10 border-white/20 text-primary-500"
                />
                <label htmlFor="unlockedOnly" className="text-white/80 text-sm">
                  Show unlocked only
                </label>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-end">
                <span className="text-white/60 text-sm">
                  {filteredAchievements.length} of {achievementList.length} achievements
                </span>
              </div>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map(renderAchievementCard)}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-2">No achievements found</h3>
              <p className="text-white/70">Try adjusting your filters to see more achievements</p>
            </div>
          )}
        </>
      ) : (
        /* Badges View */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {userBadges.map(renderBadge)}
        </div>
      )}

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/95 backdrop-blur-lg rounded-lg p-6 max-w-md w-full border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`text-4xl p-3 rounded-full bg-gradient-to-r ${getDifficultyColor(selectedAchievement.difficulty)} ${
                  selectedAchievement.unlocked ? '' : 'grayscale'
                }`}>
                  {selectedAchievement.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedAchievement.title}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(selectedAchievement.difficulty)} text-white font-medium`}>
                    {selectedAchievement.difficulty.toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-white/80 mb-4">{selectedAchievement.description}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Points:</span>
                <span className="text-yellow-400 font-bold">{selectedAchievement.points_reward}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/60">Rarity:</span>
                <span className={`font-medium ${rarities[selectedAchievement.rarity].color}`}>
                  {selectedAchievement.rarity.charAt(0).toUpperCase() + selectedAchievement.rarity.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/60">Status:</span>
                <span className={selectedAchievement.unlocked ? 'text-green-400' : 'text-white/50'}>
                  {selectedAchievement.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>

              {selectedAchievement.unlocked && selectedAchievement.unlockedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Unlocked:</span>
                  <span className="text-white/80">{formatDate(selectedAchievement.unlockedAt)}</span>
                </div>
              )}

              {!selectedAchievement.unlocked && selectedAchievement.progress !== undefined && selectedAchievement.target && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60">Progress:</span>
                    <span className="text-white/80">{selectedAchievement.progress} / {selectedAchievement.target}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getDifficultyColor(selectedAchievement.difficulty)}`}
                      style={{ width: `${(selectedAchievement.progress / selectedAchievement.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm text-white/60">
                <strong>Requirements:</strong> {selectedAchievement.criteria_operator} {selectedAchievement.criteria_value} {selectedAchievement.criteria_type.replace('_', ' ')}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Achievements;