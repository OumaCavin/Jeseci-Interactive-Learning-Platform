// JAC Learning Platform - Enterprise Agent Management System by MiniMax Agent
// Enhanced with Zustand Architecture for Lightning-Fast Performance

/**
 * Enterprise Multi-Agent System
 * Manages sophisticated AI agent interactions, conversations, recommendations, and tasks
 * Supports 6 specialized agent types with personality-driven interactions
 */

// Core Imports
import { create } from 'zustand';
import { subscribeWithSelector, devtools, persist, immer } from 'zustand/middleware';
import type { StateCreator } from 'zustand';

// Enhanced Types for Enterprise Agent System
export interface Agent {
  id: string;
  name: string;
  type: 'content_curator' | 'quiz_master' | 'evaluator' | 'progress_tracker' | 'motivator' | 'orchestrator';
  description: string;
  status: 'active' | 'inactive' | 'busy';
  isTyping?: boolean;
  capabilities: string[];
  personality: {
    tone: 'friendly' | 'professional' | 'encouraging' | 'analytical';
    communication_style: 'verbose' | 'concise' | 'adaptive';
  };
  performance_metrics?: {
    tasks_completed: number;
    accuracy_rate: number;
    user_satisfaction: number;
    response_time: number;
  };
  specializations?: string[];
  model_config?: {
    temperature: number;
    max_tokens: number;
    model_name: string;
  };
  learning_preferences?: {
    adapt_difficulty: boolean;
    provide_explanations: boolean;
    offer_alternatives: boolean;
  };
}

export interface AgentMessage {
  id: string;
  agent_id: string;
  user_id: string;
  content: string;
  type: 'text' | 'code' | 'recommendation' | 'feedback' | 'explanation' | 'system_alert';
  timestamp: string;
  metadata?: {
    confidence_score?: number;
    model_used?: string;
    processing_time?: number;
    related_content?: string[];
    code_language?: string;
    file_references?: string[];
  };
  is_read: boolean;
  is_system_generated?: boolean;
  priority_level?: 'low' | 'normal' | 'high' | 'urgent';
  response_to?: string;
  attachments?: {
    type: 'image' | 'audio' | 'document' | 'code_file';
    url: string;
    name: string;
    size?: number;
  }[];
}

export interface AgentRecommendation {
  id: string;
  agent_id: string;
  user_id: string;
  type: 'content' | 'exercise' | 'review' | 'goal' | 'difficulty' | 'study_path' | 'resource';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'accepted' | 'dismissed' | 'expired';
  expires_at: string;
  metadata?: {
    confidence_score: number;
    reasoning: string;
    related_topics: string[];
    difficulty_level: string;
    estimated_time: number;
    completion_criteria: string[];
  };
  created_at: string;
  accepted_at?: string;
  dismissed_reason?: string;
  completion_data?: {
    completion_time: number;
    success_metrics: Record<string, number>;
    user_feedback?: string;
  };
  learning_impact?: {
    skill_improvement: string;
    engagement_boost: number;
    retention_rate: number;
  };
}

export interface AgentTask {
  id: string;
  agent_id: string;
  user_id: string;
  task_type: 'content_generation' | 'assessment_creation' | 'progress_analysis' | 'code_evaluation' | 'motivation' | 'personalization';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'paused';
  input: any;
  output?: any;
  created_at: string;
  completed_at?: string;
  error_message?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  progress?: {
    percentage: number;
    current_step: string;
    estimated_remaining: number;
    checkpoints_completed: string[];
  };
  dependencies?: string[];
  retry_count?: number;
  max_retries?: number;
  execution_time?: number;
  resource_usage?: {
    cpu_usage: number;
    memory_usage: number;
    api_calls: number;
  };
}

export interface AgentPerformance {
  agent_id: string;
  total_tasks: number;
  completed_tasks: number;
  average_completion_time: number;
  success_rate: number;
  user_satisfaction: number;
  accuracy_score: number;
  last_activity: string;
  response_patterns: {
    average_response_time: number;
    message_length_avg: number;
    correction_rate: number;
    suggestion_acceptance_rate: number;
  };
  learning_analytics: {
    adaptations_made: number;
    personalization_score: number;
    engagement_boosts: number;
    retention_improvements: number;
  };
}

export interface ConversationSession {
  id: string;
  agent_id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  message_count: number;
  session_quality: number;
  topics_discussed: string[];
  goals_achieved: string[];
  satisfaction_rating?: number;
  is_active: boolean;
  context_summary?: string;
  key_insights?: string[];
}

