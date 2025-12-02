import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightLeft,
  Copy,
  Download,
  Check,
  AlertCircle,
  Info,
  RefreshCw,
  Code,
  Zap,
  Settings,
  Eye,
  EyeOff,
  Users,
  BookOpen,
  Target,
  TrendingUp,
  FileText,
  Upload,
  Filter,
  Search,
  Star,
  Award,
  Clock,
  Globe,
  Layers,
  Brain,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Database,
  Cpu,
  Lightbulb,
  Sparkles,
  Activity,
  Heart,
  Bookmark,
  Share2,
  Archive,
  Edit3,
  Save,
  Calendar,
  Map,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  WifiOff,
  Shield,
  Lock,
  Unlock,
  Key,
  KeyRound,
  Fingerprint,
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
  History,
  Timer,
  Gauge,
  LineChart,
  PieChart,
  AreaChart,
  BarChart,
  Scatter,
  Grid3X3,
  Table,
  List,
  TreePine,
  Network,
  GitBranch,
  GitCommit,
  GitPullRequest,
  GitMerge,
  Code2,
  FileCode,
  FileJson,
  FileImage,
  FileAudio,
  FileVideo,
  Folder,
  FolderOpen,
  FolderPlus,
  ArchiveRestore,
  Package,
  Server,
  Cloud,
  Database,
  HardDrive,
  Cpu,
  Monitor,
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
  Archive,
  Trash2,
  Edit,
  Eraser,
  Highlighter,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
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
  Video,
  FileText,
  File,
  Folder,
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
  Star,
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
  Dribbble,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Twitch,
  Discord,
  Slack,
  Telegram,
  Whatsapp,
  Messenger,
  Skype,
  Zoom,
  Teams,
  Meet,
  Calendar,
  Clock,
  Timer,
  Stopwatch,
  Watch,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Umbrella,
  Snowflake,
  Sunrise,
  Sunset,
  Sunrise
} from 'lucide-react';

// Configuration Constants
const API_BASE = '/api/jac-execution';
const WS_BASE = 'ws://localhost:8000';
const LANGUAGES = {
  jac: { name: 'JAC', color: '#3B82F6', icon: '🔷' },
  python: { name: 'Python', color: '#3776AB', icon: '🐍' },
  javascript: { name: 'JavaScript', color: '#F7DF1E', icon: '🟨' },
  typescript: { name: 'TypeScript', color: '#3178C6', icon: '🔷' },
  java: { name: 'Java', color: '#ED8B00', icon: '☕' },
  cpp: { name: 'C++', color: '#00599C', icon: '⚡' },
  rust: { name: 'Rust', color: '#DEA584', icon: '🦀' },
  go: { name: 'Go', color: '#00ADD8', icon: '🐹' }
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

// Achievement System
const ACHIEVEMENTS = {
  first_translation: { id: 'first_translation', name: 'First Translation', icon: '🌟', description: 'Complete your first translation' },
  multi_language: { id: 'multi_language', name: 'Multi-Language', icon: '🌍', description: 'Translate between 3+ languages' },
  speed_translator: { id: 'speed_translator', name: 'Speed Translator', icon: '⚡', description: 'Complete 10 translations in under 5 minutes' },
  perfectionist: { id: 'perfectionist', name: 'Perfectionist', icon: '💎', description: 'Maintain 95%+ accuracy for 50 translations' },
  collaboration_master: { id: 'collaboration_master', name: 'Collaboration Master', icon: '👥', description: 'Collaborate on 20+ translation sessions' },
  batch_optimizer: { id: 'batch_optimizer', name: 'Batch Optimizer', icon: '📊', description: 'Process 100+ files in batch translation' }
};

// AI Assistant Component
const AIAssistantPanel = ({ 
  isOpen, 
  onClose, 
  originalCode, 
  targetLanguage, 
  translatedCode,
  onSuggestion,
  context = {}
}) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const generateSuggestions = useCallback(async () => {
    if (!originalCode || !targetLanguage) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/ai-suggestions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: originalCode,
          target_language: targetLanguage,
          context: context
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setSuggestions(result.suggestions || []);
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    }
  }, [originalCode, targetLanguage, context]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    
    const userMessage = { id: Date.now(), type: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/ai-chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: message,
          context: {
            original_code: originalCode,
            translated_code: translatedCode,
            target_language: targetLanguage,
            session_history: messages
          }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        const aiMessage = { 
          id: Date.now() + 1, 
          type: 'ai', 
          content: result.response, 
          timestamp: new Date(),
          suggestions: result.suggestions || []
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending AI message:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (isOpen && originalCode) {
      generateSuggestions();
    }
  }, [isOpen, originalCode, generateSuggestions]);

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
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestion(suggestion)}
                className="w-full text-left p-2 text-sm bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 border border-purple-200"
              >
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-3 h-3" />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
                {message.suggestions && (
                  <div className="mt-2 space-y-1">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => onSuggestion(suggestion)}
                        className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded p-1"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
            placeholder="Ask about your translation..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
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
  onShare
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
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <button
            onClick={onShare}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Session</span>
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

// Analytics Panel Component
const AnalyticsPanel = ({ 
  isOpen, 
  onClose, 
  translationHistory,
  achievements,
  stats
}) => {
  const [selectedMetric, setSelectedMetric] = useState('overview');

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
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Analytics</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metric Selector */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex space-x-2">
          {['overview', 'performance', 'trends'].map((metric) => (
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
            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total Translations</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-blue-900">{stats.totalTranslations}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Success Rate</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-green-900">{stats.successRate}%</div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Achievements</h4>
              <div className="space-y-2">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                    <div className="text-lg">{ACHIEVEMENTS[achievement.id]?.icon || '🏆'}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {ACHIEVEMENTS[achievement.id]?.name || achievement.id}
                      </div>
                      <div className="text-xs text-gray-500">{achievement.description}</div>
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
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Translation Time</span>
                <span className="text-sm font-medium">{stats.avgTranslationTime}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Accuracy Rate</span>
                <span className="text-sm font-medium">{stats.accuracyRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className="text-sm font-medium">{stats.errorRate}%</span>
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
                {stats.weeklyActivity.map((day, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500 w-12">{day.day}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${day.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-8">{day.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Tutorial Panel Component
const TutorialPanel = ({ 
  isOpen, 
  onClose, 
  currentLanguage,
  onStartTutorial,
  progress
}) => {
  const [selectedCategory, setSelectedCategory] = useState('basics');
  
  const tutorials = {
    basics: [
      { id: 'jac-to-python', title: 'JAC to Python Basics', duration: '10 min', difficulty: 'Beginner' },
      { id: 'python-to-jac', title: 'Python to JAC Basics', duration: '10 min', difficulty: 'Beginner' },
      { id: 'syntax-differences', title: 'Syntax Differences', duration: '15 min', difficulty: 'Beginner' }
    ],
    intermediate: [
      { id: 'control-flow', title: 'Control Flow Translation', duration: '20 min', difficulty: 'Intermediate' },
      { id: 'functions', title: 'Function Translation', duration: '25 min', difficulty: 'Intermediate' },
      { id: 'data-structures', title: 'Data Structures', duration: '30 min', difficulty: 'Intermediate' }
    ],
    advanced: [
      { id: 'oop-concepts', title: 'Object-Oriented Programming', duration: '45 min', difficulty: 'Advanced' },
      { id: 'async-programming', title: 'Async Programming', duration: '60 min', difficulty: 'Advanced' },
      { id: 'performance-optimization', title: 'Performance Optimization', duration: '50 min', difficulty: 'Advanced' }
    ]
  };

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
          <BookOpen className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-gray-900">Learning Hub</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Overview */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-600">{progress.completion}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress.completion}%` }}
          ></div>
        </div>
      </div>

      {/* Category Selector */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex space-x-2">
          {Object.keys(tutorials).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-lg capitalize ${
                selectedCategory === category
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tutorials List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {tutorials[selectedCategory].map((tutorial) => (
            <div
              key={tutorial.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer transition-colors"
              onClick={() => onStartTutorial(tutorial)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{tutorial.title}</h4>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{tutorial.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        tutorial.difficulty === 'Beginner' ? 'bg-green-500' :
                        tutorial.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-xs text-gray-500">{tutorial.difficulty}</span>
                    </div>
                  </div>
                </div>
                <Play className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Main CodeTranslationPanel Component
const CodeTranslationPanel = ({ 
  originalCode, 
  onCodeChange, 
  currentLanguage, 
  onLanguageChange,
  className = '' 
}) => {
  // Core state
  const [translatedCode, setTranslatedCode] = useState('');
  const [translationStatus, setTranslationStatus] = useState('idle');
  const [showOriginal, setShowOriginal] = useState(true);
  const [copiedTranslated, setCopiedTranslated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [translationMetadata, setTranslationMetadata] = useState({});
  
  // Enhanced state
  const [translationHistory, setTranslationHistory] = useLocalStorage('translation-history', []);
  const [achievements, setAchievements] = useLocalStorage('translation-achievements', []);
  const [userStats, setUserStats] = useLocalStorage('translation-stats', {
    totalTranslations: 0,
    successRate: 0,
    avgTranslationTime: 0,
    accuracyRate: 0,
    errorRate: 0,
    weeklyActivity: []
  });
  
  // Panel state
  const [activePanel, setActivePanel] = useState('editor');
  const [panels, setPanels] = useState({
    editor: true,
    ai: false,
    collaboration: false,
    analytics: false,
    tutorials: false,
    history: false
  });
  
  // Advanced features
  const [translationDirection, setTranslationDirection] = useState('auto');
  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState('python');
  const [batchFiles, setBatchFiles] = useState([]);
  const [translationTemplates, setTranslationTemplates] = useState([]);
  const [qualityScore, setQualityScore] = useState(null);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([]);
  
  // Real-time collaboration
  const [sessionId, setSessionId] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // WebSocket connection for real-time features
  const { isConnected: wsConnected, send: sendWsMessage } = useWebSocket(
    `${WS_BASE}/ws/translation/${sessionId}`,
    handleWebSocketMessage,
    handleWebSocketError,
    handleWebSocketConnect
  );

  // Enhanced translation function
  const translateCode = async (direction = null, options = {}) => {
    if (!originalCode.trim()) {
      setTranslationStatus('error');
      setErrors(['No code to translate']);
      return;
    }

    const startTime = Date.now();
    setTranslationStatus('translating');
    setErrors([]);
    setWarnings([]);
    setTranslatedCode('');

    try {
      const token = localStorage.getItem('access_token');
      let finalDirection = direction || translationDirection;

      // Auto-detect direction if not specified
      if (!finalDirection || finalDirection === 'auto') {
        finalDirection = determineTranslationDirection(currentLanguage, selectedTargetLanguage);
      }

      const requestBody = {
        code: originalCode,
        direction: finalDirection,
        target_language: selectedTargetLanguage,
        options: {
          optimize: options.optimize || false,
          include_comments: options.includeComments || true,
          maintain_structure: options.maintainStructure || true,
          quality_check: options.qualityCheck || true,
          ...options
        }
      };

      const response = await fetch(`${API_BASE}/ai-translate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();
      const translationTime = Date.now() - startTime;

      if (result.success) {
        setTranslatedCode(result.translated_code);
        setTranslationStatus('success');
        setErrors(result.errors || []);
        setWarnings(result.warnings || []);
        setTranslationMetadata(result.metadata || {});
        setQualityScore(result.quality_score || null);
        setOptimizationSuggestions(result.optimization_suggestions || []);

        // Update session data
        updateTranslationHistory({
          originalCode,
          translatedCode: result.translated_code,
          direction: finalDirection,
          translationTime,
          qualityScore: result.quality_score,
          timestamp: new Date().toISOString()
        });

        // Update achievements
        checkAndUpdateAchievements(result);

        // Update user stats
        updateUserStats(translationTime, result.success);

        // Broadcast to collaborators
        if (sessionId && wsConnected) {
          sendWsMessage({
            type: 'translation_complete',
            data: {
              translatedCode: result.translated_code,
              qualityScore: result.quality_score,
              userId: getCurrentUserId()
            }
          });
        }

      } else {
        setTranslationStatus('error');
        setErrors(result.errors || [result.error || 'Translation failed']);
        
        updateUserStats(Date.now() - startTime, false);
      }

    } catch (error) {
      setTranslationStatus('error');
      setErrors([`Translation request failed: ${error.message}`]);
    }
  };

  // Helper functions
  const determineTranslationDirection = (sourceLang, targetLang) => {
    const directionMap = {
      'jac_python': 'jac_to_python',
      'python_jac': 'python_to_jac',
      'jac_javascript': 'jac_to_javascript',
      'javascript_jac': 'javascript_to_jac',
      // Add more mappings as needed
    };
    
    const key = `${sourceLang}_${targetLang}`;
    return directionMap[key] || 'auto';
  };

  const updateTranslationHistory = (translationData) => {
    const newEntry = {
      id: Date.now(),
      ...translationData
    };
    
    setTranslationHistory(prev => [newEntry, ...prev.slice(0, 99)]); // Keep last 100
  };

  const checkAndUpdateAchievements = (result) => {
    const newAchievements = [];
    
    // Check for first translation
    if (translationHistory.length === 0) {
      newAchievements.push({
        id: 'first_translation',
        timestamp: new Date().toISOString(),
        description: 'Completed your first translation'
      });
    }
    
    // Check for speed translation
    if (translationData.translationTime < 5000 && translationHistory.length >= 9) {
      newAchievements.push({
        id: 'speed_translator',
        timestamp: new Date().toISOString(),
        description: 'Completed 10 translations in under 5 minutes'
      });
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  const updateUserStats = (translationTime, success) => {
    setUserStats(prev => {
      const newStats = { ...prev };
      newStats.totalTranslations += 1;
      
      if (success) {
        const successCount = Math.round((newStats.successRate / 100) * (newStats.totalTranslations - 1)) + 1;
        newStats.successRate = Math.round((successCount / newStats.totalTranslations) * 100);
      } else {
        const successCount = Math.round((newStats.successRate / 100) * (newStats.totalTranslations - 1));
        newStats.successRate = Math.round((successCount / newStats.totalTranslations) * 100);
      }
      
      // Update average translation time
      const totalTime = (newStats.avgTranslationTime * (newStats.totalTranslations - 1)) + translationTime;
      newStats.avgTranslationTime = Math.round(totalTime / newStats.totalTranslations);
      
      return newStats;
    });
  };

  const getCurrentUserId = () => {
    // Get current user ID from token or localStorage
    return localStorage.getItem('user_id') || 'anonymous';
  };

  // WebSocket event handlers
  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'collaborator_joined':
        setCollaborators(prev => [...prev, message.data]);
        break;
      case 'collaborator_left':
        setCollaborators(prev => prev.filter(c => c.id !== message.data.id));
        break;
      case 'translation_update':
        // Handle real-time translation updates from collaborators
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

  // File operations
  const copyTranslatedCode = async () => {
    try {
      await navigator.clipboard.writeText(translatedCode);
      setCopiedTranslated(true);
      setTimeout(() => setCopiedTranslated(false), 2000);
    } catch (error) {
      console.error('Failed to copy translated code:', error);
    }
  };

  const downloadTranslatedCode = () => {
    if (!translatedCode) return;

    const fileExtension = selectedTargetLanguage === 'python' ? 'py' : 
                         selectedTargetLanguage === 'jac' ? 'jac' : 'js';
    const filename = `translated_code.${fileExtension}`;
    
    const element = document.createElement('a');
    const file = new Blob([translatedCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const loadTranslatedToEditor = () => {
    if (translatedCode) {
      onCodeChange(translatedCode);
      onLanguageChange(selectedTargetLanguage);
    }
  };

  // Batch translation
  const handleBatchTranslation = async () => {
    if (batchFiles.length === 0) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/batch-translate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          files: batchFiles,
          target_language: selectedTargetLanguage,
          options: {
            maintain_structure: true,
            quality_check: true
          }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        // Handle batch results
        console.log('Batch translation completed:', result);
      }
    } catch (error) {
      console.error('Batch translation error:', error);
    }
  };

  // Initialize session for collaboration
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
          type: 'translation',
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

  useEffect(() => {
    if (panels.collaboration && !sessionId) {
      initializeCollaboration();
    }
  }, [panels.collaboration]);

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Enhanced Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <ArrowRightLeft className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">AI Translation Hub</h3>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              {currentLanguage.toUpperCase()} → {selectedTargetLanguage.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Panel Controls */}
            <button
              onClick={() => togglePanel('ai')}
              className={`p-2 rounded-lg transition-colors ${
                panels.ai ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              title="AI Assistant"
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
              title="Analytics"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => togglePanel('tutorials')}
              className={`p-2 rounded-lg transition-colors ${
                panels.tutorials ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              title="Learning Hub"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            {/* View Toggle */}
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              title="Toggle View"
            >
              {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Language Selection */}
            <select
              value={selectedTargetLanguage}
              onChange={(e) => setSelectedTargetLanguage(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(LANGUAGES).map(([key, lang]) => (
                <option key={key} value={key}>
                  {lang.icon} {lang.name}
                </option>
              ))}
            </select>

            {/* Translation Direction */}
            <select
              value={translationDirection}
              onChange={(e) => setTranslationDirection(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="auto">Auto Detect</option>
              <option value="jac_to_python">JAC → Python</option>
              <option value="python_to_jac">Python → JAC</option>
              <option value="jac_to_javascript">JAC → JavaScript</option>
              <option value="javascript_to_jac">JavaScript → JAC</option>
            </select>

            {/* Batch Upload */}
            <button
              onClick={() => document.getElementById('batch-upload').click()}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Upload className="w-4 h-4" />
              <span>Batch Upload</span>
            </button>
            <input
              id="batch-upload"
              type="file"
              multiple
              accept=".py,.jac,.js,.ts"
              onChange={(e) => setBatchFiles(Array.from(e.target.files))}
              className="hidden"
            />
          </div>

          {/* Translate Button */}
          <button
            onClick={() => translateCode(translationDirection)}
            disabled={translationStatus === 'translating' || !originalCode.trim()}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              translationStatus === 'translating'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : qualityScore && qualityScore >= 90
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {translationStatus === 'translating' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>
              {translationStatus === 'translating' ? 'Translating...' : 'Translate'}
            </span>
            {qualityScore && (
              <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded text-xs">
                {qualityScore}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Translation Status */}
      {(translationStatus === 'success' || translationStatus === 'error') && (
        <div className={`px-6 py-4 border-b border-gray-200 ${
          translationStatus === 'success' ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {translationStatus === 'success' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${
                translationStatus === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                Translation {translationStatus === 'success' ? 'completed successfully' : 'failed'}
              </span>
              
              {errors.length > 0 && (
                <span className="text-sm text-red-600">
                  ({errors.length} error{errors.length > 1 ? 's' : ''})
                </span>
              )}
              
              {warnings.length > 0 && (
                <span className="text-sm text-yellow-600">
                  ({warnings.length} warning{warnings.length > 1 ? 's' : ''})
                </span>
              )}

              {qualityScore && (
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Quality Score: {qualityScore}%
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => translateCode(translationDirection, { optimize: true })}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <Sparkles className="w-3 h-3" />
              <span>Optimize</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex h-96">
        {/* Original Code Panel */}
        {showOriginal && (
          <div className="flex-1 border-r border-gray-200">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Original Code ({currentLanguage.toUpperCase()})
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{originalCode.split('\n').length} lines</span>
                  <span>•</span>
                  <span>{originalCode.length} chars</span>
                </div>
              </div>
            </div>
            <div className="p-4 h-full">
              <textarea
                value={originalCode}
                onChange={(e) => onCodeChange(e.target.value)}
                placeholder="Enter your code here to translate..."
                className="w-full h-full p-3 border border-gray-300 rounded-lg resize-none text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Translated Code Panel */}
        <div className="flex-1">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  {translationStatus === 'idle' ? 'Translated Code Preview' : 
                   translationStatus === 'translating' ? 'Translating...' :
                   'Translated Code'} ({selectedTargetLanguage.toUpperCase()})
                </span>
                {translatedCode && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <span>{translatedCode.split('\n').length} lines</span>
                    <span>•</span>
                    <span>{translatedCode.length} chars</span>
                  </div>
                )}
              </div>
              
              {translatedCode && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyTranslatedCode}
                    className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                    title="Copy Translated Code"
                  >
                    {copiedTranslated ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={downloadTranslatedCode}
                    className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                    title="Download Translated Code"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={loadTranslatedToEditor}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    <Code className="w-3 h-3" />
                    <span>Load to Editor</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setTranslatedCode('');
                      setTranslationStatus('idle');
                      setErrors([]);
                      setWarnings([]);
                      setTranslationMetadata({});
                    }}
                    className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                    title="Clear Translation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 h-full">
            {translationStatus === 'idle' ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <ArrowRightLeft className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Ready to Translate</p>
                  <p className="text-sm">Enter code and click "Translate" to convert between languages</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="font-medium text-blue-700">JAC → Python</div>
                      <div className="text-blue-600">JavaScript Alternative Coding</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="font-medium text-green-700">Python → JAC</div>
                      <div className="text-green-600">JavaScript Alternative Coding</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : translationStatus === 'translating' ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-lg font-medium text-gray-700">Translating your code...</p>
                  <p className="text-sm text-gray-500 mt-2">AI is analyzing and converting your code</p>
                  <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-700">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4" />
                        <span>AI-Powered Translation in Progress</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full relative">
                <textarea
                  value={translatedCode}
                  readOnly
                  placeholder="Translated code will appear here..."
                  className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none text-sm font-mono bg-gray-50 focus:outline-none"
                />
                
                {/* Quality Score Indicator */}
                {qualityScore && (
                  <div className="absolute top-3 right-3 flex items-center space-x-2 bg-white bg-opacity-90 px-2 py-1 rounded-lg shadow-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      qualityScore >= 90 ? 'bg-green-500' :
                      qualityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-xs font-medium">{qualityScore}%</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      {optimizationSuggestions.length > 0 && (
        <div className="border-t border-gray-200 bg-blue-50">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-medium text-blue-900">Optimization Suggestions</h4>
            </div>
            <div className="space-y-2">
              {optimizationSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-white bg-opacity-50 rounded">
                  <Sparkles className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Translation Issues */}
      {(errors.length > 0 || warnings.length > 0) && (
        <div className="border-t border-gray-200">
          {errors.length > 0 && (
            <div className="bg-red-50 p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Translation Errors</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {warnings.length > 0 && (
            <div className="bg-yellow-50 p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">Translation Warnings</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-1 h-1 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Translation Metadata */}
      {translationMetadata && Object.keys(translationMetadata).length > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Translation Details</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            {translationMetadata.direction && (
              <div>
                <span className="font-medium">Direction:</span>
                <span className="ml-1">{translationMetadata.direction}</span>
              </div>
            )}
            {translationMetadata.original_length && translationMetadata.translated_length && (
              <div>
                <span className="font-medium">Size:</span>
                <span className="ml-1">
                  {translationMetadata.original_length} → {translationMetadata.translated_length} chars
                </span>
              </div>
            )}
            {translationMetadata.confidence && (
              <div>
                <span className="font-medium">Confidence:</span>
                <span className="ml-1">{Math.round(translationMetadata.confidence * 100)}%</span>
              </div>
            )}
            {translationMetadata.processing_time && (
              <div>
                <span className="font-medium">Time:</span>
                <span className="ml-1">{translationMetadata.processing_time}ms</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Side Panels */}
      <AnimatePresence>
        {panels.ai && (
          <AIAssistantPanel
            isOpen={panels.ai}
            onClose={() => togglePanel('ai')}
            originalCode={originalCode}
            targetLanguage={selectedTargetLanguage}
            translatedCode={translatedCode}
            onSuggestion={(suggestion) => console.log('AI Suggestion:', suggestion)}
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
            onShare={() => console.log('Sharing session')}
          />
        )}

        {panels.analytics && (
          <AnalyticsPanel
            isOpen={panels.analytics}
            onClose={() => togglePanel('analytics')}
            translationHistory={translationHistory}
            achievements={achievements}
            stats={userStats}
          />
        )}

        {panels.tutorials && (
          <TutorialPanel
            isOpen={panels.tutorials}
            onClose={() => togglePanel('tutorials')}
            currentLanguage={currentLanguage}
            onStartTutorial={(tutorial) => console.log('Starting tutorial:', tutorial)}
            progress={{
              completion: Math.round((achievements.length / Object.keys(ACHIEVEMENTS).length) * 100)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodeTranslationPanel;