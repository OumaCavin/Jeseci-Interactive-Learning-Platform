// JAC Learning Platform - System Orchestrator Agent Chat by Cavin Otieno
// Enhanced with complete platform orchestration features

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Settings, BarChart3, Zap, Users, Target, TrendingUp,
  Activity, AlertTriangle, CheckCircle, Clock, Lightbulb, Brain,
  BookOpen, Award, Heart, Flame, Star, Crown, Gem, Shield,
  RefreshCw, Play, Pause, SkipForward, RotateCcw, Search,
  Filter, Download, Upload, Share2, Bell, Mail, MessageSquare,
  UserCheck, Users2, UserX, UserPlus, UserMinus, User,
  Globe, Map, Compass, Navigation, Route, MapPin,
  Database, Cloud, Server, HardDrive, Cpu, MemoryStick,
  Gauge,  Battery, Wifi, Signal, Antenna,
  Code, Terminal, Database as DatabaseIcon, Layers,
  Workflow, GitBranch, GitMerge, GitCommit, GitPush,
  Package, Boxes, Container, Archive, FileText,
  Calendar, Clock3, Timer,  Hourglass,
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  Maximize2, Minimize2, X, Plus, Minus, Edit, Trash2,
  Eye, Copy, Link, ExternalLink, Share, Book, Pen,
  Calculator, Mic, Video, Image, Code2, Music, Palette,
  Search as SearchIcon, Filter as FilterIcon, SortAsc,
  SortDesc, Grid, List, Table, Columns, Rows, Bookmark,
  Flag, BookmarkCheck, FlagCheck, FlagX, Tag, Tags,
  Hash, AtSign, Mail as MailIcon, Phone, Video as VideoIcon,
  Camera, Monitor, Smartphone, Tablet, Laptop,
  Circle, Square, Triangle, Hexagon, Octagon,
  Sparkles, Rocket, Satellite, Antenna as SatelliteIcon
} from 'lucide-react';
import gamificationService from '../../services/gamificationService';

// Types and Interfaces
interface AgentStatus {
  id: string;
  name: string;
  type: 'content_curator' | 'evaluator' | 'motivator' | 'progress_tracker' | 'quiz_master';
  status: 'active' | 'idle' | 'busy' | 'offline';
  lastActive: Date;
  currentTask?: string;
  performance: {
    efficiency: number;
    accuracy: number;
    satisfaction: number;
  };
  resources: {
    memory: number;
    cpu: number;
    storage: number;
  };
  connections: string[];
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  agents: string[];
  stages: LearningStage[];
  progress: number;
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  prerequisites?: string[];
  learningObjectives: string[];
  isActive: boolean;
  createdAt: Date;
}

interface LearningStage {
  id: string;
  name: string;
  description: string;
  agentId: string;
  duration: number;
  resources: string[];
  deliverables: string[];
  isCompleted: boolean;
  isActive: boolean;
  progress: number;
}

interface WorkflowTask {
  id: string;
  name: string;
  description: string;
  assignedAgent: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedDuration: number;
  actualDuration?: number;
  dependencies: string[];
  outputs: string[];
  metadata: Record<string, any>;
}

interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  completedTasks: number;
  systemHealth: number;
  overallEfficiency: number;
  learningVelocity: number;
  userSatisfaction: number;
  resourceUtilization: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
  performanceHistory: {
    timestamp: Date;
    efficiency: number;
    tasks: number;
    errors: number;
  }[];
}

interface OptimizationRecommendation {
  id: string;
  type: 'performance' | 'resource' | 'workflow' | 'learning_path';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  actions: string[];
  expectedImprovement: string;
  estimatedTime: number;
  priority: number;
}

const SystemOrchestratorChat: React.FC = () => {
  const [activeView, setActiveView] = useState<'chat' | 'dashboard' | 'orchestration' | 'optimization' | 'monitoring' | 'analytics'>('chat');
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [workflowTasks, setWorkflowTasks] = useState<WorkflowTask[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [optimizationRecommendations, setOptimizationRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [systemFilter, setSystemFilter] = useState<'all' | 'active' | 'idle' | 'offline'>('all');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [selectedOptimization, setSelectedOptimization] = useState<OptimizationRecommendation | null>(null);
  const [systemAlerts, setSystemAlerts] = useState<Array<{id: string, type: 'info' | 'warning' | 'error', message: string, timestamp: Date}>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sample agent statuses
  const sampleAgentStatuses: AgentStatus[] = [
    {
      id: 'content_curator',
      name: 'Content Curator',
      type: 'content_curator',
      status: 'active',
      lastActive: new Date(),
      currentTask: 'Curating React Advanced Concepts',
      performance: {
        efficiency: 89,
        accuracy: 94,
        satisfaction: 92
      },
      resources: {
        memory: 45,
        cpu: 32,
        storage: 67
      },
      connections: ['evaluator', 'progress_tracker']
    },
    {
      id: 'evaluator',
      name: 'Evaluator',
      type: 'evaluator',
      status: 'busy',
      lastActive: new Date(Date.now() - 120000),
      currentTask: 'Assessing JavaScript Fundamentals Quiz',
      performance: {
        efficiency: 85,
        accuracy: 91,
        satisfaction: 88
      },
      resources: {
        memory: 62,
        cpu: 78,
        storage: 43
      },
      connections: ['quiz_master', 'motivator']
    },
    {
      id: 'motivator',
      name: 'Motivator',
      type: 'motivator',
      status: 'active',
      lastActive: new Date(),
      currentTask: 'Updating Goal Progress',
      performance: {
        efficiency: 92,
        accuracy: 96,
        satisfaction: 94
      },
      resources: {
        memory: 38,
        cpu: 28,
        storage: 55
      },
      connections: ['progress_tracker', 'content_curator']
    },
    {
      id: 'progress_tracker',
      name: 'Progress Tracker',
      type: 'progress_tracker',
      status: 'active',
      lastActive: new Date(),
      currentTask: 'Generating Performance Analytics',
      performance: {
        efficiency: 87,
        accuracy: 89,
        satisfaction: 91
      },
      resources: {
        memory: 71,
        cpu: 54,
        storage: 82
      },
      connections: ['evaluator', 'quiz_master', 'motivator']
    },
    {
      id: 'quiz_master',
      name: 'Quiz Master',
      type: 'quiz_master',
      status: 'idle',
      lastActive: new Date(Date.now() - 300000),
      performance: {
        efficiency: 83,
        accuracy: 93,
        satisfaction: 90
      },
      resources: {
        memory: 29,
        cpu: 15,
        storage: 48
      },
      connections: ['evaluator', 'progress_tracker']
    }
  ];

  // Sample learning paths
  const sampleLearningPaths: LearningPath[] = [
    {
      id: '1',
      name: 'Full-Stack JavaScript Mastery',
      description: 'Comprehensive learning path from fundamentals to advanced full-stack development.',
      agents: ['content_curator', 'quiz_master', 'evaluator', 'motivator', 'progress_tracker'],
      stages: [
        {
          id: 'stage_1',
          name: 'JavaScript Fundamentals',
          description: 'Master the core concepts of JavaScript programming.',
          agentId: 'content_curator',
          duration: 480, // 8 hours
          resources: ['Video tutorials', 'Interactive exercises', 'Documentation'],
          deliverables: ['Completed assessments', 'Code samples', 'Concept maps'],
          isCompleted: true,
          isActive: false,
          progress: 100
        },
        {
          id: 'stage_2',
          name: 'React Development',
          description: 'Build modern web applications with React.',
          agentId: 'content_curator',
          duration: 720, // 12 hours
          resources: ['Project tutorials', 'Component library', 'Best practices guide'],
          deliverables: ['React app', 'Component portfolio', 'Deployment'],
          isCompleted: false,
          isActive: true,
          progress: 65
        },
        {
          id: 'stage_3',
          name: 'Backend Integration',
          description: 'Connect frontend to backend services.',
          agentId: 'content_curator',
          duration: 600, // 10 hours
          resources: ['API documentation', 'Database guides', 'Security tutorials'],
          deliverables: ['Full-stack application', 'API integration', 'Database design'],
          isCompleted: false,
          isActive: false,
          progress: 0
        }
      ],
      progress: 55,
      estimatedDuration: 1800, // 30 hours
      difficulty: 'intermediate',
      category: 'Programming',
      learningObjectives: [
        'Master JavaScript fundamentals',
        'Build interactive web applications',
        'Implement full-stack solutions',
        'Deploy production-ready applications'
      ],
      isActive: true,
      createdAt: new Date('2025-11-15')
    }
  ];

  // Sample workflow tasks
  const sampleWorkflowTasks: WorkflowTask[] = [
    {
      id: 'task_1',
      name: 'Curate React Hooks Content',
      description: 'Find and organize the best React Hooks learning resources.',
      assignedAgent: 'content_curator',
      priority: 'high',
      status: 'in_progress',
      progress: 75,
      createdAt: new Date('2025-12-02'),
      startedAt: new Date('2025-12-02T10:00:00'),
      estimatedDuration: 120,
      dependencies: [],
      outputs: ['Curated content list', 'Learning sequence', 'Resource ratings'],
      metadata: {
        category: 'React',
        difficulty: 'intermediate',
        estimatedLearners: 150
      }
    },
    {
      id: 'task_2',
      name: 'Assess JavaScript Quiz Performance',
      description: 'Evaluate and score the latest JavaScript fundamentals quiz.',
      assignedAgent: 'evaluator',
      priority: 'medium',
      status: 'pending',
      progress: 0,
      createdAt: new Date('2025-12-03'),
      estimatedDuration: 90,
      dependencies: ['task_1'],
      outputs: ['Performance report', 'Difficulty analysis', 'Improvement suggestions'],
      metadata: {
        questionsCount: 25,
        participants: 45,
        avgScore: 78.5
      }
    }
  ];

  // Sample system metrics
  const sampleSystemMetrics: SystemMetrics = {
    totalAgents: 5,
    activeAgents: 4,
    totalTasks: 23,
    completedTasks: 18,
    systemHealth: 94,
    overallEfficiency: 87,
    learningVelocity: 12.5,
    userSatisfaction: 91,
    resourceUtilization: {
      cpu: 45,
      memory: 62,
      storage: 38,
      network: 23
    },
    performanceHistory: [
      { timestamp: new Date('2025-12-03T02:00:00'), efficiency: 89, tasks: 4, errors: 0 },
      { timestamp: new Date('2025-12-03T01:30:00'), efficiency: 85, tasks: 3, errors: 1 },
      { timestamp: new Date('2025-12-03T01:00:00'), efficiency: 91, tasks: 5, errors: 0 },
      { timestamp: new Date('2025-12-03T00:30:00'), efficiency: 87, tasks: 4, errors: 0 },
      { timestamp: new Date('2025-12-03T00:00:00'), efficiency: 83, tasks: 3, errors: 1 }
    ]
  };

  // Sample optimization recommendations
  const sampleOptimizations: OptimizationRecommendation[] = [
    {
      id: 'opt_1',
      type: 'performance',
      title: 'Optimize Content Curation Pipeline',
      description: 'The Content Curator is experiencing increased load. Consider redistributing tasks or upgrading resources.',
      impact: 'high',
      confidence: 87,
      actions: [
        'Scale Content Curator resources',
        'Implement load balancing',
        'Optimize content filtering algorithms',
        'Add caching layer for common requests'
      ],
      expectedImprovement: '25% faster content curation, 15% resource efficiency gain',
      estimatedTime: 180, // 3 hours
      priority: 1
    },
    {
      id: 'opt_2',
      type: 'learning_path',
      title: 'Enhance React Learning Path',
      description: 'Learning path completion rate can be improved by adjusting stage dependencies and resource allocation.',
      impact: 'medium',
      confidence: 92,
      actions: [
        'Reduce stage 2 dependencies on stage 3',
        'Add intermediate checkpoints',
        'Implement adaptive difficulty adjustment',
        'Enhance motivation triggers'
      ],
      expectedImprovement: '18% higher completion rate, 12% faster progression',
      estimatedTime: 240, // 4 hours
      priority: 2
    },
    {
      id: 'opt_3',
      type: 'workflow',
      title: 'Automate Task Assignment',
      description: 'Current manual task assignment is causing delays. Implement intelligent task distribution.',
      impact: 'medium',
      confidence: 79,
      actions: [
        'Implement AI-powered task classification',
        'Add agent capability matching',
        'Create dynamic priority scoring',
        'Build automated assignment workflows'
      ],
      expectedImprovement: '30% faster task assignment, 20% better resource utilization',
      estimatedTime: 360, // 6 hours
      priority: 3
    }
  ];

  useEffect(() => {
    // Initialize data
    setAgentStatuses(sampleAgentStatuses);
    setLearningPaths(sampleLearningPaths);
    setWorkflowTasks(sampleWorkflowTasks);
    setSystemMetrics(sampleSystemMetrics);
    setOptimizationRecommendations(sampleOptimizations);
  }, []);

  useEffect(() => {
    // Award points for system monitoring
    if (activeView === 'monitoring') {
      gamificationService.awardPoints(8, 'system_orchestration_view', {
        view_type: 'system_monitoring'
      }).catch(console.warn);
    }
  }, [activeView]);

  useEffect(() => {
    // Auto-refresh system data
    const interval = setInterval(() => {
      if (isSystemActive) {
        // Simulate real-time updates
        setSystemMetrics(prev => prev ? {
          ...prev,
          performanceHistory: [
            ...prev.performanceHistory.slice(1),
            {
              timestamp: new Date(),
              efficiency: 85 + Math.random() * 10,
              tasks: Math.floor(Math.random() * 5) + 1,
              errors: Math.floor(Math.random() * 2)
            }
          ]
        } : null);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isSystemActive, refreshInterval]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'content_curator': return BookOpen;
      case 'evaluator': return Target;
      case 'motivator': return Heart;
      case 'progress_tracker': return TrendingUp;
      case 'quiz_master': return Brain;
      default: return Cpu;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'idle': return 'text-gray-600 bg-gray-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-green-700 bg-green-100 border-green-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const renderChatView = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-indigo-900">System Orchestrator</h3>
          </div>
          <p className="text-indigo-800">
            I'm the central nervous system of your learning platform! I coordinate all agents, 
            optimize workflows, and ensure seamless collaboration between all learning components. 
            How can I orchestrate your learning journey today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveView('orchestration')}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Network className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Agent Coordination</span>
            </div>
            <p className="text-gray-600 text-sm">Manage and coordinate all learning agents</p>
          </button>

          <button
            onClick={() => setActiveView('optimization')}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">System Optimization</span>
            </div>
            <p className="text-gray-600 text-sm">AI-powered performance improvements</p>
          </button>

          <button
            onClick={() => setActiveView('monitoring')}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">System Health</span>
            </div>
            <p className="text-gray-600 text-sm">Real-time monitoring and alerts</p>
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-900">Performance Dashboard</span>
            </div>
            <p className="text-gray-600 text-sm">Comprehensive system analytics</p>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <span className="font-semibold text-gray-900">Deep Analytics</span>
            </div>
            <p className="text-gray-600 text-sm">Advanced insights and predictions</p>
          </button>

          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">System Controls</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">Manage system operations</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsSystemActive(!isSystemActive)}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  isSystemActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {isSystemActive ? 'Active' : 'Paused'}
              </button>
              <button
                onClick={() => setRefreshInterval(prev => prev === 5000 ? 1000 : 5000)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
              >
                {refreshInterval === 5000 ? 'Fast' : 'Normal'} Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Ask me about agent coordination, system optimization, or learning path management..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">System Orchestration Dashboard</h2>
        <div className="flex space-x-2">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {systemMetrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-gray-900">{systemMetrics.systemHealth}%</p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Agents</p>
                  <p className="text-2xl font-bold text-gray-900">{systemMetrics.activeAgents}/{systemMetrics.totalAgents}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Efficiency</p>
                  <p className="text-2xl font-bold text-gray-900">{systemMetrics.overallEfficiency}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Learning Velocity</p>
                  <p className="text-2xl font-bold text-gray-900">{systemMetrics.learningVelocity}</p>
                </div>
                <Rocket className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Utilization</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>CPU</span>
                    <span>{systemMetrics.resourceUtilization.cpu}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemMetrics.resourceUtilization.cpu}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Memory</span>
                    <span>{systemMetrics.resourceUtilization.memory}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemMetrics.resourceUtilization.memory}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Storage</span>
                    <span>{systemMetrics.resourceUtilization.storage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemMetrics.resourceUtilization.storage}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Network</span>
                    <span>{systemMetrics.resourceUtilization.network}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemMetrics.resourceUtilization.network}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Progress</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-semibold">{systemMetrics.totalTasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{systemMetrics.completedTasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-semibold text-yellow-600">{systemMetrics.totalTasks - systemMetrics.completedTasks}</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Completion Rate</span>
                    <span>{Math.round((systemMetrics.completedTasks / systemMetrics.totalTasks) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(systemMetrics.completedTasks / systemMetrics.totalTasks) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentStatuses.map((agent) => {
                const Icon = getAgentIcon(agent.type);
                return (
                  <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Efficiency</span>
                        <span className="font-medium">{agent.performance.efficiency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accuracy</span>
                        <span className="font-medium">{agent.performance.accuracy}%</span>
                      </div>
                      {agent.currentTask && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Current Task:</p>
                          <p className="text-xs font-medium text-gray-700">{agent.currentTask}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderOrchestration = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Agent Orchestration</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowOptimizationModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Optimize System</span>
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Paths</h3>
          <div className="space-y-4">
            {learningPaths.map((path) => (
              <div key={path.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{path.name}</h4>
                    <p className="text-sm text-gray-600">{path.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{path.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${path.progress}%` }}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{path.estimatedDuration / 60}h</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{path.agents.length} agents</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    path.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    path.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    path.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {path.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Tasks</h3>
          <div className="space-y-4">
            {workflowTasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{task.name}</h4>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${task.progress}%` }}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Agent:</span>
                    <span className="font-medium">{task.assignedAgent}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Network Visualization</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Network className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Agent Network Graph</p>
            <p className="text-sm">Interactive visualization of agent connections and dependencies</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOptimization = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">System Optimization</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Run Analysis</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {optimizationRecommendations.map((rec) => (
          <div key={rec.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                    {rec.impact} impact
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
              </div>
              <div className="ml-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">{rec.confidence}%</div>
                  <div className="text-xs text-gray-500">confidence</div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Expected Improvement:</h4>
              <p className="text-sm text-gray-600">{rec.expectedImprovement}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Recommended Actions:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {rec.actions.map((action, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <ChevronRight className="w-3 h-3 mt-0.5 text-purple-600 flex-shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(rec.estimatedTime / 60)}h {rec.estimatedTime % 60}m</span>
              </div>
              <button
                onClick={() => {
                  setSelectedOptimization(rec);
                  setShowOptimizationModal(true);
                }}
                className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization History</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Content Caching Optimization</p>
                <p className="text-sm text-gray-600">Completed 2 hours ago</p>
              </div>
            </div>
            <div className="text-sm text-green-700 font-medium">+15% performance</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Task Load Balancing</p>
                <p className="text-sm text-gray-600">Completed 1 day ago</p>
              </div>
            </div>
            <div className="text-sm text-green-700 font-medium">+22% efficiency</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">System Monitoring</h2>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isSystemActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isSystemActive ? 'Live Monitoring' : 'Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsSystemActive(!isSystemActive)}
            className={`px-3 py-1 rounded text-sm font-medium ${
              isSystemActive 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isSystemActive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {systemMetrics && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Real-time performance chart</p>
                  <p className="text-sm">Live data: {systemMetrics.performanceHistory.length} points</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Agents</span>
                    <span className="font-semibold">{systemMetrics.totalAgents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Tasks</span>
                    <span className="font-semibold">{systemMetrics.totalTasks - systemMetrics.completedTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">User Satisfaction</span>
                    <span className="font-semibold">{systemMetrics.userSatisfaction}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">System Health</span>
                    <span className="font-semibold text-green-600">{systemMetrics.systemHealth}%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Active Alerts</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Status Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Agent</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">CPU</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Memory</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Efficiency</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {agentStatuses.map((agent) => (
                    <tr key={agent.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {React.createElement(getAgentIcon(agent.type), { className: "w-4 h-4 text-gray-500" })}
                          <span className="font-medium text-gray-900">{agent.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                          {agent.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${agent.resources.cpu}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-600">{agent.resources.cpu}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${agent.resources.memory}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-600">{agent.resources.memory}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">{agent.performance.efficiency}%</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {agent.lastActive.toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Deep System Analytics</h2>
        <div className="flex space-x-2">
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            Generate Report
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cross-Agent Insights</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">87%</div>
              <div className="text-sm text-gray-600">Average Collaboration Efficiency</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Content-Evaluator Sync</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress-Motivator Link</span>
                <span className="font-medium">89%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quiz-Tracker Coordination</span>
                <span className="font-medium">85%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Velocity Trends</h3>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">+23%</div>
            <div className="text-sm text-gray-600 mb-4">Improvement vs last month</div>
            <div className="text-xs text-gray-500">Based on cross-agent data analysis</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Bottlenecks</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Content Curation</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-xs text-orange-600">Monitor</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Task Distribution</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600">Optimal</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Resource Allocation</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-yellow-600">Good</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive System Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Next Week Prediction</h4>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">91%</div>
            <div className="text-sm text-gray-600">System efficiency forecast</div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Rocket className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">Learning Acceleration</h4>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">+15%</div>
            <div className="text-sm text-gray-600">Expected velocity increase</div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">System Stability</h4>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">98.5%</div>
            <div className="text-sm text-gray-600">Uptime prediction</div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-gray-900">User Satisfaction</h4>
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-1">93%</div>
            <div className="text-sm text-gray-600">Predicted satisfaction score</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations Engine</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Optimal Learning Sequence</h4>
                <p className="text-blue-800 text-sm mb-2">
                  Based on cross-agent analysis, rearranging the learning path stages could improve completion rates by 18%.
                </p>
                <div className="flex items-center space-x-4 text-xs text-blue-600">
                  <span>Confidence: 89%</span>
                  <span>Impact: High</span>
                  <span>Est. Time: 2h</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Resource Reallocation</h4>
                <p className="text-green-800 text-sm mb-2">
                  Redistributing 15% of Content Curator resources to Evaluator could reduce task completion time by 25%.
                </p>
                <div className="flex items-center space-x-4 text-xs text-green-600">
                  <span>Confidence: 92%</span>
                  <span>Impact: Medium</span>
                  <span>Est. Time: 1h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOptimizationModal = () => {
    if (!showOptimizationModal || !selectedOptimization) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{selectedOptimization.title}</h2>
            <button
              onClick={() => setShowOptimizationModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{selectedOptimization.description}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Expected Impact</h3>
              <p className="text-gray-600">{selectedOptimization.expectedImprovement}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Implementation Steps</h3>
              <ul className="space-y-2">
                {selectedOptimization.actions.map((action, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Estimated Time</h4>
                <p className="text-gray-600">{Math.floor(selectedOptimization.estimatedTime / 60)}h {selectedOptimization.estimatedTime % 60}m</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Confidence Level</h4>
                <p className="text-gray-600">{selectedOptimization.confidence}%</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 mt-8">
            <button
              onClick={() => setShowOptimizationModal(false)}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Apply Optimization
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderNavigation = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex space-x-8">
        {[
          { id: 'chat', label: 'Chat', icon: Cpu },
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'orchestration', label: 'Orchestration', icon: Network },
          { id: 'optimization', label: 'Optimization', icon: Zap },
          { id: 'monitoring', label: 'Monitoring', icon: Activity },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id as any)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              activeView === id 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">System Orchestrator</h1>
                <p className="text-sm text-gray-600">Central coordination and optimization hub</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isSystemActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {isSystemActive ? 'System Active' : 'System Paused'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">{agentStatuses.filter(a => a.status === 'active').length} Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="flex space-x-6">
            {[
              { id: 'chat', label: 'Chat', icon: Cpu },
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'orchestration', label: 'Orchestration', icon: Network },
              { id: 'optimization', label: 'Optimization', icon: Zap },
              { id: 'monitoring', label: 'Monitoring', icon: Activity },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeView === id 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full overflow-y-auto"
          >
            {activeView === 'chat' && renderChatView()}
            {activeView === 'dashboard' && renderDashboard()}
            {activeView === 'orchestration' && renderOrchestration()}
            {activeView === 'optimization' && renderOptimization()}
            {activeView === 'monitoring' && renderMonitoring()}
            {activeView === 'analytics' && renderAnalytics()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Optimization Modal */}
      {renderOptimizationModal()}
      
      <div ref={chatEndRef} />
    </div>
  );
};

export default SystemOrchestratorChat;