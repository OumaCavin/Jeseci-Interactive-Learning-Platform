import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient as api } from '../services/api';

export interface AdminStats {
  totalUsers: number;
  totalPaths: number;
  totalModules: number;
  totalLessons: number;
  activeUsers: number;
  completionRate: number;
  totalSessions: number;
  avgStudyTime: number;
  systemHealth: number;
  activeAgents: number;
  totalAgents: number;
  agentTasks: number;
  responseTime: number;
}

export interface RecentActivity {
  id: string;
  type: 'user_registration' | 'path_completion' | 'module_completion' | 'agent_action' | 'system_alert';
  message: string;
  timestamp: string;
  user?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'idle' | 'busy' | 'active' | 'error' | 'offline';
  description: string;
  tasks: number;
  uptime: number;
  performance: number;
  responseTime: number;
  lastActive: string;
  health_score: number;
  queue_size: number;
  uptime_hours: number;
  capabilities: string[];
  config: Record<string, any>;
}

export interface SystemHealth {
  overall_status: 'healthy' | 'degraded' | 'unhealthy' | 'offline';
  health_score: number;
  active_sessions: number;
  system_metrics: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_latency: number;
  };
  agents: Record<string, {
    status: string;
    last_active: string;
    queue_size: number;
    uptime_hours: number;
    health_score: number;
  }>;
}

export interface UserManagement {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'instructor' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  totalPoints: number;
  level: number;
  completedPaths: number;
  studyTime: number;
  joinDate: string;
}

export interface ContentManagement {
  id: string;
  title: string;
  type: 'learning_path' | 'module' | 'lesson' | 'assessment';
  status: 'draft' | 'published' | 'archived';
  modules: number;
  completionRate: number;
  learners: number;
  avgScore: number;
  lastUpdated: string;
  createdBy: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface LearningAnalytics {
  pathId: string;
  pathName: string;
  totalEnrollments: number;
  completions: number;
  avgCompletionTime: number;
  avgScore: number;
  dropOffPoints: Array<{
    stage: string;
    dropOffRate: number;
    userCount: number;
  }>;
  performanceByDifficulty: Record<string, number>;
  monthlyProgress: Array<{
    month: string;
    enrollments: number;
    completions: number;
    avgScore: number;
  }>;
}

interface AdminState {
  // Data
  stats: AdminStats | null;
  recentActivity: RecentActivity[];
  agents: Agent[];
  systemHealth: SystemHealth | null;
  users: UserManagement[];
  content: ContentManagement[];
  analytics: LearningAnalytics[];
  selectedAgent: string | null;
  isLoading: boolean;
  isAgentsLoading: boolean;
  error: string | null;
  
  // Actions
  loadAdminData: () => Promise<void>;
  loadAgentData: () => Promise<void>;
  refreshStats: () => Promise<void>;
  handleAgentAction: (action: 'start' | 'stop' | 'restart', agentId: string) => Promise<void>;
  createUser: (userData: Partial<UserManagement>) => Promise<void>;
  updateUser: (userId: string, updates: Partial<UserManagement>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  createContent: (contentData: Partial<ContentManagement>) => Promise<void>;
  updateContent: (contentId: string, updates: Partial<ContentManagement>) => Promise<void>;
  deleteContent: (contentId: string) => Promise<void>;
  exportData: (type: 'users' | 'content' | 'analytics') => Promise<string>;
  resetError: () => void;
}

const defaultStats: AdminStats = {
  totalUsers: 0,
  totalPaths: 0,
  totalModules: 0,
  totalLessons: 0,
  activeUsers: 0,
  completionRate: 0,
  totalSessions: 0,
  avgStudyTime: 0,
  systemHealth: 0,
  activeAgents: 0,
  totalAgents: 0,
  agentTasks: 0,
  responseTime: 0
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Initial state
      stats: null,
      recentActivity: [],
      agents: [],
      systemHealth: null,
      users: [],
      content: [],
      analytics: [],
      selectedAgent: null,
      isLoading: false,
      isAgentsLoading: false,
      error: null,

      // Actions
      loadAdminData: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API calls - replace with actual endpoints
          const [statsResponse, activityResponse, usersResponse, contentResponse, analyticsResponse] = 
            await Promise.allSettled([
              api.get('/admin/stats'),
              api.get('/admin/activity'),
              api.get('/admin/users'),
              api.get('/admin/content'),
              api.get('/admin/analytics')
            ]);

          const stats = statsResponse.status === 'fulfilled' ? statsResponse.value.data : get().generateMockStats();
          const activity = activityResponse.status === 'fulfilled' ? activityResponse.value.data : get().generateMockActivity();
          const users = usersResponse.status === 'fulfilled' ? usersResponse.value.data : get().generateMockUsers();
          const content = contentResponse.status === 'fulfilled' ? contentResponse.value.data : get().generateMockContent();
          const analytics = analyticsResponse.status === 'fulfilled' ? analyticsResponse.value.data : get().generateMockAnalytics();

          set({
            stats,
            recentActivity: activity,
            users,
            content,
            analytics,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to load admin data',
          });
          throw error;
        }
      },

      loadAgentData: async () => {
        set({ isAgentsLoading: true, error: null });
        try {
          const [agentsResponse, healthResponse] = await Promise.allSettled([
            api.get('/admin/agents'),
            api.get('/admin/system-health')
          ]);

          const agents = agentsResponse.status === 'fulfilled' ? agentsResponse.value.data : get().generateMockAgents();
          const systemHealth = healthResponse.status === 'fulfilled' ? healthResponse.value.data : get().generateMockSystemHealth();

          set({
            agents,
            systemHealth,
            isAgentsLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isAgentsLoading: false,
            error: error.response?.data?.message || 'Failed to load agent data',
          });
          throw error;
        }
      },

      refreshStats: async () => {
        const currentStats = get().stats;
        if (currentStats) {
          set({
            stats: {
              ...currentStats,
              activeUsers: currentStats.activeUsers + Math.floor(Math.random() * 10 - 5),
              completionRate: Math.max(0, Math.min(100, currentStats.completionRate + Math.random() * 4 - 2)),
              systemHealth: Math.max(0, Math.min(100, currentStats.systemHealth + Math.random() * 2 - 1))
            }
          });
        }
      },

      handleAgentAction: async (action: 'start' | 'stop' | 'restart', agentId: string) => {
        set({ isAgentsLoading: true, error: null });
        try {
          // Simulate API call
          // await api.post(`/admin/agents/${agentId}/${action}`);
          
          // Update local state
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
          
          set(prev => ({
            agents: prev.agents.map(agent => 
              agent.id === agentId 
                ? { ...agent, status: action === 'stop' ? 'idle' : 'active' }
                : agent
            ),
            isAgentsLoading: false
          }));

          // Add activity log
          const activity: RecentActivity = {
            id: Date.now().toString(),
            type: 'agent_action',
            message: `${action === 'restart' ? 'Restarted' : action === 'start' ? 'Started' : 'Stopped'} agent ${agentId}`,
            timestamp: new Date().toISOString(),
            severity: 'low'
          };
          
          set(prev => ({
            recentActivity: [activity, ...prev.recentActivity.slice(0, 19)]
          }));
          
        } catch (error: any) {
          set({
            isAgentsLoading: false,
            error: error.response?.data?.message || `Failed to ${action} agent`,
          });
          throw error;
        }
      },

      createUser: async (userData: Partial<UserManagement>) => {
        try {
          const response = await api.post('/admin/users', userData);
          const newUser = response.data;
          
          set(prev => ({
            users: [newUser, ...prev.users],
            stats: prev.stats ? {
              ...prev.stats,
              totalUsers: prev.stats.totalUsers + 1
            } : null
          }));
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to create user' });
          throw error;
        }
      },

      updateUser: async (userId: string, updates: Partial<UserManagement>) => {
        try {
          const response = await api.patch(`/admin/users/${userId}`, updates);
          const updatedUser = response.data;
          
          set(prev => ({
            users: prev.users.map(user => 
              user.id === userId ? updatedUser : user
            )
          }));
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to update user' });
          throw error;
        }
      },

      deleteUser: async (userId: string) => {
        try {
          await api.delete(`/admin/users/${userId}`);
          
          set(prev => ({
            users: prev.users.filter(user => user.id !== userId),
            stats: prev.stats ? {
              ...prev.stats,
              totalUsers: prev.stats.totalUsers - 1
            } : null
          }));
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to delete user' });
          throw error;
        }
      },

      createContent: async (contentData: Partial<ContentManagement>) => {
        try {
          const newContent: ContentManagement = {
            id: Date.now().toString(),
            title: contentData.title || '',
            type: contentData.type || 'learning_path',
            status: 'draft',
            modules: contentData.modules || 0,
            completionRate: 0,
            learners: 0,
            avgScore: 0,
            lastUpdated: new Date().toISOString(),
            createdBy: 'Admin',
            difficulty: 'intermediate',
            tags: [],
            ...contentData
          };
          
          set(prev => ({
            content: [newContent, ...prev.content]
          }));
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to create content' });
          throw error;
        }
      },

      updateContent: async (contentId: string, updates: Partial<ContentManagement>) => {
        try {
          set(prev => ({
            content: prev.content.map(item => 
              item.id === contentId ? { 
                ...item, 
                ...updates,
                lastUpdated: new Date().toISOString()
              } : item
            )
          }));
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to update content' });
          throw error;
        }
      },

      deleteContent: async (contentId: string) => {
        try {
          set(prev => ({
            content: prev.content.filter(item => item.id !== contentId)
          }));
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to delete content' });
          throw error;
        }
      },

      exportData: async (type: 'users' | 'content' | 'analytics') => {
        try {
          // const response = await api.get(`/admin/export/${type}/`);
          // return response.data.download_url;
          
          // For demo, return a mock URL
          return `/exports/${type}_export_${Date.now()}.csv`;
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to export data' });
          throw error;
        }
      },

      resetError: () => set({ error: null }),

