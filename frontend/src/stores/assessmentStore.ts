// Assessment Store - Zustand store for assessment state management

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { assessmentService, Quiz, QuizAttempt, AssessmentStats } from '../services/assessmentService';

interface AssessmentState {
  // State
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  stats: AssessmentStats | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  
  // Selected quiz for detailed view
  selectedQuiz: Quiz | null;
  
  // Filters
  difficultyFilter: string;
  statusFilter: string;
  searchFilter: string;
}

interface AssessmentActions {
  // Data fetching
  fetchQuizzes: () => Promise<void>;
  fetchUserAttempts: () => Promise<void>;
  fetchAssessmentStats: () => Promise<void>;
  fetchQuiz: (quizId: string) => Promise<void>;
  
  // Quiz management
  createQuiz: (quizData: any) => Promise<Quiz>;
  updateQuiz: (quizId: string, updateData: any) => Promise<Quiz>;
  deleteQuiz: (quizId: string) => Promise<void>;
  
  // Quiz attempts
  submitAttempt: (quizId: string, answers: Record<string, string | string[]>) => Promise<QuizAttempt>;
  
  // Filter management
  setDifficultyFilter: (difficulty: string) => void;
  setStatusFilter: (status: string) => void;
  setSearchFilter: (search: string) => void;
  clearFilters: () => void;
  
  // UI state management
  setSelectedQuiz: (quiz: Quiz | null) => void;
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Computed values
  getFilteredQuizzes: () => Quiz[];
  getQuizStatus: (quizId: string) => string;
  getBestScore: (quizId: string) => number;
  getAttemptsRemaining: (quizId: string) => number;
  getQuizProgress: (quizId: string) => number;
}

type AssessmentStore = AssessmentState & AssessmentActions;

const initialState: AssessmentState = {
  quizzes: [],
  attempts: [],
  stats: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  selectedQuiz: null,
  difficultyFilter: 'all',
  statusFilter: 'all',
  searchFilter: ''
};

