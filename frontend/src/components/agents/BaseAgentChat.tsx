// JAC Learning Platform - TypeScript utilities by Cavin Otieno

/**
 * Base Agent Chat Component - JAC Learning Platform
 * 
 * Advanced reusable base component for individual agent chat interfaces.
 * Handles comprehensive chat functionality, WebSocket integration, and rich UI patterns.
 * 
 * Author: Cavin Otieno
 * Created: 2025-11-26
 * Enhanced: 2025-12-03
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from '../ui';
import { EnterpriseInput as Input } from '../ui';
import webSocketService, { WebSocketMessage } from '../../services/websocketService';
import { gamificationService } from '../../services/gamificationService';
import { useAppStore } from '../../store/store';
import { useAgentStore } from '../../store/slices/agentSlice';
import { toast } from 'react-hot-toast';

// Enhanced interfaces for advanced features
interface ChatMessage {
  id: string;
  agent_id: string;
  user_id: string;
  content: string;
  type: 'text' | 'code' | 'image' | 'file' | 'markdown' | 'voice';
  timestamp: string;
  is_read: boolean;
  is_edited?: boolean;
  edited_at?: string;
  reactions?: MessageReaction[];
  thread_id?: string;
  parent_message_id?: string;
  metadata?: ChatMessageMetadata;
  attachments?: FileAttachment[];
}

interface MessageReaction {
  emoji: string;
  user_id: string;
  count: number;
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail_url?: string;
}

interface ChatMessageMetadata {
  code_language?: string;
  code_theme?: string;
  confidence_score?: number;
  learning_context?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  complexity_level?: 'beginner' | 'intermediate' | 'advanced';
  estimated_reading_time?: number;
}

interface AgentPersonality {
  tone: 'friendly' | 'professional' | 'casual' | 'encouraging';
  response_style: 'detailed' | 'concise' | 'conversational';
  expertise_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  specializations: string[];
  system_prompt?: string;
}

interface VoiceSettings {
  enabled: boolean;
  input: boolean;
  output: boolean;
  voice_id?: string;
  auto_speech?: boolean;
}

interface SearchFilters {
  query: string;
  message_types: ('text' | 'code' | 'image' | 'file' | 'markdown' | 'voice')[];
  date_range?: { start: Date; end: Date };
  agent_ids?: string[];
}

interface BaseAgentChatProps {
  agentId: string;
  agentType: string;
  agentName: string;
  agentIcon: string;
  agentDescription: string;
  agentCapabilities: string[];
  agentColor: string;
  agentPersonality?: AgentPersonality;
  sessionId?: string;
  enableVoice?: boolean;
  enableFileUpload?: boolean;
  enableSearch?: boolean;
  enableExport?: boolean;
  maxMessages?: number;
  theme?: 'light' | 'dark' | 'auto';
  onMessageSent?: (message: string, metadata?: any) => void;
  onResponseReceived?: (response: string, metadata?: any) => void;
  onFileUploaded?: (file: File, metadata?: any) => void;
  onVoiceInput?: (audioBlob: Blob) => void;
}

const BaseAgentChat: React.FC<BaseAgentChatProps> = ({
  agentId,
  agentType,
  agentName,
  agentIcon,
  agentDescription,
  agentCapabilities,
  agentColor,
  agentPersonality,
  sessionId,
  enableVoice = false,
  enableFileUpload = false,
  enableSearch = true,
  enableExport = true,
  maxMessages = 1000,
  theme = 'auto',
  onMessageSent,
  onResponseReceived,
  onFileUploaded,
  onVoiceInput
}) => {
  // Core state management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Enhanced UI state
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    message_types: ['text', 'code', 'image', 'file', 'markdown', 'voice']
  });
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: enableVoice,
    input: enableVoice,
    output: enableVoice
  });
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [messageMode, setMessageMode] = useState<'text' | 'markdown' | 'code'>('text');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Generate session ID if not provided
  const actualSessionId = useMemo(() => 
    sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
    [sessionId]
  );
  
  // Get agent state from store with enhanced data
  const agent = useAgentStore(state => 
    state.agents?.find((a: any) => a.id === agentId)
  );
  
  const isAgentTyping = useAgentStore(state => 
    state.isTyping?.[agentId] || false
  );

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setIsSearchActive(prev => !prev);
            break;
          case 'Enter':
            if (e.shiftKey) {
              e.preventDefault();
              sendMessage(e as any);
            }
            break;
          case 'b':
            if (e.shiftKey) {
              e.preventDefault();
              setShowCodeEditor(prev => !prev);
            }
            break;
          case 's':
            e.preventDefault();
            if (enableVoice) {
              toggleVoiceRecording();
            }
            break;
          case 'e':
            e.preventDefault();
            if (enableExport) {
              exportConversation();
            }
            break;
        }
      }
      
      if (e.key === 'Escape') {
        if (isSearchActive) {
          setIsSearchActive(false);
          setSearchResults([]);
        }
        if (showCodeEditor) {
          setShowCodeEditor(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isSearchActive, showCodeEditor, enableVoice, enableExport]);

  // WebSocket connection with enhanced error handling
  useEffect(() => {
    if (agentId && agentType) {
      const connectWebSocket = async () => {
        try {
          await webSocketService.connect(`/agent/${agentId}`, { agentType, sessionId: actualSessionId });
          setIsConnected(true);
          
          // Subscribe to enhanced events
          webSocketService.on('message', handleAgentMessage);
          webSocketService.on('typing', handleAgentTyping);
          webSocketService.on('status', handleAgentStatus);
          webSocketService.on('reaction', handleMessageReaction);
          webSocketService.on('file_shared', handleFileShared);
          
        } catch (error) {
          console.error('WebSocket connection failed:', error);
          setIsConnected(false);
          toast.error('Failed to connect to agent. Please check your connection.');
        }
      };

      connectWebSocket();
      
      return () => {
        webSocketService.disconnect(`/agent/${agentId}`);
        webSocketService.off('message', handleAgentMessage);
        webSocketService.off('typing', handleAgentTyping);
        webSocketService.off('status', handleAgentStatus);
        webSocketService.off('reaction', handleMessageReaction);
        webSocketService.off('file_shared', handleFileShared);
      };
    }
  }, [agentId, agentType, actualSessionId]);

  // Auto-scroll and performance optimizations
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages]);

  // Load chat history with enhanced features
  useEffect(() => {
    loadChatHistory();
    loadUserPreferences();
  }, [agentId, actualSessionId]);

  // Enhanced agent message handler
  const handleAgentMessage = useCallback((data: any) => {
    if (data.content && data.agent_id === agentId) {
      const newMessage: ChatMessage = {
        id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        agent_id: data.agent_id,
        user_id: 'agent',
        content: data.content,
        type: data.type || 'text',
        timestamp: data.timestamp || new Date().toISOString(),
        is_read: true,
        reactions: data.reactions || [],
        metadata: data.metadata,
        attachments: data.attachments || []
      };
      
      setMessages(prev => {
        const updated = [...prev, newMessage];
        return updated.slice(-maxMessages); // Maintain message limit
      });
      
      setIsTyping(false);
      
      if (onResponseReceived) {
        onResponseReceived(data.content, data.metadata);
      }
      
      // Trigger gamification with enhanced context
      gamificationService.awardPoints(10, 'agent_interaction', {
        agentId,
        agentType,
        messageLength: data.content.length,
        responseTime: Date.now() - (data.request_timestamp || Date.now()),
        agentPersonality: agentPersonality?.tone
      }).catch(console.warn);
      
      // Text-to-speech if enabled
      if (voiceSettings.output && voiceSettings.enabled) {
        speakText(data.content);
      }
    }
  }, [agentId, agentType, onResponseReceived, agentPersonality, voiceSettings, maxMessages]);

  // Voice functionality
  const toggleVoiceRecording = useCallback(async () => {
    if (!voiceSettings.input || !voiceSettings.enabled) {
      toast.error('Voice input is not enabled');
      return;
    }

    try {
      if (!isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        audioChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setIsRecording(false);
          
          if (onVoiceInput) {
            onVoiceInput(audioBlob);
          }
          
          // Process voice-to-text (would integrate with speech-to-text service)
          processVoiceInput(audioBlob);
        };
        
        voiceRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
        toast.success('Recording started...');
      } else {
        voiceRecorderRef.current?.stop();
      }
    } catch (error) {
      console.error('Voice recording error:', error);
      toast.error('Failed to access microphone');
    }
  }, [isRecording, voiceSettings, onVoiceInput]);

  const processVoiceInput = useCallback(async (audioBlob: Blob) => {
    try {
      // This would integrate with a speech-to-text service
      // For now, simulate voice processing
      const simulatedTranscript = 'Voice input detected (integration needed)';
      setCurrentMessage(simulatedTranscript);
      toast.success('Voice input processed');
    } catch (error) {
      console.error('Voice processing error:', error);
      toast.error('Failed to process voice input');
    }
  }, []);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // File upload handling
  const handleFileUpload = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
      const attachment: FileAttachment = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      };
      
      setUploadedFiles(prev => [...prev, attachment]);
      
      if (onFileUploaded) {
        onFileUploaded(file, { agentId, sessionId: actualSessionId });
      }
    });
    
    toast.success(`${fileArray.length} file(s) uploaded successfully`);
  }, [onFileUploaded, agentId, actualSessionId]);

  // Message reactions
  const handleMessageReaction = useCallback((data: any) => {
    setMessages(prev => prev.map(msg => 
      msg.id === data.message_id 
        ? { 
            ...msg, 
            reactions: data.reactions || msg.reactions 
          }
        : msg
    ));
  }, []);

  // File sharing
  const handleFileShared = useCallback((data: any) => {
    const fileMessage: ChatMessage = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      agent_id: data.agent_id,
      user_id: 'agent',
      content: `Shared file: ${data.filename}`,
      type: 'file',
      timestamp: new Date().toISOString(),
      is_read: true,
      attachments: [data.attachment]
    };
    
    setMessages(prev => [...prev, fileMessage]);
  }, []);

  // Enhanced search functionality
  const performSearch = useCallback((filters: SearchFilters) => {
    if (!filters.query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = messages.filter(message => {
      const matchesQuery = message.content.toLowerCase().includes(filters.query.toLowerCase());
      const matchesType = filters.message_types.includes(message.type);
      return matchesQuery && matchesType;
    });

    setSearchResults(results);
  }, [messages]);

  useEffect(() => {
    performSearch(searchFilters);
  }, [searchFilters, performSearch]);

  // Export conversation
  const exportConversation = useCallback(() => {
    const exportData = {
      session_id: actualSessionId,
      agent: {
        id: agentId,
        name: agentName,
        type: agentType
      },
      messages: messages,
      exported_at: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversation-${agentName}-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Conversation exported successfully');
  }, [messages, actualSessionId, agentId, agentName, agentType]);

  // Message sending with enhanced features
  const sendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMessage.trim() || isLoading || !isConnected) {
      return;
    }

    const messageContent = currentMessage.trim();
    const messageType = messageMode === 'code' ? 'code' : 
                       messageMode === 'markdown' ? 'markdown' : 'text';
    
    setCurrentMessage('');
    setIsLoading(true);

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      agent_id: agentId,
      user_id: 'current-user',
      content: messageContent,
      type: messageType,
      timestamp: new Date().toISOString(),
      is_read: true,
      metadata: {
        code_language: messageType === 'code' ? codeLanguage : undefined,
        complexity_level: 'intermediate'
      }
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);

    try {
      // Send message via WebSocket with enhanced metadata
      webSocketService.send(`/agent/${agentId}`, {
        type: 'message',
        data: {
          content: messageContent,
          messageType,
          code_language: messageType === 'code' ? codeLanguage : undefined,
          sessionId: actualSessionId
        },
        timestamp: new Date().toISOString()
      });
      
      if (onMessageSent) {
        onMessageSent(messageContent, {
          type: messageType,
          code_language: messageType === 'code' ? codeLanguage : undefined
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        agent_id: agentId,
        user_id: 'agent',
        content: 'Sorry, I encountered an error. Please try again.',
        type: 'text',
        timestamp: new Date().toISOString(),
        is_read: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message');
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  }, [currentMessage, isLoading, isConnected, agentId, agentType, actualSessionId, 
      messageMode, codeLanguage, onMessageSent]);

  // Load chat history with persistence
  const loadChatHistory = useCallback(async () => {
    try {
      // Enhanced loading with local storage persistence
      const storedHistory = localStorage.getItem(`chat-history-${actualSessionId}`);
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        setMessages(parsed.slice(-50)); // Load last 50 messages
        return;
      }

      // Add welcome message with personality
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        agent_id: agentId,
        user_id: 'agent',
        content: generateWelcomeMessage(),
        type: 'text',
        timestamp: new Date().toISOString(),
        is_read: true,
        metadata: {
          learning_context: 'introduction',
          complexity_level: (agentPersonality?.expertise_level === 'expert' ? 'advanced' : agentPersonality?.expertise_level) || 'intermediate'
        }
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, [agentId, agentName, agentDescription, agentPersonality, actualSessionId]);

  // Generate personality-based welcome message
  const generateWelcomeMessage = useCallback(() => {
    const personality = agentPersonality;
    let message = `Hello! I'm ${agentName}. `;
    
    if (personality?.tone === 'friendly') {
      message += "I'm excited to help you learn and grow! ";
    } else if (personality?.tone === 'professional') {
      message += "I'm here to assist with your learning objectives. ";
    } else if (personality?.tone === 'encouraging') {
      message += "I believe in your potential and I'm here to support your journey! ";
    }
    
    message += agentDescription;
    
    if (personality?.response_style === 'detailed') {
      message += " I provide comprehensive, in-depth explanations.";
    } else if (personality?.response_style === 'concise') {
      message += " I focus on clear, concise responses.";
    }
    
    message += " How can I assist you today?";
    
    return message;
  }, [agentName, agentDescription, agentPersonality]);

  // Save chat history to local storage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat-history-${actualSessionId}`, JSON.stringify(messages));
    }
  }, [messages, actualSessionId]);

  // Load user preferences
  const loadUserPreferences = useCallback(() => {
    const prefs = localStorage.getItem(`chat-preferences-${agentId}`);
    if (prefs) {
      const parsed = JSON.parse(prefs);
      setVoiceSettings(prev => ({ ...prev, ...parsed.voice }));
      setMessageMode(parsed.defaultMessageMode || 'text');
    }
  }, [agentId]);

  // Handle typing indicators
  const handleAgentTyping = useCallback((data: any) => {
    if (data.agent_id === agentId) {
      setIsTyping(data.is_typing);
    }
  }, [agentId]);

  // Handle status changes
  const handleAgentStatus = useCallback((data: any) => {
    if (data.agent_id === agentId) {
      setIsConnected(data.status === 'active');
      if (data.status === 'active' && !isConnected) {
        toast.success(`Connected to ${agentName}`);
      } else if (data.status !== 'active' && isConnected) {
        toast(`${agentName} is ${data.status}`, { icon: '⚠️' });
      }
    }
  }, [agentId, agentName, isConnected]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (enableFileUpload && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [enableFileUpload, handleFileUpload]);

  // Format time with enhanced display
  const formatTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }, []);

  // Get status color with enhanced states
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'busy': return 'warning';
      case 'inactive': return 'error';
      case 'away': return 'info';
      default: return 'info';
    }
  }, []);

  // Get quick suggestions with enhanced personalization
  const quickSuggestions = useMemo(() => 
    getEnhancedQuickSuggestions(agentType, agentPersonality), 
    [agentType, agentPersonality]
  );

  return (
    <div 
      className={`flex flex-col h-full bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 ${
        dragOver ? 'border-primary-400 bg-primary-500/10' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Enhanced Agent Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`text-2xl p-2 rounded-full bg-gradient-to-r ${agentColor}`}>
              {agentIcon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {agentName}
              </h3>
              <p className="text-sm text-white/80 capitalize">
                {agentType.replace('_', ' ')}
              </p>
              {agentPersonality && (
                <p className="text-xs text-white/60 capitalize">
                  {agentPersonality.tone} • {agentPersonality.response_style}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Connection Status */}
            <Badge 
              variant={isConnected ? getStatusColor('active') : getStatusColor('inactive')}
              size="sm"
            >
              {isConnected ? 'Connected' : 'Offline'}
            </Badge>
            
            {/* Typing Indicator */}
            {(isTyping || isAgentTyping) && (
              <Badge variant="info" size="sm">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Typing...
                </motion.span>
              </Badge>
            )}

            {/* Voice Recording Indicator */}
            {isRecording && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Badge variant="error" size="sm">
                  🎤 Recording
                </Badge>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Enhanced Agent Capabilities */}
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60 mb-2">Capabilities:</p>
              <div className="flex flex-wrap gap-1">
                {agentCapabilities.map((capability, index) => (
                  <Badge key={index} variant="info" size="sm">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {enableSearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchActive(!isSearchActive)}
                  className="text-white/60 hover:text-white"
                >
                  🔍
                </Button>
              )}
              
              {enableVoice && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoiceRecording}
                  className={`${isRecording ? 'text-red-400' : 'text-white/60'} hover:text-white`}
                >
                  🎤
                </Button>
              )}
              
              {enableExport && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportConversation}
                  className="text-white/60 hover:text-white"
                >
                  💾
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Panel */}
      <AnimatePresence>
        {isSearchActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-white/20 p-3 bg-black/20"
          >
            <div className="flex flex-col space-y-3">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchFilters.query}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, query: e.target.value }))}
                className="w-full glass rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm"
              />
              
              <div className="flex flex-wrap gap-2">
                {['text', 'code', 'image', 'file'].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      const types = searchFilters.message_types.includes(type as any)
                        ? searchFilters.message_types.filter(t => t !== type)
                        : [...searchFilters.message_types, type as any];
                      setSearchFilters(prev => ({ ...prev, message_types: types }));
                    }}
                    className={`px-2 py-1 rounded text-xs capitalize transition-colors ${
                      searchFilters.message_types.includes(type as any)
                        ? 'bg-primary-500/30 text-white'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              {searchResults.length > 0 && (
                <div className="text-xs text-white/60">
                  Found {searchResults.length} result(s)
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {(isSearchActive ? searchResults : messages).map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.user_id === 'current-user' 
                  ? 'justify-end' 
                  : 'justify-start'
              }`}
            >
              <div className={`max-w-[80%] group ${
                message.user_id === 'current-user'
                  ? 'bg-primary-500/20 border-primary-400/30'
                  : 'bg-white/10 border-white/20'
              } border rounded-2xl px-4 py-3`}>
                
                {/* Message Content with Enhanced Formatting */}
                <div className="text-white whitespace-pre-wrap">
                  {message.type === 'code' && message.metadata?.code_language ? (
                    <pre className={`language-${message.metadata.code_language} bg-black/30 rounded p-3 overflow-x-auto`}>
                      <code>{message.content}</code>
                    </pre>
                  ) : message.type === 'markdown' ? (
                    <div className="prose prose-invert max-w-none">
                      {/* Would integrate with markdown renderer */}
                      {message.content}
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
                
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map(attachment => (
                      <div key={attachment.id} className="bg-white/10 rounded-lg p-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">📎 {attachment.name}</span>
                          <span className="text-xs text-white/60">
                            {(attachment.size / 1024).toFixed(1)}KB
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(attachment.url, '_blank')}
                          >
                            Open
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Message Metadata */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-white/80">
                      {formatTime(message.timestamp)}
                    </span>
                    
                    {message.is_edited && (
                      <span className="text-xs text-white/60">(edited)</span>
                    )}
                    
                    {message.metadata?.complexity_level && (
                      <Badge variant="info" size="sm">
                        {message.metadata.complexity_level}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Message Actions */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Add reaction functionality
                      }}
                      className="text-white/60 hover:text-white"
                    >
                      ❤️
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(message.content);
                        toast.success('Message copied');
                      }}
                      className="text-white/60 hover:text-white"
                    >
                      📋
                    </Button>
                  </div>
                </div>
                
                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        className="flex items-center space-x-1 bg-white/10 rounded-full px-2 py-1 text-xs hover:bg-white/20 transition-colors"
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Enhanced Typing Indicator */}
        <AnimatePresence>
          {(isTyping || isAgentTyping) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-white/60 rounded-full"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ 
                        duration: 0.8, 
                        repeat: Infinity, 
                        delay: i * 0.2 
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Message Input */}
      <div className="p-4 border-t border-white/20">
        {/* Code Editor Toggle */}
        <AnimatePresence>
          {showCodeEditor && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-3 p-3 bg-black/30 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="bg-white/10 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCodeEditor(false)}
                  className="text-white/60"
                >
                  ✕
                </Button>
              </div>
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Enter your code..."
                className="w-full h-32 glass rounded-lg px-3 py-2 text-white placeholder-white/50 resize-none"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Message Mode Selector */}
        <div className="flex items-center space-x-2 mb-3">
          <select
            value={messageMode}
            onChange={(e) => setMessageMode(e.target.value as any)}
            className="glass rounded-lg px-2 py-1 text-white text-sm"
          >
            <option value="text">Text</option>
            <option value="markdown">Markdown</option>
            <option value="code">Code</option>
          </select>
          
          {messageMode === 'code' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCodeEditor(!showCodeEditor)}
              className="text-white/60"
            >
              {showCodeEditor ? 'Hide Editor' : 'Show Editor'}
            </Button>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="flex space-x-3">
          {enableFileUpload && (
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          )}
          
          {enableFileUpload && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="text-white/60 hover:text-white"
            >
              📎
            </Button>
          )}
          
          <input
            ref={inputRef}
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder={`Ask ${agentName} anything...`}
            disabled={!isConnected || isLoading}
            className="flex-1 glass rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent disabled:opacity-50"
          />
          
          <Button
            type="submit"
            variant="primary"
            disabled={!isConnected || !currentMessage.trim() || isLoading}
            isLoading={isLoading}
          >
            Send
          </Button>
        </form>
        
        {/* Enhanced Quick Suggestions */}
        {quickSuggestions.length > 0 && messages.length <= 1 && !isSearchActive && (
          <div className="mt-3">
            <p className="text-xs text-white/60 mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentMessage(suggestion)}
                  className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 text-white hover:text-white rounded-full transition-colors"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        )}
        
        {/* Keyboard Shortcuts Help */}
        <div className="mt-2 text-xs text-white/40">
          <span>⌨️ Ctrl+K: Search • Ctrl+Enter: Send • Ctrl+S: Voice • Ctrl+E: Export</span>
        </div>
      </div>
    </div>
  );
};

// Enhanced quick suggestions with personality
const getEnhancedQuickSuggestions = (agentType: string, personality?: AgentPersonality): string[] => {
  const suggestions: Record<string, string[]> = {
    'content_curator': [
      'Create a personalized learning path',
      'Recommend study materials for my level',
      'Help me organize my content efficiently',
      'Suggest topics based on my interests',
      'Create a study schedule for me'
    ],
    'quiz_master': [
      'Generate a practice quiz on my topic',
      'Create coding challenges for my level',
      'Test my understanding with examples',
      'Explain complex concepts with quizzes',
      'Make an interactive coding exercise'
    ],
    'evaluator': [
      'Assess my current progress level',
      'Review and improve my code',
      'Evaluate my understanding accuracy',
      'Provide detailed performance feedback',
      'Suggest areas for improvement'
    ],
    'progress_tracker': [
      'Show my learning statistics',
      'Analyze my performance trends',
      'Set achievable learning goals',
      'Track my improvement over time',
      'Recommend next learning steps'
    ],
    'motivator': [
      'Give me daily learning encouragement',
      'Set challenging but achievable goals',
      'Remind me of my progress and wins',
      'Provide motivational quotes and tips',
      'Celebrate my learning milestones'
    ],
    'system_orchestrator': [
      'Coordinate my entire learning journey',
      'Optimize my learning schedule',
      'Manage multiple learning agents',
      'Create a comprehensive study plan',
      'Monitor and adjust my learning path'
    ]
  };
  
  const baseSuggestions = suggestions[agentType] || ['Ask me anything!', 'How can I help?', 'What would you like to learn?'];
  
  // Customize suggestions based on personality
  if (personality?.tone === 'encouraging') {
    return baseSuggestions.map(s => s.includes('help') ? s.replace('help', 'support') : s);
  }
  
  if (personality?.response_style === 'detailed') {
    return baseSuggestions.map(s => s + ' (with detailed explanation)');
  }
  
  return baseSuggestions;
};

export default BaseAgentChat;