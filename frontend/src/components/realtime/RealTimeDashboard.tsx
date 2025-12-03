// JAC Learning Platform - Enterprise Real-time Intelligence Platform
// Advanced real-time dashboard with AI insights, collaboration, and analytics
//
// Author: Cavin Otieno
// Created: 2025-12-03
// Enhanced from Cavin Otieno's original implementation (463 lines)
// Growth: 463 → 1,800+ lines (290% enhancement!)
// TypeScript checking disabled due to library compatibility issues

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, ComposedChart, ScatterChart, Scatter
} from 'recharts';
import { 
  Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, RefreshCw,
  Wifi, WifiOff, Clock, Target, Users, Brain, Download, Share2, Settings,
  Play, Pause, Filter, Search, Bell, BellOff, Eye, EyeOff, Zap, Globe,
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Activity as ActivityIcon,
  MessageSquare, Video, Calendar, UserCheck, Award, Star, ThumbsUp, MessageCircle,
  ArrowUpRight, ArrowDownRight, Minus, AlertCircle, Info, XCircle, Crown,
  Gem, Flame, Trophy, Medal, Target as TargetIcon, Brain as BrainIcon
} from 'lucide-react';

// Enhanced Types for Enterprise Intelligence
interface RealTimeDashboardProps {
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  userRole?: 'student' | 'instructor' | 'admin';
  enableCollaboration?: boolean;
  enableAI?: boolean;
  enableExport?: boolean;
  showAdvancedMetrics?: boolean;
}

interface ConnectionStatus {
  status: 'connected' | 'connecting' | 'error' | 'disconnected';
  lastConnected?: string;
  reconnectAttempts: number;
  latency?: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface RealTimeMetrics {
  daily_activities: number;
  average_score: number;
  engagement_level: number;
  performance_trend: 'improving' | 'declining' | 'stable';
  last_updated: string;
  active_sessions: number;
  completion_rate: number;
  time_spent_today: number;
  streak_days: number;
  accuracy_rate: number;
  response_time: number;
  cognitive_load: number;
  flow_state_score: number;
}

interface ActivityItem {
  id: string;
  type: 'module_progress' | 'assessment_completed' | 'collaboration' | 'achievement' | 'milestone';
  title: string;
  description?: string;
  timestamp: string;
  status?: string;
  score?: number;
  duration?: number;
  user?: string;
  icon?: string;
  color?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface AlertItem {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error' | 'reminder' | 'achievement';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  actionable: boolean;
  acknowledged?: boolean;
  autoHide?: boolean;
  category?: string;
  priority_score?: number;
}

interface CollaborationData {
  active_users: number;
  team_activities: Array<{
    user: string;
    action: string;
    timestamp: string;
    context?: string;
  }>;
  shared_insights: Array<{
    id: string;
    content: string;
    author: string;
    timestamp: string;
    likes: number;
    replies: number;
  }>;
  peer_achievements: Array<{
    user: string;
    achievement: string;
    timestamp: string;
    icon: string;
  }>;
  real_time_presence: Array<{
    user: string;
    status: 'active' | 'idle' | 'away';
    last_seen: string;
    current_activity?: string;
  }>;
}

interface AIGeneratedInsights {
  recommendations: string[];
  pattern_analysis: string;
  performance_prediction: string;
  learning_suggestions: string[];
  risk_alerts: string[];
  optimization_opportunities: string[];
  social_learning_insights: string;
  motivation_factors: string;
  generated_at: string;
  confidence_score: number;
  ai_model: string;
}

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'pptx' | 'png';
  timeRange: 'today' | 'week' | 'month' | 'quarter' | 'custom';
  includeActivities: boolean;
  includeAlerts: boolean;
  includeMetrics: boolean;
  includeCollaborations: boolean;
  customDateRange?: {
    start: string;
    end: string;
  };
}

interface ComprehensiveDashboardData {
  metrics: RealTimeMetrics;
  activities: ActivityItem[];
  alerts: AlertItem[];
  collaboration: CollaborationData;
  insights?: AIGeneratedInsights;
  connection_status: {
    dashboard: ConnectionStatus;
    alerts: ConnectionStatus;
    metrics: ConnectionStatus;
    collaboration: ConnectionStatus;
  };
  performance_benchmarking?: {
    peer_rank: number;
    class_average: number;
    global_average: number;
    improvement_rate: number;
    percentile: number;
  };
}

// Enhanced WebSocket hook for real-time intelligence
export const useRealtimeIntelligence = (enableCollaboration: boolean = true, enableAI: boolean = true) => {
  const [dashboardData, setDashboardData] = useState<ComprehensiveDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeConnections, setActiveConnections] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    try {
      const ws = new WebSocket(`${process.env.REACT_APP_WS_URL || 'wss://api.example.com'}/intelligence`);
      
      ws.onopen = () => {
        console.log('Connected to real-time intelligence platform');
        setActiveConnections(prev => prev + 1);
        setError(null);
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'INTELLIGENCE_UPDATE') {
          setDashboardData(data.payload);
        } else if (data.type === 'AI_INSIGHTS_UPDATE') {
          setDashboardData(prev => prev ? { ...prev, insights: data.payload } : null);
        } else if (data.type === 'COLLABORATION_UPDATE') {
          setDashboardData(prev => prev ? { ...prev, collaboration: data.payload } : null);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection failed');
      };
      
      ws.onclose = () => {
        setActiveConnections(prev => Math.max(0, prev - 1));
        setTimeout(connectWebSocket, 3000);
      };
      
      wsRef.current = ws;
    } catch (err) {
      setError('Failed to establish connection');
    }
  }, []);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const exportData = useCallback(async (options: ExportOptions) => {
    if (!dashboardData) return;
    
    // Simulate export process
    console.log('Exporting data with options:', options);
    
    // In real implementation, this would call the export API
    return Promise.resolve();
  }, [dashboardData]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  return {
    dashboardData,
    isLoading,
    error,
    activeConnections,
    refreshData,
    exportData,
    connectWebSocket
  };
};

// Enhanced AI insights service
export const useAIInsights = () => {
  const [insights, setInsights] = useState<AIGeneratedInsights | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInsights = useCallback(async (dashboardData: ComprehensiveDashboardData) => {
    setIsGenerating(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockInsights: AIGeneratedInsights = {
        recommendations: [
          "Consider reviewing Module 3 concepts before proceeding",
          "Your peak learning time is 2-4 PM - schedule complex tasks then",
          "Collaboration increases retention by 23% - engage with peers more",
          "Take a 15-minute break after 45 minutes of focused study"
        ],
        pattern_analysis: "Your learning patterns show strong visual-spatial intelligence with optimal performance during afternoon sessions. Engagement drops after 45-minute sessions.",
        performance_prediction: "Based on current trends, you're on track to achieve Advanced proficiency within 3 weeks with consistent daily practice.",
        learning_suggestions: [
          "Use mind maps for complex concepts",
          "Practice active recall techniques",
          "Join the study group for Chapter 5",
          "Schedule review sessions every 3 days"
        ],
        risk_alerts: [
          "Engagement declining over last 3 days - consider taking a break",
          "Assessment scores below personal average - review key concepts"
        ],
        optimization_opportunities: [
          "Optimal session length: 35-40 minutes for maximum retention",
          "Best time for complex problem-solving: 3-4 PM",
          "Peer study sessions improve comprehension by 34%"
        ],
        social_learning_insights: "Your collaborative learning activities are 40% above class average, indicating strong social learning preferences.",
        motivation_factors: "Achievement-based goals and peer recognition drive your highest engagement levels.",
        generated_at: new Date().toISOString(),
        confidence_score: 0.87,
        ai_model: "GPT-4 Enhanced Learning Analytics v2.1"
      };
      
      setInsights(mockInsights);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { insights, isGenerating, generateInsights };
};

// Collaboration service hook
export const useCollaboration = () => {
  const [collaborationData, setCollaborationData] = useState<CollaborationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadCollaborationData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      const mockData: CollaborationData = {
        active_users: 24,
        team_activities: [
          { user: "Alice Chen", action: "Completed Module 4", timestamp: new Date().toISOString(), context: "Advanced Mathematics" },
          { user: "Bob Smith", action: "Started group discussion", timestamp: new Date(Date.now() - 300000).toISOString(), context: "Physics Concepts" },
          { user: "Carol Davis", action: "Shared study notes", timestamp: new Date(Date.now() - 600000).toISOString(), context: "Chemistry Lab" }
        ],
        shared_insights: [
          {
            id: "1",
            content: "The best way to understand quantum mechanics is through visual simulations",
            author: "Dr. Einstein",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            likes: 15,
            replies: 3
          },
          {
            id: "2", 
            content: "Practice problems from Chapter 3 are excellent for exam preparation",
            author: "Study Buddy",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            likes: 8,
            replies: 1
          }
        ],
        peer_achievements: [
          { user: "David Lee", achievement: "100-Day Streak", timestamp: new Date().toISOString(), icon: "🔥" },
          { user: "Emma Wilson", achievement: "Perfect Score", timestamp: new Date(Date.now() - 1800000).toISOString(), icon: "⭐" },
          { user: "Frank Miller", achievement: "Collaboration Master", timestamp: new Date(Date.now() - 3600000).toISOString(), icon: "🤝" }
        ],
        real_time_presence: [
          { user: "You", status: "active", last_seen: new Date().toISOString(), current_activity: "Real-time Dashboard" },
          { user: "Alice", status: "active", last_seen: new Date(Date.now() - 300000).toISOString(), current_activity: "Module 5" },
          { user: "Bob", status: "idle", last_seen: new Date(Date.now() - 600000).toISOString(), current_activity: "Discussion Forum" }
        ]
      };
      
      setCollaborationData(mockData);
    } catch (error) {
      console.error('Failed to load collaboration data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { collaborationData, isLoading, loadCollaborationData };
};

// Enhanced Export Service
export const useExportIntelligence = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportData = useCallback(async (options: ExportOptions, data: ComprehensiveDashboardData) => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export process with progress
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Generate export file based on format
      let filename = `real-time-intelligence-${new Date().toISOString().split('T')[0]}`;
      
      switch (options.format) {
        case 'pdf':
          filename += '.pdf';
          break;
        case 'excel':
          filename += '.xlsx';
          break;
        case 'csv':
          filename += '.csv';
          break;
        case 'json':
          filename += '.json';
          break;
        case 'pptx':
          filename += '.pptx';
          break;
        case 'png':
          filename += '.png';
          break;
      }

      // In real implementation, this would download the actual file
      console.log(`Exported ${options.format} file: ${filename}`);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, []);

  return { isExporting, exportProgress, exportData };
};

// Main Enhanced Real-time Dashboard Component
export const RealTimeDashboard: React.FC<RealTimeDashboardProps> = ({
  className = '',
  autoRefresh = true,
  refreshInterval = 30000,
  userRole = 'student',
  enableCollaboration = true,
  enableAI = true,
  enableExport = true,
  showAdvancedMetrics = true
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alertFilter, setAlertFilter] = useState<string>('all');
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [realTimeConnection, setRealTimeConnection] = useState<WebSocket | null>(null);

  // Custom hooks for enhanced functionality
  const { 
    dashboardData, 
    isLoading, 
    error, 
    activeConnections, 
    refreshData, 
    exportData: exportIntelligenceData 
  } = useRealtimeIntelligence(enableCollaboration, enableAI);

  const { 
    insights, 
    isGenerating, 
    generateInsights 
  } = useAIInsights();

  const { 
    collaborationData, 
    isLoading: collaborationLoading, 
    loadCollaborationData 
  } = useCollaboration();

  const { 
    isExporting, 
    exportProgress, 
    exportData 
  } = useExportIntelligence();

  // Enhanced refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refreshData(),
        enableCollaboration && loadCollaborationData(),
        enableAI && dashboardData && generateInsights(dashboardData)
      ]);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1500);
    }
  }, [refreshData, enableCollaboration, loadCollaborationData, enableAI, dashboardData, generateInsights]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, handleRefresh]);

  // Auto-generate insights when data changes
  useEffect(() => {
    if (dashboardData && enableAI && !insights) {
      generateInsights(dashboardData);
    }
  }, [dashboardData, enableAI, insights, generateInsights]);

  // Auto-load collaboration data
  useEffect(() => {
    if (enableCollaboration && !collaborationData) {
      loadCollaborationData();
    }
  }, [enableCollaboration, collaborationData, loadCollaborationData]);

  // Connection status handling
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`${process.env.REACT_APP_WS_URL || 'wss://api.example.com'}/dashboard`);
        ws.onopen = () => setRealTimeConnection(ws);
        ws.onerror = () => setTimeout(connectWebSocket, 5000);
        ws.onclose = () => setTimeout(connectWebSocket, 5000);
      } catch {
        setTimeout(connectWebSocket, 5000);
      }
    };
    connectWebSocket();
  }, []);

  if (isLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-blue-600 text-sm font-medium">Loading Intelligence...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 m-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-400 font-semibold mb-2">Connection Error</h3>
            <p className="text-red-300">{error}</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center text-white/70 py-12 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="text-6xl mb-4">📡</div>
        <h3 className="text-xl font-semibold mb-2">No Real-time Data Available</h3>
        <p className="text-white/60">Start learning to generate real-time insights</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 ${className}`}>
      {/* Enhanced Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <span className="text-3xl mr-3">📡</span>
                Real-time Intelligence Platform
              </h1>
              {realTimeConnection?.readyState === WebSocket.OPEN && (
                <div className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm">Live Intelligence</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <div className="flex items-center space-x-1">
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span>{activeConnections} Active</span>
                </div>
              </div>

              {/* Export Button */}
              {enableExport && (
                <button
                  onClick={() => setExportModalOpen(true)}
                  className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center space-x-2"
                  disabled={isExporting}
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? `Exporting ${exportProgress}%` : 'Export'}
                </button>
              )}

              {/* AI Insights Button */}
              {enableAI && (
                <button
                  onClick={() => generateInsights(dashboardData)}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center space-x-2"
                >
                  <Brain className="w-4 h-4" />
                  {isGenerating ? '🤖 Generating...' : '🤖 AI Insights'}
                </button>
              )}

              {/* Refresh Button */}
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { id: 'activities', label: '⚡ Live Activities', icon: '⚡' },
              { id: 'metrics', label: '📈 Real-time Metrics', icon: '📈' },
              { id: 'alerts', label: '🚨 Smart Alerts', icon: '🚨', badge: dashboardData.alerts?.filter(a => !a.acknowledged).length },
              { id: 'collaboration', label: '👥 Team Intelligence', icon: '👥', disabled: !enableCollaboration },
              { id: 'ai-insights', label: '🤖 AI Insights', icon: '🤖', disabled: !enableAI }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-300'
                    : tab.disabled
                    ? 'border-transparent text-white/40 cursor-not-allowed'
                    : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
                }`}
                disabled={tab.disabled}
              >
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <DashboardTab 
                data={dashboardData}
                insights={insights}
                userRole={userRole}
                onRefresh={handleRefresh}
              />
            </motion.div>
          )}

          {activeTab === 'activities' && (
            <motion.div
              key="activities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <ActivitiesTab 
                activities={dashboardData.activities}
                filter={activityFilter}
                setFilter={setActivityFilter}
                collaborationData={collaborationData}
              />
            </motion.div>
          )}

          {activeTab === 'metrics' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <MetricsTab 
                metrics={dashboardData.metrics}
                benchmarking={dashboardData.performance_benchmarking}
                showAdvanced={showAdvancedMetrics}
              />
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <AlertsTab 
                alerts={dashboardData.alerts}
                filter={alertFilter}
                setFilter={setAlertFilter}
              />
            </motion.div>
          )}

          {activeTab === 'collaboration' && enableCollaboration && (
            <motion.div
              key="collaboration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <CollaborationTab 
                data={collaborationData}
                isLoading={collaborationLoading}
              />
            </motion.div>
          )}

          {activeTab === 'ai-insights' && enableAI && (
            <motion.div
              key="ai-insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <AIInsightsTab 
                insights={insights}
                isGenerating={isGenerating}
                onRegenerate={() => generateInsights(dashboardData)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export Modal */}
      <ExportModal 
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={(format, options) => exportData({ ...options, format }, dashboardData)}
        isExporting={isExporting}
        exportProgress={exportProgress}
      />
    </div>
  );
};

// Enhanced Dashboard Tab Component
const DashboardTab: React.FC<{
  data: ComprehensiveDashboardData;
  insights: AIGeneratedInsights | null;
  userRole: string;
  onRefresh: () => void;
}> = ({ data, insights, userRole, onRefresh }) => {
  const { metrics, connection_status } = data;

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return { icon: TrendingUp, color: 'text-green-400' };
      case 'declining': return { icon: TrendingDown, color: 'text-red-400' };
      default: return { icon: Minus, color: 'text-gray-400' };
    }
  };

  const connectionStatus = getTrendIcon(metrics.performance_trend);
  const ConnectionIcon = connectionStatus.icon;

  return (
    <div className="space-y-6">
      {/* Connection Status Overview */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-white flex items-center">
            <span className="text-3xl mr-3">📊</span>Real-time Intelligence Overview
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <ConnectionIcon className={`w-4 h-4 ${connectionStatus.color}`} />
              <span className={connectionStatus.color}>System Status: {metrics.performance_trend.toUpperCase()}</span>
            </div>
            <button 
              onClick={onRefresh}
              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-sm hover:bg-blue-500/30 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* AI Insights Preview */}
      {insights && (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <span className="text-2xl mr-2">🤖</span>AI-Powered Recommendations
            </h4>
            <div className="text-xs text-white/60">
              Confidence: {(insights.confidence_score * 100).toFixed(0)}% • {insights.ai_model}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.recommendations.slice(0, 4).map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-start">
                  <span className="text-purple-400 mr-3 mt-1">•</span>
                  <span className="text-white/90 text-sm leading-relaxed">{recommendation}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-lg rounded-lg p-6 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-300">
                {metrics.daily_activities}
              </div>
              <div className="text-white/70 text-sm">Daily Activities</div>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-green-200 text-xs">
              {metrics.completion_rate.toFixed(1)}% completion rate
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-lg rounded-lg p-6 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-300">
                {metrics.average_score.toFixed(1)}%
              </div>
              <div className="text-white/70 text-sm">Average Score</div>
            </div>
            <div className="text-4xl">📈</div>
          </div>
          <div className="mt-4 flex items-center">
            <ConnectionIcon className={`w-4 h-4 mr-1 ${connectionStatus.color}`} />
            <span className={`text-xs ${connectionStatus.color}`}>
              {metrics.performance_trend} trend
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-300">
                {metrics.engagement_level.toFixed(0)}%
              </div>
              <div className="text-white/70 text-sm">Engagement Level</div>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
          <div className="mt-4 flex items-center">
            <Flame className="w-4 h-4 text-orange-400 mr-1" />
            <span className="text-orange-200 text-xs">
              {metrics.streak_days} day streak
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-lg rounded-lg p-6 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-300">
                {Math.floor(metrics.time_spent_today / 60)}h {metrics.time_spent_today % 60}m
              </div>
              <div className="text-white/70 text-sm">Time Spent Today</div>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
          <div className="mt-4 flex items-center">
            <Clock className="w-4 h-4 text-blue-400 mr-1" />
            <span className="text-blue-200 text-xs">
              Last updated: {formatTime(metrics.last_updated)}
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Activity Preview */}
      {data.activities.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">⚡</span>Recent Activities
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data.activities.slice(0, 5).map((activity, index) => (
              <div key={activity.id || index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.priority === 'high' ? 'bg-red-500' :
                    activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{activity.title}</p>
                  <p className="text-white/60 text-xs">{activity.type.replace('_', ' ')}</p>
                </div>
                <div className="text-white/40 text-xs">
                  {formatTime(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Alerts Summary */}
      {data.alerts.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">🚨</span>Active Alerts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['high', 'medium', 'low'].map(severity => {
              const alerts = data.alerts.filter(a => a.severity === severity && !a.acknowledged);
              return (
                <div key={severity} className={`rounded-lg p-4 ${
                  severity === 'high' ? 'bg-red-500/10 border border-red-500/20' :
                  severity === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                  'bg-green-500/10 border border-green-500/20'
                }`}>
                  <div className={`text-2xl font-bold ${
                    severity === 'high' ? 'text-red-400' :
                    severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {alerts.length}
                  </div>
                  <div className="text-white/70 text-sm capitalize">{severity} Priority</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Activities Tab Component
const ActivitiesTab: React.FC<{
  activities: ActivityItem[];
  filter: string;
  setFilter: (filter: string) => void;
  collaborationData: CollaborationData | null;
}> = ({ activities, filter, setFilter, collaborationData }) => {
  const filteredActivities = useMemo(() => {
    if (filter === 'all') return activities;
    return activities.filter(activity => activity.type === filter);
  }, [activities, filter]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'module_progress': return { icon: Target, color: 'text-blue-400' };
      case 'assessment_completed': return { icon: CheckCircle, color: 'text-green-400' };
      case 'collaboration': return { icon: Users, color: 'text-purple-400' };
      case 'achievement': return { icon: Award, color: 'text-yellow-400' };
      case 'milestone': return { icon: Trophy, color: 'text-orange-400' };
      default: return { icon: Activity, color: 'text-gray-400' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-white flex items-center">
            <span className="text-3xl mr-3">⚡</span>Live Activity Stream
          </h3>
          <div className="flex items-center space-x-4">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
            >
              <option value="all">All Activities</option>
              <option value="module_progress">Module Progress</option>
              <option value="assessment_completed">Assessments</option>
              <option value="collaboration">Collaboration</option>
              <option value="achievement">Achievements</option>
              <option value="milestone">Milestones</option>
            </select>
            <div className="text-white/70 text-sm">
              {filteredActivities.length} activities
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Activities List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredActivities.map((activity, index) => {
            const iconInfo = getActivityIcon(activity.type);
            const IconComponent = iconInfo.icon;
            
            return (
              <motion.div
                key={activity.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <IconComponent className={`w-5 h-5 ${iconInfo.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{activity.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        activity.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                        activity.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {activity.priority || 'normal'}
                      </span>
                      <span className="text-white/60 text-xs">
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  {activity.description && (
                    <p className="text-white/70 text-sm mb-2">{activity.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm">
                    {activity.score && (
                      <span className="text-blue-400">Score: {activity.score}%</span>
                    )}
                    {activity.duration && (
                      <span className="text-purple-400">Duration: {activity.duration}min</span>
                    )}
                    {activity.user && (
                      <span className="text-green-400">By: {activity.user}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Collaboration Activities */}
      {collaborationData && collaborationData.team_activities.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">👥</span>Team Activities
          </h4>
          <div className="space-y-3">
            {collaborationData.team_activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Users className="w-4 h-4 text-purple-400" />
                <div className="flex-1">
                  <span className="text-white font-medium">{activity.user}</span>
                  <span className="text-white/70"> {activity.action}</span>
                  {activity.context && (
                    <span className="text-purple-300"> ({activity.context})</span>
                  )}
                </div>
                <span className="text-white/60 text-xs">
                  {formatTime(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Metrics Tab Component
const MetricsTab: React.FC<{
  metrics: RealTimeMetrics;
  benchmarking?: any;
  showAdvanced: boolean;
}> = ({ metrics, benchmarking, showAdvanced }) => {
  const chartData = useMemo(() => {
    // Generate sample chart data
    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activities: Math.floor(Math.random() * 10) + 1,
      engagement: Math.floor(Math.random() * 100) + 1,
      score: Math.floor(Math.random() * 100) + 1
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <span className="text-3xl mr-3">📈</span>Real-time Performance Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{metrics.active_sessions}</div>
            <div className="text-white/70 text-sm">Active Sessions</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{metrics.completion_rate.toFixed(1)}%</div>
            <div className="text-white/70 text-sm">Completion Rate</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{metrics.accuracy_rate.toFixed(1)}%</div>
            <div className="text-white/70 text-sm">Accuracy Rate</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-400">{metrics.flow_state_score.toFixed(0)}%</div>
            <div className="text-white/70 text-sm">Flow State</div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">📊</span>Hourly Activity Pattern
          </h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="hour" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="activities" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">⚡</span>Engagement Levels
          </h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="hour" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#8b5cf6" 
                  fill="rgba(139, 92, 246, 0.3)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Advanced Metrics */}
      {showAdvanced && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">🧠</span>Advanced Cognitive Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-white font-medium mb-2">Cognitive Load</h5>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-blue-400">{metrics.cognitive_load.toFixed(0)}%</span>
                <div className="w-24 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.cognitive_load}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-white/60 text-sm">
                {metrics.cognitive_load > 80 ? 'High - Consider breaks' :
                 metrics.cognitive_load > 60 ? 'Moderate - Optimal range' : 'Low - Room for challenge'}
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-white font-medium mb-2">Response Time</h5>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-green-400">{metrics.response_time}ms</span>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-white/60 text-sm">
                {metrics.response_time < 500 ? 'Excellent speed' :
                 metrics.response_time < 1000 ? 'Good performance' : 'Could be faster'}
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-white font-medium mb-2">Flow State</h5>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-purple-400">{metrics.flow_state_score.toFixed(0)}%</span>
                <TargetIcon className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-white/60 text-sm">
                {metrics.flow_state_score > 80 ? 'Deep flow state achieved' :
                 metrics.flow_state_score > 60 ? 'Good flow development' : 'Building toward flow'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Benchmarking */}
      {benchmarking && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">🏆</span>Performance Benchmarking
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-4 text-center border border-yellow-500/30">
              <div className="text-3xl font-bold text-yellow-400">#{benchmarking.peer_rank}</div>
              <div className="text-white/70 text-sm">Peer Rank</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{benchmarking.class_average.toFixed(1)}%</div>
              <div className="text-white/70 text-sm">Class Average</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{benchmarking.global_average.toFixed(1)}%</div>
              <div className="text-white/70 text-sm">Global Average</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 text-center border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-400">{benchmarking.percentile}th</div>
              <div className="text-white/70 text-sm">Percentile</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Alerts Tab Component
const AlertsTab: React.FC<{
  alerts: AlertItem[];
  filter: string;
  setFilter: (filter: string) => void;
}> = ({ alerts, filter, setFilter }) => {
  const filteredAlerts = useMemo(() => {
    if (filter === 'all') return alerts;
    if (filter === 'unread') return alerts.filter(alert => !alert.acknowledged);
    return alerts.filter(alert => alert.severity === filter);
  }, [alerts, filter]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getAlertIcon = (type: string, severity: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'reminder': return Clock;
      case 'achievement': return Award;
      default: return AlertCircle;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500/30 bg-red-500/10';
      case 'medium': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'low': return 'border-green-500/30 bg-green-500/10';
      default: return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-white flex items-center">
            <span className="text-3xl mr-3">🚨</span>Smart Alert System
          </h3>
          <div className="flex items-center space-x-4">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
            >
              <option value="all">All Alerts</option>
              <option value="unread">Unread Only</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <div className="text-white/70 text-sm">
              {filteredAlerts.length} alerts
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => {
          const AlertIcon = getAlertIcon(alert.type, alert.severity);
          
          return (
            <motion.div
              key={alert.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-lg border backdrop-blur-lg ${getAlertColor(alert.severity)} ${
                alert.acknowledged ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <AlertIcon className={`w-6 h-6 ${
                    alert.severity === 'high' ? 'text-red-400' :
                    alert.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold text-lg">{alert.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                        alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {alert.severity} priority
                      </span>
                      <span className="text-white/60 text-xs">
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/90 mb-4 leading-relaxed">{alert.message}</p>
                  {alert.actionable && (
                    <div className="flex items-center space-x-3">
                      <button className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                        Take Action
                      </button>
                      <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm">
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white/70 mb-2">All Clear!</h3>
          <p className="text-white/50">No alerts match your current filter.</p>
        </div>
      )}
    </div>
  );
};

// Collaboration Tab Component
const CollaborationTab: React.FC<{
  data: CollaborationData | null;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
        <p className="text-white/70">Loading collaboration data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-white/50 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white/70 mb-2">No Collaboration Data</h3>
        <p className="text-white/50">Connect with others to see team activities.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collaboration Overview */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <span className="text-3xl mr-3">👥</span>Team Intelligence Hub
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-lg p-4 text-center border border-green-500/30">
            <div className="text-3xl font-bold text-green-300">{data.active_users}</div>
            <div className="text-white/70 text-sm">Active Users</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-lg p-4 text-center border border-purple-500/30">
            <div className="text-3xl font-bold text-purple-300">{data.shared_insights.length}</div>
            <div className="text-white/70 text-sm">Shared Insights</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-lg p-4 text-center border border-blue-500/30">
            <div className="text-3xl font-bold text-blue-300">{data.peer_achievements.length}</div>
            <div className="text-white/70 text-sm">Peer Achievements</div>
          </div>
        </div>
      </div>

      {/* Real-time Presence */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">🟢</span>Real-time Presence
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.real_time_presence.map((presence, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                presence.status === 'active' ? 'bg-green-400' :
                presence.status === 'idle' ? 'bg-yellow-400' : 'bg-gray-400'
              }`}></div>
              <div className="flex-1">
                <div className="text-white font-medium">{presence.user}</div>
                <div className="text-white/60 text-sm">
                  {presence.current_activity || 'Available'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Insights */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">💡</span>Shared Insights
        </h4>
        <div className="space-y-4">
          {data.shared_insights.map((insight, index) => (
            <div key={insight.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-start justify-between mb-2">
                <div className="text-white font-medium">{insight.author}</div>
                <div className="flex items-center space-x-2 text-sm text-white/60">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{insight.likes}</span>
                  <MessageCircle className="w-4 h-4 ml-2" />
                  <span>{insight.replies}</span>
                </div>
              </div>
              <p className="text-white/90 mb-2">{insight.content}</p>
              <div className="text-white/60 text-xs">
                {new Date(insight.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peer Achievements */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">🏆</span>Recent Peer Achievements
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.peer_achievements.map((achievement, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="text-white font-medium">{achievement.user}</div>
                  <div className="text-yellow-300">{achievement.achievement}</div>
                  <div className="text-white/60 text-xs">
                    {new Date(achievement.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// AI Insights Tab Component
const AIInsightsTab: React.FC<{
  insights: AIGeneratedInsights | null;
  isGenerating: boolean;
  onRegenerate: () => void;
}> = ({ insights, isGenerating, onRegenerate }) => {
  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
          <Brain className="absolute inset-0 m-auto w-6 h-6 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">AI is analyzing your data...</h3>
        <p className="text-white/60">Generating personalized insights using advanced AI</p>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-white/70 mb-2">No AI Insights Available</h3>
        <p className="text-white/50 mb-6">Generate AI-powered insights to get personalized recommendations</p>
        <button 
          onClick={onRegenerate}
          className="px-6 py-3 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
        >
          Generate AI Insights
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-white flex items-center">
            <span className="text-3xl mr-3">🤖</span>AI-Powered Intelligence
          </h3>
          <button 
            onClick={onRegenerate}
            className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            Regenerate
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-white/70">AI Model:</span>
            <span className="text-purple-300 ml-2">{insights.ai_model}</span>
          </div>
          <div>
            <span className="text-white/70">Confidence:</span>
            <span className="text-green-300 ml-2">{(insights.confidence_score * 100).toFixed(0)}%</span>
          </div>
          <div>
            <span className="text-white/70">Generated:</span>
            <span className="text-blue-300 ml-2">{new Date(insights.generated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Pattern Analysis */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">🔍</span>Pattern Analysis
        </h4>
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-white/90 leading-relaxed">{insights.pattern_analysis}</p>
        </div>
      </div>

      {/* Performance Prediction */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">🎯</span>Performance Prediction
        </h4>
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-white/90 leading-relaxed">{insights.performance_prediction}</p>
        </div>
      </div>

      {/* Learning Suggestions */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">💡</span>AI-Generated Recommendations
        </h4>
        <div className="space-y-3">
          {insights.learning_suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4"
            >
              <div className="flex items-start">
                <span className="text-purple-400 mr-3 mt-1">🤖</span>
                <span className="text-white/90 text-sm leading-relaxed">{suggestion}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      {insights.risk_alerts.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">⚠️</span>Risk Assessment
          </h4>
          <div className="space-y-3">
            {insights.risk_alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <span className="text-red-400 mr-3 mt-1">⚠️</span>
                  <span className="text-white/90 text-sm leading-relaxed">{alert}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Optimization Opportunities */}
      {insights.optimization_opportunities.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">🚀</span>Optimization Opportunities
          </h4>
          <div className="space-y-3">
            {insights.optimization_opportunities.map((opportunity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">🚀</span>
                  <span className="text-white/90 text-sm leading-relaxed">{opportunity}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Social Learning Insights */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">👥</span>Social Learning Insights
        </h4>
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
          <p className="text-white/90 leading-relaxed">{insights.social_learning_insights}</p>
        </div>
      </div>

      {/* Motivation Factors */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">⚡</span>Motivation Factors
        </h4>
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4">
          <p className="text-white/90 leading-relaxed">{insights.motivation_factors}</p>
        </div>
      </div>
    </div>
  );
};

// Enhanced Export Modal Component
const ExportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, options: Partial<ExportOptions>) => void;
  isExporting: boolean;
  exportProgress: number;
}> = ({ isOpen, onClose, onExport, isExporting, exportProgress }) => {
  if (!isOpen) return null;

  const exportFormats = [
    { id: 'pdf', name: 'PDF Report', icon: '📄', description: 'Comprehensive intelligence report' },
    { id: 'excel', name: 'Excel Workbook', icon: '📊', description: 'Detailed metrics and data' },
    { id: 'pptx', name: 'PowerPoint', icon: '📽️', description: 'Executive presentation' },
    { id: 'csv', name: 'CSV Data', icon: '📈', description: 'Raw data for analysis' },
    { id: 'json', name: 'JSON API', icon: '🔧', description: 'Structured data export' },
    { id: 'png', name: 'Dashboard Images', icon: '🖼️', description: 'High-res charts' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="text-3xl mr-3">📊</span>Export Real-time Intelligence
            </h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          {isExporting ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Exporting Intelligence...</h3>
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
              <p className="text-white/70">{exportProgress}% complete</p>
            </div>
          ) : (
            <>
              {/* Format Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Choose Export Format</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exportFormats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => onExport(format.id, {
                        timeRange: 'week',
                        includeActivities: true,
                        includeAlerts: true,
                        includeMetrics: true,
                        includeCollaborations: true
                      })}
                      className="bg-white/5 border border-white/20 rounded-lg p-4 text-left hover:bg-white/10 transition-colors"
                    >
                      <div className="text-3xl mb-2">{format.icon}</div>
                      <div className="text-white font-medium mb-1">{format.name}</div>
                      <div className="text-white/60 text-sm">{format.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Export */}
              <div className="border-t border-white/20 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Export</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onExport('pdf', {
                      timeRange: 'today',
                      includeActivities: true,
                      includeAlerts: true,
                      includeMetrics: true,
                      includeCollaborations: false
                    })}
                    className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    📄 Today's Report
                  </button>
                  <button
                    onClick={() => onExport('excel', {
                      timeRange: 'week',
                      includeActivities: true,
                      includeAlerts: true,
                      includeMetrics: true,
                      includeCollaborations: true
                    })}
                    className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    📊 Weekly Data
                  </button>
                  <button
                    onClick={() => onExport('pptx', {
                      timeRange: 'month',
                      includeActivities: false,
                      includeAlerts: true,
                      includeMetrics: true,
                      includeCollaborations: false
                    })}
                    className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
                  >
                    📽️ Executive Summary
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeDashboard;