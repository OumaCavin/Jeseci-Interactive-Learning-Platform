// JAC Learning Platform - Enhanced ProgressTrackerChat Component
// Comprehensive analytics and progress tracking interface
// Enhanced from 80 lines to 1,200+ lines with rich analytical features

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Target,
  Clock,
  Zap,
  Brain,
  Calendar,
  Users,
  Award,
  CheckCircle,
  Circle,
  Filter,
  Download,
  Share,
  Search,
  RefreshCw,
  Eye,
  Settings,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertTriangle,
  Info,
  Star,
  BookOpen,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  PieChart,
  LineChart,
  AreaChart,
  BarChart,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  WifiOff,
  Lightbulb,
  MessageSquare,
  Bell,
  Bookmark,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus as MinusIcon,
  Edit,
  Save,
  Trash2
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import BaseAgentChat from './BaseAgentChat';
import { gamificationService } from '../../services/gamificationService';

// Enhanced interfaces for analytics system
interface ProgressData {
  id: string;
  date: Date;
  subject: string;
  skill: string;
  activity: string;
  duration: number; // in minutes
  intensity: number; // 1-10 scale
  comprehension: number; // 1-10 scale
  retention: number; // 1-10 scale
  engagement: number; // 1-10 scale
  efficiency: number; // 1-10 scale
  score?: number;
  mistakes: number;
  attempts: number;
  successRate: number;
  learningVelocity: number; // units per hour
  contextSwitches: number;
  focusLevel: number; // 1-10 scale
  energyLevel: number; // 1-10 scale
  environmentScore: number; // 1-10 scale
}

interface LearningPattern {
  id: string;
  name: string;
  description: string;
  type: 'temporal' | 'behavioral' | 'cognitive' | 'environmental';
  confidence: number; // 0-100%
  impact: number; // 1-10 scale
  recommendations: string[];
  detectedAt: Date;
  lastConfirmed: Date;
  trend: 'improving' | 'stable' | 'declining';
  frequency: number; // occurrences per week
  strength: number; // 1-10 scale
}

interface PerformanceMetrics {
  overallScore: number;
  totalLearningTime: number;
  activeStreak: number;
  learningVelocity: number;
  retentionRate: number;
  completionRate: number;
  engagementScore: number;
  efficiencyRating: number;
  consistencyScore: number;
  masteryIndex: number;
  improvementRate: number;
  productivityPeak: string; // time of day
  focusDuration: number;
  averageSessionLength: number;
  skillProgression: {
    [skill: string]: {
      currentLevel: number;
      targetLevel: number;
      progressRate: number;
      timeToMastery: number;
      priority: 'low' | 'medium' | 'high';
    };
  };
}

interface PredictiveInsights {
  learningOutcome: {
    probability: number;
    timeframe: string;
    confidence: number;
    factors: string[];
  };
  skillAcquisition: {
    skill: string;
    estimatedTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
    successProbability: number;
  }[];
  optimalStudySchedule: {
    day: string;
    timeSlot: string;
    recommended: boolean;
    efficiency: number;
  }[];
  riskFactors: {
    factor: string;
    severity: 'low' | 'medium' | 'high';
    impact: number;
    mitigation: string[];
  }[];
  recommendations: {
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    action: string;
    expectedImpact: string;
    effort: 'low' | 'medium' | 'high';
  }[];
}

interface KPI {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: string;
  status: 'excellent' | 'good' | 'needs_attention' | 'critical';
}

interface BenchmarkComparison {
  metric: string;
  userValue: number;
  peerAverage: number;
  percentile: number;
  rank: number;
  totalUsers: number;
  trend: 'improving' | 'stable' | 'declining';
  peerBest: number;
  peerWorst: number;
}

interface ProgressTrackerChatProps {
  sessionId?: string;
  onMessageSent?: (message: string) => void;
  onResponseReceived?: (response: string) => void;
}

const ProgressTrackerChat: React.FC<ProgressTrackerChatProps> = ({
  sessionId,
  onMessageSent,
  onResponseReceived
}) => {
  const [activeView, setActiveView] = useState<'chat' | 'dashboard' | 'analytics' | 'patterns' | 'performance' | 'predictions'>('chat');
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [learningPatterns, setLearningPatterns] = useState<LearningPattern[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsights | null>(null);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [benchmarks, setBenchmarks] = useState<BenchmarkComparison[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeRange, selectedSubject]);

  // Auto-refresh setup
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadAnalyticsData();
      }, 60000); // Refresh every minute
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls - replace with actual data fetching
      const mockProgressData: ProgressData[] = [
        {
          id: '1',
          date: new Date('2025-12-02'),
          subject: 'React Development',
          skill: 'Component Architecture',
          activity: 'Project Building',
          duration: 120,
          intensity: 8,
          comprehension: 9,
          retention: 7,
          engagement: 8,
          efficiency: 8,
          score: 85,
          mistakes: 3,
          attempts: 12,
          successRate: 92,
          learningVelocity: 15,
          contextSwitches: 2,
          focusLevel: 8,
          energyLevel: 7,
          environmentScore: 8
        },
        {
          id: '2',
          date: new Date('2025-12-01'),
          subject: 'JavaScript',
          skill: 'Async Programming',
          activity: 'Code Practice',
          duration: 90,
          intensity: 7,
          comprehension: 8,
          retention: 8,
          engagement: 7,
          efficiency: 7,
          score: 78,
          mistakes: 5,
          attempts: 15,
          successRate: 85,
          learningVelocity: 12,
          contextSwitches: 1,
          focusLevel: 9,
          energyLevel: 8,
          environmentScore: 9
        },
        {
          id: '3',
          date: new Date('2025-11-30'),
          subject: 'Python',
          skill: 'Data Analysis',
          activity: 'Tutorial Watching',
          duration: 60,
          intensity: 6,
          comprehension: 7,
          retention: 9,
          engagement: 6,
          efficiency: 9,
          score: 88,
          mistakes: 2,
          attempts: 8,
          successRate: 95,
          learningVelocity: 18,
          contextSwitches: 3,
          focusLevel: 7,
          energyLevel: 6,
          environmentScore: 7
        }
      ];

      const mockLearningPatterns: LearningPattern[] = [
        {
          id: '1',
          name: 'Peak Performance Window',
          description: 'You perform best between 2-4 PM with 85% higher efficiency',
          type: 'temporal',
          confidence: 85,
          impact: 8,
          recommendations: ['Schedule complex tasks between 2-4 PM', 'Avoid high-focus activities after 6 PM'],
          detectedAt: new Date('2025-11-15'),
          lastConfirmed: new Date('2025-12-01'),
          trend: 'improving',
          frequency: 4.2,
          strength: 8
        },
        {
          id: '2',
          name: 'Context Switching Cost',
          description: 'Each context switch reduces efficiency by 15% for 10 minutes',
          type: 'behavioral',
          confidence: 78,
          impact: 6,
          recommendations: ['Group similar tasks together', 'Use focus mode for deep work'],
          detectedAt: new Date('2025-11-20'),
          lastConfirmed: new Date('2025-11-30'),
          trend: 'stable',
          frequency: 6.1,
          strength: 7
        },
        {
          id: '3',
          name: 'Weekend Learning Spike',
          description: 'Retention rates increase 25% on weekends due to less stress',
          type: 'environmental',
          confidence: 92,
          impact: 9,
          recommendations: ['Schedule review sessions on weekends', 'Use weekends for consolidation'],
          detectedAt: new Date('2025-11-10'),
          lastConfirmed: new Date('2025-12-02'),
          trend: 'improving',
          frequency: 2.8,
          strength: 9
        }
      ];

      const mockPerformanceMetrics: PerformanceMetrics = {
        overallScore: 82,
        totalLearningTime: 2400,
        activeStreak: 18,
        learningVelocity: 14.5,
        retentionRate: 87,
        completionRate: 94,
        engagementScore: 79,
        efficiencyRating: 85,
        consistencyScore: 76,
        masteryIndex: 68,
        improvementRate: 12,
        productivityPeak: '14:00',
        focusDuration: 45,
        averageSessionLength: 78,
        skillProgression: {
          'React Components': {
            currentLevel: 7,
            targetLevel: 9,
            progressRate: 15,
            timeToMastery: 14,
            priority: 'high'
          },
          'JavaScript Async': {
            currentLevel: 6,
            targetLevel: 8,
            progressRate: 8,
            timeToMastery: 25,
            priority: 'medium'
          },
          'Python Data Analysis': {
            currentLevel: 8,
            targetLevel: 10,
            progressRate: 12,
            timeToMastery: 17,
            priority: 'low'
          }
        }
      };

      const mockPredictiveInsights: PredictiveInsights = {
        learningOutcome: {
          probability: 87,
          timeframe: '3 months',
          confidence: 78,
          factors: ['Consistent daily practice', 'Strong retention patterns', 'Optimal study schedule']
        },
        skillAcquisition: [
          {
            skill: 'React Advanced Patterns',
            estimatedTime: 45,
            difficulty: 'hard',
            successProbability: 82
          },
          {
            skill: 'JavaScript ES2023',
            estimatedTime: 28,
            difficulty: 'medium',
            successProbability: 91
          }
        ],
        optimalStudySchedule: [
          { day: 'Monday', timeSlot: '14:00-16:00', recommended: true, efficiency: 89 },
          { day: 'Tuesday', timeSlot: '14:00-16:00', recommended: true, efficiency: 87 },
          { day: 'Wednesday', timeSlot: '15:00-17:00', recommended: true, efficiency: 91 },
          { day: 'Thursday', timeSlot: '14:00-16:00', recommended: true, efficiency: 85 },
          { day: 'Friday', timeSlot: '10:00-12:00', recommended: false, efficiency: 65 }
        ],
        riskFactors: [
          {
            factor: 'Context Switching Frequency',
            severity: 'medium',
            impact: 6,
            mitigation: ['Use focus mode', 'Block distractions', 'Batch similar tasks']
          }
        ],
        recommendations: [
          {
            priority: 'high',
            category: 'Schedule Optimization',
            action: 'Move complex tasks to 2-4 PM window',
            expectedImpact: '+15% efficiency improvement',
            effort: 'low'
          },
          {
            priority: 'critical',
            category: 'Focus Management',
            action: 'Implement 45-minute focus blocks',
            expectedImpact: '+20% retention improvement',
            effort: 'medium'
          }
        ]
      };

      const mockKpis: KPI[] = [
        {
          name: 'Learning Velocity',
          value: 14.5,
          target: 15,
          unit: 'skills/week',
          trend: 'up',
          change: 8.2,
          frequency: 'weekly',
          category: 'Productivity',
          status: 'good'
        },
        {
          name: 'Retention Rate',
          value: 87,
          target: 90,
          unit: '%',
          trend: 'up',
          change: 3.1,
          frequency: 'weekly',
          category: 'Effectiveness',
          status: 'good'
        },
        {
          name: 'Daily Consistency',
          value: 78,
          target: 85,
          unit: '%',
          trend: 'stable',
          change: -1.2,
          frequency: 'daily',
          category: 'Habits',
          status: 'needs_attention'
        },
        {
          name: 'Focus Duration',
          value: 45,
          target: 50,
          unit: 'minutes',
          trend: 'up',
          change: 12.5,
          frequency: 'daily',
          category: 'Performance',
          status: 'good'
        }
      ];

      const mockBenchmarks: BenchmarkComparison[] = [
        {
          metric: 'Overall Learning Score',
          userValue: 82,
          peerAverage: 76,
          percentile: 73,
          rank: 234,
          totalUsers: 852,
          trend: 'improving',
          peerBest: 95,
          peerWorst: 45
        },
        {
          metric: 'Learning Velocity',
          userValue: 14.5,
          peerAverage: 12.8,
          percentile: 78,
          rank: 187,
          totalUsers: 852,
          trend: 'improving',
          peerBest: 18.2,
          peerWorst: 8.1
        }
      ];

      setProgressData(mockProgressData);
      setLearningPatterns(mockLearningPatterns);
      setPerformanceMetrics(mockPerformanceMetrics);
      setPredictiveInsights(mockPredictiveInsights);
      setKpis(mockKpis);
      setBenchmarks(mockBenchmarks);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageSent = async (message: string) => {
    try {
      await gamificationService.awardPoints(10, 'progress_tracking', {
        message_type: 'chat_interaction',
        agent_type: 'progress_tracker'
      });
    } catch (error) {
      console.warn('Failed to trigger gamification:', error);
    }
    
    if (onMessageSent) {
      onMessageSent(message);
    }
  };

  const handleResponseReceived = (response: string) => {
    if (onResponseReceived) {
      onResponseReceived(response);
    }
  };

  const getTrendIcon = (trend: KPI['trend']) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: KPI['status']) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'needs_attention': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPatternIcon = (type: LearningPattern['type']) => {
    switch (type) {
      case 'temporal': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'behavioral': return <Activity className="w-5 h-5 text-green-500" />;
      case 'cognitive': return <Brain className="w-5 h-5 text-purple-500" />;
      case 'environmental': return <MapPin className="w-5 h-5 text-orange-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6 p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{kpi.name}</h3>
              {getTrendIcon(kpi.trend)}
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-sm text-gray-500">{kpi.unit}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">Target: {kpi.target}</span>
              </div>
              <Badge className={`${getStatusColor(kpi.status)} text-white text-xs`}>
                {kpi.status.replace('_', ' ')}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Overview */}
      {performanceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Overall Score</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{performanceMetrics.overallScore}/100</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${performanceMetrics.overallScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Learning Velocity</span>
                <span className="font-bold">{performanceMetrics.learningVelocity}/20</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Streak</span>
                <span className="font-bold">{performanceMetrics.activeStreak} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Retention Rate</span>
                <span className="font-bold">{performanceMetrics.retentionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-bold">{performanceMetrics.completionRate}%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Skill Progression</h3>
            <div className="space-y-4">
              {Object.entries(performanceMetrics.skillProgression).map(([skill, data]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill}</span>
                    <span className="text-sm text-gray-500">
                      {data.currentLevel}/{data.targetLevel}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        data.priority === 'high' ? 'bg-red-500' :
                        data.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(data.currentLevel / data.targetLevel) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{data.progressRate}% this week</span>
                    <span>{data.timeToMastery} days to mastery</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Benchmark Comparison */}
      {benchmarks.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Peer Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benchmarks.map((benchmark, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{benchmark.metric}</h4>
                  <Badge variant="default">
                    {benchmark.percentile}th percentile
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Your Score</span>
                    <span className="font-bold text-blue-600">{benchmark.userValue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Peer Average</span>
                    <span className="font-medium">{benchmark.peerAverage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rank</span>
                    <span className="font-medium">#{benchmark.rank} of {benchmark.totalUsers}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Range:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-1 rounded-full"
                        style={{ 
                          width: `${((benchmark.userValue - benchmark.peerWorst) / (benchmark.peerBest - benchmark.peerWorst)) * 100}%`,
                          marginLeft: `${((benchmark.peerAverage - benchmark.peerWorst) / (benchmark.peerBest - benchmark.peerWorst)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6 p-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Detailed Analytics</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <Button
            variant="default"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-300' : ''}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
        </div>
      </div>

      {/* Progress Timeline */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Learning Progress Timeline</h3>
        <div className="space-y-4">
          {progressData.map((data) => (
            <div key={data.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium">{data.subject}</h4>
                  <Badge variant="default">{data.skill}</Badge>
                </div>
                <span className="text-sm text-gray-500">
                  {data.date.toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <p className="font-medium">{data.duration} min</p>
                </div>
                <div>
                  <span className="text-gray-600">Score:</span>
                  <p className="font-medium">{data.score}%</p>
                </div>
                <div>
                  <span className="text-gray-600">Retention:</span>
                  <p className="font-medium">{data.retention}/10</p>
                </div>
                <div>
                  <span className="text-gray-600">Efficiency:</span>
                  <p className="font-medium">{data.efficiency}/10</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Metrics */}
      {performanceMetrics && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Timer className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{Math.round(performanceMetrics.totalLearningTime / 60)}h</p>
              <p className="text-sm text-gray-600">Total Learning Time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold">{performanceMetrics.focusDuration}m</p>
              <p className="text-sm text-gray-600">Avg Focus Duration</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold">{performanceMetrics.masteryIndex}%</p>
              <p className="text-sm text-gray-600">Mastery Index</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderPatterns = () => (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Learning Patterns</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningPatterns.map((pattern) => (
          <Card key={pattern.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getPatternIcon(pattern.type)}
                <div>
                  <h3 className="font-semibold">{pattern.name}</h3>
                  <Badge variant="default" className="capitalize">
                    {pattern.type}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  {pattern.trend === 'improving' && <ArrowUp className="w-4 h-4 text-green-500" />}
                  {pattern.trend === 'stable' && <Minus className="w-4 h-4 text-yellow-500" />}
                  {pattern.trend === 'declining' && <ArrowDown className="w-4 h-4 text-red-500" />}
                  <span className="text-sm font-medium">{pattern.confidence}% confident</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{pattern.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-600">Impact Score:</span>
                <p className="font-medium">{pattern.impact}/10</p>
              </div>
              <div>
                <span className="text-gray-600">Frequency:</span>
                <p className="font-medium">{pattern.frequency} times/week</p>
              </div>
              <div>
                <span className="text-gray-600">Strength:</span>
                <p className="font-medium">{pattern.strength}/10</p>
              </div>
              <div>
                <span className="text-gray-600">Last Confirmed:</span>
                <p className="font-medium">{pattern.lastConfirmed.toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-2">Recommendations:</h4>
              <ul className="space-y-1">
                {pattern.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Performance Insights</h2>
      
      {performanceMetrics && (
        <>
          {/* Key Performance Indicators */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Engagement</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Engagement Score</span>
                    <span className="font-medium">{performanceMetrics.engagementScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${performanceMetrics.engagementScore}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Efficiency Rating</span>
                    <span className="font-medium">{performanceMetrics.efficiencyRating}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${performanceMetrics.efficiencyRating}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Consistency</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Consistency Score</span>
                    <span className="font-medium">{performanceMetrics.consistencyScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                      style={{ width: `${performanceMetrics.consistencyScore}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Improvement Rate</span>
                    <span className="font-medium">+{performanceMetrics.improvementRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-600 h-2 rounded-full"
                      style={{ width: `${performanceMetrics.improvementRate * 5}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Productivity</h4>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{performanceMetrics.productivityPeak}</p>
                  <p className="text-sm text-gray-600">Peak Performance Time</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{performanceMetrics.averageSessionLength}m</p>
                  <p className="text-sm text-gray-600">Avg Session Length</p>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );

  const renderPredictions = () => (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">AI-Powered Predictions</h2>
      
      {predictiveInsights && (
        <>
          {/* Learning Outcome Prediction */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Learning Outcome Prediction</h3>
              <Badge className="bg-green-100 text-green-800 border-green-300">
                {predictiveInsights.learningOutcome.confidence}% Confidence
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <p className="text-2xl font-bold text-green-600">{predictiveInsights.learningOutcome.probability}%</p>
                </div>
                <p className="font-medium">Success Probability</p>
                <p className="text-sm text-gray-600">Next {predictiveInsights.learningOutcome.timeframe}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-medium mb-2">Key Success Factors:</h4>
                <ul className="space-y-1">
                  {predictiveInsights.learningOutcome.factors.map((factor, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Skill Acquisition Predictions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Skill Acquisition Timeline</h3>
            <div className="space-y-4">
              {predictiveInsights.skillAcquisition.map((skill, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{skill.skill}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="default"
                        className={
                          skill.difficulty === 'easy' ? 'border-green-300 text-green-700' :
                          skill.difficulty === 'medium' ? 'border-yellow-300 text-yellow-700' :
                          'border-red-300 text-red-700'
                        }
                      >
                        {skill.difficulty}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {skill.successProbability}% success rate
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Estimated Time:</span>
                      <p className="font-medium">{skill.estimatedTime} days</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Difficulty:</span>
                      <p className="font-medium capitalize">{skill.difficulty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Optimal Study Schedule */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Optimal Study Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predictiveInsights.optimalStudySchedule.map((schedule, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border-2 ${
                    schedule.recommended 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{schedule.day}</h4>
                    {schedule.recommended && (
                      <Badge className="bg-green-500 text-white">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{schedule.timeSlot}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Efficiency:</span>
                    <span className="font-medium">{schedule.efficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className={`h-1 rounded-full ${
                        schedule.efficiency >= 85 ? 'bg-green-500' :
                        schedule.efficiency >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${schedule.efficiency}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Risk Factors */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Risk Factors & Mitigation</h3>
            <div className="space-y-4">
              {predictiveInsights.riskFactors.map((risk, index) => (
                <div key={index} className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{risk.factor}</h4>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <Badge 
                        variant="default"
                        className={
                          risk.severity === 'high' ? 'border-red-300 text-red-700' :
                          risk.severity === 'medium' ? 'border-yellow-300 text-yellow-700' :
                          'border-green-300 text-green-700'
                        }
                      >
                        {risk.severity} risk
                      </Badge>
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">Impact Score: </span>
                    <span className="font-medium">{risk.impact}/10</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-1">Mitigation Strategies:</h5>
                    <ul className="space-y-1">
                      {risk.mitigation.map((strategy, stratIndex) => (
                        <li key={stratIndex} className="text-sm text-gray-600 flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Recommendations */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold">AI Recommendations</h3>
            </div>
            <div className="space-y-4">
              {predictiveInsights.recommendations.map((rec, index) => (
                <div key={index} className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{rec.action}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={
                          rec.priority === 'critical' ? 'bg-red-500 text-white' :
                          rec.priority === 'high' ? 'bg-orange-500 text-white' :
                          rec.priority === 'medium' ? 'bg-yellow-500 text-white' :
                          'bg-green-500 text-white'
                        }
                      >
                        {rec.priority}
                      </Badge>
                      <Badge variant="default">{rec.category}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rec.expectedImpact}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Effort Required:</span>
                    <span className="font-medium capitalize">{rec.effort}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );

  const renderChat = () => (
    <div className="h-full">
      <BaseAgentChat
        agentId="progress_tracker"
        agentType="progress_tracker"
        agentName="Progress Tracker"
        agentIcon="📊"
        agentDescription="I'll track your learning journey, analyze your progress patterns, and provide insights to optimize your learning experience."
        agentCapabilities={[
          'Progress Analytics',
          'Learning Pattern Analysis',
          'Time Efficiency Tracking',
          'Engagement Level Monitoring',
          'Skill Development Assessment',
          'Performance Trends',
          'Predictive Analytics',
          'Learning Velocity Optimization',
          'Peer Benchmarking',
          'AI-Powered Recommendations'
        ]}
        agentColor="from-purple-500 to-pink-600"
        sessionId={sessionId}
        onMessageSent={handleMessageSent}
        onResponseReceived={handleResponseReceived}
      />
    </div>
  );

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'patterns', label: 'Patterns', icon: Activity },
    { id: 'performance', label: 'Performance', icon: Target },
    { id: 'predictions', label: 'Predictions', icon: Brain }
  ] as const;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      {/* Enhanced Header */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white">
                📊
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Progress Tracker
                </h1>
                <p className="text-sm text-gray-600">Advanced Learning Analytics</p>
              </div>
            </div>
          </div>
          
          {performanceMetrics && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  Score: {performanceMetrics.overallScore}/100
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {performanceMetrics.learningVelocity}/20 velocity
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto px-4 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeView === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full overflow-y-auto"
          >
            {activeView === 'chat' && renderChat()}
            {activeView === 'dashboard' && renderDashboard()}
            {activeView === 'analytics' && renderAnalytics()}
            {activeView === 'patterns' && renderPatterns()}
            {activeView === 'performance' && renderPerformance()}
            {activeView === 'predictions' && renderPredictions()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProgressTrackerChat;