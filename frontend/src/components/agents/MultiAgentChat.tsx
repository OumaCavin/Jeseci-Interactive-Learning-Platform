import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  User, 
  Send, 
  Settings, 
  Brain, 
  Code, 
  BookOpen, 
  Lightbulb,
  MessageSquare,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useUserStatsStore } from '../../stores/userStatsStore';

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  specialties: string[];
  capabilities: string[];
  icon: React.ReactNode;
  personality: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  agentId?: string;
  timestamp: Date;
  type: 'text' | 'code' | 'explanation' | 'quiz' | 'resource';
  metadata?: {
    language?: string;
    code?: string;
    files?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    subject?: string;
    rating?: number;
    helpful?: boolean;
  };
  reactions?: {
    thumbsUp: number;
    thumbsDown: number;
  };
}

interface MultiAgentChatProps {
  defaultAgent?: string;
  onAgentSwitch?: (agentId: string) => void;
  onMessageSent?: (agentId: string, message: string) => void;
  onResponseReceived?: (agentId: string, response: string) => void;
  subject?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isMinimized?: boolean;
  className?: string;
}

const AVAILABLE_AGENTS: Agent[] = [
  {
    id: 'content_curator',
    name: 'Content Curator',
    role: 'Learning Assistant',
    description: 'Helps you discover and understand learning content',
    avatar: '📚',
    color: 'bg-blue-500',
    specialties: ['Content Discovery', 'Learning Paths', 'Study Materials'],
    capabilities: ['Find resources', 'Create study guides', 'Suggest learning materials'],
    icon: <BookOpen className="w-4 h-4" />,
    personality: 'Supportive and organized, focuses on structured learning'
  },
  {
    id: 'code_tutor',
    name: 'Code Tutor',
    role: 'Programming Mentor',
    description: 'Specializes in programming and code explanation',
    avatar: '💻',
    color: 'bg-green-500',
    specialties: ['Programming', 'Code Review', 'Debugging'],
    capabilities: ['Explain code', 'Debug issues', 'Review solutions', 'Code examples'],
    icon: <Code className="w-4 h-4" />,
    personality: 'Patient and methodical, breaks down complex concepts'
  },
  {
    id: 'ai_analyst',
    name: 'AI Analyst',
    role: 'Deep Thinker',
    description: 'Advanced AI for complex problem solving and analysis',
    avatar: '🧠',
    color: 'bg-purple-500',
    specialties: ['Problem Solving', 'Analysis', 'Advanced Concepts'],
    capabilities: ['Complex reasoning', 'Pattern recognition', 'Systematic analysis'],
    icon: <Brain className="w-4 h-4" />,
    personality: 'Analytical and thorough, enjoys challenging problems'
  },
  {
    id: 'creative_guide',
    name: 'Creative Guide',
    role: 'Innovation Mentor',
    description: 'Helps with creative thinking and project ideas',
    avatar: '🎨',
    color: 'bg-pink-500',
    specialties: ['Creativity', 'Project Ideas', 'Innovation'],
    capabilities: ['Generate ideas', 'Creative solutions', 'Project planning'],
    icon: <Lightbulb className="w-4 h-4" />,
    personality: 'Creative and inspiring, encourages outside-the-box thinking'
  }
];

const MultiAgentChat: React.FC<MultiAgentChatProps> = ({
  defaultAgent = 'content_curator',
  onAgentSwitch,
  onMessageSent,
  onResponseReceived,
  subject,
  difficulty = 'intermediate',
  isMinimized = false,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAgent, setCurrentAgent] = useState<string>(defaultAgent);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [isMinimizedLocal, setIsMinimizedLocal] = useState(isMinimized);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { statistics, loadUserStats } = useUserStatsStore();

  useEffect(() => {
    loadUserStats();
  }, [loadUserStats]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (defaultAgent !== currentAgent) {
      setCurrentAgent(defaultAgent);
    }
  }, [defaultAgent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentAgentData = AVAILABLE_AGENTS.find(agent => agent.id === currentAgent);

  const handleAgentSwitch = (agentId: string) => {
    setCurrentAgent(agentId);
    setShowAgentSelector(false);
    onAgentSwitch?.(agentId);
    
    // Add system message about agent switch
    const agent = AVAILABLE_AGENTS.find(a => a.id === agentId);
    if (agent) {
      addMessage({
        content: `Switched to ${agent.name}. How can I help you learn today?`,
        sender: 'agent',
        agentId: agentId,
        type: 'text'
      });
    }
  };

  const addMessage = (messageData: Partial<Message>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageData.content || '',
      sender: messageData.sender || 'user',
      agentId: messageData.agentId,
      timestamp: new Date(),
      type: messageData.type || 'text',
      metadata: messageData.metadata,
      reactions: { thumbsUp: 0, thumbsDown: 0 }
    };

    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message
    addMessage({
      content: userMessage,
      sender: 'user',
      type: 'text'
    });

    onMessageSent?.(currentAgent, userMessage);

    try {
      // Simulate AI response (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const response = await generateAIResponse(userMessage, currentAgent, subject, difficulty);
      
      addMessage({
        content: response.content,
        sender: 'agent',
        agentId: currentAgent,
        type: response.type,
        metadata: response.metadata
      });

      onResponseReceived?.(currentAgent, response.content);
    } catch (error) {
      addMessage({
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'agent',
        agentId: currentAgent,
        type: 'text'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (
    userMessage: string, 
    agentId: string, 
    subject?: string, 
    difficulty?: string
  ): Promise<{ content: string; type: Message['type']; metadata?: Message['metadata'] }> => {
    const agent = AVAILABLE_AGENTS.find(a => a.id === agentId);
    
    // Simple response generation based on agent type
    const responses = {
      content_curator: [
        `Based on your interest in ${subject || 'learning'}, I recommend starting with foundational concepts. Here's what I found:`,
        `Great question! Let me help you find the best resources for ${difficulty} level learning.`,
        `I can see you're curious about this topic. Let me suggest some structured learning materials.`
      ],
      code_tutor: [
        `Let me help you understand this programming concept step by step. Here's a clear explanation:`,
        `I notice this is a common programming challenge. Let me break it down with examples:`,
        `Great question about coding! Here's how you can approach this problem:`
      ],
      ai_analyst: [
        `This is an interesting analytical problem. Let me break it down systematically:`,
        `From an analytical perspective, this involves several key components to consider:`,
        `Let me provide a comprehensive analysis of this complex topic:`
      ],
      creative_guide: [
        `What an exciting challenge! Let me share some creative approaches to this problem:`,
        `I love these kinds of open-ended questions! Here are some innovative ideas:`,
        `Let me help you think creatively about this. There are many possibilities to explore:`
      ]
    };

    const agentResponses = responses[agentId as keyof typeof responses] || responses.content_curator;
    const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];

    return {
      content: randomResponse,
      type: 'text'
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReaction = (messageId: string, reaction: 'thumbsUp' | 'thumbsDown') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? {
            ...msg,
            reactions: {
              thumbsUp: reaction === 'thumbsUp' ? msg.reactions!.thumbsUp + 1 : msg.reactions!.thumbsUp,
              thumbsDown: reaction === 'thumbsDown' ? msg.reactions!.thumbsDown + 1 : msg.reactions!.thumbsDown
            }
          }
        : msg
    ));
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageTypeIcon = (type: Message['type']) => {
    switch (type) {
      case 'code':
        return <Code className="w-3 h-3" />;
      case 'explanation':
        return <BookOpen className="w-3 h-3" />;
      case 'quiz':
        return <MessageSquare className="w-3 h-3" />;
      case 'resource':
        return <Star className="w-3 h-3" />;
      default:
        return null;
    }
  };

  if (isMinimizedLocal) {
    return (
      <motion.div
        className={`fixed bottom-4 right-4 z-50 ${className}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <Button
          onClick={() => setIsMinimizedLocal(false)}
          className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <Card className={`flex flex-col h-full max-h-[600px] bg-white/95 backdrop-blur-lg border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAgentSelector(!showAgentSelector)}
              className="flex items-center space-x-2 hover:bg-white/50"
            >
              <div className={`w-8 h-8 rounded-full ${currentAgentData?.color} flex items-center justify-center text-white text-sm`}>
                {currentAgentData?.avatar}
              </div>
              <span className="font-medium">{currentAgentData?.name}</span>
              {showAgentSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            <AnimatePresence>
              {showAgentSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  {AVAILABLE_AGENTS.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => handleAgentSwitch(agent.id)}
                      className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        agent.id === currentAgent ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full ${agent.color} flex items-center justify-center text-white`}>
                          {agent.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-gray-600">{agent.description}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {agent.specialties.slice(0, 2).map((specialty) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="text-sm text-gray-600">
            {statistics && (
              <span className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>{statistics.total_points} points</span>
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimizedLocal(true)}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white ml-4'
                    : 'bg-gray-100 text-gray-800 mr-4'
                }`}>
                  {message.sender === 'agent' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                        {message.agentId && AVAILABLE_AGENTS.find(a => a.id === message.agentId)?.avatar}
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {message.agentId && AVAILABLE_AGENTS.find(a => a.id === message.agentId)?.name}
                      </span>
                      {message.type !== 'text' && (
                        <div className="flex items-center space-x-1">
                          {getMessageTypeIcon(message.type)}
                          <span className="text-xs text-gray-500 capitalize">{message.type}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="prose prose-sm max-w-none">
                    {message.content}
                  </div>
                  
                  {message.metadata?.code && (
                    <div className="mt-2 p-2 bg-gray-800 text-green-400 rounded text-sm font-mono">
                      <pre>{message.metadata.code}</pre>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {message.sender === 'agent' && (
                        <>
                          <button
                            onClick={() => handleReaction(message.id, 'thumbsUp')}
                            className="p-1 hover:bg-white/20 rounded"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            {message.reactions?.thumbsUp > 0 && (
                              <span className="text-xs">{message.reactions.thumbsUp}</span>
                            )}
                          </button>
                          <button
                            onClick={() => handleReaction(message.id, 'thumbsDown')}
                            className="p-1 hover:bg-white/20 rounded"
                          >
                            <ThumbsDown className="w-3 h-3" />
                            {message.reactions?.thumbsDown > 0 && (
                              <span className="text-xs">{message.reactions.thumbsDown}</span>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-lg p-3 mr-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                  {currentAgentData?.avatar}
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200/50">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${currentAgentData?.name} anything...`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {subject && (
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="outline">{subject}</Badge>
            <Badge variant="outline" className="capitalize">{difficulty}</Badge>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MultiAgentChat;