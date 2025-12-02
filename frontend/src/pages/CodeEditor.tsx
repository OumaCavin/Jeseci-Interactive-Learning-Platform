// Code Editor - Main code editing component with rich features
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayIcon,
  StopIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  CogIcon,
  CodeBracketIcon,
  DocumentIcon,
  ClockIcon,
  CpuChipIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { useCodeEditorStore } from '../stores/codeEditorStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface CodeEditorProps {
  className?: string;
}

const LANGUAGE_OPTIONS = [
  { id: 'python', name: 'Python', icon: '🐍', color: 'blue' },
  { id: 'jac', name: 'JAC (Jaseci)', icon: '⚡', color: 'purple' },
  { id: 'javascript', name: 'JavaScript', icon: '🟨', color: 'yellow' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷', color: 'blue' },
  { id: 'html', name: 'HTML', icon: '🌐', color: 'orange' },
  { id: 'css', name: 'CSS', icon: '🎨', color: 'blue' },
];

const QUICK_INSERT_SNIPPETS = {
  python: [
    { label: 'Print', code: '\nprint("Hello, World!")' },
    { label: 'For Loop', code: '\nfor i in range(10):\n    print(i)' },
    { label: 'If/Else', code: '\nif condition:\n    print("True")\nelse:\n    print("False")' },
    { label: 'Function', code: '\ndef my_function():\n    return "Hello!"' },
    { label: 'List Comprehension', code: '\nsquares = [x**2 for x in range(10)]' },
    { label: 'Try/Except', code: '\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")' },
  ],
  jac: [
    { label: 'Walker', code: '\nwalker my_walker {\n    can print;\n    print("Hello from JAC!");\n}' },
    { label: 'Node', code: '\nnode my_node {\n    has name, value;\n}' },
    { label: 'Report', code: '\nreport {"status": "completed", "result": "success"};' },
    { label: 'Edge', code: '\nedge my_edge {\n    has weight, type;\n}' },
    { label: 'Module', code: '\nmodule my_module {\n    can process_data with walker entry;\n}' },
    { label: 'Spawn', code: '\nnode_instance = spawn node.my_node(name="test", value=42);' },
  ],
  javascript: [
    { label: 'Console Log', code: '\nconsole.log("Hello, World!");' },
    { label: 'Arrow Function', code: '\nconst greet = (name) => `Hello, ${name}!`;' },
    { label: 'Async/Await', code: '\nasync function fetchData() {\n    const data = await fetch("/api");\n    return data.json();\n}' },
    { label: 'Class', code: '\nclass MyClass {\n    constructor(name) {\n        this.name = name;\n    }\n    \n    greet() {\n        console.log(`Hello, ${this.name}!`);\n    }\n}' },
    { label: 'Array Map', code: '\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);' },
    { label: 'Promise', code: '\nconst promise = new Promise((resolve, reject) => {\n    setTimeout(() => resolve("Success!"), 1000);\n});' },
  ],
  typescript: [
    { label: 'Interface', code: '\ninterface User {\n    id: number;\n    name: string;\n    email: string;\n}' },
    { label: 'Type Alias', code: '\ntype Status = "pending" | "approved" | "rejected";' },
    { label: 'Generic Function', code: '\nfunction identity<T>(arg: T): T {\n    return arg;\n}' },
    { label: 'Class with Types', code: '\nclass Calculator {\n    add(a: number, b: number): number {\n        return a + b;\n    }\n}' },
    { label: 'Enum', code: '\nenum Color {\n    Red = "red",\n    Green = "green",\n    Blue = "blue"\n}' },
    { label: 'Union Type', code: '\nfunction processValue(value: string | number): string {\n    return value.toString();\n}' },
  ],
  html: [
    { label: 'Basic Structure', code: '\n<div class="container">\n    <h1>Hello World</h1>\n    <p>Welcome to HTML!</p>\n</div>' },
    { label: 'Form', code: '\n<form>\n    <input type="text" placeholder="Enter name">\n    <button type="submit">Submit</button>\n</form>' },
    { label: 'Navigation', code: '\n<nav>\n    <ul>\n        <li><a href="#home">Home</a></li>\n        <li><a href="#about">About</a></li>\n        <li><a href="#contact">Contact</a></li>\n    </ul>\n</nav>' },
    { label: 'Table', code: '\n<table>\n    <thead>\n        <tr><th>Name</th><th>Age</th></tr>\n    </thead>\n    <tbody>\n        <tr><td>John</td><td>25</td></tr>\n    </tbody>\n</table>' },
  ],
  css: [
    { label: 'Flexbox', code: '\n.container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}' },
    { label: 'Grid', code: '\n.grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 1rem;\n}' },
    { label: 'Animation', code: '\n@keyframes fadeIn {\n    from { opacity: 0; }\n    to { opacity: 1; }\n}\n.element {\n    animation: fadeIn 1s ease-in;\n}' },
    { label: 'Media Query', code: '\n@media (max-width: 768px) {\n    .container {\n        flex-direction: column;\n    }\n}' },
  ],
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ className = '' }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    code,
    selectedLanguage,
    isExecuting,
    executionResult,
    settings,
    templates,
    snippets,
    showSettings,
    showTemplates,
    showSnippets,
    setCode,
    setLanguage,
    executeCode,
    stopExecution,
    duplicateCode,
    resetCode,
    insertAtCursor,
    setShowSettings,
    setShowTemplates,
    setShowSnippets,
    saveSnippet,
    deleteSnippet,
    clearOutput,
  } = useCodeEditorStore();

  const { user } = useAuthStore();
  const [showSaveSnippet, setShowSaveSnippet] = useState(false);
  const [snippetName, setSnippetName] = useState('');

  const currentLanguage = LANGUAGE_OPTIONS.find(lang => lang.id === selectedLanguage);
  const snippetsForLanguage = snippets.filter(s => s.language === selectedLanguage);

  useEffect(() => {
    // Focus textarea on language change
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selectedLanguage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeCode();
    }
  };

  const handleSaveSnippet = () => {
    if (snippetName.trim()) {
      saveSnippet({
        name: snippetName.trim(),
        code,
        language: selectedLanguage,
        tags: [selectedLanguage, 'custom']
      });
      setSnippetName('');
      setShowSaveSnippet(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 1) {
      return `${(seconds * 1000).toFixed(0)}ms`;
    }
    return `${seconds.toFixed(2)}s`;
  };

  const getStatusIcon = () => {
    if (!executionResult) return null;
    
    if (executionResult.success) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    } else {
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    if (!executionResult) return 'gray';
    return executionResult.success ? 'green' : 'red';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 mb-4 lg:mb-0">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <CodeBracketIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Code Editor
                </h1>
                <p className="text-gray-600">
                  Write, test, and execute code with real-time feedback
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.icon} {lang.name}
                  </option>
                ))}
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2"
              >
                <CogIcon className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 h-[calc(100vh-280px)] flex flex-col">
              {/* Editor Header */}
              <div className="p-4 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currentLanguage?.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {currentLanguage?.name} Editor
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{code.split('\n').length} lines</span>
                        <span>•</span>
                        <span>{code.length} characters</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Template Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="flex items-center gap-2"
                    >
                      <DocumentIcon className="h-4 w-4" />
                      Templates
                    </Button>
                    
                    {/* Snippet Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSnippets(!showSnippets)}
                      className="flex items-center gap-2"
                    >
                      <BookmarkIcon className="h-4 w-4" />
                      Snippets
                    </Button>
                  </div>
                </div>
              </div>

              {/* Editor Controls */}
              <div className="p-4 border-b border-gray-200/50 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {!isExecuting ? (
                      <Button
                        onClick={() => executeCode()}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        size="sm"
                      >
                        <PlayIcon className="h-4 w-4" />
                        Run Code
                      </Button>
                    ) : (
                      <Button
                        onClick={stopExecution}
                        variant="outline"
                        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                        size="sm"
                      >
                        <StopIcon className="h-4 w-4" />
                        Stop
                      </Button>
                    )}
                    
                    <Button
                      onClick={duplicateCode}
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <DocumentDuplicateIcon className="h-4 w-4" />
                      Copy
                    </Button>
                    
                    <Button
                      onClick={resetCode}
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      Reset
                    </Button>
                    
                    <Button
                      onClick={() => setShowSaveSnippet(!showSaveSnippet)}
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <BookmarkIcon className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Press Ctrl+Enter to run
                  </div>
                </div>
                
                {/* Quick Insert Buttons */}
                <div className="flex flex-wrap gap-2">
                  {QUICK_INSERT_SNIPPETS[selectedLanguage as keyof typeof QUICK_INSERT_SNIPPETS]?.map((snippet) => (
                    <button
                      key={snippet.label}
                      onClick={() => insertAtCursor(snippet.code)}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      + {snippet.label}
                    </button>
                  ))}
                </div>

                {/* Save Snippet Input */}
                <AnimatePresence>
                  {showSaveSnippet && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 flex gap-2"
                    >
                      <input
                        type="text"
                        value={snippetName}
                        onChange={(e) => setSnippetName(e.target.value)}
                        placeholder="Snippet name..."
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveSnippet()}
                      />
                      <Button size="sm" onClick={handleSaveSnippet}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowSaveSnippet(false)}
                      >
                        Cancel
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Code Input */}
              <div className="flex-1 p-4">
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={`Write your ${currentLanguage?.name} code here...`}
                  className="w-full h-full resize-none font-mono text-sm leading-relaxed bg-gray-50 border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    lineHeight: '1.6',
                  }}
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Output Panel */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <div className="p-4 border-b border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span>📺</span>
                  <span>Output</span>
                  {isExecuting && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"
                    />
                  )}
                </h3>
              </div>
              
              <div className="p-4 max-h-64 overflow-auto">
                <AnimatePresence mode="wait">
                  {isExecuting ? (
                    <motion.div
                      key="executing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                      </div>
                      <span>Executing {currentLanguage?.name} code...</span>
                    </motion.div>
                  ) : executionResult ? (
                    <motion.div
                      key="output"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      {/* Status */}
                      <div className="flex items-center gap-2">
                        {getStatusIcon()}
                        <span className={`text-sm font-medium text-${getStatusColor()}-600`}>
                          {executionResult.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                      
                      {/* Output */}
                      <div className="font-mono text-sm whitespace-pre-wrap text-gray-800 bg-gray-50 p-3 rounded border">
                        {executionResult.output || executionResult.error || 'No output'}
                      </div>
                      
                      {/* Metrics */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          {formatTime(executionResult.executionTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <CpuChipIcon className="h-3 w-3" />
                          {executionResult.memoryUsage}MB
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearOutput}
                          className="text-xs h-6"
                        >
                          Clear
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-gray-500 italic text-center py-8">
                      <div className="text-3xl mb-2">🚀</div>
                      Execute your code to see the output here...
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {/* Templates Panel */}
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                    <div className="p-4 border-b border-gray-200/50">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <DocumentIcon className="h-5 w-5 text-blue-600" />
                        Code Templates
                      </h3>
                    </div>
                    <div className="p-4 max-h-48 overflow-auto space-y-2">
                      {templates
                        .filter(template => template.language === selectedLanguage)
                        .map((template) => (
                          <div
                            key={template.id}
                            className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              setCode(template.code);
                              setShowTemplates(false);
                            }}
                          >
                            <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {template.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Snippets Panel */}
            <AnimatePresence>
              {showSnippets && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                    <div className="p-4 border-b border-gray-200/50">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <BookmarkIcon className="h-5 w-5 text-purple-600" />
                        Saved Snippets
                      </h3>
                    </div>
                    <div className="p-4 max-h-48 overflow-auto space-y-2">
                      {snippetsForLanguage.length > 0 ? (
                        snippetsForLanguage.map((snippet) => (
                          <div
                            key={snippet.id}
                            className="p-3 bg-gray-50 rounded-lg group"
                          >
                            <div className="flex items-start justify-between">
                              <div 
                                className="flex-1 cursor-pointer"
                                onClick={() => {
                                  setCode(snippet.code);
                                  setShowSnippets(false);
                                }}
                              >
                                <h4 className="font-medium text-gray-900 mb-1">{snippet.name}</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {snippet.code.substring(0, 100)}...
                                </p>
                              </div>
                              <button
                                onClick={() => deleteSnippet(snippet.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <BookmarkIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No saved snippets yet</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8"
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CogIcon className="h-5 w-5 text-gray-600" />
                    Editor Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size
                      </label>
                      <select
                        value={settings.fontSize}
                        onChange={(e) => useCodeEditorStore.getState().updateSettings({ fontSize: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={12}>12px</option>
                        <option value={14}>14px</option>
                        <option value={16}>16px</option>
                        <option value={18}>18px</option>
                        <option value={20}>20px</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) => useCodeEditorStore.getState().updateSettings({ theme: e.target.value as 'dark' | 'light' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Execution Timeout (seconds)
                      </label>
                      <input
                        type="number"
                        value={settings.executionTimeout}
                        onChange={(e) => useCodeEditorStore.getState().updateSettings({ executionTimeout: parseInt(e.target.value) })}
                        min="5"
                        max="120"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Memory Limit (MB)
                      </label>
                      <input
                        type="number"
                        value={settings.memoryLimit}
                        onChange={(e) => useCodeEditorStore.getState().updateSettings({ memoryLimit: parseInt(e.target.value) })}
                        min="64"
                        max="1024"
                        step="64"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={settings.autoSave}
                          onChange={(e) => useCodeEditorStore.getState().updateSettings({ autoSave: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Enable auto-save
                        </label>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => useCodeEditorStore.getState().resetSettings()}
                      >
                        Reset to Defaults
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CodeEditor;