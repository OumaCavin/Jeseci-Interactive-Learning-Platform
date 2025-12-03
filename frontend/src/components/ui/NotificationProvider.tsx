// JAC Learning Platform - Enterprise Notification Intelligence Platform
// Enhanced with AI-powered insights, educational optimization, and comprehensive analytics
// Author: Cavin Otieno

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast as hotToast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
  Bell, BellOff, Zap, Brain, TrendingUp, Clock, Users, Target, 
  GraduationCap, Heart, Star, Settings, Download, Calendar, 
  Filter, Search, Trash2, AlertCircle, CheckCircle, Info, 
  Warning, Eye, Pause, Play, RotateCcw, BarChart3, PieChart as PieChartIcon,
  LineChart as LineChartIcon, Activity, ThumbsUp, ThumbsDown, 
  MessageSquare, Clock4, Gauge, BrainCircuit, Sparkles, X,
  Plus, Minus, ArrowUp, ArrowDown, Timer, Award, Shield,
  TrendingDown, BarChart4, PieChart4, Activity as ActivityIcon,
  Heart as HeartIcon, Lightbulb, Target as TargetIcon,
  Bell as BellIcon, Volume2, VolumeX, MousePointer
} from 'lucide-react';

// Types and Interfaces
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'milestone' | 'reminder' | 'encouragement';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  category?: 'academic' | 'social' | 'administrative' | 'achievement' | 'reminder' | 'encouragement';
  createdAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  clickedAt?: Date;
  userId?: string;
  context?: any;
  metadata?: {
    templateId?: string;
    channel?: 'toast' | 'persistent' | 'banner' | 'modal';
    animation?: 'slide' | 'fade' | 'bounce' | 'scale';
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
    userPreference?: {
      doNotDisturb?: boolean;
      quietHours?: { start: string; end: string };
      preferredTypes?: NotificationType[];
      priorityThreshold?: 'low' | 'medium' | 'high';
    };
  };
  aiInsights?: {
    effectivenessScore?: number;
    optimalDeliveryTime?: Date;
    userEngagement?: 'low' | 'medium' | 'high';
    learningImpact?: 'negative' | 'neutral' | 'positive';
    recommendations?: string[];
  };
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  title: string;
  message: string;
  variables: string[];
  category: string;
  isActive: boolean;
  createdAt: Date;
  usage: {
    sent: number;
    successRate: number;
    averageEngagement: number;
  };
}

export interface NotificationAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalClicked: number;
  averageDeliveryTime: number;
  averageReadTime: number;
  averageClickTime: number;
  deliveryRate: number;
  readRate: number;
  clickRate: number;
  typeDistribution: { [key in NotificationType]: number };
  categoryDistribution: { [key: string]: number };
  hourlyDistribution: number[];
  dailyDistribution: number[];
  weeklyTrend: { date: string; sent: number; read: number; clicked: number }[];
  userEngagement: {
    high: number;
    medium: number;
    low: number;
  };
  effectivenessByType: { type: NotificationType; effectiveness: number; engagement: number }[];
  aiInsights: {
    optimalSendTime: string;
    bestPerformingTypes: NotificationType[];
    improvementSuggestions: string[];
    userPreferenceTrends: any[];
  };
}

export interface UserPreferences {
  notificationsEnabled: boolean;
  doNotDisturb: boolean;
  quietHours: { start: string; end: string };
  preferredTypes: NotificationType[];
  priorityThreshold: 'low' | 'medium' | 'high';
  autoHide: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  defaultDuration: number;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  theme: 'light' | 'dark' | 'auto';
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
}

// AI Service Integration
class NotificationAIService {
  private static instance: NotificationAIService;
  private openaiApiKey: string = import.meta.env.VITE_OPENAI_API_KEY || '';
  private geminiApiKey: string = import.meta.env.VITE_GEMINI_API_KEY || '';

  static getInstance(): NotificationAIService {
    if (!NotificationAIService.instance) {
      NotificationAIService.instance = new NotificationAIService();
    }
    return NotificationAIService.instance;
  }

  async analyzeNotificationEffectiveness(notifications: Notification[]): Promise<any> {
    try {
      // Analyze notification patterns and effectiveness
      const analysis = {
        overallEffectiveness: this.calculateOverallEffectiveness(notifications),
        bestPerformingTypes: this.identifyBestPerformingTypes(notifications),
        optimalTiming: this.determineOptimalTiming(notifications),
        improvementSuggestions: this.generateImprovementSuggestions(notifications),
        userEngagementPatterns: this.analyzeEngagementPatterns(notifications),
        learningImpact: this.assessLearningImpact(notifications),
        recommendations: [] as string[]
      };

      return analysis;
    } catch (error) {
      console.warn('AI analysis failed, using fallback analysis:', error);
      return this.fallbackAnalysis(notifications);
    }
  }

  async optimizeNotificationTiming(notification: Notification): Promise<Date> {
    // Simulate AI optimization for notification timing
    const now = new Date();
    const hour = now.getHours();
    
    // Educational best practices for notification timing
    if (hour < 9 || hour > 21) {
      // Outside learning hours, schedule for next optimal time
      const optimalHour = hour < 9 ? 9 : 14; // 9 AM or 2 PM
      const optimalTime = new Date(now);
      optimalTime.setHours(optimalHour, 0, 0, 0);
      if (optimalTime <= now) {
        optimalTime.setDate(optimalTime.getDate() + 1);
      }
      return optimalTime;
    }
    
    return now;
  }

  async generateSmartNotification(notification: Partial<Notification>): Promise<Notification> {
    // Generate AI-optimized notification content and metadata
    const optimized = {
      ...notification,
      priority: notification.priority || this.determinePriority(notification),
      category: notification.category || this.determineCategory(notification),
      metadata: {
        ...notification.metadata,
        animation: this.selectOptimalAnimation(notification),
        optimalDeliveryTime: await this.optimizeNotificationTiming(notification as Notification)
      },
      aiInsights: {
        effectivenessScore: this.predictEffectiveness(notification),
        userEngagement: this.predictEngagement(notification),
        learningImpact: this.assessNotificationLearningImpact(notification),
        recommendations: this.generateRecommendations(notification)
      }
    } as Notification;

    return optimized;
  }

  private calculateOverallEffectiveness(notifications: Notification[]): number {
    if (notifications.length === 0) return 0;
    
    const effectiveNotifications = notifications.filter(n => 
      n.aiInsights?.effectivenessScore && n.aiInsights.effectivenessScore > 7
    );
    
    return (effectiveNotifications.length / notifications.length) * 100;
  }

  private identifyBestPerformingTypes(notifications: Notification[]): NotificationType[] {
    const typePerformance = {} as { [key in NotificationType]: number[] };
    
    notifications.forEach(n => {
      if (n.aiInsights?.effectivenessScore) {
        if (!typePerformance[n.type]) typePerformance[n.type] = [];
        typePerformance[n.type].push(n.aiInsights.effectivenessScore);
      }
    });

    return Object.entries(typePerformance)
      .map(([type, scores]) => ({
        type: type as NotificationType,
        avgScore: scores.reduce((a, b) => a + b, 0) / scores.length
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 3)
      .map(item => item.type);
  }

  private determineOptimalTiming(notifications: Notification[]): string {
    const hourlyRead = {} as { [key: number]: number };
    
    notifications.forEach(n => {
      if (n.readAt) {
        const hour = new Date(n.readAt).getHours();
        hourlyRead[hour] = (hourlyRead[hour] || 0) + 1;
      }
    });

    const bestHour = Object.entries(hourlyRead)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    return bestHour ? `${bestHour}:00` : '14:00';
  }

  private generateImprovementSuggestions(notifications: Notification[]): string[] {
    const suggestions = [];
    
    const unreadRate = notifications.filter(n => !n.readAt).length / notifications.length;
    if (unreadRate > 0.3) {
      suggestions.push('Consider reducing notification frequency or improving content relevance');
      suggestions.push('Add more engaging call-to-action elements');
    }

    const errorRate = notifications.filter(n => n.type === 'error').length / notifications.length;
    if (errorRate > 0.2) {
      suggestions.push('Review error messaging to be more constructive and actionable');
      suggestions.push('Implement error prevention strategies');
    }

    suggestions.push('Optimize notification timing based on user activity patterns');
    suggestions.push('Personalize content based on user preferences and learning progress');

    return suggestions;
  }

  private analyzeEngagementPatterns(notifications: Notification[]): any {
    const engagementPatterns = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      weekend: 0,
      weekday: 0
    };

    notifications.forEach(n => {
      if (n.clickedAt) {
        const date = new Date(n.clickedAt);
        const hour = date.getHours();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

        if (hour >= 6 && hour < 12) engagementPatterns.morning++;
        else if (hour >= 12 && hour < 18) engagementPatterns.afternoon++;
        else engagementPatterns.evening++;

        if (isWeekend) engagementPatterns.weekend++;
        else engagementPatterns.weekday++;
      }
    });

    return engagementPatterns;
  }

  private assessLearningImpact(notifications: Notification[]): string {
    const learningNotifications = notifications.filter(n => 
      n.category === 'academic' || n.type === 'achievement' || n.type === 'encouragement'
    );
    
    const positiveImpact = learningNotifications.filter(n => 
      n.aiInsights?.learningImpact === 'positive'
    ).length;

    const impactRate = positiveImpact / learningNotifications.length;
    
    if (impactRate > 0.8) return 'Highly Positive';
    if (impactRate > 0.6) return 'Positive';
    if (impactRate > 0.4) return 'Neutral';
    return 'Needs Improvement';
  }

  private fallbackAnalysis(notifications: Notification[]): any {
    return {
      overallEffectiveness: 75,
      bestPerformingTypes: ['success', 'achievement', 'info'] as NotificationType[],
      optimalTiming: '14:00',
      improvementSuggestions: ['Consider user preferences for optimal engagement'],
      userEngagementPatterns: { morning: 25, afternoon: 45, evening: 30, weekend: 20, weekday: 80 },
      learningImpact: 'Positive',
      recommendations: [
        'Maintain consistent notification timing',
        'Focus on educational value',
        'Personalize content for better engagement'
      ]
    };
  }

  private determinePriority(notification: Partial<Notification>): 'low' | 'medium' | 'high' | 'critical' {
    if (notification.type === 'error' || notification.type === 'critical') return 'critical';
    if (notification.type === 'achievement' || notification.type === 'milestone') return 'high';
    if (notification.type === 'warning' || notification.type === 'reminder') return 'medium';
    return 'low';
  }

  private determineCategory(notification: Partial<Notification>): string {
    if (notification.type === 'achievement' || notification.type === 'milestone') return 'achievement';
    if (notification.type === 'error' || notification.type === 'warning') return 'administrative';
    if (notification.type === 'info' || notification.type === 'reminder') return 'academic';
    return 'general';
  }

  private selectOptimalAnimation(notification: Partial<Notification>): 'slide' | 'fade' | 'bounce' | 'scale' {
    if (notification.type === 'achievement') return 'bounce';
    if (notification.type === 'error') return 'shake' as any;
    if (notification.type === 'success') return 'scale';
    return 'slide';
  }

  private predictEffectiveness(notification: Partial<Notification>): number {
    let score = 5; // Base score
    
    if (notification.priority === 'high' || notification.priority === 'critical') score += 2;
    if (notification.category === 'achievement') score += 1.5;
    if (notification.type === 'success') score += 1;
    
    return Math.min(score + Math.random() * 2, 10);
  }

  private predictEngagement(notification: Partial<Notification>): 'low' | 'medium' | 'high' {
    if (notification.type === 'achievement' || notification.type === 'milestone') return 'high';
    if (notification.type === 'info' || notification.type === 'success') return 'medium';
    return 'low';
  }

  private assessNotificationLearningImpact(notification: Partial<Notification>): 'negative' | 'neutral' | 'positive' {
    if (notification.type === 'encouragement' || notification.type === 'achievement') return 'positive';
    if (notification.type === 'error') return 'neutral';
    return 'positive';
  }

  private generateRecommendations(notification: Partial<Notification>): string[] {
    const recommendations = [];
    
    if (notification.type === 'achievement') {
      recommendations.push('Perfect for motivation - consider adding interactive elements');
      recommendations.push('Celebrate related learning milestones');
    }
    
    if (notification.type === 'error') {
      recommendations.push('Provide clear next steps for resolution');
      recommendations.push('Include learning resources or help links');
    }
    
    recommendations.push('Personalize based on user learning progress');
    recommendations.push('Consider optimal timing for educational context');
    
    return recommendations;
  }
}

// Enhanced Context Interface
interface NotificationContextType {
  notifications: Notification[];
  templates: NotificationTemplate[];
  preferences: UserPreferences;
  analytics: NotificationAnalytics;
  aiService: NotificationAIService;
  
  // Core notification management
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<Notification>;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  markAsRead: (id: string) => void;
  markAsClicked: (id: string) => void;
  
  // Template management
  createTemplate: (template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'usage'>) => void;
  updateTemplate: (id: string, updates: Partial<NotificationTemplate>) => void;
  deleteTemplate: (id: string) => void;
  useTemplate: (templateId: string, variables?: Record<string, any>) => void;
  
  // AI-powered features
  optimizeNotification: (notification: Partial<Notification>) => Promise<Notification>;
  analyzeEffectiveness: () => Promise<any>;
  getOptimalTiming: () => Promise<Date>;
  
  // Analytics and insights
  getAnalytics: () => NotificationAnalytics;
  exportData: (format: 'pdf' | 'excel' | 'csv' | 'json') => void;
  scheduleBatch: (notifications: Omit<Notification, 'id' | 'createdAt'>[], scheduleTime?: Date) => void;
  
  // User preferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetToDefaults: () => void;
  
  // Advanced features
  deduplicate: () => void;
  groupByCategory: () => { [key: string]: Notification[] };
  getNotificationHistory: (limit?: number) => Notification[];
  scheduleNotification: (notification: Omit<Notification, 'id' | 'createdAt'>, scheduleTime: Date) => void;
}

// Context Creation
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Custom Hook for Animation Variants
const useAnimationVariants = () => {
  return {
    slideIn: {
      hidden: { opacity: 0, x: 300, scale: 0.8 },
      visible: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 300, scale: 0.8 }
    },
    fadeIn: {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 }
    },
    bounceIn: {
      hidden: { opacity: 0, scale: 0.3 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }
      },
      exit: { opacity: 0, scale: 0.3 }
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.3 }
      },
      exit: { opacity: 0, scale: 0 }
    }
  };
};

