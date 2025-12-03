// JAC Learning Platform - TypeScript utilities by Cavin Otieno

/**
 * Content Curator Agent Chat - JAC Learning Platform
 * 
 * Specialized chat interface for the Content Curator AI Agent.
 * Focuses on content organization, learning path creation, and material recommendations.
 * Enhanced with enterprise-grade content management features.
 * 
 * Author: Cavin Otieno
 * Created: 2025-11-26
 * Enhanced: 2025-12-03
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from '../ui';
import { EnterpriseInput as Input } from '../ui';
import { Select } from '../ui';
import BaseAgentChat from './BaseAgentChat';
import webSocketService from '../../services/websocketService';
import { gamificationService } from '../../services/gamificationService';

// Enhanced interfaces for Content Curator specific features
interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'article' | 'book' | 'course' | 'interactive' | 'document';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  tags: string[];
  url?: string;
  description: string;
  rating: number;
  lastAccessed?: string;
  completionStatus: 'not_started' | 'in_progress' | 'completed';
  learningObjectives: string[];
  prerequisites: string[];
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  contentItems: ContentItem[];
  milestones: Milestone[];
  createdAt: string;
  lastModified: string;
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  requiredContentIds: string[];
  completed: boolean;
  completedAt?: string;
}

interface ContentRecommendation {
  id: string;
  content: ContentItem;
  reason: string;
  confidence: number;
  personalizedScore: number;
  learningContext: string;
}

interface ContentAnalytics {
  totalContentItems: number;
  completedContent: number;
  totalLearningTime: number;
  averageRating: number;
  favoriteTopics: string[];
  learningVelocity: number; // content items per week
  streakDays: number;
  nextRecommendedAction: string;
}

interface ContentCuratorChatProps {
  sessionId?: string;
  userId?: string;
  currentLearningPath?: LearningPath;
  showAnalytics?: boolean;
  showContentLibrary?: boolean;
  showLearningPath?: boolean;
  enablePersonalizedRecommendations?: boolean;
  onMessageSent?: (message: string, metadata?: any) => void;
  onResponseReceived?: (response: string, metadata?: any) => void;
  onContentAdded?: (content: ContentItem) => void;
  onLearningPathUpdated?: (path: LearningPath) => void;
  onRecommendationAccepted?: (recommendation: ContentRecommendation) => void;
}

const ContentCuratorChat: React.FC<ContentCuratorChatProps> = ({
  sessionId,
  userId,
  currentLearningPath,
  showAnalytics = true,
  showContentLibrary = true,
  showLearningPath = true,
  enablePersonalizedRecommendations = true,
  onMessageSent,
  onResponseReceived,
  onContentAdded,
  onLearningPathUpdated,
  onRecommendationAccepted
}) => {
  // Enhanced state management
  const [activeView, setActiveView] = useState<'chat' | 'library' | 'path' | 'analytics'>('chat');
  const [contentLibrary, setContentLibrary] = useState<ContentItem[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [analytics, setAnalytics] = useState<ContentAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    difficulty: 'all',
    type: 'all',
    duration: 'all',
    tags: [] as string[]
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Agent personality configuration for Content Curator
  const agentPersonality = useMemo(() => ({
    tone: 'encouraging' as const,
    response_style: 'detailed' as const,
    expertise_level: 'expert' as const,
    specializations: [
      'Content Curation',
      'Learning Design',
      'Educational Psychology',
      'Learning Path Optimization',
      'Knowledge Management'
    ],
    system_prompt: 'You are an expert content curator specializing in personalized learning experiences. Focus on creating engaging, structured learning paths and recommending high-quality content.'
  }), []);

  // Load initial data
  useEffect(() => {
    loadContentLibrary();
    loadLearningPaths();
    loadAnalytics();
    if (enablePersonalizedRecommendations) {
      loadRecommendations();
    }
  }, [userId, enablePersonalizedRecommendations]);

  // Load content library with mock data
  const loadContentLibrary = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock data - would be replaced with API call
      const mockContent: ContentItem[] = [
        {
          id: '1',
          title: 'Introduction to Machine Learning',
          type: 'course',
          difficulty: 'intermediate',
          duration: 480, // 8 hours
          tags: ['AI', 'Data Science', 'Python'],
          url: '/content/ml-intro',
          description: 'Comprehensive introduction to machine learning concepts and applications.',
          rating: 4.8,
          lastAccessed: '2025-12-01',
          completionStatus: 'in_progress',
          learningObjectives: [
            'Understand ML fundamentals',
            'Implement basic algorithms',
            'Evaluate model performance'
          ],
          prerequisites: ['Python Basics', 'Statistics Fundamentals']
        },
        {
          id: '2',
          title: 'Advanced React Patterns',
          type: 'article',
          difficulty: 'advanced',
          duration: 45,
          tags: ['React', 'JavaScript', 'Frontend'],
          url: '/content/react-patterns',
          description: 'Deep dive into advanced React patterns and best practices.',
          rating: 4.6,
          completionStatus: 'completed',
          learningObjectives: [
            'Master custom hooks',
            'Implement compound patterns',
            'Optimize performance'
          ],
          prerequisites: ['React Fundamentals', 'JavaScript ES6+']
        },
        {
          id: '3',
          title: 'Data Visualization with D3.js',
          type: 'interactive',
          difficulty: 'intermediate',
          duration: 120,
          tags: ['D3.js', 'Data Viz', 'JavaScript'],
          description: 'Interactive tutorial on creating stunning data visualizations.',
          rating: 4.9,
          completionStatus: 'not_started',
          learningObjectives: [
            'Create basic charts',
            'Implement interactive elements',
            'Design responsive visualizations'
          ],
          prerequisites: ['HTML/CSS', 'JavaScript Fundamentals']
        }
      ];

      setContentLibrary(mockContent);
    } catch (error) {
      console.error('Failed to load content library:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load learning paths
  const loadLearningPaths = useCallback(async () => {
    try {
      // Mock data - would be replaced with API call
      const mockPaths: LearningPath[] = [
        {
          id: 'lp-1',
          name: 'Full Stack Web Development',
          description: 'Complete path from frontend to backend development',
          estimatedDuration: 2000, // 33+ hours
          difficulty: 'intermediate',
          progress: 35,
          contentItems: contentLibrary,
          milestones: [
            {
              id: 'm-1',
              name: 'HTML & CSS Fundamentals',
              description: 'Master the basics of web markup and styling',
              requiredContentIds: ['1', '2'],
              completed: false
            },
            {
              id: 'm-2',
              name: 'JavaScript Mastery',
              description: 'Deep understanding of JavaScript',
              requiredContentIds: ['3'],
              completed: false
            }
          ],
          createdAt: '2025-11-15',
          lastModified: '2025-12-02'
        }
      ];

      setLearningPaths(mockPaths);
    } catch (error) {
      console.error('Failed to load learning paths:', error);
    }
  }, [contentLibrary]);

  // Load analytics
  const loadAnalytics = useCallback(async () => {
    try {
      // Mock data - would be replaced with API call
      const mockAnalytics: ContentAnalytics = {
        totalContentItems: 15,
        completedContent: 8,
        totalLearningTime: 1450, // minutes
        averageRating: 4.5,
        favoriteTopics: ['React', 'Machine Learning', 'Data Visualization'],
        learningVelocity: 3.2, // items per week
        streakDays: 12,
        nextRecommendedAction: 'Continue with React hooks tutorial'
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  }, []);

  // Load personalized recommendations
  const loadRecommendations = useCallback(async () => {
    try {
      // Mock data - would be replaced with ML recommendation engine
      const mockRecommendations: ContentRecommendation[] = [
        {
          id: 'rec-1',
          content: contentLibrary[0],
          reason: 'Based on your interest in AI and completion of Python basics',
          confidence: 0.92,
          personalizedScore: 0.95,
          learningContext: 'Foundation building'
        },
        {
          id: 'rec-2',
          content: contentLibrary[2],
          reason: 'Complements your progress in web development',
          confidence: 0.87,
          personalizedScore: 0.89,
          learningContext: 'Skill enhancement'
        }
      ];

      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  }, [contentLibrary]);

  // Enhanced message handler with content curation context
  const handleMessageSent = useCallback(async (message: string, metadata?: any) => {
    // Enhanced gamification for content curation activity
    try {
      await gamificationService.awardPoints(15, 'content_curation', {
        message_type: 'enhanced_chat_interaction',
        agent_type: 'content_curator',
        content_context: metadata?.content_context || 'general_inquiry',
        personalization_level: agentPersonality.response_style
      });

      // Special rewards for specific content-related activities
      if (message.toLowerCase().includes('learning path')) {
        await gamificationService.awardPoints(25, 'learning_path_planning', {
          planning_activity: 'path_discussion',
          complexity_level: 'intermediate'
        });
      }

      if (message.toLowerCase().includes('recommend')) {
        await gamificationService.awardPoints(20, 'content_recommendation', {
          recommendation_activity: 'personalized_suggestion_request',
          engagement_level: 'high'
        });
      }
    } catch (error) {
      console.warn('Failed to trigger gamification:', error);
    }

    if (onMessageSent) {
      onMessageSent(message, { ...metadata, agent_specialization: 'content_curation' });
    }
  }, [agentPersonality, onMessageSent]);

  const handleResponseReceived = useCallback((response: string, metadata?: any) => {
    // Analyze response for content-related actions and update UI accordingly
    if (response.toLowerCase().includes('added to learning path')) {
      // Refresh learning paths to show new content
      loadLearningPaths();
    }

    if (response.toLowerCase().includes('recommendation')) {
      // Refresh recommendations
      loadRecommendations();
    }

    if (onResponseReceived) {
      onResponseReceived(response, { ...metadata, specialized_for: 'content_curation' });
    }
  }, [onResponseReceived, loadLearningPaths, loadRecommendations]);

  // Content management functions
  const addContentToLearningPath = useCallback((content: ContentItem, pathId: string) => {
    setLearningPaths(prev => prev.map(path => 
      path.id === pathId 
        ? { 
            ...path, 
            contentItems: [...path.contentItems, content],
            lastModified: new Date().toISOString()
          }
        : path
    ));

    if (onContentAdded) {
      onContentAdded(content);
    }

    if (onLearningPathUpdated) {
      const updatedPath = learningPaths.find(p => p.id === pathId);
      if (updatedPath) {
        onLearningPathUpdated(updatedPath);
      }
    }
  }, [learningPaths, onContentAdded, onLearningPathUpdated]);

  const updateContentRating = useCallback((contentId: string, rating: number) => {
    setContentLibrary(prev => prev.map(content => 
      content.id === contentId 
        ? { ...content, rating }
        : content
    ));

    // Update analytics
    if (analytics) {
      setAnalytics(prev => prev ? {
        ...prev,
        averageRating: prev.totalContentItems > 0 
          ? (prev.averageRating * prev.totalContentItems + rating) / (prev.totalContentItems + 1)
          : rating
      } : null);
    }
  }, [analytics]);

  // Filter content based on current filters
  const filteredContent = useMemo(() => {
    let filtered = contentLibrary;

    if (searchQuery) {
      filtered = filtered.filter(content => 
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterOptions.difficulty !== 'all') {
      filtered = filtered.filter(content => content.difficulty === filterOptions.difficulty);
    }

    if (filterOptions.type !== 'all') {
      filtered = filtered.filter(content => content.type === filterOptions.type);
    }

    if (filterOptions.tags.length > 0) {
      filtered = filtered.filter(content => 
        filterOptions.tags.some(tag => content.tags.includes(tag))
      );
    }

    return filtered;
  }, [contentLibrary, searchQuery, filterOptions]);

  // Render enhanced content library view
  const renderContentLibrary = () => (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass rounded-lg px-3 py-2 text-white placeholder-white/50"
          />
          
          <div className="flex flex-wrap gap-3">
            <select
              value={filterOptions.difficulty}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, difficulty: e.target.value as any }))}
              className="glass rounded-lg px-3 py-2 text-white"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={filterOptions.type}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, type: e.target.value as any }))}
              className="glass rounded-lg px-3 py-2 text-white"
            >
              <option value="all">All Types</option>
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="course">Course</option>
              <option value="interactive">Interactive</option>
              <option value="document">Document</option>
            </select>

            <div className="text-white/60 text-sm">
              {filteredContent.length} items found
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredContent.map((content) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{content.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="info" size="sm">{content.type}</Badge>
                      <Badge variant="info" size="sm">{content.difficulty}</Badge>
                    </div>
                  </div>
                  <div className="text-yellow-400 text-sm">
                    ⭐ {content.rating}
                  </div>
                </div>

                <p className="text-white/80 text-sm">{content.description}</p>

                <div className="flex flex-wrap gap-1">
                  {content.tags.map(tag => (
                    <Badge key={tag} variant="default" size="sm" className="text-white/60">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>⏱ {content.duration} min</span>
                  <Badge 
                    variant={
                      content.completionStatus === 'completed' ? 'success' :
                      content.completionStatus === 'in_progress' ? 'warning' : 'info'
                    }
                    size="sm"
                  >
                    {content.completionStatus.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => addContentToLearningPath(content, learningPaths[0]?.id || '')}
                  >
                    Add to Path
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {/* Open content */}}
                  >
                    View
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  // Render learning path view
  const renderLearningPath = () => (
    <div className="space-y-4">
      <AnimatePresence>
        {learningPaths.map((path) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-semibold">{path.name}</h3>
                  <p className="text-white/80">{path.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{path.progress}% Complete</div>
                  <div className="text-white/60 text-sm">{path.estimatedDuration} min total</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${path.progress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>

              {/* Milestones */}
              <div className="space-y-2">
                <h4 className="text-white font-medium">Milestones</h4>
                {path.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      milestone.completed ? 'bg-green-500' : 'bg-white/30'
                    }`} />
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{milestone.name}</div>
                      <div className="text-white/60 text-xs">{milestone.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Content Items */}
              <div className="space-y-2">
                <h4 className="text-white font-medium">
                  Content ({path.contentItems.length} items)
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {path.contentItems.map((content) => (
                    <div key={content.id} className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{content.title}</div>
                        <div className="text-white/60 text-xs">{content.duration} min</div>
                      </div>
                      <Badge 
                        variant={
                          content.completionStatus === 'completed' ? 'success' :
                          content.completionStatus === 'in_progress' ? 'warning' : 'info'
                        }
                        size="sm"
                      >
                        {content.completionStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  // Render analytics view
  const renderAnalytics = () => (
    <div className="space-y-4">
      {analytics && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
            >
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">{analytics.totalContentItems}</div>
                <div className="text-white/80 text-sm">Total Content</div>
                <div className="text-green-400 text-sm">
                  {analytics.completedContent} completed
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
            >
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">
                  {Math.round(analytics.totalLearningTime / 60)}h
                </div>
                <div className="text-white/80 text-sm">Learning Time</div>
                <div className="text-blue-400 text-sm">
                  {analytics.learningVelocity.toFixed(1)} items/week
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
            >
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">🔥 {analytics.streakDays}</div>
                <div className="text-white/80 text-sm">Day Streak</div>
                <div className="text-yellow-400 text-sm">
                  ⭐ {analytics.averageRating.toFixed(1)} avg rating
                </div>
              </div>
            </motion.div>
          </div>

          {/* Favorite Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
          >
            <h4 className="text-white font-medium mb-3">Favorite Topics</h4>
            <div className="flex flex-wrap gap-2">
              {analytics.favoriteTopics.map((topic) => (
                <Badge key={topic} variant="default" size="lg">
                  {topic}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Next Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
          >
            <h4 className="text-white font-medium mb-3">Recommended Next Action</h4>
            <p className="text-white/80">{analytics.nextRecommendedAction}</p>
          </motion.div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Enhanced Header with Tab Navigation */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              📚
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">Content Curator</h2>
              <p className="text-white/80">Organize and optimize your learning content</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {enablePersonalizedRecommendations && recommendations.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {/* Handle recommendation acceptance */}}
              >
                🎯 {recommendations.length} Recommendations
              </Button>
            )}
            
            <Button
              variant="primary"
              size="sm"
              onClick={() => loadContentLibrary()}
              className="text-white/60"
            >
              🔄 Refresh
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
          {[
            { key: 'chat', label: 'Chat', icon: '💬' },
            { key: 'library', label: 'Content Library', icon: '📖', count: contentLibrary.length },
            { key: 'path', label: 'Learning Paths', icon: '🛤️', count: learningPaths.length },
            { key: 'analytics', label: 'Analytics', icon: '📊', disabled: !analytics }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeView === tab.key ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => !tab.disabled && setActiveView(tab.key as any)}
              disabled={tab.disabled}
              className="flex-1"
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {tab.count !== undefined && (
                <Badge variant="info" size="sm" className="ml-2">
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Personalized Recommendations Banner */}
      <AnimatePresence>
        {enablePersonalizedRecommendations && recommendations.length > 0 && activeView === 'chat' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-b border-white/20 p-4"
          >
            <div className="space-y-3">
              <h4 className="text-white font-medium">🎯 Personalized Recommendations</h4>
              <div className="flex flex-wrap gap-2">
                {recommendations.slice(0, 3).map((rec) => (
                  <motion.div
                    key={rec.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 rounded-lg p-3 flex-1 min-w-0 cursor-pointer"
                    onClick={() => onRecommendationAccepted && onRecommendationAccepted(rec)}
                  >
                    <div className="space-y-1">
                      <div className="text-white font-medium text-sm">{rec.content.title}</div>
                      <div className="text-white/80 text-xs">{rec.reason}</div>
                      <div className="flex items-center justify-between">
                        <Badge variant="info" size="sm">
                          {Math.round(rec.confidence * 100)}% match
                        </Badge>
                        <div className="text-yellow-400 text-xs">
                          ⭐ {rec.content.rating}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full overflow-y-auto p-4"
          >
            {activeView === 'chat' && (
              <BaseAgentChat
                agentId="content_curator"
                agentType="content_curator"
                agentName="Content Curator"
                agentIcon="📚"
                agentDescription="I'll help you organize, curate, and optimize your learning content for maximum engagement and effectiveness."
                agentCapabilities={[
                  'Content Organization',
                  'Learning Path Creation',
                  'Material Recommendation',
                  'Content Difficulty Analysis',
                  'Personalized Curation',
                  'Content Performance Tracking',
                  'Adaptive Content Delivery',
                  'Knowledge Gap Identification'
                ]}
                agentColor="from-blue-500 to-purple-600"
                agentPersonality={agentPersonality}
                sessionId={sessionId}
                enableVoice={true}
                enableFileUpload={true}
                enableSearch={true}
                enableExport={true}
                maxMessages={2000}
                onMessageSent={handleMessageSent}
                onResponseReceived={handleResponseReceived}
              />
            )}
            
            {activeView === 'library' && showContentLibrary && renderContentLibrary()}
            {activeView === 'path' && showLearningPath && renderLearningPath()}
            {activeView === 'analytics' && showAnalytics && renderAnalytics()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContentCuratorChat;