import api from './api';

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number; // in minutes
  modules_count: number;
  rating: number;
  thumbnail?: string;
  tags: string[];
  prerequisites?: string[];
  learning_objectives?: string[];
  created_at: string;
  updated_at: string;
  is_featured?: boolean;
  is_published?: boolean;
  enrollment_count?: number;
  completion_rate?: number;
}

export interface CreateLearningPathData {
  title: string;
  description: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number;
  modules_count: number;
  tags?: string[];
  prerequisites?: string[];
  learning_objectives?: string[];
  thumbnail?: string;
}

export interface UpdateLearningPathData extends Partial<CreateLearningPathData> {
  is_published?: boolean;
  is_featured?: boolean;
}

export interface Module {
  id: number;
  learning_path: string;
  title: string;
  description: string;
  content: string;
  order_index: number;
  estimated_duration: number; // minutes
  module_type: 'lesson' | 'exercise' | 'assessment';
  prerequisites: number[];
  created_at: string;
  updated_at: string;
}

export interface ModuleProgress {
  id: number;
  status: 'not_started' | 'in_progress' | 'completed';
  time_spent: number;
  attempts: number;
  score?: number;
  last_accessed: string;
  completed_at?: string;
}

export interface LearningPathProgress {
  overall_progress: number;
  completed_modules: number;
  total_modules: number;
  time_spent: number;
  average_score: number;
  last_accessed: string;
}

class LearningService {
  // Get all learning paths with optional filters
  async getLearningPaths(filters?: {
    difficulty?: string[];
    tags?: string[];
    is_featured?: boolean;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<LearningPath[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.difficulty && filters.difficulty.length > 0) {
          params.append('difficulty', filters.difficulty.join(','));
        }
        if (filters.tags && filters.tags.length > 0) {
          params.append('tags', filters.tags.join(','));
        }
        if (filters.is_featured !== undefined) {
          params.append('featured', filters.is_featured.toString());
        }
        if (filters.search) {
          params.append('search', filters.search);
        }
        if (filters.sort_by) {
          params.append('sort_by', filters.sort_by);
        }
        if (filters.sort_order) {
          params.append('sort_order', filters.sort_order);
        }
        if (filters.page) {
          params.append('page', filters.page.toString());
        }
        if (filters.limit) {
          params.append('limit', filters.limit.toString());
        }
      }

      const response = await api.get(`/learning-paths?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch learning paths:', error);
      
      // Return mock data for development/demo
      return this.getMockLearningPaths();
    }
  }

  // Get single learning path by ID
  async getLearningPath(id: string): Promise<LearningPath> {
    try {
      const response = await api.get(`/learning-paths/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch learning path:', error);
      throw error;
    }
  }

  // Create new learning path
  async createLearningPath(data: CreateLearningPathData): Promise<LearningPath> {
    try {
      const response = await api.post('/learning-paths', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create learning path:', error);
      throw error;
    }
  }

  // Update learning path
  async updateLearningPath(id: string, data: UpdateLearningPathData): Promise<LearningPath> {
    try {
      const response = await api.put(`/learning-paths/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update learning path:', error);
      throw error;
    }
  }

  // Delete learning path
  async deleteLearningPath(id: string): Promise<void> {
    try {
      await api.delete(`/learning-paths/${id}`);
    } catch (error) {
      console.error('Failed to delete learning path:', error);
      throw error;
    }
  }

  // Enroll in learning path
  async enrollInPath(pathId: string): Promise<void> {
    try {
      await api.post(`/learning-paths/${pathId}/enroll`);
    } catch (error) {
      console.error('Failed to enroll in learning path:', error);
      throw error;
    }
  }

  // Get user's enrolled learning paths
  async getEnrolledPaths(): Promise<LearningPath[]> {
    try {
      const response = await api.get('/learning-paths/enrolled');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch enrolled paths:', error);
      return [];
    }
  }

  // Get learning path progress
  async getProgress(pathId: string): Promise<{
    completed_modules: number;
    total_modules: number;
    completion_percentage: number;
    time_spent: number;
    last_accessed: string;
  }> {
    try {
      const response = await api.get(`/learning-paths/${pathId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      throw error;
    }
  }

  // Mark module as completed
  async markModuleCompleted(pathId: string, moduleId: string): Promise<void> {
    try {
      await api.post(`/learning-paths/${pathId}/modules/${moduleId}/complete`);
    } catch (error) {
      console.error('Failed to mark module as completed:', error);
      throw error;
    }
  }

  // Get learning path analytics (for admin/instructors)
  async getPathAnalytics(pathId: string): Promise<{
    enrollment_count: number;
    completion_rate: number;
    average_rating: number;
    average_completion_time: number;
    student_feedback: Array<{
      rating: number;
      comment: string;
      created_at: string;
    }>;
  }> {
    try {
      const response = await api.get(`/learning-paths/${pathId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch path analytics:', error);
      throw error;
    }
  }

  // Get modules for a learning path
  async getModules(pathId: string): Promise<Module[]> {
    try {
      const response = await api.get(`/learning-paths/${pathId}/modules`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      // Return mock data for development/demo
      return this.getMockModules(pathId);
    }
  }

  // Get user progress for a learning path
  async getPathProgress(pathId: string): Promise<ModuleProgress[]> {
    try {
      const response = await api.get(`/learning-paths/${pathId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch path progress:', error);
      // Return mock data for development/demo
      return this.getMockProgress();
    }
  }

  // Get overall learning path progress
  async getLearningPathProgress(pathId: string): Promise<LearningPathProgress> {
    try {
      const response = await api.get(`/learning-paths/${pathId}/overview-progress`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch learning path progress:', error);
      throw error;
    }
  }

  // Start/resume a module
  async startModule(pathId: string, moduleId: string): Promise<void> {
    try {
      await api.post(`/learning-paths/${pathId}/modules/${moduleId}/start`);
    } catch (error) {
      console.error('Failed to start module:', error);
      throw error;
    }
  }

  // Get module content
  async getModuleContent(pathId: string, moduleId: string): Promise<Module> {
    try {
      const response = await api.get(`/learning-paths/${pathId}/modules/${moduleId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch module content:', error);
      throw error;
    }
  }

  // Get related learning paths
  async getRelatedPaths(pathId: string): Promise<LearningPath[]> {
    try {
      const response = await api.get(`/learning-paths/${pathId}/related`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch related paths:', error);
      return [];
    }
  }

  // Mock data for development/demo purposes
  private getMockModules(pathId: string): Module[] {
    const baseModules = [
      {
        id: 1,
        learning_path: pathId,
        title: 'Introduction to JAC Programming',
        description: 'Learn the basics of JAC programming language, syntax, and fundamental concepts.',
        content: 'JAC (JavaScript Augmented for Classes) is a modern programming language...',
        order_index: 1,
        estimated_duration: 30,
        module_type: 'lesson' as const,
        prerequisites: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        learning_path: pathId,
        title: 'Variables and Data Types',
        description: 'Master variable declaration, data types, and type conversions in JAC.',
        content: 'Variables are containers for storing data values. In JAC, we have several data types...',
        order_index: 2,
        estimated_duration: 45,
        module_type: 'lesson' as const,
        prerequisites: [1],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        learning_path: pathId,
        title: 'Control Structures',
        description: 'Learn about conditional statements, loops, and flow control in JAC.',
        content: 'Control structures help you control the flow of your program...',
        order_index: 3,
        estimated_duration: 60,
        module_type: 'lesson' as const,
        prerequisites: [2],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        learning_path: pathId,
        title: 'Functions and Scope',
        description: 'Create reusable code blocks with functions and understand scope rules.',
        content: 'Functions are fundamental building blocks in JAC programming...',
        order_index: 4,
        estimated_duration: 50,
        module_type: 'exercise' as const,
        prerequisites: [3],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        learning_path: pathId,
        title: 'Arrays and Collections',
        description: 'Work with collections of data using arrays and other collection types.',
        content: 'Arrays help you store multiple values in a single variable...',
        order_index: 5,
        estimated_duration: 40,
        module_type: 'lesson' as const,
        prerequisites: [4],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 6,
        learning_path: pathId,
        title: 'Object-Oriented Programming',
        description: 'Learn OOP concepts including classes, objects, inheritance, and polymorphism.',
        content: 'Object-oriented programming helps you organize code into reusable objects...',
        order_index: 6,
        estimated_duration: 90,
        module_type: 'lesson' as const,
        prerequisites: [5],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 7,
        learning_path: pathId,
        title: 'Error Handling and Debugging',
        description: 'Master error handling, debugging techniques, and best practices.',
        content: 'Learning to handle errors gracefully is crucial for robust applications...',
        order_index: 7,
        estimated_duration: 75,
        module_type: 'assessment' as const,
        prerequisites: [6],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 8,
        learning_path: pathId,
        title: 'Final Project: Build a Complete Application',
        description: 'Apply everything you learned to build a comprehensive JAC application.',
        content: 'In this final project, you will create a complete application...',
        order_index: 8,
        estimated_duration: 120,
        module_type: 'exercise' as const,
        prerequisites: [7],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    return baseModules;
  }

  private getMockProgress(): ModuleProgress[] {
    return [
      { id: 1, status: 'completed', time_spent: 35, attempts: 1, score: 95, last_accessed: '2025-11-20', completed_at: '2025-11-20' },
      { id: 2, status: 'completed', time_spent: 42, attempts: 1, score: 88, last_accessed: '2025-11-20', completed_at: '2025-11-20' },
      { id: 3, status: 'in_progress', time_spent: 15, attempts: 1, last_accessed: '2025-11-21' },
      { id: 4, status: 'not_started', time_spent: 0, attempts: 0, last_accessed: '' },
      { id: 5, status: 'not_started', time_spent: 0, attempts: 0, last_accessed: '' },
      { id: 6, status: 'not_started', time_spent: 0, attempts: 0, last_accessed: '' },
      { id: 7, status: 'not_started', time_spent: 0, attempts: 0, last_accessed: '' },
      { id: 8, status: 'not_started', time_spent: 0, attempts: 0, last_accessed: '' },
    ];
  }

  // Mock data for development/demo purposes
  private getMockLearningPaths(): LearningPath[] {
    return [
      {
        id: '1',
        title: 'JavaScript Fundamentals Mastery',
        description: 'Master the core concepts of JavaScript programming with hands-on exercises and real-world projects.',
        difficulty_level: 'beginner',
        estimated_duration: 480, // 8 hours
        modules_count: 12,
        rating: 4.8,
        tags: ['javascript', 'programming', 'web-development'],
        prerequisites: ['Basic computer literacy'],
        learning_objectives: [
          'Understand JavaScript syntax and core concepts',
          'Work with DOM manipulation',
          'Handle asynchronous operations',
          'Build interactive web applications'
        ],
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-11-20T14:30:00Z',
        is_featured: true,
        is_published: true,
        enrollment_count: 1247,
        completion_rate: 85.3
      },
      {
        id: '2',
        title: 'React Advanced Patterns',
        description: 'Dive deep into advanced React patterns including hooks, context, performance optimization, and testing.',
        difficulty_level: 'advanced',
        estimated_duration: 720, // 12 hours
        modules_count: 18,
        rating: 4.9,
        tags: ['react', 'javascript', 'frontend', 'hooks'],
        prerequisites: ['Solid React fundamentals', 'JavaScript ES6+'],
        learning_objectives: [
          'Master React Hooks and custom hooks',
          'Implement advanced state management',
          'Optimize React application performance',
          'Write comprehensive tests'
        ],
        created_at: '2024-02-10T09:00:00Z',
        updated_at: '2024-11-25T16:45:00Z',
        is_featured: true,
        is_published: true,
        enrollment_count: 856,
        completion_rate: 78.2
      },
      {
        id: '3',
        title: 'TypeScript for Modern Development',
        description: 'Learn TypeScript from basics to advanced concepts, including generics, decorators, and type manipulation.',
        difficulty_level: 'intermediate',
        estimated_duration: 600, // 10 hours
        modules_count: 15,
        rating: 4.7,
        tags: ['typescript', 'javascript', 'type-safety'],
        prerequisites: ['JavaScript fundamentals'],
        learning_objectives: [
          'Understand TypeScript type system',
          'Implement interfaces and generics',
          'Use advanced TypeScript features',
          'Integrate TypeScript in existing projects'
        ],
        created_at: '2024-03-05T11:00:00Z',
        updated_at: '2024-11-28T10:20:00Z',
        is_featured: false,
        is_published: true,
        enrollment_count: 634,
        completion_rate: 82.1
      },
      {
        id: '4',
        title: 'Node.js Backend Development',
        description: 'Build scalable backend applications with Node.js, Express, and modern database technologies.',
        difficulty_level: 'intermediate',
        estimated_duration: 840, // 14 hours
        modules_count: 20,
        rating: 4.6,
        tags: ['nodejs', 'backend', 'express', 'api'],
        prerequisites: ['JavaScript fundamentals', 'Basic database knowledge'],
        learning_objectives: [
          'Build RESTful APIs with Express',
          'Work with databases (MongoDB, PostgreSQL)',
          'Implement authentication and authorization',
          'Deploy Node.js applications'
        ],
        created_at: '2024-04-12T08:30:00Z',
        updated_at: '2024-11-30T12:15:00Z',
        is_featured: true,
        is_published: true,
        enrollment_count: 923,
        completion_rate: 74.8
      },
      {
        id: '5',
        title: 'CSS Flexbox and Grid Mastery',
        description: 'Master modern CSS layout techniques with Flexbox and CSS Grid for responsive web design.',
        difficulty_level: 'beginner',
        estimated_duration: 360, // 6 hours
        modules_count: 10,
        rating: 4.5,
        tags: ['css', 'layout', 'responsive-design'],
        prerequisites: ['Basic HTML and CSS'],
        learning_objectives: [
          'Master Flexbox layout system',
          'Implement complex layouts with CSS Grid',
          'Create responsive designs',
          'Optimize CSS for performance'
        ],
        created_at: '2024-05-20T13:00:00Z',
        updated_at: '2024-11-22T09:45:00Z',
        is_featured: false,
        is_published: true,
        enrollment_count: 1089,
        completion_rate: 89.4
      },
      {
        id: '6',
        title: 'Full Stack Development with MERN',
        description: 'Build complete web applications using MongoDB, Express, React, and Node.js stack.',
        difficulty_level: 'advanced',
        estimated_duration: 1200, // 20 hours
        modules_count: 25,
        rating: 4.8,
        tags: ['fullstack', 'mern', 'mongodb', 'express', 'react', 'nodejs'],
        prerequisites: ['React fundamentals', 'Node.js basics'],
        learning_objectives: [
          'Build full-stack applications',
          'Implement user authentication',
          'Handle file uploads and processing',
          'Deploy complete web applications'
        ],
        created_at: '2024-06-15T10:30:00Z',
        updated_at: '2024-12-01T15:20:00Z',
        is_featured: true,
        is_published: true,
        enrollment_count: 567,
        completion_rate: 71.6
      }
    ];
  }
}

export const learningService = new LearningService();