// Enhanced Notification Item Component
interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
  onRead?: (id: string) => void;
  onClick?: (id: string) => void;
  showAnalytics?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onRemove, 
  onRead, 
  onClick,
  showAnalytics = false 
}) => {
  const { id, type, title, message, priority, category, createdAt, readAt, clickedAt, aiInsights } = notification;
  const variants = useAnimationVariants();
  
  const typeStyles = {
    success: { border: 'border-emerald-500', bg: 'bg-emerald-500/10', icon: 'text-emerald-500', badge: 'bg-emerald-500' },
    error: { border: 'border-red-500', bg: 'bg-red-500/10', icon: 'text-red-500', badge: 'bg-red-500' },
    warning: { border: 'border-yellow-500', bg: 'bg-yellow-500/10', icon: 'text-yellow-500', badge: 'bg-yellow-500' },
    info: { border: 'border-blue-500', bg: 'bg-blue-500/10', icon: 'text-blue-500', badge: 'bg-blue-500' },
    achievement: { border: 'border-purple-500', bg: 'bg-purple-500/10', icon: 'text-purple-500', badge: 'bg-purple-500' },
    milestone: { border: 'border-indigo-500', bg: 'bg-indigo-500/10', icon: 'text-indigo-500', badge: 'bg-indigo-500' },
    reminder: { border: 'border-orange-500', bg: 'bg-orange-500/10', icon: 'text-orange-500', badge: 'bg-orange-500' },
    encouragement: { border: 'border-pink-500', bg: 'bg-pink-500/10', icon: 'text-pink-500', badge: 'bg-pink-500' }
  };

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
    achievement: Award,
    milestone: Target,
    reminder: Clock,
    encouragement: Heart
  };

  const Icon = iconMap[type] || Info;
  const style = typeStyles[type];
  
  const priorityColors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-600',
    high: 'bg-orange-100 text-orange-600',
    critical: 'bg-red-100 text-red-600'
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const animationVariant = notification.metadata?.animation === 'bounce' ? variants.bounceIn :
                         notification.metadata?.animation === 'scale' ? variants.scaleIn :
                         notification.metadata?.animation === 'fade' ? variants.fadeIn :
                         variants.slideIn;

  const handleClick = () => {
    if (onClick) onClick(id);
    if (onRead && !readAt) onRead(id);
  };

  return (
    <motion.div
      variants={animationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
      className={`
        glass-strong rounded-xl p-4 border-l-4 max-w-md w-full mb-3 cursor-pointer
        hover:shadow-lg transition-all duration-200 ${style.border} ${style.bg}
        ${!readAt ? 'ring-1 ring-white/20' : ''}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
            ${style.badge} text-white shadow-lg
          `}>
            <Icon size={16} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h4 className="text-white font-medium text-sm leading-tight">{title}</h4>
              {priority && priority !== 'low' && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0 ${priorityColors[priority]}`}>
                  {priority}
                </span>
              )}
            </div>
            
            {message && (
              <p className="text-white/80 text-xs mt-1 leading-relaxed">{message}</p>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2 text-xs text-white/60">
                <Clock size={12} />
                <span>{formatTimeAgo(createdAt)}</span>
                {category && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{category}</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {readAt && (
                  <div className="w-2 h-2 rounded-full bg-green-400" title="Read" />
                )}
                {clickedAt && (
                  <div className="w-2 h-2 rounded-full bg-blue-400" title="Clicked" />
                )}
                {aiInsights?.effectivenessScore && (
                  <div className="flex items-center space-x-1" title={`Effectiveness: ${aiInsights.effectivenessScore.toFixed(1)}/10`}>
                    <Star size={12} className="text-yellow-400" />
                    <span className="text-xs text-white/60">{aiInsights.effectivenessScore.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {showAnalytics && aiInsights && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>AI Score: {aiInsights.effectivenessScore?.toFixed(1)}/10</span>
                  <span className="capitalize">Engagement: {aiInsights.userEngagement}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="text-white/60 hover:text-white transition-colors p-1 rounded"
          title="Remove notification"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
};

// Analytics Dashboard Component
interface AnalyticsDashboardProps {
  analytics: NotificationAnalytics;
  onClose: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics, onClose }) => {
  const [activeView, setActiveView] = useState<'overview' | 'analytics' | 'insights' | 'templates' | 'settings'>('overview');
  
  const pieColors = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#F97316', '#06B6D4', '#EC4899'];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-mild rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Bell size={20} className="text-blue-400" />
            <span className="text-sm text-white/70">Total Sent</span>
          </div>
          <div className="text-2xl font-bold text-white">{analytics.totalSent}</div>
        </div>
        
        <div className="glass-mild rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Eye size={20} className="text-green-400" />
            <span className="text-sm text-white/70">Read Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">{analytics.readRate.toFixed(1)}%</div>
        </div>
        
        <div className="glass-mild rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MousePointer size={20} className="text-purple-400" />
            <span className="text-sm text-white/70">Click Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">{analytics.clickRate.toFixed(1)}%</div>
        </div>
        
        <div className="glass-mild rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock size={20} className="text-yellow-400" />
            <span className="text-sm text-white/70">Avg Delivery</span>
          </div>
          <div className="text-2xl font-bold text-white">{analytics.averageDeliveryTime.toFixed(0)}ms</div>
        </div>
      </div>

      {/* Weekly Trend Chart */}
      <div className="glass-mild rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2" />
          Weekly Trend
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={analytics.weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Line type="monotone" dataKey="sent" stroke="#3B82F6" strokeWidth={2} name="Sent" />
            <Line type="monotone" dataKey="read" stroke="#10B981" strokeWidth={2} name="Read" />
            <Line type="monotone" dataKey="clicked" stroke="#8B5CF6" strokeWidth={2} name="Clicked" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Type Distribution */}
      <div className="glass-mild rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <PieChartIcon size={20} className="mr-2" />
          Notification Type Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={Object.entries(analytics.typeDistribution).map(([type, count]) => ({ 
                name: type, 
                value: count 
              }))}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {Object.entries(analytics.typeDistribution).map((_, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* User Engagement */}
      <div className="glass-mild rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <BarChart3 size={20} className="mr-2" />
          User Engagement Levels
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[
            { name: 'High', value: analytics.userEngagement.high, fill: '#10B981' },
            { name: 'Medium', value: analytics.userEngagement.medium, fill: '#F59E0B' },
            { name: 'Low', value: analytics.userEngagement.low, fill: '#EF4444' }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      {/* AI Insights */}
      <div className="glass-mild rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Brain size={20} className="mr-2" />
          AI-Powered Insights
        </h3>
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">Optimal Send Time</h4>
            <p className="text-white/80">{analytics.aiInsights.optimalSendTime}</p>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-green-400 font-medium mb-2">Best Performing Types</h4>
            <div className="flex flex-wrap gap-2">
              {analytics.aiInsights.bestPerformingTypes.map(type => (
                <span key={type} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                  {type}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <h4 className="text-purple-400 font-medium mb-2">Improvement Suggestions</h4>
            <ul className="space-y-1">
              {analytics.aiInsights.improvementSuggestions.map((suggestion, index) => (
                <li key={index} className="text-white/80 text-sm flex items-start">
                  <span className="mr-2">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Effectiveness by Type */}
      <div className="glass-mild rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Activity size={20} className="mr-2" />
          Effectiveness by Type
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics.effectivenessByType}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="type" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="effectiveness" fill="#3B82F6" name="Effectiveness" />
            <Bar dataKey="engagement" fill="#10B981" name="Engagement" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const views = {
    overview: renderOverview,
    analytics: renderAnalytics,
    insights: renderInsights,
    templates: () => <div className="text-center text-white/60 py-8">Templates management coming soon...</div>,
    settings: () => <div className="text-center text-white/60 py-8">Settings panel coming soon...</div>
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-strong rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <BarChart3 size={24} className="mr-3" />
            Notification Intelligence Dashboard
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex space-x-1 p-6 pb-0">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'analytics', label: 'Analytics', icon: PieChartIcon },
            { id: 'insights', label: 'AI Insights', icon: Brain },
            { id: 'templates', label: 'Templates', icon: Settings },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id as any)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
                ${activeView === id 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {views[activeView]()}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Notification Provider Component
interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    notificationsEnabled: true,
    doNotDisturb: false,
    quietHours: { start: '22:00', end: '08:00' },
    preferredTypes: ['success', 'error', 'warning', 'info', 'achievement', 'milestone', 'reminder', 'encouragement'],
    priorityThreshold: 'medium',
    autoHide: true,
    soundEnabled: true,
    vibrationEnabled: false,
    defaultDuration: 5000,
    position: 'top-right',
    theme: 'dark',
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false
    }
  });
  const [analytics, setAnalytics] = useState<NotificationAnalytics>({
    totalSent: 0,
    totalDelivered: 0,
    totalRead: 0,
    totalClicked: 0,
    averageDeliveryTime: 0,
    averageReadTime: 0,
    averageClickTime: 0,
    deliveryRate: 0,
    readRate: 0,
    clickRate: 0,
    typeDistribution: {
      success: 0, error: 0, warning: 0, info: 0, 
      achievement: 0, milestone: 0, reminder: 0, encouragement: 0
    },
    categoryDistribution: {},
    hourlyDistribution: new Array(24).fill(0),
    dailyDistribution: new Array(7).fill(0),
    weeklyTrend: [],
    userEngagement: { high: 0, medium: 0, low: 0 },
    effectivenessByType: [],
    aiInsights: {
      optimalSendTime: '14:00',
      bestPerformingTypes: ['success', 'achievement', 'info'],
      improvementSuggestions: ['Consider user preferences for better engagement'],
      userPreferenceTrends: []
    }
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [scheduledNotifications, setScheduledNotifications] = useState<{notification: Omit<Notification, 'id' | 'createdAt'>, time: Date}[]>([]);
  
  const aiService = NotificationAIService.getInstance();
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Enhanced add notification with AI optimization
  const addNotification = useCallback(async (notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> => {
    try {
      // AI optimization
      const optimized = await aiService.generateSmartNotification(notificationData);
      
      const notification: Notification = {
        ...optimized,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        priority: optimized.priority || 'medium',
        category: optimized.category || 'general'
      };

      // Check user preferences and quiet hours
      if (!shouldDeliverNotification(notification, preferences)) {
        // Schedule for later if in quiet hours
        const scheduledTime = getNextValidTime(notification, preferences);
        scheduleNotification(notification, scheduledTime);
        return notification;
      }

      setNotifications(prev => {
        // Deduplicate similar notifications
        const deduplicated = prev.filter(n => 
          !(n.title === notification.title && n.type === notification.type)
        );
        return [...deduplicated, notification].slice(-50); // Keep only latest 50
      });

      // Update analytics
      updateAnalytics(notification, 'sent');
      
      // Show appropriate toast
      showToastNotification(notification);
      
      // Auto-hide if configured
      if (preferences.autoHide && !notification.persistent && notification.duration !== 0) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration || preferences.defaultDuration);
        timeoutsRef.current.set(notification.id, timer);
      }

      return notification;
    } catch (error) {
      console.warn('Failed to optimize notification with AI, using fallback:', error);
      
      // Fallback notification
      const notification: Notification = {
        ...notificationData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        priority: 'medium',
        category: 'general'
      };

      setNotifications(prev => [...prev, notification]);
      showToastNotification(notification);
      
      return notification;
    }
  }, [preferences]);

  // Enhanced remove notification
  const removeNotification = useCallback((id: string) => {
    // Clear timeout if exists
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }

    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification) {
        updateAnalytics(notification, 'removed');
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.readAt) {
        const updated = {
          ...notification,
          readAt: new Date()
        };
        
        // Update analytics
        updateAnalytics(updated, 'read');
        
        return prev.map(n => n.id === id ? updated : n);
      }
      return prev;
    });
  }, []);

  // Mark as clicked
  const markAsClicked = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.clickedAt) {
        const updated = {
          ...notification,
          clickedAt: new Date()
        };
        
        // Update analytics
        updateAnalytics(updated, 'clicked');
        
        return prev.map(n => n.id === id ? updated : n);
      }
      return prev;
    });
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
    setNotifications([]);
  }, []);

  // Update analytics
  const updateAnalytics = useCallback((notification: Notification, action: 'sent' | 'read' | 'clicked' | 'removed') => {
    setAnalytics(prev => {
      const updated = { ...prev };
      
      switch (action) {
        case 'sent':
          updated.totalSent++;
          updated.typeDistribution[notification.type]++;
          if (notification.category) {
            updated.categoryDistribution[notification.category] = 
              (updated.categoryDistribution[notification.category] || 0) + 1;
          }
          break;
          
        case 'read':
          updated.totalRead++;
          break;
          
        case 'clicked':
          updated.totalClicked++;
          break;
          
        case 'removed':
          // Handle removal analytics
          break;
      }

      // Calculate rates
      updated.deliveryRate = updated.totalSent > 0 ? (updated.totalDelivered / updated.totalSent) * 100 : 0;
      updated.readRate = updated.totalSent > 0 ? (updated.totalRead / updated.totalSent) * 100 : 0;
      updated.clickRate = updated.totalSent > 0 ? (updated.totalClicked / updated.totalSent) * 100 : 0;

      return updated;
    });
  }, []);

  // Show toast notification
  const showToastNotification = useCallback((notification: Notification) => {
    const toastConfig = {
      duration: notification.persistent ? 0 : (notification.duration || preferences.defaultDuration),
      icon: getToastIcon(notification.type),
      style: {
        background: getToastBackground(notification.type),
        color: '#fff',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
      }
    };

    if (notification.type === 'success') {
      hotToast.success(notification.message || notification.title, toastConfig);
    } else if (notification.type === 'error') {
      hotToast.error(notification.message || notification.title, toastConfig);
    } else if (notification.type === 'warning') {
      hotToast(notification.message || notification.title, toastConfig);
    } else {
      hotToast(notification.message || notification.title, toastConfig);
    }
  }, [preferences.defaultDuration]);

  // Helper functions
  const shouldDeliverNotification = (notification: Notification, prefs: UserPreferences): boolean => {
    if (!prefs.notificationsEnabled) return false;
    if (prefs.doNotDisturb) {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const startTime = parseInt(prefs.quietHours.start.replace(':', ''));
      const endTime = parseInt(prefs.quietHours.end.replace(':', ''));
      
      // Handle overnight quiet hours (e.g., 22:00 to 08:00)
      if (startTime > endTime) {
        return !(currentTime >= startTime || currentTime <= endTime);
      } else {
        return !(currentTime >= startTime && currentTime <= endTime);
      }
    }
    
    if (notification.priority === 'low' && prefs.priorityThreshold === 'high') return false;
    if (!prefs.preferredTypes.includes(notification.type)) return false;
    
    return true;
  };

  const getNextValidTime = (notification: Notification, prefs: UserPreferences): Date => {
    const now = new Date();
    const nextValidTime = new Date(now);
    
    // Set to next 9 AM (typical learning hours)
    nextValidTime.setHours(9, 0, 0, 0);
    if (nextValidTime <= now) {
      nextValidTime.setDate(nextValidTime.getDate() + 1);
    }
    
    return nextValidTime;
  };

  const scheduleNotification = useCallback((notificationData: Omit<Notification, 'id' | 'createdAt'>, scheduleTime: Date) => {
    setScheduledNotifications(prev => [...prev, { notification: notificationData, time: scheduleTime }]);
  }, []);

  const getToastIcon = (type: NotificationType) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      achievement: '🏆',
      milestone: '🎯',
      reminder: '⏰',
      encouragement: '💪'
    };
    return icons[type] || '📢';
  };

  const getToastBackground = (type: NotificationType) => {
    const colors = {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6',
      achievement: '#8B5CF6',
      milestone: '#6366F1',
      reminder: '#F97316',
      encouragement: '#EC4899'
    };
    return colors[type] || '#6B7280';
  };

  // AI-powered features
  const optimizeNotification = useCallback(async (notification: Partial<Notification>): Promise<Notification> => {
    return await aiService.generateSmartNotification(notification);
  }, []);

  const analyzeEffectiveness = useCallback(async () => {
    return await aiService.analyzeNotificationEffectiveness(notifications);
  }, [notifications]);

  const getOptimalTiming = useCallback(async (): Promise<Date> => {
    return await aiService.optimizeNotificationTiming({} as Notification);
  }, []);

  // Export data
  const exportData = useCallback((format: 'pdf' | 'excel' | 'csv' | 'json') => {
    const data = {
      notifications,
      analytics,
      templates,
      preferences,
      exportDate: new Date().toISOString()
    };

    const filename = `notification-intelligence-${new Date().toISOString().split('T')[0]}`;

    switch (format) {
      case 'json':
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        URL.revokeObjectURL(url);
        break;
        
      case 'csv':
        // Simple CSV export for notifications
        const csvHeaders = 'ID,Type,Title,Message,Priority,Category,Created At,Read At,Clicked At\n';
        const csvData = notifications.map(n => 
          `${n.id},${n.type},"${n.title}","${n.message || ''}",${n.priority},${n.category},${n.createdAt.toISOString()},${n.readAt?.toISOString() || ''},${n.clickedAt?.toISOString() || ''}`
        ).join('\n');
        
        const csvBlob = new Blob([csvHeaders + csvData], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvBlob);
        const csvLink = document.createElement('a');
        csvLink.href = csvUrl;
        csvLink.download = `${filename}.csv`;
        csvLink.click();
        URL.revokeObjectURL(csvUrl);
        break;
        
      default:
        hotToast.info(`${format.toUpperCase()} export feature coming soon!`, { 
          icon: '📊',
          duration: 3000 
        });
    }
  }, [notifications, analytics, templates, preferences]);

  // Template management
  const createTemplate = useCallback((templateData: Omit<NotificationTemplate, 'id' | 'createdAt' | 'usage'>) => {
    const template: NotificationTemplate = {
      ...templateData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      usage: { sent: 0, successRate: 0, averageEngagement: 0 }
    };
    
    setTemplates(prev => [...prev, template]);
    hotToast.success('Template created successfully!', { icon: '📝' });
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<NotificationTemplate>) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    hotToast.success('Template updated successfully!', { icon: '✏️' });
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    hotToast.success('Template deleted successfully!', { icon: '🗑️' });
  }, []);

  const useTemplate = useCallback((templateId: string, variables: Record<string, any> = {}) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    let title = template.title;
    let message = template.message;
    
    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      title = title.replace(`{{${key}}}`, String(value));
      message = message.replace(`{{${key}}}`, String(value));
    });
    
    addNotification({
      type: template.type,
      title,
      message,
      category: template.category
    });
    
    // Update template usage
    updateTemplate(templateId, {
      usage: {
        ...template.usage,
        sent: template.usage.sent + 1
      }
    });
  }, [templates, addNotification, updateTemplate]);

  // Batch scheduling
  const scheduleBatch = useCallback((batchNotifications: Omit<Notification, 'id' | 'createdAt'>[], scheduleTime?: Date) => {
    const time = scheduleTime || getOptimalTiming();
    
    batchNotifications.forEach((notification, index) => {
      const individualTime = new Date(time);
      individualTime.setMinutes(individualTime.getMinutes() + (index * 2)); // Stagger by 2 minutes
      scheduleNotification(notification, individualTime);
    });
    
    hotToast.success(`${batchNotifications.length} notifications scheduled!`, { 
      icon: '📅',
      duration: 3000 
    });
  }, [scheduleNotification]);

  // User preferences
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
    hotToast.success('Preferences updated!', { icon: '⚙️' });
  }, []);

  const resetToDefaults = useCallback(() => {
    setPreferences({
      notificationsEnabled: true,
      doNotDisturb: false,
      quietHours: { start: '22:00', end: '08:00' },
      preferredTypes: ['success', 'error', 'warning', 'info', 'achievement', 'milestone', 'reminder', 'encouragement'],
      priorityThreshold: 'medium',
      autoHide: true,
      soundEnabled: true,
      vibrationEnabled: false,
      defaultDuration: 5000,
      position: 'top-right',
      theme: 'dark',
      accessibility: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReader: false
      }
    });
    hotToast.success('Preferences reset to defaults!', { icon: '🔄' });
  }, []);

  // Advanced features
  const deduplicate = useCallback(() => {
    const seen = new Set<string>();
    const deduplicated = notifications.filter(n => {
      const key = `${n.type}-${n.title}-${n.message}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    
    const removed = notifications.length - deduplicated.length;
    setNotifications(deduplicated);
    
    if (removed > 0) {
      hotToast.success(`Removed ${removed} duplicate notifications`, { icon: '🧹' });
    }
  }, [notifications]);

  const groupByCategory = useCallback(() => {
    return notifications.reduce((groups, notification) => {
      const category = notification.category || 'uncategorized';
      if (!groups[category]) groups[category] = [];
      groups[category].push(notification);
      return groups;
    }, {} as { [key: string]: Notification[] });
  }, [notifications]);

  const getNotificationHistory = useCallback((limit: number = 100) => {
    return notifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [notifications]);

  // Initialize with demo data for better user experience
  useEffect(() => {
    const demoNotifications: Omit<Notification, 'id' | 'createdAt'>[] = [
      {
        type: 'achievement',
        title: 'Milestone Reached!',
        message: 'Congratulations! You\'ve completed 5 courses this week.',
        priority: 'high',
        category: 'achievement',
        persistent: true
      },
      {
        type: 'info',
        title: 'New Feature Available',
        message: 'AI-powered study recommendations are now live!',
        priority: 'medium',
        category: 'academic'
      },
      {
        type: 'encouragement',
        title: 'Keep Going!',
        message: 'You\'re doing great! Your learning streak is amazing.',
        priority: 'medium',
        category: 'encouragement'
      }
    ];

    // Add demo notifications with delay
    const timer = setTimeout(() => {
      demoNotifications.forEach((notification, index) => {
        setTimeout(() => {
          addNotification(notification);
        }, index * 1000);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []); // Only run once

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const contextValue: NotificationContextType = {
    notifications,
    templates,
    preferences,
    analytics,
    aiService,
    
    // Core notification management
    addNotification,
    removeNotification,
    clearAll,
    markAsRead,
    markAsClicked,
    
    // Template management
    createTemplate,
    updateTemplate,
    deleteTemplate,
    useTemplate,
    
    // AI-powered features
    optimizeNotification,
    analyzeEffectiveness,
    getOptimalTiming,
    
    // Analytics and insights
    getAnalytics: () => analytics,
    exportData,
    scheduleBatch,
    
    // User preferences
    updatePreferences,
    resetToDefaults,
    
    // Advanced features
    deduplicate,
    groupByCategory,
    getNotificationHistory,
    scheduleNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* React Hot Toast - Main toast notifications */}
      <Toaster
        position={preferences.position}
        toastOptions={{
          duration: preferences.defaultDuration,
          style: {
            background: preferences.theme === 'dark' ? '#1F2937' : '#FFFFFF',
            color: preferences.theme === 'dark' ? '#FFFFFF' : '#1F2937',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            fontSize: preferences.accessibility.largeText ? '16px' : '14px'
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF'
            }
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF'
            }
          }
        }}
      />
      
      {/* Analytics Dashboard Button */}
      <button
        onClick={() => setShowAnalytics(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 z-40"
        title="View Notification Analytics"
      >
        <BarChart3 size={24} />
      </button>
      
      {/* Custom notification container (for persistent notifications) */}
      <div className={`fixed ${preferences.position.includes('right') ? 'top-4 right-4' : 'top-4 left-4'} z-30 space-y-3 max-w-sm`}>
        <AnimatePresence>
          {notifications
            .filter(n => n.persistent && shouldDeliverNotification(n, preferences))
            .slice(0, 5) // Show max 5 persistent notifications
            .map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRemove={removeNotification}
                onRead={markAsRead}
                onClick={markAsClicked}
                showAnalytics={true}
              />
            ))}
        </AnimatePresence>
      </div>
      
      {/* Analytics Dashboard Modal */}
      <AnimatePresence>
        {showAnalytics && (
          <AnalyticsDashboard 
            analytics={analytics} 
            onClose={() => setShowAnalytics(false)} 
          />
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Convenience hooks for different notification types
export const useSuccessNotification = () => {
  const { addNotification } = useNotifications();
  
  return useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  }, [addNotification]);
};

export const useErrorNotification = () => {
  const { addNotification } = useNotifications();
  
  return useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'error',
      title,
      message,
      persistent: true,
      priority: 'high',
      ...options,
    });
  }, [addNotification]);
};

export const useWarningNotification = () => {
  const { addNotification } = useNotifications();
  
  return useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'warning',
      title,
      message,
      priority: 'medium',
      ...options,
    });
  }, [addNotification]);
};

export const useInfoNotification = () => {
  const { addNotification } = useNotifications();
  
  return useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  }, [addNotification]);
};

export const useAchievementNotification = () => {
  const { addNotification } = useNotifications();
  
  return useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'achievement',
      title,
      message,
      priority: 'high',
      category: 'achievement',
      ...options,
    });
  }, [addNotification]);
};

export const useMilestoneNotification = () => {
  const { addNotification } = useNotifications();
  
  return useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'milestone',
      title,
      message,
      priority: 'high',
      category: 'achievement',
      ...options,
    });
  }, [addNotification]);
};

export const useReminderNotification = () => {
  const { addNotification } = useNotifications();
  
  return useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'reminder',
      title,
      message,
      priority: 'medium',
      category: 'academic',
      ...options,
    });
  }, [addNotification]);
};

export const useEncouragementNotification = () => {
  const { addNotification } = useNotifications();
  
  return useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'encouragement',
      title,
      message,
      priority: 'medium',
      category: 'encouragement',
      ...options,
    });
  }, [addNotification]);
};

// Enhanced hook with AI optimization
export const useSmartNotification = () => {
  const { addNotification, optimizeNotification } = useNotifications();
  
  return useCallback(async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const optimized = await optimizeNotification(notification);
    return addNotification(optimized);
  }, [addNotification, optimizeNotification]);
};

// Analytics hook
export const useNotificationAnalytics = () => {
  const { analytics, getAnalytics, analyzeEffectiveness } = useNotifications();
  
  return {
    analytics,
    getAnalytics,
    analyzeEffectiveness
  };
};

// Template management hook
export const useNotificationTemplates = () => {
  const { templates, createTemplate, updateTemplate, deleteTemplate, useTemplate } = useNotifications();
  
  return {
    templates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    useTemplate
  };
};