// Enhanced Agent State with Enterprise Features
export interface AgentState {
  // Core Agent Management
  agents: Agent[];
  active_agents: string[];
  agent_performance: Record<string, AgentPerformance>;
  
  // Conversation Management
  conversations: Record<string, AgentMessage[]>;
  unread_counts: Record<string, number>;
  conversation_sessions: Record<string, ConversationSession[]>;
  
  // Intelligent Recommendations
  recommendations: AgentRecommendation[];
  pending_recommendations: AgentRecommendation[];
  recommendation_analytics: {
    acceptance_rate: number;
    satisfaction_score: number;
    engagement_impact: number;
    learning_improvements: Record<string, number>;
  };
  
  // Advanced Task Management
  tasks: AgentTask[];
  active_tasks: AgentTask[];
  task_queue: AgentTask[];
  task_analytics: {
    total_processed: number;
    average_completion_time: number;
    success_rate: number;
    resource_efficiency: number;
  };
  
  // AI Intelligence & Learning
  learning_insights: {
    user_patterns: Record<string, any>;
    personalization_data: Record<string, any>;
    adaptation_history: any[];
    performance_trends: Record<string, any>;
  };
  
  // Real-time UI State
  isLoading: boolean;
  isTyping: Record<string, boolean>;
  error: string | null;
  connection_status: 'connected' | 'disconnected' | 'connecting';
  
  // Chat Interface Management
  selected_agent: string | null;
  chat_visible: boolean;
  chat_layout: 'floating' | 'sidebar' | 'fullscreen';
  notification_preferences: {
    show_unread_badges: boolean;
    play_sounds: boolean;
    desktop_notifications: boolean;
    email_alerts: boolean;
  };
  
  // Advanced Settings
  agent_preferences: {
    default_agents: string[];
    auto_recommendations: boolean;
    learning_pace_adaptation: boolean;
    personality_matching: boolean;
    conversation_history_retention: number; // days
  };
  
  // System State
  last_sync: string;
  sync_status: 'idle' | 'syncing' | 'error';
  system_health: {
    agent_availability: number;
    response_time_avg: number;
    error_rate: number;
    uptime_percentage: number;
  };
}

// Enhanced Initial State
const initialState: AgentState = {
  // Core Agent Management
  agents: [],
  active_agents: [],
  agent_performance: {},
  
  // Conversation Management
  conversations: {},
  unread_counts: {},
  conversation_sessions: {},
  
  // Intelligent Recommendations
  recommendations: [],
  pending_recommendations: [],
  recommendation_analytics: {
    acceptance_rate: 0,
    satisfaction_score: 0,
    engagement_impact: 0,
    learning_improvements: {},
  },
  
  // Advanced Task Management
  tasks: [],
  active_tasks: [],
  task_queue: [],
  task_analytics: {
    total_processed: 0,
    average_completion_time: 0,
    success_rate: 0,
    resource_efficiency: 0,
  },
  
  // AI Intelligence & Learning
  learning_insights: {
    user_patterns: {},
    personalization_data: {},
    adaptation_history: [],
    performance_trends: {},
  },
  
  // Real-time UI State
  isLoading: false,
  isTyping: {},
  error: null,
  connection_status: 'disconnected',
  
  // Chat Interface Management
  selected_agent: null,
  chat_visible: false,
  chat_layout: 'floating',
  notification_preferences: {
    show_unread_badges: true,
    play_sounds: false,
    desktop_notifications: false,
    email_alerts: false,
  },
  
  // Advanced Settings
  agent_preferences: {
    default_agents: [],
    auto_recommendations: true,
    learning_pace_adaptation: true,
    personality_matching: true,
    conversation_history_retention: 30,
  },
  
  // System State
  last_sync: '',
  sync_status: 'idle',
  system_health: {
    agent_availability: 100,
    response_time_avg: 0,
    error_rate: 0,
    uptime_percentage: 100,
  },
};

