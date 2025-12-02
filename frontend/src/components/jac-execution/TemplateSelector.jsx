import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Code, 
  Search, 
  Filter, 
  Star, 
  Play, 
  Download, 
  User,
  Clock,
  Tag,
  ChevronDown,
  ChevronUp,
  X,
  Brain,
  BarChart3,
  Users,
  BookOpen,
  Settings,
  Plus,
  Edit,
  Trash2,
  Copy,
  Share2,
  Eye,
  EyeOff,
  Grid,
  List,
  Kanban,
  GitBranch,
  TrendingUp,
  Award,
  Target,
  Lightbulb,
  Zap,
  Book,
  Bookmark,
  BookmarkCheck,
  Heart,
  HeartHandshake,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Upload,
  ExternalLink,
  Globe,
  Lock,
  Unlock,
  Crown,
  Flame,
  Sparkles,
  Clock3,
  Activity,
  Layers,
  Package,
  FileText,
  Image,
  Table,
  HardDrive,
  Wifi,
  WifiOff,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  HelpCircle,
  Home,
  BookmarkIcon,
  TrendingDown,
  Calendar,
  UserPlus,
  UserMinus,
  Hash,
  AtSign,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MoreVertical,
  Sliders,
  SlidersHorizontal,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  Sort,
  Shuffle,
  Zap as Fast,
  Shield as Security,
  Crown as Premium,
  Flame as Popular,
  BookOpen as Learning,
  Lightbulb as Insight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// AI Configuration for template intelligence
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

// Achievement system integration for template engagement
const ACHIEVEMENT_SYSTEM = {
  templateExplorer: {
    id: 'template_explorer',
    title: 'Template Explorer',
    description: 'Browse 50 different templates',
    icon: <Search className="w-4 h-4" />,
    points: 50
  },
  templateCreator: {
    id: 'template_creator',
    title: 'Template Creator',
    description: 'Create and share 10 templates',
    icon: <Plus className="w-4 h-4" />,
    points: 150
  },
  collaborationMaster: {
    id: 'collaboration_master',
    title: 'Collaboration Master',
    description: 'Collaborate on 20 template sessions',
    icon: <Users className="w-4 h-4" />,
    points: 200
  },
  aiAssistedDeveloper: {
    id: 'ai_assisted_developer',
    title: 'AI-Assisted Developer',
    description: 'Use AI recommendations 100 times',
    icon: <Brain className="w-4 h-4" />,
    points: 100
  },
  templateExpert: {
    id: 'template_expert',
    title: 'Template Expert',
    description: 'Achieve expert level in 5 different categories',
    icon: <Crown className="w-4 h-4" />,
    points: 300
  },
  communityContributor: {
    id: 'community_contributor',
    title: 'Community Contributor',
    description: 'Receive 50+ likes on shared templates',
    icon: <HeartHandshake className="w-4 h-4" />,
    points: 250
  }
};

// Mock AI template analysis function
const analyzeTemplateWithAI = async (template) => {
  try {
    const prompt = `
      Analyze the following code template:
      
      Name: ${template.name}
      Language: ${template.language}
      Category: ${template.category}
      Code: ${template.code}
      Description: ${template.description}
      
      Provide analysis in JSON format:
      {
        "complexity": "beginner|intermediate|advanced",
        "useCases": ["list of specific use cases"],
        "learningValue": "low|medium|high",
        "bestPractices": ["list of best practices demonstrated"],
        "similarityScore": 0-100,
        "recommendations": ["list of improvement suggestions"],
        "timeToUnderstand": "estimated minutes",
        "educationalTags": ["educational learning points"]
      }
    `;
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock analysis based on template characteristics
    const complexity = template.code.length > 200 ? 'advanced' : 
                     template.code.length > 100 ? 'intermediate' : 'beginner';
    
    const learningValue = complexity === 'beginner' ? 'high' : 
                         complexity === 'intermediate' ? 'medium' : 'low';
    
    const similarTemplates = Math.floor(Math.random() * 10) + 1;
    
    return {
      complexity,
      useCases: [
        `Quick ${template.language} development`,
        `Educational ${template.category} examples`,
        `Code review and learning reference`
      ],
      learningValue,
      bestPractices: [
        `Clean ${template.language} code structure`,
        `Proper commenting and documentation`,
        'Modular and reusable design'
      ],
      similarityScore: Math.max(20, 100 - (similarTemplates * 8)),
      recommendations: [
        'Add more detailed comments',
        'Include error handling examples',
        'Provide unit test examples',
        'Add performance optimization tips'
      ],
      timeToUnderstand: `${Math.floor(learningValue === 'high' ? 5 : 
                                    learningValue === 'medium' ? 10 : 15)} minutes`,
      educationalTags: [
        'Code Structure',
        'Best Practices',
        'Pattern Recognition',
        'Language Fundamentals'
      ]
    };
  } catch (error) {
    console.error('Template AI Analysis Error:', error);
    return {
      complexity: 'intermediate',
      useCases: ['General development'],
      learningValue: 'medium',
      bestPractices: ['Clean code principles'],
      similarityScore: 50,
      recommendations: ['Manual review required'],
      timeToUnderstand: '10 minutes',
      educationalTags: ['Code Review']
    };
  }
};

// Mock collaboration manager for template sharing
class TemplateCollaborationManager {
  constructor() {
    this.sessions = new Map();
    this.ws = null;
    this.connected = false;
    this.activeCollaborators = new Set();
  }

  async connect() {
    console.log('Connecting to template collaboration server...');
    this.connected = true;
    return Promise.resolve();
  }

  async createSession(templateData) {
    const sessionId = `template_session_${Date.now()}`;
    this.sessions.set(sessionId, {
      id: sessionId,
      template: templateData,
      collaborators: [1], // Current user
      createdAt: new Date(),
      messages: [],
      ratings: [],
      comments: []
    });
    return sessionId;
  }

  async shareTemplate(sessionId, templateData) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.template = templateData;
      session.lastUpdated = new Date();
    }
  }

  async rateTemplate(sessionId, rating, userId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      const existingRating = session.ratings.find(r => r.userId === userId);
      if (existingRating) {
        existingRating.rating = rating;
      } else {
        session.ratings.push({ userId, rating, timestamp: new Date() });
      }
    }
  }

  async getSessions() {
    return Array.from(this.sessions.values());
  }
}

// Template categorization and tagging system
const TEMPLATE_CATEGORIES = {
  algorithms: { name: 'Algorithms', color: 'blue', icon: <Zap className="w-3 h-3" /> },
  data_structures: { name: 'Data Structures', color: 'green', icon: <Layers className="w-3 h-3" /> },
  web_development: { name: 'Web Development', color: 'purple', icon: <Globe className="w-3 h-3" /> },
  machine_learning: { name: 'Machine Learning', color: 'orange', icon: <Brain className="w-3 h-3" /> },
  api_development: { name: 'API Development', color: 'indigo', icon: <Code className="w-3 h-3" /> },
  database: { name: 'Database', color: 'cyan', icon: <HardDrive className="w-3 h-3" /> },
  testing: { name: 'Testing', color: 'pink', icon: <Shield className="w-3 h-3" /> },
  security: { name: 'Security', color: 'red', icon: <Security className="w-3 h-3" /> },
  performance: { name: 'Performance', color: 'yellow', icon: <Fast className="w-3 h-3" /> },
  educational: { name: 'Educational', color: 'teal', icon: <Learning className="w-3 h-3" /> }
};

