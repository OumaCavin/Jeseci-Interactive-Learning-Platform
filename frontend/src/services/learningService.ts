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