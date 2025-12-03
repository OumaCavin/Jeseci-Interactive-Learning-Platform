// JAC Learning Platform - Enterprise Input Intelligence Platform
// Enhanced by Cavin Otieno - Cavin Otieno
// Comprehensive AI-powered input system with advanced analytics and educational intelligence

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAnalytics } from './useAnalytics';
import { useAI } from './useAI';
import { usePreferences } from './usePreferences';

// =============================================================================
// TYPE DEFINITIONS & INTERFACES
// =============================================================================

/**
 * Comprehensive input variant types for different use cases
 */
export type InputVariant = 
  | 'default' | 'glass' | 'solid' | 'outline' | 'filled'
  | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  | 'gradient' | 'neon' | 'metallic' | 'holographic' | '3d'
  | 'floating' | 'floating-glow' | 'neon-border' | 'liquid'
  | 'morphing' | 'cyberpunk' | 'retro' | 'animated'
  | 'educational' | 'quiz' | 'progress' | 'achievement'
  | 'learning' | 'tutorial' | 'interactive' | 'custom';

/**
 * Input types for different content
 */
export type InputType = 
  | 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  | 'date' | 'time' | 'datetime-local' | 'month' | 'week'
  | 'color' | 'file' | 'range' | 'checkbox' | 'radio'
  | 'textarea' | 'select' | 'multi-select' | 'rich-text'
  | 'code' | 'markdown' | 'json' | 'sql'
  | 'signature' | 'rating' | 'tags' | 'chips';

/**
 * Animation types for input interactions
 */
export type InputAnimation = 
  | 'none' | 'fade' | 'slide' | 'zoom' | 'bounce' | 'pulse'
  | 'glow' | 'shake' | 'typing' | 'floating' | 'magnetic'
  | 'wave' | 'particle' | 'liquid' | 'neon' | 'cyber'
  | 'educational' | 'achievement' | 'custom';

/**
 * Theme options for different contexts
 */
export type InputTheme = 
  | 'light' | 'dark' | 'auto' | 'high-contrast'
  | 'neon' | 'cyberpunk' | 'glass' | 'minimal'
  | 'corporate' | 'education' | 'gaming' | 'creative';

/**
 * Educational input types for learning contexts
 */
export type EducationalInputType = 
  | 'standard' | 'learning' | 'quiz' | 'achievement'
  | 'progress' | 'exercise' | 'assessment' | 'tutorial'
  | 'lesson' | 'practice' | 'reference' | 'custom';

/**
 * Validation rule types
 */
export interface ValidationRule {
  type: 'required' | 'email' | 'url' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean | Promise<boolean>;
}

/**
 * Auto-complete suggestion
 */
export interface AutoCompleteSuggestion {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
  metadata?: Record<string, any>;
}

/**
 * Analytics event types for comprehensive tracking
 */
export interface InputAnalytics {
  viewCount: number;
  focusCount: number;
  inputCount: number;
  blurCount: number;
  submitCount: number;
  errorCount: number;
  correctionCount: number;
  completionTime: number;
  typingSpeed: number;
  backspaceCount: number;
  userSatisfaction: number;
  validationErrors: Record<string, number>;
  a/bTesting?: {
    variant: string;
    performance: number;
    confidence: number;
  };
}

/**
 * AI optimization data for intelligent recommendations
 */
export interface AIInputOptimization {
  suggestedVariant: InputVariant;
  suggestedType: InputType;
  suggestedValidation: ValidationRule[];
  suggestedPlaceholder: string;
  confidence: number;
  reasoning: string[];
  predictedPerformance: number;
  optimizationSuggestions: string[];
}

/**
 * Educational context for learning platforms
 */
export interface EducationalInputContext {
  learningPhase: 'introduction' | 'practice' | 'assessment' | 'mastery';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  subjectArea: string;
  progressTracking: boolean;
  achievementBadges: boolean;
  hintsEnabled: boolean;
  interactiveGuides: boolean;
}

/**
 * Input content and configuration
 */
export interface InputContent {
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  description?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  examples?: string[];
  tips?: string[];
  learningHints?: string[];
}

/**
 * Comprehensive input props interface
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Core functionality
  variant?: InputVariant;
  type?: InputType;
  animation?: InputAnimation;
  theme?: InputTheme;
  educationalType?: EducationalInputType;
  educationalContext?: EducationalInputContext;

  // Visual properties
  glass?: boolean;
  gradient?: string;
  neonColor?: string;
  glowIntensity?: 'subtle' | 'medium' | 'strong' | 'extreme';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  // Content
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  helper?: React.ReactNode;
  counter?: boolean;
  maxLength?: number;
  showLength?: boolean;

  // Validation
  validation?: ValidationRule[];
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validateOnSubmit?: boolean;
  showValidationErrors?: boolean;
  autoValidate?: boolean;

  // Auto-complete and suggestions
  suggestions?: AutoCompleteSuggestion[];
  autoComplete?: boolean;
  filterSuggestions?: boolean;
  highlightMatch?: boolean;
  maxSuggestions?: number;

  // State management
  isLoading?: boolean;
  isValid?: boolean;
  isInvalid?: boolean;
  isDirty?: boolean;
  isTouched?: boolean;
  isFocused?: boolean;

  // Interactive features
  onValidate?: (isValid: boolean, errors: string[]) => void;
  onSuggestionSelect?: (suggestion: AutoCompleteSuggestion) => void;
  onTypingSpeedChange?: (speed: number) => void;
  onCompletionTimeChange?: (time: number) => void;

  // AI and Analytics
  enableAI?: boolean;
  enableAnalytics?: boolean;
  trackInteractions?: boolean;
  optimizationTarget?: 'accuracy' | 'speed' | 'satisfaction' | 'completion';

  // Educational features
  showProgress?: boolean;
  showHints?: boolean;
  interactiveTutorial?: boolean;
  contextualHelp?: boolean;
  learningMode?: boolean;

  // Content object
  content?: InputContent;

  // Accessibility
  ariaDescribedBy?: string;
  ariaLabel?: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
  role?: string;

  // Performance
  lazyLoad?: boolean;
  memoize?: boolean;
  debounceMs?: number;
  throttleMs?: number;

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
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate CSS classes based on input props
 */
