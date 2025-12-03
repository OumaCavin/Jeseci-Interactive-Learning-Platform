import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient as api } from '../services/api';
import { Badge } from './authStore';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  progress: number;
  max_progress: number;
  unlocked: boolean;
  unlocked_date?: string;
  category: string;
  points_reward: number;
}

export interface WeeklyProgress {
  week_start: string;
  study_time: number; // in minutes
  modules_completed: number;
  exercises_completed: number;
  streak_days: number;
  points_earned: number;
}

export interface UserStatistics {
  total_study_time: number; // in minutes
  total_modules_completed: number;
  total_exercises_completed: number;
  average_session_time: number;
  current_streak: number;
  longest_streak: number;
  weekly_goals_met: number;
  total_points: number;
  level: number;
  experience_to_next_level: number;
  achievements_unlocked: number;
  badges_earned: number;
  favorite_learning_time: string; // e.g., "Morning", "Afternoon", "Evening"
  most_productive_day: string; // e.g., "Monday"
  weekly_progress: WeeklyProgress[];
}

export interface LearningPreferences {
  preferred_difficulty: 'beginner' | 'intermediate' | 'advanced';
  learning_style: 'visual' | 'auditory' | 'reading_writing' | 'kinesthetic';
  session_duration: number; // preferred session length in minutes
  reminder_frequency: 'daily' | 'weekly' | 'bi_weekly' | 'monthly';
  study_reminders: boolean;
  achievement_notifications: boolean;
  streak_reminders: boolean;
}

interface UserStatsState {
  // Data
  statistics: UserStatistics | null;
  achievements: Achievement[];
  badges: Badge[];
  learningPreferences: LearningPreferences;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadUserStats: () => Promise<void>;
  updateLearningPreferences: (preferences: Partial<LearningPreferences>) => Promise<void>;
  refreshAchievements: () => Promise<void>;
  claimAchievement: (achievementId: string) => Promise<void>;
  updateWeeklyProgress: (progress: Partial<WeeklyProgress>) => Promise<void>;
  resetError: () => void;
}

const defaultLearningPreferences: LearningPreferences = {
  preferred_difficulty: 'intermediate',
  learning_style: 'visual',
  session_duration: 30,
  reminder_frequency: 'daily',
  study_reminders: true,
  achievement_notifications: true,
  streak_reminders: true,
};

export const useUserStatsStore = create<UserStatsState>()(
  persist(
    (set, get) => ({
      // Initial state
      statistics: null,
      achievements: [],
      badges: [],
      learningPreferences: defaultLearningPreferences,
      isLoading: false,
      error: null,

      // Actions
      loadUserStats: async () => {
        set({ isLoading: true, error: null });
        try {
          // Fetch user statistics
          const [statsResponse, achievementsResponse, badgesResponse] = await Promise.all([
            api.get('/user/statistics/'),
            api.get('/user/achievements/'),
            api.get('/user/badges/'),
          ]);

          set({
            statistics: statsResponse.data,
            achievements: achievementsResponse.data,
            badges: badgesResponse.data,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to load user statistics',
          });
          throw error;
        }
      },

      updateLearningPreferences: async (preferences: Partial<LearningPreferences>) => {
        set({ isLoading: true, error: null });
        try {
          const currentPreferences = get().learningPreferences;
          const updatedPreferences = { ...currentPreferences, ...preferences };
          
          await api.patch('/user/learning-preferences/', updatedPreferences);
          
          set({
            learningPreferences: updatedPreferences,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to update learning preferences',
          });
          throw error;
        }
      },

      refreshAchievements: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/user/achievements/');
          set({
            achievements: response.data,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to refresh achievements',
          });
          throw error;
        }
      },

      claimAchievement: async (achievementId: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.post(`/user/achievements/${achievementId}/claim/`);
          
          // Refresh achievements after claiming
          await get().refreshAchievements();
          
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to claim achievement',
          });
          throw error;
        }
      },

      updateWeeklyProgress: async (progress: Partial<WeeklyProgress>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.patch('/user/weekly-progress/', progress);
          
          // Update local statistics
          const currentStats = get().statistics;
          if (currentStats) {
            const updatedStats = {
              ...currentStats,
              weekly_progress: response.data,
            };
            set({ statistics: updatedStats });
          }
          
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to update weekly progress',
          });
          throw error;
        }
      },

      resetError: () => set({ error: null }),
    }),
    {
      name: 'user-stats-storage',
      partialize: (state) => ({
        learningPreferences: state.learningPreferences,
      }),
    }
  )
);