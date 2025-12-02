import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Editor } from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayIcon,
  StopIcon,
  BeakerIcon,
  CodeBracketIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  LightBulbIcon,
  TrophyIcon,
  ChartBarIcon,
  TerminalIcon,
  CpuChipIcon,
  SparklesIcon,
  EyeIcon,
  ShareIcon,
  AdjustmentsHorizontalIcon,
  QuestionMarkCircleIcon,
  PencilSquareIcon,
  FolderIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  BugAntIcon,
  ClockIcon,
  StarIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

const CodeEditor = ({ 
  value = '', 
  onChange, 
  language = 'python', 
  readOnly = false,
  userId,
  sessionId,
  showAI = true,
  showCollaboration = true,
  showTutorials = true,
  challengeId,
  onExecute,
  onSave,
  onShare
}) => {
  // Core Editor State
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('vs-dark');
  const [showSettings, setShowSettings] = useState(false);
  const [activePanel, setActivePanel] = useState('editor');
  const editorRef = useRef(null);
  const fileTreeRef = useRef(null);

  // AI and Intelligence State
  const [aiAssistant, setAiAssistant] = useState({
    isOpen: false,
    messages: [],
    suggestions: [],
    isProcessing: false
  });
  const [codeInsights, setCodeInsights] = useState({
    errors: [],
    warnings: [],
    suggestions: [],
    complexity: 0,
    quality: 'good'
  });
  const [learningProgress, setLearningProgress] = useState({
    completedChallenges: 0,
    currentStreak: 0,
    totalLines: 0,
    accuracy: 85,
    skills: {}
  });

  // Collaboration State
  const [collaborators, setCollaborators] = useState([]);
  const [isCollaborationMode, setIsCollaborationMode] = useState(false);
  const [wsConnection, setWsConnection] = useState(null);
  const [remoteCursors, setRemoteCursors] = useState([]);

  // Execution and Debug State
  const [executionState, setExecutionState] = useState({
    isRunning: false,
    output: [],
    errors: [],
    executionTime: 0,
    memoryUsage: 0
  });
  const [debugMode, setDebugMode] = useState({
    isActive: false,
    breakpoints: [],
    currentLine: null,
    variables: [],
    callStack: []
  });
  const [consoleOutput, setConsoleOutput] = useState([]);

  // Tutorial and Challenge State
  const [tutorials, setTutorials] = useState([]);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [achievements, setAchievements] = useState([]);

  // File Management State
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileTree, setFileTree] = useState([]);

  // Analytics and Performance State
  const [analytics, setAnalytics] = useState({
    keystrokes: 0,
    compilationTime: 0,
    collaborationTime: 0,
    learningTime: 0,
    completionRate: 0
  });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    linesPerMinute: 0,
    errorRate: 0,
    helpRequests: 0,
    codeQuality: 'excellent'
  });

  // Language and Configuration Options
  const languageOptions = {
    python: {
      language: 'python',
      extensions: ['.py'],
      icon: '🐍',
      aiModel: 'python-expert',
      executionMode: 'sandbox'
    },
    jac: {
      language: 'javascript',
      extensions: ['.jac'],
      icon: '⚡',
      aiModel: 'jac-expert',
      executionMode: 'node'
    },
    javascript: {
      language: 'javascript',
      extensions: ['.js', '.jsx'],
      icon: '📜',
      aiModel: 'js-expert',
      executionMode: 'browser'
    },
    typescript: {
      language: 'typescript',
      extensions: ['.ts', '.tsx'],
      icon: '🔷',
      aiModel: 'ts-expert',
      executionMode: 'browser'
    }
  };

  // WebSocket Connection for Real-time Collaboration
  useEffect(() => {
    if (isCollaborationMode && sessionId) {
      const ws = new WebSocket(`wss://api.jac-platform.com/collaborate/${sessionId}`);
      
      ws.onopen = () => {
        setWsConnection(ws);
        ws.send(JSON.stringify({
          type: 'join',
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

      return () => ws.close();
    }
  }, [isCollaborationMode, sessionId, userId]);

  // AI Assistant Integration
  const handleAIRequest = async (prompt, context) => {
    setAiAssistant(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context,
          code: value,
          language,
          userId,
          sessionId
        })
      });

      const aiResponse = await response.json();
      
      setAiAssistant(prev => ({
        ...prev,
        messages: [...prev.messages, aiResponse],
        suggestions: aiResponse.suggestions || [],
        isProcessing: false
      }));

      return aiResponse;
    } catch (error) {
      console.error('AI request failed:', error);
      setAiAssistant(prev => ({ ...prev, isProcessing: false }));
    }
  };

  // Code Intelligence and Analysis
  const analyzeCode = useCallback(async (code) => {
    if (!code.trim()) return;

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          context: 'learning'
        })
      });

      const analysis = await response.json();
      setCodeInsights(analysis);
      
      return analysis;
    } catch (error) {
      console.error('Code analysis failed:', error);
    }
  }, [language]);

  // Real-time Collaboration Message Handler
  const handleCollaborationMessage = (data) => {
    switch (data.type) {
      case 'cursor-update':
        setRemoteCursors(prev => 
          prev.filter(cursor => cursor.userId !== data.userId)
              .concat({ ...data.cursor, userId: data.userId })
        );
        break;
      case 'code-change':
        if (data.userId !== userId) {
          onChange(data.code);
        }
        break;
      case 'user-join':
        setCollaborators(prev => [...prev, data.user]);
        break;
      case 'user-leave':
        setCollaborators(prev => prev.filter(u => u.id !== data.userId));
        break;
    }
  };

  // Code Execution
  const executeCode = async () => {
    setExecutionState(prev => ({ ...prev, isRunning: true }));
    
    try {
      const startTime = Date.now();
      
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: value,
          language,
          input: consoleInput,
          sessionId,
          challengeId: activeChallenge?.id
        })
      });

      const result = await response.json();
      
      const executionTime = Date.now() - startTime;
      
      setExecutionState(prev => ({
        ...prev,
        isRunning: false,
        output: result.output,
        errors: result.errors,
        executionTime,
        memoryUsage: result.memoryUsage || 0
      }));

      setConsoleOutput(prev => [
        ...prev,
        ...result.output.map(line => ({
          type: 'output',
          content: line,
          timestamp: new Date()
        }))
      ]);

      if (onExecute) {
        onExecute(result);
      }

      // Update learning progress
      if (!result.errors.length) {
        setLearningProgress(prev => ({
          ...prev,
          totalLines: prev.totalLines + value.split('\n').length,
          accuracy: Math.min(100, prev.accuracy + 1)
        }));
      }

    } catch (error) {
      setExecutionState(prev => ({
        ...prev,
        isRunning: false,
        errors: [error.message]
      }));
    }
  };

  // Stop Execution
  const stopExecution = () => {
    setExecutionState(prev => ({ ...prev, isRunning: false }));
  };

  // Debug Mode Toggle
  const toggleDebugMode = () => {
    setDebugMode(prev => ({ ...prev, isActive: !prev.isActive }));
    
    if (!debugMode.isActive && editorRef.current) {
      // Add breakpoint on current line
      const position = editorRef.current.getPosition();
      const newBreakpoint = {
        line: position.lineNumber,
        column: position.column,
        id: `bp-${Date.now()}`
      };
      
      setDebugMode(prev => ({
        ...prev,
        breakpoints: [...prev.breakpoints, newBreakpoint]
      }));
    }
  };

  // File Management
  const createNewFile = (name, content = '') => {
    const newFile = {
      id: `file-${Date.now()}`,
      name,
      content,
      language: languageOptions[language].language,
      lastModified: new Date(),
      isModified: false
    };
    
    setFiles(prev => [...prev, newFile]);
    setActiveFile(newFile.id);
    
    if (!activeFile) {
      onChange(content);
    }
  };

  // Achievement System
  const checkAchievements = () => {
    const newAchievements = [];
    
    if (learningProgress.totalLines >= 100 && !achievements.find(a => a.id === 'first-100-lines')) {
      newAchievements.push({
        id: 'first-100-lines',
        title: '100 Lines of Code',
        description: 'Wrote your first 100 lines of code!',
        icon: '💻',
        unlockedAt: new Date()
      });
    }
    
    if (learningProgress.accuracy >= 95 && !achievements.find(a => a.id === 'code-perfectionist')) {
      newAchievements.push({
        id: 'code-perfectionist',
        title: 'Code Perfectionist',
        description: 'Maintained 95%+ code accuracy!',
        icon: '🏆',
        unlockedAt: new Date()
      });
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  // Tutorial System
  const loadTutorials = async () => {
    try {
      const response = await fetch(`/api/tutorials?language=${language}`);
      const tutorialData = await response.json();
      setTutorials(tutorialData);
    } catch (error) {
      console.error('Failed to load tutorials:', error);
    }
  };

  // Code Formatting and Intelligence
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure Monaco Editor
    editor.updateOptions({
      fontSize,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      glyphMargin: false,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 3,
      renderLineHighlight: 'all',
      contextmenu: true,
      mouseWheelZoom: true,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      foldingHighlight: true,
      foldingImportsByDefault: true,
      showFoldingControls: 'always',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      }
    });

    // Add custom AI-powered suggestions
    const codeProvider = {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        return {
          suggestions: [
            {
              label: 'ai-suggestion',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '// AI Suggestion: ${1:implementation}',
              range: range,
              detail: 'AI-powered suggestion'
            }
          ]
        };
      }
    };

    monaco.languages.registerCompletionItemProvider(language, codeProvider);

    // Custom keybindings with learning shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) onSave(value);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyEnter, () => {
      executeCode();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyD, () => {
      toggleDebugMode();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyA, () => {
      setAiAssistant(prev => ({ ...prev, isOpen: !prev.isOpen }));
    });

    // Track analytics
    editor.onDidChangeModelContent(() => {
      setAnalytics(prev => ({
        ...prev,
        keystrokes: prev.keystrokes + 1
      }));
    });
  };

  const handleEditorChange = (newValue) => {
    if (!readOnly) {
      onChange(newValue || '');
      
      // Debounced code analysis
      clearTimeout(analyzeCode.timeoutId);
      analyzeCode.timeoutId = setTimeout(() => {
        analyzeCode(newValue);
      }, 1000);
    }
  };

  // Enhanced Controls
  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 32);
    setFontSize(newSize);
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: newSize });
    }
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 8);
    setFontSize(newSize);
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: newSize });
    }
  };

  const toggleTheme = () => {
    const themes = ['vs-dark', 'light', 'hc-black', 'hc-light'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const formatCode = async () => {
    if (editorRef.current) {
      await editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  // Panel Management
  const panels = [
    { id: 'editor', label: 'Editor', icon: CodeBracketIcon },
    { id: 'terminal', label: 'Terminal', icon: TerminalIcon },
    { id: 'collaboration', label: 'Collaborate', icon: UsersIcon },
    { id: 'ai', label: 'AI Assistant', icon: SparklesIcon },
    { id: 'tutorials', label: 'Tutorials', icon: BookOpenIcon },
    { id: 'debug', label: 'Debug', icon: BugAntIcon },
    { id: 'files', label: 'Files', icon: FolderIcon },
    { id: 'achievements', label: 'Progress', icon: TrophyIcon }
  ];

  // Console input state
  const [consoleInput, setConsoleInput] = useState('');

  // Component Effects
  useEffect(() => {
    checkAchievements();
    loadTutorials();
  }, [learningProgress]);

  // Real-time cursor tracking
  useEffect(() => {
    if (editorRef.current && isCollaborationMode) {
      const editor = editorRef.current;
      
      const updateCursor = () => {
        const position = editor.getPosition();
        if (wsConnection && position) {
          wsConnection.send(JSON.stringify({
            type: 'cursor-update',
            userId,
            cursor: {
              line: position.lineNumber,
              column: position.column,
              timestamp: Date.now()
            }
          }));
        }
      };

      editor.onDidChangeCursorPosition(updateCursor);
      
      return () => {
        // Cleanup
      };
    }
  }, [wsConnection, isCollaborationMode, userId]);

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 px-6 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CpuChipIcon className="w-8 h-8 text-cyan-400" />
              <h1 className="text-xl font-bold text-white">
                AI Learning Code Editor
              </h1>
              <span className="text-cyan-400 text-sm">
                {languageOptions[language]?.icon} {language.toUpperCase()}
              </span>
            </div>
            
            {/* Learning Progress Indicator */}
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-1">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span>{learningProgress.completedChallenges}</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrophyIcon className="w-4 h-4 text-amber-400" />
                <span>{achievements.length}</span>
              </div>
              <div className="text-green-400">
                {learningProgress.accuracy}% Accuracy
              </div>
            </div>
          </div>

          {/* Real-time Status */}
          <div className="flex items-center space-x-4">
            {isCollaborationMode && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">
                  {collaborators.length} Online
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                executionState.isRunning ? 'bg-red-400 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <span className="text-gray-300 text-sm">
                {executionState.isRunning ? 'Running' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Execution Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={executeCode}
                disabled={executionState.isRunning || readOnly}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <PlayIcon className="w-4 h-4" />
                <span>Run</span>
              </button>
              
              <button
                onClick={stopExecution}
                disabled={!executionState.isRunning}
                className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <StopIcon className="w-4 h-4" />
                <span>Stop</span>
              </button>
              
              <button
                onClick={toggleDebugMode}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                  debugMode.isActive 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                }`}
              >
                <BugAntIcon className="w-4 h-4" />
                <span>Debug</span>
              </button>
            </div>

            {/* Editor Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={decreaseFontSize}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                title="Decrease Font Size"
              >
                A-
              </button>
              <span className="text-sm text-gray-400 px-1">{fontSize}px</span>
              <button
                onClick={increaseFontSize}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Collaboration Toggle */}
            {showCollaboration && (
              <button
                onClick={() => setIsCollaborationMode(!isCollaborationMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isCollaborationMode 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title="Toggle Collaboration Mode"
              >
                <UsersIcon className="w-4 h-4" />
              </button>
            )}

            {/* AI Assistant Toggle */}
            {showAI && (
              <button
                onClick={() => setAiAssistant(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900 rounded-lg transition-colors"
                title="AI Assistant"
              >
                <SparklesIcon className="w-4 h-4" />
              </button>
            )}

            {/* Formatting */}
            <button
              onClick={formatCode}
              disabled={readOnly}
              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              title="Format Code"
            >
              Format
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Toggle Theme"
            >
              <EyeIcon className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Settings"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 bg-gray-900 rounded-lg p-3 border border-gray-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="text-gray-300 mb-2">Editor Settings</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-gray-400">
                      <span>Tab Size:</span>
                      <select
                        onChange={(e) => {
                          const size = parseInt(e.target.value);
                          if (editorRef.current) {
                            editorRef.current.updateOptions({ tabSize: size });
                          }
                        }}
                        className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
                        defaultValue="4"
                      >
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="8">8</option>
                      </select>
                    </label>
                    
                    <label className="flex items-center space-x-2 text-gray-400">
                      <input type="checkbox" className="rounded" />
                      <span>Auto-format</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 text-gray-400">
                      <input type="checkbox" className="rounded" />
                      <span>Minimap</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-gray-300 mb-2">Learning Features</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-gray-400">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>AI Suggestions</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 text-gray-400">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>Progress Tracking</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 text-gray-400">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>Error Hints</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-gray-300 mb-2">Collaboration</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-gray-400">
                      <input type="checkbox" className="rounded" />
                      <span>Real-time Sync</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 text-gray-400">
                      <input type="checkbox" className="rounded" />
                      <span>Voice Chat</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 text-gray-400">
                      <input type="checkbox" className="rounded" />
                      <span>Screen Share</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Side Panel */}
        <AnimatePresence>
          {(activePanel !== 'editor' || aiAssistant.isOpen) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-gray-800 border-r border-gray-700 flex flex-col"
            >
              {/* Panel Tabs */}
              <div className="flex border-b border-gray-700">
                {panels.slice(1).map((panel) => (
                  <button
                    key={panel.id}
                    onClick={() => setActivePanel(panel.id)}
                    className={`flex items-center space-x-1 px-3 py-2 text-xs font-medium transition-colors ${
                      activePanel === panel.id
                        ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-900'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <panel.icon className="w-4 h-4" />
                    <span>{panel.label}</span>
                  </button>
                ))}
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activePanel === 'terminal' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Terminal</h3>
                    
                    {/* Console Output */}
                    <div className="bg-black rounded-lg p-3 h-64 overflow-y-auto">
                      {consoleOutput.map((line, index) => (
                        <div key={index} className={`text-sm ${
                          line.type === 'error' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {line.content}
                        </div>
                      ))}
                      {executionState.isRunning && (
                        <div className="text-yellow-400 text-sm animate-pulse">
                          &gt; Executing...
                        </div>
                      )}
                    </div>

                    {/* Console Input */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={consoleInput}
                        onChange={(e) => setConsoleInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            setConsoleOutput(prev => [...prev, {
                              type: 'input',
                              content: `> ${consoleInput}`,
                              timestamp: new Date()
                            }]);
                            setConsoleInput('');
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white"
                        placeholder="Enter input..."
                      />
                      <button
                        onClick={() => {
                          setConsoleOutput(prev => [...prev, {
                            type: 'input',
                            content: `> ${consoleInput}`,
                            timestamp: new Date()
                          }]);
                          setConsoleInput('');
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}

                {activePanel === 'collaboration' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Collaboration</h3>
                    
                    {/* Active Users */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Active Users</h4>
                      {collaborators.map((user, index) => (
                        <div key={user.id || index} className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-white">{user.name || `User ${index + 1}`}</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                      ))}
                    </div>

                    {/* Collaboration Tools */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-300">Tools</h4>
                      
                      <button className="w-full flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                        <ShareIcon className="w-4 h-4" />
                        <span>Share Session</span>
                      </button>
                      
                      <button className="w-full flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                        <CommandLineIcon className="w-4 h-4" />
                        <span>Voice Chat</span>
                      </button>
                      
                      <button className="w-full flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                        <EyeIcon className="w-4 h-4" />
                        <span>Screen Share</span>
                      </button>
                    </div>
                  </div>
                )}

                {activePanel === 'ai' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">AI Assistant</h3>
                    
                    {/* AI Chat */}
                    <div className="bg-gray-900 rounded-lg p-3 h-48 overflow-y-auto">
                      {aiAssistant.messages.map((message, index) => (
                        <div key={index} className="mb-3">
                          <div className="text-purple-400 text-sm font-medium">AI:</div>
                          <div className="text-white text-sm">{message.content}</div>
                        </div>
                      ))}
                      {aiAssistant.isProcessing && (
                        <div className="text-purple-400 text-sm animate-pulse">
                          AI is thinking...
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAIRequest('Explain this code', value)}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                      >
                        Explain Code
                      </button>
                      
                      <button
                        onClick={() => handleAIRequest('Optimize this code', value)}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                      >
                        Optimize
                      </button>
                      
                      <button
                        onClick={() => handleAIRequest('Debug this code', value)}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                      >
                        Debug Help
                      </button>
                      
                      <button
                        onClick={() => handleAIRequest('Add comments to this code', value)}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                      >
                        Add Comments
                      </button>
                    </div>
                  </div>
                )}

                {activePanel === 'tutorials' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Tutorials</h3>
                    
                    {tutorials.map((tutorial, index) => (
                      <div key={index} className="bg-gray-900 rounded-lg p-3">
                        <h4 className="text-white font-medium">{tutorial.title}</h4>
                        <p className="text-gray-400 text-sm mt-1">{tutorial.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{tutorial.duration}</span>
                          <button
                            onClick={() => setCurrentTutorial(tutorial)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                          >
                            Start
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activePanel === 'debug' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Debug Console</h3>
                    
                    {/* Breakpoints */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Breakpoints</h4>
                      {debugMode.breakpoints.map((bp, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-900 rounded p-2">
                          <span className="text-white text-sm">Line {bp.line}</span>
                          <button
                            onClick={() => {
                              setDebugMode(prev => ({
                                ...prev,
                                breakpoints: prev.breakpoints.filter(b => b.id !== bp.id)
                              }));
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Variables */}
                    {debugMode.variables.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Variables</h4>
                        {debugMode.variables.map((variable, index) => (
                          <div key={index} className="bg-gray-900 rounded p-2">
                            <span className="text-white text-sm">{variable.name}: </span>
                            <span className="text-green-400 text-sm">{variable.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activePanel === 'files' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Files</h3>
                      <button
                        onClick={() => createNewFile(`untitled-${files.length + 1}.${languageOptions[language].extensions[0]}`)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                      >
                        New File
                      </button>
                    </div>
                    
                    {/* File List */}
                    <div className="space-y-1">
                      {files.map((file) => (
                        <button
                          key={file.id}
                          onClick={() => {
                            setActiveFile(file.id);
                            onChange(file.content);
                          }}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${
                            activeFile === file.id 
                              ? 'bg-blue-600 text-white' 
                              : 'text-gray-400 hover:text-white hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <DocumentTextIcon className="w-4 h-4" />
                            <span className="text-sm">{file.name}</span>
                            {file.isModified && (
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activePanel === 'achievements' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Progress</h3>
                    
                    {/* Learning Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-cyan-400">{learningProgress.totalLines}</div>
                        <div className="text-xs text-gray-400">Lines Written</div>
                      </div>
                      
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-400">{learningProgress.accuracy}%</div>
                        <div className="text-xs text-gray-400">Accuracy</div>
                      </div>
                      
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-400">{learningProgress.currentStreak}</div>
                        <div className="text-xs text-gray-400">Day Streak</div>
                      </div>
                      
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-yellow-400">{achievements.length}</div>
                        <div className="text-xs text-gray-400">Achievements</div>
                      </div>
                    </div>

                    {/* Achievements List */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Achievements</h4>
                      {achievements.map((achievement, index) => (
                        <div key={index} className="bg-gray-900 rounded-lg p-3 flex items-center space-x-3">
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-white">
                  {activeFile ? `${activeFile}.${languageOptions[language].extensions[0]}` : `Main.${languageOptions[language].extensions[0]}`}
                </span>
                
                {/* Code Insights */}
                {codeInsights.errors.length > 0 && (
                  <div className="flex items-center space-x-1 text-red-400">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    <span className="text-xs">{codeInsights.errors.length} errors</span>
                  </div>
                )}
                
                {codeInsights.suggestions.length > 0 && (
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <LightBulbIcon className="w-4 h-4" />
                    <span className="text-xs">{codeInsights.suggestions.length} suggestions</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span>Lines: {value.split('\n').length}</span>
                <span>Characters: {value.length}</span>
                <span>Complexity: {codeInsights.complexity}/10</span>
                <span className={`px-2 py-1 rounded ${
                  codeInsights.quality === 'excellent' ? 'bg-green-900 text-green-400' :
                  codeInsights.quality === 'good' ? 'bg-yellow-900 text-yellow-400' :
                  'bg-red-900 text-red-400'
                }`}>
                  {codeInsights.quality}
                </span>
              </div>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={languageOptions[language]?.language || language}
              value={value}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme={theme}
              options={{
                readOnly,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize,
                tabSize: 4,
                insertSpaces: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                folding: true,
                glyphMargin: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                renderLineHighlight: 'all',
                contextmenu: true,
                mouseWheelZoom: true,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                foldingHighlight: true,
                foldingImportsByDefault: true,
                showFoldingControls: 'always',
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true
                }
              }}
            />
          </div>

          {/* Execution Status Bar */}
          <div className="bg-gray-800 border-t border-gray-700 px-4 py-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Language:</span>
                  <span className="text-white">{language.toUpperCase()}</span>
                </div>
                
                {executionState.executionTime > 0 && (
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Execution: {executionState.executionTime}ms</span>
                  </div>
                )}
                
                {executionState.memoryUsage > 0 && (
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Memory: {executionState.memoryUsage}MB</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {debugMode.isActive && (
                  <div className="flex items-center space-x-2 text-orange-400">
                    <BugAntIcon className="w-4 h-4" />
                    <span>Debug Mode</span>
                  </div>
                )}
                
                <span className="text-gray-400">UTF-8</span>
                <span className="text-gray-400">AI Powered</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <AnimatePresence>
          {aiAssistant.isOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-gray-900 border-l border-gray-700 flex flex-col"
            >
              {/* AI Header */}
              <div className="bg-gradient-to-r from-purple-900 to-pink-900 px-4 py-3 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white font-semibold">AI Learning Assistant</h3>
                </div>
              </div>

              {/* AI Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {aiAssistant.messages.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <SparklesIcon className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                    <p className="text-sm">I'm here to help you learn!</p>
                    <p className="text-xs mt-1">Ask me anything about your code.</p>
                  </div>
                )}

                {aiAssistant.messages.map((message, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <SparklesIcon className="w-5 h-5 text-purple-400 mt-1" />
                      <div className="flex-1">
                        <div className="text-white text-sm">{message.content}</div>
                        {message.suggestions && (
                          <div className="mt-2 space-y-1">
                            {message.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                className="block w-full text-left px-2 py-1 bg-purple-900 hover:bg-purple-800 text-purple-200 rounded text-xs"
                                onClick={() => handleAIRequest(suggestion, value)}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {aiAssistant.isProcessing && (
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <SparklesIcon className="w-5 h-5 text-purple-400 animate-pulse" />
                      <span className="text-purple-400 text-sm">AI is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Quick Actions */}
              <div className="p-4 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAIRequest('Help me understand this code', value)}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs"
                  >
                    Explain
                  </button>
                  
                  <button
                    onClick={() => handleAIRequest('How can I improve this code?', value)}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs"
                  >
                    Improve
                  </button>
                  
                  <button
                    onClick={() => handleAIRequest('Debug this code and find errors', value)}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs"
                  >
                    Debug
                  </button>
                  
                  <button
                    onClick={() => handleAIRequest('Suggest next learning steps', value)}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs"
                  >
                    Learn
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Remote Cursors Overlay */}
      {remoteCursors.map((cursor, index) => (
        <div
          key={index}
          className="absolute pointer-events-none z-50"
          style={{
            left: cursor.x,
            top: cursor.y,
          }}
        >
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg">
            User {cursor.userId}
          </div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
        </div>
      ))}
    </div>
  );
};

export default CodeEditor;