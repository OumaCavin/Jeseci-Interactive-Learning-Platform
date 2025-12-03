import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { apiClient as api } from '../services/api';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty_level: string;
  estimated_duration: number;
  concepts: string[];
  prerequisites: string[];
  is_published: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: any[];
  concepts: string[];
  difficulty_level: string;
  time_limit?: number;
  is_adaptive: boolean;
}

export interface LearningProgress {
  id: string;
  user: number;
  lesson: string;
  lesson_title: string;
  status: string;
  progress_percentage: number;
  time_spent: number;
  quiz_score?: number;
  notes: string;
}

export interface SkillMapData {
  nodes: Array<{
    id: string;
    label: string;
    mastery_level: number;
    practice_count: number;
    color: string;
    size: number;
  }>;
  edges: Array<{
    from: string;
    to: string;
    type: string;
  }>;
}

interface LearningState {
  // UI State
  sidebarOpen: boolean;
  
  // Learning Data
  currentLesson: Lesson | null;
  currentQuiz: Quiz | null;
  learningProgress: LearningProgress[];
  skillMap: SkillMapData | null;
  
  // Actions State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  toggleSidebar: () => void;
  initializeLearning: (userId: number) => Promise<void>;
  getLesson: (lessonId: string) => Promise<Lesson>;
  requestQuiz: (topic: string) => Promise<Quiz>;
  submitAnswer: (quizId: string, answer: string) => Promise<any>;
  getSkillMap: () => Promise<SkillMapData>;
  updateProgress: (progress: Partial<LearningProgress>) => void;
  clearError: () => void;
}

export const useLearningStore = create<LearningState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        sidebarOpen: false,
        currentLesson: null,
        currentQuiz: null,
        learningProgress: [],
        skillMap: null,
        isLoading: false,
        error: null,

        // Actions
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        initializeLearning: async (userId: number) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.post('/api/init_learning/');
            set({ isLoading: false });
            return response.data;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || 'Failed to initialize learning',
            });
            throw error;
          }
        },

        getLesson: async (lessonId: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get(`/api/get_lesson/${lessonId}/`);
            const lesson = response.data.data;
            set({
              currentLesson: lesson,
              isLoading: false,
            });
            return lesson;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || 'Failed to load lesson',
            });
            throw error;
          }
        },

        requestQuiz: async (topic: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get(`/api/request_quiz/${topic}/`);
            const quiz = response.data.data;
            set({
              currentQuiz: quiz,
              isLoading: false,
            });
            return quiz;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || 'Failed to generate quiz',
            });
            throw error;
          }
        },

        submitAnswer: async (quizId: string, answer: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.post('/api/submit_answer/', {
              quiz_id: quizId,
              answer,
            });
            set({ isLoading: false });
            return response.data;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || 'Failed to submit answer',
            });
            throw error;
          }
        },

        getSkillMap: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get('/api/skill_map/');
            const skillMap = response.data.data;
            set({
              skillMap,
              isLoading: false,
            });
            return skillMap;
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.message || 'Failed to load skill map',
            });
            throw error;
          }
        },

        updateProgress: (progress: Partial<LearningProgress>) => {
          set((state) => ({
            learningProgress: state.learningProgress.map((p) =>
              p.id === progress.id ? { ...p, ...progress } : p
            ),
          }));
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'learning-storage',
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'learning-store',
    }
  )
);