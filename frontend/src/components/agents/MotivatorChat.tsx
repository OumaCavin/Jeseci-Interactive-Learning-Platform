// JAC Learning Platform - Enhanced MotivatorChat Component
// Multi-view motivational interface with comprehensive gamification system
// Enhanced from 80 lines to 1,100+ lines with rich features

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Target,
  Trophy,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Flame,
  Zap,
  Brain,
  CheckCircle,
  Circle,
  Plus,
  Minus,
  Award,
  Crown,
  Medal,
  Gift,
  Sparkles,
  ThumbsUp,
  MessageCircle,
  RefreshCw,
  BarChart3,
  BookOpen,
  Users,
  Activity,
  Smile,
  Meh,
  Frown,
  Coffee,
  Battery,
  Moon,
  Sun,
  Target as GoalIcon,
  MapPin,
  Bell,
  Settings,
  Filter,
  Download,
  Share,
  Bookmark,
  Repeat,
  ArrowRight,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  X,
  Search
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import BaseAgentChat from './BaseAgentChat';
import { gamificationService } from '../../services/gamificationService';

// Enhanced interfaces for motivational system
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'milestone' | 'skill' | 'special' | 'challenge';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  completed: boolean;
  unlockedAt?: Date;
  points: number;
  badgeColor: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'long_term';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  progress: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  createdAt: Date;
  milestones: Milestone[];
  tags: string[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  value: number;
  achieved: boolean;
  achievedAt?: Date;
  reward: {
    points: number;
    badge?: string;
    message: string;
  };
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  duration: number; // in days
  startDate: Date;
  endDate: Date;
  participants: number;
  maxParticipants?: number;
  reward: {
    points: number;
    badge?: string;
    title?: string;
  };
  requirements: string[];
  progress: number;
  completed: boolean;
  category: 'learning' | 'skill' | 'streak' | 'social' | 'special';
}

interface MotivationSession {
  id: string;
  date: Date;
  mood: 'excellent' | 'good' | 'neutral' | 'low' | 'very_low';
  energy: number; // 1-10 scale
  focus: number; // 1-10 scale
  confidence: number; // 1-10 scale
  motivation: number; // 1-10 scale
  notes: string;
  achievements: string[];
  goalsCompleted: number;
  sessionsCompleted: number;
}

interface MotivationStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  totalAchievements: number;
  goalsCompleted: number;
  challengesCompleted: number;
  averageMood: number;
  averageEnergy: number;
  totalSessions: number;
  weeklyProgress: number;
  monthlyProgress: number;
  motivationTrend: 'up' | 'stable' | 'down';
}

interface MotivatorChatProps {
  sessionId?: string;
  onMessageSent?: (message: string) => void;
  onResponseReceived?: (response: string) => void;
}

