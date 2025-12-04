// JAC Learning Platform - Enhanced Multi-Agent Chat Interface
// Complete Multi-Agent Orchestration System
// Author: Cavin Otieno
// Enhanced: 2025-12-03

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge, Button, Progress } from '../ui';
import { EnterpriseTabs as Tabs } from '../ui';
import { EnterpriseAvatar as Avatar } from '../ui';

import {
  ContentCuratorChat,
  QuizMasterChat,
  EvaluatorChat,
  ProgressTrackerChat,
  MotivatorChat,
  SystemOrchestratorChat
} from './index';

interface AgentInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  component: React.ComponentType<any>;
  isActive: boolean;
  status: 'online' | 'busy' | 'offline';
  capabilities: string[];
  performance: {
    responseTime: number;
    accuracy: number;
    satisfaction: number;
    usage: number;
  };
  lastActive: Date;
  expertise: string[];
}

interface CollaborationSession {
  id: string;
  agents: string[];
  topic: string;
  participants: number;
  status: 'active' | 'paused' | 'completed';
  startedAt: Date;
  messages: number;
  progress: number;
}

interface CrossAgentMetrics {
  totalInteractions: number;
  averageResponseTime: number;
  userSatisfaction: number;
  collaborationEfficiency: number;
  knowledgeTransfer: number;
  workflowCompletion: number;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  agents: string[];
  steps: string[];
  estimatedDuration: number;
  successRate: number;
}

interface MultiAgentChatProps {
  defaultAgent?: string;
  onAgentSwitch?: (agentId: string) => void;
  onMessageSent?: (agentId: string, message: string) => void;
  onResponseReceived?: (agentId: string, response: string) => void;
  onCollaborationStart?: (sessionId: string, agents: string[]) => void;
  onWorkflowExecute?: (templateId: string) => void;
}