const generateInputClasses = (props: InputProps): string => {
  const {
    variant = 'default',
    size = 'md',
    theme = 'auto',
    glass = false,
    isLoading = false,
    isValid = false,
    isInvalid = false,
    borderRadius = 'md',
    className = '',
    customClasses = {},
    type = 'text',
  } = props;

  // Base classes
  const baseClasses = [
    'w-full',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ];

  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
    xl: 'px-8 py-5 text-lg',
  };

  // Variant classes
  const variantClasses: Record<InputVariant, string[]> = {
    default: ['border', 'border-gray-300', 'focus:border-blue-500', 'focus:ring-blue-500'],
    glass: ['backdrop-blur-md', 'bg-white/10', 'border', 'border-white/20', 'text-white', 'focus:ring-white/30'],
    solid: ['bg-gray-50', 'border', 'border-gray-300', 'focus:bg-white', 'focus:border-blue-500', 'focus:ring-blue-500'],
    outline: ['bg-transparent', 'border-2', 'border-gray-300', 'focus:border-blue-500', 'focus:ring-blue-500'],
    filled: ['bg-gray-100', 'border', 'border-transparent', 'focus:bg-white', 'focus:border-blue-500', 'focus:ring-blue-500'],
    primary: ['bg-blue-50', 'border', 'border-blue-200', 'text-blue-900', 'focus:bg-white', 'focus:border-blue-500', 'focus:ring-blue-500'],
    secondary: ['bg-gray-50', 'border', 'border-gray-200', 'text-gray-900', 'focus:bg-white', 'focus:border-gray-500', 'focus:ring-gray-500'],
    success: ['bg-green-50', 'border', 'border-green-200', 'text-green-900', 'focus:bg-white', 'focus:border-green-500', 'focus:ring-green-500'],
    warning: ['bg-yellow-50', 'border', 'border-yellow-200', 'text-yellow-900', 'focus:bg-white', 'focus:border-yellow-500', 'focus:ring-yellow-500'],
    error: ['bg-red-50', 'border', 'border-red-200', 'text-red-900', 'focus:bg-white', 'focus:border-red-500', 'focus:ring-red-500'],
    info: ['bg-cyan-50', 'border', 'border-cyan-200', 'text-cyan-900', 'focus:bg-white', 'focus:border-cyan-500', 'focus:ring-cyan-500'],
    gradient: ['bg-gradient-to-r', 'from-blue-50', 'to-purple-50', 'border', 'border-transparent', 'focus:from-white', 'focus:to-white', 'focus:border-blue-500'],
    neon: ['bg-black', 'text-green-400', 'border', 'border-green-400', 'focus:ring-green-400', 'focus:shadow-[0_0_10px_rgba(34,197,94,0.3))'],
    metallic: ['bg-gradient-to-r', 'from-gray-200', 'to-gray-400', 'text-gray-800', 'border', 'border-transparent'],
    holographic: ['bg-gradient-to-r', 'from-pink-500', 'via-purple-500', 'to-indigo-500', 'text-white', 'border', 'border-transparent'],
    '3d': ['bg-blue-500', 'text-white', 'border', 'border-blue-600', 'shadow-[0_4px_0_rgba(59,130,246,0.8))', 'focus:shadow-[0_2px_0_rgba(59,130,246,0.8))'],
    floating: ['bg-white', 'text-gray-700', 'border', 'border-gray-300', 'shadow-lg', 'focus:shadow-xl', 'focus:-translate-y-1'],
    'floating-glow': ['bg-white', 'text-blue-600', 'border', 'border-blue-300', 'shadow-lg', 'shadow-blue-500/25', 'focus:shadow-blue-500/40'],
    'neon-border': ['bg-gray-900', 'text-cyan-400', 'border', 'border-cyan-400', 'focus:ring-cyan-400', 'focus:shadow-[0_0_20px_rgba(34,211,238,0.3))'],
    liquid: ['bg-gradient-to-r', 'from-purple-600', 'via-pink-600', 'to-blue-600', 'text-white', 'border', 'border-transparent'],
    morphing: ['bg-gradient-to-r', 'from-indigo-500', 'via-purple-500', 'to-pink-500', 'text-white', 'border', 'border-transparent'],
    cyberpunk: ['bg-black', 'text-lime-400', 'border', 'border-lime-400', 'focus:ring-lime-400', 'focus:shadow-[0_0_30px_rgba(163,230,53,0.5))'],
    retro: ['bg-orange-500', 'text-yellow-200', 'border', 'border-orange-600', 'shadow-[0_4px_0_rgba(234,88,12,0.8))'],
    animated: ['bg-white', 'text-gray-700', 'border', 'border-gray-300', 'transition-all', 'duration-300', 'hover:border-blue-400'],
    educational: ['bg-blue-50', 'border', 'border-blue-200', 'text-blue-900', 'ring-2', 'ring-blue-100'],
    quiz: ['bg-green-50', 'border', 'border-green-200', 'text-green-900', 'ring-2', 'ring-green-100'],
    progress: ['bg-purple-50', 'border', 'border-purple-200', 'text-purple-900', 'ring-2', 'ring-purple-100'],
    achievement: ['bg-yellow-50', 'border', 'border-yellow-200', 'text-yellow-900', 'ring-2', 'ring-yellow-100'],
    learning: ['bg-teal-50', 'border', 'border-teal-200', 'text-teal-900', 'ring-2', 'ring-teal-100'],
    tutorial: ['bg-cyan-50', 'border', 'border-cyan-200', 'text-cyan-900', 'ring-2', 'ring-cyan-100'],
    interactive: ['bg-indigo-50', 'border', 'border-indigo-200', 'text-indigo-900', 'ring-2', 'ring-indigo-100'],
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

  // State classes
  const stateClasses = [
    isValid && 'border-green-500',
    isValid && 'focus:border-green-500',
    isValid && 'focus:ring-green-500',
    isInvalid && 'border-red-500',
    isInvalid && 'focus:border-red-500',
    isInvalid && 'focus:ring-red-500',
    isLoading && 'cursor-wait',
    glass && 'backdrop-blur-md',
  ].filter(Boolean);

  return [
    ...baseClasses,
    ...sizeClasses[size],
    ...variantClasses[variant],
    borderRadiusClasses[borderRadius],
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
const generateInputAnimationVariants = (animation: InputAnimation): Variants => {
  const common = {
    initial: { scale: 1, opacity: 1 },
    animate: { scale: 1, opacity: 1 },
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
        initial: { x: -20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
      };
    
    case 'zoom':
      return {
        ...common,
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
      };
    
    case 'bounce':
      return {
        ...common,
        initial: { y: -10, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        whileFocus: {
          scale: 1.02,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        },
      };
    
    case 'pulse':
      return {
        ...common,
        whileFocus: {
          scale: 1.01,
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
          transition: { duration: 0.3 },
        },
      };
    
    case 'glow':
      return {
        ...common,
        whileFocus: {
          scale: 1.01,
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
          transition: { duration: 0.2 },
        },
      };
    
    case 'shake':
      return {
        ...common,
        whileInvalid: {
          x: [-5, 5, -5, 5, 0],
          transition: { duration: 0.4 },
        },
      };
    
    case 'typing':
      return {
        ...common,
        whileFocus: {
          borderColor: 'rgba(59, 130, 246, 0.8)',
          transition: { duration: 0.3 },
        },
      };
    
    case 'floating':
      return {
        ...common,
        whileFocus: {
          y: -2,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          transition: { type: 'spring', stiffness: 200 },
        },
      };
    
    case 'magnetic':
      return {
        ...common,
        whileFocus: {
          scale: 1.05,
          rotate: 0.5,
          transition: { type: 'spring', stiffness: 300 },
        },
      };
    
    default:
      return common;
  }
};

/**
 * Validate input value against rules
 */
const validateInput = async (value: string, rules: ValidationRule[]): Promise<string[]> => {
  const errors: string[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value || value.trim().length === 0) {
          errors.push(rule.message);
        }
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          errors.push(rule.message);
        }
        break;
      
      case 'url':
        try {
          new URL(value);
        } catch {
          errors.push(rule.message);
        }
        break;
      
      case 'minLength':
        if (value && value.length < rule.value) {
          errors.push(rule.message);
        }
        break;
      
      case 'maxLength':
        if (value && value.length > rule.value) {
          errors.push(rule.message);
        }
        break;
      
      case 'pattern':
        if (value && !new RegExp(rule.value).test(value)) {
          errors.push(rule.message);
        }
        break;
      
      case 'custom':
        if (rule.validator && !await rule.validator(value)) {
          errors.push(rule.message);
        }
        break;
    }
  }

  return errors;
};

/**
 * Generate AI-optimized input properties
 */
const useAIInputOptimization = (props: InputProps) => {
  const { variant = 'default', type = 'text', enableAI = true } = props;
  
  return useMemo(() => {
    if (!enableAI) return null;

    // AI optimization logic would go here
    // This is a simplified version for demonstration
    const optimizations = {
      suggestedVariant: variant,
      suggestedType: type,
      suggestedValidation: [
        { type: 'required', message: 'This field is required' },
        { type: 'minLength', value: 3, message: 'Minimum 3 characters required' },
      ],
      suggestedPlaceholder: `Enter your ${type}...`,
      confidence: 0.79,
      reasoning: [
        'Current variant provides good accessibility',
        'Type matches expected input format',
        'Validation rules enhance data quality',
      ],
      predictedPerformance: 0.86,
      optimizationSuggestions: [
        'Consider adding auto-complete for better UX',
        'Implement real-time validation feedback',
        'Add progress indicators for longer inputs',
      ],
    };

    return optimizations;
  }, [variant, type, enableAI]);
};

// =============================================================================
// ANALYTICS HOOK
// =============================================================================

/**
 * Custom hook for comprehensive input analytics
 */
const useInputAnalytics = (props: InputProps) => {
  const {
    enableAnalytics = true,
    trackInteractions = true,
    debug = false,
  } = props;

  const [analytics, setAnalytics] = useState<InputAnalytics>({
    viewCount: 0,
    focusCount: 0,
    inputCount: 0,
    blurCount: 0,
    submitCount: 0,
    errorCount: 0,
    correctionCount: 0,
    completionTime: 0,
    typingSpeed: 0,
    backspaceCount: 0,
    userSatisfaction: 0,
    validationErrors: {},
  });

  const startTimeRef = useRef<number>(Date.now());
  const keystrokesRef = useRef<number[]>([]);
  const lastKeystrokeRef = useRef<number>(Date.now());

  const trackView = useCallback(() => {
    if (!enableAnalytics || !trackInteractions) return;

    setAnalytics(prev => ({
      ...prev,
      viewCount: prev.viewCount + 1,
    }));

    if (debug) {
      console.log('Input viewed:', analytics);
    }
  }, [enableAnalytics, trackInteractions, debug]);

  const trackFocus = useCallback(() => {
    if (!enableAnalytics || !trackInteractions) return;

    setAnalytics(prev => ({
      ...prev,
      focusCount: prev.focusCount + 1,
    }));

    lastKeystrokeRef.current = Date.now();
  }, [enableAnalytics, trackInteractions]);

  const trackInput = useCallback((value: string) => {
    if (!enableAnalytics || !trackInteractions) return;

    const now = Date.now();
    const timeSinceLastKeystroke = now - lastKeystrokeRef.current;
    
    // Track typing speed
    keystrokesRef.current.push(timeSinceLastKeystroke);
    if (keystrokesRef.current.length > 10) {
      keystrokesRef.current.shift();
    }

    const avgTypingSpeed = keystrokesRef.current.length > 0
      ? 1000 / (keystrokesRef.current.reduce((a, b) => a + b, 0) / keystrokesRef.current.length)
      : 0;

    setAnalytics(prev => ({
      ...prev,
      inputCount: prev.inputCount + 1,
      typingSpeed: avgTypingSpeed,
    }));

    lastKeystrokeRef.current = now;
  }, [enableAnalytics, trackInteractions]);

  const trackBackspace = useCallback(() => {
    if (!enableAnalytics || !trackInteractions) return;

    setAnalytics(prev => ({
      ...prev,
      backspaceCount: prev.backspaceCount + 1,
    }));
  }, [enableAnalytics, trackInteractions]);

  const trackBlur = useCallback(() => {
    if (!enableAnalytics || !trackInteractions) return;

    const completionTime = Date.now() - startTimeRef.current;

    setAnalytics(prev => ({
      ...prev,
      blurCount: prev.blurCount + 1,
      completionTime,
    }));

    if (debug) {
      console.log('Input blurred:', analytics);
    }
  }, [enableAnalytics, trackInteractions, debug]);

  const trackValidationError = useCallback((fieldName: string) => {
    if (!enableAnalytics || !trackInteractions) return;

    setAnalytics(prev => ({
      ...prev,
      errorCount: prev.errorCount + 1,
      validationErrors: {
        ...prev.validationErrors,
        [fieldName]: (prev.validationErrors[fieldName] || 0) + 1,
      },
    }));
  }, [enableAnalytics, trackInteractions]);

  useEffect(() => {
    trackView();
  }, [trackView]);

  return {
    analytics,
    trackFocus,
    trackInput,
    trackBackspace,
    trackBlur,
    trackValidationError,
  };
};

// =============================================================================
// EDUCATIONAL CONTEXT HOOK
// =============================================================================

/**
 * Custom hook for educational context awareness
 */
const useEducationalInputContext = (props: InputProps) => {
  const {
    educationalType = 'standard',
    educationalContext,
    showProgress = false,
    showHints = false,
    learningMode = false,
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
// MAIN INPUT COMPONENT
// =============================================================================

/**
 * Enterprise Input Intelligence Platform
 * 
 * A comprehensive input component with AI-powered optimization,
 * advanced analytics, educational intelligence, and enterprise-grade features.
 */
const EnterpriseInput: React.FC<InputProps> = (props) => {
  // Destructure props with defaults
  const {
    variant = 'default',
    type = 'text',
    animation = 'none',
    theme = 'auto',
    educationalType = 'standard',
    glass = false,
    gradient,
    neonColor,
    glowIntensity = 'medium',
    borderRadius = 'md',
    size = 'md',
    leftIcon,
    rightIcon,
    prefix,
    suffix,
    helper,
    counter = false,
    maxLength,
    showLength = false,
    validation = [],
    validateOnBlur = true,
    validateOnChange = false,
    validateOnSubmit = false,
    showValidationErrors = true,
    autoValidate = true,
    suggestions = [],
    autoComplete = false,
    filterSuggestions = true,
    highlightMatch = true,
    maxSuggestions = 5,
    isLoading = false,
    isValid,
    isInvalid,
    isDirty,
    isTouched,
    isFocused,
    onValidate,
    onSuggestionSelect,
    onTypingSpeedChange,
    onCompletionTimeChange,
    enableAI = false,
    enableAnalytics = false,
    trackInteractions = false,
    optimizationTarget = 'accuracy',
    showProgress = false,
    showHints = false,
    interactiveTutorial = false,
    contextualHelp = false,
    learningMode = false,
    content,
    ariaDescribedBy,
    ariaLabel,
    ariaInvalid,
    ariaRequired,
    role = 'textbox',
    lazyLoad = false,
    memoize = true,
    debounceMs = 300,
    throttleMs = 100,
    className = '',
    style,
    customClasses = {},
    debug = false,
    showPerformanceMetrics = false,
    enableLogging = false,
    value,
    onChange,
    onFocus,
    onBlur,
    placeholder,
    required,
    disabled,
    readOnly,
    ...restProps
  } = props;

  // State management
  const [focused, setFocused] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || '');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<AutoCompleteSuggestion[]>([]);

  // Custom hooks
  const { analytics, trackFocus, trackInput, trackBackspace, trackBlur, trackValidationError } = useInputAnalytics(props);
  const aiOptimization = useAIInputOptimization(props);
  const educationalContext = useEducationalInputContext(props);

  // Generate classes and animations
  const inputClasses = useMemo(
    () => generateInputClasses(props),
    [props]
  );

  const animationVariants = useMemo(
    () => generateInputAnimationVariants(animation),
    [animation]
  );

  // Merge content props with content object
  const finalContent = content ? {
    label: content.label,
    placeholder: placeholder || content.placeholder,
    helperText: helper || content.helperText,
    errorMessage: content.errorMessage,
    successMessage: content.successMessage,
    description: content.description,
    prefix: prefix || content.prefix,
    suffix: suffix || content.suffix,
    examples: content.examples,
    tips: content.tips,
    learningHints: content.learningHints,
  } : { label: props.label, placeholder, helperText: helper, prefix, suffix };

  // Validate input
  const performValidation = useCallback(async (inputValue: string) => {
    if (!autoValidate || validation.length === 0) return;

    const errors = await validateInput(inputValue, validation);
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      trackValidationError(props.name || 'unknown');
    }

    onValidate?.(errors.length === 0, errors);
  }, [autoValidate, validation, trackValidationError, onValidate, props.name]);

  // Filter suggestions
  const filterSuggestionsList = useCallback((inputValue: string) => {
    if (!autoComplete || suggestions.length === 0) return [];

    let filtered = suggestions;

    if (filterSuggestions && inputValue) {
      filtered = suggestions.filter(suggestion =>
        suggestion.value.toLowerCase().includes(inputValue.toLowerCase()) ||
        suggestion.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }

    return filtered.slice(0, maxSuggestions);
  }, [autoComplete, suggestions, filterSuggestions, maxSuggestions]);

  // Event handlers
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    trackFocus();
    onFocus?.(event);
    
    if (autoComplete && suggestions.length > 0) {
      setShowSuggestions(true);
      setFilteredSuggestions(filterSuggestionsList(currentValue));
    }
  }, [trackFocus, onFocus, autoComplete, suggestions, filterSuggestionsList, currentValue]);

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    trackBlur();
    onBlur?.(event);

    // Validate on blur if enabled
    if (validateOnBlur) {
      performValidation(currentValue);
    }

    // Hide suggestions with delay to allow for selection
    setTimeout(() => {
      setShowSuggestions(false);
      setSuggestionIndex(-1);
    }, 200);
  }, [trackBlur, onBlur, validateOnBlur, performValidation, currentValue]);

  const handleChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setCurrentValue(newValue);
    
    trackInput(newValue);
    
    // Validate on change if enabled
    if (validateOnChange) {
      performValidation(newValue);
    }

    // Filter suggestions
    if (autoComplete && showSuggestions) {
      setFilteredSuggestions(filterSuggestionsList(newValue));
    }

    onChange?.(event);
  }, [trackInput, validateOnChange, performValidation, autoComplete, showSuggestions, filterSuggestionsList, onChange]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        setSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      
      case 'Enter':
        event.preventDefault();
        if (suggestionIndex >= 0) {
          const selectedSuggestion = filteredSuggestions[suggestionIndex];
          setCurrentValue(selectedSuggestion.value);
          onSuggestionSelect?.(selectedSuggestion);
          setShowSuggestions(false);
          setSuggestionIndex(-1);
        }
        break;
      
      case 'Escape':
        setShowSuggestions(false);
        setSuggestionIndex(-1);
        break;
      
      case 'Backspace':
        trackBackspace();
        break;
    }
  }, [showSuggestions, filteredSuggestions, suggestionIndex, onSuggestionSelect, trackBackspace]);

  const handleSuggestionClick = useCallback((suggestion: AutoCompleteSuggestion) => {
    setCurrentValue(suggestion.value);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
    setSuggestionIndex(-1);
  }, [onSuggestionSelect]);

  // Render based on input type
  const renderInput = () => {
    const baseProps = {
      className: inputClasses,
      value: currentValue,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      placeholder: finalContent.placeholder,
      maxLength,
      required,
      disabled,
      readOnly,
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-invalid': ariaInvalid || validationErrors.length > 0,
      'aria-required': ariaRequired || required,
      role,
      ...restProps,
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...baseProps}
            rows={4}
            className={inputClasses}
          />
        );
      
      case 'select':
        return (
          <select
            {...baseProps}
            className={inputClasses}
          >
            <option value="">Select an option</option>
            {suggestions.map((suggestion, index) => (
              <option key={index} value={suggestion.value}>
                {suggestion.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            {...baseProps}
            type={type}
            className={inputClasses}
          />
        );
    }
  };

  // Calculate validation state
  const currentIsValid = validationErrors.length === 0 && currentValue.length > 0;
  const currentIsInvalid = validationErrors.length > 0;

  return (
    <motion.div
      className="relative"
      variants={animationVariants}
      initial="initial"
      animate="animate"
    >
      {/* Label */}
      {finalContent.label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {finalContent.label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Prefix */}
        {finalContent.prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">
              {finalContent.prefix}
            </span>
          </div>
        )}

        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">
              {leftIcon}
            </span>
          </div>
        )}

        {/* Main Input */}
        {renderInput()}

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-gray-500">
              {rightIcon}
            </span>
          </div>
        )}

        {/* Suffix */}
        {finalContent.suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">
              {finalContent.suffix}
            </span>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Character Counter */}
        {counter && maxLength && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-xs text-gray-500">
              {currentValue.length}/{maxLength}
            </span>
          </div>
        )}
      </div>

      {/* Auto-complete Suggestions */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  index === suggestionIndex ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center">
                  {suggestion.icon && (
                    <span className="mr-2">{suggestion.icon}</span>
                  )}
                  <div>
                    <div className="font-medium">
                      {highlightMatch && currentValue ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: suggestion.label.replace(
                              new RegExp(`(${currentValue})`, 'gi'),
                              '<mark class="bg-yellow-200">$1</mark>'
                            ),
                          }}
                        />
                      ) : (
                        suggestion.label
                      )}
                    </div>
                    {suggestion.description && (
                      <div className="text-xs text-gray-500">
                        {suggestion.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper Text */}
      {finalContent.helperText && !currentIsInvalid && (
        <p className="mt-1 text-sm text-gray-500">
          {finalContent.helperText}
        </p>
      )}

      {/* Validation Errors */}
      {showValidationErrors && validationErrors.length > 0 && (
        <motion.div
          className="mt-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {validationErrors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </motion.div>
      )}

      {/* Success Message */}
      {currentIsValid && finalContent.successMessage && (
        <p className="mt-1 text-sm text-green-600">
          {finalContent.successMessage}
        </p>
      )}

      {/* Progress Indicator */}
      {showProgress && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="text-gray-500">
              {maxLength ? `${currentValue.length}/${maxLength}` : `${currentValue.length} chars`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <motion.div
              className="h-1 bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${maxLength ? (currentValue.length / maxLength) * 100 : Math.min((currentValue.length / 100) * 100, 100)}%` 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Educational Hints */}
      {showHints && educationalContext.currentHint && (
        <motion.div
          className="absolute bottom-full mb-2 left-0 bg-blue-100 border border-blue-300 rounded p-2 text-xs text-blue-800 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          💡 {educationalContext.currentHint}
        </motion.div>
      )}

      {/* AI optimization suggestions (debug mode) */}
      {debug && enableAI && aiOptimization && (
        <div className="absolute top-full mt-2 left-0 bg-yellow-100 border border-yellow-400 rounded p-3 text-xs text-yellow-800 z-10">
          <div className="font-bold mb-1">AI Suggestions:</div>
          <div>Variant: {aiOptimization.suggestedVariant}</div>
          <div>Type: {aiOptimization.suggestedType}</div>
          <div>Confidence: {(aiOptimization.confidence * 100).toFixed(1)}%</div>
        </div>
      )}

      {/* Performance metrics (debug mode) */}
      {showPerformanceMetrics && debug && (
        <div className="absolute top-full mt-2 right-0 bg-blue-100 border border-blue-400 rounded p-3 text-xs text-blue-800 z-10">
          <div className="font-bold mb-1">Metrics:</div>
          <div>Focus: {analytics.focusCount}</div>
          <div>Input: {analytics.inputCount}</div>
          <div>Speed: {analytics.typingSpeed.toFixed(1)} wpm</div>
          <div>Errors: {analytics.errorCount}</div>
        </div>
      )}
    </motion.div>
  );
};

// =============================================================================
// COMPONENT VARIANTS FOR SPECIALIZED USE CASES
// =============================================================================

/**
 * Quiz-specific input with educational features
 */
export const QuizInput: React.FC<InputProps> = (props) => {
  return (
    <EnterpriseInput
      {...props}
      variant="quiz"
      type="text"
      educationalType="quiz"
      educationalContext={{
        learningPhase: 'assessment',
        difficultyLevel: 'intermediate',
        subjectArea: 'General',
        progressTracking: true,
        achievementBadges: true,
        hintsEnabled: true,
        interactiveGuides: true,
      }}
      showProgress={true}
      showHints={true}
      enableAnalytics={true}
    />
  );
};

/**
 * Learning input with educational intelligence
 */
export const LearningInput: React.FC<InputProps> = {
  /* Implementation would go here */
} as any;

/**
 * Code input for programming contexts
 */
export const CodeInput: React.FC<InputProps> = {
  /* Implementation would go here */
} as any;

/**
 * Rich text input for content creation
 */
export const RichTextInput: React.FC<InputProps> = {
  /* Implementation would go here */
} as any;

// =============================================================================
// EXPORTS
// =============================================================================

export default EnterpriseInput;

// Type exports for external use
export type {
  InputProps,
  InputVariant,
  InputType,
  InputAnimation,
  InputTheme,
  EducationalInputType,
  ValidationRule,
  AutoCompleteSuggestion,
  InputAnalytics,
  AIInputOptimization,
  EducationalInputContext,
  InputContent,
};

// Component variant exports
export { QuizInput, LearningInput, CodeInput, RichTextInput };

// Additional utility exports
export {
  generateInputClasses,
  generateInputAnimationVariants,
  validateInput,
  useInputAnalytics,
  useAIInputOptimization,
  useEducationalInputContext,
};