// JAC Learning Platform - Enterprise Badge Intelligence Platform by Cavin Otieno
// Comprehensive badge system with AI optimization, analytics, and educational features

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from './useAnalytics';
import { useAI } from './useAI';
import { usePreferences } from './usePreferences';

// Type definitions
interface BadgeConfig {
  id: string;
  name: string;
  description: string;
  icon?: string;
  variant: BadgeVariant;
  animation: BadgeAnimation;
  accessibility: BadgeAccessibility;
  analytics: BadgeAnalytics;
  aiOptimization: BadgeAIOptimization;
  educational: BadgeEducational;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  animation?: BadgeAnimation;
  glow?: boolean;
  pulse?: boolean;
  hoverEffect?: boolean;
  clickable?: boolean;
  status?: BadgeStatus;
  progress?: number;
  score?: number;
  timeSpent?: number;
  streak?: number;
  achievements?: string[];
  learningPath?: string;
  difficulty?: BadgeDifficulty;
  subject?: string;
  level?: BadgeLevel;
  experience?: number;
  earned?: boolean;
  locked?: boolean;
  premium?: boolean;
  collaborative?: boolean;
  aiRecommended?: boolean;
  performance?: BadgePerformance;
  context?: BadgeContext;
  personalization?: BadgePersonalization;
  educationalContent?: EducationalContent;
  interactive?: boolean;
  animated?: boolean;
  soundEnabled?: boolean;
  hapticFeedback?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onHover?: () => void;
  onEarn?: (badge: BadgeConfig) => void;
  onShare?: (badge: BadgeConfig) => void;
  onProgress?: (progress: number) => void;
  ariaLabel?: string;
  testId?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  success?: string;
  warning?: string;
  info?: string;
}

type BadgeVariant = 
  | 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  | 'gradient' | 'neon' | 'metallic' | 'holographic' | '3d' | 'floating' | 'glass'
  | 'solid' | 'outline' | 'filled' | 'dual-tone' | 'prismatic' | 'crystal' | 'chroma'
  | 'achievement' | 'progress' | 'streak' | 'mastery' | 'excellence' | 'expert'
  | 'learning' | 'quiz' | 'tutorial' | 'interactive' | 'collaborative' | 'premium'
  | 'limited' | 'exclusive' | 'seasonal' | 'event' | 'milestone' | 'celebration'
  | 'educational' | 'certification' | 'competency' | 'skill' | 'badge'
  | 'social' | 'community' | 'contributor' | 'leader' | 'mentor' | 'scholar';

type BadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

type BadgeShape = 'rounded' | 'pill' | 'square' | 'diamond' | 'hexagon' | 'star' | 'circle' | 'custom';

type BadgeAnimation = 'none' | 'fade' | 'slide' | 'bounce' | 'pulse' | 'glow' | 'shimmer' | 'twinkle' | 'float' | 'rotate' | 'scale' | 'magnetic' | 'particle' | 'aurora' | 'matrix' | 'hologram';

type BadgeStatus = 'earned' | 'locked' | 'progress' | 'pending' | 'expired' | 'active' | 'inactive' | 'featured' | 'trending' | 'rare' | 'epic' | 'legendary';

type BadgeDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master' | 'legendary';

type BadgeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface BadgeAccessibility {
  ariaLabel: string;
  ariaDescribedBy?: string;
  role: string;
  tabIndex: number;
  focusable: boolean;
  screenReader: boolean;
  highContrast: boolean;
  colorBlind: boolean;
}

interface BadgeAnalytics {
  tracking: boolean;
  events: string[];
  goals: string[];
  conversions: string[];
  custom: Record<string, any>;
}

interface BadgeAIOptimization {
  enabled: boolean;
  provider: 'openai' | 'gemini' | 'custom';
  model: string;
  personalization: boolean;
  recommendations: boolean;
  context: boolean;
  learning: boolean;
  prediction: boolean;
  optimization: boolean;
}

interface BadgeEducational {
  type: 'achievement' | 'progress' | 'skill' | 'competency' | 'certification' | 'milestone' | 'learning_path' | 'quiz' | 'tutorial' | 'interactive';
  subject?: string;
  difficulty?: BadgeDifficulty;
  level?: BadgeLevel;
  prerequisites?: string[];
  learningObjectives?: string[];
  assessmentCriteria?: string[];
  feedback?: string;
  hints?: string[];
  resources?: string[];
  nextSteps?: string[];
  mastery: boolean;
  adaptive: boolean;
  gamified: boolean;
  social: boolean;
}

interface BadgePerformance {
  loadTime: number;
  renderTime: number;
  animationFPS: number;
  memoryUsage: number;
  batteryUsage: number;
  networkRequests: number;
  cacheHit: number;
  errorRate: number;
}

interface BadgeContext {
  device: string;
  browser: string;
  viewport: {
    width: number;
    height: number;
  };
  theme: 'light' | 'dark' | 'auto';
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
  };
  userAgent: string;
  timestamp: number;
  location?: string;
  session: string;
}

interface BadgePersonalization {
  userPreferences: Record<string, any>;
  behaviorPatterns: Record<string, any>;
  learningStyle: string;
  pace: 'slow' | 'normal' | 'fast' | 'adaptive';
  engagement: 'low' | 'medium' | 'high' | 'intense';
  motivation: 'intrinsic' | 'extrinsic' | 'social' | 'achievement' | 'mastery';
  collaboration: boolean;
  competition: boolean;
  customization: boolean;
}

interface EducationalContent {
  title: string;
  description: string;
  objectives: string[];
  activities: string[];
  assessments: string[];
  resources: string[];
  examples: string[];
  demonstrations: string[];
  practice: string[];
  reflection: string[];
  mastery: string[];
  nextLevel: string;
  prerequisites: string[];
  timeToComplete: number;
  difficulty: BadgeDifficulty;
  skills: string[];
  competencies: string[];
  knowledge: string[];
  understanding: string[];
  application: string[];
  analysis: string[];
  synthesis: string[];
  evaluation: string[];
}

// Badge configuration presets
const BADGE_PRESETS: Record<string, Partial<BadgeConfig>> = {
  default: {
    id: 'default',
    name: 'Default Badge',
    description: 'Basic badge component',
    variant: 'default',
    animation: 'fade',
    accessibility: {
      ariaLabel: 'Default badge',
      role: 'status',
      tabIndex: 0,
      focusable: true,
      screenReader: true,
      highContrast: true,
      colorBlind: true
    },
    analytics: {
      tracking: true,
      events: ['view', 'click'],
      goals: ['engagement'],
      conversions: ['interaction']
    },
    aiOptimization: {
      enabled: false,
      provider: 'openai',
      model: 'gpt-4',
      personalization: false,
      recommendations: false,
      context: false,
      learning: false,
      prediction: false,
      optimization: false
    },
    educational: {
      type: 'achievement',
      mastery: false,
      adaptive: false,
      gamified: false,
      social: false
    }
  },

  achievement: {
    id: 'achievement',
    name: 'Achievement Badge',
    description: 'User achievement indicator',
    variant: 'achievement',
    animation: 'bounce',
    accessibility: {
      ariaLabel: 'Achievement badge',
      role: 'img',
      tabIndex: 0,
      focusable: true,
      screenReader: true,
      highContrast: true,
      colorBlind: true
    },
    analytics: {
      tracking: true,
      events: ['view', 'earn', 'share'],
      goals: ['engagement', 'achievement'],
      conversions: ['badge_earned']
    },
    aiOptimization: {
      enabled: true,
      provider: 'openai',
      model: 'gpt-4',
      personalization: true,
      recommendations: true,
      context: true,
      learning: true,
      prediction: true,
      optimization: true
    },
    educational: {
      type: 'achievement',
      mastery: true,
      adaptive: true,
      gamified: true,
      social: true
    }
  },

  progress: {
    id: 'progress',
    name: 'Progress Badge',
    description: 'Learning progress indicator',
    variant: 'progress',
    animation: 'pulse',
    accessibility: {
      ariaLabel: 'Progress badge',
      role: 'progressbar',
      tabIndex: 0,
      focusable: true,
      screenReader: true,
      highContrast: true,
      colorBlind: true
    },
    analytics: {
      tracking: true,
      events: ['view', 'progress', 'update'],
      goals: ['progress', 'completion'],
      conversions: ['progress_made']
    },
    aiOptimization: {
      enabled: true,
      provider: 'openai',
      model: 'gpt-4',
      personalization: true,
      recommendations: true,
      context: true,
      learning: true,
      prediction: true,
      optimization: true
    },
    educational: {
      type: 'progress',
      mastery: true,
      adaptive: true,
      gamified: true,
      social: false
    }
  },

  streak: {
    id: 'streak',
    name: 'Streak Badge',
    description: 'Learning streak indicator',
    variant: 'streak',
    animation: 'glow',
    accessibility: {
      ariaLabel: 'Learning streak badge',
      role: 'status',
      tabIndex: 0,
      focusable: true,
      screenReader: true,
      highContrast: true,
      colorBlind: true
    },
    analytics: {
      tracking: true,
      events: ['view', 'streak', 'break'],
      goals: ['consistency', 'engagement'],
      conversions: ['streak_maintained']
    },
    aiOptimization: {
      enabled: true,
      provider: 'openai',
      model: 'gpt-4',
      personalization: true,
      recommendations: true,
      context: true,
      learning: true,
      prediction: true,
      optimization: true
    },
    educational: {
      type: 'progress',
      mastery: true,
      adaptive: true,
      gamified: true,
      social: true
    }
  },

  mastery: {
    id: 'mastery',
    name: 'Mastery Badge',
    description: 'Subject mastery indicator',
    variant: 'mastery',
    animation: 'aurora',
    accessibility: {
      ariaLabel: 'Mastery badge',
      role: 'img',
      tabIndex: 0,
      focusable: true,
      screenReader: true,
      highContrast: true,
      colorBlind: true
    },
    analytics: {
      tracking: true,
      events: ['view', 'mastery', 'celebrate'],
      goals: ['expertise', 'achievement'],
      conversions: ['mastery_achieved']
    },
    aiOptimization: {
      enabled: true,
      provider: 'openai',
      model: 'gpt-4',
      personalization: true,
      recommendations: true,
      context: true,
      learning: true,
      prediction: true,
      optimization: true
    },
    educational: {
      type: 'certification',
      mastery: true,
      adaptive: true,
      gamified: true,
      social: true
    }
  }
};

// Utility functions
const getVariantClasses = (variant: BadgeVariant, theme: 'light' | 'dark' = 'light'): Record<string, string> => {
  const baseClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-200 text-gray-900',
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    gradient: 'bg-gradient-to-r from-purple-400 to-pink-400 text-white',
    neon: 'bg-black text-green-400 border border-green-400 shadow-lg shadow-green-400/50',
    metallic: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 text-gray-900 shadow-md',
    holographic: 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white',
    '3d': 'bg-gray-800 text-white shadow-lg transform perspective-1000 rotateX-12',
    floating: 'bg-white text-gray-800 border border-gray-200 shadow-lg hover:shadow-xl',
    glass: 'bg-white/20 backdrop-blur-md text-gray-900 border border-white/30',
    solid: 'bg-gray-800 text-white',
    outline: 'border-2 border-gray-800 text-gray-800 bg-transparent',
    filled: 'bg-gray-100 text-gray-900',
    'dual-tone': 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
    prismatic: 'bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 text-white',
    crystal: 'bg-white text-gray-800 border-2 border-gray-300 shadow-lg',
    chroma: 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-white',
    achievement: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg',
    progress: 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white',
    streak: 'bg-gradient-to-r from-green-400 to-blue-500 text-white',
    mastery: 'bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white',
    excellence: 'bg-gradient-to-r from-yellow-300 to-yellow-600 text-black',
    expert: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
    learning: 'bg-gradient-to-r from-green-300 to-blue-400 text-white',
    quiz: 'bg-gradient-to-r from-purple-300 to-indigo-400 text-white',
    tutorial: 'bg-gradient-to-r from-pink-300 to-rose-400 text-white',
    interactive: 'bg-gradient-to-r from-cyan-300 to-teal-400 text-white',
    collaborative: 'bg-gradient-to-r from-orange-300 to-red-400 text-white',
    premium: 'bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900',
    limited: 'bg-gradient-to-r from-red-300 to-pink-400 text-white',
    exclusive: 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white',
    seasonal: 'bg-gradient-to-r from-orange-400 to-red-500 text-white',
    event: 'bg-gradient-to-r from-blue-300 to-purple-400 text-white',
    milestone: 'bg-gradient-to-r from-green-300 to-teal-400 text-white',
    celebration: 'bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 text-white',
    certification: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
    competency: 'bg-gradient-to-r from-green-400 to-cyan-500 text-white',
    skill: 'bg-gradient-to-r from-orange-400 to-red-500 text-white',
    social: 'bg-gradient-to-r from-pink-400 to-rose-500 text-white',
    community: 'bg-gradient-to-r from-purple-400 to-pink-400 text-white',
    contributor: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
    leader: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
    mentor: 'bg-gradient-to-r from-green-400 to-teal-500 text-white',
    scholar: 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
  };

  if (theme === 'dark') {
    const darkVariants = {
      default: 'bg-gray-800 text-gray-200',
      primary: 'bg-blue-800 text-blue-200',
      secondary: 'bg-gray-700 text-gray-100',
      info: 'bg-blue-800 text-blue-200',
      success: 'bg-green-800 text-green-200',
      warning: 'bg-yellow-800 text-yellow-200',
      error: 'bg-red-800 text-red-200',
      gradient: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
      neon: 'bg-black text-cyan-400 border border-cyan-400 shadow-lg shadow-cyan-400/50',
      metallic: 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 text-gray-100 shadow-md',
      holographic: 'bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white',
      '3d': 'bg-gray-900 text-white shadow-lg transform perspective-1000 rotateX-12',
      floating: 'bg-gray-800 text-gray-100 border border-gray-600 shadow-lg hover:shadow-xl',
      glass: 'bg-gray-800/20 backdrop-blur-md text-gray-100 border border-gray-600/30'
    };
    
    return { ...baseClasses, ...darkVariants };
  }

  return baseClasses;
};

const getSizeClasses = (size: BadgeSize): string => {
  const sizeMap = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-sm',
    md: 'px-2.5 py-1.5 text-base',
    lg: 'px-3 py-2 text-lg',
    xl: 'px-3.5 py-2.5 text-xl',
    '2xl': 'px-4 py-3 text-2xl',
    '3xl': 'px-5 py-4 text-3xl',
    '4xl': 'px-6 py-5 text-4xl'
  };
  
  return sizeMap[size] || sizeMap.md;
};

const getShapeClasses = (shape: BadgeShape): string => {
  const shapeMap = {
    rounded: 'rounded-md',
    pill: 'rounded-full',
    square: 'rounded-none',
    diamond: 'rotate-45',
    hexagon: 'clip-path-hexagon',
    star: 'clip-path-star',
    circle: 'rounded-full',
    custom: ''
  };
  
  return shapeMap[shape] || shapeMap.rounded;
};

const getAnimationClasses = (animation: BadgeAnimation, isAnimating: boolean): string => {
  if (!isAnimating) return '';
  
  const animationMap = {
    none: '',
    fade: 'animate-fade',
    slide: 'animate-slide',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    glow: 'animate-glow',
    shimmer: 'animate-shimmer',
    twinkle: 'animate-twinkle',
    float: 'animate-float',
    rotate: 'animate-spin',
    scale: 'animate-scale',
    magnetic: 'animate-magnetic',
    particle: 'animate-particle',
    aurora: 'animate-aurora',
    matrix: 'animate-matrix',
    hologram: 'animate-hologram'
  };
  
  return animationMap[animation] || '';
};

const getStatusClasses = (status: BadgeStatus): string => {
  const statusMap = {
    earned: 'opacity-100',
    locked: 'opacity-50 grayscale',
    progress: 'opacity-75',
    pending: 'opacity-80',
    expired: 'opacity-60',
    active: 'opacity-100',
    inactive: 'opacity-70',
    featured: 'ring-2 ring-yellow-400',
    trending: 'ring-2 ring-blue-400',
    rare: 'ring-2 ring-purple-400',
    epic: 'ring-2 ring-red-400',
    legendary: 'ring-2 ring-yellow-300 animate-pulse'
  };
  
  return statusMap[status] || '';
};

// Main Badge component
const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  shape = 'rounded',
  animation = 'none',
  glow = false,
  pulse = false,
  hoverEffect = false,
  clickable = false,
  status = 'earned',
  progress = 0,
  score = 0,
  timeSpent = 0,
  streak = 0,
  achievements = [],
  learningPath,
  difficulty,
  subject,
  level,
  experience = 0,
  earned = true,
  locked = false,
  premium = false,
  collaborative = false,
  aiRecommended = false,
  performance,
  context,
  personalization,
  educationalContent,
  interactive = false,
  animated = false,
  soundEnabled = false,
  hapticFeedback = false,
  className = '',
  style,
  onClick,
  onHover,
  onEarn,
  onShare,
  onProgress,
  ariaLabel,
  testId,
  disabled = false,
  loading = false,
  error,
  success,
  warning,
  info,
  ...props
}) => {
  // Hooks
  const analytics = useAnalytics();
  const ai = useAI();
  const preferences = usePreferences();
  
  // State
  const [isAnimating, setIsAnimating] = useState(animated);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [progressValue, setProgressValue] = useState(progress);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);

  // Refs
  const badgeRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<number>(progressValue);

  // Memoized values
  const currentTheme = useMemo(() => preferences.theme || 'light', [preferences.theme]);
  const isDark = currentTheme === 'dark';
  
  const variantClasses = useMemo(() => 
    getVariantClasses(variant, currentTheme), 
    [variant, currentTheme]
  );
  
  const sizeClasses = useMemo(() => getSizeClasses(size), [size]);
  const shapeClasses = useMemo(() => getShapeClasses(shape), [shape]);
  const animationClasses = useMemo(() => 
    getAnimationClasses(animation, isAnimating), 
    [animation, isAnimating]
  );
  const statusClasses = useMemo(() => getStatusClasses(status), [status]);

  const baseClasses = useMemo(() => `
    inline-flex items-center font-medium transition-all duration-200
    ${variantClasses}
    ${sizeClasses}
    ${shapeClasses}
    ${animationClasses}
    ${statusClasses}
    ${glow ? 'shadow-lg' : ''}
    ${pulse ? 'animate-pulse' : ''}
    ${hoverEffect ? 'hover:scale-105 hover:shadow-lg cursor-pointer' : ''}
    ${clickable ? 'cursor-pointer hover:bg-opacity-80' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${premium ? 'ring-1 ring-yellow-400 ring-opacity-50' : ''}
    ${aiRecommended ? 'ring-1 ring-cyan-400 ring-opacity-50' : ''}
    ${collaborative ? 'ring-1 ring-blue-400 ring-opacity-50' : ''}
    ${isAnimating ? 'animate-pulse' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' '), [
    variantClasses, sizeClasses, shapeClasses, animationClasses, statusClasses,
    glow, pulse, hoverEffect, clickable, disabled, premium, aiRecommended, 
    collaborative, isAnimating, className
  ]);

  // Event handlers
  const handleClick = useCallback((event: React.MouseEvent) => {
    if (disabled || loading) return;
    
    setClicked(true);
    setTimeout(() => setClicked(false), 150);

    // Analytics tracking
    analytics.track('badge_click', {
      variant,
      size,
      status,
      progress: progressValue,
      score,
      timeSpent,
      streak,
      achievements: achievements.length,
      subject,
      level,
      experience
    });

    // AI optimization
    if (ai.isEnabled && !isProcessing) {
      setIsProcessing(true);
      ai.optimize({
        component: 'badge',
        action: 'click',
        context: {
          variant,
          size,
          status,
          progress: progressValue,
          score,
          subject,
          level,
          userPreferences: preferences
        }
      }).then((result) => {
        if (result.recommendation) {
          setAiRecommendation(result.recommendation);
        }
        setIsProcessing(false);
      }).catch(() => {
        setIsProcessing(false);
      });
    }

    // Haptic feedback
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Sound effect
    if (soundEnabled) {
      const audio = new Audio('/sounds/badge-click.mp3');
      audio.play().catch(() => {});
    }

    // Call user handler
    if (onClick) {
      onClick();
    }
  }, [
    disabled, loading, analytics, ai, preferences, variant, size, status,
    progressValue, score, timeSpent, streak, achievements, subject, level, experience,
    hapticFeedback, soundEnabled, onClick, isProcessing
  ]);

  const handleHover = useCallback(() => {
    if (disabled || loading) return;
    
    setHovered(true);

    // Analytics tracking
    analytics.track('badge_hover', {
      variant,
      size,
      status,
      progress: progressValue,
      score
    });

    // AI context awareness
    if (ai.isEnabled) {
      ai.analyze({
        component: 'badge',
        action: 'hover',
        context: {
          variant,
          size,
          status,
          progress: progressValue,
          userPreferences: preferences
        }
      });
    }

    if (onHover) {
      onHover();
    }
  }, [
    disabled, loading, analytics, ai, preferences, variant, size, status,
    progressValue, score, onHover
  ]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  // Progress effect
  useEffect(() => {
    if (progress !== progressValue) {
      setProgressValue(progress);
      progressRef.current = progress;
      
      if (onProgress) {
        onProgress(progress);
      }

      // Analytics tracking
      analytics.track('badge_progress', {
        variant,
        size,
        status,
        progress,
        score,
        timeSpent
      });
    }
  }, [progress, progressValue, variant, size, status, score, timeSpent, onProgress, analytics]);

  // Achievement notification
  useEffect(() => {
    if (progress === 100 && progressRef.current < 100) {
      setNotification({
        type: 'success',
        message: 'Badge achievement unlocked!'
      });

      analytics.track('badge_earned', {
        variant,
        size,
        status,
        score,
        timeSpent,
        streak,
        subject,
        level,
        experience
      });

      if (onEarn) {
        onEarn({
          id: 'badge-achievement',
          name: 'Badge Achievement',
          description: 'Badge successfully earned',
          variant,
          animation,
          accessibility: {
            ariaLabel: 'Badge earned notification',
            role: 'status',
            tabIndex: 0,
            focusable: true,
            screenReader: true,
            highContrast: true,
            colorBlind: true
          },
          analytics: {
            tracking: true,
            events: ['earned'],
            goals: ['achievement'],
            conversions: ['badge_earned']
          },
          aiOptimization: {
            enabled: true,
            provider: 'openai',
            model: 'gpt-4',
            personalization: true,
            recommendations: true,
            context: true,
            learning: true,
            prediction: true,
            optimization: true
          },
          educational: {
            type: 'achievement',
            mastery: true,
            adaptive: true,
            gamified: true,
            social: true
          }
        });
      }

      // Sound effect
      if (soundEnabled) {
        const audio = new Audio('/sounds/badge-earned.mp3');
        audio.play().catch(() => {});
      }

      // Clear notification
      setTimeout(() => setNotification(null), 3000);
    }
  }, [progress, progressRef, variant, size, status, score, timeSpent, streak, subject, level, experience, analytics, onEarn, soundEnabled, animation]);

  // Error notification
  useEffect(() => {
    if (error) {
      setNotification({
        type: 'error',
        message: error
      });
      setTimeout(() => setNotification(null), 5000);
    }
  }, [error]);

  // Success notification
  useEffect(() => {
    if (success) {
      setNotification({
        type: 'success',
        message: success
      });
      setTimeout(() => setNotification(null), 3000);
    }
  }, [success]);

  // Loading animation
  useEffect(() => {
    if (loading) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [loading]);

  // Animation variants
  const animationVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  // Render progress indicator
  const renderProgress = () => {
    if (status === 'progress' && progress < 100) {
      return (
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-inherit flex items-center justify-center">
          <div className="w-3/4 bg-gray-300 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressValue}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  // Render score indicator
  const renderScore = () => {
    if (score > 0) {
      return (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-xs rounded-full flex items-center justify-center font-bold text-gray-900">
          {score}
        </div>
      );
    }
    return null;
  };

  // Render time indicator
  const renderTimeSpent = () => {
    if (timeSpent > 0) {
      const hours = Math.floor(timeSpent / 3600);
      const minutes = Math.floor((timeSpent % 3600) / 60);
      const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      
      return (
        <div className="absolute -bottom-1 -left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          {timeText}
        </div>
      );
    }
    return null;
  };

  // Render streak indicator
  const renderStreak = () => {
    if (streak > 0) {
      return (
        <div className="absolute -top-1 -left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
          {streak}
        </div>
      );
    }
    return null;
  };

  // Render achievement indicators
  const renderAchievements = () => {
    if (achievements.length > 0) {
      return (
        <div className="absolute -bottom-2 -right-2 flex space-x-1">
          {achievements.slice(0, 3).map((achievement, index) => (
            <div
              key={index}
              className="w-3 h-3 bg-yellow-400 rounded-full border border-white"
              title={achievement}
            />
          ))}
          {achievements.length > 3 && (
            <div className="w-3 h-3 bg-gray-400 rounded-full border border-white text-xs flex items-center justify-center text-white">
              +
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Render notification
  const renderNotification = () => {
    if (!notification) return null;

    const notificationClasses = {
      success: 'bg-green-100 border-green-400 text-green-800',
      error: 'bg-red-100 border-red-400 text-red-800',
      warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
      info: 'bg-blue-100 border-blue-400 text-blue-800'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full px-3 py-2 rounded-md border ${notificationClasses[notification.type]} text-sm font-medium z-50`}
      >
        {notification.message}
      </motion.div>
    );
  };

  // Render AI recommendation
  const renderAIRecommendation = () => {
    if (!aiRecommendation) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-cyan-100 border border-cyan-400 text-cyan-800 text-sm rounded-md max-w-xs z-50"
      >
        <div className="flex items-center space-x-2">
          <span className="text-cyan-600">🤖</span>
          <span>{aiRecommendation}</span>
        </div>
      </motion.div>
    );
  };

  // Main render
  return (
    <motion.span
      ref={badgeRef}
      className={baseClasses}
      style={style}
      variants={animationVariants}
      initial="initial"
      animate={clicked ? "tap" : "animate"}
      whileHover={hovered ? "hover" : undefined}
      onClick={handleClick}
      onHoverStart={handleHover}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel || `Badge: ${children}`}
      data-testid={testId}
      role="img"
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      <span className="relative">
        {children}
        
        {/* Progress indicator */}
        {renderProgress()}
        
        {/* Score indicator */}
        {renderScore()}
        
        {/* Time spent indicator */}
        {renderTimeSpent()}
        
        {/* Streak indicator */}
        {renderStreak()}
        
        {/* Achievement indicators */}
        {renderAchievements()}
        
        {/* Status indicators */}
        {locked && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-inherit flex items-center justify-center">
            <span className="text-white text-xs">🔒</span>
          </div>
        )}
        
        {premium && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white">
            <span className="sr-only">Premium badge</span>
          </div>
        )}
        
        {collaborative && (
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-400 rounded-full border border-white">
            <span className="sr-only">Collaborative badge</span>
          </div>
        )}
      </span>

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-inherit">
          <motion.div
            className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      {/* Notification */}
      {renderNotification()}

      {/* AI Recommendation */}
      {renderAIRecommendation()}
    </motion.span>
  );
};

export default Badge;
export type { BadgeProps, BadgeVariant, BadgeSize, BadgeShape, BadgeAnimation, BadgeStatus, BadgeDifficulty, BadgeLevel, BadgeConfig, BadgeAccessibility, BadgeAnalytics, BadgeAIOptimization, BadgeEducational, BadgePerformance, BadgeContext, BadgePersonalization, EducationalContent };