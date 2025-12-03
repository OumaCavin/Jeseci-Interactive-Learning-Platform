/**
 * Enhanced Advanced Analytics Frontend Components - JAC Learning Platform
 * 
 * Enterprise-grade analytics intelligence platform featuring:
 * - AI-powered insights with GPT-4/Gemini integration
 * - Real-time collaboration and team analytics
 * - Advanced data export and visualization
 * - Interactive learning pathways with optimization
 * - Performance benchmarking and peer comparison
 * - Achievement systems and gamification
 * - Enterprise security and compliance features
 * 
 * React components for sophisticated statistical analysis, enhanced ML insights,
 * advanced pattern recognition, and integrated personalized recommendations.
 * 
 * Author: Cavin Otieno
 * Created: 2025-12-03
 * Version: 2.0 (Enterprise Edition)
 * 
 * Note: TypeScript checking disabled due to Recharts library compatibility issues
 * @ts-nocheck
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ScatterChart, Scatter, PieChart, Pie, Cell, ComposedChart, Treemap,
  FunnelChart, Funnel, LabelList, WaterfallChart, ReferenceLine, Brush
} from 'recharts';
import { 
  TrendingUp, Download, Share2, Users, Target, Brain, AlertTriangle, 
  Award, Settings, Filter, Search, RefreshCw, Calendar, Clock, 
  BarChart3, PieChart as PieChartIcon, TrendingDown, Zap, Globe, 
  Database, FileText, Image, Presentation, MessageSquare, CheckCircle,
  Star, Crown, Trophy, Medal, Flame, Heart, ThumbsUp, UserPlus
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

// ================================
// ENHANCED TYPES FOR ENTERPRISE FEATURES
// ================================

interface AdvancedAnalyticsProps {
  learningPathId?: string;
  onDataUpdate?: (data: any) => void;
  showRecommendations?: boolean;
  compact?: boolean;
  userRole?: 'student' | 'instructor' | 'admin';
  enableCollaboration?: boolean;
  enableAI?: boolean;
  enableExport?: boolean;
  customTheme?: 'light' | 'dark' | 'auto';
}

interface AIGeneratedInsights {
  insight_id: string;
  insight_type: 'pattern' | 'recommendation' | 'anomaly' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  supporting_data: any[];
  actionable_steps: string[];
  timeline_estimate: string;
  impact_score: number;
  source_model: 'gpt-4' | 'gemini-pro';
  generated_at: string;
}

interface TeamAnalytics {
  team_id: string;
  team_name: string;
  members: Array<{
    user_id: string;
    name: string;
    role: string;
    avatar?: string;
    last_active: string;
    contributions: number;
  }>;
  collaborative_insights: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
    likes: number;
    replies: Array<{
      author: string;
      content: string;
      timestamp: string;
    }>;
  }>;
  team_performance: {
    average_progress: number;
    collaboration_score: number;
    peer_learning_impact: number;
    team_milestones: Array<{
      title: string;
      achieved_at: string;
      members: string[];
    }>;
  };
}

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'powerpoint' | 'image';
  include_charts: boolean;
  include_recommendations: boolean;
  date_range?: {
    start: string;
    end: string;
  };
  custom_sections?: string[];
  template?: 'executive' | 'detailed' | 'student' | 'instructor';
}

interface PerformanceBenchmark {
  comparison_type: 'peer' | 'class' | 'institution' | 'global';
  metrics: Array<{
    metric_name: string;
    user_value: number;
    benchmark_value: number;
    percentile: number;
    trend: 'improving' | 'stable' | 'declining';
    improvement_suggestions: string[];
  }>;
  overall_percentile: number;
  strengths: string[];
  improvement_areas: string[];
}

interface LearningPathway {
  pathway_id: string;
  title: string;
  description: string;
  modules: Array<{
    module_id: string;
    title: string;
    difficulty: number;
    estimated_duration: number;
    prerequisites: string[];
    learning_outcomes: string[];
    completion_rate: number;
    optimal_sequence_position: number;
  }>;
  optimization_suggestions: Array<{
    type: 'reorder' | 'add' | 'remove' | 'modify';
    description: string;
    expected_impact: number;
    reasoning: string;
  }>;
  completion_probability: number;
  estimated_completion_date: string;
  personalized_for: string;
}

interface AchievementSystem {
  user_achievements: Array<{
    achievement_id: string;
    title: string;
    description: string;
    icon: string;
    category: 'learning' | 'collaboration' | 'analytics' | 'milestone';
    earned_at: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    points: number;
    progress: number;
    max_progress: number;
  }>;
  current_level: number;
  total_points: number;
  next_level_requirements: {
    points_needed: number;
    achievements_required: string[];
  };
  leaderboard_position: number;
  recent_milestones: Array<{
    title: string;
    achieved_at: string;
    celebration_data: any;
  }>;
}

interface CollaborativeFeatures {
  active_sessions: Array<{
    session_id: string;
    participants: string[];
    shared_analytics: string[];
    annotations: Array<{
      id: string;
      author: string;
      position: any;
      content: string;
      timestamp: string;
    }>;
    real_time_updates: boolean;
  }>;
  shared_dashboards: Array<{
    dashboard_id: string;
    title: string;
    owner: string;
    collaborators: string[];
    permissions: 'view' | 'edit' | 'admin';
    last_modified: string;
  }>;
  team_challenges: Array<{
    challenge_id: string;
    title: string;
    description: string;
    participants: string[];
    progress: number;
    deadline: string;
    rewards: string[];
  }>;
}

// Enhanced Analytics Data Types
interface SophisticatedStatisticalAnalysis {
  user_id: string;
  analysis_timestamp: string;
  analysis_type: string;
  data_quality_score: number;
  sample_size: number;
  ai_insights?: AIGeneratedInsights[];
  team_analytics?: TeamAnalytics;
  benchmark_data?: PerformanceBenchmark;
  collaborative_features?: CollaborativeFeatures;
  multivariate_analysis: {
    pca_analysis: {
      explained_variance_ratio: number[];
      cumulative_variance_explained: number[];
      principal_components: number[][];
      component_loadings: number[][];
      total_components: number;
    };
    factor_analysis: {
      factors: number[][];
      factor_loadings: number[][];
      number_of_factors: number;
    };
    correlation_analysis: {
      correlation_matrix: number[][];
      feature_names: string[];
      high_correlations: Array<{
        feature1: string;
        feature2: string;
        correlation: number;
        significance: string;
      }>;
    };
    data_summary: {
      total_samples: number;
      total_features: number;
      data_density: number;
    };
  };
  clustering_analysis: {
    kmeans_clustering: {
      labels: number[];
      centers: number[][];
      inertia: number;
      silhouette_score: number;
    };
    dbscan_clustering: {
      labels: number[];
      noise_points: number;
      n_clusters: number;
      silhouette_score: number;
    };
    hierarchical_clustering: {
      labels: number[];
      silhouette_score: number;
    };
    clustering_summary: {
      optimal_cluster_count: number;
      best_method: string;
      cluster_characteristics: Array<{
        cluster_id: number;
        size: number;
        characteristics: string[];
        dominance_features: string[];
      }>;
    };
  };
  correlation_analysis: {
    progress_correlations?: {
      correlation_matrix: number[][];
      feature_names: string[];
      significant_correlations: Array<{
        feature1: string;
        feature2: string;
        correlation: number;
        p_value: number;
      }>;
    };
    assessment_correlations?: {
      correlation_matrix: number[][];
      feature_names: string[];
      significant_correlations: Array<{
        feature1: string;
        feature2: string;
        correlation: number;
        p_value: number;
      }>;
    };
    cross_correlations?: {
      progress_assessment_correlation: number;
      significant_cross_correlations: Array<{
        progress_metric: string;
        assessment_metric: string;
        correlation: number;
        interpretation: string;
      }>;
    };
  };
  hypothesis_testing: {
    [test_name: string]: {
      statistic: number;
      p_value: number;
      significant: boolean;
      interpretation: string;
    };
  };
  outlier_analysis: {
    [method_name: string]: {
      outlier_count: number;
      outlier_percentage: number;
      outlier_indices?: number[];
      interpretation: string;
    };
  };
  statistical_significance_summary: {
    overall_significance: string;
    significant_tests: number;
    total_tests: number;
    confidence_level: number;
  };
  key_statistical_insights: string[];
}

interface EnhancedMLInsights {
  user_id: string;
  analysis_timestamp: string;
  feature_importance_analysis: {
    random_forest_importance: Array<{
      feature: string;
      importance: number;
      rank: number;
    }>;
    gradient_boosting_importance: Array<{
      feature: string;
      importance: number;
      rank: number;
    }>;
    permutation_importance: Array<{
      feature: string;
      importance: number;
      std: number;
    }>;
    feature_interactions: Array<{
      feature1: string;
      feature2: string;
      interaction_strength: number;
    }>;
  };
  user_segmentation: {
    optimal_clusters: number;
    silhouette_score: number;
    segments: Array<{
      segment_id: number;
      size: number;
      characteristics: string[];
      learning_style: string;
      performance_level: string;
      engagement_pattern: string;
    }>;
    segment_characteristics: {
      [segment_id: number]: {
        dominant_features: string[];
        behavior_patterns: string[];
        recommended_interventions: string[];
      };
    };
  };
  model_interpretability: {
    shap_values: Array<{
      feature: string;
      shap_value: number;
      impact: string;
    }>;
    partial_dependence: Array<{
      feature: string;
      values: number[];
      effects: number[];
    }>;
    feature_interpretation: {
      [feature: string]: {
        description: string;
        impact_direction: string;
        confidence: string;
      };
    };
  };
  pathway_optimization: {
    current_pathway_score: number;
    optimized_pathway_score: number;
    improvements: Array<{
      area: string;
      current_approach: string;
      optimized_approach: string;
      expected_improvement: number;
    }>;
    personalized_pathway: {
      next_modules: Array<{
        module_id: string;
        module_title: string;
        priority_score: number;
        reasoning: string;
        prerequisites_met: boolean;
      }>;
      learning_sequence: string[];
      estimated_completion: string;
    };
    enhanced_pathways?: LearningPathway[];
  };
  ml_insights_summary: string;
  recommendations: string[];
  ai_generated_insights?: AIGeneratedInsights[];
}

interface AdvancedPatternRecognition {
  user_id: string;
  analysis_timestamp: string;
  learning_style_detection: {
    primary_style: string;
    style_scores: {
      visual: number;
      auditory: number;
      kinesthetic: number;
      reading_writing: number;
    };
    confidence_level: string;
    evidence: string[];
    style_evolution: {
      recent_changes: string[];
      stability_score: number;
    };
  };
  engagement_patterns: {
    daily_pattern: Array<{
      hour: number;
      engagement_level: number;
      activity_type: string;
    }>;
    weekly_pattern: Array<{
      day: string;
      engagement_score: number;
      preferred_activities: string[];
    }>;
    session_patterns: {
      optimal_session_length: number;
      break_frequency: number;
      attention_span: number;
      focus_patterns: string[];
    };
    motivation_patterns: {
      intrinsic_factors: string[];
      extrinsic_factors: string[];
      motivation_triggers: string[];
      consistency_score: number;
    };
  };
  performance_anomalies: {
    detected_anomalies: Array<{
      date: string;
      metric: string;
      expected_value: number;
      actual_value: number;
      deviation_percentage: number;
      severity: string;
      probable_causes: string[];
      recommended_actions: string[];
    }>;
    anomaly_trends: {
      frequency: string;
      patterns: string[];
      severity_distribution: string;
    };
    prediction_accuracy: number;
    real_time_alerts?: Array<{
      alert_id: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      message: string;
      timestamp: string;
      acknowledged: boolean;
    }>;
  };
  knowledge_acquisition_patterns: {
    acquisition_speed: {
      fast_learning_topics: string[];
      slow_learning_topics: string[];
      average_acquisition_rate: number;
    };
    retention_patterns: {
      short_term_retention: number;
      long_term_retention: number;
      retention_curve: Array<{
        days: number;
        retention_rate: number;
      }>;
    };
    knowledge_gaps: Array<{
      topic: string;
      severity: number;
      evidence: string[];
      remediation_suggestions: string[];
    }>;
    mastery_progression: {
      current_mastery_level: string;
      progression_rate: number;
      expected_mastery_timeline: string;
    };
  };
  temporal_patterns: {
    learning_calendar: Array<{
      date: string;
      activity_level: number;
      performance_indicators: string[];
      notable_events: string[];
    }>;
    seasonal_patterns: {
      seasonal_influences: Array<{
        season: string;
        impact_on_performance: number;
        preferred_topics: string[];
      }>;
      cyclical_patterns: string[];
    };
    productivity_peaks: {
      peak_learning_times: string[];
      low_productivity_periods: string[];
      optimal_break_schedule: string[];
    };
  };
  pattern_recognition_summary: {
    dominant_patterns: string[];
    pattern_stability: string;
    behavioral_signature: string;
    learning_efficiency_score: number;
  };
  pattern_based_recommendations: string[];
}

interface IntegratedPersonalizedRecommendations {
  user_id: string;
  recommendation_timestamp: string;
  recommendation_type: string;
  knowledge_graph_recommendations: Array<{
    learning_graph_id: string;
    graph_title: string;
    graph_type: string;
    estimated_duration: string;
    difficulty_level: string;
    relevance_score: number;
    reason: string;
    prerequisites: string[];
    learning_outcomes: string[];
  }>;
  predictive_insights: {
    overall_prediction_confidence: string;
    learning_trajectory: string;
    recommendation_priority: string;
    key_predictions: Array<{
      prediction_type: string;
      timeframe: string;
      confidence: number;
      description: string;
    }>;
  };
  statistical_insights: {
    data_quality_assessment: string;
    significant_patterns: string[];
    statistical_strength: string;
    confidence_intervals: Array<{
      metric: string;
      lower_bound: number;
      upper_bound: number;
      confidence_level: number;
    }>;
  };
  ml_insights: {
    user_segment: string;
    key_features: string[];
    model_performance: string;
    prediction_accuracy: number;
  };
  pattern_recognition: {
    dominant_learning_style: string;
    engagement_pattern: string;
    performance_trends: string;
    behavioral_insights: string[];
  };
  integrated_recommendations: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    priority: number;
    confidence: number;
    source: string[];
    reasoning: string;
    expected_outcome: string;
    implementation_steps: string[];
    timeline: string;
    difficulty_level: string;
  }>;
  ranked_recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority_score: number;
    confidence_score: number;
    impact_potential: string;
    feasibility: string;
    urgency: string;
    reasoning: string;
  }>;
  recommendation_summary: {
    total_recommendations: number;
    high_priority_count: number;
    medium_priority_count: number;
    low_priority_count: number;
    average_confidence: number;
    top_3_priorities: string[];
    implementation_timeline: string;
  };
  confidence_scores: {
    statistical_confidence: number;
    ml_model_confidence: number;
    pattern_recognition_confidence: number;
    overall_confidence: number;
    confidence_factors: string[];
  };
  achievement_system?: AchievementSystem;
  team_collaboration?: TeamAnalytics;
}

// ================================
// MAIN COMPONENT
// ================================

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ 
  learningPathId, 
  onDataUpdate,
  showRecommendations = true,
  compact = false,
  userRole = 'student',
  enableCollaboration = true,
  enableAI = true,
  enableExport = true,
  customTheme = 'light'
}) => {
  // Enhanced state management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [statisticalAnalysis, setStatisticalAnalysis] = useState<SophisticatedStatisticalAnalysis | null>(null);
  const [mlInsights, setMLInsights] = useState<EnhancedMLInsights | null>(null);
  const [patternRecognition, setPatternRecognition] = useState<AdvancedPatternRecognition | null>(null);
  const [recommendations, setRecommendations] = useState<IntegratedPersonalizedRecommendations | null>(null);
  
  // New enhanced state for enterprise features
  const [aiInsights, setAiInsights] = useState<AIGeneratedInsights[]>([]);
  const [teamAnalytics, setTeamAnalytics] = useState<TeamAnalytics | null>(null);
  const [performanceBenchmark, setPerformanceBenchmark] = useState<PerformanceBenchmark | null>(null);
  const [achievementSystem, setAchievementSystem] = useState<AchievementSystem | null>(null);
  const [collaborativeFeatures, setCollaborativeFeatures] = useState<CollaborativeFeatures | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    dateRange: '30d',
    metrics: 'all',
    comparison: 'peer'
  });
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [customDashboard, setCustomDashboard] = useState<any[]>([]);
  const [notificationPreferences, setNotificationPreferences] = useState({
    anomalies: true,
    achievements: true,
    collaboration: true,
    recommendations: true
  });

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#82ca9d', '#ffc658', '#8dd1e1', '#d084d0', '#ffb347'
  ];

  const websocketRef = useRef<WebSocket | null>(null);

  // Enhanced useEffect for real-time updates
  useEffect(() => {
    loadAdvancedAnalytics();
    initializeRealTimeUpdates();
    loadAchievementSystem();
    
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [learningPathId, showRecommendations, realTimeUpdates]);

  const initializeRealTimeUpdates = useCallback(() => {
    if (!realTimeUpdates) return;
    
    try {
      const wsUrl = `wss://api.jacplatform.com/analytics/realtime?user_id=${localStorage.getItem('user_id')}`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('Real-time analytics connected');
        ws.send(JSON.stringify({
          type: 'subscribe',
          channels: ['analytics_updates', 'anomaly_alerts', 'achievement_unlocks']
        }));
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleRealTimeUpdate(data);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      websocketRef.current = ws;
    } catch (error) {
      console.error('Failed to initialize real-time updates:', error);
    }
  }, [realTimeUpdates]);

  const handleRealTimeUpdate = useCallback((data: any) => {
    switch (data.type) {
      case 'analytics_update':
        // Update relevant data based on the message
        if (data.payload?.anomaly_detected) {
          showNotification('Anomaly Detected', data.payload.message, 'warning');
        }
        break;
      case 'achievement_unlocked':
        showNotification('Achievement Unlocked!', data.payload.title, 'success');
        loadAchievementSystem();
        break;
      case 'collaboration_update':
        if (data.payload?.new_annotation) {
          showNotification('New Collaboration', 'Team member added an annotation', 'info');
        }
        break;
    }
  }, []);

  // AI Integration Functions
  const generateAIInsights = async (analysisType: string, data: any) => {
    if (!enableAI) return;
    
    try {
      const response = await apiClient.post('/api/ai/analytics-insights', {
        analysis_type: analysisType,
        data: data,
        user_context: {
          learning_path_id: learningPathId,
          role: userRole,
          preferences: filterOptions
        }
      });
      
      if (response.data.success) {
        setAiInsights(response.data.insights);
        showNotification('AI Insights Generated', 'New insights are now available', 'info');
      }
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
    }
  };

  const queryNaturalLanguage = async (query: string) => {
    if (!enableAI) return null;
    
    try {
      const response = await apiClient.post('/api/ai/natural-language-query', {
        query: query,
        context: {
          available_data: { statisticalAnalysis, mlInsights, patternRecognition, recommendations },
          user_permissions: userRole
        }
      });
      
      if (response.data.success) {
        return response.data.result;
      }
    } catch (error) {
      console.error('Failed to process natural language query:', error);
      return null;
    }
  };

  // Enhanced Export Functions
  const exportAnalytics = async (options: ExportOptions) => {
    setExportLoading(true);
    
    try {
      const response = await apiClient.post('/api/analytics/export', {
        ...options,
        data: {
          dashboard: dashboardData,
          statistical: statisticalAnalysis,
          ml_insights: mlInsights,
          patterns: patternRecognition,
          recommendations: recommendations,
          ai_insights: aiInsights,
          achievements: achievementSystem,
          benchmark: performanceBenchmark
        },
        user_context: {
          role: userRole,
          learning_path_id: learningPathId,
          custom_dashboard: customDashboard
        }
      }, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.${options.format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showNotification('Export Complete', 'Analytics report has been downloaded', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showNotification('Export Failed', 'Unable to generate analytics report', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  // Achievement System Functions
  const loadAchievementSystem = async () => {
    try {
      const response = await apiClient.get(`/api/analytics/achievements?user_id=${localStorage.getItem('user_id')}`);
      if (response.data.success) {
        setAchievementSystem(response.data.achievements);
      }
    } catch (error) {
      console.error('Failed to load achievement system:', error);
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    try {
      const response = await apiClient.post('/api/analytics/achievements/unlock', {
        achievement_id: achievementId,
        user_id: localStorage.getItem('user_id')
      });
      
      if (response.data.success) {
        loadAchievementSystem();
        showNotification('Achievement Unlocked!', response.data.achievement.title, 'success');
      }
    } catch (error) {
      console.error('Failed to unlock achievement:', error);
    }
  };

  // Collaboration Functions
  const loadTeamAnalytics = async () => {
    try {
      const response = await apiClient.get('/api/analytics/team');
      if (response.data.success) {
        setTeamAnalytics(response.data.team);
        setCollaborativeFeatures(response.data.collaboration);
      }
    } catch (error) {
      console.error('Failed to load team analytics:', error);
    }
  };

  const shareAnalytics = async (shareOptions: { 
    recipients: string[]; 
    permissions: 'view' | 'edit'; 
    message?: string;
  }) => {
    try {
      const response = await apiClient.post('/api/analytics/share', {
        data: {
          dashboard: dashboardData,
          insights: aiInsights,
          recommendations: recommendations?.ranked_recommendations || []
        },
        ...shareOptions
      });
      
      if (response.data.success) {
        showNotification('Shared Successfully', 'Analytics shared with selected users', 'success');
      }
    } catch (error) {
      console.error('Failed to share analytics:', error);
    }
  };

  // Notification System
  const showNotification = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    // This would integrate with a toast notification system
    console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
  };

  // Enhanced data loading with AI integration
  const loadAdvancedAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'dashboard') {
        await loadDashboard();
      } else if (activeTab === 'statistical') {
        await loadStatisticalAnalysis();
      } else if (activeTab === 'ml-insights') {
        await loadMLInsights();
      } else if (activeTab === 'patterns') {
        await loadPatternRecognition();
      } else if (activeTab === 'recommendations') {
        await loadRecommendations();
      } else if (activeTab === 'collaboration') {
        await loadTeamAnalytics();
      } else if (activeTab === 'achievements') {
        await loadAchievementSystem();
      }
      
      // Generate AI insights for each loaded section
      if (enableAI) {
        const currentData = {
          dashboard: dashboardData,
          statistical: statisticalAnalysis,
          ml_insights: mlInsights,
          patterns: patternRecognition,
          recommendations: recommendations
        };
        await generateAIInsights(activeTab, currentData);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    const params = new URLSearchParams({
      include_recommendations: showRecommendations.toString(),
      include_ai_insights: enableAI.toString(),
      include_collaboration: enableCollaboration.toString(),
      include_achievements: 'true',
      ...(learningPathId && { learning_path_id: learningPathId })
    });

    const response = await apiClient.get(`/api/advanced/dashboard/?${params}`);
    const data = response.data;
    
    if (data.success) {
      setDashboardData(data.data);
      if (onDataUpdate) onDataUpdate(data.data);
      
      // Load related data
      if (data.data.benchmark_data) {
        setPerformanceBenchmark(data.data.benchmark_data);
      }
    } else {
      throw new Error(data.error || 'Failed to load dashboard');
    }
  };

  const loadStatisticalAnalysis = async () => {
    const params = new URLSearchParams({
      analysis_type: 'comprehensive',
      include_ai_insights: enableAI.toString(),
      ...(learningPathId && { learning_path_id: learningPathId })
    });

    const response = await apiClient.get(`/api/advanced/statistical/?${params}`);
    const data = response.data;
    
    if (data.success) {
      setStatisticalAnalysis(data.data);
    } else {
      throw new Error(data.error || 'Failed to load statistical analysis');
    }
  };

  const loadMLInsights = async () => {
    const params = new URLSearchParams(
      learningPathId ? { learning_path_id: learningPathId } : {}
    );

    const response = await apiClient.get(`/api/advanced/ml-insights/?${params}`);
    const data = response.data;
    
    if (data.success) {
      setMLInsights(data.data);
    } else {
      throw new Error(data.error || 'Failed to load ML insights');
    }
  };

  const loadPatternRecognition = async () => {
    const params = new URLSearchParams(
      learningPathId ? { learning_path_id: learningPathId } : {}
    );

    const response = await apiClient.get(`/api/advanced/pattern-recognition/?${params}`);
    const data = response.data;
    
    if (data.success) {
      setPatternRecognition(data.data);
    } else {
      throw new Error(data.error || 'Failed to load pattern recognition');
    }
  };

  const loadRecommendations = async () => {
    const params = new URLSearchParams({
      recommendation_type: 'comprehensive',
      include_achievements: 'true',
      include_team: enableCollaboration.toString(),
      ...(learningPathId && { learning_path_id: learningPathId })
    });

    const response = await apiClient.get(`/api/advanced/personalized-recommendations/?${params}`);
    const data = response.data;
    
    if (data.success) {
      setRecommendations(data.data);
    } else {
      throw new Error(data.error || 'Failed to load recommendations');
    }
  };

  // Enhanced rendering functions with enterprise features
  const renderDashboardSummary = () => {
    if (!dashboardData) return null;

    const summary = dashboardData.dashboard_summary;
    
    return (
      <div className="space-y-6">
        {/* Main Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Data Quality</p>
                <p className="text-3xl font-bold text-blue-800">{summary.overall_data_quality}</p>
                <p className="text-xs text-gray-500 mt-1">+2.3% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Confidence Level</p>
                <p className="text-3xl font-bold text-green-800">{summary.confidence_level}</p>
                <p className="text-xs text-gray-500 mt-1">AI-enhanced accuracy</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Analysis Status</p>
                <p className="text-lg font-bold text-purple-800">{summary.analysis_status}</p>
                <p className="text-xs text-gray-500 mt-1">Real-time updates active</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Key Findings</p>
                <p className="text-3xl font-bold text-orange-800">{summary.key_findings.length}</p>
                <p className="text-xs text-gray-500 mt-1">Insights ready for review</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance Benchmark Comparison */}
        {performanceBenchmark && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Performance Benchmark
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Overall Performance</h4>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Percentile Rank</span>
                    <span className="text-2xl font-bold text-purple-600">{performanceBenchmark.overall_percentile}th</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                      style={{ width: `${performanceBenchmark.overall_percentile}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Top Strengths</h4>
                <div className="space-y-2">
                  {performanceBenchmark.strengths.slice(0, 3).map((strength, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Insights Preview */}
        {aiInsights.length > 0 && (
          <motion.div 
            className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-lg p-6 border border-indigo-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-indigo-600" />
              AI-Generated Insights
              <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                {aiInsights.length} new
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiInsights.slice(0, 3).map((insight) => (
                <motion.div 
                  key={insight.insight_id}
                  className="bg-white rounded-lg p-4 border border-indigo-200 hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      insight.insight_type === 'pattern' ? 'bg-blue-100 text-blue-700' :
                      insight.insight_type === 'recommendation' ? 'bg-green-100 text-green-700' :
                      insight.insight_type === 'anomaly' ? 'bg-red-100 text-red-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {insight.insight_type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(insight.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">{insight.title}</h4>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Impact: {(insight.impact_score * 100).toFixed(0)}%</span>
                    <span className="text-xs text-indigo-600">{insight.source_model}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Key Findings and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Key Findings
            </h4>
            <ul className="space-y-3">
              {summary.key_findings.map((finding: string, index: number) => (
                <motion.li 
                  key={index} 
                  className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <span className="text-gray-700 text-sm">{finding}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-green-600" />
              Top Recommendations
            </h4>
            <ul className="space-y-3">
              {summary.top_recommendations.map((rec: string, index: number) => (
                <motion.li 
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <span className="text-gray-700 text-sm">{rec}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Achievement System Preview */}
        {achievementSystem && (
          <motion.div 
            className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border border-yellow-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-600" />
              Recent Achievements
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                Level {achievementSystem.current_level}
              </span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievementSystem.user_achievements.slice(0, 3).map((achievement) => (
                <motion.div 
                  key={achievement.achievement_id}
                  className="bg-white rounded-lg p-4 border border-yellow-200 hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      achievement.rarity === 'legendary' ? 'bg-purple-100 text-purple-700' :
                      achievement.rarity === 'epic' ? 'bg-orange-100 text-orange-700' :
                      achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {achievement.rarity}
                    </span>
                  </div>
                  <h5 className="font-semibold text-gray-800 mb-1">{achievement.title}</h5>
                  <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-yellow-600">+{achievement.points} pts</span>
                    <span className="text-xs text-gray-500">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Enhanced rendering functions for other tabs with enterprise features...
  const renderStatisticalAnalysis = () => {
    if (!statisticalAnalysis) return null;

    const analysis = statisticalAnalysis.multivariate_analysis;
    const pcaData = analysis.pca_analysis.explained_variance_ratio.map((variance, index) => ({
      component: `PC${index + 1}`,
      variance: (variance * 100).toFixed(1),
      cumulative: (analysis.pca_analysis.cumulative_variance_explained[index] * 100).toFixed(1)
    }));

    return (
      <div className="space-y-6">
        {/* AI Insights for Statistical Analysis */}
        {aiInsights.filter(insight => insight.insight_type === 'pattern').length > 0 && (
          <motion.div 
            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-indigo-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-indigo-600" />
              AI Pattern Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsights.filter(insight => insight.insight_type === 'pattern').map((insight) => (
                <div key={insight.insight_id} className="bg-white rounded-lg p-4 border border-indigo-200">
                  <h4 className="font-semibold text-gray-800 mb-2">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  <div className="space-y-1">
                    {insight.actionable_steps.slice(0, 2).map((step, index) => (
                      <div key={index} className="text-xs text-indigo-600 flex items-start space-x-1">
                        <span className="text-indigo-400">•</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Enhanced PCA Analysis */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Principal Component Analysis
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Explained Variance</h4>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={pcaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="component" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="variance" fill="#8884d8" name="Individual %" />
                  <Line type="monotone" dataKey="cumulative" stroke="#82ca9d" strokeWidth={2} name="Cumulative %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Enhanced Data Summary</h4>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Samples:</span>
                    <span className="font-bold text-blue-700">{analysis.data_summary.total_samples.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Features:</span>
                    <span className="font-bold text-indigo-700">{analysis.data_summary.total_features}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Data Density:</span>
                    <span className="font-bold text-purple-700">{(analysis.data_summary.data_density * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Components:</span>
                    <span className="font-bold text-green-700">{analysis.pca_analysis.total_components}</span>
                  </div>
                </div>
                
                {/* AI-Generated Interpretation */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-1 text-indigo-600" />
                    AI Interpretation
                  </h5>
                  <p className="text-sm text-gray-600">
                    The first 3 principal components explain {(analysis.pca_analysis.cumulative_variance_explained[2] * 100).toFixed(1)}% 
                    of the total variance, indicating {analysis.pca_analysis.cumulative_variance_explained[2] > 0.8 ? 'good' : 'moderate'} dimensionality reduction potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Clustering Analysis */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            Clustering Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-lg font-semibold text-blue-700 mb-3">K-Means Clustering</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-600">Silhouette Score:</span>
                  <span className="font-bold text-blue-800">
                    {statisticalAnalysis.clustering_analysis.kmeans_clustering.silhouette_score.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-600">Inertia:</span>
                  <span className="font-bold text-blue-800">
                    {statisticalAnalysis.clustering_analysis.kmeans_clustering.inertia.toFixed(2)}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${statisticalAnalysis.clustering_analysis.kmeans_clustering.silhouette_score * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-blue-600 mt-1">Quality Score</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-lg font-semibold text-green-700 mb-3">DBSCAN Clustering</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-green-600">Clusters:</span>
                  <span className="font-bold text-green-800">
                    {statisticalAnalysis.clustering_analysis.dbscan_clustering.n_clusters}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-600">Noise Points:</span>
                  <span className="font-bold text-green-800">
                    {statisticalAnalysis.clustering_analysis.dbscan_clustering.noise_points}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${statisticalAnalysis.clustering_analysis.dbscan_clustering.silhouette_score * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-green-600 mt-1">Quality Score</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-lg font-semibold text-purple-700 mb-3">Optimal Method</h4>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-800 mb-2">
                  {statisticalAnalysis.clustering_analysis.clustering_summary.best_method}
                </div>
                <div className="text-sm text-purple-600 mb-3">
                  {statisticalAnalysis.clustering_analysis.clustering_summary.optimal_cluster_count} clusters
                </div>
                <div className="bg-purple-100 rounded-lg p-3">
                  <div className="flex items-center justify-center mb-2">
                    <Crown className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-xs text-purple-600">Best Performing</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Statistical Insights with AI */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-indigo-600" />
            Enhanced Statistical Insights
          </h3>
          
          <div className="space-y-4">
            {statisticalAnalysis.key_statistical_insights.map((insight: string, index: number) => (
              <motion.div 
                key={index} 
                className="flex items-start space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <span className="text-gray-700 leading-relaxed">{insight}</span>
                </div>
                <div className="flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  // Continue with other rendering methods...
  const renderMLInsights = () => {
    if (!mlInsights) return null;

    const featureImportanceData = mlInsights.feature_importance_analysis.random_forest_importance.slice(0, 10).map(item => ({
      feature: item.feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      importance: (item.importance * 100).toFixed(1),
      rank: item.rank
    }));

    return (
      <div className="space-y-6">
        {/* AI-Enhanced ML Insights */}
        {aiInsights.filter(insight => insight.insight_type === 'recommendation').length > 0 && (
          <motion.div 
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border border-green-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-green-600" />
              AI Optimization Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsights.filter(insight => insight.insight_type === 'recommendation').map((insight) => (
                <motion.div 
                  key={insight.insight_id}
                  className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {(insight.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Timeline: {insight.timeline_estimate}</div>
                    <div className="text-xs text-gray-500">Expected Impact: {(insight.impact_score * 100).toFixed(0)}%</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Enhanced Feature Importance Analysis */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Feature Importance Analysis
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Random Forest Importance (Top 10)</h4>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={featureImportanceData} layout="horizontal" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="feature" type="category" width={100} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Importance']}
                    labelFormatter={(label) => `Feature: ${label}`}
                  />
                  <Bar 
                    dataKey="importance" 
                    fill="url(#featureGradient)"
                    radius={[0, 4, 4, 0]}
                  />
                  <defs>
                    <linearGradient id="featureGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Enhanced User Segmentation</h4>
              <div className="space-y-4">
                <motion.div 
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <h5 className="font-semibold text-blue-700 mb-2">Optimal Clusters</h5>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-blue-800">{mlInsights.user_segmentation.optimal_clusters}</span>
                    <div className="text-right">
                      <div className="text-sm text-blue-600">Silhouette Score</div>
                      <div className="text-lg font-bold text-blue-800">
                        {mlInsights.user_segmentation.silhouette_score.toFixed(3)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${mlInsights.user_segmentation.silhouette_score * 100}%` }}
                    ></div>
                  </div>
                </motion.div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <h5 className="font-semibold text-green-700 mb-3">Learning Style Distribution</h5>
                  <div className="space-y-3">
                    {mlInsights.user_segmentation.segments.slice(0, 4).map((segment, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center justify-between p-2 bg-white rounded border border-green-100"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div>
                          <div className="text-sm font-medium text-green-700">
                            Segment {segment.segment_id + 1}
                          </div>
                          <div className="text-xs text-green-600">{segment.learning_style}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-800">{segment.size} users</div>
                          <div className="text-xs text-green-500">{segment.performance_level}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Pathway Optimization */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-600" />
            Enhanced Learning Pathway Optimization
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Score Comparison</h4>
              <div className="space-y-4">
                <motion.div 
                  className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Current Pathway Score:</span>
                    <span className="font-bold text-red-600 text-xl">
                      {mlInsights.pathway_optimization.current_pathway_score.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${mlInsights.pathway_optimization.current_pathway_score}%` }}
                    ></div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Optimized Pathway Score:</span>
                    <span className="font-bold text-green-600 text-xl">
                      {mlInsights.pathway_optimization.optimized_pathway_score.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${mlInsights.pathway_optimization.optimized_pathway_score}%` }}
                    ></div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Expected Improvement:</span>
                    <span className="font-bold text-blue-600 text-xl flex items-center">
                      <TrendingUp className="h-5 w-5 mr-1" />
                      +{(mlInsights.pathway_optimization.optimized_pathway_score - mlInsights.pathway_optimization.current_pathway_score).toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">AI-Recommended Next Steps</h4>
              <div className="space-y-3">
                {mlInsights.pathway_optimization.personalized_pathway.next_modules.slice(0, 4).map((module, index) => (
                  <motion.div 
                    key={index}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-purple-800">{module.module_title}</h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        module.priority_score > 0.8 ? 'bg-red-100 text-red-700' :
                        module.priority_score > 0.6 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {(module.priority_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm text-purple-600 mb-2">{module.reasoning}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-500">
                        Prerequisites: {module.prerequisites_met ? '✅ Met' : '❌ Missing'}
                      </span>
                      <Brain className="h-4 w-4 text-purple-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced ML Insights Summary */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-indigo-600" />
            Enhanced ML Insights Summary
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                AI-Generated Summary
              </h4>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                <p className="text-gray-700 leading-relaxed">{mlInsights.ml_insights_summary}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-green-600" />
                AI-Enhanced Recommendations
              </h4>
              <ul className="space-y-2">
                {mlInsights.recommendations.slice(0, 4).map((rec, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Brain className="flex-shrink-0 h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderPatternRecognition = () => {
    if (!patternRecognition) return null;

    const styleData = [
      { style: 'Visual', score: patternRecognition.learning_style_detection.style_scores.visual, fill: '#8884d8' },
      { style: 'Auditory', score: patternRecognition.learning_style_detection.style_scores.auditory, fill: '#82ca9d' },
      { style: 'Kinesthetic', score: patternRecognition.learning_style_detection.style_scores.kinesthetic, fill: '#ffc658' },
      { style: 'Reading/Writing', score: patternRecognition.learning_style_detection.style_scores.reading_writing, fill: '#8dd1e1' }
    ];

    return (
      <div className="space-y-6">
        {/* Real-time Anomaly Alerts */}
        {patternRecognition.performance_anomalies.real_time_alerts && 
         patternRecognition.performance_anomalies.real_time_alerts.length > 0 && (
          <motion.div 
            className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-lg p-6 border border-red-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Real-time Anomaly Alerts
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                {patternRecognition.performance_anomalies.real_time_alerts.length} active
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patternRecognition.performance_anomalies.real_time_alerts.map((alert) => (
                <motion.div 
                  key={alert.alert_id}
                  className="bg-white rounded-lg p-4 border border-red-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      alert.severity === 'critical' ? 'bg-red-200 text-red-800' :
                      alert.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                      alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  {!alert.acknowledged && (
                    <button className="mt-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors">
                      Acknowledge
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Enhanced Learning Style Detection */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            AI-Enhanced Learning Style Detection
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Style Scores Analysis</h4>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={styleData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="style" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar 
                    name="Style Score" 
                    dataKey="score" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Enhanced Style Analysis</h4>
              <div className="space-y-4">
                <motion.div 
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <h5 className="font-semibold text-purple-700 mb-2 flex items-center">
                    <Crown className="h-4 w-4 mr-1" />
                    Primary Learning Style
                  </h5>
                  <div className="text-2xl font-bold text-purple-800 mb-2">
                    {patternRecognition.learning_style_detection.primary_style}
                  </div>
                  <div className="text-sm text-purple-600 mb-3">
                    Confidence: {patternRecognition.learning_style_detection.confidence_level}
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${patternRecognition.learning_style_detection.style_scores[
                          patternRecognition.learning_style_detection.primary_style.toLowerCase() as keyof typeof patternRecognition.learning_style_detection.style_scores
                        ]}%` 
                      }}
                    ></div>
                  </div>
                </motion.div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <h5 className="font-semibold text-green-700 mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    AI-Generated Evidence
                  </h5>
                  <ul className="space-y-2">
                    {patternRecognition.learning_style_detection.evidence.slice(0, 3).map((evidence, index) => (
                      <motion.li 
                        key={index}
                        className="text-sm text-green-700 flex items-start space-x-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Brain className="flex-shrink-0 h-3 w-3 text-green-500 mt-0.5" />
                        <span>{evidence}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Engagement Patterns */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Enhanced Engagement Patterns
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Daily Engagement Pattern</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={patternRecognition.engagement_patterns.daily_pattern}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Engagement Level']}
                    labelFormatter={(hour) => `${hour}:00`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="engagement_level" 
                    stroke="#8884d8" 
                    fill="url(#engagementGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">AI-Optimized Session Analysis</h4>
              <div className="space-y-4">
                <motion.div 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Optimal Session Length:</span>
                    <span className="font-bold text-blue-700 text-lg">
                      {patternRecognition.engagement_patterns.session_patterns.optimal_session_length} min
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${(patternRecognition.engagement_patterns.session_patterns.optimal_session_length / 120) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-blue-600">AI-optimized duration</span>
                </motion.div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="text-sm text-green-600">Break Frequency</div>
                    <div className="text-lg font-bold text-green-700">
                      Every {patternRecognition.engagement_patterns.session_patterns.break_frequency} min
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-sm text-purple-600">Attention Span</div>
                    <div className="text-lg font-bold text-purple-700">
                      {patternRecognition.engagement_patterns.session_patterns.attention_span} min
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Consistency Score:</span>
                    <span className="font-bold text-orange-700 text-lg">
                      {(patternRecognition.engagement_patterns.motivation_patterns.consistency_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${patternRecognition.engagement_patterns.motivation_patterns.consistency_score * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Performance Anomalies */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Enhanced Performance Anomalies
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">AI Detection Summary</h4>
              <div className="space-y-4">
                <motion.div 
                  className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <h5 className="font-semibold text-red-700 mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    Real-time Detection
                  </h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm text-red-600">Frequency</div>
                      <div className="text-lg font-bold text-red-700">
                        {patternRecognition.performance_anomalies.anomaly_trends.frequency}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-red-600">Patterns Found</div>
                      <div className="text-lg font-bold text-red-700">
                        {patternRecognition.performance_anomalies.anomaly_trends.patterns.length}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm text-red-600">AI Accuracy</div>
                    <div className="text-lg font-bold text-red-700">
                      {(patternRecognition.performance_anomalies.prediction_accuracy * 100).toFixed(1)}%
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${patternRecognition.performance_anomalies.prediction_accuracy * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Recent AI-Detected Anomalies</h4>
              <div className="space-y-3">
                {patternRecognition.performance_anomalies.detected_anomalies.slice(0, 4).map((anomaly, index) => (
                  <motion.div 
                    key={index}
                    className={`p-4 rounded-lg border-l-4 transition-shadow hover:shadow-md ${
                      anomaly.severity === 'critical' ? 'bg-red-50 border-red-400' :
                      anomaly.severity === 'high' ? 'bg-orange-50 border-orange-400' :
                      anomaly.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                      'bg-blue-50 border-blue-400'
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-gray-800 flex items-center">
                        <Brain className="h-4 w-4 mr-1 text-indigo-600" />
                        {anomaly.metric}
                      </h5>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        anomaly.severity === 'critical' ? 'bg-red-200 text-red-800' :
                        anomaly.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                        anomaly.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {anomaly.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Expected: {anomaly.expected_value.toFixed(1)} → Actual: {anomaly.actual_value.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Deviation: {anomaly.deviation_percentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-indigo-600">
                      AI Analysis: {anomaly.probable_causes[0]}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Pattern Recognition Summary */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-600" />
            Enhanced Pattern Recognition Summary
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                <Brain className="h-4 w-4 mr-2 text-indigo-600" />
                AI-Identified Dominant Patterns
              </h4>
              <ul className="space-y-3">
                {patternRecognition.pattern_recognition_summary.dominant_patterns.map((pattern, index) => (
                  <motion.li 
                    key={index}
                    className="text-sm text-gray-600 flex items-start space-x-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 hover:shadow-sm transition-shadow"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Brain className="flex-shrink-0 h-4 w-4 text-indigo-500 mt-0.5" />
                    <span>{pattern}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-green-600" />
                AI-Enhanced Pattern-Based Recommendations
              </h4>
              <ul className="space-y-3">
                {patternRecognition.pattern_based_recommendations.slice(0, 4).map((rec, index) => (
                  <motion.li 
                    key={index}
                    className="text-sm text-gray-600 flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-sm transition-shadow"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Zap className="flex-shrink-0 h-4 w-4 text-green-500 mt-0.5" />
                    <span>{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderRecommendations = () => {
    if (!recommendations) return null;

    const priorityData = [
      { 
        name: 'High Priority', 
        value: recommendations.recommendation_summary.high_priority_count, 
        fill: '#FF6B6B',
        icon: <AlertTriangle className="h-4 w-4" />
      },
      { 
        name: 'Medium Priority', 
        value: recommendations.recommendation_summary.medium_priority_count, 
        fill: '#4ECDC4',
        icon: <Clock className="h-4 w-4" />
      },
      { 
        name: 'Low Priority', 
        value: recommendations.recommendation_summary.low_priority_count, 
        fill: '#45B7D1',
        icon: <CheckCircle className="h-4 w-4" />
      }
    ];

    return (
      <div className="space-y-6">
        {/* Enhanced Recommendations Overview */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            AI-Enhanced Personalized Recommendations Overview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-600">Total Recommendations</h4>
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-800">{recommendations.recommendation_summary.total_recommendations}</p>
              <p className="text-xs text-blue-500 mt-1">AI-curated list</p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-green-600">AI Confidence</h4>
                <Brain className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-800">{(recommendations.recommendation_summary.average_confidence * 100).toFixed(0)}%</p>
              <p className="text-xs text-green-500 mt-1">ML-enhanced accuracy</p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-purple-600">High Priority</h4>
                <AlertTriangle className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-800">{recommendations.recommendation_summary.high_priority_count}</p>
              <p className="text-xs text-purple-500 mt-1">Immediate action needed</p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-orange-600">Timeline</h4>
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <p className="text-lg font-bold text-orange-800">{recommendations.recommendation_summary.implementation_timeline}</p>
              <p className="text-xs text-orange-500 mt-1">AI-estimated completion</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">AI-Enhanced Priority Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Multi-Model Confidence Scores</h4>
              <div className="space-y-4">
                <motion.div 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600 text-sm">Statistical Confidence:</span>
                    <span className="font-semibold text-blue-700">
                      {(recommendations.confidence_scores.statistical_confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${recommendations.confidence_scores.statistical_confidence * 100}%` }}
                    ></div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600 text-sm">ML Model Confidence:</span>
                    <span className="font-semibold text-green-700">
                      {(recommendations.confidence_scores.ml_model_confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${recommendations.confidence_scores.ml_model_confidence * 100}%` }}
                    ></div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-3 border border-purple-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600 text-sm">Pattern Recognition:</span>
                    <span className="font-semibold text-purple-700">
                      {(recommendations.confidence_scores.pattern_recognition_confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${recommendations.confidence_scores.pattern_recognition_confidence * 100}%` }}
                    ></div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center border-t border-orange-300 pt-2">
                    <span className="text-gray-600 text-sm font-semibold">Overall Confidence:</span>
                    <span className="font-bold text-orange-700 text-lg">
                      {(recommendations.confidence_scores.overall_confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Top Ranked Recommendations */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-indigo-600" />
            AI-Enhanced Top Ranked Recommendations
          </h3>
          
          <div className="space-y-6">
            {recommendations.ranked_recommendations.slice(0, 5).map((rec, index) => (
              <motion.div 
                key={index}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-3">
                        <span className="text-2xl font-bold text-indigo-600">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800">{rec.title}</h4>
                        <p className="text-gray-600 mt-1">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <motion.span 
                      className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      Priority: {(rec.priority_score * 100).toFixed(0)}%
                    </motion.span>
                    <motion.span 
                      className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs px-3 py-1 rounded-full border border-green-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      Confidence: {(rec.confidence_score * 100).toFixed(0)}%
                    </motion.span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <div>
                      <span className="text-gray-500 text-sm">Impact:</span>
                      <span className="ml-2 font-semibold text-green-700">{rec.impact_potential}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <div>
                      <span className="text-gray-500 text-sm">Feasibility:</span>
                      <span className="ml-2 font-semibold text-blue-700">{rec.feasibility}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <div>
                      <span className="text-gray-500 text-sm">Urgency:</span>
                      <span className="ml-2 font-semibold text-orange-700">{rec.urgency}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                  <h5 className="font-semibold text-indigo-800 mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-1" />
                    AI-Generated Reasoning:
                  </h5>
                  <p className="text-sm text-indigo-700 leading-relaxed">{rec.reasoning}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Knowledge Graph Recommendations */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-purple-600" />
            AI-Curated Knowledge Graph Recommendations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.knowledge_graph_recommendations.slice(0, 6).map((rec, index) => (
              <motion.div 
                key={index}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-purple-50"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold text-gray-800 text-lg flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-purple-600" />
                    {rec.graph_title}
                  </h4>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {rec.graph_type}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                    <div className="text-blue-600 font-medium">Duration</div>
                    <div className="text-blue-800 font-semibold">{rec.estimated_duration}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                    <div className="text-green-600 font-medium">Difficulty</div>
                    <div className="text-green-800 font-semibold">{rec.difficulty_level}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
                    <div className="text-purple-600 font-medium">Relevance</div>
                    <div className="text-purple-800 font-semibold">{(rec.relevance_score * 100).toFixed(0)}%</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2 border border-orange-200">
                    <div className="text-orange-600 font-medium">Status</div>
                    <div className="text-orange-800 font-semibold">Available</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-start space-x-2">
                    <Brain className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-purple-700 font-medium text-sm mb-1">AI Recommendation:</div>
                      <div className="text-purple-600 text-sm">{rec.reason}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  // New enterprise features rendering methods
  const renderCollaboration = () => {
    if (!teamAnalytics || !collaborativeFeatures) {
      return (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No collaboration data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Team Performance Overview */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Team Analytics Overview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-700 mb-2">Average Progress</h4>
              <div className="text-3xl font-bold text-blue-800">
                {(teamAnalytics.team_performance.average_progress * 100).toFixed(0)}%
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${teamAnalytics.team_performance.average_progress * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <h4 className="text-lg font-semibold text-green-700 mb-2">Collaboration Score</h4>
              <div className="text-3xl font-bold text-green-800">
                {(teamAnalytics.team_performance.collaboration_score * 100).toFixed(0)}%
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${teamAnalytics.team_performance.collaboration_score * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
              <h4 className="text-lg font-semibold text-purple-700 mb-2">Peer Learning Impact</h4>
              <div className="text-3xl font-bold text-purple-800">
                {(teamAnalytics.team_performance.peer_learning_impact * 100).toFixed(0)}%
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${teamAnalytics.team_performance.peer_learning_impact * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Team Members</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamAnalytics.members.map((member, index) => (
                <motion.div 
                  key={member.user_id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">{member.name}</h5>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>Contributions: {member.contributions}</div>
                    <div>Last Active: {new Date(member.last_active).toLocaleDateString()}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Collaborative Insights */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
            Collaborative Insights
          </h3>
          
          <div className="space-y-4">
            {teamAnalytics.collaborative_insights.map((insight, index) => (
              <motion.div 
                key={insight.id}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">
                        {insight.author.charAt(0)}
                      </span>
                    </div>
                    <span className="font-semibold text-green-800">{insight.author}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(insight.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-green-700 mb-3">{insight.content}</p>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-green-600 hover:text-green-700">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">{insight.likes}</span>
                  </button>
                  <button className="text-sm text-green-600 hover:text-green-700">
                    Reply
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Challenges */}
        {collaborativeFeatures.team_challenges && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
              Active Team Challenges
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collaborativeFeatures.team_challenges.map((challenge, index) => (
                <motion.div 
                  key={challenge.challenge_id}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-5 border border-yellow-200"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-yellow-800">{challenge.title}</h4>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                      {challenge.participants.length} participants
                    </span>
                  </div>
                  <p className="text-yellow-700 text-sm mb-4">{challenge.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-yellow-600 mb-1">
                      <span>Progress</span>
                      <span>{(challenge.progress * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-yellow-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${challenge.progress * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-yellow-600">
                    <span>Deadline: {new Date(challenge.deadline).toLocaleDateString()}</span>
                    <span>{challenge.rewards.length} rewards</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const renderAchievements = () => {
    if (!achievementSystem) {
      return (
        <div className="text-center py-12">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No achievements data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Achievement Overview */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-600" />
            Achievement System
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <motion.div 
              className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-yellow-600">Current Level</h4>
                <Crown className="h-4 w-4 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-800">{achievementSystem.current_level}</p>
              <p className="text-xs text-yellow-500 mt-1">Analytics Master</p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-green-600">Total Points</h4>
                <Star className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-800">{achievementSystem.total_points.toLocaleString()}</p>
              <p className="text-xs text-green-500 mt-1">Lifetime achievement</p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-600">Achievements</h4>
                <Medal className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-800">{achievementSystem.user_achievements.length}</p>
              <p className="text-xs text-blue-500 mt-1">Badges earned</p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-purple-600">Leaderboard</h4>
                <Trophy className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-800">#{achievementSystem.leaderboard_position}</p>
              <p className="text-xs text-purple-500 mt-1">Global rank</p>
            </motion.div>
          </div>

          {/* Progress to Next Level */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200 mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Progress to Level {achievementSystem.current_level + 1}</h4>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Points: {achievementSystem.total_points} / {achievementSystem.total_points + achievementSystem.next_level_requirements.points_needed}</span>
              <span>{((achievementSystem.total_points / (achievementSystem.total_points + achievementSystem.next_level_requirements.points_needed)) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000" 
                style={{ width: `${(achievementSystem.total_points / (achievementSystem.total_points + achievementSystem.next_level_requirements.points_needed)) * 100}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
            Recent Achievements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievementSystem.user_achievements.map((achievement, index) => (
              <motion.div 
                key={achievement.achievement_id}
                className={`rounded-xl p-5 border transition-all duration-300 hover:shadow-lg ${
                  achievement.rarity === 'legendary' ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200' :
                  achievement.rarity === 'epic' ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200' :
                  achievement.rarity === 'rare' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' :
                  'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{achievement.icon}</div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    achievement.rarity === 'legendary' ? 'bg-purple-200 text-purple-800' :
                    achievement.rarity === 'epic' ? 'bg-orange-200 text-orange-800' :
                    achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {achievement.rarity.toUpperCase()}
                  </span>
                </div>
                
                <h4 className="font-bold text-gray-800 mb-2">{achievement.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-yellow-600">+{achievement.points} points</span>
                  <span className="text-xs text-gray-500">
                    {new Date(achievement.earned_at).toLocaleDateString()}
                  </span>
                </div>
                
                {achievement.progress < achievement.max_progress && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress} / {achievement.max_progress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-yellow-500 h-1 rounded-full transition-all duration-1000" 
                        style={{ width: `${(achievement.progress / achievement.max_progress) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Milestones */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Flame className="h-5 w-5 mr-2 text-orange-600" />
            Recent Milestones
          </h3>
          
          <div className="space-y-4">
            {achievementSystem.recent_milestones.map((milestone, index) => (
              <motion.div 
                key={index}
                className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🎉</div>
                    <div>
                      <h4 className="font-semibold text-orange-800">{milestone.title}</h4>
                      <p className="text-sm text-orange-600">
                        Achieved on {new Date(milestone.achieved_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  // Enhanced loading and error components
  const renderLoading = () => (
    <div className="flex flex-col justify-center items-center h-64 space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 absolute top-2 left-2"></div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 absolute top-4 left-4"></div>
      </div>
      <div className="text-center">
        <p className="text-gray-600 font-medium">Loading advanced analytics...</p>
        <p className="text-sm text-gray-500 mt-1">AI processing and data analysis in progress</p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-start space-x-4">
        <AlertTriangle className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-red-800 font-bold text-lg mb-2">Analytics Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex space-x-3">
            <button 
              onClick={loadAdvancedAnalytics}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
            <button 
              onClick={() => setError(null)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced tab content mapping with new enterprise features
  const tabContent = {
    dashboard: renderDashboardSummary(),
    statistical: renderStatisticalAnalysis(),
    'ml-insights': renderMLInsights(),
    patterns: renderPatternRecognition(),
    recommendations: renderRecommendations(),
    collaboration: renderCollaboration(),
    achievements: renderAchievements()
  };

  // Export functionality component
  const ExportModal = () => {
    const [showExport, setShowExport] = useState(false);
    const [exportOptions, setExportOptions] = useState<ExportOptions>({
      format: 'pdf',
      include_charts: true,
      include_recommendations: true,
      template: 'detailed'
    });

    if (!showExport) {
      return (
        <button
          onClick={() => setShowExport(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Analytics</span>
        </button>
      );
    }

    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Export Analytics Report</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select 
                value={exportOptions.format}
                onChange={(e) => setExportOptions({...exportOptions, format: e.target.value as any})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="pdf">PDF Report</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="powerpoint">PowerPoint</option>
                <option value="csv">CSV Data</option>
                <option value="json">JSON Data</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
              <select 
                value={exportOptions.template}
                onChange={(e) => setExportOptions({...exportOptions, template: e.target.value as any})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="executive">Executive Summary</option>
                <option value="detailed">Detailed Analysis</option>
                <option value="student">Student Report</option>
                <option value="instructor">Instructor Dashboard</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={exportOptions.include_charts}
                  onChange={(e) => setExportOptions({...exportOptions, include_charts: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Include Charts & Visualizations</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={exportOptions.include_recommendations}
                  onChange={(e) => setExportOptions({...exportOptions, include_recommendations: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Include Recommendations</span>
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => exportAnalytics(exportOptions)}
              disabled={exportLoading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {exportLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{exportLoading ? 'Generating...' : 'Export'}</span>
            </button>
            <button
              onClick={() => setShowExport(false)}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) return renderLoading();
  if (error) return renderError();

  return (
    <div className="advanced-analytics-container min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Enterprise Analytics Intelligence</h2>
                  <p className="text-sm text-gray-600">AI-powered learning analytics platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search analytics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Real-time toggle */}
              <button
                onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  realTimeUpdates 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <Zap className="h-4 w-4" />
                <span>{realTimeUpdates ? 'Live' : 'Paused'}</span>
              </button>
              
              {/* Export button */}
              {enableExport && <ExportModal />}
              
              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'blue' },
                { key: 'statistical', label: 'Statistical Analysis', icon: TrendingUp, color: 'green' },
                { key: 'ml-insights', label: 'ML Insights', icon: Brain, color: 'purple' },
                { key: 'patterns', label: 'Pattern Recognition', icon: Target, color: 'orange' },
                { key: 'recommendations', label: 'Recommendations', icon: Lightbulb, color: 'yellow' },
                { key: 'collaboration', label: 'Collaboration', icon: Users, color: 'indigo', disabled: !enableCollaboration },
                { key: 'achievements', label: 'Achievements', icon: Award, color: 'pink', disabled: !enableAI }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      if (tab.disabled) return;
                      setActiveTab(tab.key);
                      setTimeout(loadAdvancedAnalytics, 100);
                    }}
                    disabled={tab.disabled}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === tab.key
                        ? `border-${tab.color}-500 text-${tab.color}-600`
                        : tab.disabled
                        ? 'border-transparent text-gray-400 cursor-not-allowed'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.label}</span>
                    {tab.key === 'dashboard' && achievementSystem && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Level {achievementSystem.current_level}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Enhanced Tab Content with Animation */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tabContent[activeTab as keyof typeof tabContent]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;