// Collaboration Page - Main collaboration hub with rich features
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
  BellIcon,
  SparklesIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { MainLayout } from '../components/layout/MainLayout';
import { CollaborationDashboard, StudyGroupDetail } from '../components/collaboration';
import { useCollaborationStore } from '../stores/collaborationStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const CollaborationPage: React.FC = () => {
  const navigate = useNavigate();
  const { view, groupId, projectId } = useParams<{ 
    view?: string;
    groupId?: string;
    projectId?: string;
  }>();
  
  const { user } = useAuthStore();
  const {
    currentView,
    setCurrentView,
    studyGroups,
    suggestedGroups,
    myGroups,
    isLoading,
    loadStudyGroups,
    loadSuggestedGroups,
    joinGroup,
    createGroup,
    generateMockData
  } = useCollaborationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (view) {
      setCurrentView(view as any);
    }
    loadStudyGroups();
    loadSuggestedGroups();
    generateMockData();
  }, [view, setCurrentView, loadStudyGroups, loadSuggestedGroups, generateMockData]);

  // Discovery View Component
  const DiscoveryView = () => {
    const filteredGroups = suggestedGroups.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           group.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(group.subject);
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(group.level);
      return matchesSearch && matchesSubject && matchesLevel;
    });

    const subjects = Array.from(new Set(suggestedGroups.map(g => g.subject)));
    const levels = Array.from(new Set(suggestedGroups.map(g => g.level)));

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
                  Discover Study Groups
                </h1>
                <p className="text-gray-600">
                  Find the perfect study group to accelerate your learning journey
                </p>
              </div>
              <div className="mt-4 lg:mt-0">
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create Group
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search study groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    multiple
                    value={selectedSubjects}
                    onChange={(e) => setSelectedSubjects(Array.from(e.target.selectedOptions, option => option.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <select
                    multiple
                    value={selectedLevels}
                    onChange={(e) => setSelectedLevels(Array.from(e.target.selectedOptions, option => option.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
                  >
                    <option value="">All Levels</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Groups Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredGroups.map((group) => (
              <motion.div
                key={group.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => navigate(`/collaboration/groups/${group.id}`)}
              >
                <Card className="p-6 h-full bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {group.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {group.description}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
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
                    <div className="flex items-center gap-1">
                      <SparklesIcon className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs text-gray-500">{group.subject}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Group Progress</span>
                      <span>{group.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${group.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {group.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {group.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{group.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        joinGroup(group.id);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Join
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredGroups.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No groups found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or create a new study group
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                Create Study Group
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  // AI Recommendations Component
  const AIRecommendations = () => {
    const recommendedGroups = suggestedGroups.slice(0, 3);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Card className="p-6 bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                AI-Powered Recommendations
              </h3>
              <p className="text-sm text-gray-600">
                Groups curated specifically for your learning interests and goals
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedGroups.map((group) => (
              <div
                key={group.id}
                className="p-4 bg-white/80 rounded-lg cursor-pointer hover:bg-white transition-colors"
                onClick={() => navigate(`/collaboration/groups/${group.id}`)}
              >
                <h4 className="font-medium text-gray-900 mb-2">{group.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-600 font-medium">
                    95% match
                  </span>
                  <Button size="sm" variant="outline">
                    Join Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Routes>
          {/* Main Dashboard */}
          <Route
            path="/"
            element={
              <div>
                {currentView === 'discover' ? (
                  <>
                    <DiscoveryView />
                    <AIRecommendations />
                  </>
                ) : (
                  <CollaborationDashboard
                    onCreateGroup={() => setShowCreateModal(true)}
                    onCreateProject={() => navigate('/collaboration/projects/new')}
                    onViewGroup={(groupId) => navigate(`/collaboration/groups/${groupId}`)}
                    onViewProject={(projectId) => navigate(`/collaboration/projects/${projectId}`)}
                  />
                )}
              </div>
            }
          />
          
          {/* Group Detail Routes */}
          <Route
            path="/groups/:groupId"
            element={<StudyGroupDetail groupId={groupId} />}
          />
          
          {/* Redirects for other views */}
          <Route
            path="/groups"
            element={<div>{navigate('/collaboration')}</div>}
          />
          <Route
            path="/projects"
            element={<div>{navigate('/collaboration')}</div>}
          />
          <Route
            path="/chat"
            element={<div>{navigate('/collaboration')}</div>}
          />
        </Routes>
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
                Create New Study Group
              </h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  await createGroup({
                    name: formData.get('name') as string,
                    description: formData.get('description') as string,
                    subject: formData.get('subject') as string,
                    level: formData.get('level') as any,
                    maxMembers: parseInt(formData.get('maxMembers') as string),
                  });
                  setShowCreateModal(false);
                  navigate('/collaboration');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter group name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your study group"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      name="subject"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select subject</option>
                      <option value="React Development">React Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Python Programming">Python Programming</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Web Development">Web Development</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <select
                      name="level"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Members
                  </label>
                  <input
                    type="number"
                    name="maxMembers"
                    min="2"
                    max="50"
                    defaultValue="10"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Create Group
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default CollaborationPage;