// Enterprise Agent Store with Zustand
export const useAgentStore = create<AgentState>()(
  subscribeWithSelector(
    devtools(
      persist(
        immer<AgentState>((set, get) => ({
          ...initialState,

          // ========== ENTERPRISE AGENT MANAGEMENT ==========
          
          // Enhanced Agent Management Actions
          setAgents: (agents: Agent[]) => set((state) => {
            state.agents = agents.map(agent => ({
              ...agent,
              performance_metrics: agent.performance_metrics || {
                tasks_completed: 0,
                accuracy_rate: 0,
                user_satisfaction: 0,
                response_time: 0
              }
            }));
            state.last_sync = new Date().toISOString();
          }),

          addAgent: (agent: Agent) => set((state) => {
            const newAgent: Agent = {
              ...agent,
              id: agent.id || `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              created_at: new Date().toISOString(),
              performance_metrics: agent.performance_metrics || {
                tasks_completed: 0,
                accuracy_rate: 0,
                user_satisfaction: 0,
                response_time: 0
              }
            };
            state.agents.push(newAgent);
            state.system_health.agent_availability = Math.min(100, state.system_health.agent_availability + 5);
          }),

          updateAgent: (agent: Agent) => set((state) => {
            const index = state.agents.findIndex(a => a.id === agent.id);
            if (index !== -1) {
              state.agents[index] = { ...state.agents[index], ...agent, updated_at: new Date().toISOString() };
            }
          }),

          setActiveAgents: (agentIds: string[]) => set((state) => {
            state.active_agents = agentIds;
            state.agent_preferences.default_agents = agentIds;
          }),

          setAgentStatus: (agentId: string, status: Agent['status']) => set((state) => {
            const agent = state.agents.find(a => a.id === agentId);
            if (agent) {
              agent.status = status;
              agent.last_activity = new Date().toISOString();
            }
          }),

          updateAgentPerformance: (agentId: string, performance: Partial<AgentPerformance>) => set((state) => {
            const existing = state.agent_performance[agentId] || {
              agent_id: agentId,
              total_tasks: 0,
              completed_tasks: 0,
              average_completion_time: 0,
              success_rate: 0,
              user_satisfaction: 0,
              accuracy_score: 0,
              last_activity: '',
              response_patterns: {
                average_response_time: 0,
                message_length_avg: 0,
                correction_rate: 0,
                suggestion_acceptance_rate: 0
              },
              learning_analytics: {
                adaptations_made: 0,
                personalization_score: 0,
                engagement_boosts: 0,
                retention_improvements: 0
              }
            };
            state.agent_performance[agentId] = { ...existing, ...performance };
          }),

          // ========== CONVERSATION MANAGEMENT ==========
          
          // Enhanced Message System
          addMessage: (message: AgentMessage) => set((state) => {
            const enhancedMessage: AgentMessage = {
              ...message,
              id: message.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              timestamp: message.timestamp || new Date().toISOString(),
              priority_level: message.priority_level || 'normal',
              is_system_generated: message.is_system_generated || false
            };

            if (!state.conversations[enhancedMessage.agent_id]) {
              state.conversations[enhancedMessage.agent_id] = [];
            }

            state.conversations[enhancedMessage.agent_id].push(enhancedMessage);

            // Update unread count if message is from agent and not read
            if (!enhancedMessage.is_read && enhancedMessage.agent_id) {
              if (!state.unread_counts[enhancedMessage.agent_id]) {
                state.unread_counts[enhancedMessage.agent_id] = 0;
              }
              state.unread_counts[enhancedMessage.agent_id] += 1;
            }

            // Update conversation session
            const sessionId = `session_${enhancedMessage.user_id}_${enhancedMessage.agent_id}`;
            if (!state.conversation_sessions[enhancedMessage.agent_id]) {
              state.conversation_sessions[enhancedMessage.agent_id] = [];
            }

            const existingSession = state.conversation_sessions[enhancedMessage.agent_id].find(s => s.id === sessionId && s.is_active);
            if (existingSession) {
              existingSession.message_count += 1;
              existingSession.ended_at = new Date().toISOString();
            } else {
              state.conversation_sessions[enhancedMessage.agent_id].push({
                id: sessionId,
                agent_id: enhancedMessage.agent_id,
                user_id: enhancedMessage.user_id,
                started_at: enhancedMessage.timestamp,
                message_count: 1,
                session_quality: 0,
                topics_discussed: [],
                goals_achieved: [],
                is_active: true,
                context_summary: '',
                key_insights: []
              });
            }
          }),

          markMessagesAsRead: (agentId: string, userId?: string) => set((state) => {
            if (state.conversations[agentId]) {
              state.conversations[agentId] = state.conversations[agentId].map(msg => ({
                ...msg,
                is_read: true,
                read_at: new Date().toISOString()
              }));
              state.unread_counts[agentId] = 0;
            }
          }),

          clearConversation: (agentId: string) => set((state) => {
            delete state.conversations[agentId];
            delete state.unread_counts[agentId];
            delete state.conversation_sessions[agentId];
          }),

          endConversationSession: (agentId: string, sessionId: string, quality: number, insights: string[]) => set((state) => {
            const sessions = state.conversation_sessions[agentId];
            if (sessions) {
              const session = sessions.find(s => s.id === sessionId);
              if (session) {
                session.is_active = false;
                session.ended_at = new Date().toISOString();
                session.session_quality = quality;
                session.key_insights = insights;
              }
            }
          }),

          // ========== INTELLIGENT RECOMMENDATIONS ==========
          
          // Enhanced Recommendation System
          setRecommendations: (recommendations: AgentRecommendation[]) => set((state) => {
            state.recommendations = recommendations.map(rec => ({
              ...rec,
              created_at: rec.created_at || new Date().toISOString(),
              expires_at: rec.expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }));
            state.pending_recommendations = recommendations.filter(r => r.status === 'pending');
            
            // Update analytics
            state.recommendation_analytics.acceptance_rate = recommendations.filter(r => r.status === 'accepted').length / recommendations.length;
          }),

          addRecommendation: (recommendation: AgentRecommendation) => set((state) => {
            const enhancedRec: AgentRecommendation = {
              ...recommendation,
              id: recommendation.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              created_at: recommendation.created_at || new Date().toISOString(),
              expires_at: recommendation.expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            };

            state.recommendations.push(enhancedRec);
            if (enhancedRec.status === 'pending') {
              state.pending_recommendations.push(enhancedRec);
            }

            // Update learning impact analytics
            if (enhancedRec.learning_impact) {
              const topic = enhancedRec.type;
              if (!state.recommendation_analytics.learning_improvements[topic]) {
                state.recommendation_analytics.learning_improvements[topic] = 0;
              }
              state.recommendation_analytics.learning_improvements[topic] += enhancedRec.learning_impact.engagement_boost;
            }
          }),

          updateRecommendation: (recommendation: AgentRecommendation) => set((state) => {
            const index = state.recommendations.findIndex(r => r.id === recommendation.id);
            if (index !== -1) {
              state.recommendations[index] = recommendation;
              
              // Update pending recommendations
              const pendingIndex = state.pending_recommendations.findIndex(r => r.id === recommendation.id);
              if (recommendation.status === 'pending') {
                if (pendingIndex !== -1) {
                  state.pending_recommendations[pendingIndex] = recommendation;
                } else {
                  state.pending_recommendations.push(recommendation);
                }
              } else if (pendingIndex !== -1) {
                state.pending_recommendations.splice(pendingIndex, 1);
              }

              // Handle acceptance/dismissal
              if (recommendation.status === 'accepted') {
                state.recommendation_analytics.acceptance_rate += 0.01;
                state.recommendation_analytics.satisfaction_score += recommendation.learning_impact?.engagement_boost || 0;
              }
            }
          }),

          dismissRecommendation: (recommendationId: string, reason?: string) => set((state) => {
            const recommendation = state.recommendations.find(r => r.id === recommendationId);
            if (recommendation) {
              recommendation.status = 'dismissed';
              recommendation.dismissed_reason = reason;
              state.pending_recommendations = state.pending_recommendations.filter(r => r.id !== recommendationId);
            }
          }),

          acceptRecommendation: (recommendationId: string) => set((state) => {
            const recommendation = state.recommendations.find(r => r.id === recommendationId);
            if (recommendation) {
              recommendation.status = 'accepted';
              recommendation.accepted_at = new Date().toISOString();
              state.pending_recommendations = state.pending_recommendations.filter(r => r.id !== recommendationId);
              
              // Update analytics
              state.recommendation_analytics.acceptance_rate = Math.min(1, state.recommendation_analytics.acceptance_rate + 0.05);
            }
          }),

          // ========== ADVANCED TASK MANAGEMENT ==========
          
          // Enhanced Task System
          setTasks: (tasks: AgentTask[]) => set((state) => {
            state.tasks = tasks;
            state.active_tasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
            state.task_queue = tasks.filter(t => t.status === 'pending');
            
            // Update task analytics
            const completedTasks = tasks.filter(t => t.status === 'completed');
            state.task_analytics.total_processed = tasks.length;
            state.task_analytics.success_rate = completedTasks.length / tasks.length;
            state.task_analytics.average_completion_time = completedTasks.reduce((acc, task) => {
              if (task.completed_at && task.created_at) {
                return acc + (new Date(task.completed_at).getTime() - new Date(task.created_at).getTime());
              }
              return acc;
            }, 0) / Math.max(1, completedTasks.length);
          }),

          addTask: (task: AgentTask) => set((state) => {
            const enhancedTask: AgentTask = {
              ...task,
              id: task.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              created_at: task.created_at || new Date().toISOString(),
              retry_count: task.retry_count || 0,
              max_retries: task.max_retries || 3,
              priority: task.priority || 'normal'
            };

            state.tasks.push(enhancedTask);
            if (enhancedTask.status === 'pending' || enhancedTask.status === 'in_progress') {
              state.active_tasks.push(enhancedTask);
            }
            if (enhancedTask.status === 'pending') {
              state.task_queue.push(enhancedTask);
            }
          }),

          updateTask: (task: AgentTask) => set((state) => {
            const index = state.tasks.findIndex(t => t.id === task.id);
            if (index !== -1) {
              state.tasks[index] = task;
              
              // Update active tasks
              const activeIndex = state.active_tasks.findIndex(t => t.id === task.id);
              if (task.status === 'pending' || task.status === 'in_progress') {
                if (activeIndex !== -1) {
                  state.active_tasks[activeIndex] = task;
                } else {
                  state.active_tasks.push(task);
                }
              } else {
                state.active_tasks = state.active_tasks.filter(t => t.id !== task.id);
              }

              // Update task queue
              const queueIndex = state.task_queue.findIndex(t => t.id === task.id);
              if (task.status === 'pending') {
                if (queueIndex === -1) {
                  state.task_queue.push(task);
                }
              } else if (queueIndex !== -1) {
                state.task_queue.splice(queueIndex, 1);
              }

              // Update analytics on completion
              if (task.status === 'completed' && task.completed_at && task.created_at) {
                const completionTime = new Date(task.completed_at).getTime() - new Date(task.created_at).getTime();
                const totalCompleted = state.tasks.filter(t => t.status === 'completed').length;
                state.task_analytics.average_completion_time = (
                  (state.task_analytics.average_completion_time * (totalCompleted - 1) + completionTime) / totalCompleted
                );
              }
            }
          }),

          completeTask: (taskId: string, output: any, userFeedback?: string) => set((state) => {
            const task = state.tasks.find(t => t.id === taskId);
            if (task) {
              task.status = 'completed';
              task.completed_at = new Date().toISOString();
              task.output = output;
              task.user_feedback = userFeedback;

              // Update active tasks and queue
              state.active_tasks = state.active_tasks.filter(t => t.id !== taskId);
              state.task_queue = state.task_queue.filter(t => t.id !== taskId);

              // Update task analytics
              const totalCompleted = state.tasks.filter(t => t.status === 'completed').length;
              const totalTasks = state.tasks.length;
              state.task_analytics.success_rate = totalCompleted / totalTasks;
            }
          }),

          failTask: (taskId: string, errorMessage: string) => set((state) => {
            const task = state.tasks.find(t => t.id === taskId);
            if (task && task.retry_count < task.max_retries) {
              task.status = 'pending';
              task.retry_count = (task.retry_count || 0) + 1;
              task.error_message = errorMessage;
              
              // Re-add to queue
              if (!state.task_queue.find(t => t.id === taskId)) {
                state.task_queue.push(task);
              }
            } else if (task) {
              task.status = 'failed';
              task.error_message = errorMessage;
              state.active_tasks = state.active_tasks.filter(t => t.id !== taskId);
              state.task_queue = state.task_queue.filter(t => t.id !== taskId);
            }
          }),

          // ========== AI INTELLIGENCE & LEARNING ==========
          
          // Enhanced Learning Analytics
          updateLearningInsights: (insights: any) => set((state) => {
            state.learning_insights = {
              ...state.learning_insights,
              ...insights,
              last_updated: new Date().toISOString()
            };
          }),

          recordUserPattern: (userId: string, pattern: any) => set((state) => {
            if (!state.learning_insights.user_patterns[userId]) {
              state.learning_insights.user_patterns[userId] = [];
            }
            state.learning_insights.user_patterns[userId].push({
              ...pattern,
              timestamp: new Date().toISOString()
            });
          }),

          updatePersonalizationData: (userId: string, data: any) => set((state) => {
            state.learning_insights.personalization_data[userId] = {
              ...state.learning_insights.personalization_data[userId],
              ...data,
              last_updated: new Date().toISOString()
            };
          }),

          // ========== REAL-TIME UI MANAGEMENT ==========
          
          // Enhanced UI State Management
          setLoading: (loading: boolean) => set((state) => {
            state.isLoading = loading;
          }),

          setTyping: (agentId: string, isTyping: boolean) => set((state) => {
            state.isTyping[agentId] = isTyping;
            
            // Update agent status based on typing state
            const agent = state.agents.find(a => a.id === agentId);
            if (agent) {
              agent.isTyping = isTyping;
              if (isTyping) {
                agent.status = 'busy';
              } else {
                agent.status = 'active';
              }
            }
          }),

          setError: (error: string | null) => set((state) => {
            state.error = error;
            if (error) {
              state.sync_status = 'error';
            }
          }),

          clearError: () => set((state) => {
            state.error = null;
            state.sync_status = 'idle';
          }),

          setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting') => set((state) => {
            state.connection_status = status;
            if (status === 'connected') {
              state.system_health.uptime_percentage = Math.min(100, state.system_health.uptime_percentage + 1);
            } else if (status === 'disconnected') {
              state.system_health.uptime_percentage = Math.max(0, state.system_health.uptime_percentage - 1);
            }
          }),

          // ========== CHAT INTERFACE MANAGEMENT ==========
          
          // Enhanced Chat Management
          setSelectedAgent: (agentId: string | null) => set((state) => {
            state.selected_agent = agentId;
            if (agentId) {
              // Mark messages as read when agent is selected
              get().markMessagesAsRead(agentId);
              
              // Update agent availability
              const agent = state.agents.find(a => a.id === agentId);
              if (agent) {
                agent.status = 'active';
              }
            }
          }),

          setChatVisible: (visible: boolean) => set((state) => {
            state.chat_visible = visible;
          }),

          toggleChat: () => set((state) => {
            state.chat_visible = !state.chat_visible;
          }),

          setChatLayout: (layout: 'floating' | 'sidebar' | 'fullscreen') => set((state) => {
            state.chat_layout = layout;
          }),

          updateNotificationPreferences: (preferences: Partial<typeof initialState.notification_preferences>) => set((state) => {
            state.notification_preferences = { ...state.notification_preferences, ...preferences };
          }),

          // ========== ADVANCED SETTINGS ==========
          
          // Enhanced Preference Management
          updateAgentPreferences: (preferences: Partial<typeof initialState.agent_preferences>) => set((state) => {
            state.agent_preferences = { ...state.agent_preferences, ...preferences };
          }),

          // ========== SYSTEM STATE MANAGEMENT ==========
          
          // Enhanced System Health
          updateSystemHealth: (health: Partial<typeof initialState.system_health>) => set((state) => {
            state.system_health = { ...state.system_health, ...health };
          }),

          syncWithServer: async () => {
            set((state) => {
              state.sync_status = 'syncing';
            });

            try {
              // Simulate server sync
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              set((state) => {
                state.last_sync = new Date().toISOString();
                state.sync_status = 'idle';
                state.connection_status = 'connected';
              });
            } catch (error) {
              set((state) => {
                state.sync_status = 'error';
                state.connection_status = 'disconnected';
                state.error = 'Sync failed: ' + (error as Error).message;
              });
            }
          },

          // ========== CLEANUP & MAINTENANCE ==========
          
          // Comprehensive Data Cleanup
          clearAgentData: () => set((state) => {
            // Clear conversations and messages
            state.conversations = {};
            state.unread_counts = {};
            state.conversation_sessions = {};
            
            // Clear recommendations
            state.recommendations = [];
            state.pending_recommendations = [];
            
            // Clear tasks
            state.tasks = [];
            state.active_tasks = [];
            state.task_queue = [];
            
            // Reset analytics
            state.recommendation_analytics = initialState.recommendation_analytics;
            state.task_analytics = initialState.task_analytics;
            
            // Reset UI state
            state.selected_agent = null;
            state.chat_visible = false;
            state.isTyping = {};
            
            // Reset learning insights (keep patterns but clear history)
            state.learning_insights = {
              ...initialState.learning_insights,
              user_patterns: state.learning_insights.user_patterns,
              personalization_data: state.learning_insights.personalization_data
            };
          }),

          expireOldData: () => set((state) => {
            const retentionDays = state.agent_preferences.conversation_history_retention;
            const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

            // Clear expired conversations
            Object.keys(state.conversations).forEach(agentId => {
              state.conversations[agentId] = state.conversations[agentId].filter(
                msg => new Date(msg.timestamp) > cutoffDate
              );
              if (state.conversations[agentId].length === 0) {
                delete state.conversations[agentId];
                delete state.unread_counts[agentId];
              }
            });

            // Clear expired recommendations
            state.recommendations = state.recommendations.filter(
              rec => new Date(rec.expires_at) > cutoffDate
            );
            state.pending_recommendations = state.pending_recommendations.filter(
              rec => new Date(rec.expires_at) > cutoffDate
            );

            // Clean up learning insights
            Object.keys(state.learning_insights.adaptation_history).forEach(key => {
              state.learning_insights.adaptation_history = state.learning_insights.adaptation_history.filter(
                adaptation => new Date(adaptation.timestamp) > cutoffDate
              );
            });
          }),

          // ========== ENTERPRISE ANALYTICS ==========
          
          // Performance Analytics
          generatePerformanceReport: () => {
            const state = get();
            return {
              agent_performance: state.agent_performance,
              conversation_metrics: {
                total_conversations: Object.keys(state.conversations).reduce((acc, agentId) => 
                  acc + state.conversations[agentId].length, 0
                ),
                average_session_length: Object.values(state.conversation_sessions).flat().reduce((acc, session) => 
                  acc + session.message_count, 0
                ) / Math.max(1, Object.values(state.conversation_sessions).flat().length),
                quality_scores: Object.values(state.conversation_sessions).flat().map(s => s.session_quality)
              },
              recommendation_metrics: state.recommendation_analytics,
              task_analytics: state.task_analytics,
              system_health: state.system_health,
              learning_insights: state.learning_insights,
              generated_at: new Date().toISOString()
            };
          }
        })),
        {
          name: 'enterprise-agent-store',
          partialize: (state) => ({
            agents: state.agents,
            agent_preferences: state.agent_preferences,
            notification_preferences: state.notification_preferences,
            chat_layout: state.chat_layout,
            conversation_sessions: state.conversation_sessions,
            learning_insights: state.learning_insights,
            agent_performance: state.agent_performance
          })
        }
      ),
      {
        name: 'enterprise-agent-store'
      }
    )
  )
);

// ========== ENTERPRISE SELECTORS ==========

// Enhanced Selector Functions for Optimal Performance
export const useAgents = () => useAgentStore((state) => state.agents);
export const useActiveAgents = () => useAgentStore((state) => 
  state.agents.filter(agent => state.active_agents.includes(agent.id))
);
export const useAgentById = (agentId: string) => useAgentStore((state) => 
  state.agents.find(agent => agent.id === agentId)
);
export const useAgentPerformance = (agentId: string) => useAgentStore((state) => 
  state.agent_performance[agentId]
);

// Conversation Selectors
export const useConversations = () => useAgentStore((state) => state.conversations);
export const useConversation = (agentId: string) => useAgentStore((state) => 
  state.conversations[agentId] || []
);
export const useUnreadCounts = () => useAgentStore((state) => state.unread_counts);
export const useUnreadCount = (agentId: string) => useAgentStore((state) => 
  state.unread_counts[agentId] || 0
);
export const useConversationSessions = (agentId: string) => useAgentStore((state) => 
  state.conversation_sessions[agentId] || []
);

// Recommendation Selectors
export const useRecommendations = () => useAgentStore((state) => state.recommendations);
export const usePendingRecommendations = () => useAgentStore((state) => 
  state.pending_recommendations
);
export const useHighPriorityRecommendations = () => useAgentStore((state) => 
  state.recommendations.filter(rec => rec.priority === 'high' || rec.priority === 'urgent')
);
export const useRecommendationAnalytics = () => useAgentStore((state) => 
  state.recommendation_analytics
);

// Task Selectors
export const useTasks = () => useAgentStore((state) => state.tasks);
export const useActiveTasks = () => useAgentStore((state) => state.active_tasks);
export const useTaskQueue = () => useAgentStore((state) => state.task_queue);
export const useTaskById = (taskId: string) => useAgentStore((state) => 
  state.tasks.find(task => task.id === taskId)
);
export const useTaskAnalytics = () => useAgentStore((state) => state.task_analytics);

// UI State Selectors
export const useSelectedAgent = () => useAgentStore((state) => {
  const agentId = state.selected_agent;
  return agentId ? state.agents.find(agent => agent.id === agentId) : null;
});
export const useChatVisible = () => useAgentStore((state) => state.chat_visible);
export const useChatLayout = () => useAgentStore((state) => state.chat_layout);
export const useIsTyping = (agentId: string) => useAgentStore((state) => 
  state.isTyping[agentId] || false
);
export const useIsLoading = () => useAgentStore((state) => state.isLoading);
export const useConnectionStatus = () => useAgentStore((state) => state.connection_status);
export const useError = () => useAgentStore((state) => state.error);

// System State Selectors
export const useSystemHealth = () => useAgentStore((state) => state.system_health);
export const useLastSync = () => useAgentStore((state) => state.last_sync);
export const useSyncStatus = () => useAgentStore((state) => state.sync_status);

// Learning & Analytics Selectors
export const useLearningInsights = () => useAgentStore((state) => state.learning_insights);
export const useAgentPreferences = () => useAgentStore((state) => state.agent_preferences);
export const useNotificationPreferences = () => useAgentStore((state) => 
  state.notification_preferences
);

// Performance Monitoring
export const useAgentHealth = (agentId: string) => useAgentStore((state) => {
  const agent = state.agents.find(a => a.id === agentId);
  const performance = state.agent_performance[agentId];
  
  return {
    status: agent?.status || 'inactive',
    isTyping: agent?.isTyping || false,
    lastActivity: agent?.last_activity || '',
    successRate: performance?.success_rate || 0,
    averageResponseTime: performance?.response_patterns.average_response_time || 0,
    userSatisfaction: performance?.user_satisfaction || 0
  };
});

export const useSystemAnalytics = () => useAgentStore((state) => ({
  totalAgents: state.agents.length,
  activeAgents: state.active_agents.length,
  totalConversations: Object.keys(state.conversations).reduce((acc, agentId) => 
    acc + state.conversations[agentId].length, 0
  ),
  totalTasks: state.tasks.length,
  activeTasks: state.active_tasks.length,
  pendingRecommendations: state.pending_recommendations.length,
  systemUptime: state.system_health.uptime_percentage,
  errorRate: state.system_health.error_rate,
  averageResponseTime: state.system_health.response_time_avg
}));

// ========== ADVANCED HOOKS ==========

// Smart Agent Selection Hook
export const useSmartAgentSelection = () => {
  const agents = useAgents();
  const tasks = useActiveTasks();
  const performance = useAgentStore((state) => state.agent_performance);
  
  return (taskType: AgentTask['task_type']) => {
    const suitableAgents = agents.filter(agent => 
      agent.capabilities.includes(taskType) && 
      agent.status === 'active' &&
      !tasks.find(task => task.agent_id === agent.id)
    );
    
    return suitableAgents.sort((a, b) => {
      const perfA = performance[a.id]?.success_rate || 0;
      const perfB = performance[b.id]?.success_rate || 0;
      return perfB - perfA;
    })[0];
  };
};

// Context-Aware Recommendations Hook
export const useContextualRecommendations = (currentTopic?: string) => {
  const recommendations = useRecommendations();
  const userPatterns = useLearningInsights();
  
  return recommendations.filter(rec => {
    // Filter by topic if specified
    if (currentTopic && !rec.metadata?.related_topics?.includes(currentTopic)) {
      return false;
    }
    
    // Prioritize based on user patterns
    if (rec.status === 'pending') {
      return true;
    }
    
    return false;
  }).sort((a, b) => {
    // Sort by priority and confidence
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    return (b.metadata?.confidence_score || 0) - (a.metadata?.confidence_score || 0);
  });
};

// Performance Monitoring Hook
export const useAgentMonitoring = () => {
  const agents = useAgents();
  const systemHealth = useSystemHealth();
  const performance = useAgentStore((state) => state.agent_performance);
  
  return {
    agentStatuses: agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      status: agent.status,
      isTyping: agent.isTyping,
      lastActivity: agent.last_activity,
      successRate: performance[agent.id]?.success_rate || 0,
      averageResponseTime: performance[agent.id]?.response_patterns.average_response_time || 0,
      userSatisfaction: performance[agent.id]?.user_satisfaction || 0
    })),
    systemHealth,
    overallPerformance: {
      uptime: systemHealth.uptime_percentage,
      responseTime: systemHealth.response_time_avg,
      errorRate: systemHealth.error_rate,
      agentAvailability: systemHealth.agent_availability
    }
  };
};

// Export the store instance for advanced usage
export const agentStore = useAgentStore;

// ========== STORE EXPORTS ==========
export type { Agent, AgentMessage, AgentRecommendation, AgentTask, AgentPerformance, AgentState };
export default agentStore;