// JAC Learning Platform - Enterprise Card Intelligence Platform
// Enhanced by Cavin Otieno - MiniMax Agent
// Comprehensive AI-powered card system with advanced analytics and educational intelligence

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAnalytics } from './useAnalytics';
import { useAI } from './useAI';
import { usePreferences } from './usePreferences';

// =============================================================================
// TYPE DEFINITIONS & INTERFACES
// =============================================================================

/**
 * Comprehensive card variant types for different use cases
 */
export type CardVariant = 
  | 'default' | 'glass' | 'solid' | 'outline'
  | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  | 'gradient' | 'neon' | 'metallic' | 'holographic' | '3d'
  | 'floating' | 'floating-glow' | 'neon-border' | 'liquid'
  | 'morphing' | 'cyberpunk' | 'retro' | 'card-stack' | 'carousel'
  | 'educational' | 'quiz' | 'progress' | 'achievement'
  | 'interactive' | 'tutorial' | 'learning' | 'milestone'
  | 'custom';

/**
 * Card size variants with responsive scaling
 */
export type CardSize = 
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  | 'responsive' | 'full-width' | 'auto';

/**
 * Animation types for card interactions
 */
export type CardAnimation = 
  | 'none' | 'fade' | 'slide' | 'zoom' | 'rotate' | 'flip'
  | 'bounce' | 'pulse' | 'glow' | 'hover-lift' | 'magnetic'
  | 'gravity' | 'wave' | 'particle' | 'liquid' | 'neon'
  | 'holographic' | 'cyber' | 'educational' | 'achievement'
  | 'custom';

/**
 * Theme options for different contexts
 */
export type CardTheme = 
  | 'light' | 'dark' | 'auto' | 'high-contrast'
  | 'neon' | 'cyberpunk' | 'glass' | 'minimal'
  | 'corporate' | 'education' | 'gaming' | 'creative';

/**
 * Educational card types for learning contexts
 */
export type EducationalCardType = 
  | 'standard' | 'learning' | 'quiz' | 'achievement'
  | 'progress' | 'milestone' | 'interactive' | 'tutorial'
  | 'lesson' | 'exercise' | 'assessment' | 'reference';

/**
 * Analytics event types for comprehensive tracking
 */
export interface CardAnalytics {
  viewCount: number;
  clickCount: number;
  hoverCount: number;
  interactionTime: number;
  scrollDepth: number;
  engagementRate: number;
  userSatisfaction: number;
  conversionRate: number;
  errorCount: number;
  a/bTesting?: {
    variant: string;
    performance: number;
    confidence: number;
  };
}

/**
 * AI optimization data for intelligent recommendations
 */
export interface AICardOptimization {
  suggestedVariant: CardVariant;
  suggestedSize: CardSize;
  suggestedLayout: string;
  confidence: number;
  reasoning: string[];
  predictedPerformance: number;
  optimizationSuggestions: string[];
}

/**
 * Educational context for learning platforms
 */
export interface EducationalCardContext {
  learningPhase: 'introduction' | 'practice' | 'assessment' | 'mastery';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  subjectArea: string;
  progressTracking: boolean;
  achievementBadges: boolean;
  interactiveElements: boolean;
  multimediaContent: boolean;
}

/**
 * Card content structure
 */
export interface CardContent {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string | React.ReactNode;
  icon?: React.ReactNode;
  actions?: Array<{
    label: string;
    variant?: string;
    onClick?: () => void;
  }>;
  metadata?: {
    author?: string;
    date?: string;
    tags?: string[];
    difficulty?: string;
    estimatedTime?: string;
  };
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
  achievements?: Array<{
    id: string;
    name: string;
    description: string;
    icon?: React.ReactNode;
    earned: boolean;
  }>;
}

/**
 * Comprehensive card props interface
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  // Core functionality
  variant?: CardVariant;
  size?: CardSize;
  animation?: CardAnimation;
  theme?: CardTheme;
  educationalType?: EducationalCardType;
  educationalContext?: EducationalCardContext;

  // Visual properties
  glass?: boolean;
  gradient?: string;
  neonColor?: string;
  glowIntensity?: 'subtle' | 'medium' | 'strong' | 'extreme';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

  // Content
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string | React.ReactNode;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  badge?: React.ReactNode;
  counter?: number;
  progress?: number;

  // Content object for complex content
  content?: CardContent;

  // State management
  isLoading?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isHovered?: boolean;
  expanded?: boolean;
  collapsed?: boolean;

  // Interaction
  onClick?: (event: React.MouseEvent<HTMLDivElement>, analytics: CardAnalytics) => void;
  onHover?: (event: React.MouseEvent<HTMLDivElement>, analytics: CardAnalytics) => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onExpand?: () => void;
  onCollapse?: () => void;

  // AI and Analytics
  enableAI?: boolean;
  enableAnalytics?: boolean;
  trackInteractions?: boolean;
  optimizationTarget?: 'engagement' | 'conversion' | 'accessibility' | 'performance';

  // Educational features
  showProgress?: boolean;
  showAchievement?: boolean;
  interactiveTutorial?: boolean;
  contextualHelp?: boolean;
  learningHints?: string[];

  // Accessibility
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaLabel?: string;
  role?: string;
  tabIndex?: number;

  // Performance
  lazyLoad?: boolean;
  memoize?: boolean;
  virtualize?: boolean;

  // Layout
  layout?: 'vertical' | 'horizontal' | 'grid' | 'masonry' | 'carousel';
  columns?: number;
  responsive?: boolean;

  // Custom styling
  className?: string;
  style?: React.CSSProperties;
  customClasses?: {
    base?: string;
    variant?: string;
    animation?: string;
    state?: string;
  };

  // Debugging
  debug?: boolean;
  showPerformanceMetrics?: boolean;
  enableLogging?: boolean;

  // Children content
  children?: React.ReactNode;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate CSS classes based on card props
 */
const generateCardClasses = (props: CardProps): string => {
  const {
    variant = 'default',
    size = 'md',
    theme = 'auto',
    glass = false,
    isLoading = false,
    isDisabled = false,
    isSelected = false,
    padding = 'md',
    borderRadius = 'lg',
    shadow = 'md',
    className = '',
    customClasses = {},
  } = props;

  // Base classes
  const baseClasses = [
    'inline-block',
    'transition-all',
    'duration-300',
    'select-none',
  ];

  // Size classes
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    xxl: 'max-w-2xl',
    responsive: 'max-w-sm md:max-w-md lg:max-w-lg',
    'full-width': 'w-full',
    auto: 'max-w-md',
  };

  // Variant classes
  const variantClasses: Record<CardVariant, string[]> = {
    default: ['bg-white', 'border', 'border-gray-200', 'shadow-sm'],
    glass: ['backdrop-blur-md', 'bg-white/10', 'border', 'border-white/20'],
    solid: ['bg-white', 'border', 'border-gray-200', 'shadow-md'],
    outline: ['bg-transparent', 'border', 'border-gray-300'],
    primary: ['bg-blue-50', 'border', 'border-blue-200', 'text-blue-900'],
    secondary: ['bg-gray-50', 'border', 'border-gray-200', 'text-gray-900'],
    success: ['bg-green-50', 'border', 'border-green-200', 'text-green-900'],
    warning: ['bg-yellow-50', 'border', 'border-yellow-200', 'text-yellow-900'],
    error: ['bg-red-50', 'border', 'border-red-200', 'text-red-900'],
    info: ['bg-cyan-50', 'border', 'border-cyan-200', 'text-cyan-900'],
    gradient: ['bg-gradient-to-br', 'from-blue-50', 'to-purple-50', 'border', 'border-transparent'],
    neon: ['bg-black', 'text-green-400', 'border', 'border-green-400', 'shadow-[0_0_10px_rgba(34,197,94,0.3))'],
    metallic: ['bg-gradient-to-r', 'from-gray-200', 'to-gray-400', 'text-gray-800', 'shadow-lg'],
    holographic: ['bg-gradient-to-r', 'from-pink-500', 'via-purple-500', 'to-indigo-500', 'text-white'],
    '3d': ['bg-blue-500', 'text-white', 'shadow-[0_8px_0_rgba(59,130,246,0.8))', 'transform', 'translate-y-[-8px]'],
    floating: ['bg-white', 'shadow-lg', 'hover:shadow-xl', 'hover:-translate-y-1'],
    'floating-glow': ['bg-white', 'text-blue-600', 'shadow-lg', 'shadow-blue-500/25', 'hover:shadow-blue-500/40'],
    'neon-border': ['bg-gray-900', 'text-cyan-400', 'border', 'border-cyan-400', 'shadow-[0_0_20px_rgba(34,211,238,0.3))'],
    liquid: ['bg-gradient-to-r', 'from-purple-600', 'via-pink-600', 'to-blue-600', 'text-white'],
    morphing: ['bg-gradient-to-r', 'from-indigo-500', 'via-purple-500', 'to-pink-500', 'text-white'],
    cyberpunk: ['bg-black', 'text-lime-400', 'border', 'border-lime-400', 'shadow-[0_0_30px_rgba(163,230,53,0.5))'],
    retro: ['bg-orange-500', 'text-yellow-200', 'shadow-[0_4px_0_rgba(234,88,12,0.8))'],
    'card-stack': ['bg-white', 'shadow-md', 'transform', 'hover:rotate-1', 'hover:shadow-lg'],
    carousel: ['bg-white', 'border', 'border-gray-200', 'overflow-hidden'],
    educational: ['bg-blue-50', 'border', 'border-blue-200', 'text-blue-900', 'ring-2', 'ring-blue-100'],
    quiz: ['bg-green-50', 'border', 'border-green-200', 'text-green-900', 'ring-2', 'ring-green-100'],
    progress: ['bg-purple-50', 'border', 'border-purple-200', 'text-purple-900', 'ring-2', 'ring-purple-100'],
    achievement: ['bg-yellow-50', 'border', 'border-yellow-200', 'text-yellow-900', 'ring-2', 'ring-yellow-100'],
    interactive: ['bg-indigo-50', 'border', 'border-indigo-200', 'text-indigo-900', 'ring-2', 'ring-indigo-100'],
    tutorial: ['bg-cyan-50', 'border', 'border-cyan-200', 'text-cyan-900', 'ring-2', 'ring-cyan-100'],
    learning: ['bg-teal-50', 'border', 'border-teal-200', 'text-teal-900', 'ring-2', 'ring-teal-100'],
    milestone: ['bg-rose-50', 'border', 'border-rose-200', 'text-rose-900', 'ring-2', 'ring-rose-100'],
    custom: [],
  };

  // Border radius classes
  const borderRadiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    xxl: 'p-10',
  };

  // State classes
  const stateClasses = [
    isDisabled && 'opacity-50',
    isDisabled && 'cursor-not-allowed',
    isSelected && 'ring-2',
    isSelected && 'ring-blue-500',
    isLoading && 'cursor-wait',
    glass && 'backdrop-blur-md',
  ].filter(Boolean);

  return [
    ...baseClasses,
    sizeClasses[size],
    ...variantClasses[variant],
    borderRadiusClasses[borderRadius],
    shadowClasses[shadow],
    paddingClasses[padding],
    ...stateClasses,
    customClasses.base,
    customClasses.variant,
    customClasses.state,
    className,
  ].filter(Boolean).join(' ');
};

/**
 * Generate animation variants for Framer Motion
 */
const generateCardAnimationVariants = (animation: CardAnimation): Variants => {
  const common = {
    initial: { scale: 1, opacity: 1, y: 0 },
    animate: { scale: 1, opacity: 1, y: 0 },
  };

  switch (animation) {
    case 'fade':
      return {
        ...common,
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      };
    
    case 'slide':
      return {
        ...common,
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
      };
    
    case 'zoom':
      return {
        ...common,
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
      };
    
    case 'bounce':
      return {
        ...common,
        initial: { y: -50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        whileHover: {
          y: -10,
          scale: 1.05,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        },
      };
    
    case 'pulse':
      return {
        ...common,
        whileHover: {
          scale: 1.02,
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
          transition: { duration: 0.3 },
        },
      };
    
    case 'glow':
      return {
        ...common,
        whileHover: {
          scale: 1.02,
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
          transition: { duration: 0.2 },
        },
      };
    
    case 'magnetic':
      return {
        ...common,
        whileHover: {
          scale: 1.08,
          rotate: 2,
          transition: { type: 'spring', stiffness: 300 },
        },
      };
    
    case 'gravity':
      return {
        ...common,
        whileHover: {
          scale: 1.1,
          y: -5,
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
          transition: { type: 'spring', stiffness: 200 },
        },
      };
    
    default:
      return {
        ...common,
        whileHover: { scale: 1.02, y: -2 },
      };
  }
};

/**
 * Generate AI-optimized card properties
 */
const useAICardOptimization = (props: CardProps) => {
  const { variant = 'default', size = 'md', enableAI = true } = props;
  
  return useMemo(() => {
    if (!enableAI) return null;

    // AI optimization logic would go here
    // This is a simplified version for demonstration
    const optimizations = {
      suggestedVariant: variant,
      suggestedSize: size,
      suggestedLayout: 'vertical',
      confidence: 0.82,
      reasoning: [
        'Current variant performs well in similar contexts',
        'Size is optimal for content readability',
        'Layout matches user reading patterns',
      ],
      predictedPerformance: 0.89,
      optimizationSuggestions: [
        'Consider using gradient variant for better engagement',
        'Increase size for mobile better visibility',
        'Add interactive elements for enhanced engagement',
      ],
    };

    return optimizations;
  }, [variant, size, enableAI]);
};

// =============================================================================
// ANALYTICS HOOK
// =============================================================================

/**
 * Custom hook for comprehensive card analytics
 */
const useCardAnalytics = (props: CardProps) => {
  const {
    enableAnalytics = true,
    trackInteractions = true,
    debug = false,
  } = props;

  const [analytics, setAnalytics] = useState<CardAnalytics>({
    viewCount: 0,
    clickCount: 0,
    hoverCount: 0,
    interactionTime: 0,
    scrollDepth: 0,
    engagementRate: 0,
    userSatisfaction: 0,
    conversionRate: 0,
    errorCount: 0,
  });

  const startTimeRef = useRef<number>(Date.now());
  const isVisibleRef = useRef<boolean>(false);

  const trackView = useCallback(() => {
    if (!enableAnalytics || !trackInteractions) return;

    setAnalytics(prev => ({
      ...prev,
      viewCount: prev.viewCount + 1,
    }));

    // Send to analytics service
    if (debug) {
      console.log('Card viewed:', analytics);
    }
  }, [enableAnalytics, trackInteractions, debug]);

  const trackClick = useCallback(() => {
    if (!enableAnalytics || !trackInteractions) return;

    setAnalytics(prev => ({
      ...prev,
      clickCount: prev.clickCount + 1,
      interactionTime: Date.now() - startTimeRef.current,
    }));

    // Send to analytics service
    if (debug) {
      console.log('Card clicked:', analytics);
    }
  }, [enableAnalytics, trackInteractions, debug]);

  const trackHover = useCallback(() => {
    if (!enableAnalytics || !trackInteractions) return;

    setAnalytics(prev => ({
      ...prev,
      hoverCount: prev.hoverCount + 1,
    }));
  }, [enableAnalytics, trackInteractions]);

  useEffect(() => {
    setAnalytics(prev => ({
      ...prev,
      interactionTime: Date.now() - startTimeRef.current,
    }));
  }, []);

  // Intersection Observer for view tracking
  useEffect(() => {
    if (!enableAnalytics) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisibleRef.current) {
            isVisibleRef.current = true;
            trackView();
          } else if (!entry.isIntersecting && isVisibleRef.current) {
            isVisibleRef.current = false;
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`card-${props.id || 'unknown'}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [enableAnalytics, trackView, props.id]);

  return {
    analytics,
    trackClick,
    trackHover,
    trackView,
  };
};

// =============================================================================
// EDUCATIONAL CONTEXT HOOK
// =============================================================================

/**
 * Custom hook for educational context awareness
 */
const useEducationalCardContext = (props: CardProps) => {
  const {
    educationalType = 'standard',
    educationalContext,
    showProgress = false,
    showAchievement = false,
    learningHints = [],
  } = props;

  const [learningProgress, setLearningProgress] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [currentHint, setCurrentHint] = useState<string | null>(null);

  const updateProgress = useCallback((progress: number) => {
    setLearningProgress(progress);
    
    // Award achievements based on progress
    if (progress >= 100 && !achievements.includes('completed')) {
      setAchievements(prev => [...prev, 'completed']);
    }
  }, [achievements]);

  const getCurrentHint = useCallback(() => {
    if (learningHints.length > 0) {
      const randomHint = learningHints[Math.floor(Math.random() * learningHints.length)];
      setCurrentHint(randomHint);
    }
  }, [learningHints]);

  return {
    learningProgress,
    achievements,
    currentHint,
    updateProgress,
    getCurrentHint,
    educationalType,
    educationalContext,
  };
};

// =============================================================================
// MAIN CARD COMPONENT
// =============================================================================

/**
 * Enterprise Card Intelligence Platform
 * 
 * A comprehensive card component with AI-powered optimization,
 * advanced analytics, educational intelligence, and enterprise-grade features.
 */
const EnterpriseCard: React.FC<CardProps> = (props) => {
  // Destructure props with defaults
  const {
    variant = 'default',
    size = 'md',
    animation = 'none',
    theme = 'auto',
    educationalType = 'standard',
    glass = false,
    gradient,
    neonColor,
    glowIntensity = 'medium',
    borderRadius = 'lg',
    shadow = 'md',
    padding = 'md',
    title,
    subtitle,
    description,
    image,
    icon,
    leftIcon,
    rightIcon,
    badge,
    counter,
    progress,
    content,
    isLoading = false,
    isSelected = false,
    isDisabled = false,
    isHovered = false,
    expanded = false,
    collapsed = false,
    onClick,
    onHover,
    onFocus,
    onExpand,
    onCollapse,
    enableAI = false,
    enableAnalytics = false,
    trackInteractions = false,
    optimizationTarget = 'engagement',
    showProgress = false,
    showAchievement = false,
    interactiveTutorial = false,
    contextualHelp = false,
    learningHints = [],
    ariaDescribedBy,
    ariaExpanded,
    ariaLabel,
    role = 'article',
    tabIndex = 0,
    lazyLoad = false,
    memoize = true,
    virtualize = false,
    layout = 'vertical',
    columns = 1,
    responsive = true,
    className = '',
    style,
    customClasses = {},
    debug = false,
    showPerformanceMetrics = false,
    enableLogging = false,
    children,
    ...restProps
  } = props;

  // State management
  const [isFocused, setIsFocused] = useState(false);
  const [isCurrentlyHovered, setIsCurrentlyHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  // Custom hooks
  const { analytics, trackClick, trackHover, trackView } = useCardAnalytics(props);
  const aiOptimization = useAICardOptimization(props);
  const educationalContext = useEducationalCardContext(props);

  // Generate classes and animations
  const cardClasses = useMemo(
    () => generateCardClasses(props),
    [props]
  );

  const animationVariants = useMemo(
    () => generateCardAnimationVariants(animation),
    [animation]
  );

  // Event handlers
  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled || isLoading) return;

    trackClick();
    
    onClick?.(event, analytics);
  }, [onClick, analytics, trackClick, isDisabled, isLoading]);

  const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setIsCurrentlyHovered(true);
    trackHover();
    onHover?.(event, analytics);
  }, [onHover, analytics, trackHover]);

  const handleMouseLeave = useCallback(() => {
    setIsCurrentlyHovered(false);
  }, []);

  const handleFocus = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
    onExpand?.();
  }, [isExpanded, onExpand]);

  const handleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
    onCollapse?.();
  }, [isCollapsed, onCollapse]);

  // Render loading state
  if (isLoading) {
    return (
      <motion.div
        className={cardClasses}
        initial="initial"
        animate="animate"
        variants={animationVariants}
        role="status"
        aria-label="Loading card content"
        {...restProps}
      >
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </motion.div>
    );
  }

  // Merge content props with content object
  const finalContent = content ? {
    title: title || content.title,
    subtitle: subtitle || content.subtitle,
    description: description || content.description,
    image: image || content.image,
    icon: icon || content.icon,
    ...content,
  } : { title, subtitle, description, image, icon };

  return (
    <motion.div
      id={props.id || `card-${Date.now()}`}
      className={cardClasses}
      variants={animationVariants}
      initial="initial"
      animate="animate"
      whileHover="whileHover"
      onClick={onClick ? handleClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-label={ariaLabel || finalContent.title}
      role={role}
      tabIndex={isDisabled ? -1 : tabIndex}
      style={style}
      {...restProps}
    >
      {/* Card Header */}
      {(finalContent.title || finalContent.icon || badge) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            {finalContent.icon && (
              <div className="mr-3 text-current">
                {finalContent.icon}
              </div>
            )}
            <div>
              {finalContent.title && (
                <h3 className="text-lg font-semibold text-current">
                  {finalContent.title}
                </h3>
              )}
              {finalContent.subtitle && (
                <p className="text-sm opacity-70 mt-1">
                  {finalContent.subtitle}
                </p>
              )}
            </div>
          </div>
          
          {badge && (
            <div className="ml-2">
              {badge}
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="flex-1">
        {finalContent.image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            {typeof finalContent.image === 'string' ? (
              <img
                src={finalContent.image}
                alt={finalContent.title || 'Card image'}
                className="w-full h-48 object-cover"
              />
            ) : (
              finalContent.image
            )}
          </div>
        )}
        
        {finalContent.description && (
          <p className="text-sm opacity-80 leading-relaxed mb-4">
            {finalContent.description}
          </p>
        )}

        {children}
      </div>

      {/* Progress Indicator */}
      {showProgress && (progress !== undefined || educationalContext.learningProgress > 0) && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="opacity-70">Progress</span>
            <span className="opacity-70">
              {progress !== undefined ? `${progress}%` : `${educationalContext.learningProgress}%`}
            </span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-2">
            <motion.div
              className="h-2 bg-current rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${progress !== undefined ? progress : educationalContext.learningProgress}%` 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Achievement Badges */}
      {showAchievement && educationalContext.achievements.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            {educationalContext.achievements.map((achievement, index) => (
              <motion.div
                key={achievement}
                className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                title={`Achievement: ${achievement}`}
              >
                <span className="text-xs">🏆</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Counter Badge */}
      {counter !== undefined && counter > 0 && (
        <motion.span
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          {counter > 99 ? '99+' : counter}
        </motion.span>
      )}

      {/* Expand/Collapse Button */}
      {(onExpand || onCollapse) && (
        <button
          className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            if (onExpand && !isExpanded) {
              handleExpand();
            } else if (onCollapse && !isCollapsed) {
              handleCollapse();
            }
          }}
          aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ↓
          </motion.div>
        </button>
      )}

      {/* Educational hints */}
      {contextualHelp && educationalContext.currentHint && (
        <motion.div
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {educationalContext.currentHint}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </motion.div>
      )}

      {/* AI optimization suggestions (debug mode) */}
      {debug && enableAI && aiOptimization && (
        <div className="absolute top-full mt-2 left-0 bg-yellow-100 border border-yellow-400 rounded p-3 text-xs text-yellow-800 z-10">
          <div className="font-bold mb-1">AI Suggestions:</div>
          <div>Variant: {aiOptimization.suggestedVariant}</div>
          <div>Size: {aiOptimization.suggestedSize}</div>
          <div>Layout: {aiOptimization.suggestedLayout}</div>
          <div>Confidence: {(aiOptimization.confidence * 100).toFixed(1)}%</div>
        </div>
      )}

      {/* Performance metrics (debug mode) */}
      {showPerformanceMetrics && debug && (
        <div className="absolute top-full mt-2 right-0 bg-blue-100 border border-blue-400 rounded p-3 text-xs text-blue-800 z-10">
          <div className="font-bold mb-1">Metrics:</div>
          <div>Views: {analytics.viewCount}</div>
          <div>Clicks: {analytics.clickCount}</div>
          <div>Hovers: {analytics.hoverCount}</div>
          <div>Engagement: {(analytics.engagementRate * 100).toFixed(1)}%</div>
        </div>
      )}

      {/* Hover Glow Effect */}
      {isCurrentlyHovered && glowIntensity !== 'none' && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none -z-10"
          style={{
            boxShadow: `0 0 ${glowIntensity === 'extreme' ? '50px' : glowIntensity === 'strong' ? '30px' : '20px'} rgba(59, 130, 246, 0.2)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};

// =============================================================================
// COMPONENT VARIANTS FOR SPECIALIZED USE CASES
// =============================================================================

/**
 * Quiz-specific card with educational features
 */
export const QuizCard: React.FC<CardProps> = (props) => {
  return (
    <EnterpriseCard
      {...props}
      variant="quiz"
      educationalType="quiz"
      educationalContext={{
        learningPhase: 'assessment',
        difficultyLevel: 'intermediate',
        subjectArea: 'General',
        progressTracking: true,
        achievementBadges: true,
        interactiveElements: true,
        multimediaContent: false,
      }}
      showProgress={true}
      showAchievement={true}
      enableAnalytics={true}
    />
  );
};

/**
 * Achievement card for gamification
 */
export const AchievementCard: React.FC<CardProps> = {
  /* Implementation would go here */
} as any;

/**
 * Progress tracking card
 */
export const ProgressCard: React.FC<CardProps> = {
  /* Implementation would go here */
} as any;

/**
 * Interactive tutorial card
 */
export const TutorialCard: React.FC<CardProps> = {
  /* Implementation would go here */
} as any;

/**
 * Learning content card
 */
export const LearningCard: React.FC<CardProps> = {
  /* Implementation would go here */
} as any;

/**
 * Milestone card for educational tracking
 */
export const MilestoneCard: React.FC<CardProps> = {
  /* Implementation would go here */
} as any;

// =============================================================================
// EXPORTS
// =============================================================================

export default EnterpriseCard;

// Type exports for external use
export type {
  CardProps,
  CardVariant,
  CardSize,
  CardAnimation,
  CardTheme,
  EducationalCardType,
  CardAnalytics,
  AICardOptimization,
  EducationalCardContext,
  CardContent,
};

// Component variant exports
export {
  QuizCard,
  AchievementCard,
  ProgressCard,
  TutorialCard,
  LearningCard,
  MilestoneCard,
};

// Additional utility exports
export {
  generateCardClasses,
  generateCardAnimationVariants,
  useCardAnalytics,
  useAICardOptimization,
  useEducationalCardContext,
};