import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Square,
  Copy,
  Download,
  Upload,
  FileText,
  Code,
  Terminal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  History,
  Settings,
  Save,
  Share,
  ArrowRightLeft,
  X,
  Brain,
  Users,
  Zap,
  TrendingUp,
  Eye,
  PlayCircle,
  Pause,
  RotateCcw,
  Shield,
  Monitor,
  BarChart3,
  Sparkles,
  MessageSquare,
  BookOpen,
  Trophy,
  Target,
  ChevronRight,
  ChevronDown,
  Activity,
  Server,
  Bug,
  Lightbulb,
  BrainCircuit,
  Cpu,
  Gauge,
  Globe,
  Lock,
  Microscope,
  Layers
} from 'lucide-react';

const CodeExecutionPanel = ({ 
  initialCode = '',
  initialLanguage = 'python',
  userId,
  sessionId,
  onCodeChange,
  onExecuteComplete,
  showCollaboration = true,
  showAI = true,
  showAnalytics = true,
  onSave,
  onShare
}) => {
  // Core Execution State
  const [code, setCode] = useState(initialCode || '# Welcome to AI-Powered Learning Execution Platform\nprint("Hello, JAC Learning Platform!")');
  const [language, setLanguage] = useState(initialLanguage);
  const [stdin, setStdin] = useState('');
  const [executionState, setExecutionState] = useState({
    output: '',
    stderr: '',
    isExecuting: false,
    status: 'idle', // idle, running, completed, error, timeout, analyzing
    executionTime: null,
    returnCode: null,
    executionId: null,
    memoryUsage: 0,
    cpuUsage: 0
  });

  // AI and Intelligence State
  const [aiAssistant, setAiAssistant] = useState({
    isOpen: false,
    messages: [],
    suggestions: [],
    isProcessing: false,
    errorAnalysis: null,
    optimizationTips: [],
    learningRecommendations: []
  });
  const [codeInsights, setCodeInsights] = useState({
    errors: [],
    warnings: [],
    suggestions: [],
    complexity: 0,
    quality: 'unknown',
    security: 'unknown',
    performance: 'unknown'
  });

  // Real-time Collaboration State
  const [collaborators, setCollaborators] = useState([]);
  const [isCollaborationMode, setIsCollaborationMode] = useState(false);
  const [wsConnection, setWsConnection] = useState(null);
  const [executionStreaming, setExecutionStreaming] = useState([]);
  const [sharedSessions, setSharedSessions] = useState([]);

  // Step-by-step Execution State
  const [debugMode, setDebugMode] = useState({
    isActive: false,
    currentStep: 0,
    totalSteps: 0,
    steps: [],
    variables: {},
    callStack: []
  });

  // Analytics and Learning State
  const [learningAnalytics, setLearningAnalytics] = useState({
    totalExecutions: 0,
    successRate: 0,
    averageTime: 0,
    learningProgress: 0,
    skillsGained: [],
    achievements: [],
    streak: 0,
    challengesCompleted: 0
  });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    executionSpeed: 0,
    memoryEfficiency: 0,
    codeQuality: 0,
    optimizationPotential: 0
  });

  // UI and Panel State
  const [activePanel, setActivePanel] = useState('execution');
  const [showSettings, setShowSettings] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    output: true,
    ai: false,
    collaboration: false,
    analytics: false,
    debug: false
  });

  // Template and History State
  const [templates, setTemplates] = useState([]);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Real-time Streams State
  const [streamData, setStreamData] = useState([]);
  const [executionLogs, setExecutionLogs] = useState([]);

  const executionTimeoutRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);

  // API endpoints
  const API_BASE = '/api/jac-execution';

  // Supported Languages Configuration
  const languageOptions = {
    python: {
      name: 'Python',
      icon: '🐍',
      executionMode: 'sandbox',
      aiModel: 'python-expert',
      defaultTemplate: 'print("Hello, Python!")'
    },
    jac: {
      name: 'JAC',
      icon: '⚡',
      executionMode: 'jac-vm',
      aiModel: 'jac-expert',
      defaultTemplate: 'jac::print("Hello, JAC!")'
    },
    javascript: {
      name: 'JavaScript',
      icon: '📜',
      executionMode: 'node-sandbox',
      aiModel: 'js-expert',
      defaultTemplate: 'console.log("Hello, JavaScript!");'
    },
    typescript: {
      name: 'TypeScript',
      icon: '🔷',
      executionMode: 'typescript-compiler',
      aiModel: 'ts-expert',
      defaultTemplate: 'console.log("Hello, TypeScript!");'
    }
  };

  // WebSocket Connection for Real-time Collaboration
  useEffect(() => {
    if (isCollaborationMode && sessionId && userId) {
      const ws = new WebSocket(`wss://api.jac-platform.com/executions/collaborate/${sessionId}`);
      
      ws.onopen = () => {
        setWsConnection(ws);
        ws.send(JSON.stringify({
          type: 'join_execution_session',
          userId,
          sessionId,
          timestamp: Date.now()
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleCollaborationMessage(data);
      };

      ws.onclose = () => {
        setWsConnection(null);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => ws.close();
    }
  }, [isCollaborationMode, sessionId, userId]);

  // Load initial data
  useEffect(() => {
    loadSupportedLanguages();
    loadUserStats();
    loadTemplates();
    loadExecutionHistory();
    analyzeCurrentCode();
  }, []);

  // AI Code Analysis
  const analyzeCurrentCode = useCallback(async (codeToAnalyze = code) => {
    if (!codeToAnalyze.trim()) return;

    try {
      const response = await fetch('/api/ai/execution-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToAnalyze,
          language,
          context: 'execution',
          userId
        })
      });

      const analysis = await response.json();
      setCodeInsights(analysis);
      
      // Update AI assistant with insights
      if (analysis.errors?.length > 0 || analysis.warnings?.length > 0) {
        setAiAssistant(prev => ({
          ...prev,
          errorAnalysis: analysis.errors,
          optimizationTips: analysis.suggestions || []
        }));
      }

      return analysis;
    } catch (error) {
      console.error('Code analysis failed:', error);
    }
  }, [code, language, userId]);

  // Real-time Collaboration Message Handler
  const handleCollaborationMessage = (data) => {
    switch (data.type) {
      case 'execution_start':
        setCollaborators(prev => {
          const filtered = prev.filter(c => c.userId !== data.userId);
          return [...filtered, { ...data.collaborator, executionStarted: true }];
        });
        break;
      case 'execution_output':
        setExecutionStreaming(prev => [...prev, data.output]);
        break;
      case 'execution_complete':
        setCollaborators(prev => {
          const filtered = prev.filter(c => c.userId !== data.userId);
          return [...filtered, { ...data.collaborator, lastExecution: data.result }];
        });
        if (onExecuteComplete) {
          onExecuteComplete(data.result);
        }
        break;
      case 'user_joined':
        setCollaborators(prev => [...prev, data.collaborator]);
        break;
      case 'user_left':
        setCollaborators(prev => prev.filter(c => c.userId !== data.userId));
        break;
      case 'code_change':
        if (data.userId !== userId) {
          setCode(data.code);
          if (onCodeChange) onCodeChange(data.code);
        }
        break;
    }
  };

  // Enhanced Code Execution with AI
  const executeCode = async (options = { saveToHistory: true, streaming: true }) => {
    if (executionState.isExecuting) return;

    setExecutionState(prev => ({ ...prev, isExecuting: true, status: 'running' }));
    setExecutionLogs([]);

    try {
      const token = localStorage.getItem('access_token');
      const startTime = Date.now();
      
      // Start real-time streaming if enabled
      if (options.streaming && wsConnection) {
        wsConnection.send(JSON.stringify({
          type: 'execution_start',
          userId,
          code,
          language,
          sessionId
        }));
      }

      const response = await fetch(`${API_BASE}/executions/execute/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          language,
          code,
          stdin,
          streaming: options.streaming,
          sessionId,
          saveToHistory: options.saveToHistory,
          debugMode: debugMode.isActive,
          userId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Execution failed');
      }

      const result = await response.json();
      const executionTime = Date.now() - startTime;

      // Process execution result
      const executionResult = {
        ...result,
        executionTime,
        timestamp: new Date(),
        output: result.output || '',
        stderr: result.stderr || '',
        returnCode: result.returnCode || 0,
        memoryUsage: result.memoryUsage || 0,
        cpuUsage: result.cpuUsage || 0,
        id: result.id || `exec-${Date.now()}`
      };

      // Update execution state
      setExecutionState(prev => ({
        ...prev,
        isExecuting: false,
        status: result.returnCode === 0 ? 'completed' : 'error',
        output: executionResult.output,
        stderr: executionResult.stderr,
        executionTime: executionResult.executionTime,
        returnCode: executionResult.returnCode,
        memoryUsage: executionResult.memoryUsage,
        cpuUsage: executionResult.cpuUsage,
        executionId: executionResult.id
      }));

      // Add to execution logs
      setExecutionLogs(prev => [
        ...prev,
        {
          timestamp: new Date(),
          type: 'execution_complete',
          result: executionResult
        }
      ]);

      // AI-powered post-execution analysis
      await analyzeExecutionResult(executionResult);

      // Update learning analytics
      updateLearningAnalytics(executionResult);

      // Save to history if requested
      if (options.saveToHistory) {
        setExecutionHistory(prev => [executionResult, ...prev.slice(0, 99)]); // Keep last 100
        loadUserStats();
      }

      // Broadcast to collaborators
      if (wsConnection && options.streaming) {
        wsConnection.send(JSON.stringify({
          type: 'execution_complete',
          userId,
          result: executionResult
        }));
      }

      if (onExecuteComplete) {
        onExecuteComplete(executionResult);
      }

    } catch (error) {
      const errorResult = {
        error: error.message,
        stderr: error.message,
        returnCode: 1,
        executionTime: Date.now() - Date.now(),
        timestamp: new Date()
      };

      setExecutionState(prev => ({
        ...prev,
        isExecuting: false,
        status: 'error',
        stderr: error.message,
        returnCode: 1
      }));

      setExecutionLogs(prev => [
        ...prev,
        {
          timestamp: new Date(),
          type: 'execution_error',
          error: error.message
        }
      ]);

      // AI error analysis
      await analyzeError(error.message);
    }
  };

  // Step-by-step Debug Execution
  const executeStepByStep = async () => {
    setDebugMode(prev => ({ ...prev, isActive: true }));
    
    try {
      const response = await fetch(`${API_BASE}/debug/execute-steps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          code,
          language,
          breakpoints: debugMode.breakpoints || []
        })
      });

      const debugData = await response.json();
      
      setDebugMode(prev => ({
        ...prev,
        totalSteps: debugData.steps.length,
        steps: debugData.steps,
        variables: debugData.variables || {},
        callStack: debugData.callStack || []
      }));

      // Auto-start step-by-step execution
      setTimeout(() => {
        executeNextStep(1);
      }, 500);

    } catch (error) {
      console.error('Debug execution failed:', error);
      setDebugMode(prev => ({ ...prev, isActive: false }));
    }
  };

  // Execute next debug step
  const executeNextStep = async (stepIndex) => {
    if (stepIndex > debugMode.totalSteps) {
      setDebugMode(prev => ({ ...prev, isActive: false }));
      return;
    }

    try {
      const step = debugMode.steps[stepIndex - 1];
      
      setDebugMode(prev => ({
        ...prev,
        currentStep: stepIndex,
        variables: { ...prev.variables, ...step.variables }
      }));

      setExecutionState(prev => ({
        ...prev,
        status: 'running'
      }));

      // Execute the current step
      const response = await fetch(`${API_BASE}/debug/execute-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          step,
          language
        })
      });

      const stepResult = await response.json();
      
      setExecutionState(prev => ({
        ...prev,
        output: stepResult.output || prev.output,
        stderr: stepResult.stderr || prev.stderr
      }));

      // Auto-advance to next step
      setTimeout(() => {
        executeNextStep(stepIndex + 1);
      }, 1000);

    } catch (error) {
      console.error('Step execution failed:', error);
      setDebugMode(prev => ({ ...prev, isActive: false }));
    }
  };

  // AI-powered execution result analysis
  const analyzeExecutionResult = async (result) => {
    if (!showAI) return;

    setAiAssistant(prev => ({ ...prev, isProcessing: true }));

    try {
      const response = await fetch('/api/ai/execution-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          executionResult: result,
          code,
          language,
          context: 'learning'
        })
      });

      const insights = await response.json();
      
      setAiAssistant(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: Date.now(),
          type: 'execution_insights',
          content: insights.message,
          suggestions: insights.suggestions,
          learningPath: insights.learningPath,
          timestamp: new Date()
        }],
        suggestions: insights.suggestions || [],
        learningRecommendations: insights.learningPath || [],
        isProcessing: false
      }));

    } catch (error) {
      console.error('Execution analysis failed:', error);
      setAiAssistant(prev => ({ ...prev, isProcessing: false }));
    }
  };

  // AI error analysis
  const analyzeError = async (errorMessage) => {
    if (!showAI) return;

    try {
      const response = await fetch('/api/ai/error-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: errorMessage,
          code,
          language,
          context: 'debugging'
        })
      });

      const analysis = await response.json();
      
      setAiAssistant(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: Date.now(),
          type: 'error_help',
          content: analysis.solution,
          explanation: analysis.explanation,
          suggestions: analysis.suggestions,
          timestamp: new Date()
        }],
        isProcessing: false
      }));

    } catch (error) {
      console.error('Error analysis failed:', error);
      setAiAssistant(prev => ({ ...prev, isProcessing: false }));
    }
  };

  // Update learning analytics
  const updateLearningAnalytics = (result) => {
    setLearningAnalytics(prev => {
      const newStats = {
        ...prev,
        totalExecutions: prev.totalExecutions + 1,
        successRate: result.returnCode === 0 
          ? ((prev.totalExecutions + 1) * (prev.successRate + 100)) / (prev.totalExecutions + 2)
          : (prev.totalExecutions * prev.successRate) / (prev.totalExecutions + 1),
        averageTime: (prev.averageTime * prev.totalExecutions + result.executionTime) / (prev.totalExecutions + 1),
        streak: result.returnCode === 0 ? prev.streak + 1 : 0
      };

      // Check for achievements
      const newAchievements = checkAchievements(newStats);
      if (newAchievements.length > 0) {
        newStats.achievements = [...prev.achievements, ...newAchievements];
      }

      return newStats;
    });
  };

  // Achievement checking
  const checkAchievements = (stats) => {
    const achievements = [];
    
    if (stats.totalExecutions >= 10 && !stats.achievements.find(a => a.id === 'first-10-executions')) {
      achievements.push({
        id: 'first-10-executions',
        title: 'Code Runner',
        description: 'Completed 10 code executions',
        icon: '🏃',
        unlockedAt: new Date()
      });
    }

    if (stats.successRate >= 80 && stats.totalExecutions >= 5 && !stats.achievements.find(a => a.id === 'consistent-success')) {
      achievements.push({
        id: 'consistent-success',
        title: 'Consistent Coder',
        description: 'Achieved 80%+ success rate',
        icon: '🎯',
        unlockedAt: new Date()
      });
    }

    return achievements;
  };

  // Data loading functions
  const loadSupportedLanguages = async () => {
    try {
      const response = await fetch(`${API_BASE}/languages/`);
      if (response.ok) {
        const data = await response.json();
        // Merge with our configuration
        const mergedLanguages = { ...languageOptions, ...data.supported_languages };
        Object.keys(languageOptions).forEach(key => {
          if (mergedLanguages[key]) {
            mergedLanguages[key] = { ...languageOptions[key], ...mergedLanguages[key] };
          }
        });
      }
    } catch (error) {
      console.error('Failed to load supported languages:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/executions/statistics/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLearningAnalytics(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE}/templates/popular/`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadExecutionHistory = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/executions/history/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setExecutionHistory(data);
      }
    } catch (error) {
      console.error('Failed to load execution history:', error);
    }
  };

  // Utility functions
  const stopExecution = () => {
    setExecutionState(prev => ({ ...prev, isExecuting: false, status: 'error' }));
    setExecutionLogs(prev => [
      ...prev,
      { timestamp: new Date(), type: 'user_stop' }
    ]);
    if (wsConnection) {
      wsConnection.send(JSON.stringify({
        type: 'execution_stopped',
        userId
      }));
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add toast notification
    });
  };

  const downloadCode = () => {
    const extensions = {
      python: 'py',
      jac: 'jac',
      javascript: 'js',
      typescript: 'ts'
    };
    
    const filename = `code.${extensions[language] || 'txt'}`;
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const loadTemplate = (templateCode, templateLanguage, templateStdin) => {
    setCode(templateCode);
    setLanguage(templateLanguage);
    if (templateStdin) {
      setStdin(templateStdin);
    }
    if (onCodeChange) onCodeChange(templateCode);
  };

  const loadFromHistory = (execution) => {
    setCode(execution.code);
    setLanguage(execution.language);
    setStdin(execution.stdin || '');
    if (onCodeChange) onCodeChange(execution.code);
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (executionState.status) {
      case 'running':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'timeout':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'analyzing':
        return <Brain className="w-5 h-5 text-purple-500 animate-pulse" />;
      default:
        return <Terminal className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (executionState.status) {
      case 'running':
        return 'Executing with AI Analysis...';
      case 'completed':
        return 'Execution Completed Successfully';
      case 'error':
        return 'Execution Failed - AI Analysis Available';
      case 'timeout':
        return 'Execution Timeout';
      case 'analyzing':
        return 'AI is Analyzing Code...';
      default:
        return 'Ready for AI-Powered Execution';
    }
  };

  // Panel configuration
  const panels = [
    { 
      id: 'execution', 
      label: 'Execution', 
      icon: Play,
      badge: executionState.isExecuting ? 'Running' : null
    },
    { 
      id: 'ai', 
      label: 'AI Assistant', 
      icon: Brain,
      badge: aiAssistant.isProcessing ? 'Thinking' : null
    },
    { 
      id: 'collaboration', 
      label: 'Collaboration', 
      icon: Users,
      badge: isCollaborationMode ? 'Connected' : null
    },
    { 
      id: 'debug', 
      label: 'Debug Mode', 
      icon: Bug,
      badge: debugMode.isActive ? 'Active' : null
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      badge: learningAnalytics.totalExecutions > 0 ? learningAnalytics.totalExecutions : null
    },
    { 
      id: 'history', 
      label: 'History', 
      icon: History,
      badge: executionHistory.length > 0 ? executionHistory.length : null
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Cpu className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  AI Learning Execution Platform
                </h1>
                <p className="text-cyan-300 text-sm">
                  Powered by Intelligent Code Analysis & Collaboration
                </p>
              </div>
            </div>
            
            {/* Real-time Status Indicators */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-white font-medium">{getStatusText()}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span>{learningAnalytics.successRate.toFixed(1)}% Success</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>{learningAnalytics.achievements.length} Achievements</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>{learningAnalytics.totalExecutions} Executions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Controls */}
          <div className="flex items-center space-x-3">
            {/* Collaboration Status */}
            {showCollaboration && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsCollaborationMode(!isCollaborationMode)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isCollaborationMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {isCollaborationMode ? `${collaborators.length} Online` : 'Collaborate'}
                  </span>
                </button>
              </div>
            )}

            {/* AI Assistant Toggle */}
            {showAI && (
              <button
                onClick={() => setAiAssistant(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI Assistant</span>
                {aiAssistant.isProcessing && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            )}

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Execution History"
              >
                <History className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Code Translation"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Enhanced Editor and Controls */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Toolbar */}
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Language Selection */}
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-300">Language:</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(languageOptions).map(([key, info]) => (
                      <option key={key} value={key}>
                        {info.icon} {info.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Execution Stats */}
                {executionState.executionTime && (
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{executionState.executionTime.toFixed(2)}s</span>
                    </div>
                    {executionState.memoryUsage > 0 && (
                      <div className="flex items-center space-x-1">
                        <Monitor className="w-4 h-4" />
                        <span>{(executionState.memoryUsage / 1024 / 1024).toFixed(2)}MB</span>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Insights Indicator */}
                {codeInsights.errors.length > 0 && (
                  <div className="flex items-center space-x-1 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">{codeInsights.errors.length} Issues Found</span>
                  </div>
                )}
                
                {codeInsights.suggestions.length > 0 && (
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-xs">{codeInsights.suggestions.length} Suggestions</span>
                  </div>
                )}
              </div>

              {/* Enhanced Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => copyToClipboard(code)}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  title="Copy Code"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy</span>
                </button>
                
                <button
                  onClick={downloadCode}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  title="Download Code"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download</span>
                </button>

                {debugMode.isActive && (
                  <button
                    onClick={executeStepByStep}
                    className="flex items-center space-x-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                    title="Step-by-step Debug"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Debug Mode</span>
                  </button>
                )}
                
                <button
                  onClick={() => setStdin('')}
                  className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Clear Input"
                >
                  Clear Input
                </button>
              </div>
            </div>
          </div>

          {/* AI-Powered Code Editor Integration */}
          <div className="flex-1 bg-gray-900 relative">
            {/* This would integrate with the enhanced CodeEditor component */}
            <div className="h-full flex flex-col">
              {/* Code Editor would go here */}
              <div className="flex-1 bg-gray-800 border border-gray-600 rounded-lg m-4 p-4">
                <textarea
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (onCodeChange) onCodeChange(e.target.value);
                    // Debounced AI analysis
                    clearTimeout(analyzeCurrentCode.timeoutId);
                    analyzeCurrentCode.timeoutId = setTimeout(() => {
                      analyzeCurrentCode(e.target.value);
                    }, 1000);
                  }}
                  className="w-full h-full bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
                  placeholder={`# AI-Powered Code Editor\n# Language: ${languageOptions[language]?.name || language}\n# Start coding with AI assistance...`}
                  style={{ minHeight: '400px' }}
                  disabled={executionState.isExecuting}
                />
              </div>
            </div>

            {/* Real-time Collaboration Indicators */}
            {isCollaborationMode && collaborators.length > 0 && (
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                {collaborators.slice(0, 3).map((collab, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-lg"
                    title={collab.name || `User ${index + 1}`}
                  >
                    {collab.name?.charAt(0) || 'U'}
                  </div>
                ))}
                {collaborators.length > 3 && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    +{collaborators.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Input Section */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Standard Input (AI-Analyzed)
              </label>
              <div className="flex items-center space-x-2">
                <textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="Enter input data for your program... AI will analyze the input requirements"
                  className="flex-1 h-20 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={executionState.isExecuting}
                />
                {stdin && (
                  <button
                    onClick={() => analyzeCurrentCode(`# Input Analysis\nstdin = """${stdin}"""\n# AI will analyze input patterns and suggest optimizations`)}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                    title="AI Input Analysis"
                  >
                    <Brain className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Execution Controls */}
          <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {!executionState.isExecuting ? (
                  <>
                    <button
                      onClick={() => executeCode({ saveToHistory: false, streaming: false })}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <Play className="w-5 h-5" />
                      <span>Quick Execute</span>
                    </button>
                    
                    <button
                      onClick={() => executeCode({ saveToHistory: true, streaming: isCollaborationMode })}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <Save className="w-5 h-5" />
                      <span>Execute & Save</span>
                      {isCollaborationMode && <Globe className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={executeStepByStep}
                      className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <Eye className="w-5 h-5" />
                      <span>Debug Mode</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={stopExecution}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <Square className="w-5 h-5" />
                    <span>Stop Execution</span>
                  </button>
                )}
              </div>

              {/* Debug Progress */}
              {debugMode.isActive && (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-300">
                    Step {debugMode.currentStep} of {debugMode.totalSteps}
                  </div>
                  <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all duration-300"
                      style={{ width: `${(debugMode.currentStep / debugMode.totalSteps) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - AI Assistant and Analytics */}
        <AnimatePresence>
          {(activePanel !== 'execution' || aiAssistant.isOpen) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 450, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-gray-800 border-l border-gray-700 flex flex-col"
            >
              {/* Panel Tabs */}
              <div className="flex border-b border-gray-700 overflow-x-auto">
                {panels.map((panel) => (
                  <button
                    key={panel.id}
                    onClick={() => setActivePanel(panel.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                      activePanel === panel.id
                        ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-900'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <panel.icon className="w-4 h-4" />
                    <span>{panel.label}</span>
                    {panel.badge && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                        {panel.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activePanel === 'ai' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <BrainCircuit className="w-5 h-5 text-purple-400" />
                        <span>AI Assistant</span>
                      </h3>
                      <button
                        onClick={() => analyzeCurrentCode()}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                      >
                        <Sparkles className="w-4 h-4 inline mr-1" />
                        Analyze
                      </button>
                    </div>
                    
                    {/* AI Analysis Results */}
                    {(codeInsights.errors.length > 0 || codeInsights.warnings.length > 0 || codeInsights.suggestions.length > 0) && (
                      <div className="space-y-3">
                        {codeInsights.errors.length > 0 && (
                          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3">
                            <h4 className="text-red-400 font-medium mb-2">Errors Detected</h4>
                            {codeInsights.errors.map((error, index) => (
                              <div key={index} className="text-red-300 text-sm mb-1">
                                • {error}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {codeInsights.warnings.length > 0 && (
                          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                            <h4 className="text-yellow-400 font-medium mb-2">Warnings</h4>
                            {codeInsights.warnings.map((warning, index) => (
                              <div key={index} className="text-yellow-300 text-sm mb-1">
                                • {warning}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {codeInsights.suggestions.length > 0 && (
                          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3">
                            <h4 className="text-blue-400 font-medium mb-2">AI Suggestions</h4>
                            {codeInsights.suggestions.map((suggestion, index) => (
                              <div key={index} className="text-blue-300 text-sm mb-1">
                                • {suggestion}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* AI Chat Messages */}
                    {aiAssistant.messages.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-300">AI Insights</h4>
                        {aiAssistant.messages.map((message, index) => (
                          <div key={index} className="bg-gray-900 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                              <Sparkles className="w-4 h-4 text-purple-400 mt-1" />
                              <div className="flex-1">
                                <div className="text-white text-sm">{message.content}</div>
                                {message.suggestions && (
                                  <div className="mt-2 space-y-1">
                                    {message.suggestions.map((suggestion, idx) => (
                                      <button
                                        key={idx}
                                        className="block w-full text-left px-2 py-1 bg-purple-900 hover:bg-purple-800 text-purple-200 rounded text-xs"
                                        onClick={() => {
                                          // Apply suggestion
                                          console.log('Applying suggestion:', suggestion);
                                        }}
                                      >
                                        💡 {suggestion}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {aiAssistant.isProcessing && (
                      <div className="bg-gray-900 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                          <span className="text-purple-400 text-sm">AI is analyzing your code...</span>
                        </div>
                      </div>
                    )}

                    {/* Quick AI Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAIRequest('Explain this code', code)}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                      >
                        Explain Code
                      </button>
                      
                      <button
                        onClick={() => handleAIRequest('Optimize this code', code)}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                      >
                        Optimize
                      </button>
                      
                      <button
                        onClick={() => handleAIRequest('Debug this code', code)}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                      >
                        Debug Help
                      </button>
                      
                      <button
                        onClick={() => handleAIRequest('Suggest learning path', code)}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                )}

                {activePanel === 'collaboration' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span>Collaboration</span>
                    </h3>
                    
                    {/* Active Collaborators */}
                    {collaborators.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-300">Active Users</h4>
                        {collaborators.map((collab, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {collab.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <div className="text-white text-sm font-medium">{collab.name || `User ${index + 1}`}</div>
                                <div className="text-gray-400 text-xs">
                                  {collab.executionStarted ? 'Currently Executing' : 'Online'}
                                </div>
                              </div>
                            </div>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Collaboration Tools */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-300">Collaboration Tools</h4>
                      
                      <button
                        onClick={() => {
                          if (wsConnection) {
                            wsConnection.send(JSON.stringify({
                              type: 'share_session',
                              sessionId,
                              userId
                            }));
                          }
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Share className="w-4 h-4" />
                        <span>Share Session</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                        <Microscope className="w-4 h-4" />
                        <span>Live Code Review</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        <Target className="w-4 h-4" />
                        <span>Pair Programming</span>
                      </button>
                    </div>

                    {/* Execution Streaming */}
                    {executionStreaming.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Live Execution Stream</h4>
                        <div className="bg-black rounded-lg p-3 h-32 overflow-y-auto">
                          {executionStreaming.map((stream, index) => (
                            <div key={index} className="text-green-400 text-xs font-mono">
                              {stream}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activePanel === 'debug' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <Bug className="w-5 h-5 text-orange-400" />
                      <span>Debug Mode</span>
                    </h3>

                    {/* Debug Controls */}
                    <div className="flex space-x-2">
                      <button
                        onClick={executeStepByStep}
                        disabled={debugMode.isActive}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Start Debug</span>
                      </button>
                      
                      {debugMode.isActive && (
                        <button
                          onClick={() => setDebugMode(prev => ({ ...prev, isActive: false }))}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <Square className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Debug Progress */}
                    {debugMode.isActive && (
                      <div className="bg-gray-900 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">Execution Progress</span>
                          <span className="text-sm text-white">
                            {debugMode.currentStep} / {debugMode.totalSteps}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 transition-all duration-300"
                            style={{ width: `${(debugMode.currentStep / debugMode.totalSteps) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Variables */}
                    {Object.keys(debugMode.variables).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Variables</h4>
                        <div className="bg-gray-900 rounded-lg p-3">
                          {Object.entries(debugMode.variables).map(([name, value]) => (
                            <div key={name} className="flex justify-between text-sm mb-1">
                              <span className="text-blue-400">{name}:</span>
                              <span className="text-green-400">{JSON.stringify(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Call Stack */}
                    {debugMode.callStack.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Call Stack</h4>
                        <div className="bg-gray-900 rounded-lg p-3">
                          {debugMode.callStack.map((frame, index) => (
                            <div key={index} className="text-sm text-white mb-1">
                              {frame.function} (line {frame.line})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activePanel === 'analytics' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-green-400" />
                      <span>Learning Analytics</span>
                    </h3>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{learningAnalytics.totalExecutions}</div>
                        <div className="text-blue-200 text-sm">Total Executions</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{learningAnalytics.successRate.toFixed(1)}%</div>
                        <div className="text-green-200 text-sm">Success Rate</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{learningAnalytics.streak}</div>
                        <div className="text-purple-200 text-sm">Day Streak</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{learningAnalytics.achievements.length}</div>
                        <div className="text-yellow-200 text-sm">Achievements</div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-300">Performance Insights</h4>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Average Execution Time</span>
                          <span className="text-white">{learningAnalytics.averageTime.toFixed(2)}s</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Code Complexity</span>
                          <span className="text-white">{codeInsights.complexity}/10</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Code Quality</span>
                          <span className="text-white capitalize">{codeInsights.quality}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Learning Progress</span>
                          <span className="text-white">{learningAnalytics.learningProgress}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Achievement Display */}
                    {learningAnalytics.achievements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Recent Achievements</h4>
                        <div className="space-y-2">
                          {learningAnalytics.achievements.slice(-3).map((achievement, index) => (
                            <div key={index} className="flex items-center space-x-3 bg-gray-900 rounded-lg p-3">
                              <div className="text-2xl">{achievement.icon}</div>
                              <div>
                                <div className="text-white font-medium text-sm">{achievement.title}</div>
                                <div className="text-gray-400 text-xs">{achievement.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activePanel === 'history' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <History className="w-5 h-5 text-gray-400" />
                      <span>Execution History</span>
                    </h3>

                    {/* History List */}
                    {executionHistory.length > 0 ? (
                      <div className="space-y-2">
                        {executionHistory.slice(0, 10).map((execution, index) => (
                          <div
                            key={index}
                            className="bg-gray-900 rounded-lg p-3 hover:bg-gray-800 cursor-pointer transition-colors"
                            onClick={() => loadFromHistory(execution)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-white text-sm font-medium">
                                  {languageOptions[execution.language]?.name || execution.language}
                                </span>
                                <span className={`w-2 h-2 rounded-full ${
                                  execution.returnCode === 0 ? 'bg-green-400' : 'bg-red-400'
                                }`}></span>
                              </div>
                              <span className="text-gray-400 text-xs">
                                {new Date(execution.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-gray-300 text-xs line-clamp-2">
                              {execution.code.substring(0, 100)}...
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-gray-400 text-xs">
                                {execution.executionTime?.toFixed(2)}s
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Add to favorites
                                  setFavorites(prev => [execution, ...prev.slice(0, 9)]);
                                }}
                                className="text-yellow-400 hover:text-yellow-300"
                              >
                                <Star className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        <History className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                        <p className="text-sm">No execution history yet</p>
                        <p className="text-xs mt-1">Execute some code to see your history</p>
                      </div>
                    )}

                    {/* Favorites */}
                    {favorites.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Favorites</h4>
                        {favorites.map((favorite, index) => (
                          <div
                            key={index}
                            className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-yellow-200 text-sm">
                                {favorite.language} - {new Date(favorite.timestamp).toLocaleDateString()}
                              </span>
                              <button
                                onClick={() => loadFromHistory(favorite)}
                                className="text-yellow-400 hover:text-yellow-300"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activePanel === 'execution' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Execution Output</h3>
                    
                    {/* Execution Logs */}
                    {executionLogs.length > 0 && (
                      <div className="space-y-2">
                        {executionLogs.slice(-5).map((log, index) => (
                          <div key={index} className="bg-gray-900 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-400 text-xs">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                log.type === 'execution_complete' ? 'bg-green-900 text-green-300' :
                                log.type === 'execution_error' ? 'bg-red-900 text-red-300' :
                                'bg-gray-700 text-gray-300'
                              }`}>
                                {log.type.replace('_', ' ')}
                              </span>
                            </div>
                            {log.result && (
                              <div className="text-white text-sm">
                                Status: {log.result.returnCode === 0 ? 'Success' : 'Error'}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Templates Quick Access */}
                    {templates.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Quick Templates</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {templates.slice(0, 3).map((template, index) => (
                            <button
                              key={index}
                              onClick={() => loadTemplate(template.code, template.language, template.stdin)}
                              className="text-left bg-gray-900 hover:bg-gray-800 rounded-lg p-3 transition-colors"
                            >
                              <div className="text-white text-sm font-medium">{template.name}</div>
                              <div className="text-gray-400 text-xs">{template.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Assistant Floating Panel */}
        <AnimatePresence>
          {aiAssistant.isOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-gradient-to-b from-purple-900 to-gray-900 border-l border-purple-600/30 flex flex-col"
            >
              {/* AI Header */}
              <div className="bg-gradient-to-r from-purple-900 to-pink-900 px-4 py-3 border-b border-purple-600/30">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white font-semibold">AI Learning Assistant</h3>
                </div>
              </div>

              {/* AI Chat */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {aiAssistant.messages.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <BrainCircuit className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                    <p className="text-sm">AI is ready to help!</p>
                    <p className="text-xs mt-1">Ask about debugging, optimization, or learning</p>
                  </div>
                )}

                {aiAssistant.messages.map((message, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-400 mt-1" />
                      <div className="flex-1">
                        <div className="text-white text-sm">{message.content}</div>
                        {message.suggestions && (
                          <div className="mt-2 space-y-1">
                            {message.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                className="block w-full text-left px-2 py-1 bg-purple-800/50 hover:bg-purple-700/50 text-purple-200 rounded text-xs transition-colors"
                                onClick={() => {
                                  // Apply suggestion logic
                                  console.log('Applying suggestion:', suggestion);
                                }}
                              >
                                💡 {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {aiAssistant.isProcessing && (
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
                      <span className="text-purple-400 text-sm">AI is analyzing...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Quick Actions */}
              <div className="p-4 border-t border-purple-600/30">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAIRequest('Explain what this code does', code)}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs transition-colors"
                  >
                    Explain
                  </button>
                  
                  <button
                    onClick={() => handleAIRequest('How can I improve this code?', code)}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs transition-colors"
                  >
                    Improve
                  </button>
                  
                  <button
                    onClick={() => handleAIRequest('Debug this code and find issues', code)}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs transition-colors"
                  >
                    Debug
                  </button>
                  
                  <button
                    onClick={() => handleAIRequest('What should I learn next?', code)}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Output Display */}
      {(executionState.output || executionState.stderr) && (
        <div className="bg-gray-900 border-t border-gray-700">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-300">Execution Output</h4>
              <div className="flex items-center space-x-2">
                {executionState.executionTime && (
                  <span className="text-xs text-gray-400">
                    Time: {executionState.executionTime.toFixed(2)}s
                  </span>
                )}
                {executionState.memoryUsage > 0 && (
                  <span className="text-xs text-gray-400">
                    Memory: {(executionState.memoryUsage / 1024 / 1024).toFixed(2)}MB
                  </span>
                )}
                <button
                  onClick={() => copyToClipboard(executionState.output || executionState.stderr)}
                  className="text-gray-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {executionState.output && (
                <div>
                  <label className="block text-xs font-medium text-green-400 mb-1">Output</label>
                  <div className="bg-black rounded-lg p-3 h-32 overflow-y-auto">
                    <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                      {executionState.output}
                    </pre>
                  </div>
                </div>
              )}
              
              {executionState.stderr && (
                <div>
                  <label className="block text-xs font-medium text-red-400 mb-1">Error</label>
                  <div className="bg-black rounded-lg p-3 h-32 overflow-y-auto">
                    <pre className="text-red-400 text-sm font-mono whitespace-pre-wrap">
                      {executionState.stderr}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Debug Variables Panel */}
      {debugMode.isActive && Object.keys(debugMode.variables).length > 0 && (
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-3">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Debug Variables</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(debugMode.variables).map(([name, value]) => (
              <div key={name} className="bg-gray-900 rounded-lg p-2">
                <div className="text-blue-400 text-xs font-mono">{name}</div>
                <div className="text-green-400 text-xs font-mono">{JSON.stringify(value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for handling AI requests
const handleAIRequest = (prompt, code) => {
  // This would integrate with the AI service
  console.log('AI Request:', prompt, code);
};

export default CodeExecutionPanel;