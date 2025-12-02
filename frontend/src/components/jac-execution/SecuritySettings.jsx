import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Settings, 
  Shield, 
  Clock, 
  HardDrive, 
  Zap,
  AlertTriangle,
  Save,
  X,
  Info,
  Lock,
  Unlock,
  Code,
  Network,
  Eye,
  EyeOff,
  User,
  Users,
  LockIcon,
  UnlockIcon,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Brain,
  Target,
  Trophy,
  BookOpen,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Database,
  Server,
  Cpu,
  MemoryStick,
  FileCode,
  GitBranch,
  MessageSquare,
  Share2,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search,
  Plus,
  Minus,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Monitor,
  Smartphone,
  Tablet,
  Camera,
  Mic,
  Video,
  Image,
  FileText,
  Folder,
  Archive,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  FilterX,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Calendar,
  Clock3,
  Timer,
  Gauge,
  LineChart,
  ArrowUp,
  ArrowDown,
  MinusCircle,
  PlusCircle,
  InfoIcon,
  WarningIcon,
  ErrorIcon,
  CheckCircleIcon,
  AlertIcon
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart as RechartsBarChart, Bar, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';

const SecuritySettings = ({ onClose, supportedLanguages = {}, websocket }) => {
  const [activeTab, setActiveTab] = useState('intelligence');
  const [settings, setSettings] = useState({
    max_execution_time: 5.0,
    max_memory: 64,
    max_output_size: 10240,
    max_code_size: 102400,
    allowed_languages: ['python', 'jac'],
    enable_sandboxing: true,
    enable_network_access: false,
    max_executions_per_minute: 60,
    max_executions_per_hour: 1000,
    blocked_imports: ['os', 'sys', 'subprocess', 'importlib'],
    blocked_functions: ['eval', 'exec', 'open', '__import__'],
    security_level: 'medium',
    compliance_standards: ['OWASP', 'SOC2'],
    audit_logging: true,
    threat_detection: true,
    auto_block_malicious: true,
    data_encryption: true,
    session_timeout: 30,
    password_policy: {
      min_length: 8,
      require_special: true,
      require_numbers: true,
      require_uppercase: true,
      password_expiry_days: 90
    },
    two_factor_auth: true,
    ip_whitelist: [],
    geolocation_restrictions: [],
    vulnerability_scanning: true,
    penetration_testing_schedule: 'monthly',
    security_training_required: true,
    incident_response_plan: true,
    backup_retention_days: 30,
    disaster_recovery_enabled: true
  });

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [viewMode, setViewMode] = useState('dashboard'); // dashboard, compliance, risk, performance
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [securityAnalytics, setSecurityAnalytics] = useState({
    threat_level: 'Medium',
    security_score: 78,
    vulnerabilities_detected: 3,
    compliance_status: 'Partial',
    incident_count: 0,
    avg_response_time: 0,
    user_risk_score: 45,
    system_integrity: 92,
    data_privacy_score: 85,
    network_security_score: 79,
    authentication_strength: 88,
    last_security_scan: null,
    security_trends: [
      { month: 'Jan', threats: 12, incidents: 2, compliance: 85 },
      { month: 'Feb', threats: 8, incidents: 1, compliance: 87 },
      { month: 'Mar', threats: 15, incidents: 3, compliance: 82 },
      { month: 'Apr', threats: 6, incidents: 0, compliance: 91 },
      { month: 'May', threats: 9, incidents: 1, compliance: 88 },
      { month: 'Jun', threats: 11, incidents: 2, compliance: 85 }
    ],
    threat_distribution: [
      { name: 'Malware', value: 35, color: '#ef4444' },
      { name: 'Phishing', value: 25, color: '#f97316' },
      { name: 'DDoS', value: 20, color: '#eab308' },
      { name: 'SQL Injection', value: 15, color: '#84cc16' },
      { name: 'Other', value: 5, color: '#6366f1' }
    ],
    security_metrics: [
      { metric: 'Failed Login Attempts', value: 23, threshold: 50, status: 'safe' },
      { metric: 'Blocked IP Addresses', value: 15, threshold: 20, status: 'warning' },
      { metric: 'Suspicious Activities', value: 7, threshold: 10, status: 'safe' },
      { metric: 'Vulnerability Scans', value: 4, threshold: 5, status: 'safe' }
    ]
  });

  const [collaboration, setCollaboration] = useState({
    isConnected: false,
    activeUsers: [],
    pendingChanges: [],
    auditTrail: [],
    sharedPolicies: [],
    commentThreads: []
  });

  const [achievements, setAchievements] = useState({
    security_expert: { unlocked: false, progress: 65, requirements: ['Complete 10 security configurations', 'Fix 5 vulnerabilities'] },
    compliance_master: { unlocked: false, progress: 40, requirements: ['Achieve 95% compliance score', 'Complete 3 audits'] },
    threat_hunter: { unlocked: true, progress: 100, requirements: ['Detect and block 50 threats'] },
    privacy_guardian: { unlocked: false, progress: 75, requirements: ['Implement data encryption', 'Create privacy policy'] }
  });

  const [learning, setLearning] = useState({
    completed_modules: 5,
    total_modules: 12,
    skill_assessments: [
      { skill: 'Security Configuration', level: 'Intermediate', score: 78 },
      { skill: 'Threat Detection', level: 'Beginner', score: 65 },
      { skill: 'Compliance Management', level: 'Advanced', score: 92 },
      { skill: 'Incident Response', level: 'Intermediate', score: 71 }
    ],
    recommended_training: [
      'Advanced Threat Hunting',
      'SOC2 Compliance Deep Dive',
      'Privacy by Design Principles'
    ]
  });

  const [aiInsights, setAiInsights] = useState({
    recommendations: [
      { 
        title: 'Enable Advanced Threat Detection', 
        description: 'Your current threat detection settings can be enhanced with ML-based anomaly detection',
        priority: 'High',
        impact: 'Can reduce security incidents by 40%',
        action_required: true
      },
      { 
        title: 'Implement Zero Trust Architecture', 
        description: 'Consider moving to a zero-trust security model for better protection',
        priority: 'Medium',
        impact: 'Improved network security and access control',
        action_required: false
      },
      { 
        title: 'Strengthen Password Policy', 
        description: 'Current password policy meets minimum requirements but can be enhanced',
        priority: 'Low',
        impact: 'Reduced risk of account compromise',
        action_required: true
      }
    ],
    risk_assessment: {
      overall_risk: 'Medium',
      risk_factors: [
        { factor: 'Network Access', level: 'High', description: 'Direct network access enabled' },
        { factor: 'Authentication', level: 'Medium', description: 'Basic 2FA implemented' },
        { factor: 'Data Encryption', level: 'Low', description: 'Encryption properly configured' },
        { factor: 'Access Control', level: 'Medium', description: 'Role-based access in place' }
      ],
      mitigation_strategies: [
        'Implement network segmentation',
        'Deploy advanced authentication methods',
        'Enable continuous monitoring',
        'Establish incident response procedures'
      ]
    },
    compliance_gaps: [
      { standard: 'GDPR', status: 'Partial', gaps: ['Data retention policy', 'Consent management'] },
      { standard: 'SOC2', status: 'Compliant', gaps: [] },
      { standard: 'ISO 27001', status: 'Partial', gaps: ['Risk assessment documentation', 'Security training records'] }
    ]
  });

  const [realtimeData, setRealtimeData] = useState({
    active_sessions: 156,
    blocked_attempts: 8,
    current_threat_level: 'Low',
    security_events: [
      { id: 1, type: 'login_attempt', user: 'user@example.com', ip: '192.168.1.100', status: 'success', timestamp: Date.now() - 300000 },
      { id: 2, type: 'failed_login', user: 'unknown', ip: '203.0.113.45', status: 'blocked', timestamp: Date.now() - 600000 },
      { id: 3, type: 'suspicious_activity', user: 'admin@example.com', ip: '192.168.1.50', status: 'flagged', timestamp: Date.now() - 900000 },
      { id: 4, type: 'configuration_change', user: 'security_admin', ip: '192.168.1.10', status: 'approved', timestamp: Date.now() - 1200000 }
    ]
  });

  const API_BASE = '/api/jac-execution';
  const wsRef = useRef(null);
  const chatInputRef = useRef(null);

  // WebSocket management for real-time collaboration
  useEffect(() => {
    if (websocket) {
      wsRef.current = websocket;
      setCollaboration(prev => ({ ...prev, isConnected: true }));
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'security_policy_update') {
          handlePolicyUpdate(data.payload);
        } else if (data.type === 'new_comment') {
          handleNewComment(data.payload);
        } else if (data.type === 'user_joined') {
          handleUserJoined(data.payload);
        }
      };
    }
  }, [websocket]);

  // AI Analysis Functions
  const runAiSecurityAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const analysis = await analyzeSecurityWithAI(settings);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const analyzeSecurityWithAI = async (currentSettings) => {
    // Simulate AI analysis - replace with actual API calls
    const threats = [
      'Potential network security vulnerability detected',
      'Memory limit configuration may be insufficient for complex operations',
      'Code size restrictions could be bypassed with compression techniques',
      'Current sandboxing implementation has known limitations'
    ];
    
    const recommendations = [
      'Enable advanced threat detection using machine learning',
      'Increase memory limits for production environments',
      'Implement additional code size validation',
      'Consider container-based sandboxing for enhanced isolation'
    ];

    return {
      threats_detected: threats.length,
      security_score: Math.floor(Math.random() * 20) + 75,
      risk_level: threats.length > 2 ? 'High' : threats.length > 1 ? 'Medium' : 'Low',
      threats,
      recommendations,
      compliance_status: 'Partial Compliance',
      next_scan_recommendation: 'High Priority'
    };
  };

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
    runAiSecurityAnalysis();
  }, [runAiSecurityAnalysis]);

  const loadSettings = async () => {
    try {
      const response = await fetch(`${API_BASE}/security/`);
      if (response.ok) {
        const data = await response.json();
        setSettings(prevSettings => ({ ...prevSettings, ...data }));
      }
    } catch (error) {
      console.error('Failed to load security settings:', error);
    }
  };

  // Settings update functions
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateNestedSetting = (parentKey, childKey, value) => {
    setSettings(prev => ({
      ...prev,
      [parentKey]: { ...prev[parentKey], [childKey]: value }
    }));
    setHasChanges(true);
  };

  const updateArraySetting = (key, index, value) => {
    const newArray = [...settings[key]];
    newArray[index] = value;
    updateSetting(key, newArray);
  };

  const addToArray = (key, defaultValue = '') => {
    const newArray = [...settings[key], defaultValue];
    updateSetting(key, newArray);
  };

  const removeFromArray = (key, index) => {
    const newArray = settings[key].filter((_, i) => i !== index);
    updateSetting(key, newArray);
  };

  // Collaboration functions
  const handlePolicyUpdate = (update) => {
    setCollaboration(prev => ({
      ...prev,
      pendingChanges: [...prev.pendingChanges, update]
    }));
  };

  const handleNewComment = (comment) => {
    setCollaboration(prev => ({
      ...prev,
      commentThreads: [...prev.commentThreads, comment]
    }));
  };

  const handleUserJoined = (user) => {
    setCollaboration(prev => ({
      ...prev,
      activeUsers: [...prev.activeUsers, user]
    }));
  };

  const shareSecurityPolicy = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'share_policy',
        payload: { settings, timestamp: Date.now() }
      }));
    }
  };

  const addComment = (policyId, comment) => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'add_comment',
        payload: { policyId, comment, timestamp: Date.now() }
      }));
    }
  };

  // Achievement system functions
  const updateAchievementProgress = (achievementId, progress) => {
    setAchievements(prev => ({
      ...prev,
      [achievementId]: { ...prev[achievementId], progress: Math.min(100, progress) }
    }));
  };

  const unlockAchievement = (achievementId) => {
    setAchievements(prev => ({
      ...prev,
      [achievementId]: { ...prev[achievementId], unlocked: true, progress: 100 }
    }));
  };

  // Learning system functions
  const completeTrainingModule = (moduleId) => {
    setLearning(prev => ({
      ...prev,
      completed_modules: prev.completed_modules + 1
    }));
    
    // Update related achievements
    updateAchievementProgress('security_expert', 75);
  };

  const takeSkillAssessment = (skill, score) => {
    setLearning(prev => ({
      ...prev,
      skill_assessments: prev.skill_assessments.map(assessment =>
        assessment.skill === skill ? { ...assessment, score } : assessment
      )
    }));
  };

  // Save settings
  const saveSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/security/update_settings/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setHasChanges(false);
        // Update achievements
        updateAchievementProgress('security_expert', 80);
        unlockAchievement('threat_hunter');
        
        // Broadcast change to collaborators
        if (wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'settings_saved',
            payload: { user: 'current_user', timestamp: Date.now() }
          }));
        }
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const resetToDefaults = () => {
    if (window.confirm('Reset all settings to default values?')) {
      setSettings({
        max_execution_time: 5.0,
        max_memory: 64,
        max_output_size: 10240,
        max_code_size: 102400,
        allowed_languages: ['python', 'jac'],
        enable_sandboxing: true,
        enable_network_access: false,
        max_executions_per_minute: 60,
        max_executions_per_hour: 1000,
        blocked_imports: ['os', 'sys', 'subprocess', 'importlib'],
        blocked_functions: ['eval', 'exec', 'open', '__import__'],
        security_level: 'medium',
        compliance_standards: ['OWASP', 'SOC2'],
        audit_logging: true,
        threat_detection: true,
        auto_block_malicious: true,
        data_encryption: true,
        session_timeout: 30,
        password_policy: {
          min_length: 8,
          require_special: true,
          require_numbers: true,
          require_uppercase: true,
          password_expiry_days: 90
        },
        two_factor_auth: true,
        ip_whitelist: [],
        geolocation_restrictions: [],
        vulnerability_scanning: true,
        penetration_testing_schedule: 'monthly',
        security_training_required: true,
        incident_response_plan: true,
        backup_retention_days: 30,
        disaster_recovery_enabled: true
      });
      setHasChanges(true);
    }
  };

  const toggleLanguage = (language) => {
    const newLanguages = settings.allowed_languages.includes(language)
      ? settings.allowed_languages.filter(l => l !== language)
      : [...settings.allowed_languages, language];
    updateSetting('allowed_languages', newLanguages);
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getRiskColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'safe': case 'compliant': case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': case 'partial': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': case 'failed': case 'blocked': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  // Render tab navigation
  const renderTabNavigation = () => (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {[
        { id: 'intelligence', label: 'Security Intelligence', icon: Brain },
        { id: 'analytics', label: 'Security Analytics', icon: BarChart3 },
        { id: 'collaboration', label: 'Team Collaboration', icon: Users },
        { id: 'management', label: 'Security Management', icon: Settings },
        { id: 'learning', label: 'Learning & Achievement', icon: Trophy }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            activeTab === tab.id 
              ? 'bg-white shadow-sm text-blue-600 font-medium' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <tab.icon className="w-4 h-4" />
          <span className="text-sm">{tab.label}</span>
        </button>
      ))}
    </div>
  );

  // Panel 1: Security Intelligence Panel
  const renderSecurityIntelligencePanel = () => (
    <div className="space-y-6">
      {/* AI Analysis Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center space-x-2 text-lg font-semibold text-blue-900">
            <Brain className="w-6 h-6" />
            <span>AI Security Analysis</span>
          </h3>
          <button
            onClick={runAiSecurityAnalysis}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Run Analysis</span>
          </button>
        </div>

        {aiAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Security Score</span>
                <span className="text-2xl font-bold text-blue-600">{aiAnalysis.security_score}</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Threats Detected</span>
                <span className="text-2xl font-bold text-red-600">{aiAnalysis.threats_detected}</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Risk Level</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRiskColor(aiAnalysis.risk_level)}`}>
                  {aiAnalysis.risk_level}
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Compliance</span>
                <span className="text-lg font-semibold text-green-600">{aiAnalysis.compliance_status}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
          <Target className="w-6 h-6" />
          <span>AI Recommendations</span>
        </h3>
        
        <div className="space-y-4">
          {aiInsights.recommendations.map((rec, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{rec.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rec.priority}
                  </span>
                  {rec.action_required && (
                    <button className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200">
                      Take Action
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-2">{rec.description}</p>
              <div className="text-sm text-blue-600 font-medium">{rec.impact}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <span>Risk Assessment</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Overall Risk: <span className={`font-bold ${getRiskColor(aiInsights.risk_assessment.overall_risk).split(' ')[0]}`}>{aiInsights.risk_assessment.overall_risk}</span></h4>
            <div className="space-y-2">
              {aiInsights.risk_assessment.risk_factors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{factor.factor}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(factor.level)}`}>
                    {factor.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Mitigation Strategies</h4>
            <ul className="space-y-1">
              {aiInsights.risk_assessment.mitigation_strategies.map((strategy, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{strategy}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance Gaps */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
          <Shield className="w-6 h-6" />
          <span>Compliance Status</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.compliance_gaps.map((compliance, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{compliance.standard}</h4>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(compliance.status)}
                  <span className="text-sm font-medium">{compliance.status}</span>
                </div>
              </div>
              {compliance.gaps.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Identified gaps:</p>
                  <ul className="space-y-1">
                    {compliance.gaps.map((gap, gapIndex) => (
                      <li key={gapIndex} className="text-xs text-red-600">• {gap}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Panel 2: Security Analytics Dashboard
  const renderSecurityAnalyticsPanel = () => (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {[
            { id: 'dashboard', label: 'Overview', icon: BarChart3 },
            { id: 'compliance', label: 'Compliance', icon: Shield },
            { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle },
            { id: 'performance', label: 'Performance', icon: TrendingUp }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                viewMode === mode.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <mode.icon className="w-4 h-4" />
              <span className="text-sm">{mode.label}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Real-time Status:</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Active</span>
          </div>
        </div>
      </div>

      {/* Dashboard Overview */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Security Score</p>
                  <p className="text-2xl font-bold text-green-700">{securityAnalytics.security_score}/100</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600">+5% from last month</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Threat Level</p>
                  <p className="text-2xl font-bold text-blue-700">{securityAnalytics.threat_level}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <Activity className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-blue-600">Monitored 24/7</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Vulnerabilities</p>
                  <p className="text-2xl font-bold text-yellow-700">{securityAnalytics.vulnerabilities_detected}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Bug className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-yellow-600 mr-1" />
                <span className="text-yellow-600">2 critical, 1 medium</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Compliance</p>
                  <p className="text-2xl font-bold text-purple-700">{securityAnalytics.compliance_status}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-purple-600 mr-1" />
                <span className="text-purple-600">3/5 standards met</span>
              </div>
            </div>
          </div>

          {/* Security Trends Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Trends (Last 6 Months)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={securityAnalytics.security_trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="incidents" stroke="#f97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="compliance" stroke="#22c55e" strokeWidth={2} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Threat Distribution and Security Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Threat Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={securityAnalytics.threat_distribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {securityAnalytics.threat_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Metrics</h3>
              <div className="space-y-3">
                {securityAnalytics.security_metrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{metric.metric}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            metric.status === 'safe' ? 'bg-green-500' :
                            metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(metric.value / metric.threshold) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8">{metric.value}</span>
                      {getStatusIcon(metric.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other view modes would be implemented similarly */}
      {viewMode === 'compliance' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Dashboard</h3>
          <div className="text-center text-gray-500 py-8">
            Compliance view implementation would go here
          </div>
        </div>
      )}

      {viewMode === 'risk' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Analysis Dashboard</h3>
          <div className="text-center text-gray-500 py-8">
            Risk analysis view implementation would go here
          </div>
        </div>
      )}

      {viewMode === 'performance' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="text-center text-gray-500 py-8">
            Performance view implementation would go here
          </div>
        </div>
      )}
    </div>
  );

  // Panel 3: Real-time Collaboration Hub
  const renderCollaborationPanel = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${collaboration.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium text-gray-900">
            {collaboration.isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <span className="text-sm text-gray-600">
            {collaboration.activeUsers.length} active users
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={shareSecurityPolicy}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Policy</span>
          </button>
        </div>
      </div>

      {/* Active Users */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Team Members</h3>
        <div className="space-y-3">
          {collaboration.activeUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{user.lastSeen}</span>
                <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Changes */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Policy Changes</h3>
        <div className="space-y-3">
          {collaboration.pendingChanges.map((change, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{change.type}</h4>
                <span className="text-sm text-gray-500">{change.timestamp}</span>
              </div>
              <p className="text-gray-600 mb-3">{change.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">by {change.user}</span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200">
                    Approve
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments and Discussion */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Discussion</h3>
        <div className="space-y-4 mb-4">
          {collaboration.commentThreads.map((thread, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">{thread.author}</span>
                <span className="text-sm text-gray-500">{thread.timestamp}</span>
              </div>
              <p className="text-gray-600">{thread.comment}</p>
              {thread.replies && thread.replies.length > 0 && (
                <div className="mt-2 space-y-2">
                  {thread.replies.map((reply, replyIndex) => (
                    <div key={replyIndex} className="ml-4 border-l-2 border-gray-300 pl-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-800">{reply.author}</span>
                        <span className="text-xs text-gray-500">{reply.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600">{reply.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            ref={chatInputRef}
            type="text"
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                addComment('policy-1', e.target.value);
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={() => {
              if (chatInputRef.current?.value.trim()) {
                addComment('policy-1', chatInputRef.current.value);
                chatInputRef.current.value = '';
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
        <div className="space-y-2">
          {collaboration.auditTrail.map((entry, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(entry.status)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                  <p className="text-xs text-gray-600">by {entry.user}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{entry.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Panel 4: Enhanced Security Management
  const renderSecurityManagementPanel = () => (
    <div className="space-y-6">
      {/* Enhanced Language Support */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="flex items-center space-x-2 text-lg font-medium text-blue-900 mb-3">
          <Code className="w-5 h-5" />
          <span>Enhanced Language Security</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(supportedLanguages).map(([key, info]) => (
            <div
              key={key}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                settings.allowed_languages.includes(key)
                  ? 'border-blue-500 bg-blue-100'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
              onClick={() => toggleLanguage(key)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{info.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {info.features?.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  settings.allowed_languages.includes(key)
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300'
                }`}>
                  {settings.allowed_languages.includes(key) && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Resource Limits */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="flex items-center space-x-2 text-lg font-medium text-green-900 mb-3">
          <HardDrive className="w-5 h-5" />
          <span>Enhanced Resource Controls</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Max Execution Time (seconds)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              step="0.1"
              value={settings.max_execution_time}
              onChange={(e) => updateSetting('max_execution_time', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-green-700 mt-1">Maximum time a program can run</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              <HardDrive className="w-4 h-4 inline mr-1" />
              Max Memory Usage (MB)
            </label>
            <input
              type="number"
              min="16"
              max="1024"
              value={settings.max_memory}
              onChange={(e) => updateSetting('max_memory', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-green-700 mt-1">Maximum memory a program can use</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              <Zap className="w-4 h-4 inline mr-1" />
              Max Output Size (bytes)
            </label>
            <input
              type="number"
              min="1024"
              max="1048576"
              step="1024"
              value={settings.max_output_size}
              onChange={(e) => updateSetting('max_output_size', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-green-700 mt-1">Maximum size of output ({formatBytes(settings.max_output_size)})</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              <Code className="w-4 h-4 inline mr-1" />
              Max Code Size (bytes)
            </label>
            <input
              type="number"
              min="1024"
              max="1048576"
              step="1024"
              value={settings.max_code_size}
              onChange={(e) => updateSetting('max_code_size', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-green-700 mt-1">Maximum size of submitted code ({formatBytes(settings.max_code_size)})</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              <Timer className="w-4 h-4 inline mr-1" />
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="120"
              value={settings.session_timeout}
              onChange={(e) => updateSetting('session_timeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-green-700 mt-1">Auto-logout after inactivity</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              <Archive className="w-4 h-4 inline mr-1" />
              Backup Retention (days)
            </label>
            <input
              type="number"
              min="7"
              max="365"
              value={settings.backup_retention_days}
              onChange={(e) => updateSetting('backup_retention_days', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-green-700 mt-1">How long to keep backups</p>
          </div>
        </div>
      </div>

      {/* Advanced Security Controls */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="flex items-center space-x-2 text-lg font-medium text-red-900 mb-3">
          <Shield className="w-5 h-5" />
          <span>Advanced Security Controls</span>
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
              <div>
                <h4 className="font-medium text-red-900">Enable Sandboxing</h4>
                <p className="text-sm text-red-700">Run code in isolated environment</p>
              </div>
              <button
                onClick={() => updateSetting('enable_sandboxing', !settings.enable_sandboxing)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enable_sandboxing ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enable_sandboxing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
              <div>
                <h4 className="font-medium text-red-900">Enable Network Access</h4>
                <p className="text-sm text-red-700">Allow programs to make network requests</p>
              </div>
              <button
                onClick={() => updateSetting('enable_network_access', !settings.enable_network_access)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enable_network_access ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enable_network_access ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
              <div>
                <h4 className="font-medium text-red-900">Audit Logging</h4>
                <p className="text-sm text-red-700">Log all security events</p>
              </div>
              <button
                onClick={() => updateSetting('audit_logging', !settings.audit_logging)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.audit_logging ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.audit_logging ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
              <div>
                <h4 className="font-medium text-red-900">Threat Detection</h4>
                <p className="text-sm text-red-700">Enable real-time threat monitoring</p>
              </div>
              <button
                onClick={() => updateSetting('threat_detection', !settings.threat_detection)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.threat_detection ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.threat_detection ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
              <div>
                <h4 className="font-medium text-red-900">Auto-block Malicious</h4>
                <p className="text-sm text-red-700">Automatically block malicious code</p>
              </div>
              <button
                onClick={() => updateSetting('auto_block_malicious', !settings.auto_block_malicious)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.auto_block_malicious ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.auto_block_malicious ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
              <div>
                <h4 className="font-medium text-red-900">Data Encryption</h4>
                <p className="text-sm text-red-700">Encrypt sensitive data</p>
              </div>
              <button
                onClick={() => updateSetting('data_encryption', !settings.data_encryption)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.data_encryption ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.data_encryption ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Rate Limiting */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="flex items-center space-x-2 text-lg font-medium text-yellow-900 mb-3">
          <Network className="w-5 h-5" />
          <span>Enhanced Rate Limiting</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-yellow-900 mb-2">
              Max Executions per Minute
            </label>
            <input
              type="number"
              min="1"
              max="300"
              value={settings.max_executions_per_minute}
              onChange={(e) => updateSetting('max_executions_per_minute', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-900 mb-2">
              Max Executions per Hour
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              value={settings.max_executions_per_hour}
              onChange={(e) => updateSetting('max_executions_per_hour', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-900 mb-2">
              Security Level
            </label>
            <select
              value={settings.security_level}
              onChange={(e) => updateSetting('security_level', e.target.value)}
              className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="low">Low Security</option>
              <option value="medium">Medium Security</option>
              <option value="high">High Security</option>
              <option value="maximum">Maximum Security</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Advanced Settings */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">Advanced Security Configuration</span>
          {showAdvanced ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        </button>
        
        {showAdvanced && (
          <div className="border-t border-gray-200 p-4 space-y-6">
            {/* Password Policy */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Password Policy</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Length
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="32"
                    value={settings.password_policy.min_length}
                    onChange={(e) => updateNestedSetting('password_policy', 'min_length', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Expiry (days)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="365"
                    value={settings.password_policy.password_expiry_days}
                    onChange={(e) => updateNestedSetting('password_policy', 'password_expiry_days', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { key: 'require_special', label: 'Require Special Characters' },
                  { key: 'require_numbers', label: 'Require Numbers' },
                  { key: 'require_uppercase', label: 'Require Uppercase Letters' }
                ].map(req => (
                  <div key={req.key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{req.label}</span>
                    <button
                      onClick={() => updateNestedSetting('password_policy', req.key, !settings.password_policy[req.key])}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        settings.password_policy[req.key] ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          settings.password_policy[req.key] ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Blocked Imports */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Blocked Python Imports
              </label>
              <div className="space-y-2">
                {settings.blocked_imports.map((importName, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={importName}
                      onChange={(e) => updateArraySetting('blocked_imports', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeFromArray('blocked_imports', index)}
                      className="px-2 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addToArray('blocked_imports', '')}
                  className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg border border-blue-300"
                >
                  + Add Import
                </button>
              </div>
            </div>

            {/* Blocked Functions */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Blocked Python Functions
              </label>
              <div className="space-y-2">
                {settings.blocked_functions.map((funcName, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={funcName}
                      onChange={(e) => updateArraySetting('blocked_functions', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeFromArray('blocked_functions', index)}
                      className="px-2 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addToArray('blocked_functions', '')}
                  className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg border border-blue-300"
                >
                  + Add Function
                </button>
              </div>
            </div>

            {/* Compliance Standards */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Compliance Standards
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['GDPR', 'SOC2', 'ISO 27001', 'HIPAA', 'PCI DSS', 'CCPA'].map(standard => (
                  <label key={standard} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.compliance_standards.includes(standard)}
                      onChange={(e) => {
                        const newStandards = e.target.checked
                          ? [...settings.compliance_standards, standard]
                          : settings.compliance_standards.filter(s => s !== standard);
                        updateSetting('compliance_standards', newStandards);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{standard}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200">
            <Download className="w-4 h-4" />
            <span>Export Policy</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-200">
            <Upload className="w-4 h-4" />
            <span>Import Policy</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 border border-purple-200">
            <FileText className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
          <button 
            onClick={() => {
              runAiSecurityAnalysis();
              updateAchievementProgress('security_expert', 85);
            }}
            className="flex items-center justify-center space-x-2 p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 border border-yellow-200"
          >
            <Brain className="w-4 h-4" />
            <span>AI Scan</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Panel 5: Learning & Achievement System
  const renderLearningPanel = () => (
    <div className="space-y-6">
      {/* Learning Progress Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">Security Learning Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Modules Completed</span>
              <span className="text-2xl font-bold text-purple-600">
                {learning.completed_modules}/{learning.total_modules}
              </span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(learning.completed_modules / learning.total_modules) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Score</span>
              <span className="text-2xl font-bold text-purple-600">
                {Math.round(learning.skill_assessments.reduce((acc, skill) => acc + skill.score, 0) / learning.skill_assessments.length)}%
              </span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Skill Level</span>
              <span className="text-lg font-semibold text-purple-700">
                {learning.skill_assessments.find(s => s.score === Math.max(...learning.skill_assessments.map(s => s.score)))?.level || 'Beginner'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Assessments */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Assessments</h3>
        <div className="space-y-4">
          {learning.skill_assessments.map((assessment, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{assessment.skill}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  assessment.level === 'Advanced' ? 'bg-green-100 text-green-800' :
                  assessment.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {assessment.level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        assessment.score >= 80 ? 'bg-green-500' :
                        assessment.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${assessment.score}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{assessment.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Training */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Training</h3>
        <div className="space-y-3">
          {learning.recommended_training.map((training, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">{training}</span>
              </div>
              <button 
                onClick={() => completeTrainingModule(index)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Start
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement System */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement System</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(achievements).map(([key, achievement]) => (
            <div key={key} className={`p-4 rounded-lg border-2 ${
              achievement.unlocked 
                ? 'border-yellow-300 bg-yellow-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                  <Trophy className={`w-5 h-5 ${achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'}`} />
                  <span className="capitalize">{key.replace('_', ' ')}</span>
                </h4>
                {achievement.unlocked && (
                  <Award className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{achievement.progress}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      achievement.unlocked ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                {achievement.requirements.map((req, reqIndex) => (
                  <li key={reqIndex} className="flex items-center space-x-1">
                    <CheckCircle className={`w-3 h-3 ${achievement.progress >= 100 ? 'text-green-600' : 'text-gray-400'}`} />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Security Events */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Security Events</h3>
        <div className="space-y-3">
          {realtimeData.security_events.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(event.status)}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {event.type.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-600">
                    {event.user} from {event.ip}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  event.status === 'success' ? 'bg-green-100 text-green-800' :
                  event.status === 'blocked' ? 'bg-red-100 text-red-800' :
                  event.status === 'flagged' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Security Intelligence Platform</h2>
            {hasChanges && (
              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                Unsaved Changes
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Security Monitoring</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        {renderTabNavigation()}
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        {activeTab === 'intelligence' && renderSecurityIntelligencePanel()}
        {activeTab === 'analytics' && renderSecurityAnalyticsPanel()}
        {activeTab === 'collaboration' && renderCollaborationPanel()}
        {activeTab === 'management' && renderSecurityManagementPanel()}
        {activeTab === 'learning' && renderLearningPanel()}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
          >
            <RotateCcw className="w-4 h-4 inline mr-1" />
            Reset to Defaults
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSettings(prev => ({ ...prev, security_level: 'high' }))}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              Apply Security Template
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            
            <button
              onClick={saveSettings}
              disabled={!hasChanges || loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{loading ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;