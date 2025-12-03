// JAC Learning Platform - Enhanced Predictive Analytics Intelligence Platform
// React components for advanced ML predictions and enterprise analytics
//
// Author: Cavin Otieno
// Created: 2025-12-03
// Enhanced from Cavin Otieno's original implementation
// TypeScript checking disabled due to Recharts library compatibility issues

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, ComposedChart, ScatterChart, Scatter
} from 'recharts';
import { apiClient } from '../../services/apiClient';

// Enhanced Types for Enterprise Intelligence
interface MLPrediction {
  ensemble_prediction: {
    ensemble_predictions: number[];
    ensemble_weights: Record<string, number>;
    confidence: number;
  };
  prediction_confidence: number;
  prediction_horizon_days: number;
  model_count: number;
  data_points_used: number;
  features_engineered: number;
  ml_predictions: Record<string, any>;
  model_interpretability?: Record<string, string>;
  feature_importance?: Record<string, number>;
  prediction_uncertainty?: {
    aleatoric: number;
    epistemic: number;
    total: number;
  };
}

interface HistoricalTrends {
  trends_analysis: {
    basic_trends: {
      trend: string;
      first_half_average: number;
      second_half_average: number;
      improvement_rate: number;
    };
    performance_trajectory: {
      trajectory: string;
      slope: number;
      r_squared: number;
      statistical_significance: boolean;
      predicted_next_score: number;
    };
    velocity_trends: {
      velocity: string;
      rate_per_week: number;
      peak_week: string;
      total_completions: number;
    };
  };
  analysis_period_days: number;
  data_quality_score: number;
  recommendations: string[];
  anomaly_detection?: {
    detected_anomalies: number;
    anomaly_periods: Array<{ period: string; severity: string; description: string }>;
    trend_change_points: string[];
  };
}

interface AdaptivePrediction {
  user_pattern_analysis: {
    patterns: string;
    user_type: string;
    learning_style?: string;
    cognitive_load?: string;
    engagement_patterns?: string;
  };
  optimal_model: string;
  adaptive_parameters: Record<string, any>;
  adaptive_predictions: Record<string, any>;
  model_performance: {
    performance: string;
    accuracy: number;
    precision?: number;
    recall?: number;
    f1_score?: number;
  };
  adaptation_strategy: string;
  personalization_score?: number;
}

interface ConfidenceAnalysis {
  confidence_analysis: {
    basic_confidence: {
      confidence: number;
      method: string;
      confidence_intervals?: Array<{ lower: number; upper: number; confidence_level: number }>;
    };
    model_uncertainty: {
      uncertainty: string;
      model_stability: string;
      variance?: number;
      bias?: number;
    };
    data_uncertainty: {
      uncertainty: string;
      data_quality: string;
      missing_data_percentage?: number;
      outliers_detected?: number;
    };
  };
  confidence_level: number;
  sample_size: number;
  statistical_significance: string;
  bayesian_inference?: {
    posterior_probability: number;
    prior_probability: number;
    likelihood: number;
  };
}

interface CollaborationData {
  team_analytics: {
    peer_comparisons: Array<{ peer_id: string; peer_name: string; performance_delta: number; rank: number }>;
    shared_insights: Array<{ insight: string; author: string; timestamp: string; upvotes: number }>;
    collective_predictions: Array<{ metric: string; team_average: number; team_std: number; confidence: number }>;
  };
  annotations: Array<{
    id: string;
    author: string;
    timestamp: string;
    content: string;
    position: { x: number; y: number };
    replies: Array<{ author: string; content: string; timestamp: string }>;
  }>;
  real_time_updates: {
    active_users: number;
    last_update: string;
    update_frequency: string;
  };
}

interface AIGeneratedInsights {
  natural_language_summary: string;
  key_patterns_identified: string[];
  prediction_interpretation: string;
  recommended_actions: string[];
  risk_assessment: string;
  improvement_opportunities: string[];
  confidence_explanation: string;
  historical_context: string;
  generated_at: string;
  ai_model_used: string;
  processing_time_ms: number;
}

interface ExportOptions {
  formats: Array<{
    format: 'pdf' | 'excel' | 'powerpoint' | 'csv' | 'json' | 'images';
    include_charts: boolean;
    include_data: boolean;
    template: 'executive' | 'technical' | 'detailed' | 'summary';
    custom_sections?: string[];
  }>;
  data_range: {
    start_date: string;
    end_date: string;
    metrics: string[];
  };
  sharing: {
    permissions: 'public' | 'private' | 'team' | 'institution';
    expiry_date?: string;
    watermark: boolean;
  };
}

interface ComprehensivePredictiveData {
  ml_predictions: MLPrediction;
  historical_trends: HistoricalTrends;
  adaptive_predictions: AdaptivePrediction;
  confidence_analysis: ConfidenceAnalysis;
  collaboration_data?: CollaborationData;
  ai_insights?: AIGeneratedInsights;
  export_options?: ExportOptions;
  summary_insights: {
    overall_prediction_confidence: string;
    learning_trajectory: string;
    recommendation_priority: string;
    key_insights: string[];
    action_items: string[];
    prediction_accuracy_tracking?: {
      historical_accuracy: number;
      accuracy_trend: string;
      next_prediction_window: string;
    };
  };
}

// Real-time collaboration service
export const collaborationService = {
  async getTeamAnalytics(learningPathId?: string): Promise<CollaborationData> {
    const params = new URLSearchParams();
    if (learningPathId) params.append('learning_path_id', learningPathId);
    
    const response = await apiClient.get<{success: boolean; data: CollaborationData}>(`/api/v1/collaboration/team/?${params}`);
    return response.data;
  },

  async addAnnotation(annotation: Partial<CollaborationData['annotations'][0]>): Promise<boolean> {
    const response = await apiClient.post('/api/v1/collaboration/annotations', annotation);
    return response.data.success;
  },

  async getRealTimeUpdates(): Promise<CollaborationData['real_time_updates']> {
    const response = await apiClient.get('/api/v1/collaboration/real-time');
    return response.data;
  }
};

// AI-powered insights service
export const aiInsightsService = {
  async generateInsights(data: ComprehensivePredictiveData): Promise<AIGeneratedInsights> {
    const response = await apiClient.post('/api/v1/ai/generate-insights', { predictive_data: data });
    return response.data;
  },

  async interpretPrediction(predictionData: MLPrediction, userContext?: any): Promise<string> {
    const response = await apiClient.post('/api/v1/ai/interpret-prediction', { 
      prediction_data: predictionData, 
      user_context: userContext 
    });
    return response.data.interpretation;
  },

  async generateRecommendations(trendsData: HistoricalTrends, confidenceData: ConfidenceAnalysis): Promise<string[]> {
    const response = await apiClient.post('/api/v1/ai/recommendations', { 
      trends_data: trendsData, 
      confidence_data: confidenceData 
    });
    return response.data.recommendations;
  }
};

// Enhanced predictive analytics service
export const predictiveAnalyticsService = {
  async getMLPredictions(learningPathId?: string, predictionHorizonDays: number = 30): Promise<MLPrediction> {
    const params = new URLSearchParams();
    if (learningPathId) params.append('learning_path_id', learningPathId);
    params.append('prediction_horizon_days', predictionHorizonDays.toString());
    
    const response = await apiClient.get<{success: boolean; data: MLPrediction}>(`/api/v1/predict/ml/?${params}`);
    return response.data;
  },

  async getHistoricalTrends(learningPathId?: string, analysisPeriodDays: number = 90): Promise<HistoricalTrends> {
    const params = new URLSearchParams();
    if (learningPathId) params.append('learning_path_id', learningPathId);
    params.append('analysis_period_days', analysisPeriodDays.toString());
    
    const response = await apiClient.get<{success: boolean; data: HistoricalTrends}>(`/api/v1/predict/trends/?${params}`);
    return response.data;
  },

  async getAdaptivePredictions(learningPathId?: string): Promise<AdaptivePrediction> {
    const params = new URLSearchParams();
    if (learningPathId) params.append('learning_path_id', learningPathId);
    
    const response = await apiClient.get<{success: boolean; data: AdaptivePrediction}>(`/api/v1/predict/adaptive/?${params}`);
    return response.data;
  },

  async getConfidenceCalculations(learningPathId?: string, confidenceLevel: number = 0.95): Promise<ConfidenceAnalysis> {
    const params = new URLSearchParams();
    if (learningPathId) params.append('learning_path_id', learningPathId);
    params.append('confidence_level', confidenceLevel.toString());
    
    const response = await apiClient.get<{success: boolean; data: ConfidenceAnalysis}>(`/api/v1/predict/confidence/?${params}`);
    return response.data;
  },

  async getComprehensivePredictive(
    learningPathId?: string,
    predictionHorizonDays: number = 30,
    analysisPeriodDays: number = 90,
    confidenceLevel: number = 0.95
  ): Promise<ComprehensivePredictiveData> {
    const params = new URLSearchParams();
    if (learningPathId) params.append('learning_path_id', learningPathId);
    params.append('prediction_horizon_days', predictionHorizonDays.toString());
    params.append('analysis_period_days', analysisPeriodDays.toString());
    params.append('confidence_level', confidenceLevel.toString());
    
    const response = await apiClient.get<{success: boolean; data: ComprehensivePredictiveData}>(`/api/v1/predict/comprehensive/?${params}`);
    return response.data;
  },

  async getPredictiveDashboard(learningPathId?: string, includeCharts: boolean = true): Promise<any> {
    const params = new URLSearchParams();
    if (learningPathId) params.append('learning_path_id', learningPathId);
    params.append('include_charts', includeCharts.toString());
    
    const response = await apiClient.get<{success: boolean; data: any}>(`/api/v1/predict/dashboard/?${params}`);
    return response.data;
  },

  async exportData(format: string, data: ComprehensivePredictiveData, options: ExportOptions): Promise<Blob> {
    const response = await apiClient.post('/api/v1/predict/export', {
      format,
      data,
      options
    }, { responseType: 'blob' });
    return response.data;
  },

  async getPerformanceBenchmarking(learningPathId?: string): Promise<any> {
    const params = new URLSearchParams();
    if (learningPathId) params.append('learning_path_id', learningPathId);
    
    const response = await apiClient.get<{success: boolean; data: any}>(`/api/v1/predict/benchmarking/?${params}`);
    return response.data;
  }
};

// Enhanced Main Predictive Analytics Component
export const PredictiveAnalytics: React.FC<{
  learningPathId?: string;
  onDataUpdate?: (data: ComprehensivePredictiveData) => void;
  userRole?: 'student' | 'instructor' | 'admin';
  enableCollaboration?: boolean;
  enableAI?: boolean;
}> = ({ 
  learningPathId, 
  onDataUpdate, 
  userRole = 'student',
  enableCollaboration = true,
  enableAI = true 
}) => {
  const [data, setData] = useState<ComprehensivePredictiveData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [predictionHorizon, setPredictionHorizon] = useState(30);
  const [analysisPeriod, setAnalysisPeriod] = useState(90);
  const [collaborationData, setCollaborationData] = useState<CollaborationData | null>(null);
  const [aiInsights, setAiInsights] = useState<AIGeneratedInsights | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [realTimeConnection, setRealTimeConnection] = useState<WebSocket | null>(null);
  const [annotationText, setAnnotationText] = useState('');
  const [annotationPosition, setAnnotationPosition] = useState({ x: 0, y: 0 });
  
  const wsRef = useRef<WebSocket | null>(null);
  const insightsCacheRef = useRef<Map<string, AIGeneratedInsights>>(new Map());

  // Real-time connection management
  useEffect(() => {
    if (enableCollaboration) {
      const connectWebSocket = () => {
        const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}/predictive`);
        
        ws.onopen = () => {
          console.log('Connected to predictive analytics real-time updates');
          setRealTimeConnection(ws);
        };
        
        ws.onmessage = (event) => {
          const update = JSON.parse(event.data);
          if (update.type === 'COLLABORATION_UPDATE' && update.data) {
            setCollaborationData(prev => prev ? { ...prev, ...update.data } : update.data);
          } else if (update.type === 'AI_INSIGHTS_UPDATE' && update.data) {
            setAiInsights(update.data);
          }
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          // Attempt reconnection after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };
        
        ws.onclose = () => {
          console.log('WebSocket connection closed');
          setRealTimeConnection(null);
          // Attempt reconnection after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };
        
        wsRef.current = ws;
      };
      
      connectWebSocket();
      
      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    }
  }, [enableCollaboration]);

  // Load predictive data with enhanced caching
  const loadPredictiveData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cacheKey = `predictive_${learningPathId}_${predictionHorizon}_${analysisPeriod}`;
      
      // Check cache first
      if (insightsCacheRef.current.has(cacheKey)) {
        const cachedData = insightsCacheRef.current.get(cacheKey);
        setData(cachedData!);
        setLoading(false);
        return;
      }
      
      const predictiveData = await predictiveAnalyticsService.getComprehensivePredictive(
        learningPathId,
        predictionHorizon,
        analysisPeriod
      );
      
      // Cache the data
      insightsCacheRef.current.set(cacheKey, predictiveData);
      
      setData(predictiveData);
      onDataUpdate?.(predictiveData);
      
      // Load collaboration data if enabled
      if (enableCollaboration) {
        try {
          const teamData = await collaborationService.getTeamAnalytics(learningPathId);
          setCollaborationData(teamData);
        } catch (err) {
          console.warn('Failed to load collaboration data:', err);
        }
      }
      
    } catch (err: any) {
      console.error('Failed to load predictive analytics:', err);
      setError(err.message || 'Failed to load predictive analytics');
    } finally {
      setLoading(false);
    }
  }, [learningPathId, predictionHorizon, analysisPeriod, enableCollaboration, onDataUpdate]);

  // Generate AI insights
  const generateAIInsights = useCallback(async () => {
    if (!data || !enableAI) return;
    
    setIsGeneratingInsights(true);
    
    try {
      const insights = await aiInsightsService.generateInsights(data);
      setAiInsights(insights);
      
      // Send insights to real-time collaborators
      if (realTimeConnection?.readyState === WebSocket.OPEN) {
        realTimeConnection.send(JSON.stringify({
          type: 'AI_INSIGHTS_UPDATE',
          data: insights
        }));
      }
      
    } catch (err) {
      console.error('Failed to generate AI insights:', err);
    } finally {
      setIsGeneratingInsights(false);
    }
  }, [data, enableAI, realTimeConnection]);

  // Export data functionality
  const handleExport = async (format: string, template: string = 'executive') => {
    if (!data) return;
    
    try {
      const exportOptions: ExportOptions = {
        formats: [{ format: format as any, include_charts: true, include_data: true, template: template as any }],
        data_range: {
          start_date: new Date(Date.now() - analysisPeriod * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date().toISOString(),
          metrics: ['accuracy', 'confidence', 'predictions', 'trends']
        },
        sharing: {
          permissions: 'team',
          watermark: true
        }
      };
      
      const blob = await predictiveAnalyticsService.exportData(format, data, exportOptions);
      
      // Download file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `predictive-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  // Add annotation
  const addAnnotation = async () => {
    if (!annotationText.trim() || !collaborationData) return;
    
    try {
      const newAnnotation = {
        author: 'Current User',
        timestamp: new Date().toISOString(),
        content: annotationText,
        position: annotationPosition,
        replies: []
      };
      
      await collaborationService.addAnnotation(newAnnotation);
      
      // Update local state
      setCollaborationData(prev => prev ? {
        ...prev,
        annotations: [...prev.annotations, { ...newAnnotation, id: Date.now().toString() }]
      } : null);
      
      setAnnotationText('');
      
    } catch (err) {
      console.error('Failed to add annotation:', err);
    }
  };

  useEffect(() => {
    loadPredictiveData();
  }, [loadPredictiveData]);

  // Auto-generate insights when data changes
  useEffect(() => {
    if (data && enableAI && !aiInsights) {
      generateAIInsights();
    }
  }, [data, enableAI, aiInsights, generateAIInsights]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
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
            <h3 className="text-red-400 font-semibold mb-2">Analytics Error</h3>
            <p className="text-red-300">{error}</p>
          </div>
          <button 
            onClick={loadPredictiveData}
            className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-white/70 py-12">
        <div className="text-6xl mb-4">🔮</div>
        <h3 className="text-xl font-semibold mb-2">No Predictive Data Available</h3>
        <p className="text-white/60">Start learning to generate predictive insights</p>
      </div>
    );
  }

  const { ml_predictions, historical_trends, confidence_analysis, summary_insights } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Enhanced Header with Real-time Status */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <span className="text-3xl mr-3">🔮</span>
                Predictive Intelligence Platform
              </h1>
              {realTimeConnection?.readyState === WebSocket.OPEN && (
                <div className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm">Live Collaboration</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Real-time status indicator */}
              {collaborationData?.real_time_updates && (
                <div className="text-white/70 text-sm">
                  {collaborationData.real_time_updates.active_users} active users
                </div>
              )}
              
              {/* Export button */}
              <button
                onClick={() => setExportModalOpen(true)}
                className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                📊 Export
              </button>
              
              {/* AI Insights toggle */}
              {enableAI && (
                <button
                  onClick={generateAIInsights}
                  disabled={isGeneratingInsights}
                  className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50"
                >
                  {isGeneratingInsights ? '🤖 Generating...' : '🤖 AI Insights'}
                </button>
              )}
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
              { id: 'predictions', label: '🤖 ML Predictions', icon: '🤖' },
              { id: 'trends', label: '📈 Historical Trends', icon: '📈' },
              { id: 'confidence', label: '🎯 Confidence Analysis', icon: '🎯' },
              { id: 'collaboration', label: '👥 Team Analytics', icon: '👥', disabled: !enableCollaboration },
              { id: 'ai-insights', label: '🤖 AI Insights', icon: '🤖', disabled: !enableAI }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-300'
                    : tab.disabled
                    ? 'border-transparent text-white/40 cursor-not-allowed'
                    : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
                }`}
                disabled={tab.disabled}
              >
                {tab.label}
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
                data={data}
                predictionHorizon={predictionHorizon}
                setPredictionHorizon={setPredictionHorizon}
                analysisPeriod={analysisPeriod}
                setAnalysisPeriod={setAnalysisPeriod}
                onRefresh={loadPredictiveData}
                aiInsights={aiInsights}
              />
            </motion.div>
          )}

          {activeTab === 'predictions' && (
            <motion.div
              key="predictions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <MLPredictionsTab data={ml_predictions} />
            </motion.div>
          )}

          {activeTab === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <HistoricalTrendsTab data={historical_trends} />
            </motion.div>
          )}

          {activeTab === 'confidence' && (
            <motion.div
              key="confidence"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <ConfidenceAnalysisTab data={confidence_analysis} />
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
                onAddAnnotation={addAnnotation}
                annotationText={annotationText}
                setAnnotationText={setAnnotationText}
                annotationPosition={annotationPosition}
                setAnnotationPosition={setAnnotationPosition}
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
              <AIInsightsTab data={aiInsights} isGenerating={isGeneratingInsights} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export Modal */}
      <ExportModal 
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab: React.FC<{
  data: ComprehensivePredictiveData;
  predictionHorizon: number;
  setPredictionHorizon: (value: number) => void;
  analysisPeriod: number;
  setAnalysisPeriod: (value: number) => void;
  onRefresh: () => void;
  aiInsights: AIGeneratedInsights | null;
}> = ({ 
  data, 
  predictionHorizon, 
  setPredictionHorizon, 
  analysisPeriod, 
  setAnalysisPeriod, 
  onRefresh,
  aiInsights 
}) => {
  const { ml_predictions, historical_trends, confidence_analysis, summary_insights } = data;

  return (
    <div className="space-y-6">
      {/* Enhanced Controls */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Prediction Horizon</label>
            <select 
              value={predictionHorizon} 
              onChange={(e) => setPredictionHorizon(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Analysis Period</label>
            <select 
              value={analysisPeriod} 
              onChange={(e) => setAnalysisPeriod(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
              <option value={365}>1 year</option>
            </select>
          </div>
          
          <button 
            onClick={onRefresh}
            className="px-6 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors font-medium"
          >
            🔄 Refresh Intelligence
          </button>
        </div>
      </div>

      {/* AI Insights Preview */}
      {aiInsights && (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <span className="text-2xl mr-2">🤖</span>AI-Generated Summary
            </h3>
            <div className="text-xs text-white/60">
              Generated by {aiInsights.ai_model_used} • {aiInsights.processing_time_ms}ms
            </div>
          </div>
          <p className="text-white/90 leading-relaxed">{aiInsights.natural_language_summary}</p>
        </div>
      )}

      {/* Enhanced Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-300">
                {summary_insights.overall_prediction_confidence.toUpperCase()}
              </div>
              <div className="text-white/70 text-sm">Prediction Confidence</div>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
          <div className="mt-4">
            <div className="text-purple-200 text-xs">
              Model Accuracy: {Math.round(ml_predictions.prediction_confidence * 100)}%
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-lg rounded-lg p-6 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-300">
                {summary_insights.learning_trajectory.toUpperCase()}
              </div>
              <div className="text-white/70 text-sm">Learning Trajectory</div>
            </div>
            <div className="text-4xl">📈</div>
          </div>
          <div className="mt-4">
            <div className="text-green-200 text-xs">
              Improvement Rate: +{(historical_trends.trends_analysis.basic_trends.improvement_rate * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-lg rounded-lg p-6 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-300">
                {summary_insights.recommendation_priority.toUpperCase()}
              </div>
              <div className="text-white/70 text-sm">Priority Level</div>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
          <div className="mt-4">
            <div className="text-orange-200 text-xs">
              Confidence Level: {(confidence_analysis.confidence_level * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-lg rounded-lg p-6 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-300">
                {ml_predictions.model_count}
              </div>
              <div className="text-white/70 text-sm">ML Models</div>
            </div>
            <div className="text-4xl">🤖</div>
          </div>
          <div className="mt-4">
            <div className="text-blue-200 text-xs">
              Data Points: {ml_predictions.data_points_used.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Key Insights */}
      {summary_insights.key_insights.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">💡</span>Key Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summary_insights.key_insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-start">
                  <span className="text-purple-400 mr-3 mt-1">•</span>
                  <span className="text-white/90 text-sm leading-relaxed">{insight}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      {summary_insights.action_items.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">🎯</span>Recommended Actions
          </h4>
          <div className="space-y-3">
            {summary_insights.action_items.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">→</span>
                  <span className="text-white/90 text-sm leading-relaxed">{action}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Predictions Chart Preview */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">📊</span>Prediction Overview
        </h4>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ml_predictions.ensemble_prediction.ensemble_predictions.map((pred, index) => ({
              day: index + 1,
              prediction: pred,
              confidence_upper: pred * (1 + ml_predictions.ensemble_prediction.confidence),
              confidence_lower: pred * (1 - ml_predictions.ensemble_prediction.confidence)
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" domain={[0, 100]} />
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
                dataKey="confidence_upper" 
                stackId="1" 
                stroke="rgba(59, 130, 246, 0.3)" 
                fill="rgba(59, 130, 246, 0.1)" 
              />
              <Area 
                type="monotone" 
                dataKey="confidence_lower" 
                stackId="1" 
                stroke="rgba(59, 130, 246, 0.3)" 
                fill="rgba(59, 130, 246, 0.1)" 
              />
              <Line 
                type="monotone" 
                dataKey="prediction" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ML Predictions Tab Component
const MLPredictionsTab: React.FC<{ data: MLPrediction }> = ({ data }) => {
  const { ensemble_prediction, prediction_confidence, model_count, data_points_used, features_engineered } = data;
  const predictions = ensemble_prediction.ensemble_predictions || [];

  const chartData = predictions.map((pred, index) => ({
    day: index + 1,
    prediction: pred,
    upper_bound: pred * 1.1,
    lower_bound: pred * 0.9,
    confidence: prediction_confidence
  }));

  return (
    <div className="space-y-6">
      {/* ML Model Overview */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <span className="text-3xl mr-3">🤖</span>Machine Learning Model Ensemble
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-300">{Math.round(prediction_confidence * 100)}%</div>
            <div className="text-white/70 text-sm">Prediction Confidence</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-300">{model_count}</div>
            <div className="text-white/70 text-sm">ML Models Used</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-300">{data_points_used.toLocaleString()}</div>
            <div className="text-white/70 text-sm">Data Points</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-300">{features_engineered}</div>
            <div className="text-white/70 text-sm">Features Engineered</div>
          </div>
        </div>

        {/* Model Ensemble Weights */}
        {Object.keys(ensemble_prediction.ensemble_weights).length > 0 && (
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Model Ensemble Weights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(ensemble_prediction.ensemble_weights).map(([model, weight]) => (
                <div key={model} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                  <span className="text-white/80 capitalize">{model.replace('_', ' ')}</span>
                  <span className="text-blue-300 font-medium">{(weight * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Predictions Chart */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">📊</span>Prediction Timeline with Confidence Intervals
        </h4>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value: number, name: string) => [
                  name === 'prediction' ? `${value.toFixed(1)}%` : `${(value).toFixed(1)}%`,
                  name === 'prediction' ? 'Prediction' : name.replace('_', ' ').toUpperCase()
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="upper_bound" 
                stackId="1" 
                stroke="rgba(59, 130, 246, 0.4)" 
                fill="rgba(59, 130, 246, 0.1)" 
              />
              <Area 
                type="monotone" 
                dataKey="lower_bound" 
                stackId="1" 
                stroke="rgba(59, 130, 246, 0.4)" 
                fill="rgba(59, 130, 246, 0.1)" 
              />
              <Line 
                type="monotone" 
                dataKey="prediction" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Model Predictions */}
      {Object.keys(data.ml_predictions).length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">🔬</span>Individual Model Performance
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(data.ml_predictions).map(([model, predData]: [string, any]) => (
              <div key={model} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-white font-medium capitalize">{model.replace('_', ' ')}</h5>
                  <span className="text-blue-300 font-bold">
                    {predData.model_score ? `${(predData.model_score * 100).toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
                
                {predData.predictions && (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={predData.predictions.map((pred: number, idx: number) => ({ day: idx + 1, prediction: pred }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
                        <YAxis stroke="rgba(255,255,255,0.7)" domain={[0, 100]} />
                        <Line 
                          type="monotone" 
                          dataKey="prediction" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Importance (if available) */}
      {data.feature_importance && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">🎯</span>Feature Importance Analysis
          </h4>
          
          <div className="space-y-3">
            {Object.entries(data.feature_importance)
              .sort(([,a], [,b]) => (b as number) - (a as number))
              .slice(0, 10)
              .map(([feature, importance], index) => (
                <div key={feature} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className="text-white/80 capitalize">{feature.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(importance as number) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-blue-300 font-medium">{(importance as number * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Historical Trends Tab Component
const HistoricalTrendsTab: React.FC<{ data: HistoricalTrends }> = ({ data }) => {
  const { trends_analysis, data_quality_score } = data;
  const basic_trends = trends_analysis.basic_trends;
  const performance_trajectory = trends_analysis.performance_trajectory;

  const trendData = [
    {
      period: 'First Half',
      score: basic_trends.first_half_average,
      color: '#ef4444'
    },
    {
      period: 'Second Half', 
      score: basic_trends.second_half_average,
      color: '#22c55e'
    },
    {
      period: 'Predicted Next',
      score: performance_trajectory.predicted_next_score,
      color: '#3b82f6'
    }
  ];

  const getTrajectoryColor = (trajectory: string) => {
    switch (trajectory) {
      case 'improving': return 'text-green-400';
      case 'declining': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Trends Overview */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <span className="text-3xl mr-3">📈</span>Historical Trends Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-300">{Math.round(data_quality_score * 100)}%</div>
            <div className="text-white/70 text-sm">Data Quality Score</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-300">
              {basic_trends.improvement_rate > 0 ? '+' : ''}{(basic_trends.improvement_rate * 100).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Improvement Rate</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-4 text-center">
            <div className={`text-3xl font-bold ${getTrajectoryColor(performance_trajectory.trajectory)}`}>
              {performance_trajectory.trajectory.toUpperCase()}
            </div>
            <div className="text-white/70 text-sm">Performance Trajectory</div>
          </div>
        </div>

        {/* Performance Comparison Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="period" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">📊</span>Statistical Analysis
          </h4>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">R² Score:</span>
                <span className="text-white font-medium">{performance_trajectory.r_squared.toFixed(3)}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                  style={{ width: `${performance_trajectory.r_squared * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/70">Statistical Significance:</span>
              <span className={`font-medium ${performance_trajectory.statistical_significance ? 'text-green-400' : 'text-yellow-400'}`}>
                {performance_trajectory.statistical_significance ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/70">Trajectory Slope:</span>
              <span className="text-white font-medium">{performance_trajectory.slope.toFixed(4)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/70">Predicted Next Score:</span>
              <span className="text-blue-400 font-medium">{performance_trajectory.predicted_next_score.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">⚡</span>Velocity Analysis
          </h4>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/70">Learning Velocity:</span>
              <span className="text-orange-400 font-medium capitalize">{trends_analysis.velocity_trends.velocity}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/70">Rate per Week:</span>
              <span className="text-white font-medium">{trends_analysis.velocity_trends.rate_per_week.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/70">Peak Week:</span>
              <span className="text-purple-400 font-medium">{trends_analysis.velocity_trends.peak_week}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/70">Total Completions:</span>
              <span className="text-green-400 font-medium">{trends_analysis.velocity_trends.total_completions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Anomaly Detection */}
      {data.anomaly_detection && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">🔍</span>Anomaly Detection
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-400">{data.anomaly_detection.detected_anomalies}</div>
              <div className="text-white/70 text-sm">Anomalies Detected</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-white font-medium mb-3">Anomaly Periods</h5>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {data.anomaly_detection.anomaly_periods.map((anomaly, index) => (
                  <div key={index} className="bg-white/5 rounded p-2">
                    <div className="text-red-400 text-sm font-medium">{anomaly.period}</div>
                    <div className="text-white/70 text-xs">{anomaly.description}</div>
                    <div className="text-orange-400 text-xs capitalize">{anomaly.severity} severity</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-white font-medium mb-3">Trend Change Points</h5>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {data.anomaly_detection.trend_change_points.map((point, index) => (
                  <div key={index} className="bg-white/5 rounded p-2">
                    <div className="text-blue-400 text-sm">{point}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">💡</span>Trend Recommendations
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <span className="text-blue-400 mr-3 mt-1">•</span>
                  <span className="text-white/90 text-sm leading-relaxed">{rec}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Confidence Analysis Tab Component
const ConfidenceAnalysisTab: React.FC<{ data: ConfidenceAnalysis }> = ({ data }) => {
  const { confidence_analysis, sample_size, statistical_significance } = data;
  const basic_confidence = confidence_analysis.basic_confidence;
  const model_uncertainty = confidence_analysis.model_uncertainty;

  const confidenceData = [
    {
      name: 'Confidence',
      value: basic_confidence.confidence * 100,
      fill: '#3b82f6'
    }
  ];

  const getUncertaintyColor = (uncertainty: string) => {
    switch (uncertainty) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Confidence Overview */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <span className="text-3xl mr-3">🎯</span>Statistical Confidence Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-300">{Math.round(basic_confidence.confidence * 100)}%</div>
            <div className="text-white/70 text-sm">Overall Confidence</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-300">{sample_size.toLocaleString()}</div>
            <div className="text-white/70 text-sm">Sample Size</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-300 capitalize">{statistical_significance}</div>
            <div className="text-white/70 text-sm">Statistical Significance</div>
          </div>
        </div>

        {/* Confidence Visualization */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={confidenceData}>
              <Bar 
                dataKey="value" 
                cornerRadius={10} 
                fill="#3b82f6"
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-2xl font-bold">
                {Math.round(basic_confidence.confidence * 100)}%
              </text>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Uncertainty Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">⚖️</span>Uncertainty Assessment
          </h4>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Model Uncertainty:</span>
                <span className={`font-medium ${getUncertaintyColor(model_uncertainty.uncertainty)}`}>
                  {model_uncertainty.uncertainty.toUpperCase()}
                </span>
              </div>
              <div className="text-white/60 text-sm">
                Stability: {model_uncertainty.model_stability}
              </div>
              {model_uncertainty.variance && (
                <div className="text-white/60 text-sm">
                  Variance: {model_uncertainty.variance.toFixed(4)}
                </div>
              )}
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Data Uncertainty:</span>
                <span className={`font-medium ${getUncertaintyColor(confidence_analysis.data_uncertainty.uncertainty)}`}>
                  {confidence_analysis.data_uncertainty.uncertainty.toUpperCase()}
                </span>
              </div>
              <div className="text-white/60 text-sm">
                Quality: {confidence_analysis.data_uncertainty.data_quality}
              </div>
              {confidence_analysis.data_uncertainty.missing_data_percentage && (
                <div className="text-white/60 text-sm">
                  Missing Data: {confidence_analysis.data_uncertainty.missing_data_percentage.toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">📊</span>Statistical Summary
          </h4>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Method:</span>
                <span className="text-white font-medium">{basic_confidence.method}</span>
              </div>
              <div className="text-white/60 text-sm">
                Confidence Level: {(data.confidence_level * 100).toFixed(0)}%
              </div>
            </div>
            
            {data.bayesian_inference && (
              <div className="bg-white/5 rounded-lg p-4">
                <h5 className="text-white font-medium mb-2">Bayesian Inference</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Posterior:</span>
                    <span className="text-blue-400">{(data.bayesian_inference.posterior_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Prior:</span>
                    <span className="text-purple-400">{(data.bayesian_inference.prior_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Likelihood:</span>
                    <span className="text-green-400">{(data.bayesian_inference.likelihood * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-white font-medium mb-2">Confidence Interpretation</h5>
              <div className="text-white/60 text-xs">
                {basic_confidence.confidence > 0.8 
                  ? "High confidence in predictions - Results are highly reliable" 
                  : basic_confidence.confidence > 0.5 
                  ? "Moderate confidence - Consider gathering more data for better accuracy"
                  : "Low confidence - Predictions may be unreliable, significant data needed"
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Intervals */}
      {basic_confidence.confidence_intervals && basic_confidence.confidence_intervals.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">📊</span>Confidence Intervals
          </h4>
          
          <div className="space-y-3">
            {basic_confidence.confidence_intervals.map((interval, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70">
                    {(interval.confidence_level * 100).toFixed(0)}% Confidence Interval
                  </span>
                  <span className="text-blue-400 font-medium">
                    [{interval.lower.toFixed(2)}, {interval.upper.toFixed(2)}]
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ 
                      width: `${((interval.upper - interval.lower) / 100) * 100}%`,
                      marginLeft: `${(interval.lower / 100) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Collaboration Tab Component
const CollaborationTab: React.FC<{
  data: CollaborationData | null;
  onAddAnnotation: () => void;
  annotationText: string;
  setAnnotationText: (text: string) => void;
  annotationPosition: { x: number; y: number };
  setAnnotationPosition: (pos: { x: number; y: number }) => void;
}> = ({ data, onAddAnnotation, annotationText, setAnnotationText, annotationPosition, setAnnotationPosition }) => {
  if (!data) {
    return (
      <div className="text-center text-white/70 py-12">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-xl font-semibold mb-2">Loading Team Analytics...</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Status */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <span className="text-3xl mr-3">👥</span>Real-time Team Collaboration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-300">{data.real_time_updates.active_users}</div>
            <div className="text-white/70 text-sm">Active Users</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-300">{data.annotations.length}</div>
            <div className="text-white/70 text-sm">Annotations</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-300">{data.shared_insights.length}</div>
            <div className="text-white/70 text-sm">Shared Insights</div>
          </div>
        </div>
      </div>

      {/* Peer Comparisons */}
      {data.peer_comparisons.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">🏆</span>Peer Performance Comparison
          </h4>
          
          <div className="space-y-3">
            {data.peer_comparisons.map((peer, index) => (
              <div key={peer.peer_id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-white">#{peer.rank}</div>
                  <div>
                    <div className="text-white font-medium">{peer.peer_name}</div>
                    <div className="text-white/60 text-sm">
                      Performance Delta: {peer.performance_delta > 0 ? '+' : ''}{peer.performance_delta.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  peer.performance_delta > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {peer.performance_delta > 0 ? 'Ahead' : 'Behind'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shared Insights */}
      {data.shared_insights.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">💡</span>Team Shared Insights
          </h4>
          
          <div className="space-y-4">
            {data.shared_insights.map((insight, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-white font-medium">{insight.author}</div>
                  <div className="text-white/60 text-sm">
                    {new Date(insight.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-white/90 mb-3">{insight.insight}</p>
                <div className="flex items-center justify-between">
                  <div className="text-blue-400 text-sm">👍 {insight.upvotes} upvotes</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collective Predictions */}
      {data.collective_predictions.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">🎯</span>Collective Team Predictions
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.collective_predictions.map((prediction, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <h5 className="text-white font-medium mb-2 capitalize">{prediction.metric.replace('_', ' ')}</h5>
                <div className="text-2xl font-bold text-blue-300 mb-1">
                  {prediction.team_average.toFixed(1)}%
                </div>
                <div className="text-white/60 text-sm mb-2">
                  Std: {prediction.team_std.toFixed(2)} | Confidence: {(prediction.confidence * 100).toFixed(0)}%
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Annotation System */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">📝</span>Add Annotation
        </h4>
        
        <div className="space-y-4">
          <textarea
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
            placeholder="Share your insights with the team..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Position X</label>
              <input
                type="number"
                value={annotationPosition.x}
                onChange={(e) => setAnnotationPosition({ ...annotationPosition, x: Number(e.target.value) })}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Position Y</label>
              <input
                type="number"
                value={annotationPosition.y}
                onChange={(e) => setAnnotationPosition({ ...annotationPosition, y: Number(e.target.value) })}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
          
          <button
            onClick={onAddAnnotation}
            disabled={!annotationText.trim()}
            className="px-6 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            Add Annotation
          </button>
        </div>
      </div>

      {/* Existing Annotations */}
      {data.annotations.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">📋</span>Team Annotations
          </h4>
          
          <div className="space-y-4">
            {data.annotations.map((annotation) => (
              <div key={annotation.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-white font-medium">{annotation.author}</div>
                  <div className="text-white/60 text-sm">
                    {new Date(annotation.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-white/90 mb-2">{annotation.content}</p>
                <div className="text-white/60 text-xs">
                  Position: ({annotation.position.x}, {annotation.position.y})
                </div>
                
                {annotation.replies && annotation.replies.length > 0 && (
                  <div className="mt-3 pl-4 border-l border-white/20">
                    {annotation.replies.map((reply, index) => (
                      <div key={index} className="mb-2">
                        <div className="text-white/80 text-sm">{reply.content}</div>
                        <div className="text-white/60 text-xs">
                          {reply.author} • {new Date(reply.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// AI Insights Tab Component
const AIInsightsTab: React.FC<{
  data: AIGeneratedInsights | null;
  isGenerating: boolean;
}> = ({ data, isGenerating }) => {
  if (isGenerating) {
    return (
      <div className="text-center text-white py-12">
        <div className="text-6xl mb-4 animate-bounce">🤖</div>
        <h3 className="text-xl font-semibold mb-2">AI is analyzing your data...</h3>
        <p className="text-white/60">Generating insights using advanced machine learning</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-white/70 py-12">
        <div className="text-6xl mb-4">🤖</div>
        <h3 className="text-xl font-semibold mb-2">No AI Insights Available</h3>
        <p className="text-white/60">Click "Generate AI Insights" to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-white flex items-center">
            <span className="text-3xl mr-3">🤖</span>AI-Generated Intelligence
          </h3>
          <div className="text-right text-white/60 text-sm">
            <div>Generated by: {data.ai_model_used}</div>
            <div>Processing time: {data.processing_time_ms}ms</div>
            <div>{new Date(data.generated_at).toLocaleDateString()}</div>
          </div>
        </div>
        <p className="text-white/90 leading-relaxed">{data.natural_language_summary}</p>
      </div>

      {/* Key Patterns */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">🔍</span>Key Patterns Identified
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.key_patterns_identified.map((pattern, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4"
            >
              <div className="flex items-start">
                <span className="text-blue-400 mr-3 mt-1">🔍</span>
                <span className="text-white/90 text-sm leading-relaxed">{pattern}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Prediction Interpretation */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">🎯</span>Prediction Interpretation
        </h4>
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4">
          <p className="text-white/90 leading-relaxed">{data.prediction_interpretation}</p>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">⚠️</span>Risk Assessment
        </h4>
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-white/90 leading-relaxed">{data.risk_assessment}</p>
        </div>
      </div>

      {/* AI-Generated Recommendations */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">💡</span>AI-Generated Recommendations
        </h4>
        <div className="space-y-3">
          {data.recommended_actions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4"
            >
              <div className="flex items-start">
                <span className="text-green-400 mr-3 mt-1">🤖</span>
                <span className="text-white/90 text-sm leading-relaxed">{action}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Improvement Opportunities */}
      {data.improvement_opportunities.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">🚀</span>Improvement Opportunities
          </h4>
          <div className="space-y-3">
            {data.improvement_opportunities.map((opportunity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <span className="text-purple-400 mr-3 mt-1">🚀</span>
                  <span className="text-white/90 text-sm leading-relaxed">{opportunity}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Confidence Explanation */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">📊</span>Confidence Explanation
        </h4>
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
          <p className="text-white/90 leading-relaxed">{data.confidence_explanation}</p>
        </div>
      </div>

      {/* Historical Context */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">📚</span>Historical Context
        </h4>
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-4">
          <p className="text-white/90 leading-relaxed">{data.historical_context}</p>
        </div>
      </div>
    </div>
  );
};

// Export Modal Component
const ExportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, template: string) => void;
}> = ({ isOpen, onClose, onExport }) => {
  if (!isOpen) return null;

  const exportFormats = [
    { id: 'pdf', name: 'PDF Report', icon: '📄', description: 'Executive summary with charts' },
    { id: 'excel', name: 'Excel Workbook', icon: '📊', description: 'Detailed data with multiple sheets' },
    { id: 'powerpoint', name: 'PowerPoint Presentation', icon: '📽️', description: 'Professional slides with insights' },
    { id: 'csv', name: 'CSV Data', icon: '📈', description: 'Raw data for further analysis' },
    { id: 'json', name: 'JSON Data', icon: '🔧', description: 'Structured data for API integration' },
    { id: 'images', name: 'Chart Images', icon: '🖼️', description: 'High-resolution charts and graphs' }
  ];

  const templates = [
    { id: 'executive', name: 'Executive Summary', description: 'High-level overview for stakeholders' },
    { id: 'technical', name: 'Technical Report', description: 'Detailed analysis for technical teams' },
    { id: 'detailed', name: 'Comprehensive Analysis', description: 'Complete data with all insights' },
    { id: 'summary', name: 'Quick Summary', description: 'Key metrics and highlights' }
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
              <span className="text-3xl mr-3">📊</span>Export Intelligence
            </h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Choose Export Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => onExport(format.id, 'executive')}
                  className="bg-white/5 border border-white/20 rounded-lg p-4 text-left hover:bg-white/10 transition-colors"
                >
                  <div className="text-3xl mb-2">{format.icon}</div>
                  <div className="text-white font-medium mb-1">{format.name}</div>
                  <div className="text-white/60 text-sm">{format.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Choose Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onExport('pdf', template.id)}
                  className="bg-white/5 border border-white/20 rounded-lg p-4 text-left hover:bg-white/10 transition-colors"
                >
                  <div className="text-white font-medium mb-1">{template.name}</div>
                  <div className="text-white/60 text-sm">{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Export Options */}
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Export</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onExport('pdf', 'executive')}
                className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                📄 Executive PDF
              </button>
              <button
                onClick={() => onExport('excel', 'detailed')}
                className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                📊 Excel Data
              </button>
              <button
                onClick={() => onExport('powerpoint', 'executive')}
                className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
              >
                📽️ PowerPoint
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PredictiveAnalytics;