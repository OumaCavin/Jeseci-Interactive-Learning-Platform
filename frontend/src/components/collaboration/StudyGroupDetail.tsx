// Study Group Detail - Detailed view and management for study groups
import React, { useState, useEffect } from 'react';
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
} from '@heroicons/react/24/outline';
import { useCollaborationStore } from '../../stores/collaborationStore';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface StudyGroupDetailProps {
  groupId: string;
}

export const StudyGroupDetail: React.FC<StudyGroupDetailProps> = ({ groupId }) => {
  const navigate = useNavigate();
  const { groupId: urlGroupId } = useParams<{ groupId: string }>();
  const actualGroupId = groupId || urlGroupId;
  
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

  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'projects' | 'chat'>('overview');
  const [newMessage, setNewMessage] = useState('');
  const [showMemberMenu, setShowMemberMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!studyGroups.length) {
      loadStudyGroups();
    }
    if (actualGroupId) {
      loadGroupChat(actualGroupId);
    }
  }, [actualGroupId, loadStudyGroups, loadGroupChat]);

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
    { id: 'members', label: 'Members', icon: UserGroupIcon },
    { id: 'projects', label: 'Projects', icon: DocumentTextIcon },
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Overall Progress</span>
                      <span>{group.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${group.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>This group is {group.progress}% complete with their learning objectives.</p>
                  </div>
                </Card>
              </div>
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