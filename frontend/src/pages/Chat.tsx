import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Settings, 
  BookOpen, 
  Code, 
  Brain, 
  Lightbulb,
  Star,
  Clock,
  TrendingUp,
  Award,
  MessageSquare,
  Users,
  Sparkles,
  Zap,
  Target,
  Activity,
  Calendar,
  BarChart3
} from 'lucide-react';
import MultiAgentChat from '../components/agents/MultiAgentChat';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useUserStatsStore } from '../stores/userStatsStore';
import gamificationService from '../services/gamificationService';

interface ChatProps {
  // Props for customization if needed
}

interface ChatSession {
  id: string;
  title: string;
  subject?: string;
  agentId: string;
  messageCount: number;
  duration: number; // in minutes
  lastActivity: Date;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  productivity: number; // 0-100
  achievements: string[];
}

interface StudyStreak {
  current: number;
  longest: number;
  lastStudyDate: Date;
}

const Chat: React.FC<ChatProps> = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'sessions' | 'analytics' | 'settings'>('chat');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  
  const { statistics, achievements, loadUserStats } = useUserStatsStore();

  useEffect(() => {
    loadUserStats();
    loadChatSessions();
  }, [loadUserStats]);

  const loadChatSessions = () => {
    // Load from localStorage or API
    const savedSessions = localStorage.getItem('chat_sessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setChatSessions(parsed.map((session: any) => ({
        ...session,
        lastActivity: new Date(session.lastActivity)
      })));
    } else {
      // Generate sample sessions
      const sampleSessions: ChatSession[] = [
        {
          id: '1',
          title: 'Python Basics Review',
          subject: 'Programming',
          agentId: 'code_tutor',
          messageCount: 15,
          duration: 25,
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
          difficulty: 'beginner',
          productivity: 85,
          achievements: ['First Code Session', 'Quick Learner']
        },
        {
          id: '2',
          title: 'AI Concepts Deep Dive',
          subject: 'Artificial Intelligence',
          agentId: 'ai_analyst',
          messageCount: 22,
          duration: 45,
          lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
          difficulty: 'advanced',
          productivity: 92,
          achievements: ['Advanced Thinker', 'Persistent Learner']
        },
        {
          id: '3',
          title: 'Creative Writing Ideas',
          subject: 'Creative Writing',
          agentId: 'creative_guide',
          messageCount: 8,
          duration: 15,
          lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          difficulty: 'intermediate',
          productivity: 78,
          achievements: ['Creative Spark']
        }
      ];
      setChatSessions(sampleSessions);
      localStorage.setItem('chat_sessions', JSON.stringify(sampleSessions));
    }
  };

  const startNewSession = (agentId?: string, subject?: string, difficulty?: string) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: subject ? `${subject} Session` : 'New Learning Session',
      subject,
      agentId: agentId || 'content_curator',
      messageCount: 0,
      duration: 0,
      lastActivity: new Date(),
      difficulty: difficulty as any,
      productivity: 0,
      achievements: []
    };
    
    setCurrentSession(newSession);
    setActiveTab('chat');
  };

  const endSession = (sessionId: string, metrics: { messageCount: number; duration: number }) => {
    setChatSessions(prev => {
      const updated = prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messageCount: session.messageCount + metrics.messageCount,
            duration: session.duration + metrics.duration,
            lastActivity: new Date(),
            productivity: Math.min(100, session.productivity + Math.floor(Math.random() * 20))
          };
        }
        return session;
      });
      localStorage.setItem('chat_sessions', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredSessions = chatSessions.filter(session => {
    if (subjectFilter !== 'all' && session.subject !== subjectFilter) return false;
    if (difficultyFilter !== 'all' && session.difficulty !== difficultyFilter) return false;
    return true;
  });

  const getAgentIcon = (agentId: string) => {
    const icons = {
      content_curator: <BookOpen className="w-4 h-4" />,
      code_tutor: <Code className="w-4 h-4" />,
      ai_analyst: <Brain className="w-4 h-4" />,
      creative_guide: <Lightbulb className="w-4 h-4" />
    };
    return icons[agentId as keyof typeof icons] || <Bot className="w-4 h-4" />;
  };

  const getProductivityColor = (productivity: number) => {
    if (productivity >= 80) return 'text-green-600';
    if (productivity >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAgentSwitch = async (agentId: string) => {
    try {
      await gamificationService.awardPoints(5, 'agent_switch', {
        agent_id: agentId,
        action: 'switch_agent'
      });
    } catch (error) {
      console.warn('Failed to trigger gamification for agent switch:', error);
    }
  };

  const handleMessageSent = async (agentId: string, message: string) => {
    try {
      await gamificationService.awardPoints(2, 'message_sent', {
        agent_id: agentId,
        message_length: message.length,
        action: 'send_message'
      });
    } catch (error) {
      console.warn('Failed to trigger gamification for message sent:', error);
    }
  };

  const handleResponseReceived = async (agentId: string, response: string) => {
    try {
      await gamificationService.awardPoints(3, 'response_received', {
        agent_id: agentId,
        response_length: response.length,
        action: 'receive_response'
      });
    } catch (error) {
      console.warn('Failed to trigger gamification for response received:', error);
    }
  };

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'sessions', label: 'Sessions', icon: <Clock className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const renderChatView = () => (
    <div className="h-full">
      <MultiAgentChat
        defaultAgent={currentSession?.agentId}
        onAgentSwitch={handleAgentSwitch}
        onMessageSent={handleMessageSent}
        onResponseReceived={handleResponseReceived}
        subject={currentSession?.subject}
        difficulty={currentSession?.difficulty}
        className="h-full"
      />
    </div>
  );

  const renderSessionsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Chat Sessions</h2>
        <div className="flex space-x-2">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Subjects</option>
            <option value="Programming">Programming</option>
            <option value="Artificial Intelligence">AI</option>
            <option value="Creative Writing">Creative Writing</option>
            <option value="Mathematics">Mathematics</option>
          </select>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Start Cards */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => startNewSession('content_curator', 'General Learning', 'beginner')}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Content Curator</h3>
          </div>
          <p className="text-gray-600 text-sm">Start with structured learning content and study materials</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => startNewSession('code_tutor', 'Programming', 'intermediate')}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Code Tutor</h3>
          </div>
          <p className="text-gray-600 text-sm">Get help with programming concepts and debugging</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => startNewSession('ai_analyst', 'Advanced Concepts', 'advanced')}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">AI Analyst</h3>
          </div>
          <p className="text-gray-600 text-sm">Deep analysis and problem-solving assistance</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => startNewSession('creative_guide', 'Creative Projects', 'intermediate')}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Creative Guide</h3>
          </div>
          <p className="text-gray-600 text-sm">Generate ideas and creative solutions</p>
        </Card>
      </div>

      {/* Recent Sessions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Sessions</h3>
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setCurrentSession(session)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {getAgentIcon(session.agentId)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{session.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      {session.subject && <span>{session.subject}</span>}
                      {session.difficulty && (
                        <>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">{session.difficulty}</Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {session.messageCount} messages • {session.duration}min
                  </div>
                  <div className="text-xs text-gray-500">
                    {session.lastActivity.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className={`text-sm font-medium ${getProductivityColor(session.productivity)}`}>
                  {session.productivity}% productive
                </div>
                <div className="flex space-x-1">
                  {session.achievements.map((achievement) => (
                    <Badge key={achievement} variant="secondary" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Learning Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-800">{chatSessions.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-800">
                {chatSessions.reduce((sum, session) => sum + session.messageCount, 0)}
              </p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Time</p>
              <p className="text-2xl font-bold text-gray-800">
                {chatSessions.reduce((sum, session) => sum + session.duration, 0)}min
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Productivity</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(chatSessions.reduce((sum, session) => sum + session.productivity, 0) / chatSessions.length || 0)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {statistics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievement Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Learning Streak</span>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{statistics.current_streak} days</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Points</span>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{statistics.total_points}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Level</span>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Level {statistics.level}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Study Time</span>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{Math.round(statistics.total_study_time / 60)}h</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {achievements.filter(a => a.unlocked).slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    {achievement.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{achievement.name}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );

  const renderSettingsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Chat Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Agent Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Agent
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="content_curator">Content Curator</option>
                <option value="code_tutor">Code Tutor</option>
                <option value="ai_analyst">AI Analyst</option>
                <option value="creative_guide">Creative Guide</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Difficulty
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Learning Reminders</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Achievement Notifications</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Weekly Progress Reports</span>
              <input type="checkbox" className="rounded" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return renderChatView();
      case 'sessions':
        return renderSessionsView();
      case 'analytics':
        return renderAnalyticsView();
      case 'settings':
        return renderSettingsView();
      default:
        return renderChatView();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span>AI Learning Chat</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Chat with specialized AI agents to enhance your learning experience
              </p>
            </div>
            
            {statistics && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-yellow-600">{statistics.total_points}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Level</p>
                  <p className="text-2xl font-bold text-purple-600">{statistics.level}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 overflow-hidden"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;