// Mock template generation function
const generateMockTemplates = () => {
  const languages = ['python', 'javascript', 'java', 'c++', 'rust', 'go', 'typescript', 'kotlin'];
  const categories = Object.keys(TEMPLATE_CATEGORIES);
  const users = ['Alice Johnson', 'Bob Smith', 'Carol Chen', 'David Wilson', 'Eva Rodriguez'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `template_${i + 1}`,
    name: [
      'Binary Search Implementation',
      'REST API with Authentication',
      'Neural Network from Scratch',
      'Database Connection Pool',
      'Real-time Chat Application',
      'Graph Traversal Algorithm',
      'Image Processing Pipeline',
      'User Authentication System',
      'Caching Implementation',
      'Async File Processing',
      'Machine Learning Classifier',
      'WebSocket Server',
      'Authentication Middleware',
      'Data Visualization Dashboard',
      'Automated Testing Suite'
    ][i % 15] || `Advanced Template ${i + 1}`,
    description: [
      'Efficient implementation of binary search with optimization techniques',
      'Complete REST API with JWT authentication and middleware',
      'Build a neural network from scratch with backpropagation',
      'Thread-safe database connection pooling implementation',
      'Real-time messaging application using WebSocket technology',
      'Graph traversal algorithms including BFS and DFS implementations',
      'Comprehensive image processing pipeline with filters and effects',
      'Secure user authentication system with password hashing',
      'High-performance caching layer with TTL and cache invalidation',
      'Asynchronous file processing with concurrency and error handling'
    ][i % 10] || `Professional template for advanced ${languages[i % languages.length]} development`,
    language: languages[i % languages.length],
    category: categories[i % categories.length],
    code: `// ${languages[i % languages.length].toUpperCase()} Template ${i + 1}
def template_function_${i + 1}():
    """
    ${['Advanced template implementation', 'Production-ready code template', 'Educational example with best practices', 'Optimized solution for performance', 'Comprehensive error handling'][i % 5]}
    """
    print("Hello from template ${i + 1}")
    # Template logic here
    return "Template ${i + 1} executed successfully"
    
if __name__ == "__main__":
    result = template_function_${i + 1}()
    print(result)`,
    stdin: i % 3 === 0 ? `Input data for template ${i + 1}` : '',
    creator_name: users[i % users.length],
    creator_id: `user_${(i % users.length) + 1}`,
    is_public: Math.random() > 0.3,
    is_featured: Math.random() > 0.8,
    is_premium: Math.random() > 0.9,
    tags: [
      ['algorithms', 'search', 'optimization'],
      ['api', 'rest', 'authentication'],
      ['ml', 'neural-network', 'ai'],
      ['database', 'pooling', 'performance'],
      ['websocket', 'real-time', 'chat'],
      ['graph', 'traversal', 'algorithms'],
      ['image', 'processing', 'filters'],
      ['auth', 'security', 'password'],
      ['cache', 'performance', 'ttl'],
      ['async', 'file', 'concurrent']
    ][i % 10] || ['template', 'example', 'code'],
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    usage_count: Math.floor(Math.random() * 1000),
    rating: Math.random() * 5,
    difficulty: ['beginner', 'intermediate', 'advanced'][i % 3],
    estimated_time: `${5 + (i % 15)} minutes`,
    likes: Math.floor(Math.random() * 200),
    downloads: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 1000),
    author_reputation: Math.floor(Math.random() * 1000)
  }));
};

