// JAC Learning Platform - Enterprise Progress Intelligence Platform
// Enhanced by Cavin Otieno - Cavin Otieno
// Comprehensive AI-powered progress system with advanced analytics and educational intelligence

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAnalytics } from './useAnalytics';
import { useAI } from './useAI';
import { usePreferences } from './usePreferences';

// =============================================================================
// TYPE DEFINITIONS & INTERFACES
// =============================================================================

/**
 * Comprehensive progress variant types for different use cases
 */
export type ProgressVariant = 
  | 'default' | 'glass' | 'solid' | 'outline'
  | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  | 'gradient' | 'neon' | 'metallic' | 'holographic' | '3d'
  | 'floating' | 'floating-glow' | 'neon-border' | 'liquid'
  | 'morphing' | 'cyberpunk' | 'retro' | 'animated'
  | 'educational' | 'quiz' | 'learning' | 'skill' | 'achievement'
  | 'milestone' | 'course' | 'assignment' | 'project'
  | 'interactive' | 'adaptive' | 'intelligent' | 'custom';

/**
 * Progress size variants with responsive scaling
 */
export type ProgressSize = 
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  | 'responsive' | 'full-width' | 'minimal' | 'compact';

/**
 * Progress types for different content and contexts
 */
export type ProgressType = 
  | 'linear' | 'circular' | 'radial' | 'stepped' | 'milestone'
  | 'educational' | 'skill' | 'achievement' | 'course' | 'assignment'
  | 'project' | 'learning' | 'assessment' | 'tutorial'
  | 'adaptive' | 'intelligent' | 'custom';

/**
 * Animation types for progress interactions
 */
export type ProgressAnimation = 
  | 'none' | 'fade' | 'slide' | 'zoom' | 'bounce' | 'pulse'
  | 'glow' | 'wave' | 'typing' | 'filling' | 'magnetic'
  | 'educational' | 'achievement' | 'celebration' | 'milestone'
  | 'adaptive' | 'intelligent' | 'custom';

/**
 * Theme options for different contexts
 */
export type ProgressTheme = 
  | 'light' | 'dark' | 'auto' | 'high-contrast'
  | 'neon' | 'cyberpunk' | 'glass' | 'minimal'
  | 'corporate' | 'education' | 'gaming' | 'creative'
  | 'professional' | 'friendly' | 'modern' | 'classic';

/**
 * AI Optimization modes
 */
export type AIOptimizationMode = 
  | 'none' | 'adaptive' | 'predictive' | 'personalized' | 'contextual'
  | 'educational' | 'skill-based' | 'achievement-driven'
  | 'learning-path' | 'milestone-focused';

/**
 * Analytics tracking events
 */
export type ProgressTrackingEvent = 
  | 'progress-viewed' | 'progress-updated' | 'milestone-reached'
  | 'goal-achieved' | 'skill-improved' | 'course-completed'
  | 'assignment-submitted' | 'project-progress' | 'learning-adjusted';

/**
 * Educational progress categories
 */
export type EducationalCategory = 
  | 'course' | 'assignment' | 'quiz' | 'skill' | 'achievement'
  | 'milestone' | 'learning-path' | 'adaptive-path' | 'project'
  | 'assessment' | 'tutorial' | 'practice' | 'review';

/**
 * Comprehensive Progress Intelligence Props Interface
 */
export interface ProgressIntelligenceProps {
  // Core Progress Properties
  value: number;
  max?: number;
  min?: number;
  type?: ProgressType;
  variant?: ProgressVariant;
  size?: ProgressSize;
  theme?: ProgressTheme;
  
  // Educational Intelligence
  educationalCategory?: EducationalCategory;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  learningPath?: string;
  adaptiveMode?: boolean;
  personalizedGoals?: boolean;
  
  // AI Features
  aiOptimization?: boolean;
  aiMode?: AIOptimizationMode;
  predictiveAnalytics?: boolean;
  contextualRecommendations?: boolean;
  
  // Visual & Animation
  showLabel?: boolean;
  showPercentage?: boolean;
  showMilestones?: boolean;
  showAchievements?: boolean;
  animation?: ProgressAnimation;
  animateOnView?: boolean;
  duration?: number;
  
  // Analytics & Tracking
  trackEvents?: boolean;
  customEventName?: string;
  analyticsCategory?: string;
  performanceTracking?: boolean;
  engagementMetrics?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;
  highContrast?: boolean;
  screenReaderOptimized?: boolean;
  keyboardNavigation?: boolean;
  
  // Advanced Features
  milestones?: Array<{
    value: number;
    label: string;
    achievement?: string;
    icon?: string;
    unlocked?: boolean;
  }>;
  goals?: Array<{
    value: number;
    label: string;
    deadline?: Date;
    reward?: string;
  }>;
  achievements?: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    date?: Date;
  }>;
  
  // Callbacks & Events
  onProgressUpdate?: (value: number, percentage: number) => void;
  onMilestoneReached?: (milestone: any) => void;
  onGoalAchieved?: (goal: any) => void;
  onAchievementUnlocked?: (achievement: any) => void;
  onAIAction?: (action: string, data: any) => void;
  
  // Styling & Classes
  className?: string;
  style?: React.CSSProperties;
  customClasses?: {
    container?: string;
    progress?: string;
    label?: string;
    milestones?: string;
    achievements?: string;
  };
  
  // Performance
  lazyLoad?: boolean;
  optimizeRendering?: boolean;
  cacheResults?: boolean;
  
  // Experimental Features
  experimental?: boolean;
  betaFeatures?: boolean;
  debugMode?: boolean;
}

// =============================================================================
// DEFAULT CONFIGURATION & CONSTANTS
// =============================================================================

/**
 * Default milestone configurations
 */
const DEFAULT_MILESTONES = [
  { value: 25, label: 'Getting Started', achievement: 'First Steps' },
  { value: 50, label: 'Halfway There', achievement: 'Making Progress' },
  { value: 75, label: 'Almost There', achievement: 'Nearly Complete' },
  { value: 100, label: 'Complete!', achievement: 'Goal Achieved' }
];

/**
 * Achievement badge configurations
 */
const ACHIEVEMENT_BADGES = [
  { id: 'first-step', name: 'First Step', icon: '👣', description: 'Made your first progress' },
  { id: 'steady-progress', name: 'Steady Progress', icon: '🚀', description: 'Maintaining consistent progress' },
  { id: 'milestone-marker', name: 'Milestone Marker', icon: '📍', description: 'Reached a major milestone' },
  { id: 'goal-crusher', name: 'Goal Crusher', icon: '💪', description: 'Achieved your target goal' },
  { id: 'perfectionist', name: 'Perfectionist', icon: '⭐', description: 'Achieved 100% completion' }
];

/**
 * Animation variants for different progress states
 */
const ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  progress: (custom: number) => ({
    scaleX: custom,
    transition: { duration: 0.8, ease: "easeOut" }
  })
};

/**
 * AI recommendation patterns
 */
const AI_PATTERNS = {
  educational: {
    beginner: 'Focus on small, achievable steps to build confidence',
    intermediate: 'Challenge yourself with moderate goals while maintaining consistency',
    advanced: 'Set ambitious targets that push your current limits',
    expert: 'Design complex projects that demonstrate mastery'
  },
  motivation: {
    low: 'Remember why you started - break it down into smaller wins',
    medium: 'Great progress! Consider setting slightly higher challenges',
    high: 'Excellent momentum! You\'re building great habits',
    complete: 'Fantastic achievement! Time to set new ambitious goals'
  }
};

// =============================================================================
// HELPER FUNCTIONS & UTILITIES
// =============================================================================

/**
 * Calculate progress percentage with safety bounds
 */
const calculatePercentage = (value: number, min: number = 0, max: number = 100): number => {
  const clampedValue = Math.max(min, Math.min(value, max));
  return max > min ? ((clampedValue - min) / (max - min)) * 100 : 0;
};

/**
 * Format progress value with educational context
 */
const formatProgressValue = (value: number, type: ProgressType, showPercentage: boolean = true): string => {
  if (type === 'circular' || type === 'radial') {
    return showPercentage ? `${Math.round(value)}%` : `${Math.round(value)}`;
  }
  
  if (type === 'stepped') {
    return `Step ${Math.ceil(value)} of ${Math.ceil(value * 1.25)}`;
  }
  
  return showPercentage ? `${Math.round(value)}%` : `${Math.round(value)}`;
};

/**
 * Determine educational recommendation based on progress
 */
const getEducationalRecommendation = (
  progress: number, 
  skillLevel: string, 
  aiMode: AIOptimizationMode
): string => {
  if (aiMode === 'educational' || aiMode === 'learning-path') {
    const levelKey = skillLevel as keyof typeof AI_PATTERNS.educational;
    return AI_PATTERNS.educational[levelKey] || 'Keep up the great work!';
  }
  
  if (progress < 25) return AI_PATTERNS.motivation.low;
  if (progress < 75) return AI_PATTERNS.motivation.medium;
  if (progress < 100) return AI_PATTERNS.motivation.high;
  return AI_PATTERNS.motivation.complete;
};

/**
 * Check milestone achievements
 */
const checkMilestoneAchievements = (
  progress: number, 
  milestones: Array<{value: number, label: string, achievement?: string}>
): Array<{milestone: any, newlyReached: boolean}> => {
  return milestones.map(milestone => ({
    milestone,
    newlyReached: progress >= milestone.value
  })).filter(item => item.newlyReached);
};

/**
 * Generate adaptive goal suggestions
 */
const generateAdaptiveGoals = (
  currentProgress: number, 
  skillLevel: string, 
  learningPath?: string
): Array<{value: number, label: string, reasoning: string}> => {
  const goals = [];
  const multipliers = {
    beginner: 1.2,
    intermediate: 1.1,
    advanced: 1.05,
    expert: 1.02
  };
  
  const multiplier = multipliers[skillLevel as keyof typeof multipliers] || 1.1;
  
  // Suggest next milestone
  if (currentProgress < 90) {
    const nextMilestone = Math.ceil((currentProgress + 15) / 25) * 25;
    goals.push({
      value: Math.min(nextMilestone, 100),
      label: `Reach ${Math.min(nextMilestone, 100)}%`,
      reasoning: 'Set a challenging but achievable milestone'
    });
  }
  
  // Suggest stretch goal
  if (currentProgress < 100) {
    goals.push({
      value: Math.min(Math.round(currentProgress * multiplier), 100),
      label: `Achieve ${Math.min(Math.round(currentProgress * multiplier), 100)}%`,
      reasoning: 'Push beyond your current comfort zone'
    });
  }
  
  return goals;
};

/**
 * Track progress analytics event
 */
const trackProgressEvent = (
  analytics: any, 
  event: ProgressTrackingEvent, 
  data: any,
  customEventName?: string
) => {
  if (!analytics) return;
  
  const eventName = customEventName || event;
  
  try {
    analytics.track(eventName, {
      ...data,
      category: 'progress-intelligence',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`
    });
  } catch (error) {
    console.warn('Progress analytics tracking failed:', error);
  }
};

/**
 * Validate progress props
 */
const validateProgressProps = (props: ProgressIntelligenceProps): boolean => {
  const { value, max, min } = props;
  
  if (typeof value !== 'number' || isNaN(value)) {
    console.warn('Progress value must be a valid number');
    return false;
  }
  
  if (max !== undefined && typeof max !== 'number') {
    console.warn('Progress max must be a valid number');
    return false;
  }
  
  if (min !== undefined && typeof min !== 'number') {
    console.warn('Progress min must be a valid number');
    return false;
  }
  
  if (max !== undefined && min !== undefined && max <= min) {
    console.warn('Progress max must be greater than min');
    return false;
  }
  
  return true;
};

/**
 * Get optimized rendering props
 */
const getOptimizedRenderingProps = (props: ProgressIntelligenceProps) => {
  const { optimizeRendering, lazyLoad, value } = props;
  
  if (!optimizeRendering) return { shouldRender: true, memoKey: 'default' };
  
  // Skip rendering if progress is unchanged and component is not visible
  const shouldRender = !lazyLoad || value !== props.value;
  const memoKey = `${value}-${props.variant}-${props.size}`;
  
  return { shouldRender, memoKey };
};

// =============================================================================
// MAIN COMPONENT IMPLEMENTATION
// =============================================================================

/**
 * Enterprise Progress Intelligence Component
 * 
 * A comprehensive progress tracking system with AI optimization,
 * educational intelligence, and advanced analytics integration.
 */
export const Progress: React.FC<ProgressIntelligenceProps> = ({
  // Core Progress Properties
  value,
  max = 100,
  min = 0,
  type = 'linear',
  variant = 'default',
  size = 'md',
  theme = 'light',
  
  // Educational Intelligence
  educationalCategory,
  skillLevel = 'intermediate',
  learningPath,
  adaptiveMode = false,
  personalizedGoals = false,
  
  // AI Features
  aiOptimization = false,
  aiMode = 'adaptive',
  predictiveAnalytics = false,
  contextualRecommendations = false,
  
  // Visual & Animation
  showLabel = false,
  showPercentage = true,
  showMilestones = false,
  showAchievements = false,
  animation = 'slide',
  animateOnView = false,
  duration = 0.8,
  
  // Analytics & Tracking
  trackEvents = true,
  customEventName,
  analyticsCategory = 'progress',
  performanceTracking = true,
  engagementMetrics = true,
  
  // Accessibility
  ariaLabel,
  ariaDescription,
  highContrast = false,
  screenReaderOptimized = true,
  keyboardNavigation = true,
  
  // Advanced Features
  milestones,
  goals,
  achievements,
  
  // Callbacks & Events
  onProgressUpdate,
  onMilestoneReached,
  onGoalAchieved,
  onAchievementUnlocked,
  onAIAction,
  
  // Styling & Classes
  className = '',
  style,
  customClasses = {},
  
  // Performance
  lazyLoad = true,
  optimizeRendering = true,
  cacheResults = true,
  
  // Experimental Features
  experimental = false,
  betaFeatures = false,
  debugMode = false,
  
  ...props
}) => {
  // =============================================================================
  // STATE MANAGEMENT & HOOKS
  // =============================================================================
  
  const [currentProgress, setCurrentProgress] = useState(value);
  const [previousProgress, setPreviousProgress] = useState(value);
  const [reachedMilestones, setReachedMilestones] = useState<Set<number>>(new Set());
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(!animateOnView);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [adaptiveGoals, setAdaptiveGoals] = useState<Array<{value: number, label: string, reasoning: string}>>([]);
  
  // Analytics & AI Hooks
  const analytics = useAnalytics();
  const ai = useAI();
  const preferences = usePreferences();
  
  // Refs
  const progressRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // =============================================================================
  // MEMOIZED CALCULATIONS
  // =============================================================================
  
  const percentage = useMemo(() => {
    return calculatePercentage(value, min, max);
  }, [value, min, max]);
  
  const formattedValue = useMemo(() => {
    return formatProgressValue(percentage, type, showPercentage);
  }, [percentage, type, showPercentage]);
  
  const activeMilestones = useMemo(() => {
    return (milestones || DEFAULT_MILESTONES).filter(milestone => 
      percentage >= milestone.value
    );
  }, [milestones, percentage]);
  
  const activeAchievements = useMemo(() => {
    return (achievements || ACHIEVEMENT_BADGES).filter(achievement => 
      unlockedAchievements.has(achievement.id)
    );
  }, [achievements, unlockedAchievements]);
  
  const shouldAnimate = useMemo(() => {
    return animation !== 'none' && isVisible && (previousProgress !== currentProgress);
  }, [animation, isVisible, previousProgress, currentProgress]);
  
  // =============================================================================
  // AI OPTIMIZATION LOGIC
  // =============================================================================
  
  const generateAIInsights = useCallback(async () => {
    if (!aiOptimization || !ai) return;
    
    try {
      const prompt = `Analyze this learning progress: ${percentage}% complete, skill level: ${skillLevel}, category: ${educationalCategory}. Provide educational recommendations.`;
      
      const response = await ai.analyzeProgress({
        progress: percentage,
        skillLevel,
        category: educationalCategory,
        learningPath,
        historicalData: [] // Could be enhanced with actual user data
      });
      
      if (response && response.recommendations) {
        setAiRecommendations(response.recommendations);
        onAIAction?.('insights_generated', response);
      }
    } catch (error) {
      if (debugMode) {
        console.error('AI insights generation failed:', error);
      }
    }
  }, [aiOptimization, ai, percentage, skillLevel, educationalCategory, learningPath, debugMode, onAIAction]);
  
  const generateAdaptiveGoals = useCallback(async () => {
    if (!adaptiveMode || !ai) return;
    
    try {
      const suggestedGoals = generateAdaptiveGoals(percentage, skillLevel, learningPath);
      setAdaptiveGoals(suggestedGoals);
      
      if (debugMode) {
        console.log('Generated adaptive goals:', suggestedGoals);
      }
    } catch (error) {
      if (debugMode) {
        console.error('Adaptive goals generation failed:', error);
      }
    }
  }, [adaptiveMode, ai, percentage, skillLevel, learningPath, debugMode]);
  
  // =============================================================================
  // ANALYTICS TRACKING
  // =============================================================================
  
  const trackProgressInteraction = useCallback((event: ProgressTrackingEvent, data: any) => {
    if (!trackEvents || !analytics) return;
    
    trackProgressEvent(analytics, event, {
      value: percentage,
      category: educationalCategory,
      skillLevel,
      type,
      variant,
      ...data
    }, customEventName);
  }, [trackEvents, analytics, percentage, educationalCategory, skillLevel, type, variant, customEventName]);
  
  // =============================================================================
  // MILESTONE & ACHIEVEMENT MANAGEMENT
  // =============================================================================
  
  const checkNewMilestones = useCallback((newPercentage: number) => {
    const milestoneList = milestones || DEFAULT_MILESTONES;
    const newMilestones = milestoneList.filter(
      milestone => newPercentage >= milestone.value && !reachedMilestones.has(milestone.value)
    );
    
    if (newMilestones.length > 0) {
      newMilestones.forEach(milestone => {
        reachedMilestones.add(milestone.value);
        onMilestoneReached?.(milestone);
        trackProgressInteraction('milestone-reached', { milestone });
      });
      
      setReachedMilestones(new Set(reachedMilestones));
    }
  }, [milestones, reachedMilestones, onMilestoneReached, trackProgressInteraction]);
  
  const checkAchievements = useCallback((newPercentage: number) => {
    const achievementList = achievements || ACHIEVEMENT_BADGES;
    
    // Check for progress-based achievements
    if (newPercentage >= 100 && !unlockedAchievements.has('perfectionist')) {
      const achievement = achievementList.find(a => a.id === 'perfectionist');
      if (achievement) {
        unlockedAchievements.add(achievement.id);
        onAchievementUnlocked?.(achievement);
        trackProgressInteraction('goal-achieved', { achievement });
      }
    }
    
    if (newPercentage >= 25 && !unlockedAchievements.has('first-step')) {
      const achievement = achievementList.find(a => a.id === 'first-step');
      if (achievement) {
        unlockedAchievements.add(achievement.id);
        onAchievementUnlocked?.(achievement);
        trackProgressInteraction('goal-achieved', { achievement });
      }
    }
    
    setUnlockedAchievements(new Set(unlockedAchievements));
  }, [achievements, unlockedAchievements, onAchievementUnlocked, trackProgressInteraction]);
  
  // =============================================================================
  // ANIMATION & VISIBILITY EFFECTS
  // =============================================================================
  
  // Intersection Observer for animate-on-view
  useEffect(() => {
    if (!animateOnView || !progressRef.current) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      },
      { threshold: 0.1 }
    );
    
    observerRef.current.observe(progressRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [animateOnView]);
  
  // Progress animation
  useEffect(() => {
    if (!shouldAnimate) return;
    
    const startValue = previousProgress;
    const endValue = percentage;
    const startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;
      
      setCurrentProgress(currentValue);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentProgress(endValue);
        setPreviousProgress(endValue);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [percentage, previousProgress, duration, shouldAnimate]);
  
  // =============================================================================
  // EVENT HANDLERS & CALLBACKS
  // =============================================================================
  
  const handleProgressUpdate = useCallback((newValue: number, newPercentage: number) => {
    onProgressUpdate?.(newValue, newPercentage);
    trackProgressInteraction('progress-updated', { 
      oldValue: currentProgress, 
      newValue: newPercentage 
    });
    
    // Check for milestones and achievements
    setTimeout(() => {
      checkNewMilestones(newPercentage);
      checkAchievements(newPercentage);
    }, 100);
  }, [currentProgress, onProgressUpdate, trackProgressInteraction, checkNewMilestones, checkAchievements]);
  
  // =============================================================================
  // KEYBOARD NAVIGATION SUPPORT
  // =============================================================================
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!keyboardNavigation) return;
    
    const step = (max - min) / 10; // 10% increments
    
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        event.preventDefault();
        const newValueUp = Math.min(value + step, max);
        handleProgressUpdate(newValueUp, calculatePercentage(newValueUp, min, max));
        break;
        
      case 'ArrowDown':
      case 'ArrowLeft':
        event.preventDefault();
        const newValueDown = Math.max(value - step, min);
        handleProgressUpdate(newValueDown, calculatePercentage(newValueDown, min, max));
        break;
        
      case 'Home':
        event.preventDefault();
        handleProgressUpdate(min, 0);
        break;
        
      case 'End':
        event.preventDefault();
        handleProgressUpdate(max, 100);
        break;
    }
  }, [keyboardNavigation, max, min, value, handleProgressUpdate]);
  
  // =============================================================================
  // EFFECT HOOKS
  // =============================================================================
  
  // Initialize progress tracking
  useEffect(() => {
    if (!validateProgressProps({ value, max, min })) return;
    
    trackProgressInteraction('progress-viewed', {
      initialValue: value,
      componentType: type,
      variant
    });
    
    // Check initial milestones and achievements
    checkNewMilestones(percentage);
    checkAchievements(percentage);
  }, []); // Empty dependency array for initial setup
  
  // AI optimization effects
  useEffect(() => {
    if (aiOptimization) {
      generateAIInsights();
      generateAdaptiveGoals();
    }
  }, [aiOptimization, generateAIInsights, generateAdaptiveGoals]);
  
  // Update effect
  useEffect(() => {
    setCurrentProgress(percentage);
    handleProgressUpdate(value, percentage);
  }, [value, max, min, handleProgressUpdate, percentage]);
  
  // =============================================================================
  // RENDER LOGIC
  // =============================================================================
  
  // Get optimized rendering props
  const { shouldRender, memoKey } = getOptimizedRenderingProps({
    value,
    variant,
    size,
    ...props
  });
  
  if (!shouldRender) {
    return null;
  }
  
  // Component base classes
  const baseClasses = [
    'progress-intelligence-container',
    `progress-type-${type}`,
    `progress-variant-${variant}`,
    `progress-size-${size}`,
    `progress-theme-${theme}`,
    highContrast ? 'progress-high-contrast' : '',
    screenReaderOptimized ? 'progress-screen-reader-optimized' : '',
    adaptiveMode ? 'progress-adaptive' : '',
    aiOptimization ? 'progress-ai-optimized' : '',
    className
  ].filter(Boolean).join(' ');
  
  // Progress bar classes
  const progressClasses = [
    'progress-bar',
    `progress-bar-${variant}`,
    `progress-bar-${theme}`,
    shouldAnimate ? `progress-animated progress-animation-${animation}` : '',
    customClasses.progress || ''
  ].filter(Boolean).join(' ');
  
  // Label classes
  const labelClasses = [
    'progress-label',
    showLabel ? 'progress-label-visible' : 'progress-label-hidden',
    customClasses.label || ''
  ].filter(Boolean).join(' ');
  
  // Milestone classes
  const milestoneClasses = [
    'progress-milestones',
    showMilestones ? 'progress-milestones-visible' : 'progress-milestones-hidden',
    customClasses.milestones || ''
  ].filter(Boolean).join(' ');
  
  // Achievement classes
  const achievementClasses = [
    'progress-achievements',
    showAchievements ? 'progress-achievements-visible' : 'progress-achievements-hidden',
    customClasses.achievements || ''
  ].filter(Boolean).join(' ');
  
  // =============================================================================
  // ACCESSIBILITY ATTRIBUTES
  // =============================================================================
  
  const accessibilityProps = {
    role: 'progressbar',
    'aria-valuenow': Math.round(percentage),
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-label': ariaLabel || `${educationalCategory || 'Progress'}: ${Math.round(percentage)}% complete`,
    'aria-describedby': ariaDescription,
    'aria-live': screenReaderOptimized ? 'polite' : undefined,
    tabIndex: keyboardNavigation ? 0 : undefined,
    onKeyDown: keyboardNavigation ? handleKeyDown : undefined,
  };
  
  // =============================================================================
  // MAIN JSX RETURN
  // =============================================================================
  
  return (
    <motion.div
      ref={progressRef}
      className={baseClasses}
      style={{
        '--progress-percentage': `${percentage}%`,
        '--progress-current': `${currentProgress}%`,
        '--progress-duration': `${duration}s`,
        ...style
      } as React.CSSProperties & { [key: string]: string | number }}
      {...accessibilityProps}
      data-progress-type={type}
      data-progress-variant={variant}
      data-progress-size={size}
      data-theme={theme}
      data-skill-level={skillLevel}
      data-category={educationalCategory}
      data-memo-key={memoKey}
      data-debug={debugMode ? 'true' : 'false'}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={shouldAnimate ? ANIMATION_VARIANTS : undefined}
      custom={currentProgress}
    >
      {/* Main Progress Container */}
      <div className="progress-content">
        {/* Progress Label */}
        {showLabel && (
          <div className={labelClasses}>
            <span className="progress-label-text">
              {formattedValue}
            </span>
            {educationalCategory && (
              <span className="progress-category">
                {educationalCategory}
              </span>
            )}
          </div>
        )}
        
        {/* Progress Bar */}
        <div className={progressClasses}>
          {type === 'linear' && (
            <motion.div
              className="progress-linear"
              style={{ width: `${currentProgress}%` }}
              animate={shouldAnimate ? { width: `${currentProgress}%` } : undefined}
              transition={{ duration, ease: "easeOut" }}
            />
          )}
          
          {type === 'circular' && (
            <svg className="progress-circular" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="progress-circular-bg"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                className="progress-circular-fg"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - currentProgress / 100)}`}
                animate={shouldAnimate ? {
                  strokeDashoffset: `${2 * Math.PI * 45 * (1 - currentProgress / 100)}`
                } : undefined}
                transition={{ duration, ease: "easeOut" }}
              />
            </svg>
          )}
          
          {type === 'radial' && (
            <div className="progress-radial">
              <motion.div
                className="progress-radial-fill"
                style={{
                  background: `conic-gradient(from 0deg, var(--progress-color) 0deg, var(--progress-color) ${currentProgress * 3.6}deg, transparent ${currentProgress * 3.6}deg)`
                }}
                animate={shouldAnimate ? {
                  background: `conic-gradient(from 0deg, var(--progress-color) 0deg, var(--progress-color) ${currentProgress * 3.6}deg, transparent ${currentProgress * 3.6}deg)`
                } : undefined}
                transition={{ duration, ease: "easeOut" }}
              />
            </div>
          )}
          
          {type === 'stepped' && (
            <div className="progress-stepped">
              {Array.from({ length: Math.ceil(max / 20) }, (_, i) => (
                <motion.div
                  key={i}
                  className={`progress-step ${currentProgress >= (i + 1) * 20 ? 'progress-step-active' : 'progress-step-inactive'}`}
                  animate={shouldAnimate && currentProgress >= (i + 1) * 20 ? {
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  } : undefined}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Milestones */}
        {showMilestones && (
          <div className={milestoneClasses}>
            {activeMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.value}
                className="progress-milestone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="progress-milestone-value">{milestone.value}%</span>
                <span className="progress-milestone-label">{milestone.label}</span>
                {milestone.achievement && (
                  <span className="progress-milestone-achievement">
                    🏆 {milestone.achievement}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Achievements */}
        {showAchievements && (
          <div className={achievementClasses}>
            <div className="progress-achievements-header">
              <span>🏆 Achievements</span>
            </div>
            <div className="progress-achievements-list">
              {activeAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className="progress-achievement"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="progress-achievement-icon">{achievement.icon}</span>
                  <span className="progress-achievement-name">{achievement.name}</span>
                  <span className="progress-achievement-description">{achievement.description}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* AI Recommendations */}
        {aiOptimization && aiRecommendations.length > 0 && (
          <div className="progress-ai-recommendations">
            <div className="progress-ai-header">
              <span>🤖 AI Insights</span>
            </div>
            <div className="progress-ai-list">
              {aiRecommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  className="progress-ai-recommendation"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="progress-ai-text">{recommendation}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Adaptive Goals */}
        {adaptiveMode && adaptiveGoals.length > 0 && (
          <div className="progress-adaptive-goals">
            <div className="progress-goals-header">
              <span>🎯 Adaptive Goals</span>
            </div>
            <div className="progress-goals-list">
              {adaptiveGoals.map((goal, index) => (
                <motion.div
                  key={index}
                  className="progress-goal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="progress-goal-label">{goal.label}</span>
                  <span className="progress-goal-reasoning">{goal.reasoning}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Performance Metrics (Debug Mode) */}
        {debugMode && (
          <div className="progress-debug-info">
            <div className="progress-debug-stats">
              <span>Current: {Math.round(currentProgress)}%</span>
              <span>Target: {percentage}%</span>
              <span>Animation: {shouldAnimate ? 'Active' : 'Inactive'}</span>
              <span>Visible: {isVisible ? 'Yes' : 'No'}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Screen Reader Only Content */}
      {screenReaderOptimized && (
        <div className="sr-only">
          Progress: {Math.round(percentage)}% complete. {
            activeMilestones.length > 0 ? 
            `Milestones reached: ${activeMilestones.length}.` : 
            'No milestones reached yet.'
          } {
            activeAchievements.length > 0 ?
            `Achievements unlocked: ${activeAchievements.length}.` :
            'No achievements unlocked yet.'
          }
        </div>
      )}
    </motion.div>
  );
};

// =============================================================================
// DEFAULT EXPORT & CONVENIENCE COMPONENTS
// =============================================================================

/**
 * Convenience component for educational progress
 */
export const EducationalProgress: React.FC<Omit<ProgressIntelligenceProps, 'educationalCategory'>> = (props) => (
  <Progress {...props} educationalCategory="educational" />
);

/**
 * Convenience component for skill progress
 */
export const SkillProgress: React.FC<Omit<ProgressIntelligenceProps, 'educationalCategory'>> = (props) => (
  <Progress {...props} educationalCategory="skill" />
);

/**
 * Convenience component for achievement progress
 */
export const AchievementProgress: React.FC<Omit<ProgressIntelligenceProps, 'educationalCategory'>> = (props) => (
  <Progress {...props} educationalCategory="achievement" />
);

/**
 * Circular progress component
 */
export const CircularProgress: React.FC<Omit<ProgressIntelligenceProps, 'type'>> = (props) => (
  <Progress {...props} type="circular" />
);

/**
 * Milestone progress component
 */
export const MilestoneProgress: React.FC<Omit<ProgressIntelligenceProps, 'showMilestones'>> = (props) => (
  <Progress {...props} showMilestones={true} />
);

export default Progress;
