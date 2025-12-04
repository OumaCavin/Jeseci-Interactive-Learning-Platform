// JAC Learning Platform - TypeScript utilities by Cavin Otieno

/**
 * Evaluator Agent Chat - JAC Learning Platform
 * 
 * Specialized chat interface for the Evaluator AI Agent.
 * Focuses on assessment, progress evaluation, and detailed feedback.
 * Enhanced with enterprise-grade evaluation and analytics features.
 * 
 * Author: Cavin Otieno
 * Created: 2025-11-26
 * Enhanced: 2025-12-03
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, Input, Select, Progress } from '../ui';
import BaseAgentChat from './BaseAgentChat';
import { gamificationService } from '../../services/gamificationService';

// Enhanced interfaces for Evaluator specific features
interface AssessmentResult {
  id: string;
  assessmentType: 'quiz' | 'coding_challenge' | 'project_review' | 'peer_evaluation' | 'self_assessment';
  title: string;
  score: number; // 0-100
  maxScore: number;
  percentile?: number; // percentile rank
  completedAt: string;
  timeSpent: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  skillAreas: SkillArea[];
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  feedback: string;
  attachments?: string[];
}

interface SkillArea {
  name: string;
  currentLevel: number; // 1-10 scale
  expectedLevel: number; // 1-10 scale
  masteryPercentage: number;
  lastAssessed: string;
  trend: 'improving' | 'stable' | 'declining';
}

interface AssessmentRubric {
  id: string;
  name: string;
  criteria: RubricCriterion[];
  maxScore: number;
  description: string;
  skillMapping: string[];
}

interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  levels: RubricLevel[];
  weight: number; // percentage
}

interface RubricLevel {
  label: string;
  description: string;
  score: number;
}

interface EvaluationReport {
  id: string;
  userId: string;
  generatedAt: string;
  period: 'weekly' | 'monthly' | 'quarterly' | 'custom';
  summary: {
    overallScore: number;
    skillProgression: number;
    consistencyRating: number;
    engagementLevel: number;
    improvementRate: number;
  };
  skillAnalysis: SkillArea[];
  recentAssessments: AssessmentResult[];
  peerComparison: {
    rank: number;
    totalPeers: number;
    percentiles: Record<string, number>;
  };
  goals: EvaluationGoal[];
  actionPlan: ActionItem[];
}

interface EvaluationGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  milestones: GoalMilestone[];
  measurableOutcomes: string[];
}

interface GoalMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  completionDate?: string;
}

interface ActionItem {
  id: string;
  category: 'practice' | 'study' | 'project' | 'review' | 'skill_building';
  title: string;
  description: string;
  estimatedTime: number; // hours
  difficulty: 'easy' | 'medium' | 'hard';
  resources: string[];
  priority: number; // 1-10
  dueDate?: string;
}

interface AssessmentConfig {
  difficulty: 'adaptive' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  timeLimit?: number; // minutes
  questionCount?: number;
  skillAreas: string[];
  assessmentType: 'comprehensive' | 'focused' | 'quick_check' | 'diagnostic';
  allowRetakes: boolean;
  showResults: 'immediate' | 'after_completion' | 'scheduled';
}

interface EvaluatorChatProps {
  sessionId?: string;
  userId?: string;
  currentAssessments?: AssessmentResult[];
  showAssessmentHistory?: boolean;
  showSkillAnalysis?: boolean;
  showProgressReports?: boolean;
  showPeerComparison?: boolean;
  enableAdaptiveAssessment?: boolean;
  onMessageSent?: (message: string, metadata?: any) => void;
  onResponseReceived?: (response: string, metadata?: any) => void;
  onAssessmentStarted?: (config: AssessmentConfig) => void;
  onAssessmentCompleted?: (result: AssessmentResult) => void;
  onGoalCreated?: (goal: EvaluationGoal) => void;
  onActionItemAccepted?: (action: ActionItem) => void;
}

const EvaluatorChat: React.FC<EvaluatorChatProps> = ({
  sessionId,
  userId,
  currentAssessments = [],
  showAssessmentHistory = true,
  showSkillAnalysis = true,
  showProgressReports = true,
  showPeerComparison = true,
  enableAdaptiveAssessment = true,
  onMessageSent,
  onResponseReceived,
  onAssessmentStarted,
  onAssessmentCompleted,
  onGoalCreated,
  onActionItemAccepted
}) => {
  // Enhanced state management
  const [activeView, setActiveView] = useState<'chat' | 'assessments' | 'skills' | 'reports' | 'goals'>('chat');
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [skillAreas, setSkillAreas] = useState<SkillArea[]>([]);
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);
  const [goals, setGoals] = useState<EvaluationGoal[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>({
    difficulty: 'adaptive',
    skillAreas: [],
    assessmentType: 'comprehensive',
    allowRetakes: true,
    showResults: 'immediate'
  });

  // Agent personality configuration for Evaluator
  const agentPersonality = useMemo(() => ({
    tone: 'professional' as const,
    response_style: 'detailed' as const,
    expertise_level: 'expert' as const,
    specializations: [
      'Assessment Design',
      'Performance Analytics',
      'Learning Evaluation',
      'Skill Gap Analysis',
      'Educational Measurement',
      'Progress Tracking',
      'Feedback Systems',
      'Competency Assessment'
    ],
    system_prompt: 'You are an expert educational evaluator specializing in comprehensive assessment and feedback. Focus on providing detailed, actionable insights and helping learners understand their progress and improvement opportunities.'
  }), []);

  // Load initial data
  useEffect(() => {
    loadAssessmentHistory();
    loadSkillAreas();
    loadEvaluationReport();
    loadGoals();
    loadActionItems();
  }, [userId]);

  // Load assessment history with mock data
  const loadAssessmentHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock data - would be replaced with API call
      const mockAssessments: AssessmentResult[] = [
        {
          id: 'assess-1',
          assessmentType: 'coding_challenge',
          title: 'React Component Development',
          score: 85,
          maxScore: 100,
          percentile: 78,
          completedAt: '2025-12-02T10:30:00Z',
          timeSpent: 45,
          difficulty: 'intermediate',
          skillAreas: [
            {
              name: 'React Fundamentals',
              currentLevel: 8,
              expectedLevel: 7,
              masteryPercentage: 80,
              lastAssessed: '2025-12-02',
              trend: 'improving'
            },
            {
              name: 'JavaScript ES6+',
              currentLevel: 7,
              expectedLevel: 8,
              masteryPercentage: 70,
              lastAssessed: '2025-12-02',
              trend: 'stable'
            }
          ],
          strengths: [
            'Strong component architecture understanding',
            'Excellent use of hooks and state management',
            'Clean and readable code structure'
          ],
          improvements: [
            'Optimize performance with memoization',
            'Improve error handling patterns',
            'Better accessibility implementation'
          ],
          recommendations: [
            'Practice advanced React patterns',
            'Study performance optimization techniques',
            'Review accessibility best practices'
          ],
          feedback: 'Your React skills are developing well. Focus on performance optimization and accessibility to reach expert level.',
          attachments: ['code-review-1.pdf', 'feedback-notes.md']
        },
        {
          id: 'assess-2',
          assessmentType: 'quiz',
          title: 'JavaScript Fundamentals Quiz',
          score: 92,
          maxScore: 100,
          percentile: 85,
          completedAt: '2025-11-28T14:15:00Z',
          timeSpent: 25,
          difficulty: 'intermediate',
          skillAreas: [
            {
              name: 'JavaScript Basics',
              currentLevel: 9,
              expectedLevel: 8,
              masteryPercentage: 90,
              lastAssessed: '2025-11-28',
              trend: 'improving'
            }
          ],
          strengths: [
            'Excellent understanding of DOM manipulation',
            'Strong grasp of asynchronous programming',
            'Good knowledge of modern JavaScript features'
          ],
          improvements: [
            'Explore advanced JavaScript patterns',
            'Study memory management concepts',
            'Practice with large-scale applications'
          ],
          recommendations: [
            'Consider advanced JavaScript courses',
            'Practice with complex async patterns',
            'Study JavaScript performance optimization'
          ],
          feedback: 'Outstanding performance on JavaScript fundamentals. You\'re ready for advanced topics.',
          attachments: ['quiz-results.pdf']
        }
      ];

      setAssessments(mockAssessments);
    } catch (error) {
      console.error('Failed to load assessment history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load skill areas
  const loadSkillAreas = useCallback(async () => {
    try {
      // Mock data - would be replaced with API call
      const mockSkills: SkillArea[] = [
        {
          name: 'React Development',
          currentLevel: 8,
          expectedLevel: 8,
          masteryPercentage: 80,
          lastAssessed: '2025-12-02',
          trend: 'improving'
        },
        {
          name: 'JavaScript ES6+',
          currentLevel: 7,
          expectedLevel: 8,
          masteryPercentage: 70,
          lastAssessed: '2025-11-28',
          trend: 'stable'
        },
        {
          name: 'TypeScript',
          currentLevel: 6,
          expectedLevel: 7,
          masteryPercentage: 60,
          lastAssessed: '2025-11-25',
          trend: 'improving'
        },
        {
          name: 'CSS/SCSS',
          currentLevel: 7,
          expectedLevel: 7,
          masteryPercentage: 70,
          lastAssessed: '2025-11-20',
          trend: 'stable'
        },
        {
          name: 'Node.js',
          currentLevel: 5,
          expectedLevel: 6,
          masteryPercentage: 50,
          lastAssessed: '2025-11-15',
          trend: 'declining'
        }
      ];

      setSkillAreas(mockSkills);
    } catch (error) {
      console.error('Failed to load skill areas:', error);
    }
  }, []);

  // Load evaluation report
  const loadEvaluationReport = useCallback(async () => {
    try {
      // Mock data - would be replaced with API call
      const mockReport: EvaluationReport = {
        id: 'report-1',
        userId: userId || 'user-123',
        generatedAt: new Date().toISOString(),
        period: 'monthly',
        summary: {
          overallScore: 82,
          skillProgression: 15, // percentage improvement
          consistencyRating: 8.5,
          engagementLevel: 9.2,
          improvementRate: 12
        },
        skillAnalysis: [],
        recentAssessments: assessments.slice(0, 5),
        peerComparison: {
          rank: 15,
          totalPeers: 100,
          percentiles: {
            'React Development': 78,
            'JavaScript Fundamentals': 85,
            'TypeScript': 65,
            'CSS/SCSS': 70,
            'Node.js': 45
          }
        },
        goals: [],
        actionPlan: []
      };

      setEvaluationReport(mockReport);
    } catch (error) {
      console.error('Failed to load evaluation report:', error);
    }
  }, [userId, assessments]);

  // Load goals
  const loadGoals = useCallback(async () => {
    try {
      // Mock data - would be replaced with API call
      const mockGoals: EvaluationGoal[] = [
        {
          id: 'goal-1',
          title: 'Master Advanced React Patterns',
          description: 'Achieve expert level in React by learning advanced patterns like render props, compound components, and custom hooks.',
          targetDate: '2025-03-01',
          priority: 'high',
          status: 'in_progress',
          milestones: [
            {
              id: 'milestone-1',
              title: 'Complete advanced React course',
              dueDate: '2025-01-15',
              completed: true,
              completionDate: '2025-01-10'
            },
            {
              id: 'milestone-2',
              title: 'Build 3 projects using advanced patterns',
              dueDate: '2025-02-15',
              completed: false
            },
            {
              id: 'milestone-3',
              title: 'Pass expert-level React assessment',
              dueDate: '2025-03-01',
              completed: false
            }
          ],
          measurableOutcomes: [
            'Score 90%+ on advanced React assessment',
            'Build production-ready application with complex patterns',
            'Contribute to open source React project'
          ]
        },
        {
          id: 'goal-2',
          title: 'Improve Node.js Backend Skills',
          description: 'Develop proficiency in Node.js backend development, including API design, database integration, and deployment.',
          targetDate: '2025-04-30',
          priority: 'medium',
          status: 'not_started',
          milestones: [
            {
              id: 'milestone-4',
              title: 'Complete Node.js fundamentals course',
              dueDate: '2025-02-28',
              completed: false
            },
            {
              id: 'milestone-5',
              title: 'Build RESTful API with database',
              dueDate: '2025-03-31',
              completed: false
            },
            {
              id: 'milestone-6',
              title: 'Deploy backend application',
              dueDate: '2025-04-30',
              completed: false
            }
          ],
          measurableOutcomes: [
            'Deploy 2 full-stack applications',
            'Achieve 80%+ on Node.js assessment',
            'Implement authentication and authorization'
          ]
        }
      ];

      setGoals(mockGoals);
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  }, []);

  // Load action items
  const loadActionItems = useCallback(async () => {
    try {
      // Mock data - would be replaced with API call
      const mockActions: ActionItem[] = [
        {
          id: 'action-1',
          category: 'practice',
          title: 'Practice React Performance Optimization',
          description: 'Complete exercises focused on React performance optimization techniques including memoization, code splitting, and lazy loading.',
          estimatedTime: 3,
          difficulty: 'medium',
          resources: ['React Performance Guide', 'Optimization Checklist'],
          priority: 8,
          dueDate: '2025-01-20'
        },
        {
          id: 'action-2',
          category: 'study',
          title: 'Study Advanced JavaScript Patterns',
          description: 'Learn advanced JavaScript patterns including module systems, asynchronous patterns, and memory management.',
          estimatedTime: 5,
          difficulty: 'hard',
          resources: ['JavaScript Patterns Book', 'ES2023 Documentation'],
          priority: 7,
          dueDate: '2025-01-25'
        },
        {
          id: 'action-3',
          category: 'project',
          title: 'Build Full-Stack Application',
          description: 'Create a complete full-stack application using React frontend and Node.js backend to integrate all learned skills.',
          estimatedTime: 15,
          difficulty: 'hard',
          resources: ['Architecture Templates', 'Deployment Guide'],
          priority: 9,
          dueDate: '2025-02-28'
        },
        {
          id: 'action-4',
          category: 'review',
          title: 'Code Review Practice',
          description: 'Practice code review skills by reviewing peer code and participating in code review sessions.',
          estimatedTime: 2,
          difficulty: 'medium',
          resources: ['Code Review Guidelines', 'Best Practices Checklist'],
          priority: 6
        }
      ];

      setActionItems(mockActions);
    } catch (error) {
      console.error('Failed to load action items:', error);
    }
  }, []);

  // Enhanced message handler with evaluation context
  const handleMessageSent = useCallback(async (message: string, metadata?: any) => {
    // Enhanced gamification for evaluation activity
    try {
      await gamificationService.awardPoints(12, 'evaluator_interaction', {
        message_type: 'enhanced_chat_interaction',
        agent_type: 'evaluator',
        evaluation_context: metadata?.evaluation_context || 'general_inquiry',
        assessment_focus: metadata?.assessment_focus || 'progress_discussion'
      });

      // Special rewards for specific evaluation activities
      if (message.toLowerCase().includes('assessment') || message.toLowerCase().includes('evaluate')) {
        await gamificationService.awardPoints(30, 'assessment_request', {
          assessment_activity: 'evaluation_discussion',
          complexity_level: 'intermediate'
        });
      }

      if (message.toLowerCase().includes('progress') || message.toLowerCase().includes('improvement')) {
        await gamificationService.awardPoints(20, 'progress_analysis', {
          analysis_type: 'progress_discussion',
          engagement_level: 'high'
        });
      }

      if (message.toLowerCase().includes('goal') || message.toLowerCase().includes('target')) {
        await gamificationService.awardPoints(25, 'goal_setting', {
          goal_activity: 'planning_discussion',
          complexity_level: 'intermediate'
        });
      }
    } catch (error) {
      console.warn('Failed to trigger gamification:', error);
    }

    if (onMessageSent) {
      onMessageSent(message, { ...metadata, agent_specialization: 'evaluation_assessment' });
    }
  }, [onMessageSent]);

  const handleResponseReceived = useCallback((response: string, metadata?: any) => {
    // Analyze response for evaluation-related actions and update UI accordingly
    if (response.toLowerCase().includes('assessment started')) {
      // Refresh assessments to show new assessment
      loadAssessmentHistory();
    }

    if (response.toLowerCase().includes('goal created')) {
      // Refresh goals
      loadGoals();
    }

    if (response.toLowerCase().includes('action item')) {
      // Refresh action items
      loadActionItems();
    }

    if (onResponseReceived) {
      onResponseReceived(response, { ...metadata, specialized_for: 'evaluation_assessment' });
    }
  }, [onResponseReceived, loadAssessmentHistory, loadGoals, loadActionItems]);

  // Assessment management functions
  const startAssessment = useCallback((config: AssessmentConfig) => {
    setAssessmentConfig(config);
    if (onAssessmentStarted) {
      onAssessmentStarted(config);
    }
  }, [onAssessmentStarted]);

  const completeAssessment = useCallback((result: AssessmentResult) => {
    setAssessments(prev => [result, ...prev]);
    if (onAssessmentCompleted) {
      onAssessmentCompleted(result);
    }
    
    // Update skill areas based on assessment results
    setSkillAreas(prev => prev.map(skill => {
      const assessmentSkill = result.skillAreas.find(area => area.name === skill.name);
      if (assessmentSkill) {
        return {
          ...skill,
          currentLevel: Math.max(skill.currentLevel, assessmentSkill.currentLevel),
          masteryPercentage: Math.max(skill.masteryPercentage, assessmentSkill.masteryPercentage),
          lastAssessed: result.completedAt,
          trend: assessmentSkill.trend
        };
      }
      return skill;
    }));
  }, [onAssessmentCompleted]);

  const createGoal = useCallback((goal: EvaluationGoal) => {
    setGoals(prev => [goal, ...prev]);
    if (onGoalCreated) {
      onGoalCreated(goal);
    }
  }, [onGoalCreated]);

  const acceptActionItem = useCallback((action: ActionItem) => {
    setActionItems(prev => prev.filter(item => item.id !== action.id));
    if (onActionItemAccepted) {
      onActionItemAccepted(action);
    }
  }, [onActionItemAccepted]);

  // Render assessment history view
  const renderAssessmentHistory = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-xl font-semibold">Assessment History</h3>
        <Button
          variant="default"
          onClick={() => startAssessment(assessmentConfig)}
        >
          Start New Assessment
        </Button>
      </div>

      <AnimatePresence>
        {assessments.map((assessment) => (
          <motion.div
            key={assessment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white text-lg font-semibold">{assessment.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="info" size="sm">{assessment.assessmentType.replace('_', ' ')}</Badge>
                    <Badge variant="info" size="sm">{assessment.difficulty}</Badge>
                    {assessment.percentile && (
                      <Badge variant="success" size="sm">
                        {assessment.percentile}th percentile
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {assessment.score}/{assessment.maxScore}
                  </div>
                  <div className="text-white/60 text-sm">
                    {Math.round((assessment.score / assessment.maxScore) * 100)}%
                  </div>
                </div>
              </div>

              <div className="text-white/80 text-sm">{assessment.feedback}</div>

              {/* Skill Areas */}
              <div className="space-y-2">
                <h5 className="text-white font-medium">Skill Areas Assessed:</h5>
                {assessment.skillAreas.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white text-sm">{skill.name}</div>
                      <div className="text-white/60 text-xs">
                        Level {skill.currentLevel}/{skill.expectedLevel}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={skill.masteryPercentage} 
                        className="w-24 h-2"
                      />
                      <span className="text-white/60 text-xs w-12">
                        {skill.masteryPercentage}%
                      </span>
                      <span className={`text-xs ${
                        skill.trend === 'improving' ? 'text-green-400' :
                        skill.trend === 'declining' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {skill.trend === 'improving' ? '↗' : 
                         skill.trend === 'declining' ? '↘' : '→'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Strengths and Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-green-400 font-medium mb-2">Strengths:</h5>
                  <ul className="space-y-1">
                    {assessment.strengths.map((strength, index) => (
                      <li key={index} className="text-white/80 text-sm flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-yellow-400 font-medium mb-2">Areas for Improvement:</h5>
                  <ul className="space-y-1">
                    {assessment.improvements.map((improvement, index) => (
                      <li key={index} className="text-white/80 text-sm flex items-start">
                        <span className="text-yellow-400 mr-2">→</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h5 className="text-blue-400 font-medium mb-2">Recommendations:</h5>
                <div className="flex flex-wrap gap-2">
                  {assessment.recommendations.map((rec, index) => (
                    <Badge key={index} variant="default" size="sm">
                      {rec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Completed: {new Date(assessment.completedAt).toLocaleDateString()}</span>
                <span>Time Spent: {assessment.timeSpent} minutes</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  // Render skill analysis view
  const renderSkillAnalysis = () => (
    <div className="space-y-4">
      <h3 className="text-white text-xl font-semibold">Skill Analysis</h3>

      {/* Overall Progress */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
        <h4 className="text-white font-medium mb-3">Overall Skill Progress</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.round(skillAreas.reduce((acc, skill) => acc + skill.masteryPercentage, 0) / skillAreas.length)}%
            </div>
            <div className="text-white/80 text-sm">Average Mastery</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {skillAreas.filter(skill => skill.currentLevel >= skill.expectedLevel).length}/{skillAreas.length}
            </div>
            <div className="text-white/80 text-sm">Skills Meeting Expectations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {skillAreas.filter(skill => skill.trend === 'improving').length}
            </div>
            <div className="text-white/80 text-sm">Improving Skills</div>
          </div>
        </div>
      </div>

      {/* Individual Skills */}
      <div className="space-y-3">
        {skillAreas.map((skill) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-white font-semibold">{skill.name}</h4>
                <div className="text-white/60 text-sm">
                  Last assessed: {new Date(skill.lastAssessed).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${
                  skill.trend === 'improving' ? 'text-green-400' :
                  skill.trend === 'declining' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {skill.trend === 'improving' ? '↗ Improving' : 
                   skill.trend === 'declining' ? '↘ Declining' : '→ Stable'}
                </span>
                <div className="text-white text-sm">
                  Level {skill.currentLevel}/{skill.expectedLevel}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Mastery Level</span>
                <span className="text-white text-sm">{skill.masteryPercentage}%</span>
              </div>
              <Progress value={skill.masteryPercentage} className="h-3" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Render progress reports view
  const renderProgressReports = () => (
    <div className="space-y-4">
      <h3 className="text-white text-xl font-semibold">Progress Reports</h3>

      {evaluationReport && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
            >
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">{evaluationReport.summary.overallScore}%</div>
                <div className="text-white/80 text-sm">Overall Score</div>
                <div className="text-green-400 text-sm">
                  +{evaluationReport.summary.skillProgression}% progression
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
                <div className="text-3xl font-bold text-white">{evaluationReport.summary.consistencyRating}</div>
                <div className="text-white/80 text-sm">Consistency</div>
                <div className="text-blue-400 text-sm">/10 Rating</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
            >
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">{evaluationReport.summary.engagementLevel}</div>
                <div className="text-white/80 text-sm">Engagement</div>
                <div className="text-yellow-400 text-sm">/10 Level</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
            >
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">+{evaluationReport.summary.improvementRate}%</div>
                <div className="text-white/80 text-sm">Improvement Rate</div>
                <div className="text-purple-400 text-sm">vs last period</div>
              </div>
            </motion.div>
          </div>

          {/* Peer Comparison */}
          {showPeerComparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20"
            >
              <h4 className="text-white font-medium mb-4">Peer Comparison</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">
                    #{evaluationReport.peerComparison.rank} of {evaluationReport.peerComparison.totalPeers}
                  </div>
                  <div className="text-white/80 text-sm">Overall Ranking</div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-white font-medium text-sm">Skill Percentiles:</h5>
                  {Object.entries(evaluationReport.peerComparison.percentiles).map(([skill, percentile]) => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">{skill}</span>
                      <span className="text-white text-sm">{percentile}th percentile</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );

  // Render goals and action plan view
  const renderGoalsAndActions = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold">Goals & Action Plan</h3>

      {/* Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium">Learning Goals</h4>
          <Button variant="default" size="sm">
            Create New Goal
          </Button>
        </div>

        <AnimatePresence>
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-white font-semibold">{goal.title}</h5>
                    <p className="text-white/80 text-sm">{goal.description}</p>
                  </div>
                  <Badge 
                    variant={
                      goal.status === 'completed' ? 'success' :
                      goal.status === 'in_progress' ? 'warning' :
                      goal.status === 'overdue' ? 'error' : 'info'
                    }
                    size="sm"
                  >
                    {goal.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-white/60 text-sm mb-2">Progress</div>
                    <div className="space-y-2">
                      {goal.milestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded-full ${
                            milestone.completed ? 'bg-green-500' : 'bg-white/30'
                          }`} />
                          <div className="flex-1">
                            <div className="text-white text-sm">{milestone.title}</div>
                            <div className="text-white/60 text-xs">
                              Due: {new Date(milestone.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-white/60 text-sm mb-2">Measurable Outcomes</div>
                    <ul className="space-y-1">
                      {goal.measurableOutcomes.map((outcome, index) => (
                        <li key={index} className="text-white/80 text-sm flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                  <Badge variant="info" size="sm">
                    {goal.priority} priority
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Items Section */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Recommended Actions</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {actionItems.map((action) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h6 className="text-white font-medium">{action.title}</h6>
                      <p className="text-white/80 text-sm">{action.description}</p>
                    </div>
                    <Badge variant="default" size="sm">
                      {action.category}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>⏱ {action.estimatedTime}h</span>
                    <span className={`${
                      action.difficulty === 'easy' ? 'text-green-400' :
                      action.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {action.difficulty}
                    </span>
                    <span>Priority: {action.priority}/10</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {action.resources.slice(0, 2).map((resource, index) => (
                      <Badge key={index} variant="default" size="sm" className="text-white/60">
                        {resource}
                      </Badge>
                    ))}
                    {action.resources.length > 2 && (
                      <Badge variant="default" size="sm" className="text-white/60">
                        +{action.resources.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => acceptActionItem(action)}
                    >
                      Accept
                    </Button>
                    <Button variant="default" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Enhanced Header with Tab Navigation */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600">
              ✅
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">Evaluator</h2>
              <p className="text-white/80">Assess progress and provide detailed feedback</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => startAssessment(assessmentConfig)}
            >
              📝 Start Assessment
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={() => loadAssessmentHistory()}
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
            { key: 'assessments', label: 'Assessments', icon: '📊', count: assessments.length },
            { key: 'skills', label: 'Skills', icon: '📈', count: skillAreas.length },
            { key: 'reports', label: 'Reports', icon: '📋', disabled: !evaluationReport },
            { key: 'goals', label: 'Goals', icon: '🎯', count: goals.length }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeView === tab.key ? 'primary' : 'ghost'}
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

      {/* Assessment Summary Banner */}
      <AnimatePresence>
        {activeView === 'chat' && assessmentConfig && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-orange-500/20 to-red-600/20 border-b border-white/20 p-4"
          >
            <div className="space-y-3">
              <h4 className="text-white font-medium">📝 Quick Assessment</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white text-sm">Difficulty</div>
                  <div className="text-white/80 text-xs capitalize">{assessmentConfig.difficulty}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white text-sm">Type</div>
                  <div className="text-white/80 text-xs capitalize">{assessmentConfig.assessmentType.replace('_', ' ')}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white text-sm">Retakes</div>
                  <div className="text-white/80 text-xs">{assessmentConfig.allowRetakes ? 'Allowed' : 'Limited'}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white text-sm">Time Limit</div>
                  <div className="text-white/80 text-xs">{assessmentConfig.timeLimit || 'No limit'}</div>
                </div>
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
                agentId="evaluator"
                agentType="evaluator"
                agentName="Evaluator"
                agentIcon="✅"
                agentDescription="I'll assess your progress, provide detailed feedback, and help you understand your strengths and areas for improvement."
                agentCapabilities={[
                  'Progress Assessment',
                  'Detailed Feedback',
                  'Performance Analysis',
                  'Skill Evaluation',
                  'Knowledge Retention Testing',
                  'Application Ability Assessment',
                  'Coding Proficiency Evaluation',
                  'Problem-Solving Analysis'
                ]}
                agentColor="from-orange-500 to-red-600"
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
            
            {activeView === 'assessments' && showAssessmentHistory && renderAssessmentHistory()}
            {activeView === 'skills' && showSkillAnalysis && renderSkillAnalysis()}
            {activeView === 'reports' && showProgressReports && renderProgressReports()}
            {activeView === 'goals' && renderGoalsAndActions()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EvaluatorChat;