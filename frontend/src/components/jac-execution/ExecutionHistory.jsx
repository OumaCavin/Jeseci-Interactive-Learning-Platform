import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader,
  Search,
  Filter,
  Trash2,
  Play,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Brain,
  Users,
  TrendingUp,
  Target,
  Award,
  Star,
  Download,
  Upload,
  Share2,
  Bookmark,
  Eye,
  Code,
  Terminal,
  Bug,
  Zap,
  Timer,
  Activity,
  LineChart,
  PieChart,
  AreaChart,
  BarChart,
  Scatter,
  Database,
  Settings,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  List,
  Map,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  Shield,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserX,
  UserPlus,
  Crown,
  Gem,
  Trophy,
  Medal,
  Gift,
  Sparkles,
  Shuffle,
  Timer,
  Gauge,
  Sliders,
  Home,
  Folder,
  FolderOpen,
  FolderPlus,
  Archive,
  Package,
  Server,
  Cloud,
  HardDrive,
  Cpu,
  Keyboard,
  Mouse,
  Touchpad,
  Headphones,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneCall,
  PhoneOff,
  Mail,
  MessageCircle,
  Send,
  Inbox,
  ArchiveRestore,
  Edit,
  Eraser,
  Highlighter,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  ListUnordered,
  Quote,
  Link,
  Unlink,
  Image,
  FileText,
  File,
  PlusCircle,
  MinusCircle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronsUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  MoreHorizontal,
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  Move,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Focus,
  Crosshair,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Pentagon,
  Octagon,
  Diamond,
  Heart,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  Laugh,
  Angry,
  Surprised,
  Worried,
  Confused,
  Sleepy,
  BookOpen,
  Lightbulb,
  Brain,
  MessageSquare,
  PlayCircle,
  PauseCircle,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Mute,
  Repeat,
  Repeat1,
  Shuffle,
  Save,
  ArchiveRestore2,
  CheckCircle2,
  XCircle2,
  AlertCircle2,
  Info,
  AlertTriangle,
  CheckCircle,
  CircleCheckBig,
  X,
  Trash2,
  Archive,
  ArchiveRestore,
  RotateCcw,
  RotateCw,
  MoreHorizontal,
  MoreVertical,
  ChevronsUpDown,
  ChevronsLeftRight,
  ArrowUpDown,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move,
  Minimize2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  MousePointer,
  MousePointer2,
  Keyboard,
  Smartphone,
  Tablet,
  Monitor,
  MonitorSpeaker,
  Projector,
  Camera,
  CameraOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Volume1,
  Settings,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Power,
  Battery,
  BatteryCharging,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothConnected,
  BluetoothSearching,
  Signal,
  SignalLow,
  SignalMedium,
  SignalHigh,
  Satellite,
  Radio,
  Headphones,
  HeadphonesOff,
  Speaker,
  MicIcon
} from 'lucide-react';

// Configuration Constants
const API_BASE = '/api/jac-execution';
const WS_BASE = 'ws://localhost:8000';

// Achievement System for Execution History
const EXECUTION_ACHIEVEMENTS = {
  first_execution: { 
    id: 'first_execution', 
    name: 'First Steps', 
    icon: '🎯', 
    description: 'Complete your first code execution' 
  },
  execution_streak: { 
    id: 'execution_streak', 
    name: 'Consistent Executor', 
    icon: '🔥', 
    description: 'Execute code for 7 days straight' 
  },
  performance_master: { 
    id: 'performance_master', 
    name: 'Performance Master', 
    icon: '⚡', 
    description: 'Achieve 95%+ success rate for 50 executions' 
  },
  speed_demon: { 
    id: 'speed_demon', 
    name: 'Speed Demon', 
    icon: '🚀', 
    description: 'Complete 25 fast executions (<2 seconds)' 
  },
  bug_hunter: { 
    id: 'bug_hunter', 
    name: 'Bug Hunter', 
    icon: '🐛', 
    description: 'Successfully debug 20 failed executions' 
  },
  language_explorer: { 
    id: 'language_explorer', 
    name: 'Language Explorer', 
    icon: '🌍', 
    description: 'Execute code in 5+ different languages' 
  },
  collaboration_master: { 
    id: 'collaboration_master', 
    name: 'Collaboration Master', 
    icon: '👥', 
    description: 'Share and collaborate on 15+ execution sessions' 
  },
  advanced_user: { 
    id: 'advanced_user', 
    name: 'Advanced User', 
    icon: '🏆', 
    description: 'Complete 100+ executions with 90%+ success rate' 
  }
};

