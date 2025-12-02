// Assessment Service - API integration for assessment functionality

export interface Quiz {
  id: string;
  title: string;
  description: string;
  learning_path?: string;
  module?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit?: number; // in minutes
  max_attempts: number;
  passing_score: number;
  questionCount: number;
  totalPoints: number;
  questions?: QuizQuestion[];
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  points: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeTaken: number; // in minutes
  startedAt: string;
  completedAt: string;
  attemptNumber: number;
  difficulty: 'easy' | 'medium' | 'hard';
  time_taken: number; // API field name
  quiz: string; // API field name
  max_score: number; // API field name
  completed_at?: string;
  started_at?: string;
}

export interface AssessmentStats {
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  totalTimeSpent: string;
  currentStreak: number;
  bestScore: number;
  passRate: number;
  improvement: number;
}

export interface CreateQuizData {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit?: number;
  max_attempts: number;
  passing_score: number;
  questions: QuizQuestion[];
  learning_path?: string;
  module?: string;
}

export interface UpdateQuizData extends Partial<CreateQuizData> {
  is_published?: boolean;
}

class AssessmentService {
  // Mock data for development
  private mockQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'React Fundamentals',
      description: 'Test your knowledge of React basics including components, props, and state',
      difficulty: 'easy',
      time_limit: 30,
      max_attempts: 3,
      passing_score: 70,
      questionCount: 10,
      totalPoints: 100,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T15:30:00Z',
      questions: [
        {
          id: 'q1',
          question: 'What is React?',
          options: [
            'A JavaScript library for building user interfaces',
            'A database management system',
            'A CSS framework',
            'A programming language'
          ],
          correct: 0,
          points: 10,
          explanation: 'React is a JavaScript library for building user interfaces.'
        }
      ]
    },
    {
      id: '2',
      title: 'Advanced JavaScript Concepts',
      description: 'Deep dive into closures, prototypes, and async programming',
      difficulty: 'hard',
      time_limit: 45,
      max_attempts: 2,
      passing_score: 80,
      questionCount: 15,
      totalPoints: 150,
      created_at: '2024-01-18T09:00:00Z',
      updated_at: '2024-01-22T11:45:00Z'
    },
    {
      id: '3',
      title: 'CSS Flexbox and Grid',
      description: 'Master modern CSS layout techniques',
      difficulty: 'medium',
      time_limit: 25,
      max_attempts: 3,
      passing_score: 75,
      questionCount: 8,
      totalPoints: 80,
      created_at: '2024-01-20T14:00:00Z',
      updated_at: '2024-01-25T16:20:00Z'
    },
    {
      id: '4',
      title: 'TypeScript Basics',
      description: 'Learn TypeScript fundamentals and type safety',
      difficulty: 'medium',
      time_limit: 35,
      max_attempts: 3,
      passing_score: 75,
      questionCount: 12,
      totalPoints: 120,
      created_at: '2024-01-22T10:30:00Z',
      updated_at: '2024-01-27T13:15:00Z'
    },
    {
      id: '5',
      title: 'Node.js Fundamentals',
      description: 'Server-side JavaScript with Node.js',
      difficulty: 'medium',
      time_limit: 40,
      max_attempts: 2,
      passing_score: 80,
      questionCount: 10,
      totalPoints: 100,
      created_at: '2024-01-25T11:00:00Z',
      updated_at: '2024-01-30T09:45:00Z'
    }
  ];

  private mockAttempts: QuizAttempt[] = [
    {
      id: 'a1',
      quizId: '1',
      quiz: '1',
      quizTitle: 'React Fundamentals',
      score: 85,
      max_score: 100,
      percentage: 85,
      passed: true,
      timeTaken: 25,
      time_taken: 25,
      startedAt: '2024-01-28T10:00:00Z',
      completedAt: '2024-01-28T10:25:00Z',
      attemptNumber: 1,
      difficulty: 'easy'
    },
    {
      id: 'a2',
      quizId: '2',
      quiz: '2',
      quizTitle: 'Advanced JavaScript Concepts',
      score: 60,
      max_score: 100,
      percentage: 60,
      passed: false,
      timeTaken: 38,
      time_taken: 38,
      startedAt: '2024-01-29T14:00:00Z',
      completedAt: '2024-01-29T14:38:00Z',
      attemptNumber: 1,
      difficulty: 'hard'
    },
    {
      id: 'a3',
      quizId: '3',
      quiz: '3',
      quizTitle: 'CSS Flexbox and Grid',
      score: 72,
      max_score: 80,
      percentage: 90,
      passed: true,
      timeTaken: 22,
      time_taken: 22,
      startedAt: '2024-01-30T16:00:00Z',
      completedAt: '2024-01-30T16:22:00Z',
      attemptNumber: 1,
      difficulty: 'medium'
    },
    {
      id: 'a4',
      quizId: '1',
      quiz: '1',
      quizTitle: 'React Fundamentals',
      score: 95,
      max_score: 100,
      percentage: 95,
      passed: true,
      timeTaken: 18,
      time_taken: 18,
      startedAt: '2024-01-31T09:00:00Z',
      completedAt: '2024-01-31T09:18:00Z',
      attemptNumber: 2,
      difficulty: 'easy'
    }
  ];

  // Get all quizzes with optional filters
  async getQuizzes(filters?: {
    difficulty?: string[];
    search?: string;
    learning_path?: string;
    module?: string;
    page?: number;
    limit?: number;
  }): Promise<Quiz[]> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredQuizzes = [...this.mockQuizzes];

      if (filters) {
        if (filters.difficulty && filters.difficulty.length > 0) {
          filteredQuizzes = filteredQuizzes.filter(quiz => 
            filters.difficulty!.includes(quiz.difficulty)
          );
        }
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredQuizzes = filteredQuizzes.filter(quiz =>
            quiz.title.toLowerCase().includes(searchTerm) ||
            quiz.description.toLowerCase().includes(searchTerm)
          );
        }
        if (filters.learning_path) {
          filteredQuizzes = filteredQuizzes.filter(quiz => 
            quiz.learning_path === filters.learning_path
          );
        }
        if (filters.module) {
          filteredQuizzes = filteredQuizzes.filter(quiz => 
            quiz.module === filters.module
          );
        }
      }

      return filteredQuizzes;
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      throw new Error('Failed to fetch quizzes');
    }
  }

  // Get single quiz by ID
  async getQuiz(quizId: string): Promise<Quiz | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return this.mockQuizzes.find(quiz => quiz.id === quizId) || null;
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
      throw new Error('Failed to fetch quiz');
    }
  }

  // Get user's quiz attempts
  async getUserAttempts(userId?: string): Promise<QuizAttempt[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      return [...this.mockAttempts];
    } catch (error) {
      console.error('Failed to fetch user attempts:', error);
      throw new Error('Failed to fetch user attempts');
    }
  }

  // Submit quiz attempt
  async submitAttempt(quizId: string, answers: Record<string, string | string[]>): Promise<QuizAttempt> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const quiz = this.mockQuizzes.find(q => q.id === quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      // Calculate score (simplified for demo)
      const totalQuestions = quiz.questions?.length || 5;
      const correctAnswers = Math.floor(Math.random() * totalQuestions);
      const score = (correctAnswers / totalQuestions) * 100;
      const passed = score >= quiz.passing_score;
      const timeTaken = Math.floor(Math.random() * 30) + 10; // 10-40 minutes

      const newAttempt: QuizAttempt = {
        id: `a${Date.now()}`,
        quizId,
        quiz: quizId,
        quizTitle: quiz.title,
        score,
        max_score: 100,
        percentage: score,
        passed,
        timeTaken,
        time_taken: timeTaken,
        startedAt: new Date(Date.now() - timeTaken * 60000).toISOString(),
        completedAt: new Date().toISOString(),
        attemptNumber: this.mockAttempts.filter(a => a.quiz === quizId).length + 1,
        difficulty: quiz.difficulty
      };

      this.mockAttempts.push(newAttempt);
      return newAttempt;
    } catch (error) {
      console.error('Failed to submit attempt:', error);
      throw new Error('Failed to submit attempt');
    }
  }

  // Get assessment statistics
  async getAssessmentStats(userId?: string): Promise<AssessmentStats> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const attempts = this.mockAttempts;
      const totalQuizzes = this.mockQuizzes.length;
      const completedQuizzes = new Set(attempts.filter(a => a.passed).map(a => a.quiz)).size;
      const averageScore = attempts.length > 0 
        ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
        : 0;
      const totalTimeSpent = Math.round(attempts.reduce((sum, a) => sum + a.time_taken, 0) / 60);
      const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0;
      const passRate = attempts.length > 0 
        ? Math.round((attempts.filter(a => a.passed).length / attempts.length) * 100)
        : 0;

      return {
        totalQuizzes,
        completedQuizzes,
        averageScore,
        totalTimeSpent: totalTimeSpent > 0 ? `${Math.floor(totalTimeSpent / 60)}h ${totalTimeSpent % 60}m` : '0m',
        currentStreak: 3, // TODO: Calculate actual streak
        bestScore,
        passRate,
        improvement: 12 // TODO: Calculate improvement
      };
    } catch (error) {
      console.error('Failed to fetch assessment stats:', error);
      throw new Error('Failed to fetch assessment stats');
    }
  }

  // Create new quiz
  async createQuiz(quizData: CreateQuizData): Promise<Quiz> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newQuiz: Quiz = {
        id: `q${Date.now()}`,
        ...quizData,
        questionCount: quizData.questions.length,
        totalPoints: quizData.questions.reduce((sum, q) => sum + q.points, 0),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      this.mockQuizzes.push(newQuiz);
      return newQuiz;
    } catch (error) {
      console.error('Failed to create quiz:', error);
      throw new Error('Failed to create quiz');
    }
  }

  // Update quiz
  async updateQuiz(quizId: string, updateData: UpdateQuizData): Promise<Quiz> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const quizIndex = this.mockQuizzes.findIndex(q => q.id === quizId);
      if (quizIndex === -1) {
        throw new Error('Quiz not found');
      }

      const updatedQuiz = {
        ...this.mockQuizzes[quizIndex],
        ...updateData,
        updated_at: new Date().toISOString()
      };

      this.mockQuizzes[quizIndex] = updatedQuiz;
      return updatedQuiz;
    } catch (error) {
      console.error('Failed to update quiz:', error);
      throw new Error('Failed to update quiz');
    }
  }

  // Delete quiz
  async deleteQuiz(quizId: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const quizIndex = this.mockQuizzes.findIndex(q => q.id === quizId);
      if (quizIndex === -1) {
        throw new Error('Quiz not found');
      }

      this.mockQuizzes.splice(quizIndex, 1);
      this.mockAttempts = this.mockAttempts.filter(a => a.quiz !== quizId);
    } catch (error) {
      console.error('Failed to delete quiz:', error);
      throw new Error('Failed to delete quiz');
    }
  }
}

export const assessmentService = new AssessmentService();