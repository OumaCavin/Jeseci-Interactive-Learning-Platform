import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useLearningStore } from '../stores/learningStore';
import { Card } from '../components/ui';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  PlusIcon,
  MinusIcon,
  ArrowsPointingOutIcon,
  ArrowPathIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  StarIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

// Types for knowledge graph visualization
interface GraphNode {
  id: string;
  type: 'learning_path' | 'module' | 'concept' | 'lesson' | 'assessment';
  title: string;
  x: number;
  y: number;
  size: number;
  color: string;
  data: any;
  isCompleted?: boolean;
  progress?: number;
  description?: string;
  difficulty_level?: string;
  learning_objectives?: string[];
  prerequisites?: string[];
  view_count?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  type: 'prerequisite' | 'contains' | 'related' | 'leads_to' | 'mastery';
  strength: number;
  data: any;
}

interface LayoutType {
  name: string;
  value: 'force' | 'hierarchical' | 'circular' | 'grid';
}

interface FilterState {
  difficulty: string[];
  concept: string[];
  nodeTypes: string[];
  showCompleted: boolean;
  showInProgress: boolean;
  showNotStarted: boolean;
}

// Graph loading and error states
interface LoadingState {
  graph: boolean;
  analytics: boolean;
  search: boolean;
  agents: boolean;
  chat: boolean;
}

interface ErrorState {
  graph: string | null;
  analytics: string | null;
  search: string;
  agents: string | null;
  chat: string | null;
}

const KnowledgeGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { user } = useAuthStore();
  const { learningPaths } = useLearningStore();
  
  // Core graph state
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter and layout state
  const [filters, setFilters] = useState<FilterState>({
    difficulty: [],
    concept: [],
    nodeTypes: [],
    showCompleted: true,
    showInProgress: true,
    showNotStarted: true
  });
  const [layout, setLayout] = useState<LayoutType>({ name: 'Force Directed', value: 'force' });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [activeView, setActiveView] = useState<'graph' | 'concepts' | 'ai_chat'>('graph');
  
  // AI Chat state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [concepts, setConcepts] = useState<any[]>([]);
  const [graphLearningPaths, setGraphLearningPaths] = useState<any[]>([]);
  const [availableAgents] = useState([
    { type: 'learning_assistant', name: 'Learning Assistant', role: 'Guide your learning journey', specializations: ['curriculum', 'pathfinding'] },
    { type: 'concept_explainer', name: 'Concept Explainer', role: 'Explain complex topics', specializations: ['theory', 'examples'] },
    { type: 'code_reviewer', name: 'Code Reviewer', role: 'Review your code', specializations: ['best practices', 'debugging'] }
  ]);
  const [selectedAgent, setSelectedAgent] = useState('learning_assistant');
  
  // Loading and error states
  const [loading, setLoading] = useState<LoadingState>({
    graph: true,
    analytics: false,
    search: false,
    agents: false,
    chat: false
  });
  
  const [errors, setErrors] = useState<ErrorState>({
    graph: null,
    analytics: null,
    search: '',
    agents: null,
    chat: null
  });

  // Generate mock knowledge graph data based on learning paths
  useEffect(() => {
    const generateMockGraph = () => {
      const mockNodes: GraphNode[] = [];
      const mockEdges: GraphEdge[] = [];
      
      // Create nodes for each learning path
      learningPaths.forEach((path, pathIndex) => {
        const pathNode: GraphNode = {
          id: `path-${path.id}`,
          type: 'learning_path',
          title: path.title || `Learning Path ${pathIndex + 1}`,
          x: 400 + (Math.cos(pathIndex * 2 * Math.PI / learningPaths.length) * 300),
          y: 300 + (Math.sin(pathIndex * 2 * Math.PI / learningPaths.length) * 200),
          size: 40,
          color: getDifficultyColor(path.difficulty || 'intermediate'),
          data: path,
          progress: Math.floor(Math.random() * 100),
          isCompleted: Math.random() > 0.7,
          description: path.description || 'A comprehensive learning path',
          difficulty_level: path.difficulty || 'intermediate'
        };
        mockNodes.push(pathNode);
        
        // Add modules for each learning path
        const modules = [
          { id: `${path.id}-module-1`, title: 'Introduction to Concepts', difficulty: 'beginner' },
          { id: `${path.id}-module-2`, title: 'Core Principles', difficulty: 'intermediate' },
          { id: `${path.id}-module-3`, title: 'Advanced Applications', difficulty: 'advanced' }
        ];
        
        modules.forEach((module, moduleIndex) => {
          const moduleNode: GraphNode = {
            id: module.id,
            type: 'module',
            title: module.title,
            x: pathNode.x + (Math.random() - 0.5) * 150,
            y: pathNode.y + (Math.random() - 0.5) * 150,
            size: 25,
            color: getDifficultyColor(module.difficulty),
            data: { ...module, learning_path: path.id },
            progress: Math.floor(Math.random() * 100),
            isCompleted: Math.random() > 0.6,
            description: `Module covering ${module.title}`,
            difficulty_level: module.difficulty,
            learning_objectives: [
              'Understand core concepts',
              'Apply principles',
              'Practice with exercises'
            ]
          };
          mockNodes.push(moduleNode);
          
          // Add edges from path to module
          mockEdges.push({
            source: pathNode.id,
            target: moduleNode.id,
            type: 'contains',
            strength: 1.0,
            data: { relationship: 'contains' }
          });
          
          // Add concepts for each module
          const concepts = [
            { id: `${module.id}-concept-1`, title: 'Basic Principles' },
            { id: `${module.id}-concept-2`, title: 'Key Techniques' },
            { id: `${module.id}-concept-3`, title: 'Best Practices' }
          ];
          
          concepts.forEach((concept, conceptIndex) => {
            const conceptNode: GraphNode = {
              id: concept.id,
              type: 'concept',
              title: concept.title,
              x: moduleNode.x + (Math.random() - 0.5) * 100,
              y: moduleNode.y + (Math.random() - 0.5) * 100,
              size: 15,
              color: getDifficultyColor('intermediate'),
              data: concept,
              progress: Math.floor(Math.random() * 100),
              description: `Concept: ${concept.title}`,
              difficulty_level: 'intermediate',
              view_count: Math.floor(Math.random() * 1000)
            };
            mockNodes.push(conceptNode);
            
            // Add edges from module to concept
            mockEdges.push({
              source: moduleNode.id,
              target: conceptNode.id,
              type: 'contains',
              strength: 0.8,
              data: { relationship: 'contains' }
            });
          });
        });
        
        // Add prerequisite relationships between modules in same path
        for (let i = 1; i < modules.length; i++) {
          const prevModuleId = `${path.id}-module-${i}`;
          const currentModuleId = `${path.id}-module-${i + 1}`;
          
          mockEdges.push({
            source: prevModuleId,
            target: currentModuleId,
            type: 'prerequisite',
            strength: 0.9,
            data: { relationship: 'prerequisite' }
          });
        }
      });
      
      // Generate some concepts
      const generalConcepts = [
        { id: 'concept-object-oriented', title: 'Object-Oriented Programming', type: 'concept' },
        { id: 'concept-data-structures', title: 'Data Structures', type: 'concept' },
        { id: 'concept-algorithms', title: 'Algorithms', type: 'concept' },
        { id: 'concept-web-dev', title: 'Web Development', type: 'concept' }
      ];
      
      generalConcepts.forEach((concept, index) => {
        const conceptNode: GraphNode = {
          id: concept.id,
          type: 'concept',
          title: concept.title,
          x: 200 + (index % 2) * 400,
          y: 100 + Math.floor(index / 2) * 200,
          size: 18,
          color: '#8B5CF6',
          data: concept,
          description: `Core concept: ${concept.title}`,
          difficulty_level: 'intermediate',
          view_count: Math.floor(Math.random() * 2000),
          learning_objectives: [
            'Master fundamental principles',
            'Apply in real-world scenarios',
            'Build practical projects'
          ]
        };
        mockNodes.push(conceptNode);
      });
      
      setNodes(mockNodes);
      setEdges(mockEdges);
      
      // Generate concepts for concepts view
      setConcepts(mockNodes.filter(n => n.type === 'concept'));
      setGraphLearningPaths(learningPaths);
    };
    
    generateMockGraph();
    setLoading(prev => ({ ...prev, graph: false }));
  }, [learningPaths]);

  // Load analytics data (mock for now)
  useEffect(() => {
    const loadAnalytics = () => {
      setTimeout(() => {
        setLoading(prev => ({ ...prev, analytics: false }));
      }, 1000);
    };
    loadAnalytics();
  }, []);

  // Get color for difficulty level
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10B981'; // green
      case 'intermediate': return '#F59E0B'; // amber
      case 'advanced': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  // Get color for edge type
  const getEdgeColor = (edgeType: string) => {
    switch (edgeType) {
      case 'prerequisite': return '#EF4444';
      case 'contains': return '#3B82F6';
      case 'related': return '#8B5CF6';
      case 'leads_to': return '#10B981';
      case 'mastery': return '#10B981';
      default: return '#6B7280';
    }
  };

  // Get node icon based on type
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'learning_path': return '📚';
      case 'module': return '📖';
      case 'concept': return '💡';
      case 'lesson': return '📝';
      case 'assessment': return '✅';
      default: return '●';
    }
  };

  // Get node type icon for sidebar
  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'learning_path': return <BookOpenIcon className="w-5 h-5" />;
      case 'module': return <AcademicCapIcon className="w-5 h-5" />;
      case 'concept': return <CodeBracketIcon className="w-5 h-5" />;
      case 'lesson': return <StarIcon className="w-5 h-5" />;
      case 'assessment': return <StarIcon className="w-5 h-5" />;
      default: return <StarIcon className="w-5 h-5" />;
    }
  };

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
  }, []);

  // Handle canvas click (deselect)
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setSelectedNode(null);
    }
  }, []);

  // Filter nodes based on search and filters
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         node.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply difficulty filter
    if (filters.difficulty.length > 0) {
      if (!filters.difficulty.includes(node.difficulty_level || '')) return false;
    }

    // Apply node type filter
    if (filters.nodeTypes.length > 0) {
      if (!filters.nodeTypes.includes(node.type)) return false;
    }

    // Apply status filter
    if (node.type === 'learning_path' || node.type === 'module') {
      if (node.isCompleted && !filters.showCompleted) return false;
      if (!node.isCompleted && node.progress && node.progress > 0 && !filters.showInProgress) return false;
      if (!node.isCompleted && (!node.progress || node.progress === 0) && !filters.showNotStarted) return false;
    }

    return matchesSearch;
  });

  // Handle search with debouncing
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  // Handle chat submission
  const handleChatSubmit = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: chatMessage,
      timestamp: new Date().toISOString(),
      agent_type: selectedAgent
    };

    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    setLoading(prev => ({ ...prev, chat: true }));

    // Mock AI response
    setTimeout(() => {
      const agentMessage = {
        type: 'agent',
        content: generateAIResponse(chatMessage, selectedAgent),
        agent_name: availableAgents.find(a => a.type === selectedAgent)?.name || 'AI Assistant',
        agent_type: selectedAgent,
        timestamp: new Date().toISOString(),
        confidence_score: 0.85
      };

      setChatHistory(prev => [...prev, agentMessage]);
      setLoading(prev => ({ ...prev, chat: false }));
    }, 1500);
  };

  // Generate mock AI responses
  const generateAIResponse = (message: string, agentType: string) => {
    const responses = {
      learning_assistant: [
        "Based on your current progress, I recommend focusing on the intermediate modules first. They build a strong foundation for advanced topics.",
        "I can help you create a personalized learning path. What specific areas of JAC programming are you most interested in?",
        "Your learning pattern shows you're making great progress! Let's set some achievable goals for next week."
      ],
      concept_explainer: [
        "Object-Spatial Programming in JAC is a paradigm that treats objects as spatial entities with relationships and behaviors.",
        "Think of data structures as containers with different organizational principles - like arrays (contiguous) vs linked lists (scattered but connected).",
        "Algorithms are like recipes - step-by-step instructions that transform input into desired output efficiently."
      ],
      code_reviewer: [
        "I notice you could improve variable naming to be more descriptive. This makes your code self-documenting.",
        "Consider extracting this logic into a separate function. It will improve code reusability and testability.",
        "Great work on the structure! Just a few suggestions for optimization and best practices."
      ]
    };
    
    const agentResponses = responses[agentType as keyof typeof responses] || responses.learning_assistant;
    return agentResponses[Math.floor(Math.random() * agentResponses.length)];
  };

  // Calculate statistics from current graph data
  const stats = {
    totalPaths: nodes.filter(n => n.type === 'learning_path').length,
    totalModules: nodes.filter(n => n.type === 'module').length,
    totalConcepts: nodes.filter(n => n.type === 'concept').length,
    completedPaths: nodes.filter(n => n.type === 'learning_path' && n.isCompleted).length,
    completedModules: nodes.filter(n => n.type === 'module' && n.isCompleted).length,
    averageProgress: nodes.filter(n => n.type === 'learning_path' || n.type === 'module')
      .reduce((sum, node) => sum + (node.progress || 0), 0) / 
      Math.max(nodes.filter(n => n.type === 'learning_path' || n.type === 'module').length, 1),
    totalNodes: nodes.length,
    totalEdges: edges.length
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading.graph) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card variant="glass" padding="lg" className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Loading Knowledge Graph...
            </h2>
            <p className="text-white/80">
              Visualizing your learning ecosystem
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 lg:mb-0">Knowledge Graph</h1>
        
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search concepts, modules, paths..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              Filters
            </button>
            
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Reset View
            </button>
            
            <select
              value={layout.value}
              onChange={(e) => setLayout({ name: e.target.value, value: e.target.value as any })}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="force">Force Directed</option>
              <option value="hierarchical">Hierarchical</option>
              <option value="circular">Circular</option>
              <option value="grid">Grid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {errors.graph && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="font-medium">Error Loading Data</span>
          </div>
          <p className="text-red-300 mt-2">{errors.graph}</p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { key: 'graph', label: 'Knowledge Graph', icon: '🕸️' },
          { key: 'concepts', label: 'Concepts', icon: '💡' },
          { key: 'ai_chat', label: 'AI Assistant', icon: '🤖' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              activeView === tab.key
                ? 'bg-white/20 text-white border border-white/30'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeView === 'ai_chat' ? (
        // AI Chat Interface
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[600px]">
          {/* Agent Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card variant="glass" padding="lg" className="h-full">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <span>🤖</span>
                <span>AI Agents</span>
              </h3>
              
              <div className="space-y-2">
                {availableAgents.map((agent) => (
                  <button
                    key={agent.type}
                    onClick={() => setSelectedAgent(agent.type)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedAgent === agent.type
                        ? 'bg-white/20 border border-white/30'
                        : 'bg-white/5 border border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium text-white text-sm">{agent.name}</div>
                    <div className="text-xs text-white/80">{agent.role}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {agent.specializations.slice(0, 2).map((spec: string, index: number) => (
                        <span key={index} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card variant="glass" padding="none" className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-white/20">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <span>💬</span>
                  <span>Chat with AI</span>
                  <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    {availableAgents.find(a => a.type === selectedAgent)?.name || 'Agent'}
                  </span>
                </h3>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {chatHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🤖</div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Start a conversation
                      </h3>
                      <p className="text-white/80">
                        Ask about JAC programming, get learning recommendations, or request help!
                      </p>
                    </div>
                  ) : (
                    chatHistory.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${
                          message.type === 'user'
                            ? 'bg-blue-500/20 border-blue-400/30'
                            : 'bg-white/10 border-white/20'
                        } border rounded-2xl px-4 py-3`}>
                          <div className="text-white whitespace-pre-wrap">
                            {message.content}
                          </div>
                          {message.type === 'agent' && message.confidence_score && (
                            <div className="text-xs text-white/70 mt-2">
                              Confidence: {(message.confidence_score * 100).toFixed(0)}%
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit();
                      }
                    }}
                    placeholder="Ask me about JAC programming..."
                    disabled={loading.chat}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent disabled:opacity-50"
                  />
                  <button
                    onClick={handleChatSubmit}
                    disabled={!chatMessage.trim() || loading.chat}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {loading.chat ? (
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Send</span>
                    )}
                  </button>
                </div>
                
                {/* Quick suggestions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "What should I learn first in JAC?",
                    "Explain Object-Spatial Programming",
                    "Help me with a coding problem",
                    "Create a learning path for me"
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setChatMessage(suggestion)}
                      className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : activeView === 'concepts' ? (
        // Concepts List View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((concept, index) => (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" padding="lg" className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{concept.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        concept.difficulty_level === 'beginner' ? 'bg-green-500/20 text-green-300' :
                        concept.difficulty_level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                        concept.difficulty_level === 'advanced' ? 'bg-red-500/20 text-red-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {concept.difficulty_level}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-white/70">{concept.view_count || 0} views</span>
                </div>
                
                <p className="text-white/90 text-sm mb-4 line-clamp-3">
                  {concept.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {concept.learning_objectives?.slice(0, 3).map((objective: string, objIndex: number) => (
                    <span key={objIndex} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                      {objective}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/70 capitalize">
                    {concept.type.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => {
                      // Track concept interaction
                      console.log(`Studying concept: ${concept.title}`);
                    }}
                    className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    Study
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        // Knowledge Graph View
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Graph Area */}
          <div className="lg:col-span-3">
            <Card variant="glass" padding="lg" className="h-[600px] relative overflow-hidden">
              {/* Graph Controls */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                  onClick={() => setZoom(Math.min(zoom * 1.2, 3))}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(Math.max(zoom * 0.8, 0.3))}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <ArrowsPointingOutIcon className="w-4 h-4" />
                </button>
              </div>

              {/* SVG Graph */}
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox={`${-pan.x} ${-pan.y} ${800 / zoom} ${500 / zoom}`}
                onClick={handleCanvasClick}
                className="cursor-crosshair"
              >
                {/* Edges */}
                <g>
                  {edges.map((edge, index) => {
                    const sourceNode = filteredNodes.find(n => n.id === edge.source);
                    const targetNode = filteredNodes.find(n => n.id === edge.target);
                    
                    if (!sourceNode || !targetNode) return null;
                    
                    return (
                      <motion.line
                        key={`${edge.source}-${edge.target}-${index}`}
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={getEdgeColor(edge.type)}
                        strokeWidth={edge.strength * 2}
                        strokeOpacity={0.6}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.01 }}
                      />
                    );
                  })}
                </g>

                {/* Nodes */}
                <g>
                  {filteredNodes.map((node) => (
                    <motion.g
                      key={node.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="cursor-pointer"
                      onClick={() => handleNodeClick(node)}
                    >
                      {/* Node Circle */}
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size}
                        fill={node.color}
                        stroke="white"
                        strokeWidth={selectedNode?.id === node.id ? 4 : 2}
                        className="drop-shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      />
                      
                      {/* Progress Ring for completed nodes */}
                      {node.progress !== undefined && node.progress > 0 && (
                        <motion.circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size + 3}
                          fill="none"
                          stroke={node.isCompleted ? "#10B981" : "#3B82F6"}
                          strokeWidth={2}
                          strokeDasharray={`${2 * Math.PI * (node.size + 3)}`}
                          strokeDashoffset={`${2 * Math.PI * (node.size + 3) * (1 - node.progress / 100)}`}
                          className="drop-shadow-lg"
                          transform={`rotate(-90 ${node.x} ${node.y})`}
                        />
                      )}
                      
                      {/* Node Icon */}
                      <text
                        x={node.x}
                        y={node.y + (node.type === 'concept' ? 4 : 6)}
                        textAnchor="middle"
                        className="text-white pointer-events-none select-none"
                        style={{ fontSize: node.type === 'concept' ? '10px' : '12px' }}
                      >
                        {getNodeIcon(node.type)}
                      </text>
                      
                      {/* Node Label */}
                      {zoom > 0.7 && (
                        <text
                          x={node.x}
                          y={node.y + node.size + 15}
                          textAnchor="middle"
                          className="text-white text-sm pointer-events-none select-none"
                          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                        >
                          {node.title.length > 15 ? node.title.substring(0, 15) + '...' : node.title}
                        </text>
                      )}
                    </motion.g>
                  ))}
                </g>
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Learning Paths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span>Concepts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>Lessons</span>
                  </div>
                </div>
                
                {/* Edge Types Legend */}
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="text-xs text-gray-300 mb-1">Relationships:</div>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-red-500"></div>
                      <span>Prerequisite</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-blue-500"></div>
                      <span>Contains</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-purple-500"></div>
                      <span>Related</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            {showStats && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card variant="glass" padding="lg">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AcademicCapIcon className="w-5 h-5" />
                    Statistics
                    {loading.analytics && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-white">
                      <span>Total Nodes:</span>
                      <span className="font-semibold">{stats.totalNodes}</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Total Edges:</span>
                      <span className="font-semibold">{stats.totalEdges}</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Learning Paths:</span>
                      <span className="font-semibold">{stats.completedPaths}/{stats.totalPaths}</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Modules:</span>
                      <span className="font-semibold">{stats.completedModules}/{stats.totalModules}</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Concepts:</span>
                      <span className="font-semibold">{stats.totalConcepts}</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Avg. Progress:</span>
                      <span className="font-semibold">{stats.averageProgress.toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card variant="glass" padding="lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
                    
                    {/* Node Type Filter */}
                    <div className="mb-4">
                      <label className="text-sm text-gray-300 mb-2 block">Node Types</label>
                      <div className="space-y-2">
                        {[
                          { value: 'learning_path', label: 'Learning Paths', icon: '📚' },
                          { value: 'module', label: 'Modules', icon: '📖' },
                          { value: 'concept', label: 'Concepts', icon: '💡' },
                          { value: 'lesson', label: 'Lessons', icon: '📝' },
                          { value: 'assessment', label: 'Assessments', icon: '✅' }
                        ].map((nodeType) => (
                          <label key={nodeType.value} className="flex items-center text-white text-sm">
                            <input
                              type="checkbox"
                              checked={filters.nodeTypes.includes(nodeType.value)}
                              onChange={(e) => {
                                const updatedTypes = e.target.checked
                                  ? [...filters.nodeTypes, nodeType.value]
                                  : filters.nodeTypes.filter(t => t !== nodeType.value);
                                handleFilterChange('nodeTypes', updatedTypes);
                              }}
                              className="mr-2 rounded"
                            />
                            <span className="mr-2">{nodeType.icon}</span>
                            <span className="capitalize">{nodeType.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty Filter */}
                    <div className="mb-4">
                      <label className="text-sm text-gray-300 mb-2 block">Difficulty</label>
                      <div className="space-y-2">
                        {['beginner', 'intermediate', 'advanced'].map((difficulty) => (
                          <label key={difficulty} className="flex items-center text-white text-sm">
                            <input
                              type="checkbox"
                              checked={filters.difficulty.includes(difficulty)}
                              onChange={(e) => {
                                const updatedDifficulty = e.target.checked
                                  ? [...filters.difficulty, difficulty]
                                  : filters.difficulty.filter(d => d !== difficulty);
                                handleFilterChange('difficulty', updatedDifficulty);
                              }}
                              className="mr-2 rounded"
                            />
                            <span className="capitalize">{difficulty}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-4">
                      <label className="text-sm text-gray-300 mb-2 block">Status</label>
                      <div className="space-y-2">
                        <label className="flex items-center text-white text-sm">
                          <input
                            type="checkbox"
                            checked={filters.showCompleted}
                            onChange={(e) => setFilters(prev => ({ ...prev, showCompleted: e.target.checked }))}
                            className="mr-2 rounded"
                          />
                          <span className="text-green-400">✓ Completed</span>
                        </label>
                        <label className="flex items-center text-white text-sm">
                          <input
                            type="checkbox"
                            checked={filters.showInProgress}
                            onChange={(e) => setFilters(prev => ({ ...prev, showInProgress: e.target.checked }))}
                            className="mr-2 rounded"
                          />
                          <span className="text-blue-400">▶ In Progress</span>
                        </label>
                        <label className="flex items-center text-white text-sm">
                          <input
                            type="checkbox"
                            checked={filters.showNotStarted}
                            onChange={(e) => setFilters(prev => ({ ...prev, showNotStarted: e.target.checked }))}
                            className="mr-2 rounded"
                          />
                          <span className="text-gray-400">○ Not Started</span>
                        </label>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected Node Details */}
            <AnimatePresence>
              {selectedNode && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card variant="glass" padding="lg">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      {getNodeTypeIcon(selectedNode.type)}
                      {selectedNode.title}
                    </h3>
                    
                    <div className="space-y-3 text-sm text-white">
                      <div>
                        <span className="text-gray-300">Type:</span>
                        <span className="ml-2 capitalize">{selectedNode.type.replace('_', ' ')}</span>
                      </div>
                      
                      {selectedNode.difficulty_level && (
                        <div>
                          <span className="text-gray-300">Difficulty:</span>
                          <span className="ml-2 capitalize">{selectedNode.difficulty_level}</span>
                        </div>
                      )}
                      
                      {selectedNode.description && (
                        <div>
                          <span className="text-gray-300">Description:</span>
                          <p className="mt-1 text-gray-100">{selectedNode.description}</p>
                        </div>
                      )}
                      
                      {selectedNode.learning_objectives && selectedNode.learning_objectives.length > 0 && (
                        <div>
                          <span className="text-gray-300">Learning Objectives:</span>
                          <ul className="mt-1 list-disc list-inside text-gray-100">
                            {selectedNode.learning_objectives.map((objective: string, index: number) => (
                              <li key={index} className="text-xs">{objective}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedNode.progress !== undefined && (
                        <div>
                          <span className="text-gray-300">Progress:</span>
                          <div className="mt-1">
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  selectedNode.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${selectedNode.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-300 mt-1">
                              {selectedNode.progress.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {selectedNode.view_count !== undefined && (
                        <div>
                          <span className="text-gray-300">Views:</span>
                          <span className="ml-2">{selectedNode.view_count}</span>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-white/20">
                        <button
                          onClick={() => {
                            console.log(`Marking as viewed: ${selectedNode.title}`);
                          }}
                          className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                        >
                          <ArrowDownTrayIcon className="w-3 h-3" />
                          Mark as Viewed
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;