// Hook for localStorage operations
const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue];
};

// Hook for WebSocket connection
const useWebSocket = (url, onMessage, onError, onConnect) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  const connect = useCallback(() => {
    try {
      wsRef.current = new WebSocket(url);
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        onConnect && onConnect();
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage && onMessage(data);
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };
      
      wsRef.current.onerror = (error) => {
        onError && onError(error);
      };
      
      wsRef.current.onclose = () => {
        setIsConnected(false);
        // Attempt reconnection after 3 seconds
        setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.CLOSED) {
            connect();
          }
        }, 3000);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [url, onMessage, onError, onConnect]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const send = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return { isConnected, send, connect, disconnect };
};

// AI Analytics Panel Component
const AIAnalyticsPanel = ({ 
  isOpen, 
  onClose, 
  executions,
  onAIAction,
  insights = []
}) => {
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  const generateInsights = useCallback(async () => {
    if (!executions.length) return;
    
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/ai-execution-insights/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          executions: executions.slice(0, 50), // Analyze last 50 executions
          analysis_type: 'comprehensive'
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setAiRecommendations(result.recommendations || []);
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [executions]);

  useEffect(() => {
    if (isOpen && executions.length > 0) {
      generateInsights();
    }
  }, [isOpen, executions, generateInsights]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 400, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-l border-gray-200 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">AI Analytics</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-100">
        <div className="space-y-2">
          <button
            onClick={generateInsights}
            disabled={isAnalyzing}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isAnalyzing ? 'Analyzing...' : 'Generate Insights'}</span>
          </button>
          
          <button
            onClick={() => onAIAction('optimize_performance')}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Optimize Performance</span>
          </button>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="flex-1 overflow-y-auto p-4">
        {aiRecommendations.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">AI Recommendations</h4>
            {aiRecommendations.map((recommendation, index) => (
              <div
                key={index}
                className="p-3 border border-purple-200 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => setSelectedInsight(recommendation)}
              >
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-purple-900">
                      {recommendation.title}
                    </div>
                    <div className="text-xs text-purple-700 mt-1">
                      {recommendation.description}
                    </div>
                    {recommendation.impact && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs text-purple-600">Impact:</span>
                        <div className={`w-2 h-2 rounded-full ${
                          recommendation.impact === 'high' ? 'bg-red-500' :
                          recommendation.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Click "Generate Insights" to get AI-powered analysis of your execution patterns</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Collaboration Panel Component
const CollaborationPanel = ({ 
  isOpen, 
  onClose, 
  sessionId, 
  isConnected,
  collaborators,
  onInvite,
  onShare,
  sharedExecutions = []
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    
    try {
      await onInvite(inviteEmail);
      setInviteEmail('');
      setShowInviteModal(false);
    } catch (error) {
      console.error('Error sending invite:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-l border-gray-200 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Collaboration</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Connection Status */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        {sessionId && (
          <div className="mt-1 text-xs text-gray-500">
            Session: {sessionId.slice(0, 8)}...
          </div>
        )}
      </div>

      {/* Collaborators */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Active Users ({collaborators.length})</h4>
          <button
            onClick={() => setShowInviteModal(true)}
            className="p-1 text-green-600 hover:text-green-700"
            title="Invite User"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {collaborator.name.charAt(0).toUpperCase()}
                </div>
                {collaborator.isActive && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {collaborator.name}
                </div>
                <div className="text-xs text-gray-500">
                  {collaborator.isActive ? 'Active' : 'Away'}
                </div>
              </div>
              {collaborator.role && (
                <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  {collaborator.role}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Shared Executions */}
        {sharedExecutions.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Shared Executions</h4>
            <div className="space-y-2">
              {sharedExecutions.slice(0, 5).map((execution) => (
                <div
                  key={execution.id}
                  className="p-2 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="text-xs font-medium text-blue-900">
                    {execution.title || `Execution ${execution.id}`}
                  </div>
                  <div className="text-xs text-blue-700">
                    by {execution.shared_by} • {new Date(execution.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <button
            onClick={onShare}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Execution</span>
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
          >
            <Mail className="w-4 h-4" />
            <span>Invite by Email</span>
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Collaborator</h3>
              <div className="space-y-4">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInvite}
                    disabled={!inviteEmail.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Advanced Analytics Panel Component
const AdvancedAnalyticsPanel = ({ 
  isOpen, 
  onClose, 
  executions,
  achievements,
  userStats
}) => {
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('7d');

  const getSuccessRateData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayExecutions = executions.filter(exec => 
        exec.created_at?.startsWith(date) && exec.status === 'completed'
      ).length;
      const totalDayExecutions = executions.filter(exec => 
        exec.created_at?.startsWith(date)
      ).length;
      
      return {
        date,
        successRate: totalDayExecutions > 0 ? (dayExecutions / totalDayExecutions) * 100 : 0,
        total: totalDayExecutions
      };
    });
  };

  const getPerformanceData = () => {
    return executions
      .filter(exec => exec.execution_time && exec.status === 'completed')
      .slice(-20)
      .map((exec, index) => ({
        execution: index + 1,
        time: exec.execution_time,
        language: exec.language
      }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 450, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-l border-gray-200 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Advanced Analytics</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
          </select>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex space-x-2">
          {['overview', 'performance', 'trends', 'languages'].map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1 text-sm rounded-lg capitalize ${
                selectedMetric === metric
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {metric}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedMetric === 'overview' && (
          <div className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span className="text-sm font-medium">Success Rate</span>
                </div>
                <div className="mt-2 text-2xl font-bold">
                  {executions.length > 0 ? 
                    Math.round((executions.filter(e => e.status === 'completed').length / executions.length) * 100) : 0}%
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-medium">Avg Time</span>
                </div>
                <div className="mt-2 text-2xl font-bold">
                  {executions.length > 0 ? 
                    (executions.reduce((sum, e) => sum + (e.execution_time || 0), 0) / executions.length).toFixed(2) : '0.00'}s
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Recent Achievements</span>
              </h4>
              <div className="space-y-2">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-lg">
                      {EXECUTION_ACHIEVEMENTS[achievement.id]?.icon || '🏆'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {EXECUTION_ACHIEVEMENTS[achievement.id]?.name || achievement.id}
                      </div>
                      <div className="text-xs text-gray-500">{achievement.description}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(achievement.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'performance' && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fastest Execution</span>
                  <span className="text-sm font-medium">
                    {executions.length > 0 ? Math.min(...executions.map(e => e.execution_time || Infinity)).toFixed(3) : '0.000'}s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Slowest Execution</span>
                  <span className="text-sm font-medium">
                    {executions.length > 0 ? Math.max(...executions.map(e => e.execution_time || 0)).toFixed(3) : '0.000'}s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Median Time</span>
                  <span className="text-sm font-medium">
                    {executions.length > 0 ? 
                      executions.map(e => e.execution_time || 0).sort((a,b) => a-b)[Math.floor(executions.length/2)].toFixed(3) : '0.000'}s
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Execution Time Trend</h4>
              <div className="h-32 flex items-end space-x-1">
                {getPerformanceData().slice(-10).map((point, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-blue-500 rounded-t"
                    style={{ 
                      height: `${Math.max((point.time / Math.max(...getPerformanceData().map(p => p.time))) * 100, 5)}%`,
                      opacity: 0.7 + (index / 10) * 0.3
                    }}
                    title={`Execution ${point.execution}: ${point.time.toFixed(3)}s (${point.language})`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'trends' && (
          <div className="space-y-6">
            {/* Weekly Activity */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Weekly Activity</h4>
              <div className="space-y-2">
                {getSuccessRateData().map((day, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500 w-12">
                      {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${day.successRate}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-8">{day.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'languages' && (
          <div className="space-y-6">
            {/* Language Distribution */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Language Usage</h4>
              <div className="space-y-3">
                {['jac', 'python', 'javascript', 'typescript'].map(lang => {
                  const count = executions.filter(e => e.language === lang).length;
                  const percentage = executions.length > 0 ? (count / executions.length) * 100 : 0;
                  
                  return (
                    <div key={lang} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 w-16 capitalize">{lang}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            lang === 'jac' ? 'bg-blue-500' :
                            lang === 'python' ? 'bg-green-500' :
                            lang === 'javascript' ? 'bg-yellow-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Main ExecutionHistory Component
const ExecutionHistory = ({ 
  onSelectExecution, 
  onRefreshHistory,
  className = '' 
}) => {
  // Core state
  const [executions, setExecutions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [showStats, setShowStats] = useState(false);
  const itemsPerPage = 15;

  // Enhanced state
  const [achievements, setAchievements] = useLocalStorage('execution-achievements', []);
  const [userStats, setUserStats] = useLocalStorage('execution-stats', {
    totalExecutions: 0,
    successRate: 0,
    avgExecutionTime: 0,
    streak: 0,
    languagesUsed: [],
    weeklyActivity: []
  });

  // Panel state
  const [activePanel, setActivePanel] = useState('editor');
  const [panels, setPanels] = useState({
    ai: false,
    collaboration: false,
    analytics: false,
    learning: false
  });

  // Real-time collaboration
  const [sessionId, setSessionId] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [sharedExecutions, setSharedExecutions] = useState([]);

  // Advanced features
  const [selectedExecutions, setSelectedExecutions] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // list, grid, timeline
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateRange, setDateRange] = useState('all');
  const [performanceFilter, setPerformanceFilter] = useState('all');

  // WebSocket connection
  const { isConnected: wsConnected, send: sendWsMessage } = useWebSocket(
    `${WS_BASE}/ws/execution-history/${sessionId}`,
    handleWebSocketMessage,
    handleWebSocketError,
    handleWebSocketConnect
  );

  // Enhanced API calls
  const loadHistory = async (options = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const params = new URLSearchParams({
        page: currentPage,
        per_page: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(languageFilter !== 'all' && { language: languageFilter }),
        ...(dateRange !== 'all' && { date_range: dateRange }),
        ...(performanceFilter !== 'all' && { performance_filter: performanceFilter }),
        ...options
      });

      const [historyResponse, statsResponse, achievementsResponse] = await Promise.all([
        fetch(`${API_BASE}/executions/history/?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/executions/statistics/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/executions/achievements/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setExecutions(historyData.results || []);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
        
        // Update local user stats
        updateUserStats(statsData);
      }

      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        setAchievements(achievementsData.achievements || []);
      }

    } catch (error) {
      console.error('Failed to load execution history:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStats = (apiStats) => {
    setUserStats(prev => ({
      ...prev,
      totalExecutions: apiStats.total_executions || 0,
      successRate: apiStats.success_rate || 0,
      avgExecutionTime: apiStats.avg_execution_time || 0,
      languagesUsed: apiStats.languages_used || [],
      weeklyActivity: apiStats.weekly_activity || []
    }));
  };

  // Enhanced history operations
  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all execution history? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/executions/clear_history/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setExecutions([]);
        setCurrentPage(1);
        setSelectedExecutions([]);
        loadHistory();
        onRefreshHistory && onRefreshHistory();
      }
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const exportHistory = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/executions/export/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          executions: selectedExecutions.length > 0 ? selectedExecutions : executions,
          format: 'json',
          include_stats: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `execution-history-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export history:', error);
    }
  };

  const shareExecution = async (executionIds) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/executions/share/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          execution_ids: executionIds,
          session_id: sessionId
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (sessionId && wsConnected) {
          sendWsMessage({
            type: 'execution_shared',
            data: {
              executionIds,
              sharedBy: getCurrentUserId(),
              sessionId
            }
          });
        }
        return result;
      }
    } catch (error) {
      console.error('Failed to share execution:', error);
    }
  };

  // Achievement system
  const checkAndUpdateAchievements = (newExecutions) => {
    const newAchievements = [];
    
    // Check for first execution
    if (userStats.totalExecutions === 0) {
      newAchievements.push({
        id: 'first_execution',
        timestamp: new Date().toISOString(),
        description: 'Completed your first code execution'
      });
    }
    
    // Check for execution streak
    const today = new Date().toDateString();
    const lastExecution = executions[0]?.created_at ? new Date(executions[0].created_at).toDateString() : null;
    if (lastExecution === today || (lastExecution && new Date(today) - new Date(lastExecution) === 86400000)) {
      const newStreak = userStats.streak + 1;
      if (newStreak === 7) {
        newAchievements.push({
          id: 'execution_streak',
          timestamp: new Date().toISOString(),
          description: 'Executed code for 7 days straight'
        });
      }
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  // Utility functions
  const getCurrentUserId = () => {
    return localStorage.getItem('user_id') || 'anonymous';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'timeout':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'running':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'timeout':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatExecutionTime = (time) => {
    if (!time) return 'N/A';
    if (time < 1) return `${(time * 1000).toFixed(0)}ms`;
    return `${time.toFixed(3)}s`;
  };

  // WebSocket handlers
  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'collaborator_joined':
        setCollaborators(prev => [...prev, message.data]);
        break;
      case 'collaborator_left':
        setCollaborators(prev => prev.filter(c => c.id !== message.data.id));
        break;
      case 'execution_shared':
        setSharedExecutions(prev => [...prev, message.data]);
        break;
      case 'achievement_earned':
        setAchievements(prev => [...prev, message.data]);
        break;
      default:
        console.log('Unknown WebSocket message:', message);
    }
  };

  const handleWebSocketError = (error) => {
    console.error('WebSocket error:', error);
  };

  const handleWebSocketConnect = () => {
    setIsConnected(true);
  };

  // Panel toggle functions
  const togglePanel = (panelName) => {
    setPanels(prev => ({
      ...prev,
      [panelName]: !prev[panelName]
    }));
    
    if (!panels[panelName]) {
      setActivePanel(panelName);
    }
  };

  // Handle execution selection
  const handleSelectExecution = (execution) => {
    onSelectExecution && onSelectExecution(execution);
  };

  // Handle multi-selection
  const toggleExecutionSelection = (executionId) => {
    setSelectedExecutions(prev => 
      prev.includes(executionId) 
        ? prev.filter(id => id !== executionId)
        : [...prev, executionId]
    );
  };

  // Initialize collaboration session
  const initializeCollaboration = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/create-session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'execution_history',
          permissions: ['read', 'write']
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setSessionId(result.session_id);
      }
    } catch (error) {
      console.error('Error creating collaboration session:', error);
    }
  };

  // Effects
  useEffect(() => {
    loadHistory();
  }, [currentPage, searchTerm, statusFilter, languageFilter, sortBy, sortOrder, dateRange, performanceFilter]);

  useEffect(() => {
    if (panels.collaboration && !sessionId) {
      initializeCollaboration();
    }
  }, [panels.collaboration]);

  // Filtered executions
  const filteredExecutions = executions.filter(execution => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return execution.summary?.status?.toLowerCase().includes(searchLower) ||
             execution.language?.toLowerCase().includes(searchLower) ||
             (execution.title && execution.title.toLowerCase().includes(searchLower));
    }
    return true;
  });

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Enhanced Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <History className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Execution History Analytics</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-gray-600">
                {executions.length} executions
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Panel Controls */}
            <button
              onClick={() => togglePanel('ai')}
              className={`p-2 rounded-lg transition-colors ${
                panels.ai ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              title="AI Analytics"
            >
              <Brain className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => togglePanel('collaboration')}
              className={`p-2 rounded-lg transition-colors ${
                panels.collaboration ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              title="Collaboration"
            >
              <Users className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => togglePanel('analytics')}
              className={`p-2 rounded-lg transition-colors ${
                panels.analytics ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              title="Advanced Analytics"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${
                  viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search executions, languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="timeout">Timeout</option>
            <option value="running">Running</option>
          </select>

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Languages</option>
            <option value="jac">JAC</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="execution_time-desc">Slowest First</option>
            <option value="execution_time-asc">Fastest First</option>
            <option value="status-desc">Status (Z-A)</option>
            <option value="status-asc">Status (A-Z)</option>
          </select>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            {selectedExecutions.length > 0 && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                <span>{selectedExecutions.length} selected</span>
                <button
                  onClick={() => setSelectedExecutions([])}
                  className="p-1 hover:bg-blue-200 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {achievements.length > 0 && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                <Award className="w-4 h-4" />
                <span>{achievements.length} achievements</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{showStats ? 'Hide' : 'Show'} Stats</span>
            </button>
            
            <button
              onClick={loadHistory}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              title="Refresh"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={exportHistory}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              title="Export History"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={clearHistory}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
              title="Clear History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Panel */}
      <AnimatePresence>
        {showStats && stats && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50"
          >
            <div className="p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Performance Overview</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.success_rate ? `${stats.success_rate.toFixed(1)}%` : '0%'}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Timer className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Avg Time</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatExecutionTime(stats.avg_execution_time)}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Play className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Total Executions</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.total_executions || 0}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-600">Achievements</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {achievements.length}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Executions Display */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading execution history...</p>
            </div>
          </div>
        ) : filteredExecutions.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Execution History</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' || languageFilter !== 'all'
                ? 'No executions found matching your criteria'
                : 'Start executing code to build your history'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setLanguageFilter('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExecutions.map((execution) => (
                  <motion.div
                    key={execution.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleSelectExecution(execution)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(execution.status)}
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(execution.status)}`}>
                          {execution.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={selectedExecutions.includes(execution.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleExecutionSelection(execution.id);
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        execution.language === 'python' 
                          ? 'bg-green-100 text-green-800' 
                          : execution.language === 'jac'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {execution.language}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-2">
                        <Timer className="w-3 h-3" />
                        <span>{formatExecutionTime(execution.execution_time)}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {formatDate(execution.created_at)}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3">
                {filteredExecutions.map((execution) => (
                  <motion.div
                    key={execution.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => handleSelectExecution(execution)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedExecutions.includes(execution.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleExecutionSelection(execution.id);
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        
                        {getStatusIcon(execution.status)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(execution.status)}`}>
                              {execution.status}
                            </span>
                            <span className={`px-3 py-1 text-sm rounded-full ${
                              execution.language === 'python' 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : execution.language === 'jac'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}>
                              {execution.language}
                            </span>
                            {execution.title && (
                              <span className="text-sm font-medium text-gray-900">
                                {execution.title}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Timer className="w-3 h-3" />
                              <span>{formatExecutionTime(execution.execution_time)}</span>
                            </div>
                            
                            {execution.summary && (
                              <div className="flex items-center space-x-2">
                                {execution.summary.has_output && (
                                  <span className="text-green-600" title="Has output">📤</span>
                                )}
                                {execution.summary.has_error && (
                                  <span className="text-red-600" title="Has errors">⚠️</span>
                                )}
                                {execution.summary.tests_passed !== undefined && (
                                  <span className="text-blue-600" title="Tests">
                                    🧪 {execution.summary.tests_passed}/{execution.summary.tests_total}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">
                          {formatDate(execution.created_at)}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareExecution([execution.id]);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title="Share execution"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            {filteredExecutions.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredExecutions.length)} of {filteredExecutions.length} executions
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <span className="text-sm text-gray-600 px-3">
                    Page {currentPage}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={filteredExecutions.length < itemsPerPage}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Side Panels */}
      <AnimatePresence>
        {panels.ai && (
          <AIAnalyticsPanel
            isOpen={panels.ai}
            onClose={() => togglePanel('ai')}
            executions={executions}
            onAIAction={(action) => console.log('AI Action:', action)}
            insights={[]}
          />
        )}

        {panels.collaboration && (
          <CollaborationPanel
            isOpen={panels.collaboration}
            onClose={() => togglePanel('collaboration')}
            sessionId={sessionId}
            isConnected={wsConnected}
            collaborators={collaborators}
            onInvite={async (email) => console.log('Inviting:', email)}
            onShare={() => shareExecution(selectedExecutions)}
            sharedExecutions={sharedExecutions}
          />
        )}

        {panels.analytics && (
          <AdvancedAnalyticsPanel
            isOpen={panels.analytics}
            onClose={() => togglePanel('analytics')}
            executions={executions}
            achievements={achievements}
            userStats={userStats}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExecutionHistory;