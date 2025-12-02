// Enhanced Study Group Detail - Complete Study Group Management Platform
// Real-time collaboration, AI-powered intelligence, advanced analytics
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserPlusIcon,
  UserMinusIcon,
  EllipsisVerticalIcon,
  ClockIcon,
  TrophyIcon,
  ShareIcon,
  CogIcon,
  SparklesIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BellIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  FireIcon,
  AcademicCapIcon,
  LightBulbIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  CpuChipIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  ServerIcon,
  WiFiIcon,
  CloudArrowUpIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { useCollaborationStore } from '../../stores/collaborationStore';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface StudyGroupDetailProps {
  groupId: string;
}

interface AIMemberRecommendation {
  userId: string;
  name: string;
  avatar: string;
  compatibility: number;
  skills: string[];
  reason: string;
}

interface GroupInsight {
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation?: string;
}

interface ActivityFeed {
  id: string;
  type: 'join' | 'leave' | 'message' | 'project' | 'achievement';
  user: { name: string; avatar: string };
  description: string;
  timestamp: Date;
}

interface GroupAnalytics {
  engagement: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  participation: {
    activeMembers: number;
    contribution: number;
    retention: number;
  };
  performance: {
    completion: number;
    quality: number;
    collaboration: number;
  };
  predictions: {
    successRate: number;
    growth: number;
    retention: number;
  };
}

export const StudyGroupDetail: React.FC<StudyGroupDetailProps> = ({ groupId }) => {
  const navigate = useNavigate();
  const { groupId: urlGroupId } = useParams<{ groupId: string }>();
  const actualGroupId = groupId || urlGroupId;
  const wsRef = useRef<WebSocket | null>(null);
  
  const { user } = useAuthStore();
  const {
    studyGroups,
    groupChats,
    selectedGroup,
    loadStudyGroups,
    loadGroupChat,
    joinGroup,
    leaveGroup,
    setActiveChat,
    sendMessage
  } = useCollaborationStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'members' | 'projects' | 'chat' | 'discussions' | 'code-sharing' | 'challenges'>('overview');
  const [newMessage, setNewMessage] = useState('');
  const [showMemberMenu, setShowMemberMenu] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIMemberRecommendation[]>([]);
  const [groupInsights, setGroupInsights] = useState<GroupInsight[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeed[]>([]);
  const [analytics, setAnalytics] = useState<GroupAnalytics | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [onlineMembers, setOnlineMembers] = useState<string[]>([]);

  useEffect(() => {
    if (!studyGroups.length) {
      loadStudyGroups();
    }
    if (actualGroupId) {
      loadGroupChat(actualGroupId);
      initializeWebSocket();
      loadAIInsights();
      loadActivityFeed();
      loadAnalytics();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [actualGroupId, loadStudyGroups, loadGroupChat]);

  // WebSocket Management
  const initializeWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    try {
      setIsReconnecting(true);
      const ws = new WebSocket(`wss://api.jac-learning.com/ws/groups/${actualGroupId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsReconnecting(false);
        ws.send(JSON.stringify({
          type: 'join_group',
          groupId: actualGroupId,
          userId: user?.id
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(() => initializeWebSocket(), 3000);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setIsReconnecting(false);
    }
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'user_joined':
        setOnlineMembers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
        addToActivityFeed({
          type: 'join',
          user: { name: data.username, avatar: data.avatar },
          description: `${data.username} joined the group`,
          timestamp: new Date()
        });
        break;
      case 'user_left':
        setOnlineMembers(prev => prev.filter(id => id !== data.userId));
        addToActivityFeed({
          type: 'leave',
          user: { name: data.username, avatar: data.avatar },
          description: `${data.username} left the group`,
          timestamp: new Date()
        });
        break;
      case 'new_message':
        loadGroupChat(actualGroupId!);
        addToActivityFeed({
          type: 'message',
          user: { name: data.username, avatar: data.avatar },
          description: `sent a message: "${data.message.substring(0, 50)}..."`,
          timestamp: new Date()
        });
        break;
      case 'ai_insight':
        setGroupInsights(prev => [data.insight, ...prev.slice(0, 4)]);
        break;
    }
  };

  // AI-Powered Features
  const loadAIInsights = async () => {
    setLoadingAI(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const insights: GroupInsight[] = [
        {
          type: 'positive',
          title: 'High Engagement Detected',
          description: 'Group shows 15% higher engagement than similar study groups',
          recommendation: 'Consider scheduling more interactive sessions'
        },
        {
          type: 'warning',
          title: 'Activity Distribution Gap',
          description: '60% of activity comes from 3 core members',
          recommendation: 'Encourage broader participation through smaller task assignments'
        },
        {
          type: 'info',
          title: 'Optimal Meeting Time',
          description: 'Peak collaboration time is 2-4 PM EST',
          recommendation: 'Schedule important sessions during this window'
        }
      ];

      const recommendations: AIMemberRecommendation[] = [
        {
          userId: 'user_alice',
          name: 'Alice Chen',
          avatar: 'https://ui-avatars.com/api/?name=Alice+Chen&background=8b5cf6&color=fff',
          compatibility: 95,
          skills: ['React', 'TypeScript', 'UI/UX'],
          reason: 'Complementary skills in frontend development'
        },
        {
          userId: 'user_bob',
          name: 'Bob Johnson',
          avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=10b981&color=fff',
          compatibility: 88,
          skills: ['Python', 'Data Science', 'Machine Learning'],
          reason: 'Strong analytical skills for data-driven projects'
        }
      ];

      setGroupInsights(insights);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const loadActivityFeed = () => {
    // Simulate activity feed
    const activities: ActivityFeed[] = [
      {
        id: '1',
        type: 'join',
        user: { name: 'Sarah Wilson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=f59e0b&color=fff' },
        description: 'joined the React Advanced Patterns study group',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: '2',
        type: 'message',
        user: { name: 'Mike Chen', avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=3b82f6&color=fff' },
        description: 'shared a solution for the async challenges',
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: '3',
        type: 'achievement',
        user: { name: 'Emma Davis', avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=8b5cf6&color=fff' },
        description: 'completed 50 code reviews this week!',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      }
    ];
    setActivityFeed(activities);
  };

  const loadAnalytics = () => {
    // Simulate analytics data
    const mockAnalytics: GroupAnalytics = {
      engagement: {
        daily: 78,
        weekly: 85,
        monthly: 92
      },
      participation: {
        activeMembers: 18,
        contribution: 89,
        retention: 94
      },
      performance: {
        completion: 87,
        quality: 91,
        collaboration: 83
      },
      predictions: {
        successRate: 94,
        growth: 12,
        retention: 97
      }
    };
    setAnalytics(mockAnalytics);
  };

  const addToActivityFeed = (activity: Omit<ActivityFeed, 'id'>) => {
    const newActivity: ActivityFeed = {
      ...activity,
      id: Date.now().toString()
    };
    setActivityFeed(prev => [newActivity, ...prev.slice(0, 49)]);
  };

  const group = studyGroups.find(g => g.id === actualGroupId);
  const chat = groupChats.find(c => c.groupId === actualGroupId);
  const isMember = group?.members.includes(user?.id || 'currentUser');

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-12 text-center">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Group not found</h3>
          <p className="text-gray-600 mb-4">The study group you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/collaboration')}>
            Back to Collaboration
          </Button>
        </Card>
      </div>
    );
  }

  const handleJoinGroup = async () => {
    if (group.id) {
      await joinGroup(group.id);
    }
  };

  const handleLeaveGroup = async () => {
    if (group.id) {
      await leaveGroup(group.id);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && group.id) {
      await sendMessage(group.id, newMessage.trim());
      setNewMessage('');
    }
  };

  const handleOpenChat = () => {
    setActiveChat(group.id);
    setActiveTab('chat');
  };

  const mockMembers = [
    {
      id: 'user1',
      name: 'Alice Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=3b82f6&color=fff',
      role: 'admin',
      status: 'online',
      joinedAt: new Date('2024-01-15')
    },
    {
      id: 'user2',
      name: 'Bob Smith',
      avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=10b981&color=fff',
      role: 'member',
      status: 'online',
      joinedAt: new Date('2024-01-20')
    },
    {
      id: 'user3',
      name: 'Carol Davis',
      avatar: 'https://ui-avatars.com/api/?name=Carol+Davis&background=f59e0b&color=fff',
      role: 'member',
      status: 'away',
      joinedAt: new Date('2024-02-01')
    },
    {
      id: 'currentUser',
      name: 'You',
      avatar: 'https://ui-avatars.com/api/?name=You&background=8b5cf6&color=fff',
      role: isMember ? 'member' : 'guest',
      status: 'online',
      joinedAt: new Date('2024-02-10')
    }
  ].filter(member => group.members.includes(member.id));

  const mockProjects = [
    {
      id: '1',
      title: 'React Component Library',
      description: 'Building reusable components for the learning platform',
      progress: 75,
      status: 'active',
      members: ['user1', 'user2', 'currentUser'],
      dueDate: new Date('2024-12-31')
    },
    {
      id: '2',
      title: 'API Documentation',
      description: 'Collaborative documentation for our REST API',
      progress: 40,
      status: 'planning',
      members: ['user3', 'currentUser'],
      dueDate: new Date('2025-01-15')
    }
  ].filter(project => project.members.includes('currentUser') || isMember);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserGroupIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'members', label: 'Members', icon: UserGroupIcon },
    { id: 'projects', label: 'Projects', icon: DocumentTextIcon },
    { id: 'discussions', label: 'Discussions', icon: ChatBubbleLeftRightIcon },
    { id: 'code-sharing', label: 'Code Share', icon: CodeBracketIcon },
    { id: 'challenges', label: 'Challenges', icon: TrophyIcon },
    { id: 'chat', label: 'Chat', icon: ChatBubbleLeftRightIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/collaboration')}
              className="p-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {group.name}
              </h1>
              <p className="text-gray-600">
                {group.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isMember ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleOpenChat}
                    className="flex items-center gap-2"
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    Open Chat
                  </Button>
                  <Button
                    onClick={handleLeaveGroup}
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Leave Group
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleJoinGroup}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <UserPlusIcon className="h-4 w-4" />
                  Join Group
                </Button>
              )}
              
              {/* Real-time Connection Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border">
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : isReconnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span className="text-xs text-gray-600">
                  {isConnected ? 'Connected' : isReconnecting ? 'Reconnecting...' : 'Offline'}
                </span>
              </div>
              
              <Button variant="outline" className="p-2">
                <EllipsisVerticalIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Group Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserGroupIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Members</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {group.members.length}/{group.maxMembers}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrophyIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-lg font-semibold text-gray-900">{group.progress}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Meeting</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {group.nextMeeting ? new Date(group.nextMeeting).toLocaleDateString() : 'Not scheduled'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  group.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <ClockIcon className={`h-5 w-5 ${
                    group.status === 'active' ? 'text-green-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`text-sm font-semibold ${
                    group.status === 'active' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {group.status}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-6">
                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About this group</h3>
                  <p className="text-gray-600 mb-4">
                    {group.description_long || group.description}
                  </p>
                  {group.goals && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Group Goals</h4>
                      <ul className="space-y-1">
                        {group.goals.map((goal, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>

                {group.meetingSchedule && (
                  <Card className="p-6 bg-white/80 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-purple-600" />
                      Meeting Schedule
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frequency:</span>
                        <span className="font-medium">{group.meetingSchedule.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Day:</span>
                        <span className="font-medium">{group.meetingSchedule.day}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{group.meetingSchedule.time} ({group.meetingSchedule.timezone})</span>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-purple-600" />
                    AI-Powered Insights
                  </h3>
                  {loadingAI ? (
                    <div className="space-y-3">
                      <div className="animate-pulse bg-gray-200 h-4 rounded" />
                      <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4" />
                      <div className="animate-pulse bg-gray-200 h-4 rounded w-1/2" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {groupInsights.map((insight, index) => (
                        <div key={index} className={`p-3 rounded-lg border-l-4 ${
                          insight.type === 'positive' ? 'border-green-500 bg-green-50' :
                          insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                          'border-blue-500 bg-blue-50'
                        }`}>
                          <div className="flex items-start gap-2">
                            {insight.type === 'positive' ? <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" /> :
                             insight.type === 'warning' ? <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" /> :
                             <LightBulbIcon className="h-5 w-5 text-blue-600 mt-0.5" />}
                            <div>
                              <h4 className="font-medium text-gray-900">{insight.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                              {insight.recommendation && (
                                <p className="text-xs text-gray-500 mt-2 italic">
                                  💡 {insight.recommendation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ChartBarIcon className="h-5 w-5 text-blue-600" />
                    Activity Feed
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {activityFeed.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <img
                          src={activity.user.avatar}
                          alt={activity.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user.name}</span> {activity.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'join' ? 'bg-green-500' :
                          activity.type === 'leave' ? 'bg-red-500' :
                          activity.type === 'achievement' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`} />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AcademicCapIcon className="h-5 w-5 text-indigo-600" />
                    Member Recommendations
                  </h3>
                  <div className="space-y-3">
                    {aiRecommendations.map((rec) => (
                      <div key={rec.userId} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <img
                            src={rec.avatar}
                            alt={rec.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">{rec.name}</h4>
                              <div className="flex items-center gap-1">
                                <StarIcon className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm text-gray-600">{rec.compatibility}%</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {rec.skills.map((skill) => (
                                <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <Button size="sm" className="text-xs">
                              Invite to Group
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrophyIcon className="h-5 w-5 text-yellow-600" />
                    Group Achievements
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <FireIcon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">12</p>
                      <p className="text-sm text-gray-600">Day Streak</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <StarIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">1,250</p>
                      <p className="text-sm text-gray-600">Points Earned</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <PresentationChartLineIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Engagement Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics?.engagement.weekly}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">+5.2%</span>
                    <span className="text-gray-500">vs last week</span>
                  </div>
                </Card>

                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <UserGroupIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Members</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics?.participation.activeMembers}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-500">{group?.members.length} total members</span>
                  </div>
                </Card>

                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrophyIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics?.predictions.successRate}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">+2.1%</span>
                    <span className="text-gray-500">prediction accuracy</span>
                  </div>
                </Card>

                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <FireIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Growth Rate</p>
                      <p className="text-2xl font-bold text-gray-900">+{analytics?.predictions.growth}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-500">Expected monthly growth</span>
                  </div>
                </Card>
              </div>

              {/* Detailed Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ChartPieIcon className="h-5 w-5 text-blue-600" />
                    Engagement Trends
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Daily</span>
                        <span>{analytics?.engagement.daily}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${analytics?.engagement.daily}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Weekly</span>
                        <span>{analytics?.engagement.weekly}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${analytics?.engagement.weekly}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Monthly</span>
                        <span>{analytics?.engagement.monthly}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${analytics?.engagement.monthly}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CpuChipIcon className="h-5 w-5 text-green-600" />
                    AI Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium">Task Completion</span>
                      </div>
                      <span className="text-lg font-bold text-green-700">{analytics?.performance.completion}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <StarIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium">Quality Score</span>
                      </div>
                      <span className="text-lg font-bold text-blue-700">{analytics?.performance.quality}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium">Collaboration</span>
                      </div>
                      <span className="text-lg font-bold text-purple-700">{analytics?.performance.collaboration}%</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Predictions and Insights */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <LightBulbIcon className="h-5 w-5 text-yellow-600" />
                  AI Predictions & Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Success Prediction</h4>
                    <p className="text-2xl font-bold text-green-600 mb-1">{analytics?.predictions.successRate}%</p>
                    <p className="text-sm text-gray-600">High probability of achieving goals</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Growth Forecast</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-1">+{analytics?.predictions.growth}%</p>
                    <p className="text-sm text-gray-600">Expected member increase</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <UsersIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Retention Rate</h4>
                    <p className="text-2xl font-bold text-purple-600 mb-1">{analytics?.predictions.retention}%</p>
                    <p className="text-sm text-gray-600">Predicted member retention</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Members ({mockMembers.length})
                </h3>
                {isMember && (
                  <Button variant="outline" className="flex items-center gap-2">
                    <UserPlusIcon className="h-4 w-4" />
                    Invite Members
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockMembers.map((member) => (
                  <Card key={member.id} className="p-6 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          member.status === 'online' ? 'bg-green-500' :
                          member.status === 'away' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          {member.role === 'admin' && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 capitalize">{member.status}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Joined {member.joinedAt.toLocaleDateString()}
                        </p>
                      </div>
                      {isMember && member.id !== 'currentUser' && (
                        <button
                          onClick={() => setShowMemberMenu(showMemberMenu === member.id ? null : member.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <EllipsisVerticalIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Collaborative Projects ({mockProjects.length})
                </h3>
                {isMember && (
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600">
                    <DocumentTextIcon className="h-4 w-4" />
                    New Project
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockProjects.map((project) => (
                  <Card key={project.id} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{project.members.length} members</span>
                      {project.dueDate && (
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          Due {project.dueDate.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'discussions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Group Discussions</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <BellIcon className="h-4 w-4" />
                    Follow Topics
                  </Button>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    New Discussion
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: '1',
                    title: 'Best practices for React Hooks optimization',
                    author: 'Alice Chen',
                    avatar: 'https://ui-avatars.com/api/?name=Alice+Chen&background=8b5cf6&color=fff',
                    content: 'I\'ve been working on optimizing our React components and wanted to share some insights...',
                    replies: 23,
                    views: 156,
                    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    isPinned: true,
                    tags: ['React', 'Performance', 'Hooks'],
                    sentiment: 'positive'
                  },
                  {
                    id: '2',
                    title: 'Database design patterns for scalability',
                    author: 'Bob Johnson',
                    avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=10b981&color=fff',
                    content: 'Looking for advice on designing databases that can handle millions of users...',
                    replies: 18,
                    views: 89,
                    lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000),
                    isPinned: false,
                    tags: ['Database', 'Architecture', 'Scalability'],
                    sentiment: 'neutral'
                  },
                  {
                    id: '3',
                    title: 'Code review checklist template',
                    author: 'Carol Davis',
                    avatar: 'https://ui-avatars.com/api/?name=Carol+Davis&background=f59e0b&color=fff',
                    content: 'I created a comprehensive checklist for code reviews. What do you think?',
                    replies: 31,
                    views: 201,
                    lastActivity: new Date(Date.now() - 8 * 60 * 60 * 1000),
                    isPinned: false,
                    tags: ['Code Review', 'Best Practices', 'Quality'],
                    sentiment: 'positive'
                  }
                ].map((topic) => (
                  <Card key={topic.id} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <img
                        src={topic.avatar}
                        alt={topic.author}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {topic.isPinned && (
                            <StarIcon className="h-4 w-4 text-yellow-500" />
                          )}
                          <h4 className="font-semibold text-gray-900 text-lg">{topic.title}</h4>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            topic.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                            topic.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {topic.sentiment}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3">{topic.content}</p>
                        <div className="flex items-center gap-2 mb-3">
                          {topic.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{topic.author}</span>
                            <span>{topic.replies} replies</span>
                            <span>{topic.views} views</span>
                            <span>{topic.lastActivity.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'code-sharing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Code Sharing & Collaboration</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <CodeBracketIcon className="h-4 w-4" />
                    View Templates
                  </Button>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600">
                    <CloudArrowUpIcon className="h-4 w-4" />
                    Share Code
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    id: '1',
                    title: 'React Custom Hooks Collection',
                    author: 'Alice Chen',
                    avatar: 'https://ui-avatars.com/api/?name=Alice+Chen&background=8b5cf6&color=fff',
                    description: 'A collection of reusable custom hooks for common React patterns',
                    language: 'TypeScript',
                    category: 'Utilities',
                    downloads: 234,
                    likes: 89,
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    isFeatured: true
                  },
                  {
                    id: '2',
                    title: 'API Rate Limiter Middleware',
                    author: 'Bob Johnson',
                    avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=10b981&color=fff',
                    description: 'Express middleware for implementing rate limiting with Redis backend',
                    language: 'JavaScript',
                    category: 'Security',
                    downloads: 156,
                    likes: 67,
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    isFeatured: false
                  },
                  {
                    id: '3',
                    title: 'Database Migration Scripts',
                    author: 'Carol Davis',
                    avatar: 'https://ui-avatars.com/api/?name=Carol+Davis&background=f59e0b&color=fff',
                    description: 'Automated migration scripts for PostgreSQL schema changes',
                    language: 'Python',
                    category: 'Database',
                    downloads: 89,
                    likes: 43,
                    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
                    isFeatured: false
                  },
                  {
                    id: '4',
                    title: 'CSS Grid Responsive Layouts',
                    author: 'David Wilson',
                    avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=3b82f6&color=fff',
                    description: 'Ready-to-use CSS Grid layouts for common design patterns',
                    language: 'CSS',
                    category: 'Design',
                    downloads: 445,
                    likes: 178,
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    isFeatured: true
                  }
                ].map((share) => (
                  <Card key={share.id} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{share.title}</h4>
                          {share.isFeatured && (
                            <StarIcon className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <img
                            src={share.avatar}
                            alt={share.author}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-gray-600">{share.author}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-500">{share.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {share.language}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {share.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{share.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CloudArrowUpIcon className="h-4 w-4" />
                          {share.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4" />
                          {share.likes}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                          <CloudArrowUpIcon className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Group Challenges</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <TrophyIcon className="h-4 w-4" />
                    Leaderboard
                  </Button>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600">
                    <TrophyIcon className="h-4 w-4" />
                    Create Challenge
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  {
                    id: '1',
                    title: '30-Day Coding Streak',
                    description: 'Maintain a 30-day coding streak by completing at least one coding exercise daily',
                    difficulty: 'Intermediate',
                    participants: 47,
                    maxParticipants: 50,
                    endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
                    reward: '500 points + Gold Badge',
                    status: 'active',
                    progress: 65,
                    category: 'Consistency',
                    isParticipating: true
                  },
                  {
                    id: '2',
                    title: 'Build a Full-Stack App',
                    description: 'Create a complete full-stack application with authentication, database, and deployment',
                    difficulty: 'Advanced',
                    participants: 23,
                    maxParticipants: 30,
                    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                    reward: '1000 points + Portfolio Showcase',
                    status: 'active',
                    progress: 30,
                    category: 'Project',
                    isParticipating: false
                  },
                  {
                    id: '3',
                    title: 'Algorithm Optimization Challenge',
                    description: 'Optimize given algorithms and submit your improved versions with detailed explanations',
                    difficulty: 'Expert',
                    participants: 15,
                    maxParticipants: 25,
                    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
                    reward: '750 points + Expert Badge',
                    status: 'active',
                    progress: 80,
                    category: 'Algorithms',
                    isParticipating: true
                  },
                  {
                    id: '4',
                    title: 'Code Review Marathon',
                    description: 'Review 100 code submissions from fellow group members with constructive feedback',
                    difficulty: 'Beginner',
                    participants: 67,
                    maxParticipants: 100,
                    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    reward: '300 points + Community Badge',
                    status: 'active',
                    progress: 25,
                    category: 'Collaboration',
                    isParticipating: false
                  }
                ].map((challenge) => (
                  <Card key={challenge.id} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg">{challenge.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            challenge.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                            challenge.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {challenge.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          challenge.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {challenge.status}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{challenge.description}</p>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-orange-600 h-2 rounded-full" 
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Participants</p>
                        <p className="font-semibold">{challenge.participants}/{challenge.maxParticipants}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Ends</p>
                        <p className="font-semibold">{challenge.endDate.toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-50 rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <TrophyIcon className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Reward: {challenge.reward}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {challenge.isParticipating ? (
                        <Button variant="outline" className="flex items-center gap-2 text-green-600 border-green-200">
                          <CheckCircleIcon className="h-4 w-4" />
                          Participating
                        </Button>
                      ) : (
                        <Button className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600">
                          <PlayIcon className="h-4 w-4" />
                          Join Challenge
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <Card className="p-6 bg-white/80 backdrop-blur-sm h-96 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {chat?.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.senderId === 'currentUser' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <img
                          src={message.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.senderName)}&background=3b82f6&color=fff`}
                          alt={message.senderName}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className={`flex-1 ${message.senderId === 'currentUser' ? 'text-right' : ''}`}>
                          <div className={`inline-block p-3 rounded-lg ${
                            message.senderId === 'currentUser'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      Send
                    </Button>
                  </form>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <h4 className="font-medium text-gray-900 mb-4">Online Members</h4>
                  <div className="space-y-3">
                    {mockMembers.filter(m => m.status === 'online').map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />
                        </div>
                        <span className="text-sm text-gray-900">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start text-sm">
                      <ShareIcon className="h-4 w-4 mr-2" />
                      Share Group
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-sm">
                      <CogIcon className="h-4 w-4 mr-2" />
                      Group Settings
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};