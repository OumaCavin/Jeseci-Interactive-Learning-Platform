// JAC Learning Platform - Enterprise Avatar Intelligence Platform by Cavin Otieno
// Comprehensive avatar system with AI optimization, analytics, and educational features

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from './useAnalytics';
import { useAI } from './useAI';
import { usePreferences } from './usePreferences';

// Type definitions
interface AvatarConfig {
  id: string;
  name: string;
  description: string;
  type: AvatarType;
  variant: AvatarVariant;
  animation: AvatarAnimation;
  accessibility: AvatarAccessibility;
  analytics: AvatarAnalytics;
  aiOptimization: AvatarAIOptimization;
  educational: AvatarEducational;
}

interface AvatarProps {
  children?: React.ReactNode;
  src?: string;
  alt?: string;
  name?: string;
  email?: string;
  id?: string;
  type?: AvatarType;
  variant?: AvatarVariant;
  size?: AvatarSize;
  shape?: AvatarShape;
  animation?: AvatarAnimation;
  status?: AvatarStatus;
  presence?: AvatarPresence;
  initials?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  gradient?: boolean;
  glow?: boolean;
  shadow?: AvatarShadow;
  border?: AvatarBorder;
  fallbackSrc?: string;
  placeholder?: string;
  loading?: boolean;
  error?: string;
  cache?: boolean;
  preload?: boolean;
  lazy?: boolean;
  responsive?: boolean;
  interactive?: boolean;
  clickable?: boolean;
  hoverEffect?: boolean;
  focusable?: boolean;
  draggable?: boolean;
  editable?: boolean;
  selectable?: boolean;
  focusRing?: boolean;
  badge?: AvatarBadge;
  statusIndicator?: boolean;
  onlineIndicator?: boolean;
  typingIndicator?: boolean;
  notificationCount?: number;
  achievementLevel?: AvatarAchievementLevel;
  learningProgress?: AvatarLearningProgress;
  skillBadges?: AvatarSkillBadge[];
  socialConnections?: AvatarSocialConnection[];
  collaborationStatus?: AvatarCollaborationStatus;
  aiRecommended?: boolean;
  performance?: AvatarPerformance;
  context?: AvatarContext;
  personalization?: AvatarPersonalization;
  educational?: AvatarEducational;
  social?: AvatarSocial;
  collaborative?: boolean;
  gamified?: boolean;
  animated?: boolean;
  soundEnabled?: boolean;
  hapticFeedback?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onHover?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onEdit?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onUpload?: (file: File) => void;
  onProgress?: (progress: number) => void;
  onAchievement?: (achievement: AvatarAchievement) => void;
  onSkillUpdate?: (skill: string, level: number) => void;
  onSocialConnect?: (connection: AvatarSocialConnection) => void;
  onCollaborationJoin?: (collaboration: AvatarCollaborationStatus) => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  testId?: string;
}

interface AvatarFallbackProps {
  children?: React.ReactNode;
  src?: string;
  alt?: string;
  name?: string;
  email?: string;
  id?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  initials?: string;
  color?: string;
  backgroundColor?: string;
  type?: 'initials' | 'icon' | 'image' | 'text' | 'placeholder';
  error?: boolean;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  autoGenerate?: boolean;
  fallbackText?: string;
}

type AvatarType = 
  | 'user' | 'student' | 'teacher' | 'mentor' | 'admin' | 'guest' | 'bot' | 'system'
  | 'anonymous' | 'profile' | 'participant' | 'collaborator' | 'contributor' | 'reviewer'
  | 'achievement' | 'skill' | 'certification' | 'learning_path' | 'progress' | 'milestone';

type AvatarVariant = 
  | 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  | 'minimal' | 'detailed' | 'compact' | 'expanded' | 'professional' | 'casual'
  | 'academic' | 'creative' | 'technical' | 'artistic' | 'scientific' | 'corporate'
  | 'gradient' | 'glass' | 'solid' | 'outline' | 'filled' | 'metallic' | 'neon' | 'holographic'
  | '3d' | 'animated' | 'interactive' | 'responsive' | 'adaptive' | 'personalized'
  | 'educational' | 'gamified' | 'social' | 'collaborative' | 'achievement' | 'skill';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

type AvatarShape = 'circle' | 'rounded' | 'square' | 'diamond' | 'hexagon' | 'star' | 'custom';

type AvatarAnimation = 'none' | 'fade' | 'slide' | 'bounce' | 'pulse' | 'spin' | 'wiggle' | 'wave' | 'blink' | 'breathe' | 'float' | 'glow' | 'shimmer' | 'particle' | 'aurora' | 'hologram' | 'morph' | 'transform';

type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'dnd' | 'invisible' | 'typing' | 'active' | 'idle' | 'engaged' | 'learning' | 'collaborating' | 'achieved' | 'celebrating' | 'achievement';

type AvatarPresence = 'online' | 'offline' | 'away' | 'busy' | 'dnd' | 'typing' | 'learning' | 'collaborating' | 'achieved' | 'celebrating';

type AvatarShadow = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'glow' | 'neon' | 'colored';

type AvatarBorder = 'none' | 'thin' | 'medium' | 'thick' | 'gradient' | 'animated' | 'glow' | 'metallic';

interface AvatarBadge {
  type?: string;
  content?: string;
  icon?: string;
  emoji?: string;
  color?: string;
  backgroundColor?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animation?: AvatarAnimation;
  pulse?: boolean;
  glow?: boolean;
  interactive?: boolean;
}

interface AvatarAchievementLevel {
  level: number;
  name: string;
  color: string;
  backgroundColor: string;
  icon?: string;
  emoji?: string;
  description?: string;
  requirements?: string[];
  rewards?: string[];
  progress?: number;
  nextLevel?: number;
}

interface AvatarLearningProgress {
  overall: number;
  subjects: Record<string, number>;
  skills: Record<string, number>;
  achievements: string[];
  milestones: string[];
  certifications: string[];
  learningPaths: string[];
  studyTime: number;
  streak: number;
  level: number;
  experience: number;
}

interface AvatarSkillBadge {
  name: string;
  level: number;
  category: string;
  icon?: string;
  emoji?: string;
  verified?: boolean;
  dateEarned?: Date;
  description?: string;
  requirements?: string[];
  progress?: number;
  color?: string;
  backgroundColor?: string;
}

interface AvatarSocialConnection {
  platform: string;
  username: string;
  verified: boolean;
  followers?: number;
  following?: number;
  mutual?: number;
  status: 'connected' | 'pending' | 'blocked' | 'follows' | 'following';
  lastActivity?: Date;
}

interface AvatarCollaborationStatus {
  project: string;
  role: string;
  status: 'active' | 'paused' | 'completed' | 'invited';
  participants?: number;
  contribution?: number;
  lastActive?: Date;
  permissions?: string[];
}

interface AvatarAchievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  emoji?: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  dateEarned: Date;
  progress?: number;
  requirements?: string[];
  rewards?: string[];
  shareable?: boolean;
  social?: boolean;
}

interface AvatarSocial {
  connections: AvatarSocialConnection[];
  followers: number;
  following: number;
  mutual: number;
  influence?: number;
  engagement?: number;
  reputation?: number;
  verification?: boolean;
  public?: boolean;
}

interface AvatarAccessibility {
  ariaLabel: string;
  ariaDescribedBy?: string;
  role: string;
  tabIndex: number;
  focusable: boolean;
  screenReader: boolean;
  highContrast: boolean;
  colorBlind: boolean;
  keyboardNavigation: boolean;
  skipToContent: boolean;
}

interface AvatarAnalytics {
  tracking: boolean;
  events: string[];
  goals: string[];
  conversions: string[];
  custom: Record<string, any>;
  platforms: string[];
  privacy: boolean;
  gdpr: boolean;
}

interface AvatarAIOptimization {
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

interface AvatarEducational {
  type: 'student' | 'teacher' | 'mentor' | 'achievement' | 'skill' | 'progress' | 'learning_path' | 'assessment' | 'collaboration';
  subject?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  objectives?: string[];
  activities?: string[];
  assessments?: string[];
  resources?: string[];
  prerequisites?: string[];
  nextSteps?: string[];
  mastery: boolean;
  adaptive: boolean;
  gamified: boolean;
  social: boolean;
  collaborative: boolean;
  personalized: boolean;
}

interface AvatarPerformance {
  loadTime: number;
  renderTime: number;
  animationFPS: number;
  memoryUsage: number;
  cacheHit: number;
  imageSize: number;
  compressionRatio: number;
  errorRate: number;
}

interface AvatarContext {
  device: string;
  browser: string;
  viewport: { width: number; height: number };
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

interface AvatarPersonalization {
  userPreferences: Record<string, any>;
  behaviorPatterns: Record<string, any>;
  learningStyle: string;
  pace: 'slow' | 'normal' | 'fast' | 'adaptive';
  engagement: 'low' | 'medium' | 'high' | 'intense';
  motivation: 'intrinsic' | 'extrinsic' | 'social' | 'achievement' | 'mastery';
  collaboration: boolean;
  competition: boolean;
  customization: boolean;
  personalization: boolean;
}

// Avatar configuration presets
const AVATAR_PRESETS: Record<string, Partial<AvatarConfig>> = {
  default: {
    id: 'default',
    name: 'Default Avatar',
    description: 'Basic avatar component',
    type: 'user',
    variant: 'default',
    animation: 'fade',
    accessibility: {
      ariaLabel: 'User avatar',
      role: 'img',
      tabIndex: 0,
      focusable: true,
      screenReader: true,
      highContrast: true,
      colorBlind: true,
      keyboardNavigation: true,
      skipToContent: false
    },
    analytics: {
      tracking: true,
      events: ['view', 'click', 'hover'],
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
      type: 'student',
      mastery: false,
      adaptive: false,
      gamified: false,
      social: false,
      collaborative: false,
      personalized: false
    }
  },

  student: {
    id: 'student',
    name: 'Student Avatar',
    description: 'Educational student profile',
    type: 'student',
    variant: 'educational',
    animation: 'pulse',
    accessibility: {
      ariaLabel: 'Student avatar',
      role: 'img',
      tabIndex: 0,
      focusable: true,
      screenReader: true,
      highContrast: true,
      colorBlind: true,
      keyboardNavigation: true,
      skipToContent: false
    },
    analytics: {
      tracking: true,
      events: ['view', 'click', 'progress', 'achievement'],
      goals: ['engagement', 'progress', 'achievement'],
      conversions: ['interaction', 'progress_made']
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
      type: 'student',
      mastery: true,
      adaptive: true,
      gamified: true,
      social: true,
      collaborative: true,
      personalized: true
    }
  },

  teacher: {
    id: 'teacher',
    name: 'Teacher Avatar',
    description: 'Educational instructor profile',
    type: 'teacher',
    variant: 'professional',
    animation: 'breathe',
    accessibility: {
      ariaLabel: 'Teacher avatar',
      role: 'img',
      tabIndex: 0,
      focusable: true,
      screenReader: true,
      highContrast: true,
      colorBlind: true,
      keyboardNavigation: true,
      skipToContent: false
    },
    analytics: {
      tracking: true,
      events: ['view', 'click', 'teaching', 'mentoring'],
      goals: ['engagement', 'teaching', 'mentoring'],
      conversions: ['interaction', 'mentoring_engaged']
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
      type: 'teacher',
      mastery: true,
      adaptive: true,
      gamified: false,
      social: true,
      collaborative: true,
      personalized: true
    }
  },

  achievement: {
    id: 'achievement',
    name: 'Achievement Avatar',
    description: 'Learning achievement profile',
    type: 'achievement',
    variant: 'achievement',
    animation: 'glow',
    accessibility: {
      ariaLabel: 'Achievement avatar',
      role: 'img',
      tabIndex: 0,
      focusable: true,
      screenReader: true,
      highContrast: true,
      colorBlind: true,
      keyboardNavigation: true,
      skipToContent: false
    },
    analytics: {
      tracking: true,
      events: ['view', 'click', 'achievement', 'celebrate'],
      goals: ['engagement', 'achievement'],
      conversions: ['achievement_viewed', 'achievement_shared']
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
      social: true,
      collaborative: true,
      personalized: true
    }
  }
};

// Utility functions
const generateInitials = (name?: string, email?: string, id?: string): string => {
  if (name) {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  
  if (id) {
    return id.slice(0, 2).toUpperCase();
  }
  
  return '?';
};

const getColorFromString = (str?: string): string => {
  if (!str) return '#6B7280';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

const getSizeClasses = (size: AvatarSize): { container: string; text: string; badge: string } => {
  const sizeMap = {
    xs: { container: 'h-6 w-6', text: 'text-xs', badge: 'text-xs' },
    sm: { container: 'h-8 w-8', text: 'text-sm', badge: 'text-xs' },
    md: { container: 'h-10 w-10', text: 'text-base', badge: 'text-sm' },
    lg: { container: 'h-12 w-12', text: 'text-lg', badge: 'text-sm' },
    xl: { container: 'h-16 w-16', text: 'text-xl', badge: 'text-base' },
    '2xl': { container: 'h-20 w-20', text: 'text-2xl', badge: 'text-lg' },
    '3xl': { container: 'h-24 w-24', text: 'text-3xl', badge: 'text-xl' },
    '4xl': { container: 'h-32 w-32', text: 'text-4xl', badge: 'text-2xl' },
    '5xl': { container: 'h-40 w-40', text: 'text-5xl', badge: 'text-3xl' },
    '6xl': { container: 'h-48 w-48', text: 'text-6xl', badge: 'text-4xl' }
  };
  
  return sizeMap[size] || sizeMap.md;
};

const getShapeClasses = (shape: AvatarShape): string => {
  const shapeMap = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none',
    diamond: 'rotate-45',
    hexagon: 'clip-path-hexagon',
    star: 'clip-path-star',
    custom: ''
  };
  
  return shapeMap[shape] || shapeMap.circle;
};

const getVariantClasses = (variant: AvatarVariant, theme: 'light' | 'dark' = 'light'): string => {
  const baseClasses = {
    default: 'border-2 border-gray-200 dark:border-gray-700',
    primary: 'border-2 border-blue-200 dark:border-blue-800',
    secondary: 'border-2 border-gray-300 dark:border-gray-600',
    success: 'border-2 border-green-200 dark:border-green-800',
    warning: 'border-2 border-yellow-200 dark:border-yellow-800',
    error: 'border-2 border-red-200 dark:border-red-800',
    info: 'border-2 border-blue-200 dark:border-blue-800',
    minimal: 'border border-gray-200 dark:border-gray-700',
    detailed: 'border-4 border-gray-300 dark:border-gray-600',
    compact: 'border border-gray-100 dark:border-gray-800',
    expanded: 'border-4 border-gray-400 dark:border-gray-500',
    professional: 'border-2 border-blue-600 dark:border-blue-400',
    casual: 'border border-gray-400 dark:border-gray-300',
    academic: 'border-2 border-purple-200 dark:border-purple-800',
    creative: 'border-2 border-pink-200 dark:border-pink-800',
    technical: 'border-2 border-cyan-200 dark:border-cyan-800',
    artistic: 'border-2 border-orange-200 dark:border-orange-800',
    scientific: 'border-2 border-indigo-200 dark:border-indigo-800',
    corporate: 'border-2 border-gray-600 dark:border-gray-400',
    gradient: 'bg-gradient-to-br from-blue-400 to-purple-500',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20',
    solid: 'bg-gray-900 dark:bg-gray-100',
    outline: 'border-4 border-transparent bg-gray-100 dark:bg-gray-800',
    filled: 'bg-gray-100 dark:bg-gray-700',
    metallic: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600',
    neon: 'bg-black dark:bg-gray-900 border-2 border-cyan-400 shadow-lg shadow-cyan-400/50',
    holographic: 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400',
    '3d': 'transform perspective-1000 rotateX-12 bg-gray-800 text-white shadow-2xl',
    animated: 'transition-all duration-300 ease-in-out',
    interactive: 'hover:scale-105 hover:shadow-xl cursor-pointer',
    responsive: 'transition-all duration-200',
    adaptive: 'transition-all duration-300 ease-in-out',
    personalized: 'bg-gradient-to-r from-purple-500 to-pink-500',
    educational: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    gamified: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    social: 'bg-gradient-to-r from-pink-400 to-rose-500',
    collaborative: 'bg-gradient-to-r from-green-400 to-blue-500',
    achievement: 'bg-gradient-to-r from-yellow-300 to-yellow-600',
    skill: 'bg-gradient-to-r from-purple-400 to-indigo-500'
  };
  
  return baseClasses[variant] || baseClasses.default;
};

const getAnimationClasses = (animation: AvatarAnimation, isAnimating: boolean): string => {
  if (!isAnimating) return '';
  
  const animationMap = {
    none: '',
    fade: 'animate-fade',
    slide: 'animate-slide',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    wiggle: 'animate-wiggle',
    wave: 'animate-wave',
    blink: 'animate-blink',
    breathe: 'animate-breathe',
    float: 'animate-float',
    glow: 'animate-glow',
    shimmer: 'animate-shimmer',
    particle: 'animate-particle',
    aurora: 'animate-aurora',
    hologram: 'animate-hologram',
    morph: 'animate-morph',
    transform: 'animate-transform'
  };
  
  return animationMap[animation] || '';
};

const getStatusClasses = (status: AvatarStatus): string => {
  const statusMap = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400',
    dnd: 'bg-red-600',
    invisible: 'bg-transparent',
    typing: 'bg-blue-400 animate-pulse',
    active: 'bg-green-500',
    idle: 'bg-gray-300',
    engaged: 'bg-purple-400',
    learning: 'bg-cyan-400',
    collaborating: 'bg-blue-500',
    achieved: 'bg-yellow-500',
    celebrating: 'bg-orange-400 animate-bounce',
    achievement: 'bg-gold-400 animate-pulse'
  };
  
  return statusMap[status] || statusMap.online;
};

// Main Avatar component
const Avatar: React.FC<AvatarProps> = ({
  children,
  src,
  alt,
  name,
  email,
  id,
  type = 'user',
  variant = 'default',
  size = 'md',
  shape = 'circle',
  animation = 'none',
  status,
  presence,
  initials,
  color,
  backgroundColor,
  borderColor,
  gradient = false,
  glow = false,
  shadow = 'none',
  border = 'none',
  fallbackSrc,
  placeholder,
  loading = false,
  error = false,
  cache = true,
  preload = false,
  lazy = true,
  responsive = true,
  interactive = false,
  clickable = false,
  hoverEffect = false,
  focusable = true,
  draggable = false,
  editable = false,
  selectable = false,
  focusRing = false,
  badge,
  statusIndicator = false,
  onlineIndicator = false,
  typingIndicator = false,
  notificationCount,
  achievementLevel,
  learningProgress,
  skillBadges,
  socialConnections,
  collaborationStatus,
  aiRecommended = false,
  performance,
  context,
  personalization,
  educational,
  social,
  collaborative = false,
  gamified = false,
  animated = false,
  soundEnabled = false,
  hapticFeedback = false,
  className = '',
  style,
  onClick,
  onHover,
  onFocus,
  onLoad,
  onError,
  onEdit,
  onUpload,
  onProgress,
  onAchievement,
  onSkillUpdate,
  onSocialConnect,
  onCollaborationJoin,
  ariaLabel,
  ariaDescribedBy,
  testId,
  ...props
}) => {
  // Hooks
  const analytics = useAnalytics();
  const ai = useAI();
  const preferences = usePreferences();
  
  // State
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(animated);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  } | null>(null);

  // Refs
  const avatarRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoized values
  const currentTheme = useMemo(() => preferences.theme || 'light', [preferences.theme]);
  const isDark = currentTheme === 'dark';
  
  const sizeClasses = useMemo(() => getSizeClasses(size), [size]);
  const shapeClasses = useMemo(() => getShapeClasses(shape), [shape]);
  const variantClasses = useMemo(() => getVariantClasses(variant, currentTheme), [variant, currentTheme]);
  const animationClasses = useMemo(() => getAnimationClasses(animation, isAnimating), [animation, isAnimating]);
  const statusClasses = useMemo(() => status ? getStatusClasses(status) : '', [status]);

  // Generated values
  const generatedInitials = useMemo(() => {
    if (initials) return initials;
    return generateInitials(name, email, id);
  }, [initials, name, email, id]);

  const avatarColor = useMemo(() => {
    if (color) return color;
    return getColorFromString(name || email || id);
  }, [color, name, email, id]);

  const avatarBackgroundColor = useMemo(() => {
    if (backgroundColor) return backgroundColor;
    return `${avatarColor}20`;
  }, [backgroundColor, avatarColor]);

  // Event handlers
  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (clickable || interactive) {
      setClicked(true);
      setTimeout(() => setClicked(false), 150);

      // Analytics tracking
      analytics.track('avatar_click', {
        type,
        variant,
        size,
        shape,
        status,
        presence,
        hasImage: !!src,
        hasBadge: !!badge,
        hasNotification: !!notificationCount,
        educational: !!educational,
        collaborative: !!collaborative,
        gamified: !!gamified
      });

      // AI optimization
      if (ai.isEnabled && !isProcessing) {
        setIsProcessing(true);
        ai.optimize({
          component: 'avatar',
          action: 'click',
          context: {
            type,
            variant,
            size,
            shape,
            status,
            presence,
            userPreferences: preferences,
            educational,
            collaborative,
            gamified
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
        const audio = new Audio('/sounds/avatar-click.mp3');
        audio.play().catch(() => {});
      }

      // Call user handler
      if (onClick) {
        onClick(event);
      }
    }
  }, [
    clickable, interactive, analytics, ai, preferences, type, variant, size, shape, 
    status, presence, educational, collaborative, gamified, onClick, isProcessing, 
    hapticFeedback, soundEnabled
  ]);

  const handleHover = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setHovered(true);

    // Analytics tracking
    analytics.track('avatar_hover', {
      type,
      variant,
      size,
      status,
      presence
    });

    // AI context awareness
    if (ai.isEnabled) {
      ai.analyze({
        component: 'avatar',
        action: 'hover',
        context: {
          type,
          variant,
          size,
          status,
          presence,
          userPreferences: preferences
        }
      });
    }

    if (onHover) {
      onHover(event);
    }
  }, [
    analytics, ai, preferences, type, variant, size, status, presence, onHover
  ]);

  const handleFocus = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    setFocused(true);

    // Accessibility analytics
    analytics.track('avatar_focus', {
      type,
      variant,
      size,
      status
    });

    if (onFocus) {
      onFocus(event);
    }
  }, [analytics, type, variant, size, status, onFocus]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const handleImageLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageLoaded(true);
    setImageError(false);

    // Performance tracking
    const loadTime = performance.now();
    analytics.track('avatar_image_load', {
      type,
      variant,
      size,
      loadTime,
      src: src?.substring(0, 100) // Truncate for privacy
    });

    if (onLoad) {
      onLoad(event);
    }
  }, [analytics, type, variant, size, src, onLoad]);

  const handleImageError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    setImageLoaded(false);

    // Error analytics
    analytics.track('avatar_image_error', {
      type,
      variant,
      size,
      error: 'image_load_failed',
      src: src?.substring(0, 100)
    });

    if (onError) {
      onError(event);
    }
  }, [analytics, type, variant, size, src, onError]);

  const handleEdit = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    
    if (editable) {
      analytics.track('avatar_edit_click', {
        type,
        variant,
        size
      });

      if (onEdit) {
        onEdit(event);
      }
    }
  }, [editable, analytics, type, variant, size, onEdit]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpload) {
      analytics.track('avatar_upload', {
        type,
        variant,
        size,
        fileType: file.type,
        fileSize: file.size
      });

      onUpload(file);
    }
  }, [onUpload, analytics, type, variant, size]);

  // Effects
  useEffect(() => {
    if (preload && src && !imageLoaded && !imageError) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
      img.src = src;
    }
  }, [preload, src, imageLoaded, imageError]);

  useEffect(() => {
    if (loading) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [loading]);

  // Achievement effect
  useEffect(() => {
    if (achievementLevel && onAchievement) {
      const achievement: AvatarAchievement = {
        id: `achievement-${achievementLevel.level}`,
        title: `${achievementLevel.name} Achieved`,
        description: achievementLevel.description || `Reached ${achievementLevel.name} level`,
        category: 'level',
        rarity: 'rare',
        dateEarned: new Date(),
        requirements: achievementLevel.requirements,
        rewards: achievementLevel.rewards,
        shareable: true,
        social: true
      };

      onAchievement(achievement);

      // Celebration effect
      setNotification({
        type: 'success',
        message: `${achievementLevel.name} achieved!`,
        duration: 3000
      });

      setTimeout(() => setNotification(null), 3000);
    }
  }, [achievementLevel, onAchievement]);

  // Error notification
  useEffect(() => {
    if (error) {
      setNotification({
        type: 'error',
        message: error,
        duration: 5000
      });
      setTimeout(() => setNotification(null), 5000);
    }
  }, [error]);

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
      scale: clicked ? 0.95 : 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  // Render notification
  const renderNotification = () => {
    if (!notification) return null;

    const notificationClasses = {
      success: 'bg-green-100 border-green-400 text-green-800 dark:bg-green-800 dark:border-green-300 dark:text-green-100',
      error: 'bg-red-100 border-red-400 text-red-800 dark:bg-red-800 dark:border-red-300 dark:text-red-100',
      warning: 'bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-800 dark:border-yellow-300 dark:text-yellow-100',
      info: 'bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-800 dark:border-blue-300 dark:text-blue-100'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full px-3 py-2 rounded-lg border-2 ${notificationClasses[notification.type]} shadow-lg z-50 max-w-xs`}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-current opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      </motion.div>
    );
  };

  // Render AI recommendation
  const renderAIRecommendation = () => {
    if (!aiRecommendation) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-cyan-100 dark:bg-cyan-800 border-2 border-cyan-400 dark:border-cyan-300 text-cyan-800 dark:text-cyan-100 text-sm rounded-lg max-w-xs z-50 shadow-lg"
      >
        <div className="flex items-center space-x-2">
          <span className="text-cyan-600 dark:text-cyan-300">🤖</span>
          <span>{aiRecommendation}</span>
        </div>
      </motion.div>
    );
  };

  // Render status indicator
  const renderStatusIndicator = () => {
    if (!statusIndicator && !presence) return null;

    const statusClass = status ? getStatusClasses(status) : 'bg-gray-400';
    const statusSize = size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';

    return (
      <div className={`absolute bottom-0 right-0 ${statusSize} rounded-full border-2 border-white dark:border-gray-800 ${statusClass}`}>
        <span className="sr-only">{status || presence}</span>
      </div>
    );
  };

  // Render typing indicator
  const renderTypingIndicator = () => {
    if (!typingIndicator || status !== 'typing') return null;

    return (
      <div className="absolute bottom-0 right-0 flex items-center space-x-1 bg-blue-500 rounded-full px-2 py-1">
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  };

  // Render notification count
  const renderNotificationCount = () => {
    if (!notificationCount || notificationCount <= 0) return null;

    return (
      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold px-1">
        {notificationCount > 99 ? '99+' : notificationCount}
      </div>
    );
  };

  // Render achievement level
  const renderAchievementLevel = () => {
    if (!achievementLevel) return null;

    return (
      <div className="absolute -bottom-1 -left-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold px-1">
        {achievementLevel.level}
      </div>
    );
  };

  // Render badge
  const renderBadge = () => {
    if (!badge) return null;

    const badgeSize = badge.size || (size === 'xs' || size === 'sm' ? 'xs' : 'sm');
    const badgeClasses = getSizeClasses(badgeSize);
    const badgeColor = badge.color || 'bg-blue-500';
    const badgeBackgroundColor = badge.backgroundColor || 'bg-blue-100';

    return (
      <div className={`absolute ${badgeClasses.container} ${badgeColor} ${badge.position || 'top-right'} transform translate-x-2 -translate-y-2 flex items-center justify-center rounded-full ${badge.pulse ? 'animate-pulse' : ''}`}>
        {badge.icon && (
          <img src={badge.icon} alt="" className="w-3 h-3" />
        )}
        {badge.emoji && (
          <span className="text-xs">{badge.emoji}</span>
        )}
        {badge.content && (
          <span className="text-xs font-bold text-white">{badge.content}</span>
        )}
      </div>
    );
  };

  // Render edit button
  const renderEditButton = () => {
    if (!editable) return null;

    return (
      <button
        onClick={handleEdit}
        className="absolute top-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Edit avatar"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    );
  };

  // Main render
  return (
    <motion.div
      ref={avatarRef}
      className={`
        relative inline-flex ${sizeClasses.container} ${shapeClasses} ${variantClasses} 
        ${animationClasses} ${shadow !== 'none' ? `shadow-${shadow}` : ''} 
        ${border !== 'none' ? `border-${border}` : ''}
        ${interactive || clickable ? 'cursor-pointer' : ''}
        ${hoverEffect ? 'hover:scale-105 hover:shadow-lg' : ''}
        ${focusRing ? 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : ''}
        ${grouped ? 'group' : ''}
        transition-all duration-200
        ${className}
      `}
      style={{
        backgroundColor: !gradient && !imageLoaded && !imageError ? avatarBackgroundColor : undefined,
        borderColor: borderColor,
        ...style
      }}
      variants={animationVariants}
      initial="initial"
      animate={clicked ? "tap" : "animate"}
      whileHover={hovered ? "hover" : undefined}
      onClick={handleClick}
      onHoverStart={handleHover}
      onMouseLeave={handleMouseLeave}
      onFocus={focusable ? handleFocus : undefined}
      onBlur={focusable ? handleBlur : undefined}
      tabIndex={focusable ? 0 : -1}
      aria-label={ariaLabel || `Avatar for ${name || email || 'user'}`}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
      role={props.role || 'img'}
      {...props}
    >
      {/* Image */}
      {src && !imageError && (
        <img
          ref={imageRef}
          src={src}
          alt={alt || `Avatar for ${name || 'user'}`}
          className={`
            w-full h-full object-cover
            ${shapeClasses}
            ${!imageLoaded ? 'opacity-0' : 'opacity-100'}
            ${lazy ? 'loading="lazy"' : ''}
            ${cache ? '' : 'no-cache'}
            transition-opacity duration-200
          `}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={lazy ? 'lazy' : 'eager'}
          crossOrigin="anonymous"
        />
      )}

      {/* Fallback */}
      {(!src || imageError) && !loading && (
        <AvatarFallback
          src={fallbackSrc}
          alt={alt}
          name={name}
          email={email}
          id={id}
          size={size}
          shape={shape}
          initials={generatedInitials}
          color={avatarColor}
          backgroundColor={avatarBackgroundColor}
          type="initials"
          error={imageError}
        >
          {children || generatedInitials}
        </AvatarFallback>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-inherit">
          <motion.div
            className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      {/* Status indicators */}
      {renderStatusIndicator()}
      {renderTypingIndicator()}
      {renderNotificationCount()}
      {renderAchievementLevel()}

      {/* Badge */}
      {renderBadge()}

      {/* Edit button */}
      {renderEditButton()}

      {/* Notification */}
      {renderNotification()}

      {/* AI Recommendation */}
      {renderAIRecommendation()}

      {/* Hidden file input for uploads */}
      {editable && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload avatar image"
        />
      )}
    </motion.div>
  );
};

// AvatarFallback component
const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  children,
  src,
  alt,
  name,
  email,
  id,
  size = 'md',
  shape = 'circle',
  initials,
  color,
  backgroundColor,
  type = 'initials',
  error = false,
  loading = false,
  className = '',
  style,
  autoGenerate = true,
  fallbackText,
  ...props
}) => {
  const sizeClasses = useMemo(() => getSizeClasses(size), [size]);
  const shapeClasses = useMemo(() => getShapeClasses(shape), [shape]);

  const generatedInitials = useMemo(() => {
    if (initials) return initials;
    if (fallbackText) return fallbackText;
    return generateInitials(name, email, id);
  }, [initials, fallbackText, name, email, id]);

  const avatarColor = useMemo(() => {
    if (color) return color;
    return getColorFromString(name || email || id);
  }, [color, name, email, id]);

  const avatarBackgroundColor = useMemo(() => {
    if (backgroundColor) return backgroundColor;
    return `${avatarColor}20`;
  }, [backgroundColor, avatarColor]);

  const baseClasses = `
    flex h-full w-full items-center justify-center rounded-full
    ${shapeClasses}
    ${sizeClasses.text}
    font-medium
    ${error ? 'text-red-600 bg-red-100' : 'text-gray-600 dark:text-gray-300'}
    transition-all duration-200
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Different fallback types
  const renderFallback = () => {
    switch (type) {
      case 'initials':
        return generatedInitials;
      case 'icon':
        return (
          <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        );
      case 'image':
        return src ? (
          <img src={src} alt={alt || 'Avatar fallback'} className="w-full h-full object-cover" />
        ) : generatedInitials;
      case 'text':
        return children || generatedInitials;
      case 'placeholder':
        return (
          <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
      default:
        return generatedInitials;
    }
  };

  return (
    <div
      className={baseClasses}
      style={{
        backgroundColor: !error && !loading ? avatarBackgroundColor : undefined,
        color: avatarColor,
        ...style
      }}
      {...props}
    >
      {renderFallback()}
    </div>
  );
};

export default Avatar;
export { Avatar, AvatarFallback };
export type { 
  AvatarProps, AvatarFallbackProps, AvatarConfig, AvatarType, AvatarVariant, AvatarSize, 
  AvatarShape, AvatarAnimation, AvatarStatus, AvatarPresence, AvatarShadow, AvatarBorder,
  AvatarBadge, AvatarAchievementLevel, AvatarLearningProgress, AvatarSkillBadge,
  AvatarSocialConnection, AvatarCollaborationStatus, AvatarAchievement, AvatarSocial,
  AvatarAccessibility, AvatarAnalytics, AvatarAIOptimization, AvatarEducational,
  AvatarPerformance, AvatarContext, AvatarPersonalization
};