const MotivatorChat: React.FC<MotivatorChatProps> = ({
  sessionId,
  onMessageSent,
  onResponseReceived
}) => {
  const [activeView, setActiveView] = useState<'chat' | 'dashboard' | 'goals' | 'challenges' | 'achievements' | 'analytics'>('chat');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [motivationSessions, setMotivationSessions] = useState<MotivationSession[]>([]);
  const [stats, setStats] = useState<MotivationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showChallengeJoin, setShowChallengeJoin] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadMotivationalData();
  }, []);

  const loadMotivationalData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls - replace with actual data fetching
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: 'Early Bird',
          description: 'Complete 5 learning sessions before 8 AM',
          icon: '🌅',
          category: 'streak',
          rarity: 'rare',
          progress: 3,
          maxProgress: 5,
          completed: false,
          points: 100,
          badgeColor: 'bg-orange-500'
        },
        {
          id: '2',
          title: 'Knowledge Seeker',
          description: 'Complete 10 learning goals',
          icon: '📚',
          category: 'milestone',
          rarity: 'epic',
          progress: 7,
          maxProgress: 10,
          completed: false,
          points: 250,
          badgeColor: 'bg-purple-500'
        },
        {
          id: '3',
          title: 'Streak Master',
          description: 'Maintain a 30-day learning streak',
          icon: '🔥',
          category: 'streak',
          rarity: 'legendary',
          progress: 18,
          maxProgress: 30,
          completed: false,
          points: 500,
          badgeColor: 'bg-red-500'
        }
      ];

      const mockGoals: Goal[] = [
        {
          id: '1',
          title: 'Complete React Advanced Course',
          description: 'Master advanced React concepts including hooks and patterns',
          type: 'monthly',
          priority: 'high',
          status: 'in_progress',
          progress: 65,
          targetValue: 100,
          currentValue: 65,
          unit: '%',
          deadline: new Date('2025-12-31'),
          createdAt: new Date('2025-11-01'),
          milestones: [
            {
              id: '1',
              title: 'React Hooks Basics',
              description: 'Complete basic hooks module',
              value: 25,
              achieved: true,
              achievedAt: new Date('2025-11-15'),
              reward: { points: 50, message: 'Great start on hooks!' }
            }
          ],
          tags: ['React', 'Frontend', 'Advanced']
        },
        {
          id: '2',
          title: 'Daily Learning Streak',
          description: 'Learn something new every day for 30 days',
          type: 'long_term',
          priority: 'critical',
          status: 'in_progress',
          progress: 18,
          targetValue: 30,
          currentValue: 18,
          unit: 'days',
          deadline: new Date('2025-12-31'),
          createdAt: new Date('2025-11-01'),
          milestones: [
            {
              id: '2',
              title: 'Week 1 Complete',
              description: 'Complete 7 consecutive days',
              value: 7,
              achieved: true,
              achievedAt: new Date('2025-11-08'),
              reward: { points: 100, badge: 'Week 1 Warrior', message: 'Amazing start to your streak!' }
            }
          ],
          tags: ['Streak', 'Consistency', 'Daily']
        }
      ];

      const mockChallenges: Challenge[] = [
        {
          id: '1',
          title: 'Winter Coding Challenge',
          description: 'Code for 1 hour daily for 30 days',
          difficulty: 'medium',
          duration: 30,
          startDate: new Date('2025-12-01'),
          endDate: new Date('2025-12-31'),
          participants: 1247,
          maxParticipants: 2000,
          reward: {
            points: 1000,
            badge: 'Winter Warrior',
            title: 'Dedicated Coder'
          },
          requirements: ['Code for minimum 1 hour daily', 'Submit daily progress'],
          progress: 2,
          completed: false,
          category: 'skill'
        },
        {
          id: '2',
          title: 'Knowledge Quest',
          description: 'Complete 5 different learning paths',
          difficulty: 'easy',
          duration: 14,
          startDate: new Date('2025-12-01'),
          endDate: new Date('2025-12-15'),
          participants: 856,
          maxParticipants: 1000,
          reward: {
            points: 300,
            badge: 'Quest Master'
          },
          requirements: ['Complete any 5 learning paths', 'Score 80%+ on each final quiz'],
          progress: 1,
          completed: false,
          category: 'learning'
        }
      ];

      const mockStats: MotivationStats = {
        totalPoints: 2450,
        currentStreak: 18,
        longestStreak: 25,
        totalAchievements: 23,
        goalsCompleted: 12,
        challengesCompleted: 3,
        averageMood: 7.8,
        averageEnergy: 8.2,
        totalSessions: 156,
        weeklyProgress: 78,
        monthlyProgress: 89,
        motivationTrend: 'up'
      };

      const mockSessions: MotivationSession[] = [
        {
          id: '1',
          date: new Date(),
          mood: 'good',
          energy: 8,
          focus: 9,
          confidence: 7,
          motivation: 9,
          notes: 'Great coding session today! Feeling very productive.',
          achievements: ['Early Bird', 'Code Session'],
          goalsCompleted: 1,
          sessionsCompleted: 2
        }
      ];

      setAchievements(mockAchievements);
      setGoals(mockGoals);
      setChallenges(mockChallenges);
      setStats(mockStats);
      setMotivationSessions(mockSessions);
    } catch (error) {
      console.error('Error loading motivational data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageSent = async (message: string) => {
    try {
      await gamificationService.awardPoints(10, 'motivation_interaction', {
        message_type: 'chat_interaction',
        agent_type: 'motivator'
      });
    } catch (error) {
      console.warn('Failed to trigger gamification:', error);
    }
    
    if (onMessageSent) {
      onMessageSent(message);
    }
  };

  const handleResponseReceived = (response: string) => {
    if (onResponseReceived) {
      onResponseReceived(response);
    }
  };

  const toggleGoalStatus = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            status: goal.status === 'completed' ? 'in_progress' : 'completed' as Goal['status'],
            progress: goal.status === 'completed' ? goal.currentValue : goal.targetValue
          }
        : goal
    ));
  };

  const completeMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? {
            ...goal,
            milestones: goal.milestones.map(milestone => 
              milestone.id === milestoneId 
                ? { ...milestone, achieved: true, achievedAt: new Date() }
                : milestone
            )
          }
        : goal
    ));
  };

  const joinChallenge = async (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, participants: challenge.participants + 1 }
        : challenge
    ));
    setShowChallengeJoin(null);
    
    // Award points for joining challenge
    try {
      await gamificationService.awardPoints(25, 'challenge_joined', {
        challenge_id: challengeId,
        agent_type: 'motivator'
      });
    } catch (error) {
      console.warn('Failed to award challenge points:', error);
    }
  };

  const getMoodIcon = (mood: MotivationSession['mood']) => {
    switch (mood) {
      case 'excellent': return <Smile className="w-4 h-4 text-green-500" />;
      case 'good': return <Smile className="w-4 h-4 text-blue-500" />;
      case 'neutral': return <Meh className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Frown className="w-4 h-4 text-orange-500" />;
      case 'very_low': return <Frown className="w-4 h-4 text-red-500" />;
      default: return <Meh className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6 p-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Points</p>
                <p className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</p>
              </div>
              <Star className="w-8 h-8 opacity-80" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-400 to-pink-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Current Streak</p>
                <p className="text-2xl font-bold">{stats.currentStreak} days</p>
              </div>
              <Flame className="w-8 h-8 opacity-80" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-400 to-purple-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Achievements</p>
                <p className="text-2xl font-bold">{stats.totalAchievements}</p>
              </div>
              <Trophy className="w-8 h-8 opacity-80" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-400 to-blue-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Goals Completed</p>
                <p className="text-2xl font-bold">{stats.goalsCompleted}</p>
              </div>
              <Target className="w-8 h-8 opacity-80" />
            </div>
          </Card>
        </div>
      )}

      {/* Motivation Trend */}
      {stats && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Motivation Trend</h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className={`w-4 h-4 ${
                stats.motivationTrend === 'up' ? 'text-green-500' : 
                stats.motivationTrend === 'down' ? 'text-red-500' : 'text-yellow-500'
              }`} />
              <span className={`text-sm font-medium ${
                stats.motivationTrend === 'up' ? 'text-green-500' : 
                stats.motivationTrend === 'down' ? 'text-red-500' : 'text-yellow-500'
              }`}>
                {stats.motivationTrend === 'up' ? 'Rising' : 
                 stats.motivationTrend === 'down' ? 'Declining' : 'Stable'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Weekly Progress</p>
              <p className="text-xl font-bold text-blue-600">{stats.weeklyProgress}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Monthly Progress</p>
              <p className="text-xl font-bold text-purple-600">{stats.monthlyProgress}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Energy</p>
              <p className="text-xl font-bold text-green-600">{stats.averageEnergy}/10</p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Achievement */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Achievement</h3>
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xl">
            🏆
          </div>
          <div>
            <p className="font-medium">Week 1 Warrior Badge Unlocked!</p>
            <p className="text-sm text-gray-600">Completed your first week of consistent learning</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Learning Goals</h2>
        <Button
          onClick={() => setShowGoalForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold">{goal.title}</h3>
                  <Badge className={`${getPriorityColor(goal.priority)} text-white`}>
                    {goal.priority}
                  </Badge>
                  <Badge variant="default" className="capitalize">
                    {goal.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-3">{goal.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {goal.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(goal.progress / goal.targetValue) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Milestones */}
                {goal.milestones.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Milestones</h4>
                    {goal.milestones.map((milestone) => (
                      <div 
                        key={milestone.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border ${
                          milestone.achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {milestone.achieved ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${milestone.achieved ? 'text-green-700' : 'text-gray-700'}`}>
                            {milestone.title}
                          </p>
                          <p className={`text-xs ${milestone.achieved ? 'text-green-600' : 'text-gray-500'}`}>
                            {milestone.description} • {milestone.reward.points} points
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => toggleGoalStatus(goal.id)}
                >
                  {goal.status === 'completed' ? 'Reopen' : 'Complete'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Active Challenges</h2>
      
      <div className="grid gap-4">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold">{challenge.title}</h3>
                  <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white`}>
                    {challenge.difficulty}
                  </Badge>
                  <Badge variant="default" className="capitalize">
                    {challenge.category}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{challenge.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{challenge.duration} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Participants</p>
                    <p className="font-medium">{challenge.participants.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reward</p>
                    <p className="font-medium">{challenge.reward.points} points</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Progress</p>
                    <p className="font-medium">{challenge.progress}/{challenge.duration} days</p>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {challenge.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">
                      {Math.round((challenge.progress / challenge.duration) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(challenge.progress / challenge.duration) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowChallengeJoin(challenge.id)}
                >
                  {challenge.participants > 0 ? 'View Details' : 'Join Challenge'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Achievements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`p-4 border-2 transition-all duration-300 hover:shadow-lg ${
              getRarityColor(achievement.rarity)
            } ${achievement.completed ? 'ring-2 ring-green-500' : ''}`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 ${achievement.badgeColor} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3 ${
                achievement.completed ? 'ring-4 ring-green-300' : ''
              }`}>
                {achievement.completed ? '🏆' : achievement.icon}
              </div>
              
              <h3 className="font-semibold text-sm mb-1">{achievement.title}</h3>
              <p className="text-xs text-gray-600 mb-3">{achievement.description}</p>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Progress</span>
                  <span className="text-xs text-gray-600">
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <Badge className={`${getRarityColor(achievement.rarity)} text-xs`}>
                  {achievement.rarity}
                </Badge>
                <Badge variant="default" className="text-xs">
                  {achievement.category}
                </Badge>
              </div>
              
              {achievement.completed && (
                <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-700">
                  Unlocked! +{achievement.points} points
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Motivation Analytics</h2>
      
      {/* Weekly Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Overview</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <p className="text-sm font-medium mb-2">{day}</p>
              <div className="w-full h-8 bg-gray-200 rounded">
                <div 
                  className="h-8 bg-gradient-to-t from-blue-500 to-purple-600 rounded"
                  style={{ 
                    height: `${Math.random() * 100}%`,
                    opacity: index < 5 ? 1 : 0.3 // Weekdays vs weekend
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Mood Tracking */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Mood Tracking</h3>
        <div className="space-y-4">
          {motivationSessions.map((session) => (
            <div key={session.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {getMoodIcon(session.mood)}
                <span className="text-sm font-medium">
                  {session.date.toLocaleDateString()}
                </span>
              </div>
              <div className="flex-1 grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-600">Energy</p>
                  <p className="font-bold text-green-600">{session.energy}/10</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Focus</p>
                  <p className="font-bold text-blue-600">{session.focus}/10</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Confidence</p>
                  <p className="font-bold text-purple-600">{session.confidence}/10</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Motivation</p>
                  <p className="font-bold text-orange-600">{session.motivation}/10</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <Lightbulb className="w-8 h-8 text-blue-500 mb-2" />
            <h4 className="font-medium text-blue-900">Peak Performance</h4>
            <p className="text-sm text-blue-700">
              You're most motivated on Mondays! Consider scheduling important learning sessions.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
            <h4 className="font-medium text-green-900">Positive Trend</h4>
            <p className="text-sm text-green-700">
              Your motivation has increased 15% this month. Keep up the great work!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderChat = () => (
    <div className="h-full">
      <BaseAgentChat
        agentId="motivator"
        agentType="motivator"
        agentName="Motivator"
        agentIcon="💪"
        agentDescription="Your personal learning cheerleader! I'll keep you motivated, set achievable goals, and celebrate your successes."
        agentCapabilities={[
          'Personal Motivation',
          'Goal Setting & Tracking',
          'Achievement Celebration',
          'Learning Streak Maintenance',
          'Confidence Building',
          'Mindset Coaching',
          'Positive Reinforcement',
          'Challenge Adaptation',
          'Mood & Energy Tracking',
          'Performance Analytics'
        ]}
        agentColor="from-yellow-500 to-orange-600"
        sessionId={sessionId}
        onMessageSent={handleMessageSent}
        onResponseReceived={handleResponseReceived}
      />
    </div>
  );

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ] as const;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Enhanced Header */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white">
                💪
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Motivator
                </h1>
                <p className="text-sm text-gray-600">Your Learning Cheerleader</p>
              </div>
            </div>
          </div>
          
          {stats && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {stats.totalPoints.toLocaleString()} points
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-red-100 px-3 py-1 rounded-full">
                <Flame className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  {stats.currentStreak} day streak
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto px-4 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeView === tab.id
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full overflow-y-auto"
          >
            {activeView === 'chat' && renderChat()}
            {activeView === 'dashboard' && renderDashboard()}
            {activeView === 'goals' && renderGoals()}
            {activeView === 'challenges' && renderChallenges()}
            {activeView === 'achievements' && renderAchievements()}
            {activeView === 'analytics' && renderAnalytics()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Challenge Join Modal */}
      <AnimatePresence>
        {showChallengeJoin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Join Challenge</h3>
                <button
                  onClick={() => setShowChallengeJoin(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Ready to take on this challenge? You'll earn 25 bonus points just for joining!
              </p>
              
              <div className="flex space-x-3">
                <Button
                  variant="default"
                  onClick={() => setShowChallengeJoin(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => joinChallenge(showChallengeJoin)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                >
                  Join Challenge
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MotivatorChat;