const MultiAgentChat: React.FC<MultiAgentChatProps> = ({
  defaultAgent = 'system_orchestrator',
  onAgentSwitch,
  onMessageSent,
  onResponseReceived,
  onCollaborationStart,
  onWorkflowExecute
}) => {
  const [activeView, setActiveView] = useState<'chat' | 'collaboration' | 'coordination' | 'analytics' | 'workflows' | 'monitoring'>('chat');
  const [activeAgent, setActiveAgent] = useState(defaultAgent);
  const [activeCollaborationSession, setActiveCollaborationSession] = useState<string | null>(null);
  const [selectedWorkflowTemplate, setSelectedWorkflowTemplate] = useState<string | null>(null);
  const [sessionId] = useState(() => `multi-agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Enhanced agent data with comprehensive metrics
  const agents: AgentInfo[] = [
    {
      id: 'content_curator',
      name: 'Content Curator',
      icon: '📚',
      description: 'Organize and optimize your learning content',
      color: 'from-blue-500 to-purple-600',
      component: ContentCuratorChat,
      isActive: true,
      status: 'online',
      capabilities: ['Content Organization', 'Curriculum Design', 'Resource Management'],
      performance: {
        responseTime: 1.2,
        accuracy: 94,
        satisfaction: 96,
        usage: 28
      },
      lastActive: new Date(),
      expertise: ['Educational Design', 'Content Strategy', 'Learning Analytics']
    },
    {
      id: 'quiz_master',
      name: 'Quiz Master',
      icon: '❓',
      description: 'Create quizzes and test your knowledge',
      color: 'from-green-500 to-teal-600',
      component: QuizMasterChat,
      isActive: true,
      status: 'online',
      capabilities: ['Quiz Creation', 'Assessment Design', 'Performance Analysis'],
      performance: {
        responseTime: 0.8,
        accuracy: 91,
        satisfaction: 93,
        usage: 25
      },
      lastActive: new Date(),
      expertise: ['Assessment Design', 'Question Generation', 'Test Analytics']
    },
    {
      id: 'evaluator',
      name: 'Evaluator',
      icon: '✅',
      description: 'Assess progress and provide feedback',
      color: 'from-orange-500 to-red-600',
      component: EvaluatorChat,
      isActive: true,
      status: 'busy',
      capabilities: ['Progress Assessment', 'Feedback Generation', 'Performance Review'],
      performance: {
        responseTime: 2.1,
        accuracy: 89,
        satisfaction: 92,
        usage: 22
      },
      lastActive: new Date(),
      expertise: ['Performance Analysis', 'Feedback Systems', 'Progress Tracking']
    },
    {
      id: 'progress_tracker',
      name: 'Progress Tracker',
      icon: '📊',
      description: 'Track learning analytics and insights',
      color: 'from-purple-500 to-pink-600',
      component: ProgressTrackerChat,
      isActive: true,
      status: 'online',
      capabilities: ['Analytics Tracking', 'Progress Monitoring', 'Insight Generation'],
      performance: {
        responseTime: 1.5,
        accuracy: 95,
        satisfaction: 97,
        usage: 20
      },
      lastActive: new Date(),
      expertise: ['Learning Analytics', 'Data Visualization', 'Progress Metrics']
    },
    {
      id: 'motivator',
      name: 'Motivator',
      icon: '💪',
      description: 'Keep you motivated and on track',
      color: 'from-yellow-500 to-orange-600',
      component: MotivatorChat,
      isActive: true,
      status: 'online',
      capabilities: ['Motivation Enhancement', 'Goal Setting', 'Engagement Boost'],
      performance: {
        responseTime: 0.9,
        accuracy: 88,
        satisfaction: 98,
        usage: 23
      },
      lastActive: new Date(),
      expertise: ['Motivation Psychology', 'Goal Achievement', 'Engagement Strategies']
    },
    {
      id: 'system_orchestrator',
      name: 'System Orchestrator',
      icon: '🎯',
      description: 'Coordinate your entire learning system',
      color: 'from-indigo-500 to-blue-600',
      component: SystemOrchestratorChat,
      isActive: true,
      status: 'online',
      capabilities: ['System Coordination', 'Workflow Management', 'Resource Allocation'],
      performance: {
        responseTime: 1.0,
        accuracy: 96,
        satisfaction: 95,
        usage: 32
      },
      lastActive: new Date(),
      expertise: ['System Architecture', 'Workflow Design', 'Multi-Agent Coordination']
    }
  ];

  // Mock data for enhanced features
  const collaborationSessions: CollaborationSession[] = [
    {
      id: 'collab-001',
      agents: ['content_curator', 'quiz_master', 'evaluator'],
      topic: 'Comprehensive Course Development',
      participants: 3,
      status: 'active',
      startedAt: new Date(Date.now() - 1800000),
      messages: 24,
      progress: 75
    },
    {
      id: 'collab-002',
      agents: ['progress_tracker', 'motivator'],
      topic: 'Student Engagement Optimization',
      participants: 2,
      status: 'active',
      startedAt: new Date(Date.now() - 3600000),
      messages: 18,
      progress: 60
    }
  ];

  const crossAgentMetrics: CrossAgentMetrics = {
    totalInteractions: 1247,
    averageResponseTime: 1.25,
    userSatisfaction: 94.5,
    collaborationEfficiency: 89.2,
    knowledgeTransfer: 87.8,
    workflowCompletion: 92.1
  };

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'course_creation',
      name: 'Complete Course Creation',
      description: 'End-to-end course development workflow',
      agents: ['content_curator', 'quiz_master', 'evaluator', 'progress_tracker'],
      steps: ['Content Planning', 'Material Creation', 'Assessment Design', 'Progress Tracking'],
      estimatedDuration: 480,
      successRate: 94
    },
    {
      id: 'student_assessment',
      name: 'Comprehensive Student Assessment',
      description: 'Multi-faceted student evaluation process',
      agents: ['evaluator', 'progress_tracker', 'motivator'],
      steps: ['Performance Analysis', 'Progress Evaluation', 'Motivation Boost', 'Report Generation'],
      estimatedDuration: 180,
      successRate: 91
    },
    {
      id: 'learning_optimization',
      name: 'Learning Path Optimization',
      description: 'Optimize individual learning journeys',
      agents: ['system_orchestrator', 'content_curator', 'progress_tracker'],
      steps: ['Path Analysis', 'Content Optimization', 'Progress Monitoring', 'Recommendations'],
      estimatedDuration: 120,
      successRate: 89
    }
  ];

  // Real-time metrics simulation
  const performanceData = useMemo(() => [
    { time: '10:00', interactions: 45, efficiency: 85, satisfaction: 92 },
    { time: '11:00', interactions: 62, efficiency: 88, satisfaction: 94 },
    { time: '12:00', interactions: 38, efficiency: 82, satisfaction: 89 },
    { time: '13:00', interactions: 71, efficiency: 91, satisfaction: 96 },
    { time: '14:00', interactions: 55, efficiency: 87, satisfaction: 93 }
  ], []);

  const agentUsageData = useMemo(() => [
    { name: 'System Orchestrator', usage: 32, efficiency: 96 },
    { name: 'Content Curator', usage: 28, efficiency: 94 },
    { name: 'Quiz Master', usage: 25, efficiency: 91 },
    { name: 'Motivator', usage: 23, efficiency: 98 },
    { name: 'Evaluator', usage: 22, efficiency: 89 },
    { name: 'Progress Tracker', usage: 20, efficiency: 95 }
  ], []);

  const activeAgentInfo = agents.find(agent => agent.id === activeAgent) || agents[0];

  useEffect(() => {
    if (onAgentSwitch) {
      onAgentSwitch(activeAgent);
    }
  }, [activeAgent, onAgentSwitch]);

  const handleAgentSelect = (agentId: string) => {
    setActiveAgent(agentId);
  };

  const handleCollaborationStart = (agents: string[]) => {
    const sessionId = `collab-${Date.now()}`;
    setActiveCollaborationSession(sessionId);
    if (onCollaborationStart) {
      onCollaborationStart(sessionId, agents);
    }
  };

  const handleWorkflowExecute = (templateId: string) => {
    setSelectedWorkflowTemplate(templateId);
    if (onWorkflowExecute) {
      onWorkflowExecute(templateId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'busy': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 95) return 'text-green-400';
    if (value >= 90) return 'text-yellow-400';
    return 'text-red-400';
  };

  const ChatDashboardView = () => (
    <div className="space-y-6">
      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
              activeAgent === agent.id
                ? 'bg-white/20 border-white/30 shadow-lg'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            onClick={() => handleAgentSelect(agent.id)}
          >
            <div className="flex items-start space-x-3 mb-3">
              <div className={`text-2xl p-2 rounded-full bg-gradient-to-r ${agent.color}`}>
                {agent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{agent.name}</h3>
                <p className="text-xs text-white/70 mt-1">{agent.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={getStatusColor(agent.status)} size="sm">
                  {agent.status}
                </Badge>
                <span className="text-xs text-white/60">
                  {agent.capabilities.length} capabilities
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-white/60">Response</span>
                  <div className="text-white">{agent.performance.responseTime}s</div>
                </div>
                <div>
                  <span className="text-white/60">Accuracy</span>
                  <div className={getPerformanceColor(agent.performance.accuracy)}>
                    {agent.performance.accuracy}%
                  </div>
                </div>
                <div>
                  <span className="text-white/60">Usage</span>
                  <div className="text-white">{agent.performance.usage}%</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Chat Interface */}
      <Card variant="glass" padding="none" className="h-[500px]">
        <div className="p-4 border-b border-white/20 bg-gradient-to-r from-white/5 to-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`text-3xl p-3 rounded-full bg-gradient-to-r ${activeAgentInfo.color}`}>
                {activeAgentInfo.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{activeAgentInfo.name}</h2>
                <p className="text-sm text-white/80">{activeAgentInfo.description}</p>
              </div>
            </div>
            <Badge variant={getStatusColor(activeAgentInfo.status)} className="animate-pulse">
              {activeAgentInfo.status === 'online' ? 'Ready to Chat' : 'Currently Offline'}
            </Badge>
          </div>
        </div>
        <div className="h-[400px]">
          {activeAgentInfo.isActive ? (
            <activeAgentInfo.component
              sessionId={sessionId}
              onMessageSent={onMessageSent}
              onResponseReceived={onResponseReceived}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">😴</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {activeAgentInfo.name} is Offline
                </h3>
                <p className="text-white/70">
                  This agent is currently unavailable. Please try again later.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const CollaborationWorkspaceView = () => (
    <div className="space-y-6">
      {/* Active Sessions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <span>🤝</span>
          <span>Active Collaboration Sessions</span>
          <Badge variant="info" size="sm">{collaborationSessions.length}</Badge>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {collaborationSessions.map((session) => (
            <Card key={session.id} variant="glass" padding="md" className="hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-white">{session.topic}</h4>
                  <p className="text-sm text-white/70 mt-1">
                    {session.participants} agents collaborating
                  </p>
                </div>
                <Badge variant={session.status === 'active' ? 'success' : 'default'} size="sm">
                  {session.status}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {session.agents.map((agentId) => {
                      const agent = agents.find(a => a.id === agentId);
                      return agent ? (
                        <Avatar
                          key={agentId}
                          src={`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="16" fill="${agent.color.split(' ')[1].split('-')[1]}"/><text x="16" y="20" font-size="14" text-anchor="middle" fill="white">${agent.icon}</text></svg>`)}`}
                          alt={agent.name}
                          size="sm"
                          className="border-2 border-gray-800"
                        />
                      ) : null;
                    })}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Messages</span>
                    <span className="text-white">{session.messages}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Progress</span>
                    <span className="text-white">{session.progress}%</span>
                  </div>
                  <Progress value={session.progress} className="h-2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Collaboration Controls */}
      <Card variant="glass" padding="md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <span>🚀</span>
          <span>Start New Collaboration</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/70 mb-2 block">Select Agents</label>
            <div className="grid grid-cols-2 gap-2">
              {agents.map((agent) => (
                <label key={agent.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded"
                    defaultChecked={agent.status === 'online'}
                    disabled={agent.status === 'offline'}
                  />
                  <span className="text-white text-sm">{agent.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm text-white/70 mb-2 block">Collaboration Topic</label>
            <input
              type="text"
              placeholder="e.g., Course Design Optimization"
              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-3">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleCollaborationStart(['content_curator', 'quiz_master'])}>
            Start Collaboration
          </Button>
        </div>
      </Card>
    </div>
  );

  const AgentCoordinationView = () => (
    <div className="space-y-6">
      {/* Agent Network Visualization */}
      <Card variant="glass" padding="md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <span>🕸️</span>
          <span>Agent Network Coordination</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-white/70 mb-3">Communication Matrix</h4>
            <div className="space-y-3">
              {agents.slice(0, -1).map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-white/5 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{agent.icon}</span>
                    <span className="text-white">{agent.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success" size="sm">Connected</Badge>
                    <span className="text-white/70 text-sm">
                      {Math.floor(Math.random() * 10) + 1} interactions
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-white/70 mb-3">Cross-Agent Insights</h4>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded">
                <div className="text-white/70 text-sm">Knowledge Transfer Efficiency</div>
                <div className="text-2xl font-bold text-green-400">87.8%</div>
                <Progress value={87.8} className="h-2 mt-2" />
              </div>
              <div className="p-3 bg-white/5 rounded">
                <div className="text-white/70 text-sm">Collaboration Effectiveness</div>
                <div className="text-2xl font-bold text-blue-400">89.2%</div>
                <Progress value={89.2} className="h-2 mt-2" />
              </div>
              <div className="p-3 bg-white/5 rounded">
                <div className="text-white/70 text-sm">Workflow Completion Rate</div>
                <div className="text-2xl font-bold text-purple-400">92.1%</div>
                <Progress value={92.1} className="h-2 mt-2" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Intelligent Routing */}
      <Card variant="glass" padding="md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <span>🧠</span>
          <span>Intelligent Agent Routing</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded">
            <h4 className="text-white font-medium mb-2">Smart Recommendations</h4>
            <p className="text-white/70 text-sm mb-3">AI-powered agent suggestions for optimal task routing</p>
            <div className="space-y-2">
              <Badge variant="info" size="sm">Content + Quiz Creation</Badge>
              <Badge variant="success" size="sm">High Confidence: 94%</Badge>
            </div>
          </div>
          
          <div className="p-4 bg-white/5 rounded">
            <h4 className="text-white font-medium mb-2">Load Balancing</h4>
            <p className="text-white/70 text-sm mb-3">Distribute workload across available agents</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Current Load</span>
                <span className="text-white">73%</span>
              </div>
              <Progress value={73} className="h-2" />
            </div>
          </div>
          
          <div className="p-4 bg-white/5 rounded">
            <h4 className="text-white font-medium mb-2">Priority Queue</h4>
            <p className="text-white/70 text-sm mb-3">Manage agent task priorities and queues</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/70">High Priority</span>
                <span className="text-white">2 tasks</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Normal</span>
                <span className="text-white">8 tasks</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const CrossAgentAnalyticsView = () => (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" padding="md" className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {crossAgentMetrics.totalInteractions}
          </div>
          <div className="text-white/70 text-sm">Total Interactions</div>
        </Card>
        
        <Card variant="glass" padding="md" className="text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {crossAgentMetrics.averageResponseTime}s
          </div>
          <div className="text-white/70 text-sm">Avg Response Time</div>
        </Card>
        
        <Card variant="glass" padding="md" className="text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {crossAgentMetrics.userSatisfaction}%
          </div>
          <div className="text-white/70 text-sm">User Satisfaction</div>
        </Card>
        
        <Card variant="glass" padding="md" className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {crossAgentMetrics.collaborationEfficiency}%
          </div>
          <div className="text-white/70 text-sm">Collaboration Efficiency</div>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass" padding="md">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Trends</h3>
          <div className="h-[300px] flex items-center justify-center text-white/60">
            {/* Chart temporarily disabled for compilation */}
            Performance data visualization
          </div>
        </Card>
        
        <Card variant="glass" padding="md">
          <h3 className="text-lg font-semibold text-white mb-4">Agent Usage Distribution</h3>
          <div className="h-[300px] flex items-center justify-center text-white/60">
            {/* Chart temporarily disabled for compilation */}
            Agent usage data visualization
          </div>
        </Card>
      </div>

      {/* Agent Performance Details */}
      <Card variant="glass" padding="md">
        <h3 className="text-lg font-semibold text-white mb-4">Detailed Agent Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-white/70 text-sm font-medium py-3">Agent</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Response Time</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Accuracy</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Satisfaction</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Usage</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{agent.icon}</span>
                      <span className="text-white font-medium">{agent.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-white">{agent.performance.responseTime}s</td>
                  <td className="py-3">
                    <span className={getPerformanceColor(agent.performance.accuracy)}>
                      {agent.performance.accuracy}%
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={getPerformanceColor(agent.performance.satisfaction)}>
                      {agent.performance.satisfaction}%
                    </span>
                  </td>
                  <td className="py-3 text-white">{agent.performance.usage}%</td>
                  <td className="py-3">
                    <Badge variant={getStatusColor(agent.status)} size="sm">
                      {agent.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const WorkflowManagerView = () => (
    <div className="space-y-6">
      {/* Workflow Templates */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <span>⚡</span>
          <span>Workflow Templates</span>
          <Badge variant="info" size="sm">{workflowTemplates.length}</Badge>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {workflowTemplates.map((template) => (
            <Card key={template.id} variant="glass" padding="md" className="hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-white">{template.name}</h4>
                  <p className="text-sm text-white/70 mt-1">{template.description}</p>
                </div>
                <Badge variant="success" size="sm">
                  {template.successRate}%
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-white/70 text-sm mb-2">Participating Agents</div>
                  <div className="flex flex-wrap gap-1">
                    {template.agents.map((agentId) => {
                      const agent = agents.find(a => a.id === agentId);
                      return agent ? (
                        <Badge key={agentId} variant="info" size="sm">
                          {agent.icon} {agent.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
                
                <div>
                  <div className="text-white/70 text-sm mb-2">Workflow Steps</div>
                  <div className="space-y-1">
                    {template.steps.map((step, index) => (
                      <div key={index} className="text-xs text-white/60">
                        {index + 1}. {step}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-white/20">
                  <span className="text-white/70 text-sm">
                    {template.estimatedDuration}min estimated
                  </span>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleWorkflowExecute(template.id)}
                  >
                    Execute
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Workflows */}
      <Card variant="glass" padding="md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <span>🔄</span>
          <span>Active Workflows</span>
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-white">Complete Course Creation</h4>
                <p className="text-sm text-white/70">Content Curator + Quiz Master + Evaluator</p>
              </div>
              <Badge variant="warning" size="sm">In Progress</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Progress</span>
                <span className="text-white">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </div>
          
          <div className="p-4 bg-white/5 rounded">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-white">Learning Path Optimization</h4>
                <p className="text-sm text-white/70">System Orchestrator + Content Curator</p>
              </div>
              <Badge variant="info" size="sm">Queued</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Progress</span>
                <span className="text-white">0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const PerformanceMonitorView = () => (
    <div className="space-y-6">
      {/* Real-time System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" padding="md" className="text-center">
          <div className="text-2xl mb-2">🟢</div>
          <div className="text-2xl font-bold text-green-400">98.5%</div>
          <div className="text-white/70 text-sm">System Health</div>
          <Progress value={98.5} className="h-2 mt-2" />
        </Card>
        
        <Card variant="glass" padding="md" className="text-center">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-2xl font-bold text-blue-400">1.25s</div>
          <div className="text-white/70 text-sm">Avg Response Time</div>
          <Progress value={85} className="h-2 mt-2" />
        </Card>
        
        <Card variant="glass" padding="md" className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-2xl font-bold text-purple-400">94.2%</div>
          <div className="text-white/70 text-sm">Uptime</div>
          <Progress value={94.2} className="h-2 mt-2" />
        </Card>
        
        <Card variant="glass" padding="md" className="text-center">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-yellow-400">92.1%</div>
          <div className="text-white/70 text-sm">Success Rate</div>
          <Progress value={92.1} className="h-2 mt-2" />
        </Card>
      </div>

      {/* Agent Status Grid */}
      <Card variant="glass" padding="md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <span>📈</span>
          <span>Real-time Agent Monitoring</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="p-4 bg-white/5 rounded">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{agent.icon}</span>
                  <span className="text-white font-medium">{agent.name}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  agent.status === 'online' ? 'bg-green-400 animate-pulse' :
                  agent.status === 'busy' ? 'bg-yellow-400 animate-pulse' :
                  'bg-red-400'
                }`} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">CPU Usage</span>
                  <span className="text-white">{Math.floor(Math.random() * 30) + 20}%</span>
                </div>
                <Progress value={Math.floor(Math.random() * 30) + 20} className="h-1" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Memory</span>
                  <span className="text-white">{Math.floor(Math.random() * 40) + 30}%</span>
                </div>
                <Progress value={Math.floor(Math.random() * 40) + 30} className="h-1" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Queue Length</span>
                  <span className="text-white">{Math.floor(Math.random() * 5)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* System Alerts */}
      <Card variant="glass" padding="md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <span>🚨</span>
          <span>System Alerts & Notifications</span>
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded">
            <span className="text-green-400">✓</span>
            <div>
              <div className="text-white font-medium">System Status: Healthy</div>
              <div className="text-white/70 text-sm">All agents are operating within normal parameters</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
            <span className="text-yellow-400">⚠️</span>
            <div>
              <div className="text-white font-medium">High Load Warning</div>
              <div className="text-white/70 text-sm">Evaluator agent experiencing higher than normal load (87%)</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <span className="text-blue-400">ℹ️</span>
            <div>
              <div className="text-white font-medium">Optimization Suggestion</div>
              <div className="text-white/70 text-sm">Consider redistributing tasks to improve response times</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'chat': return <ChatDashboardView />;
      case 'collaboration': return <CollaborationWorkspaceView />;
      case 'coordination': return <AgentCoordinationView />;
      case 'analytics': return <CrossAgentAnalyticsView />;
      case 'workflows': return <WorkflowManagerView />;
      case 'monitoring': return <PerformanceMonitorView />;
      default: return <ChatDashboardView />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <span>🤖</span>
          <span>Multi-Agent Orchestration Platform</span>
        </h1>
        <p className="text-white/80 max-w-3xl mx-auto">
          Advanced multi-agent coordination system with intelligent collaboration, workflow management, 
          and real-time performance monitoring across all AI agents.
        </p>
        
        {/* Key Metrics Banner */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{crossAgentMetrics.totalInteractions}</div>
            <div className="text-white/70 text-sm">Total Interactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{crossAgentMetrics.userSatisfaction}%</div>
            <div className="text-white/70 text-sm">User Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{crossAgentMetrics.collaborationEfficiency}%</div>
            <div className="text-white/70 text-sm">Collaboration Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{agents.filter(a => a.status === 'online').length}</div>
            <div className="text-white/70 text-sm">Active Agents</div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <Card variant="glass" padding="none" className="mb-6">
        <Tabs 
          value={activeView} 
          onValueChange={(value) => setActiveView(value as any)}
          className="w-full"
        >
          <div className="flex flex-wrap border-b border-white/20">
            <button 
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeView === 'chat' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="mr-2">💬</span>
              Chat Dashboard
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeView === 'collaboration' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="mr-2">🤝</span>
              Collaboration
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeView === 'coordination' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="mr-2">🕸️</span>
              Coordination
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeView === 'analytics' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="mr-2">📊</span>
              Analytics
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeView === 'workflows' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="mr-2">⚡</span>
              Workflows
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeView === 'monitoring' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="mr-2">📈</span>
              Monitoring
            </button>
          </div>
        </Tabs>
      </Card>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveView()}
        </motion.div>
      </AnimatePresence>

      {/* Quick Actions Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card variant="glass" padding="md">
          <div className="text-center">
            <h4 className="text-sm font-medium text-white mb-3">Multi-Agent System Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-white/70">
              <div>
                <span className="font-medium">🤝 Collaborate</span><br/>
                Start multi-agent sessions for complex tasks
              </div>
              <div>
                <span className="font-medium">⚡ Workflows</span><br/>
                Use templates for standardized processes
              </div>
              <div>
                <span className="font-medium">📊 Monitor</span><br/>
                Track performance and system health
              </div>
              <div>
                <span className="font-medium">🧠 Optimize</span><br/>
                Let AI route tasks intelligently
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default MultiAgentChat;