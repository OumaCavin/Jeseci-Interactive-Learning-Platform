// Collaboration Dashboard - Main dashboard for collaboration features
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  TrophyIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  BellIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useCollaborationStore } from '../../stores/collaborationStore';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface CollaborationDashboardProps {
  onCreateGroup?: () => void;
  onCreateProject?: () => void;
  onJoinGroup?: (groupId: string) => void;
  onViewGroup?: (groupId: string) => void;
  onViewProject?: (projectId: string) => void;
}

export const CollaborationDashboard: React.FC<CollaborationDashboardProps> = ({
  onCreateGroup,
  onCreateProject,
  onJoinGroup,
  onViewGroup,
  onViewProject
}) => {
  const { user } = useAuthStore();
  const {
    myGroups,
    myProjects,
    stats,
    isLoading,
    loadMyGroups,
    loadMyProjects,
    loadStats,
    setCurrentView
  } = useCollaborationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadMyGroups();
    loadMyProjects();
    loadStats();
  }, [loadMyGroups, loadMyProjects, loadStats]);

  const filteredGroups = myGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || group.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const upcomingMeetings = myGroups
    .filter(group => group.nextMeeting && new Date(group.nextMeeting) > new Date())
    .sort((a, b) => new Date(a.nextMeeting!).getTime() - new Date(b.nextMeeting!).getTime())
    .slice(0, 3);

  const recentProjects = myProjects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const subjects = Array.from(new Set(myGroups.map(g => g.subject)));

  const statsCards = [
    {
      title: 'Active Groups',
      value: stats.activeGroups,
      total: stats.totalGroups,
      icon: UserGroupIcon,
      color: 'blue',
      trend: '+2 this week'
    },
    {
      title: 'Collaborative Projects',
      value: myProjects.length,
      icon: DocumentTextIcon,
      color: 'green',
      trend: `${stats.completedProjects} completed`
    },
    {
      title: 'Total Collaborations',
      value: stats.totalCollaborations,
      icon: TrophyIcon,
      color: 'purple',
      trend: 'Most active this month'
    },
    {
      title: 'Engagement Score',
      value: `${Math.round((stats.memberEngagement.veryActive + stats.memberEngagement.active) / 
                     (stats.memberEngagement.veryActive + stats.memberEngagement.active + 
                      stats.memberEngagement.moderate + stats.memberEngagement.inactive) * 100)}%`,
      icon: ChatBubbleLeftRightIcon,
      color: 'orange',
      trend: 'Above average'
    }
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Collaboration Hub
              </h1>
              <p className="text-gray-600">
                Connect, learn, and grow together with your study groups and collaborative projects
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setCurrentView('discover')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                Discover Groups
              </Button>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <PlusIcon className="h-4 w-4" />
                Create New
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsCards.map((stat, index) => (
            <Card key={stat.title} className="relative overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                      {stat.total && (
                        <span className="text-lg font-normal text-gray-500 ml-1">
                          /{stat.total}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {stat.trend}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600`} />
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Groups & Projects */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Study Groups */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                  My Study Groups
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView('groups')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  View All
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Groups Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {filteredGroups.slice(0, 4).map((group) => (
                    <motion.div
                      key={group.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() => onViewGroup?.(group.id)}
                    >
                      <Card className="p-6 h-full bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {group.name}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {group.description}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            group.level === 'beginner' ? 'bg-green-100 text-green-800' :
                            group.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {group.level}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <UserGroupIcon className="h-4 w-4" />
                            {group.members.length}/{group.maxMembers} members
                          </div>
                          <div className={`text-xs font-medium ${
                            group.status === 'active' ? 'text-green-600' :
                            group.status === 'paused' ? 'text-yellow-600' :
                            'text-gray-600'
                          }`}>
                            {group.status}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{group.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${group.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {group.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredGroups.length === 0 && (
                <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
                  <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No study groups found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery ? 'Try adjusting your search or filters' : 'Join or create your first study group to get started'}
                  </p>
                  <Button onClick={() => setCurrentView('discover')} variant="outline">
                    Discover Groups
                  </Button>
                </Card>
              )}
            </motion.div>

            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <DocumentTextIcon className="h-6 w-6 text-green-600" />
                  Recent Projects
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView('projects')}
                  className="text-green-600 hover:text-green-700"
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.01 }}
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project.id)}
                  >
                    <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {project.description}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{project.assignedMembers.length} members</span>
                          <span>{project.tasks.length} tasks</span>
                          {project.dueDate && (
                            <span className="flex items-center gap-1">
                              <ClockIcon className="h-4 w-4" />
                              Due {new Date(project.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
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

                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {recentProjects.length === 0 && (
                <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No collaborative projects yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start a new project with your study group to collaborate effectively
                  </p>
                  <Button onClick={onCreateProject} className="bg-gradient-to-r from-green-600 to-blue-600">
                    Create Project
                  </Button>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Meetings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-purple-600" />
                Upcoming Meetings
              </h3>
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                {upcomingMeetings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMeetings.map((group) => (
                      <div key={group.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <CalendarIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {group.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(group.nextMeeting!).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No upcoming meetings</p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="space-y-3">
                  <Button
                    onClick={() => setCurrentView('groups')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    Browse Study Groups
                  </Button>
                  <Button
                    onClick={() => setCurrentView('projects')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    View All Projects
                  </Button>
                  <Button
                    onClick={() => setCurrentView('chat')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Group Discussions
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-yellow-600" />
                Recent Activity
              </h3>
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-900">New message in React Mastery Squad</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-900">Project task completed</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-900">Meeting reminder: Data Science Alliance</p>
                      <p className="text-xs text-gray-500">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Create Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Create New
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setShowCreateModal(false);
                      onCreateGroup?.();
                    }}
                    className="w-full justify-start"
                  >
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    Create Study Group
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCreateModal(false);
                      onCreateProject?.();
                    }}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Start New Project
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};