const EnhancedTemplateSelector = ({ 
  onSelectTemplate, 
  onRefreshTemplates,
  onCreateTemplate,
  className = '',
  theme = 'light',
  compact = false,
  showMinimap = true,
  aiEnabled = true,
  collaborationEnabled = true,
  achievementEnabled = true,
  userId = 'current_user',
  initialTemplates = []
}) => {
  // Refs
  const templateListRef = useRef(null);
  const analyticsRef = useRef(null);
  const aiAnalysisRef = useRef(null);
  
  // Core state
  const [templates, setTemplates] = useState(initialTemplates.length > 0 ? initialTemplates : generateMockTemplates());
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  
  // View and display state
  const [viewMode, setViewMode] = useState('grid'); // grid, list, kanban, comparison
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // name, rating, usage_count, updated_at, difficulty
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [compactMode, setCompactMode] = useState(compact);
  
  // AI and analysis state
  const [aiAnalysis, setAiAnalysis] = useState(new Map());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiProvider, setAiProvider] = useState('openai');
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  
  // Analytics state
  const [templateAnalytics, setTemplateAnalytics] = useState({
    totalTemplates: 0,
    averageRating: 0,
    mostPopular: null,
    trendingCategory: null,
    engagementRate: 0
  });
  const [analyticsData, setAnalyticsData] = useState({
    usageTrends: [],
    categoryDistribution: [],
    languagePopularity: [],
    difficultyProgress: []
  });
  
  // Collaboration state
  const [collaborationManager] = useState(() => new TemplateCollaborationManager());
  const [collaborationSessions, setCollaborationSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [collaborationMessages, setCollaborationMessages] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [templateRatings, setTemplateRatings] = useState(new Map());
  
  // Learning and achievement state
  const [achievements, setAchievements] = useState([]);
  const [learningProgress, setLearningProgress] = useState({
    templatesExplored: 0,
    templatesCreated: 0,
    collaborationSessions: 0,
    aiRecommendationsUsed: 0,
    favoriteCategories: [],
    skillLevel: 'beginner'
  });
  const [tutorials, setTutorials] = useState([]);
  const [showTutorials, setShowTutorials] = useState(false);
  const [bookmarkedTemplates, setBookmarkedTemplates] = useState(new Set());
  
  // Favorites and interactions
  const [favoriteTemplates, setFavoriteTemplates] = useState(new Set());
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [userRatings, setUserRatings] = useState(new Map());
  const [interactionHistory, setInteractionHistory] = useState([]);
  
  // Performance monitoring
  const [performanceMetrics, setPerformanceMetrics] = useState({
    renderTime: 0,
    searchTime: 0,
    filterTime: 0,
    aiAnalysisTime: 0
  });
  
  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Initialize collaboration
  useEffect(() => {
    if (collaborationEnabled) {
      collaborationManager.connect().then(() => {
        setIsConnected(true);
        setCollaborationSessions(collaborationManager.getSessions());
      });
    }
  }, [collaborationManager, collaborationEnabled]);

  // Update analytics when templates change
  useEffect(() => {
    updateTemplateAnalytics();
  }, [templates]);

  // Record user interactions
  useEffect(() => {
    recordUserInteraction('view_templates', { templateCount: templates.length });
  }, [templates]);

  // Update learning progress
  useEffect(() => {
    updateLearningProgress();
  }, [interactionHistory, favoriteTemplates, collaborationSessions]);

  // Template analytics calculation
  const updateTemplateAnalytics = useCallback(() => {
    if (templates.length === 0) return;

    const totalRatings = templates.reduce((sum, t) => sum + (t.rating || 0), 0);
    const averageRating = totalRatings / templates.length;
    
    const mostPopular = templates.reduce((max, t) => 
      (t.usage_count || 0) > (max.usage_count || 0) ? t : max
    );

    const categoryCount = {};
    templates.forEach(t => {
      categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
    });
    const trendingCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b
    );

    const engagementRate = templates.filter(t => t.likes > 0).length / templates.length;

    setTemplateAnalytics({
      totalTemplates: templates.length,
      averageRating,
      mostPopular,
      trendingCategory,
      engagementRate
    });
  }, [templates]);

  // Learning progress update
  const updateLearningProgress = useCallback(() => {
    setLearningProgress(prev => ({
      ...prev,
      templatesExplored: recentlyViewed.length,
      collaborationSessions: collaborationSessions.length,
      skillLevel: recentlyViewed.length > 20 ? 'intermediate' : 
                  recentlyViewed.length > 50 ? 'advanced' : 'beginner',
      favoriteCategories: [...new Set(
        templates.filter(t => favoriteTemplates.has(t.id))
                  .map(t => t.category)
      )]
    }));
  }, [recentlyViewed, collaborationSessions, templates, favoriteTemplates]);

  // AI template analysis
  const analyzeTemplate = useCallback(async (template) => {
    if (isAnalyzing || !aiEnabled) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeTemplateWithAI(template);
      setAiAnalysis(prev => new Map(prev.set(template.id, analysis)));
      
      setAnalysisHistory(prev => [{
        templateId: template.id,
        timestamp: new Date(),
        analysis
      }, ...prev.slice(0, 9)]);
      
      recordUserInteraction('ai_analysis', { templateId: template.id });
      
    } catch (error) {
      console.error('Template AI Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [aiEnabled, isAnalyzing]);

  // Record user interaction
  const recordUserInteraction = (action, data) => {
    const interaction = {
      id: Date.now(),
      action,
      data,
      timestamp: new Date(),
      userId
    };
    
    setInteractionHistory(prev => [interaction, ...prev.slice(0, 99)]);
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

  // Achievement system
  const checkAchievements = () => {
    const newAchievements = [];
    
    // Template Explorer Achievement
    if (learningProgress.templatesExplored >= 50 && !achievements.find(a => a.id === 'template_explorer')) {
      newAchievements.push(ACHIEVEMENT_SYSTEM.templateExplorer);
    }
    
    // Template Creator Achievement
    if (learningProgress.templatesCreated >= 10 && !achievements.find(a => a.id === 'template_creator')) {
      newAchievements.push(ACHIEVEMENT_SYSTEM.templateCreator);
    }
    
    // Collaboration Master Achievement
    if (collaborationSessions.length >= 20 && !achievements.find(a => a.id === 'collaboration_master')) {
      newAchievements.push(ACHIEVEMENT_SYSTEM.collaborationMaster);
    }
    
    // AI-Assisted Developer Achievement
    if (analysisHistory.length >= 100 && !achievements.find(a => a.id === 'ai_assisted_developer')) {
      newAchievements.push(ACHIEVEMENT_SYSTEM.aiAssistedDeveloper);
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

  // Collaboration functions
  const createCollaborationSession = async (template) => {
    if (!collaborationEnabled) return;
    
    try {
      const sessionId = await collaborationManager.createSession(template);
      setCurrentSession(sessionId);
      
      addNotification({
        type: 'success',
        title: 'Session Created',
        message: 'Template collaboration session started',
        duration: 3000
      });
      
      recordUserInteraction('create_session', { templateId: template.id });
      
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

  const shareTemplate = async (template) => {
    if (!currentSession || !collaborationEnabled) return;
    
    try {
      await collaborationManager.shareTemplate(currentSession, template);
      
      addNotification({
        type: 'success',
        title: 'Template Shared',
        message: 'Template shared with collaborators',
        duration: 2000
      });
      
    } catch (error) {
      console.error('Failed to share template:', error);
    }
  };

  const rateTemplate = async (template, rating) => {
    if (!currentSession) return;
    
    try {
      await collaborationManager.rateTemplate(currentSession, rating, userId);
      setTemplateRatings(prev => new Map(prev.set(template.id, rating)));
      
      addNotification({
        type: 'success',
        title: 'Rating Submitted',
        message: `Template rated ${rating} stars`,
        duration: 2000
      });
      
    } catch (error) {
      console.error('Failed to rate template:', error);
    }
  };

  // Template interaction functions
  const handleSelectTemplate = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template.code, template.language, template.stdin);
    }
    
    setExpandedTemplate(null);
    setSelectedTemplate(template);
    
    // Add to recently viewed
    setRecentlyViewed(prev => [template, ...prev.filter(t => t.id !== template.id)].slice(0, 10));
    
    recordUserInteraction('select_template', { templateId: template.id });
    
    // Trigger AI analysis
    if (aiEnabled && !aiAnalysis.has(template.id)) {
      analyzeTemplate(template);
    }
    
    addNotification({
      type: 'success',
      title: 'Template Selected',
      message: `${template.name} loaded successfully`,
      duration: 2000
    });
  };

  const toggleTemplateBookmark = (templateId) => {
    setBookmarkedTemplates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(templateId)) {
        newSet.delete(templateId);
        addNotification({
          type: 'info',
          title: 'Bookmark Removed',
          message: 'Template removed from bookmarks',
          duration: 2000
        });
      } else {
        newSet.add(templateId);
        addNotification({
          type: 'success',
          title: 'Template Bookmarked',
          message: 'Template added to bookmarks',
          duration: 2000
        });
      }
      return newSet;
    });
  };

  const toggleTemplateFavorite = (templateId) => {
    setFavoriteTemplates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(templateId)) {
        newSet.delete(templateId);
      } else {
        newSet.add(templateId);
      }
      return newSet;
    });
  };

  const executeTemplate = (template, e) => {
    e.stopPropagation();
    handleSelectTemplate(template);
    
    addNotification({
      type: 'success',
      title: 'Template Executing',
      message: `Executing ${template.name}...`,
      duration: 2000
    });
  };

  // Filtering and sorting logic
  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = !searchTerm || 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.tags && template.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      
      const matchesLanguage = selectedLanguage === 'all' || template.language === selectedLanguage;
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesLanguage && matchesCategory && matchesDifficulty;
    });

    // Sort templates
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'usage_count':
          aValue = a.usage_count || 0;
          bValue = b.usage_count || 0;
          break;
        case 'updated_at':
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          aValue = difficultyOrder[a.difficulty] || 0;
          bValue = difficultyOrder[b.difficulty] || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [templates, searchTerm, selectedLanguage, selectedCategory, selectedDifficulty, sortBy, sortOrder]);

  // Get unique values for filters
  const uniqueLanguages = [...new Set(templates.map(t => t.language))];
  const uniqueCategories = [...new Set(templates.map(t => t.category).filter(Boolean))];
  const uniqueDifficulties = [...new Set(templates.map(t => t.difficulty))];

  // Check for achievements
  useEffect(() => {
    checkAchievements();
  }, [learningProgress, collaborationSessions, analysisHistory, achievements]);

  // Render template card based on view mode
  const renderTemplateCard = (template) => {
    const isExpanded = expandedTemplate === template.id;
    const isBookmarked = bookmarkedTemplates.has(template.id);
    const isFavorited = favoriteTemplates.has(template.id);
    const templateAnalysis = aiAnalysis.get(template.id);
    
    const cardContent = (
      <motion.div
        key={template.id}
        className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-all duration-200 hover:shadow-md"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`p-4 cursor-pointer ${compactMode ? 'p-3' : 'p-4'}`}
          onClick={() => setExpandedTemplate(isExpanded ? null : template.id)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className={`font-semibold text-gray-900 truncate ${compactMode ? 'text-sm' : 'text-base'}`}>
                  {template.name}
                </h4>
                {template.is_featured && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                {template.is_premium && <Crown className="w-3 h-3 text-purple-500" />}
                {template.is_public && <Globe className="w-3 h-3 text-green-500" />}
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  template.language === 'python' 
                    ? 'bg-green-100 text-green-800' 
                    : template.language === 'javascript'
                    ? 'bg-yellow-100 text-yellow-800'
                    : template.language === 'java'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {template.language.toUpperCase()}
                </span>
                
                <span className={`px-2 py-1 text-xs rounded-full ${
                  template.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {template.difficulty}
                </span>
                
                {templateAnalysis && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full flex items-center space-x-1">
                    <Brain className="w-3 h-3" />
                    <span>AI</span>
                  </span>
                )}
              </div>
              
              <p className={`text-gray-600 line-clamp-2 mb-3 ${compactMode ? 'text-xs' : 'text-sm'}`}>
                {template.description}
              </p>
              
              {/* Template Stats */}
              <div className={`flex items-center space-x-4 text-xs text-gray-500 ${compactMode ? 'space-x-2' : 'space-x-4'}`}>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>{template.rating?.toFixed(1) || 'N/A'}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{template.views || 0}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Download className="w-3 h-3" />
                  <span>{template.downloads || 0}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>{template.likes || 0}</span>
                </div>
              </div>
              
              {/* Tags */}
              {template.tags && template.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags.slice(0, compactMode ? 2 : 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > (compactMode ? 2 : 3) && (
                    <span className="px-2 py-1 text-xs text-gray-400">
                      +{template.tags.length - (compactMode ? 2 : 3)}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center space-y-1 ml-3">
              {/* Action Buttons */}
              <div className="flex flex-col space-y-1">
                <motion.button
                  onClick={(e) => executeTemplate(template, e)}
                  className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                  title="Load & Execute"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play className={`${compactMode ? 'w-3 h-3' : 'w-4 h-4'}`} />
                </motion.button>
                
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTemplateFavorite(template.id);
                  }}
                  className={`p-1.5 rounded transition-colors ${
                    isFavorited 
                      ? 'text-red-500 hover:text-red-700 hover:bg-red-50' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                  title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={`${compactMode ? 'w-3 h-3' : 'w-4 h-4'} ${isFavorited ? 'fill-current' : ''}`} />
                </motion.button>
                
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTemplateBookmark(template.id);
                  }}
                  className={`p-1.5 rounded transition-colors ${
                    isBookmarked 
                      ? 'text-blue-500 hover:text-blue-700 hover:bg-blue-50' 
                      : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bookmark className={`${compactMode ? 'w-3 h-3' : 'w-4 h-4'} ${isBookmarked ? 'fill-current' : ''}`} />
                </motion.button>
              </div>
              
              {/* Expand Indicator */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedTemplate(isExpanded ? null : template.id);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
          
          {/* Creator Info */}
          <div className={`flex items-center justify-between text-xs text-gray-500 ${compactMode ? 'text-xs' : 'text-xs'}`}>
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{template.creator_name}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(template.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Expanded Template Preview */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="border-t border-gray-200 bg-gray-50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Template Preview</span>
                    <div className="flex items-center space-x-2">
                      {aiEnabled && !templateAnalysis && (
                        <motion.button
                          onClick={() => analyzeTemplate(template)}
                          disabled={isAnalyzing}
                          className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50 flex items-center space-x-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Brain className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                          <span>{isAnalyzing ? 'Analyzing...' : 'AI Analyze'}</span>
                        </motion.button>
                      )}
                      
                      <motion.button
                        onClick={() => handleSelectTemplate(template)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Use This Template
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Code Preview */}
                  <div className="bg-gray-900 rounded-lg p-3 max-h-40 overflow-y-auto">
                    <pre className="text-green-400 text-xs font-mono">
                      <code>{template.code}</code>
                    </pre>
                  </div>
                </div>
                
                {/* Standard Input */}
                {template.stdin && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 block mb-1">
                      Standard Input
                    </span>
                    <div className="bg-gray-900 rounded-lg p-3">
                      <pre className="text-yellow-400 text-xs font-mono">
                        <code>{template.stdin}</code>
                      </pre>
                    </div>
                  </div>
                )}
                
                {/* AI Analysis Results */}
                {templateAnalysis && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">AI Analysis</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-purple-50 p-2 rounded">
                        <div className="font-medium text-purple-700">Complexity</div>
                        <div className="text-purple-600 capitalize">{templateAnalysis.complexity}</div>
                      </div>
                      
                      <div className="bg-blue-50 p-2 rounded">
                        <div className="font-medium text-blue-700">Learning Value</div>
                        <div className="text-blue-600 capitalize">{templateAnalysis.learningValue}</div>
                      </div>
                      
                      <div className="bg-green-50 p-2 rounded">
                        <div className="font-medium text-green-700">Time to Understand</div>
                        <div className="text-green-600">{templateAnalysis.timeToUnderstand}</div>
                      </div>
                      
                      <div className="bg-orange-50 p-2 rounded">
                        <div className="font-medium text-orange-700">Similarity Score</div>
                        <div className="text-orange-600">{templateAnalysis.similarityScore}%</div>
                      </div>
                    </div>
                    
                    {/* Use Cases */}
                    {templateAnalysis.useCases && templateAnalysis.useCases.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs font-medium text-gray-700 mb-1">Use Cases</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {templateAnalysis.useCases.map((useCase, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <Target className="w-3 h-3 text-blue-500" />
                              <span>{useCase}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Best Practices */}
                    {templateAnalysis.bestPractices && templateAnalysis.bestPractices.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs font-medium text-gray-700 mb-1">Best Practices</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {templateAnalysis.bestPractices.map((practice, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>{practice}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Collaboration Options */}
                {collaborationEnabled && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => createCollaborationSession(template)}
                        className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors"
                        title="Collaborate"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Users className="w-4 h-4" />
                      </motion.button>
                      
                      {currentSession && (
                        <motion.button
                          onClick={() => shareTemplate(template)}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                          title="Share"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">Rate:</span>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <motion.button
                          key={rating}
                          onClick={() => rateTemplate(template, rating)}
                          className={`p-0.5 rounded transition-colors ${
                            (userRatings.get(template.id) || 0) >= rating 
                              ? 'text-yellow-500' 
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Star className="w-3 h-3" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );

    return cardContent;
  };

  return (
    <motion.div 
      className={`bg-white ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced Header */}
      <div className="bg-gray-800 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center space-x-3">
            <Code className="w-6 h-6" />
            <span>Enhanced Template Library</span>
            <div className="flex items-center space-x-2">
              {aiEnabled && <Brain className="w-5 h-5 text-purple-400" />}
              {collaborationEnabled && <Users className="w-5 h-5 text-blue-400" />}
              <div className="text-sm bg-gray-700 px-2 py-1 rounded">
                {filteredAndSortedTemplates.length} templates
              </div>
            </div>
          </h3>
          
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-700 rounded p-1">
              {[
                { mode: 'grid', icon: Grid, title: 'Grid View' },
                { mode: 'list', icon: List, title: 'List View' },
                { mode: 'kanban', icon: Kanban, title: 'Kanban View' }
              ].map(({ mode, icon: Icon, title }) => (
                <motion.button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded transition-colors ${
                    viewMode === mode ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-600'
                  }`}
                  title={title}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              ))}
            </div>
            
            {/* Panel Toggle Buttons */}
            <div className="flex items-center space-x-1 bg-gray-700 rounded p-1">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded transition-colors ${
                  showFilters ? 'bg-green-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
                title="Toggle Filters"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FilterIcon className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                onClick={() => setCompactMode(!compactMode)}
                className={`p-2 rounded transition-colors ${
                  compactMode ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
                title="Toggle Compact Mode"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Layers className="w-4 h-4" />
              </motion.button>
            </div>
            
            {onRefreshTemplates && (
              <motion.button
                onClick={onRefreshTemplates}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Refresh Templates"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Template Statistics */}
        <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-700 rounded p-3">
            <div className="text-gray-300">Total Templates</div>
            <div className="text-2xl font-bold">{templateAnalytics.totalTemplates}</div>
          </div>
          <div className="bg-gray-700 rounded p-3">
            <div className="text-gray-300">Avg Rating</div>
            <div className="text-2xl font-bold">{templateAnalytics.averageRating.toFixed(1)}</div>
          </div>
          <div className="bg-gray-700 rounded p-3">
            <div className="text-gray-300">Engagement</div>
            <div className="text-2xl font-bold">{(templateAnalytics.engagementRate * 100).toFixed(0)}%</div>
          </div>
          <div className="bg-gray-700 rounded p-3">
            <div className="text-gray-300">Categories</div>
            <div className="text-2xl font-bold">{uniqueCategories.length}</div>
          </div>
        </div>
      </div>

      {/* Enhanced Toolbar */}
      <div className="bg-gray-100 border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
              />
            </div>
            
            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-2"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="usage_count">Sort by Usage</option>
                <option value="updated_at">Sort by Updated</option>
                <option value="difficulty">Sort by Difficulty</option>
              </select>
              
              <motion.button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {onCreateTemplate && (
              <motion.button
                onClick={onCreateTemplate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                <span>Create Template</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="bg-gray-50 border-b border-gray-200 px-6 py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-3 gap-4">
              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Languages</option>
                  {uniqueLanguages.map(lang => (
                    <option key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {TEMPLATE_CATEGORIES[cat]?.name || cat}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Levels</option>
                  {uniqueDifficulties.map(diff => (
                    <option key={diff} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates Display */}
      <div className="p-6">
        {filteredAndSortedTemplates.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Code className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-sm">
              {searchTerm || selectedLanguage !== 'all' || selectedCategory !== 'all' || selectedDifficulty !== 'all'
                ? 'Try adjusting your search criteria'
                : 'No templates are currently available'}
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
              : viewMode === 'kanban'
              ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-4'
          }>
            {filteredAndSortedTemplates.map(renderTemplateCard)}
          </div>
        )}
        
        {/* Results Summary */}
        {filteredAndSortedTemplates.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
            Showing {filteredAndSortedTemplates.length} of {templates.length} templates
            {searchTerm && (
              <span> matching "{searchTerm}"</span>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions FAB */}
      <motion.div 
        className="fixed bottom-6 right-6 z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col space-y-3">
          {/* AI Recommendations */}
          {aiEnabled && (
            <motion.button
              onClick={() => {
                // AI recommendations logic would go here
                addNotification({
                  type: 'info',
                  title: 'AI Recommendations',
                  message: 'Personalized template recommendations coming soon',
                  duration: 3000
                });
              }}
              className="w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="AI Recommendations"
            >
              <Brain className="w-6 h-6" />
            </motion.button>
          )}
          
          {/* Create Template */}
          {onCreateTemplate && (
            <motion.button
              onClick={onCreateTemplate}
              className="w-12 h-12 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Create New Template"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          )}
          
          {/* Analytics */}
          <motion.button
            onClick={() => {
              addNotification({
                type: 'info',
                title: 'Analytics Dashboard',
                message: 'Template analytics coming soon',
                duration: 3000
              });
            }}
            className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="View Analytics"
          >
            <BarChart3 className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>

      {/* Notifications */}
      <AnimatePresence>
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={`p-4 rounded-lg shadow-lg max-w-sm ${
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
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                  {notification.type === 'error' && <X className="w-5 h-5" />}
                  {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                  {notification.type === 'achievement' && <Award className="w-5 h-5" />}
                  {notification.type === 'info' && <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{notification.title}</div>
                  <div className="text-xs mt-1">{notification.message}</div>
                </div>
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedTemplateSelector;