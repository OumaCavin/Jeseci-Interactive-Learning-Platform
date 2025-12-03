// JAC Learning Platform - Enterprise Loading Intelligence Platform
// Enhanced with AI-powered insights, educational optimization, and comprehensive analytics
// Author: Cavin Otieno

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Loader3, Circle, Square, Triangle, Zap, Brain, 
  Target, Clock, TrendingUp, Users, Heart, Star, CheckCircle,
  AlertCircle, Info, Lightbulb, BookOpen, GraduationCap,
  BarChart3, Activity, Gauge, Timer, PlayCircle, PauseCircle,
  RotateCcw, Download, Share, Settings, Eye, Volume2, VolumeX,
  Sparkles, Award, Trophy, Medal, Crown, Gem, Flame, Sunrise,
  Sunset, Moon, Sun, Cloud, CloudRain, CloudSnow, Wind,
  Waves, Mountain, Tree, Flower, Leaf, Flame as FireIcon,
  Battery, Signal, Wifi, Bluetooth, Usb, HardDrive, Monitor,
  Smartphone, Tablet, Laptop, Keyboard, Mouse, Headphones,
  Camera, Mic, Video, Image, FileText, Folder, Archive,
  Download as DownloadIcon, Upload, RefreshCw, Sync, X,
  Plus, Minus, ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Search, Filter, Sort, MoreVertical, MoreHorizontal, Grid,
  List, Map, Navigation, Compass, Globe, Globe2, MapPin,
  Flag, Shield, Lock, Key, CreditCard, DollarSign, Euro,
  Pound, Yen, Bitcoin, Wallet, ShoppingCart, Heart as HeartIcon,
  ThumbsUp, ThumbsDown, MessageCircle, Share2, Bookmark,
  BookmarkPlus, BookmarkMinus, Edit, Trash2, Copy, Cut,
  Paste, Move, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, Strikethrough, List as ListIcon,
  NumberedList, Quote, Code, Link, Image as ImageIcon,
  Table, BarChart, PieChart, LineChart, AreaChart, Scatter,
  Radar, Funnel, Map as MapIcon, FolderOpen, FolderPlus,
  FolderMinus, Save, RefreshCw as RefreshIcon, Home,
  User, Users as UsersIcon, UserPlus, UserMinus, Settings2,
  Bell, BellOff, Moon as MoonIcon, Sun as SunIcon,
  Wifi as WifiIcon, Battery as BatteryIcon, Volume2 as VolumeIcon
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart as RechartsAreaChart, Area, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// Types and Interfaces
export type LoadingType = 
  | 'spinner' | 'pulse' | 'dots' | 'bars' | 'ring' | 'heartbeat'
  | 'wave' | 'bounce' | 'fade' | 'skeleton' | 'progress' | 'percentage'
  | 'educational' | 'achievement' | 'milestone' | 'celebration'
  | 'adaptive' | 'intelligent' | 'contextual';

export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export type LoadingTheme = 'default' | 'educational' | 'achievement' | 'celebration' | 'calm' | 'energetic' | 'minimal' | 'glass';

export type LoadingColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'purple' | 'pink' | 'blue' | 'green' | 'orange' | 'yellow';

export interface LoadingMessage {
  title: string;
  description: string;
  tip?: string;
  motivation?: string;
  educational?: boolean;
}

export interface LoadingProgress {
  value: number; // 0-100
  estimatedTimeRemaining?: number; // seconds
  currentStep?: string;
  totalSteps?: number;
  completedSteps?: number;
}

export interface LoadingAnalytics {
  totalLoads: number;
  averageLoadTime: number;
  loadTimeDistribution: number[];
  userEngagement: {
    high: number;
    medium: number;
    low: number;
  };
  preferredTypes: { type: LoadingType; count: number }[];
  performanceMetrics: {
    quickLoads: number;
    slowLoads: number;
    abandonmentRate: number;
  };
  educationalImpact: {
    motivationalMessages: number;
    tipsShared: number;
    encouragementGiven: number;
  };
}

export interface LoadingPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  showProgress: boolean;
  showEstimatedTime: boolean;
  showEducationalMessages: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  colorScheme: 'auto' | 'light' | 'dark';
  educationalMode: boolean;
  motivationalMode: boolean;
}

// AI Service Integration
class LoadingAIService {
  private static instance: LoadingAIService;
  private openaiApiKey: string = import.meta.env.VITE_OPENAI_API_KEY || '';
  private geminiApiKey: string = import.meta.env.VITE_GEMINI_API_KEY || '';

  static getInstance(): LoadingAIService {
    if (!LoadingAIService.instance) {
      LoadingAIService.instance = new LoadingAIService();
    }
    return LoadingAIService.instance;
  }

  async optimizeLoadingExperience(context: {
    loadingType: LoadingType;
    estimatedTime: number;
    educationalContext?: string;
    userPreferences: LoadingPreferences;
  }): Promise<{
    recommendedType: LoadingType;
    messages: LoadingMessage[];
    optimizations: string[];
  }> {
    try {
      // AI optimization for loading experience
      const optimization = {
        recommendedType: this.selectOptimalType(context),
        messages: this.generateEducationalMessages(context),
        optimizations: this.generateOptimizationSuggestions(context),
      };

      return optimization;
    } catch (error) {
      console.warn('AI optimization failed, using fallback:', error);
      return this.fallbackOptimization(context);
    }
  }

  async generateEducationalMessages(duration: number, context?: string): Promise<LoadingMessage[]> {
    const messages: LoadingMessage[] = [
      {
        title: "Preparing Your Learning Journey",
        description: "Setting up an amazing educational experience just for you...",
        tip: "Did you know? The average person can focus for about 25 minutes before taking a break!",
        motivation: "Every moment of preparation brings you closer to success!"
      },
      {
        title: "Loading Knowledge & Wisdom",
        description: "Gathering the best educational content to enhance your learning...",
        tip: "Active learning techniques can improve retention by up to 75%!",
        motivation: "Your curiosity today shapes your expertise tomorrow!"
      },
      {
        title: "Optimizing Your Study Session",
        description: "Fine-tuning the perfect learning environment...",
        tip: "The Feynman Technique: Try explaining concepts in simple terms!",
        motivation: "Great learners are made, not born!"
      },
      {
        title: "Building Your Success Foundation",
        description: "Creating pathways for your educational achievements...",
        tip: "Spacing your study sessions can double your learning efficiency!",
        motivation: "Each step forward is a victory worth celebrating!"
      }
    ];

    return messages;
  }

  async predictOptimalType(userHistory: any, context: string): Promise<LoadingType> {
    // AI prediction for optimal loading type based on user history
    if (context.includes('achievement') || context.includes('celebration')) {
      return 'celebration';
    }
    if (context.includes('educational') || context.includes('learning')) {
      return 'educational';
    }
    if (userHistory?.prefersMinMotion) {
      return 'skeleton';
    }
    return 'spinner';
  }

  private selectOptimalType(context: any): LoadingType {
    const { estimatedTime, educationalContext } = context;
    
    if (estimatedTime > 10) return 'educational';
    if (estimatedTime < 3) return 'pulse';
    if (educationalContext) return 'educational';
    if (context.userPreferences?.motivationalMode) return 'achievement';
    
    return 'spinner';
  }

  private generateEducationalMessages(context: any): LoadingMessage[] {
    const { estimatedTime } = context;
    
    if (estimatedTime > 10) {
      return [
        {
          title: "Deep Learning Preparation",
          description: "Setting up comprehensive learning modules...",
          tip: "Deep learning works best when you understand the underlying concepts!",
          motivation: "Patience and persistence are the keys to mastery!"
        },
        {
          title: "Building Knowledge Networks",
          description: "Connecting concepts to create meaningful understanding...",
          tip: "Learning is more effective when you see the bigger picture!",
          motivation: "Your dedication to learning inspires others!"
        }
      ];
    }
    
    return [
      {
        title: "Quick Setup",
        description: "Getting everything ready...",
        tip: "Small steps lead to big achievements!",
        motivation: "You're doing great!"
      }
    ];
  }

  private generateOptimizationSuggestions(context: any): string[] {
    const suggestions = [];
    
    if (context.estimatedTime > 10) {
      suggestions.push("Consider showing educational content during longer loads");
      suggestions.push("Implement skeleton loading for better perceived performance");
    }
    
    suggestions.push("Optimize for reduced motion preferences");
    suggestions.push("Provide clear progress indicators");
    suggestions.push("Include motivational educational messages");
    
    return suggestions;
  }

  private fallbackOptimization(context: any): any {
    return {
      recommendedType: 'spinner' as LoadingType,
      messages: [
        {
          title: "Loading...",
          description: "Please wait while we prepare your content.",
          tip: "Great things take time to perfect!",
          motivation: "You're on the path to success!"
        }
      ],
      optimizations: [
        "Provide clear feedback",
        "Maintain consistent experience",
        "Respect user preferences"
      ]
    };
  }
}

// Loading State Management
interface LoadingState {
  id: string;
  type: LoadingType;
  progress?: LoadingProgress;
  messages: LoadingMessage[];
  startTime: number;
  estimatedDuration: number;
  educationalMode: boolean;
  analytics: {
    shown: boolean;
    completed: boolean;
    abandoned: boolean;
    duration: number;
  };
}

interface LoadingContextType {
  activeLoadings: LoadingState[];
  preferences: LoadingPreferences;
  analytics: LoadingAnalytics;
  aiService: LoadingAIService;
  
  // Core loading management
  startLoading: (config: {
    id?: string;
    type?: LoadingType;
    estimatedDuration?: number;
    educationalMode?: boolean;
    customMessage?: LoadingMessage;
  }) => string;
  updateProgress: (id: string, progress: LoadingProgress) => void;
  completeLoading: (id: string) => void;
  cancelLoading: (id: string) => void;
  
  // AI-powered features
  optimizeLoading: (context: any) => Promise<any>;
  generateEducationalMessage: (duration: number, context?: string) => Promise<LoadingMessage[]>;
  
  // Analytics and insights
  getAnalytics: () => LoadingAnalytics;
  exportAnalytics: (format: 'json' | 'csv' | 'pdf') => void;
  
  // Preferences management
  updatePreferences: (preferences: Partial<LoadingPreferences>) => void;
  resetPreferences: () => void;
}

// Context Creation
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Custom Hook for Animation Variants
const useAnimationVariants = (speed: 'slow' | 'normal' | 'fast' = 'normal') => {
  const duration = speed === 'slow' ? 2 : speed === 'fast' ? 0.5 : 1;
  
  return {
    fadeIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
      exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
    },
    slideIn: {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
    },
    bounceIn: {
      hidden: { opacity: 0, scale: 0.3, y: 20 },
      visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          duration: duration
        }
      },
      exit: { opacity: 0, scale: 0.3, y: 20, transition: { duration: 0.2 } }
    },
    pulse: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: duration,
          repeat: Infinity,
          repeatType: "reverse" as const
        }
      }
    },
    wave: {
      hidden: { opacity: 0, scaleY: 0 },
      visible: { 
        opacity: 1, 
        scaleY: 1,
        transition: {
          duration: duration,
          repeat: Infinity,
          repeatType: "reverse" as const,
          delay: 0.1
        }
      }
    },
    dots: {
      hidden: { opacity: 0, y: 0 },
      visible: { 
        opacity: 1, 
        y: -10,
        transition: {
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse" as const
        }
      }
    }
  };
};

// Enhanced Loading Components
interface SpinnerProps {
  size: LoadingSize;
  color: LoadingColor;
  speed: 'slow' | 'normal' | 'fast';
  theme: LoadingTheme;
  educational?: boolean;
  message?: LoadingMessage;
}

const ClassicSpinner: React.FC<SpinnerProps> = ({ size, color, speed, theme, educational, message }) => {
  const variants = useAnimationVariants(speed);
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
    '3xl': 'w-24 h-24',
    '4xl': 'w-32 h-32'
  };

  const colorClasses = {
    primary: 'border-primary-500 border-t-transparent',
    secondary: 'border-secondary-500 border-t-transparent',
    success: 'border-emerald-500 border-t-transparent',
    error: 'border-red-500 border-t-transparent',
    warning: 'border-yellow-500 border-t-transparent',
    info: 'border-blue-500 border-t-transparent',
    purple: 'border-purple-500 border-t-transparent',
    pink: 'border-pink-500 border-t-transparent',
    blue: 'border-blue-600 border-t-transparent',
    green: 'border-green-500 border-t-transparent',
    orange: 'border-orange-500 border-t-transparent',
    yellow: 'border-yellow-500 border-t-transparent'
  };

  const themeClasses = {
    default: '',
    educational: 'shadow-lg',
    achievement: 'shadow-xl ring-2 ring-yellow-400/50',
    celebration: 'shadow-2xl',
    calm: '',
    energetic: 'animate-pulse',
    minimal: 'border-2 border-current border-t-transparent',
    glass: 'glass-mild'
  };

  return (
    <motion.div
      variants={variants.bounceIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center space-y-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: speed === 'slow' ? 2 : speed === 'fast' ? 0.5 : 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`
          ${sizeClasses[size]} 
          border-4 
          ${colorClasses[color]}
          rounded-full
          ${themeClasses[theme]}
          ${educational ? 'ring-2 ring-blue-400/30' : ''}
        `}
      />
      
      {educational && message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center max-w-xs"
        >
          <h3 className="text-sm font-semibold text-white mb-1">{message.title}</h3>
          <p className="text-xs text-white/80 mb-2">{message.description}</p>
          {message.tip && (
            <p className="text-xs text-blue-400 italic">💡 {message.tip}</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

const PulseSpinner: React.FC<SpinnerProps> = ({ size, color, speed, theme }) => {
  const variants = useAnimationVariants(speed);
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
    '3xl': 'w-24 h-24',
    '4xl': 'w-32 h-32'
  };

  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    blue: 'bg-blue-600',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <motion.div
      variants={variants.pulse}
      initial="hidden"
      animate="visible"
      className="flex space-x-2"
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: speed === 'slow' ? 1.5 : speed === 'fast' ? 0.5 : 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
          className={`
            ${sizeClasses[size]} 
            ${colorClasses[color]}
            rounded-full
          `}
        />
      ))}
    </motion.div>
  );
};

const DotsSpinner: React.FC<SpinnerProps> = ({ size, color, speed }) => {
  const variants = useAnimationVariants(speed);
  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
    '2xl': 'w-6 h-6',
    '3xl': 'w-8 h-8',
    '4xl': 'w-10 h-10'
  };

  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    blue: 'bg-blue-600',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <motion.div
      variants={variants.dots}
      initial="hidden"
      animate="visible"
      className="flex space-x-1"
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -8, 0]
          }}
          transition={{
            duration: speed === 'slow' ? 1 : speed === 'fast' ? 0.4 : 0.6,
            repeat: Infinity,
            delay: i * 0.15
          }}
          className={`
            ${dotSizes[size]} 
            ${colorClasses[color]}
            rounded-full
          `}
        />
      ))}
    </motion.div>
  );
};

const BarsSpinner: React.FC<SpinnerProps> = ({ size, color, speed }) => {
  const variants = useAnimationVariants(speed);
  const barSizes = {
    xs: 'w-0.5',
    sm: 'w-1',
    md: 'w-1.5',
    lg: 'w-2',
    xl: 'w-2.5',
    '2xl': 'w-3',
    '3xl': 'w-4',
    '4xl': 'w-5'
  };

  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    blue: 'bg-blue-600',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500'
  };

  const heights = ['h-6', 'h-8', 'h-10', 'h-8', 'h-6', 'h-4', 'h-6', 'h-8'];

  return (
    <motion.div
      variants={variants.wave}
      initial="hidden"
      animate="visible"
      className="flex items-end space-x-1"
    >
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: heights[i],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: speed === 'slow' ? 1.5 : speed === 'fast' ? 0.6 : 1,
            repeat: Infinity,
            delay: i * 0.1
          }}
          className={`
            ${barSizes[size]} 
            ${colorClasses[color]}
            rounded-full
          `}
        />
      ))}
    </motion.div>
  );
};

const WaveSpinner: React.FC<SpinnerProps> = ({ size, color, speed }) => {
  const variants = useAnimationVariants(speed);
  const sizeClasses = {
    xs: 'w-6 h-3',
    sm: 'w-8 h-4',
    md: 'w-12 h-6',
    lg: 'w-16 h-8',
    xl: 'w-20 h-10',
    '2xl': 'w-24 h-12',
    '3xl': 'w-32 h-16',
    '4xl': 'w-40 h-20'
  };

  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    blue: 'bg-blue-600',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <motion.div
      variants={variants.wave}
      initial="hidden"
      animate="visible"
      className="flex items-center space-x-1"
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scaleY: [0.5, 1, 0.5],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: speed === 'slow' ? 1.5 : speed === 'fast' ? 0.6 : 1,
            repeat: Infinity,
            delay: i * 0.1
          }}
          className={`
            ${sizeClasses[size]}
            ${colorClasses[color]}
            rounded-full
          `}
        />
      ))}
    </motion.div>
  );
};

// Progress Bar Component
interface ProgressSpinnerProps extends SpinnerProps {
  progress?: LoadingProgress;
  showPercentage?: boolean;
  showTime?: boolean;
}

const ProgressSpinner: React.FC<ProgressSpinnerProps> = ({ 
  size, 
  color, 
  speed, 
  theme,
  progress,
  showPercentage = true,
  showTime = true
}) => {
  const variants = useAnimationVariants(speed);
  
  const barSizes = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
    '2xl': 'h-5',
    '3xl': 'h-6',
    '4xl': 'h-8'
  };

  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    success: 'from-emerald-500 to-emerald-600',
    error: 'from-red-500 to-red-600',
    warning: 'from-yellow-500 to-yellow-600',
    info: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    yellow: 'from-yellow-500 to-yellow-600'
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <motion.div
      variants={variants.slideIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-sm"
    >
      <div className="space-y-3">
        {/* Progress Bar */}
        <div className={`
          ${barSizes[size]} 
          bg-white/10 
          rounded-full 
          overflow-hidden
        `}>
          <motion.div
            className={`
              h-full 
              bg-gradient-to-r 
              ${colorClasses[color]}
              rounded-full
              transition-all duration-300
            `}
            initial={{ width: 0 }}
            animate={{ width: `${progress?.value || 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Progress Info */}
        <div className="flex items-center justify-between text-xs text-white/80">
          <div className="flex items-center space-x-2">
            {showPercentage && (
              <span className="font-medium">{Math.round(progress?.value || 0)}%</span>
            )}
            {progress?.currentStep && (
              <>
                <span>•</span>
                <span className="truncate max-w-24">{progress.currentStep}</span>
              </>
            )}
          </div>
          
          {showTime && progress?.estimatedTimeRemaining && (
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{formatTime(progress.estimatedTimeRemaining)}</span>
            </div>
          )}
        </div>
        
        {/* Step Progress */}
        {progress?.totalSteps && progress?.completedSteps !== undefined && (
          <div className="text-xs text-white/60">
            Step {progress.completedSteps} of {progress.totalSteps}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Skeleton Loader Component
interface SkeletonProps {
  lines?: number;
  avatar?: boolean;
  image?: boolean;
  width?: string;
  height?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonProps> = ({ 
  lines = 3, 
  avatar = false, 
  image = false,
  width = "w-full",
  height = "h-4",
  className = ""
}) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {avatar && (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
          </div>
        </div>
      )}
      
      {image && (
        <div className={`${width} ${height} bg-white/10 rounded-lg`} />
      )}
      
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className={`h-4 bg-white/10 rounded ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
          {i < lines - 1 && (
            <div className="h-4 bg-white/5 rounded w-full" />
          )}
        </div>
      ))}
    </div>
  );
};

// Educational Loader Component
interface EducationalLoaderProps extends SpinnerProps {
  messages: LoadingMessage[];
  messageIndex: number;
}

const EducationalLoader: React.FC<EducationalLoaderProps> = ({ 
  size, 
  color, 
  speed, 
  theme,
  messages,
  messageIndex
}) => {
  const variants = useAnimationVariants(speed);
  const currentMessage = messages[messageIndex % messages.length];

  return (
    <motion.div
      variants={variants.slideIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center space-y-6 max-w-md"
    >
      {/* Icon/Animation */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: speed === 'slow' ? 3 : speed === 'fast' ? 1.5 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 flex items-center justify-center"
      >
        <GraduationCap size={32} className="text-blue-400" />
      </motion.div>
      
      {/* Educational Message */}
      <motion.div
        key={messageIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <h3 className="text-lg font-semibold text-white">{currentMessage.title}</h3>
        <p className="text-sm text-white/80">{currentMessage.description}</p>
        
        {currentMessage.tip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-mild rounded-lg p-3 border border-blue-400/20"
          >
            <div className="flex items-start space-x-2">
              <Lightbulb size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-400 mb-1">Learning Tip</p>
                <p className="text-xs text-white/80">{currentMessage.tip}</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {currentMessage.motivation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-mild rounded-lg p-3 border border-green-400/20"
          >
            <div className="flex items-start space-x-2">
              <Heart size={16} className="text-pink-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-green-400 mb-1">Motivation</p>
                <p className="text-xs text-white/80 italic">{currentMessage.motivation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Achievement Loader Component
interface AchievementLoaderProps extends SpinnerProps {
  achievement?: string;
  level?: number;
}

const AchievementLoader: React.FC<AchievementLoaderProps> = ({ 
  size, 
  color, 
  speed, 
  theme,
  achievement,
  level
}) => {
  const variants = useAnimationVariants(speed);
  
  return (
    <motion.div
      variants={variants.bounceIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center space-y-4"
    >
      {/* Achievement Icon */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        <Trophy size={48} className="text-yellow-400" />
        <motion.div
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sparkles size={24} className="text-yellow-300" />
        </motion.div>
      </motion.div>
      
      {/* Achievement Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h3 className="text-lg font-bold text-white mb-1">Achievement Unlocked!</h3>
        <p className="text-sm text-yellow-400 mb-2">{achievement || 'Loading Excellence'}</p>
        {level && (
          <div className="flex items-center justify-center space-x-2">
            <Star size={16} className="text-yellow-400" />
            <span className="text-xs text-white/80">Level {level}</span>
          </div>
        )}
      </motion.div>
      
      {/* Progress Stars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex space-x-1"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          >
            <Star size={16} className="text-yellow-400" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

// Main Loading Spinner Component
interface LoadingSpinnerProps {
  // Core props
  type?: LoadingType;
  size?: LoadingSize;
  color?: LoadingColor;
  theme?: LoadingTheme;
  speed?: 'slow' | 'normal' | 'fast';
  
  // Progress props
  progress?: LoadingProgress;
  showPercentage?: boolean;
  showTime?: boolean;
  
  // Educational props
  educational?: boolean;
  messages?: LoadingMessage[];
  messageIndex?: number;
  
  // Achievement props
  achievement?: string;
  level?: number;
  
  // Custom content
  customComponent?: React.ReactNode;
  
  // Styling
  className?: string;
  containerClassName?: string;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  // Core props with defaults
  type = 'spinner',
  size = 'md',
  color = 'primary',
  theme = 'default',
  speed = 'normal',
  
  // Progress props
  progress,
  showPercentage = true,
  showTime = true,
  
  // Educational props
  educational = false,
  messages = [],
  messageIndex = 0,
  
  // Achievement props
  achievement,
  level,
  
  // Custom content
  customComponent,
  
  // Styling
  className = '',
  containerClassName = '',
  
  // Accessibility
  ariaLabel = 'Loading',
  role = 'status'
}) => {
  const variants = useAnimationVariants(speed);
  
  const renderSpinner = () => {
    if (customComponent) {
      return customComponent;
    }
    
    const commonProps = { size, color, speed, theme };
    
    switch (type) {
      case 'spinner':
        return <ClassicSpinner {...commonProps} educational={educational} message={messages[messageIndex]} />;
      
      case 'pulse':
        return <PulseSpinner {...commonProps} />;
      
      case 'dots':
        return <DotsSpinner {...commonProps} />;
      
      case 'bars':
        return <BarsSpinner {...commonProps} />;
      
      case 'wave':
        return <WaveSpinner {...commonProps} />;
      
      case 'progress':
      case 'percentage':
        return <ProgressSpinner {...commonProps} progress={progress} showPercentage={showPercentage} showTime={showTime} />;
      
      case 'skeleton':
        return <SkeletonLoader />;
      
      case 'educational':
        return <EducationalLoader {...commonProps} messages={messages} messageIndex={messageIndex} />;
      
      case 'achievement':
      case 'celebration':
        return <AchievementLoader {...commonProps} achievement={achievement} level={level} />;
      
      case 'adaptive':
      case 'intelligent':
      case 'contextual':
        // Dynamic selection based on context
        if (educational) return <EducationalLoader {...commonProps} messages={messages} messageIndex={messageIndex} />;
        if (progress) return <ProgressSpinner {...commonProps} progress={progress} showPercentage={showPercentage} showTime={showTime} />;
        return <ClassicSpinner {...commonProps} />;
      
      default:
        return <ClassicSpinner {...commonProps} />;
    }
  };
  
  return (
    <motion.div
      variants={variants.fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`
        flex items-center justify-center 
        ${containerClassName}
      `}
      role={role}
      aria-label={ariaLabel}
    >
      <div className={className}>
        {renderSpinner()}
      </div>
    </motion.div>
  );
};

// Loading Provider Component
interface LoadingProviderProps {
  children: React.ReactNode;
  preferences?: Partial<LoadingPreferences>;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ 
  children, 
  preferences = {} 
}) => {
  const [activeLoadings, setActiveLoadings] = useState<LoadingState[]>([]);
  const [userPreferences, setUserPreferences] = useState<LoadingPreferences>({
    reducedMotion: false,
    highContrast: false,
    showProgress: true,
    showEstimatedTime: true,
    showEducationalMessages: true,
    animationSpeed: 'normal',
    colorScheme: 'auto',
    educationalMode: true,
    motivationalMode: true,
    ...preferences
  });
  const [analytics, setAnalytics] = useState<LoadingAnalytics>({
    totalLoads: 0,
    averageLoadTime: 0,
    loadTimeDistribution: [],
    userEngagement: { high: 0, medium: 0, low: 0 },
    preferredTypes: [],
    performanceMetrics: { quickLoads: 0, slowLoads: 0, abandonmentRate: 0 },
    educationalImpact: { motivationalMessages: 0, tipsShared: 0, encouragementGiven: 0 }
  });
  
  const aiService = LoadingAIService.getInstance();
  
  const startLoading = useCallback((config: {
    id?: string;
    type?: LoadingType;
    estimatedDuration?: number;
    educationalMode?: boolean;
    customMessage?: LoadingMessage;
  }) => {
    const id = config.id || Math.random().toString(36).substr(2, 9);
    const loadingState: LoadingState = {
      id,
      type: config.type || 'spinner',
      messages: config.customMessage ? [config.customMessage] : [],
      startTime: Date.now(),
      estimatedDuration: config.estimatedDuration || 3000,
      educationalMode: config.educationalMode ?? userPreferences.educationalMode,
      analytics: {
        shown: true,
        completed: false,
        abandoned: false,
        duration: 0
      }
    };
    
    setActiveLoadings(prev => [...prev, loadingState]);
    setAnalytics(prev => ({
      ...prev,
      totalLoads: prev.totalLoads + 1
    }));
    
    return id;
  }, [userPreferences.educationalMode]);
  
  const updateProgress = useCallback((id: string, progress: LoadingProgress) => {
    setActiveLoadings(prev => prev.map(loading => 
      loading.id === id ? { ...loading, progress } : loading
    ));
  }, []);
  
  const completeLoading = useCallback((id: string) => {
    setActiveLoadings(prev => {
      const loading = prev.find(l => l.id === id);
      if (loading) {
        const duration = Date.now() - loading.startTime;
        setAnalytics(prevAnalytics => ({
          ...prevAnalytics,
          averageLoadTime: (prevAnalytics.averageLoadTime + duration) / 2
        }));
      }
      return prev.filter(loading => loading.id !== id);
    });
  }, []);
  
  const cancelLoading = useCallback((id: string) => {
    setActiveLoadings(prev => prev.filter(loading => loading.id !== id));
  }, []);
  
  const optimizeLoading = useCallback(async (context: any) => {
    return await aiService.optimizeLoadingExperience({
      ...context,
      userPreferences
    });
  }, [userPreferences]);
  
  const generateEducationalMessage = useCallback(async (duration: number, context?: string) => {
    return await aiService.generateEducationalMessages(duration, context);
  }, []);
  
  const getAnalytics = useCallback(() => analytics, [analytics]);
  
  const exportAnalytics = useCallback((format: 'json' | 'csv' | 'pdf') => {
    const data = {
      analytics,
      preferences: userPreferences,
      exportDate: new Date().toISOString()
    };
    
    const filename = `loading-analytics-${new Date().toISOString().split('T')[0]}`;
    
    switch (format) {
      case 'json':
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        URL.revokeObjectURL(url);
        break;
      
      default:
        console.log(`${format.toUpperCase()} export feature coming soon!`);
    }
  }, [analytics, userPreferences]);
  
  const updatePreferences = useCallback((preferences: Partial<LoadingPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...preferences }));
  }, []);
  
  const resetPreferences = useCallback(() => {
    setUserPreferences({
      reducedMotion: false,
      highContrast: false,
      showProgress: true,
      showEstimatedTime: true,
      showEducationalMessages: true,
      animationSpeed: 'normal',
      colorScheme: 'auto',
      educationalMode: true,
      motivationalMode: true
    });
  }, []);
  
  const contextValue: LoadingContextType = {
    activeLoadings,
    preferences: userPreferences,
    analytics,
    aiService,
    
    startLoading,
    updateProgress,
    completeLoading,
    cancelLoading,
    
    optimizeLoading,
    generateEducationalMessage,
    
    getAnalytics,
    exportAnalytics,
    
    updatePreferences,
    resetPreferences
  };
  
  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      
      {/* Active Loading States */}
      <AnimatePresence>
        {activeLoadings.map(loading => (
          <motion.div
            key={loading.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong rounded-2xl p-8 max-w-md w-full"
            >
              <LoadingSpinner
                type={loading.type}
                educational={loading.educationalMode}
                messages={loading.messages}
                progress={loading.progress}
                className="w-full"
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
};

// Hook for loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Convenience hooks for different loading types
export const useEducationalLoading = () => {
  const { startLoading, generateEducationalMessage } = useLoading();
  
  return useCallback(async (estimatedDuration: number) => {
    const messages = await generateEducationalMessage(estimatedDuration);
    return startLoading({
      type: 'educational',
      estimatedDuration,
      educationalMode: true,
      customMessage: messages[0]
    });
  }, [startLoading, generateEducationalMessage]);
};

export const useProgressLoading = () => {
  const { startLoading, updateProgress } = useLoading();
  
  return useCallback((estimatedDuration: number) => {
    const id = startLoading({
      type: 'progress',
      estimatedDuration
    });
    
    return {
      id,
      updateProgress: (progress: LoadingProgress) => updateProgress(id, progress)
    };
  }, [startLoading, updateProgress]);
};

export const useAchievementLoading = () => {
  const { startLoading } = useLoading();
  
  return useCallback((achievement: string, level?: number) => {
    return startLoading({
      type: 'achievement',
      educationalMode: false,
      customMessage: {
        title: 'Achievement Unlocked!',
        description: achievement,
        motivation: `Level ${level || 1} achieved!`
      }
    });
  }, [startLoading]);
};

// Export all types and interfaces
export type {
  LoadingProgress,
  LoadingMessage,
  LoadingAnalytics,
  LoadingPreferences,
  LoadingState
};

// Default export
export default LoadingSpinner;