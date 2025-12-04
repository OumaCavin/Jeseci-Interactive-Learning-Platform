// Admin Store for JAC Learning Platform
// Enhanced by Cavin Otieno

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  completedCourses: number;
  averageScore: number;
  userGrowth: number;
  engagementRate: number;
  lastUpdated: Date;
}

export interface AdminActivity {
  id: string;
  type: 'user_registration' | 'course_completion' | 'login' | 'error';
  description: string;
  userId?: string;
  timestamp: Date;
  metadata?: any;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: Date;
  status: 'active' | 'inactive' | 'suspended';
  progress: number;
}

export interface AdminContent {
  id: string;
  title: string;
  type: 'course' | 'lesson' | 'quiz';
  status: 'published' | 'draft' | 'archived';
  author: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  completionRate: number;
}

export interface AdminAnalytics {
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  generatedAt: Date;
  completionTrends: any[];
  userEngagement: any[];
  performanceMetrics: any[];
  revenueAnalytics: any[];
  userSegmentation: any;
  aiInsights: string;
}

export interface AdminAgent {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  type: 'orchestrator' | 'content_curator' | 'quiz_master' | 'evaluator' | 'progress_tracker' | 'motivator';
  lastActivity: Date;
  performance: number;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  databaseStatus: string;
  lastCheck: Date;
}

interface AdminState {
  stats: AdminStats | null;
  activity: AdminActivity[];
  users: AdminUser[];
  content: AdminContent[];
  analytics: AdminAnalytics | null;
  agents: AdminAgent[];
  systemHealth: SystemHealth | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchStats: () => Promise<void>;
  fetchActivity: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchContent: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchAgents: () => Promise<void>;
  fetchSystemHealth: () => Promise<void>;
  refreshAll: () => Promise<void>;

  // Mock data generators
  generateMockStats: () => AdminStats;
  generateMockActivity: () => AdminActivity[];
  generateMockUsers: () => AdminUser[];
  generateMockContent: () => AdminContent[];
  generateMockAnalytics: () => AdminAnalytics;
  generateMockAgents: () => AdminAgent[];
  generateMockSystemHealth: () => SystemHealth;
}

const mockData = {
  generateMockStats: (): AdminStats => ({
    totalUsers: 1247,
    activeUsers: 892,
    totalCourses: 156,
    completedCourses: 89,
    averageScore: 87.5,
    userGrowth: 12.3,
    engagementRate: 78.9,
    lastUpdated: new Date()
  }),

  generateMockActivity: (): AdminActivity[] => [
    {
      id: '1',
      type: 'user_registration',
      description: 'New user registered',
      userId: 'user123',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'course_completion',
      description: 'User completed "React Fundamentals"',
      userId: 'user456',
      timestamp: new Date()
    }
  ],

  generateMockUsers: (): AdminUser[] => [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student',
      lastLogin: new Date(),
      status: 'active',
      progress: 65
    }
  ],

  generateMockContent: (): AdminContent[] => [
    {
      id: '1',
      title: 'React Fundamentals',
      type: 'course',
      status: 'published',
      author: 'Jane Smith',
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 1245,
      completionRate: 78
    }
  ],

  generateMockAnalytics: (): AdminAnalytics => ({
    timeframe: 'month',
    generatedAt: new Date(),
    completionTrends: [],
    userEngagement: [],
    performanceMetrics: [],
    revenueAnalytics: [],
    userSegmentation: {},
    aiInsights: 'AI-powered analytics insights will appear here.'
  }),

  generateMockAgents: (): AdminAgent[] => [
    {
      id: '1',
      name: 'Content Curator',
      status: 'active',
      type: 'content_curator',
      lastActivity: new Date(),
      performance: 95
    }
  ],

  generateMockSystemHealth: (): SystemHealth => ({
    status: 'healthy',
    uptime: 99.9,
    cpuUsage: 45.2,
    memoryUsage: 67.8,
    diskUsage: 34.1,
    databaseStatus: 'connected',
    lastCheck: new Date()
  })
};

export const useAdminStore = create<AdminState>()(
  devtools(
    (set, get) => ({
      stats: null,
      activity: [],
      users: [],
      content: [],
      analytics: null,
      agents: [],
      systemHealth: null,
      loading: false,
      error: null,

      fetchStats: async () => {
        try {
          set({ loading: true, error: null });
          const statsResponse = await fetch('/api/admin/stats');
          
          const stats = statsResponse.status === 'fulfilled' ? 
            (await statsResponse.json()).data : 
            get().generateMockStats();

          set({ stats, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch stats', loading: false });
        }
      },

      fetchActivity: async () => {
        try {
          set({ loading: true, error: null });
          const activityResponse = await fetch('/api/admin/activity');
          
          const activity = activityResponse.status === 'fulfilled' ? 
            (await activityResponse.json()).data : 
            get().generateMockActivity();

          set({ activity, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch activity', loading: false });
        }
      },

      fetchUsers: async () => {
        try {
          set({ loading: true, error: null });
          const usersResponse = await fetch('/api/admin/users');
          
          const users = usersResponse.status === 'fulfilled' ? 
            (await usersResponse.json()).data : 
            get().generateMockUsers();

          set({ users, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch users', loading: false });
        }
      },

      fetchContent: async () => {
        try {
          set({ loading: true, error: null });
          const contentResponse = await fetch('/api/admin/content');
          
          const content = contentResponse.status === 'fulfilled' ? 
            (await contentResponse.json()).data : 
            get().generateMockContent();

          set({ content, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch content', loading: false });
        }
      },

      fetchAnalytics: async () => {
        try {
          set({ loading: true, error: null });
          const analyticsResponse = await fetch('/api/admin/analytics');
          
          const analytics = analyticsResponse.status === 'fulfilled' ? 
            (await analyticsResponse.json()).data : 
            get().generateMockAnalytics();

          set({ analytics, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch analytics', loading: false });
        }
      },

      fetchAgents: async () => {
        try {
          set({ loading: true, error: null });
          const agentsResponse = await fetch('/api/admin/agents');
          
          const agents = agentsResponse.status === 'fulfilled' ? 
            (await agentsResponse.json()).data : 
            get().generateMockAgents();

          set({ agents, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch agents', loading: false });
        }
      },

      fetchSystemHealth: async () => {
        try {
          set({ loading: true, error: null });
          const healthResponse = await fetch('/api/admin/health');
          
          const systemHealth = healthResponse.status === 'fulfilled' ? 
            (await healthResponse.json()).data : 
            get().generateMockSystemHealth();

          set({ systemHealth, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch system health', loading: false });
        }
      },

      refreshAll: async () => {
        await Promise.all([
          get().fetchStats(),
          get().fetchActivity(),
          get().fetchUsers(),
          get().fetchContent(),
          get().fetchAnalytics(),
          get().fetchAgents(),
          get().fetchSystemHealth()
        ]);
      },

      // Mock data generators
      generateMockStats: mockData.generateMockStats,
      generateMockActivity: mockData.generateMockActivity,
      generateMockUsers: mockData.generateMockUsers,
      generateMockContent: mockData.generateMockContent,
      generateMockAnalytics: mockData.generateMockAnalytics,
      generateMockAgents: mockData.generateMockAgents,
      generateMockSystemHealth: mockData.generateMockSystemHealth
    }),
    { name: 'admin-store' }
  )
);