      // Mock data generators
      generateMockStats: (): AdminStats => ({
        totalUsers: 1247,
        totalPaths: 23,
        totalModules: 156,
        totalLessons: 423,
        activeUsers: 342,
        completionRate: 78.5,
        totalSessions: 2156,
        avgStudyTime: 4.2,
        systemHealth: 95,
        activeAgents: 6,
        totalAgents: 8,
        agentTasks: 43,
        responseTime: 1.2
      }),

      generateMockActivity: (): RecentActivity[] => [
        {
          id: '1',
          type: 'user_registration',
          message: 'New user registered',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          user: 'john.doe@example.com',
          severity: 'low'
        },
        {
          id: '2',
          type: 'path_completion',
          message: 'JAC Programming Fundamentals completed',
          timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
          user: 'jane.smith@example.com',
          severity: 'low'
        },
        {
          id: '3',
          type: 'agent_action',
          message: 'Content Curator Agent restarted successfully',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          severity: 'medium'
        },
        {
          id: '4',
          type: 'system_alert',
          message: 'High memory usage detected on server',
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          severity: 'high'
        }
      ],

      generateMockUsers: (): UserManagement[] => [
        {
          id: '1',
          username: 'john.doe',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
          status: 'active',
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          totalPoints: 2450,
          level: 12,
          completedPaths: 3,
          studyTime: 45,
          joinDate: '2025-08-15T00:00:00Z'
        },
        {
          id: '2',
          username: 'jane.smith',
          email: 'jane.smith@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'instructor',
          status: 'active',
          lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          totalPoints: 5200,
          level: 25,
          completedPaths: 7,
          studyTime: 120,
          joinDate: '2025-06-20T00:00:00Z'
        }
      ],

      generateMockContent: (): ContentManagement[] => [
        {
          id: '1',
          title: 'JAC Programming Fundamentals',
          type: 'learning_path',
          status: 'published',
          modules: 8,
          completionRate: 89.2,
          learners: 156,
          avgScore: 87.3,
          lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          createdBy: 'Admin',
          difficulty: 'beginner',
          tags: ['programming', 'jac', 'fundamentals']
        },
        {
          id: '2',
          title: 'Advanced JAC Concepts',
          type: 'learning_path',
          status: 'draft',
          modules: 12,
          completionRate: 0,
          learners: 0,
          avgScore: 0,
          lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'Admin',
          difficulty: 'advanced',
          tags: ['programming', 'jac', 'advanced']
        }
      ],

      generateMockAnalytics: (): LearningAnalytics[] => [
        {
          pathId: '1',
          pathName: 'JAC Programming Fundamentals',
          totalEnrollments: 342,
          completions: 156,
          avgCompletionTime: 4.2,
          avgScore: 87.3,
          dropOffPoints: [
            { stage: 'Module 1', dropOffRate: 12.8, userCount: 44 },
            { stage: 'Module 3', dropOffRate: 8.2, userCount: 28 }
          ],
          performanceByDifficulty: {
            beginner: 92.1,
            intermediate: 85.3,
            advanced: 78.9
          },
          monthlyProgress: [
            { month: 'Nov 2025', enrollments: 89, completions: 45, avgScore: 87.3 },
            { month: 'Oct 2025', enrollments: 76, completions: 38, avgScore: 85.1 }
          ]
        }
      ],

      generateMockAgents: (): Agent[] => [
        {
          id: 'content_curator',
          name: 'Content Curator',
          type: 'content_curator',
          status: 'idle',
          description: 'Curates and organizes learning content',
          tasks: 23,
          uptime: 98.5,
          performance: 94,
          responseTime: 1.2,
          lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          health_score: 95,
          queue_size: 2,
          uptime_hours: 720,
          capabilities: ['content_generation', 'content_organization', 'quality_assessment'],
          config: {
            auto_content_generation: true,
            content_quality_threshold: 0.85,
            max_concurrent_tasks: 5
          }
        },
        {
          id: 'quiz_master',
          name: 'Quiz Master',
          type: 'quiz_master',
          status: 'busy',
          description: 'Generates quizzes and assessments',
          tasks: 12,
          uptime: 99.1,
          performance: 97,
          responseTime: 0.8,
          lastActive: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          health_score: 98,
          queue_size: 5,
          uptime_hours: 480,
          capabilities: ['quiz_generation', 'assessment_creation', 'difficulty_calibration'],
          config: {
            auto_quiz_generation: true,
            difficulty_calibration: true,
            max_questions_per_quiz: 20
          }
        }
      ],

      generateMockSystemHealth: (): SystemHealth => ({
        overall_status: 'healthy',
        health_score: 95,
        active_sessions: 156,
        system_metrics: {
          cpu_usage: 45.2,
          memory_usage: 67.8,
          disk_usage: 34.1,
          network_latency: 12.5
        },
        agents: {
          content_curator: {
            status: 'active',
            last_active: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            queue_size: 2,
            uptime_hours: 720,
            health_score: 95
          },
          quiz_master: {
            status: 'active',
            last_active: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            queue_size: 5,
            uptime_hours: 480,
            health_score: 98
          }
        }
      }),
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        // Only persist non-sensitive data
        stats: state.stats,
        selectedAgent: state.selectedAgent,
      }),
    }
  )
);