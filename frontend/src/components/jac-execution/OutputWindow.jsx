import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Copy,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Terminal,
  ExternalLink,
  Brain,
  BarChart3,
  Users,
  BookOpen,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  FileText,
  Image,
  Table,
  Code,
  Share2,
  MessageSquare,
  Zap,
  Target,
  Trophy,
  Star,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  RefreshCw,
  Save,
  Upload,
  Globe,
  History,
  GitBranch,
  Layers,
  Activity,
  TrendingUp,
  Clock3,
  Database,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  WifiOff,
  Shield,
  Lock,
  Unlock,
  EyeIcon,
  SearchIcon,
  Plus,
  Minus,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  Info,
  HelpCircle,
  Bell,
  BellOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// AI Configuration for OpenAI and Gemini integration
const AI_CONFIG = {
  openai: {
    endpoint: process.env.REACT_APP_OPENAI_API_ENDPOINT || 'https://api.openai.com/v1',
    model: 'gpt-4',
    maxTokens: 1000,
    temperature: 0.7
  },
  gemini: {
    endpoint: process.env.REACT_APP_GEMINI_API_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-pro',
    maxTokens: 1000,
    temperature: 0.7
  }
};

// Achievement system integration
const ACHIEVEMENT_SYSTEM = {
  outputMaster: {
    id: 'output_master',
    title: 'Output Master',
    description: 'Successfully analyze 100 outputs',
    icon: <Terminal className="w-4 h-4" />,
    points: 100
  },
  speedDemon: {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Execute code in under 1 second 50 times',
    icon: <Zap className="w-4 h-4" />,
    points: 75
  },
  bugHunter: {
    id: 'bug_hunter',
    title: 'Bug Hunter',
    description: 'Fix 25 execution errors using AI suggestions',
    icon: <Target className="w-4 h-4" />,
    points: 150
  },
  collaborationPro: {
    id: 'collaboration_pro',
    title: 'Collaboration Pro',
    description: 'Successfully collaborate on 10 debugging sessions',
    icon: <Users className="w-4 h-4" />,
    points: 200
  }
};

// Mock AI analysis function
const analyzeOutputWithAI = async (output, stderr, executionTime, returnCode) => {
  try {
    const prompt = `
      Analyze the following code execution output:
      
      Return Code: ${returnCode}
      Execution Time: ${executionTime} seconds
      Standard Output: ${output}
      Standard Error: ${stderr}
      
      Provide:
      1. Success Assessment (0-100%)
      2. Performance Analysis
      3. Error Analysis (if any)
      4. Optimization Suggestions
      5. Learning Insights
      6. Next Steps Recommendations
      
      Format response as JSON with keys: successScore, performance, errors, optimizations, learning, nextSteps
    `;
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI response based on return code
    if (returnCode === 0) {
      return {
        successScore: Math.min(95 + Math.random() * 5, 100),
        performance: executionTime < 1 ? 'Excellent - Under 1 second execution' : executionTime < 5 ? 'Good - Reasonable execution time' : 'Needs optimization - Slow execution',
        errors: [],
        optimizations: executionTime > 2 ? ['Consider algorithm optimization', 'Implement caching for repeated operations'] : [],
        learning: ['Good code structure', 'Successful execution demonstrates solid logic'],
        nextSteps: ['Consider adding error handling', 'Implement unit tests', 'Optimize for performance']
      };
    } else {
      return {
        successScore: Math.max(0, 30 - Math.abs(returnCode) * 10),
        performance: 'Cannot assess - execution failed',
        errors: stderr.includes('syntax') ? ['Syntax error detected', 'Check code structure'] : stderr.includes('import') ? ['Import error detected', 'Verify dependencies'] : ['Runtime error detected', 'Check logic and data types'],
        optimizations: ['Fix execution errors first', 'Add proper error handling', 'Validate input data'],
        learning: ['Errors provide learning opportunities', 'Debugging is a key skill'],
        nextSteps: ['Fix identified errors', 'Add error handling', 'Test edge cases', 'Review documentation']
      };
    }
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return {
      successScore: 0,
      performance: 'Analysis failed',
      errors: ['AI analysis service unavailable'],
      optimizations: ['Manual code review required'],
      learning: ['Technical difficulties can occur'],
      nextSteps: ['Retry analysis', 'Manual debugging required']
    };
  }
};

