import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient as api } from '../services/api';

export interface UserSettings {
  // Profile Information
  first_name?: string;
  last_name?: string;
  email?: string;
  bio?: string;
  
  // Learning Preferences
  learning_style?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  preferred_difficulty?: 'beginner' | 'intermediate' | 'advanced';
  learning_pace?: 'slow' | 'moderate' | 'fast';
  
  // Goals & Motivation
  current_goal?: string;
  goal_deadline?: string;
  
  // AI Agent Settings
  agent_interaction_level?: 'minimal' | 'moderate' | 'high';
  preferred_feedback_style?: 'detailed' | 'brief' | 'encouraging';
  
  // Notification Settings
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  
  // Display & Appearance
  dark_mode?: boolean;
}

interface SettingsState {
  settings: UserSettings;
  isLoading: boolean;
  error: string | null;
  hasChanges: boolean;
}

interface SettingsActions {
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetSettings: () => void;
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
  clearError: () => void;
  validateSettings: (settings: UserSettings) => { isValid: boolean; errors: string[] };
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => ({
      // State
      settings: {
        first_name: '',
        last_name: '',
        email: '',
        bio: '',
        learning_style: 'visual',
        preferred_difficulty: 'beginner',
        learning_pace: 'moderate',
        current_goal: '',
        goal_deadline: '',
        agent_interaction_level: 'moderate',
        preferred_feedback_style: 'detailed',
        notifications_enabled: true,
        email_notifications: true,
        push_notifications: true,
        dark_mode: true,
      },
      isLoading: false,
      error: null,
      hasChanges: false,

      // Actions
      updateSettings: (updates: Partial<UserSettings>) => {
        const currentSettings = get().settings;
        const newSettings = { ...currentSettings, ...updates };
        const hasChanges = JSON.stringify(newSettings) !== JSON.stringify(currentSettings);
        
        set({
          settings: newSettings,
          hasChanges,
          error: null
        });
      },

      resetSettings: () => {
        set({
          settings: {
            first_name: '',
            last_name: '',
            email: '',
            bio: '',
            learning_style: 'visual',
            preferred_difficulty: 'beginner',
            learning_pace: 'moderate',
            current_goal: '',
            goal_deadline: '',
            agent_interaction_level: 'moderate',
            preferred_feedback_style: 'detailed',
            notifications_enabled: true,
            email_notifications: true,
            push_notifications: true,
            dark_mode: true,
          },
          hasChanges: false,
          error: null
        });
      },

      loadSettings: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.get('/settings/');
          const settings = response.data;
          
          set({
            settings,
            isLoading: false,
            hasChanges: false,
            error: null
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to load settings'
          });
        }
      },

      saveSettings: async () => {
        const { settings } = get();
        set({ isLoading: true, error: null });
        
        try {
          // Validate settings before saving
          const validation = get().validateSettings(settings);
          if (!validation.isValid) {
            set({
              error: validation.errors.join(', '),
              isLoading: false
            });
            return;
          }
          
          const response = await api.put('/settings/', settings);
          const updatedSettings = response.data;
          
          set({
            settings: updatedSettings,
            isLoading: false,
            hasChanges: false,
            error: null
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to save settings'
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      validateSettings: (settings: UserSettings) => {
        const errors: string[] = [];
        
        if (settings.email && !/\S+@\S+\.\S+/.test(settings.email)) {
          errors.push('Please enter a valid email address');
        }
        
        if (settings.first_name && settings.first_name.length < 2) {
          errors.push('First name must be at least 2 characters');
        }
        
        if (settings.last_name && settings.last_name.length < 2) {
          errors.push('Last name must be at least 2 characters');
        }
        
        if (settings.bio && settings.bio.length > 500) {
          errors.push('Bio must be 500 characters or less');
        }
        
        return {
          isValid: errors.length === 0,
          errors
        };
      }
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        settings: state.settings,
        hasChanges: state.hasChanges
      })
    }
  )
);