export const useAssessmentStore = create<AssessmentStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Data fetching actions
      fetchQuizzes: async () => {
        set({ isLoading: true, error: null });
        try {
          const quizzes = await assessmentService.getQuizzes();
          set({ quizzes, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch quizzes',
            isLoading: false 
          });
        }
      },

      fetchUserAttempts: async () => {
        try {
          const attempts = await assessmentService.getUserAttempts();
          set({ attempts });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch attempts'
          });
        }
      },

      fetchAssessmentStats: async () => {
        try {
          const stats = await assessmentService.getAssessmentStats();
          set({ stats });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch stats'
          });
        }
      },

      fetchQuiz: async (quizId: string) => {
        set({ isLoading: true, error: null });
        try {
          const quiz = await assessmentService.getQuiz(quizId);
          set({ selectedQuiz: quiz, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch quiz',
            isLoading: false 
          });
        }
      },

      // Quiz management actions
      createQuiz: async (quizData) => {
        set({ isSubmitting: true, error: null });
        try {
          const newQuiz = await assessmentService.createQuiz(quizData);
          set(state => ({
            quizzes: [...state.quizzes, newQuiz],
            isSubmitting: false
          }));
          return newQuiz;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create quiz',
            isSubmitting: false 
          });
          throw error;
        }
      },

      updateQuiz: async (quizId, updateData) => {
        set({ isSubmitting: true, error: null });
        try {
          const updatedQuiz = await assessmentService.updateQuiz(quizId, updateData);
          set(state => ({
            quizzes: state.quizzes.map(q => q.id === quizId ? updatedQuiz : q),
            selectedQuiz: state.selectedQuiz?.id === quizId ? updatedQuiz : state.selectedQuiz,
            isSubmitting: false
          }));
          return updatedQuiz;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update quiz',
            isSubmitting: false 
          });
          throw error;
        }
      },

      deleteQuiz: async (quizId) => {
        set({ isSubmitting: true, error: null });
        try {
          await assessmentService.deleteQuiz(quizId);
          set(state => ({
            quizzes: state.quizzes.filter(q => q.id !== quizId),
            attempts: state.attempts.filter(a => a.quiz !== quizId),
            selectedQuiz: state.selectedQuiz?.id === quizId ? null : state.selectedQuiz,
            isSubmitting: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete quiz',
            isSubmitting: false 
          });
          throw error;
        }
      },

      // Quiz attempt submission
      submitAttempt: async (quizId, answers) => {
        set({ isSubmitting: true, error: null });
        try {
          const attempt = await assessmentService.submitAttempt(quizId, answers);
          set(state => ({
            attempts: [...state.attempts, attempt],
            isSubmitting: false
          }));
          
          // Refresh stats after successful submission
          get().fetchAssessmentStats();
          
          return attempt;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to submit attempt',
            isSubmitting: false 
          });
          throw error;
        }
      },

      // Filter management
      setDifficultyFilter: (difficulty) => set({ difficultyFilter: difficulty }),
      setStatusFilter: (status) => set({ statusFilter: status }),
      setSearchFilter: (search) => set({ searchFilter: search }),
      clearFilters: () => set({
        difficultyFilter: 'all',
        statusFilter: 'all',
        searchFilter: ''
      }),

      // UI state management
      setSelectedQuiz: (quiz) => set({ selectedQuiz: quiz }),
      setLoading: (loading) => set({ isLoading: loading }),
      setSubmitting: (submitting) => set({ isSubmitting: submitting }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Computed values
      getFilteredQuizzes: () => {
        const state = get();
        let filtered = [...state.quizzes];

        // Apply difficulty filter
        if (state.difficultyFilter !== 'all') {
          filtered = filtered.filter(quiz => quiz.difficulty === state.difficultyFilter);
        }

        // Apply search filter
        if (state.searchFilter) {
          const searchTerm = state.searchFilter.toLowerCase();
          filtered = filtered.filter(quiz =>
            quiz.title.toLowerCase().includes(searchTerm) ||
            quiz.description.toLowerCase().includes(searchTerm)
          );
        }

        // Apply status filter
        if (state.statusFilter !== 'all') {
          filtered = filtered.filter(quiz => {
            const quizAttempts = state.attempts.filter(a => a.quiz === quiz.id);
            
            switch (state.statusFilter) {
              case 'completed':
                return quizAttempts.some(a => a.passed);
              case 'in_progress':
                return quizAttempts.some(a => !a.passed);
              case 'not_started':
                return quizAttempts.length === 0;
              default:
                return true;
            }
          });
        }

        return filtered;
      },

      getQuizStatus: (quizId) => {
        const state = get();
        const quizAttempts = state.attempts.filter(a => a.quiz === quizId);
        
        if (quizAttempts.length === 0) return 'not_started';
        
        const bestAttempt = quizAttempts.reduce((best, current) => 
          current.percentage > best.percentage ? current : best
        );
        
        return bestAttempt.passed ? 'completed' : 'in_progress';
      },

      getBestScore: (quizId) => {
        const state = get();
        const quizAttempts = state.attempts.filter(a => a.quiz === quizId);
        if (quizAttempts.length === 0) return 0;
        
        return Math.max(...quizAttempts.map(a => a.percentage));
      },

      getAttemptsRemaining: (quizId) => {
        const state = get();
        const quiz = state.quizzes.find(q => q.id === quizId);
        if (!quiz) return 0;
        
        const quizAttempts = state.attempts.filter(a => a.quiz === quizId);
        return Math.max(0, quiz.max_attempts - quizAttempts.length);
      },

      getQuizProgress: (quizId) => {
        const state = get();
        const quizAttempts = state.attempts.filter(a => a.quiz === quizId);
        const quiz = state.quizzes.find(q => q.id === quizId);
        if (!quiz) return 0;
        
        return (quizAttempts.length / quiz.max_attempts) * 100;
      }
    }),
    {
      name: 'assessment-store'
    }
  )
);

// Selectors for common use cases
export const selectQuizzes = (state: AssessmentStore) => state.quizzes;
export const selectQuizAttempts = (state: AssessmentStore) => state.attempts;
export const selectAssessmentLoading = (state: AssessmentStore) => state.isLoading;
export const selectAssessmentSubmitting = (state: AssessmentStore) => state.isSubmitting;
export const selectAssessmentError = (state: AssessmentStore) => state.error;
export const selectAssessmentStats = (state: AssessmentStore) => state.stats;
export const selectSelectedQuiz = (state: AssessmentStore) => state.selectedQuiz;
export const selectFilters = (state: AssessmentStore) => ({
  difficulty: state.difficultyFilter,
  status: state.statusFilter,
  search: state.searchFilter
});

// Helper hooks
export const useAssessmentFilters = () => {
  const { difficultyFilter, statusFilter, searchFilter, setDifficultyFilter, setStatusFilter, setSearchFilter, clearFilters } = useAssessmentStore();
  return {
    difficulty: difficultyFilter,
    status: statusFilter,
    search: searchFilter,
    setDifficulty: setDifficultyFilter,
    setStatus: setStatusFilter,
    setSearch: setSearchFilter,
    clearAll: clearFilters
  };
};

export const useAssessmentData = () => {
  const { quizzes, attempts, stats, selectedQuiz } = useAssessmentStore();
  return { quizzes, attempts, stats, selectedQuiz };
};

export const useAssessmentActions = () => {
  const store = useAssessmentStore();
  return {
    fetchQuizzes: store.fetchQuizzes,
    fetchUserAttempts: store.fetchUserAttempts,
    fetchAssessmentStats: store.fetchAssessmentStats,
    submitAttempt: store.submitAttempt,
    createQuiz: store.createQuiz,
    updateQuiz: store.updateQuiz,
    deleteQuiz: store.deleteQuiz
  };
};