// Mock collaboration manager
class CollaborationManager {
  constructor() {
    this.sessions = new Map();
    this.ws = null;
    this.connected = false;
  }

  async connect() {
    // Mock WebSocket connection
    console.log('Connecting to collaboration server...');
    this.connected = true;
    return Promise.resolve();
  }

  async createSession(outputData) {
    const sessionId = `session_${Date.now()}`;
    this.sessions.set(sessionId, {
      id: sessionId,
      participants: 1,
      output: outputData,
      createdAt: new Date(),
      messages: []
    });
    return sessionId;
  }

  async shareOutput(sessionId, outputData) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.output = outputData;
      session.lastUpdated = new Date();
    }
  }

  async getSessions() {
    return Array.from(this.sessions.values());
  }
}

const EnhancedOutputWindow = ({ 
  output = '', 
  stderr = '', 
  returnCode = null, 
  isLoading = false,
  executionTime = null,
  onClearOutput,
  className = '',
  theme = 'dark',
  compact = false,
  showMinimap = true,
  realTimeMode = true,
  aiEnabled = true,
  collaborationEnabled = true,
  achievementEnabled = true,
  userId = 'current_user'
}) => {
  // Refs
  const outputRef = useRef(null);
  const stderrRef = useRef(null);
  const aiAnalysisRef = useRef(null);
  const analyticsRef = useRef(null);
  
  // Core state
  const [showOutput, setShowOutput] = useState(true);
  const [showStderr, setShowStderr] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showLearning, setShowLearning] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  
  // AI and analysis state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiProvider, setAiProvider] = useState('openai');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  
  // View and display state
  const [viewMode, setViewMode] = useState('terminal'); // terminal, json, markdown, table, graph
  const [fontSize, setFontSize] = useState(12);
  const [themeMode, setThemeMode] = useState(theme);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  
  // Collaboration state
  const [collaborationManager] = useState(() => new CollaborationManager());
  const [collaborationSessions, setCollaborationSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [collaborationMessages, setCollaborationMessages] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // Learning and achievement state
  const [achievements, setAchievements] = useState([]);
  const [learningProgress, setLearningProgress] = useState({
    totalAnalyses: 0,
    successfulAnalyses: 0,
    fastestExecution: executionTime,
    totalCollaborationTime: 0
  });
  const [tutorials, setTutorials] = useState([]);
  const [showTutorials, setShowTutorials] = useState(false);
  
  // Analytics state
  const [executionMetrics, setExecutionMetrics] = useState({
    totalExecutions: 0,
    successRate: 0,
    averageExecutionTime: 0,
    errorTypes: [],
    performanceScore: 0
  });
  const [analyticsData, setAnalyticsData] = useState({
    executionTimeline: [],
    performanceTrends: [],
    errorPatterns: [],
    collaborationStats: []
  });
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOutput, setFilteredOutput] = useState('');
  const [filteredStderr, setFilteredStderr] = useState('');
  const [highlightMatches, setHighlightMatches] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all, errors, warnings, info
  
  // Export and import state
  const [exportFormat, setExportFormat] = useState('txt');
  const [importData, setImportData] = useState('');
  const [versionHistory, setVersionHistory] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(0);
  
  // Performance monitoring
  const [performanceMetrics, setPerformanceMetrics] = useState({
    memoryUsage: 0,
    cpuUsage: 0,
    networkLatency: 0,
    renderTime: 0
  });
  
  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Copy and download state
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [copiedStderr, setCopiedStderr] = useState(false);
  const [copiedAnalysis, setCopiedAnalysis] = useState(false);
  
  // Animation state
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showAnimations, setShowAnimations] = useState(true);

  // Initialize collaboration
  useEffect(() => {
    if (collaborationEnabled) {
      collaborationManager.connect().then(() => {
        setIsConnected(true);
        setCollaborationSessions(collaborationManager.getSessions());
      });
    }
  }, [collaborationManager, collaborationEnabled]);

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    if (outputRef.current && realTimeMode) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, realTimeMode]);

  useEffect(() => {
    if (stderrRef.current && realTimeMode) {
      stderrRef.current.scrollTop = stderrRef.current.scrollHeight;
    }
  }, [stderr, realTimeMode]);

  // AI Analysis effect
  useEffect(() => {
    if (aiEnabled && output && !isLoading) {
      performAIAnalysis();
    }
  }, [output, stderr, returnCode, executionTime, aiEnabled]);

  // Update learning progress
  useEffect(() => {
    if (returnCode !== null) {
      setLearningProgress(prev => ({
        ...prev,
        totalExecutions: prev.totalExecutions + 1,
        successfulAnalyses: returnCode === 0 ? prev.successfulAnalyses + 1 : prev.successfulAnalyses,
        fastestExecution: executionTime ? Math.min(prev.fastestExecution || Infinity, executionTime) : prev.fastestExecution
      }));
      
      setExecutionMetrics(prev => ({
        ...prev,
        totalExecutions: prev.totalExecutions + 1,
        successRate: (prev.successRate * prev.totalExecutions + (returnCode === 0 ? 100 : 0)) / (prev.totalExecutions + 1)
      }));
    }
  }, [returnCode, executionTime]);

  // Filter output based on search term and filter type
  useEffect(() => {
    const applyFilters = () => {
      let filteredOut = output;
      let filteredErr = stderr;

      if (searchTerm) {
        const regex = new RegExp(searchTerm, 'gi');
        filteredOut = filteredOut.replace(regex, (match) => `**${match}**`);
        filteredErr = filteredErr.replace(regex, (match) => `**${match}**`);
      }

      if (filterType !== 'all') {
        // Apply type-specific filtering logic
        if (filterType === 'errors') {
          filteredErr = filteredErr.split('\n').filter(line => 
            line.toLowerCase().includes('error') || 
            line.toLowerCase().includes('exception') ||
            line.toLowerCase().includes('failed')
          ).join('\n');
        }
        // Add other filter types as needed
      }

      setFilteredOutput(filteredOut);
      setFilteredStderr(filteredErr);
    };

    applyFilters();
  }, [output, stderr, searchTerm, filterType]);

  // AI Analysis function
  const performAIAnalysis = useCallback(async () => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeOutputWithAI(output, stderr, executionTime, returnCode);
      setAiAnalysis(analysis);
      
      setAnalysisHistory(prev => [{
        timestamp: new Date(),
        output,
        stderr,
        returnCode,
        executionTime,
        analysis
      }, ...prev.slice(0, 9)]); // Keep last 10 analyses
      
      // Check for achievements
      checkAchievements(analysis);
      
      // Update notifications
      addNotification({
        type: 'success',
        title: 'AI Analysis Complete',
        message: `Analysis score: ${analysis.successScore.toFixed(1)}%`,
        duration: 3000
      });
      
    } catch (error) {
      console.error('AI Analysis failed:', error);
      addNotification({
        type: 'error',
        title: 'AI Analysis Failed',
        message: error.message,
        duration: 5000
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [output, stderr, returnCode, executionTime, isAnalyzing]);

  // Achievement system
  const checkAchievements = (analysis) => {
    const newAchievements = [];
    
    // Output Master Achievement
    if (learningProgress.totalAnalyses >= 100 && !achievements.find(a => a.id === 'output_master')) {
      newAchievements.push(ACHIEVEMENT_SYSTEM.outputMaster);
    }
    
    // Speed Demon Achievement
    if (executionTime && executionTime < 1 && learningProgress.totalExecutions >= 50 && 
        !achievements.find(a => a.id === 'speed_demon')) {
      newAchievements.push(ACHIEVEMENT_SYSTEM.speedDemon);
    }
    
    // Bug Hunter Achievement
    if (analysis.errors.length > 0 && returnCode !== 0 && 
        learningProgress.successfulAnalyses >= 25 && 
        !achievements.find(a => a.id === 'bug_hunter')) {
      newAchievements.push(ACHIEVEMENT_SYSTEM.bugHunter);
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      newAchievements.forEach(achievement => {
        addNotification({
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message: achievement.title,
          duration: 5000
        });
      });
    }
  };

  // Notification system
  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = { ...notification, id };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, notification.duration || 3000);
  };

  // Copy to clipboard function
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'output') {
        setCopiedOutput(true);
        setTimeout(() => setCopiedOutput(false), 2000);
      } else if (type === 'stderr') {
        setCopiedStderr(true);
        setTimeout(() => setCopiedStderr(false), 2000);
      } else if (type === 'analysis') {
        setCopiedAnalysis(true);
        setTimeout(() => setCopiedAnalysis(false), 2000);
      }
      
      addNotification({
        type: 'success',
        title: 'Copied to Clipboard',
        message: `${type} content copied successfully`,
        duration: 2000
      });
    } catch (err) {
      console.error('Failed to copy text:', err);
      addNotification({
        type: 'error',
        title: 'Copy Failed',
        message: 'Failed to copy to clipboard',
        duration: 3000
      });
    }
  };

  // Download output function
  const downloadOutput = (text, filename, format = 'txt') => {
    try {
      let content = text;
      let mimeType = 'text/plain';
      let extension = '.txt';
      
      if (format === 'json') {
        content = JSON.stringify({
          output: text,
          stderr,
          returnCode,
          executionTime,
          timestamp: new Date().toISOString()
        }, null, 2);
        mimeType = 'application/json';
        extension = '.json';
      } else if (format === 'html') {
        content = `
<!DOCTYPE html>
<html>
<head>
  <title>Code Execution Output</title>
  <style>
    body { font-family: monospace; padding: 20px; }
    .output { background: #1a1a1a; color: #00ff00; padding: 15px; }
    .error { background: #ff0000; color: white; padding: 15px; }
    pre { white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>Code Execution Output</h1>
  <div class="output"><pre>${text}</pre></div>
  ${stderr ? `<div class="error"><pre>${stderr}</pre></div>` : ''}
  <p>Return Code: ${returnCode}</p>
  <p>Execution Time: ${executionTime}s</p>
  <p>Generated: ${new Date().toLocaleString()}</p>
</body>
</html>`;
        mimeType = 'text/html';
        extension = '.html';
      }
      
      const element = document.createElement('a');
      const file = new Blob([content], { type: mimeType });
      element.href = URL.createObjectURL(file);
      element.download = `${filename}${extension}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      addNotification({
        type: 'success',
        title: 'Download Complete',
        message: `Output exported as ${format.toUpperCase()}`,
        duration: 3000
      });
    } catch (error) {
      console.error('Download failed:', error);
      addNotification({
        type: 'error',
        title: 'Download Failed',
        message: error.message,
        duration: 5000
      });
    }
  };

  // Clear output function
  const clearOutput = () => {
    if (onClearOutput) {
      onClearOutput();
    }
    
    // Reset AI analysis
    setAiAnalysis(null);
    setAnalysisHistory([]);
    
    // Clear collaboration data
    if (currentSession) {
      collaborationManager.shareOutput(currentSession, {
        output: '',
        stderr: '',
        returnCode: null,
        executionTime: null,
        timestamp: new Date()
      });
    }
    
    addNotification({
      type: 'info',
      title: 'Output Cleared',
      message: 'All output data has been cleared',
      duration: 2000
    });
  };

  // Collaboration functions
  const createCollaborationSession = async () => {
    if (!collaborationEnabled) return;
    
    try {
      const sessionId = await collaborationManager.createSession({
        output,
        stderr,
        returnCode,
        executionTime,
        timestamp: new Date()
      });
      
      setCurrentSession(sessionId);
      addNotification({
        type: 'success',
        title: 'Session Created',
        message: 'Collaboration session started',
        duration: 3000
      });
    } catch (error) {
      console.error('Failed to create session:', error);
      addNotification({
        type: 'error',
        title: 'Session Failed',
        message: 'Could not create collaboration session',
        duration: 5000
      });
    }
  };

  const shareOutputToSession = async () => {
    if (!currentSession || !collaborationEnabled) return;
    
    try {
      await collaborationManager.shareOutput(currentSession, {
        output,
        stderr,
        returnCode,
        executionTime,
        timestamp: new Date()
      });
      
      addNotification({
        type: 'success',
        title: 'Output Shared',
        message: 'Output shared with collaborators',
        duration: 2000
      });
    } catch (error) {
      console.error('Failed to share output:', error);
    }
  };

  // Status information
  const getStatusInfo = () => {
    if (isLoading) {
      return {
        icon: <Clock className="w-5 h-5 text-blue-500 animate-spin" />,
        text: 'Executing...',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      };
    }

    if (returnCode === null) {
      return {
        icon: <Terminal className="w-5 h-5 text-gray-500" />,
        text: 'Ready to execute',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50'
      };
    }

    if (returnCode === 0) {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        text: 'Completed successfully',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      };
    } else if (returnCode === 124) {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
        text: 'Execution timeout',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      };
    } else {
      return {
        icon: <XCircle className="w-5 h-5 text-red-500" />,
        text: 'Execution failed',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      };
    }
  };

  const statusInfo = getStatusInfo();

  // Render output section
  const renderOutputSection = (title, content, type, icon, showState, toggleShow) => {
    const hasContent = content && content.trim().length > 0;
    const isError = type === 'stderr';
    const displayContent = type === 'output' ? filteredOutput : filteredStderr;
    
    return (
      <motion.div 
        className="border-b border-gray-200 last:border-b-0"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-gray-50 px-4 py-2 flex items-center justify-between hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-2">
            {icon}
            <span className={`font-medium ${isError ? 'text-red-700' : 'text-gray-700'}`}>
              {title}
            </span>
            {hasContent && (
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                {content.split('\n').length} lines, {content.length} chars
              </span>
            )}
            {searchTerm && (
              <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded">
                Filtered: {displayContent.split('\n').length} lines
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {hasContent && (
              <>
                <motion.button
                  onClick={() => copyToClipboard(content, type)}
                  className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                  title="Copy to clipboard"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Copy className="w-4 h-4" />
                </motion.button>
                
                <div className="relative group">
                  <motion.button
                    className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                    title="Download options"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => downloadOutput(content, `${type}_${Date.now()}`, 'txt')}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      Download as TXT
                    </button>
                    <button
                      onClick={() => downloadOutput(content, `${type}_${Date.now()}`, 'json')}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      Download as JSON
                    </button>
                    <button
                      onClick={() => downloadOutput(content, `${type}_${Date.now()}`, 'html')}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      Download as HTML
                    </button>
                  </div>
                </div>
              </>
            )}
            
            <motion.button
              onClick={toggleShow}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              title={showState ? 'Hide' : 'Show'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showState ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
        
        <AnimatePresence>
          {showState && (
            <motion.div 
              className="relative"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                ref={type === 'output' ? outputRef : stderrRef}
                className={`h-48 overflow-y-auto p-4 font-mono text-sm ${
                  isError 
                    ? 'bg-red-50 text-red-800' 
                    : themeMode === 'dark' 
                      ? 'bg-gray-900 text-green-400' 
                      : 'bg-gray-50 text-gray-900'
                }`}
                style={{ fontSize: `${fontSize}px` }}
              >
                {hasContent ? (
                  <pre className={`whitespace-pre-wrap ${wordWrap ? 'break-words' : ''} ${highlightMatches ? 'highlight-matches' : ''}`}>
                    {displayContent}
                  </pre>
                ) : (
                  <div className="text-gray-500 italic">
                    {isLoading ? 'Waiting for output...' : 'No output'}
                  </div>
                )}
              </div>
              
              {/* Quick actions overlay */}
              {hasContent && (
                <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    {fontSize}px • {wordWrap ? 'Wrap' : 'No Wrap'}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Render AI Analysis Panel
  const renderAIAnalysisPanel = () => (
    <motion.div 
      className="border-b border-gray-200"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="bg-blue-50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-700">AI Analysis</span>
          {isAnalyzing && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4 text-blue-600" />
            </motion.div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={aiProvider}
            onChange={(e) => setAiProvider(e.target.value)}
            className="text-xs border border-blue-200 rounded px-2 py-1"
          >
            <option value="openai">OpenAI</option>
            <option value="gemini">Gemini</option>
          </select>
          
          <motion.button
            onClick={() => setShowAISettings(!showAISettings)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
            title="AI Settings"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {showAISettings && (
          <motion.div 
            className="p-4 bg-blue-25 border-t border-blue-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AI Provider</label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="openai">OpenAI GPT-4</option>
                  <option value="gemini">Google Gemini</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Depth</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="quick">Quick Analysis</option>
                  <option value="detailed">Detailed Analysis</option>
                  <option value="comprehensive">Comprehensive</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="p-4">
        {aiAnalysis ? (
          <div className="space-y-4">
            {/* Success Score */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Success Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className={`h-2 rounded-full ${
                      aiAnalysis.successScore >= 80 ? 'bg-green-500' :
                      aiAnalysis.successScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${aiAnalysis.successScore}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {aiAnalysis.successScore.toFixed(1)}%
                </span>
              </div>
            </div>
            
            {/* Performance Analysis */}
            {aiAnalysis.performance && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Analysis</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {aiAnalysis.performance}
                </p>
              </div>
            )}
            
            {/* Error Analysis */}
            {aiAnalysis.errors && aiAnalysis.errors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-700 mb-2">Error Analysis</h4>
                <ul className="text-sm text-red-600 space-y-1">
                  {aiAnalysis.errors.map((error, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <XCircle className="w-3 h-3" />
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Optimizations */}
            {aiAnalysis.optimizations && aiAnalysis.optimizations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-blue-700 mb-2">Optimization Suggestions</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  {aiAnalysis.optimizations.map((opt, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Sparkles className="w-3 h-3" />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Learning Insights */}
            {aiAnalysis.learning && aiAnalysis.learning.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2">Learning Insights</h4>
                <ul className="text-sm text-green-600 space-y-1">
                  {aiAnalysis.learning.map((insight, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Lightbulb className="w-3 h-3" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Next Steps */}
            {aiAnalysis.nextSteps && aiAnalysis.nextSteps.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-purple-700 mb-2">Next Steps</h4>
                <ul className="text-sm text-purple-600 space-y-1">
                  {aiAnalysis.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <ArrowRight className="w-3 h-3" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex space-x-2 pt-2">
              <motion.button
                onClick={() => copyToClipboard(JSON.stringify(aiAnalysis, null, 2), 'analysis')}
                className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Copy className="w-3 h-3" />
                <span>{copiedAnalysis ? 'Copied!' : 'Copy Analysis'}</span>
              </motion.button>
              
              <motion.button
                onClick={performAIAnalysis}
                disabled={isAnalyzing}
                className="flex items-center space-x-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analyzing...' : 'Re-analyze'}</span>
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">AI analysis not available</p>
            {aiEnabled && !isAnalyzing && (
              <motion.button
                onClick={performAIAnalysis}
                className="mt-2 px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start AI Analysis
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );

  // Render Collaboration Panel
  const renderCollaborationPanel = () => (
    <motion.div 
      className="border-b border-gray-200"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="bg-purple-50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-purple-700">Collaboration</span>
          {isConnected && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600">Connected</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {!currentSession ? (
            <motion.button
              onClick={createCollaborationSession}
              className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded transition-colors"
              title="Create session"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              onClick={shareOutputToSession}
              className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded transition-colors"
              title="Share current output"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {collaborationSessions.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Active Sessions</h4>
            {collaborationSessions.map((session) => (
              <div key={session.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Session {session.id.slice(-6)}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {session.participants} participant{session.participants !== 1 ? 's' : ''}
                    </span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  Created: {session.createdAt.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm mb-2">No active collaboration sessions</p>
            <motion.button
              onClick={createCollaborationSession}
              className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Collaboration
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );

  // Render Analytics Panel
  const renderAnalyticsPanel = () => (
    <motion.div 
      className="border-b border-gray-200"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="bg-green-50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-green-600" />
          <span className="font-medium text-green-700">Analytics</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
            title="Toggle analytics"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showAnalytics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {showAnalytics && (
          <motion.div 
            className="p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Success Rate</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {executionMetrics.successRate.toFixed(1)}%
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock3 className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Avg Time</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {executionMetrics.averageExecutionTime.toFixed(2)}s
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Total Runs</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {executionMetrics.totalExecutions}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Performance</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {executionMetrics.performanceScore}/100
                </div>
              </div>
            </div>
            
            {/* Mini Performance Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Timeline</h4>
              <div className="h-16 bg-gray-50 rounded flex items-end justify-around">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-blue-500 w-4 rounded-t"
                    style={{ height: `${Math.random() * 100}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.random() * 100}%` }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // Render Learning Panel
  const renderLearningPanel = () => (
    <motion.div 
      className="border-b border-gray-200"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="bg-yellow-50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-yellow-600" />
          <span className="font-medium text-yellow-700">Learning Hub</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setShowTutorials(!showTutorials)}
            className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded transition-colors"
            title="Show tutorials"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      
      <div className="p-4">
        {/* Progress Overview */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Analyses Completed</div>
            <div className="text-lg font-bold">{learningProgress.totalAnalyses}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Success Rate</div>
            <div className="text-lg font-bold">
              {learningProgress.totalAnalyses > 0 
                ? ((learningProgress.successfulAnalyses / learningProgress.totalAnalyses) * 100).toFixed(1)
                : 0}%
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Achievements</h4>
            <div className="space-y-2">
              {achievements.slice(-3).map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="text-yellow-600">
                    {achievement.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-yellow-800">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-yellow-600">
                      +{achievement.points} points
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="flex space-x-2">
          <motion.button
            className="flex items-center space-x-1 px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-3 h-3" />
            <span>Tutorial</span>
          </motion.button>
          
          <motion.button
            className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Target className="w-3 h-3" />
            <span>Goal</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className={`h-full flex flex-col bg-white ${fullscreen ? 'fixed inset-0 z-50' : ''} ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced Header */}
      <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {statusInfo.icon}
          <span className={`font-medium ${statusInfo.color.replace('text-', 'text-white')}`}>
            {statusInfo.text}
          </span>
          {executionTime && (
            <span className="text-sm text-gray-300">
              ({executionTime.toFixed(3)}s)
            </span>
          )}
          {aiAnalysis && (
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
              AI: {aiAnalysis.successScore.toFixed(0)}%
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Panel Toggle Buttons */}
          <div className="flex items-center space-x-1 bg-gray-700 rounded p-1">
            <motion.button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`p-1 rounded transition-colors ${
                showAnalytics ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              title="Analytics"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={() => setShowCollaboration(!showCollaboration)}
              className={`p-1 rounded transition-colors ${
                showCollaboration ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              title="Collaboration"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={() => setShowLearning(!showLearning)}
              className={`p-1 rounded transition-colors ${
                showLearning ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              title="Learning Hub"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="w-4 h-4" />
            </motion.button>
          </div>
          
          {/* Control Buttons */}
          <motion.button
            onClick={clearOutput}
            className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Clear output"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Enhanced Toolbar */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search output..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-1 text-sm border border-gray-300 rounded w-64"
              />
            </div>
            
            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Output</option>
              <option value="errors">Errors Only</option>
              <option value="warnings">Warnings Only</option>
              <option value="info">Info Only</option>
            </select>
            
            {/* View Mode */}
            <div className="flex items-center space-x-1 bg-gray-200 rounded p-1">
              {['terminal', 'json', 'markdown', 'table'].map((mode) => (
                <motion.button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-1 rounded text-xs transition-colors ${
                    viewMode === mode ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {mode === 'terminal' && <Terminal className="w-3 h-3" />}
                  {mode === 'json' && <FileText className="w-3 h-3" />}
                  {mode === 'markdown' && <FileText className="w-3 h-3" />}
                  {mode === 'table' && <Table className="w-3 h-3" />}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Font Size */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-600">Font:</span>
              <button
                onClick={() => setFontSize(Math.max(8, fontSize - 2))}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs w-6 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            
            {/* Toggle Options */}
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={lineNumbers}
                onChange={(e) => setLineNumbers(e.target.checked)}
                className="rounded"
              />
              <span>Lines</span>
            </label>
            
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={wordWrap}
                onChange={(e) => setWordWrap(e.target.checked)}
                className="rounded"
              />
              <span>Wrap</span>
            </label>
            
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={highlightMatches}
                onChange={(e) => setHighlightMatches(e.target.checked)}
                className="rounded"
              />
              <span>Highlight</span>
            </label>
          </div>
        </div>
      </div>

      {/* Output Sections */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* AI Analysis Panel */}
        {aiEnabled && renderAIAnalysisPanel()}
        
        {/* Standard Output */}
        {renderOutputSection(
          'Standard Output',
          output,
          'output',
          <Terminal className="w-4 h-4 text-green-500" />,
          showOutput,
          () => setShowOutput(!showOutput)
        )}
        
        {/* Standard Error */}
        {renderOutputSection(
          'Standard Error',
          stderr,
          'stderr',
          <XCircle className="w-4 h-4 text-red-500" />,
          showStderr,
          () => setShowStderr(!showStderr)
        )}
        
        {/* Collaboration Panel */}
        {collaborationEnabled && showCollaboration && renderCollaborationPanel()}
        
        {/* Analytics Panel */}
        {showAnalytics && renderAnalyticsPanel()}
        
        {/* Learning Panel */}
        {showLearning && renderLearningPanel()}
      </div>

      {/* Loading Indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-6 h-6 text-blue-500" />
              </motion.div>
              <span className="text-gray-700 font-medium">Executing code...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Footer */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-xs text-gray-600 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {returnCode !== null && (
            <span>
              Exit Code: <span className={returnCode === 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {returnCode}
              </span>
            </span>
          )}
          
          {executionTime && (
            <span>
              Execution Time: <span className="font-mono">{executionTime.toFixed(3)}s</span>
            </span>
          )}
          
          {aiAnalysis && (
            <span>
              AI Score: <span className="font-mono text-blue-600">{aiAnalysis.successScore.toFixed(1)}%</span>
            </span>
          )}
          
          {collaborationSessions.length > 0 && (
            <span className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{collaborationSessions.length} session{collaborationSessions.length !== 1 ? 's' : ''}</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected && (
            <div className="flex items-center space-x-1">
              <Wifi className="w-3 h-3 text-green-500" />
              <span>Connected</span>
            </div>
          )}
          
          <span>Enhanced Output Window</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={`p-3 rounded-lg shadow-lg max-w-sm ${
                notification.type === 'success' ? 'bg-green-100 text-green-800' :
                notification.type === 'error' ? 'bg-red-100 text-red-800' :
                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                notification.type === 'achievement' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'
              }`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
            >
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  {notification.type === 'success' && <CheckCircle className="w-4 h-4" />}
                  {notification.type === 'error' && <XCircle className="w-4 h-4" />}
                  {notification.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                  {notification.type === 'achievement' && <Trophy className="w-4 h-4" />}
                  {notification.type === 'info' && <Info className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{notification.title}</div>
                  <div className="text-xs mt-1">{notification.message}</div>
                </div>
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedOutputWindow;