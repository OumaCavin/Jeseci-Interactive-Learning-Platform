// JAC Learning Platform - Enterprise Alert Intelligence Platform by Cavin Otieno
// Comprehensive alert dialog system with AI optimization, analytics, and educational features

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from './useAnalytics';
import { useAI } from './useAI';
import { usePreferences } from './usePreferences';

// Type definitions
interface AlertDialogConfig {
  id: string;
  name: string;
  description: string;
  type: AlertDialogType;
  variant: AlertDialogVariant;
  animation: AlertDialogAnimation;
  accessibility: AlertDialogAccessibility;
  analytics: AlertDialogAnalytics;
  aiOptimization: AlertDialogAIOptionization;
  educational: AlertDialogEducational;
}

interface AlertDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  type?: AlertDialogType;
  variant?: AlertDialogVariant;
  size?: AlertDialogSize;
  animation?: AlertDialogAnimation;
  position?: AlertDialogPosition;
  overlay?: boolean;
  overlayBlur?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  trapFocus?: boolean;
  persistent?: boolean;
  modal?: boolean;
  loading?: boolean;
  error?: string;
  success?: string;
  warning?: string;
  info?: string;
  title?: string;
  description?: string;
  icon?: string;
  emoji?: string;
  educational?: AlertDialogEducational;
  contextual?: AlertDialogContextual;
  adaptive?: AlertDialogAdaptive;
  interactive?: boolean;
  wizard?: AlertDialogWizard;
  tutorial?: AlertDialogTutorial;
  assessment?: AlertDialogAssessment;
  achievement?: AlertDialogAchievement;
  collaboration?: AlertDialogCollaboration;
  aiRecommended?: boolean;
  performance?: AlertDialogPerformance;
  personalization?: AlertDialogPersonalization;
  accessibility?: AlertDialogAccessibility;
  className?: string;
  style?: React.CSSProperties;
  onOpen?: () => void;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
  onProgress?: (progress: number) => void;
  onComplete?: (result: any) => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  testId?: string;
  id?: string;
}

interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padding?: AlertDialogPadding;
  gradient?: boolean;
  glass?: boolean;
  blur?: boolean;
  shadow?: AlertDialogShadow;
  border?: boolean;
  rounded?: boolean;
  interactive?: boolean;
  animated?: boolean;
  soundEnabled?: boolean;
  hapticFeedback?: boolean;
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  icon?: string;
  emoji?: string;
  avatar?: string;
  badge?: string;
  progress?: number;
  status?: string;
  timestamp?: Date;
  interactive?: boolean;
  collapsible?: boolean;
  educational?: AlertDialogEducational;
  contextual?: AlertDialogContextual;
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  gradient?: boolean;
  glow?: boolean;
  animated?: boolean;
  responsive?: boolean;
  truncate?: boolean;
  educational?: AlertDialogEducational;
  contextual?: AlertDialogContextual;
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?: 'text' | 'markdown' | 'html' | 'richtext';
  interactive?: boolean;
  collapsible?: boolean;
  educational?: AlertDialogEducational;
  contextual?: AlertDialogContextual;
  personalized?: boolean;
  adaptive?: boolean;
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  layout?: 'horizontal' | 'vertical' | 'stacked';
  alignment?: 'left' | 'center' | 'right' | 'spread';
  spacing?: 'compact' | 'normal' | 'relaxed';
  interactive?: boolean;
  educational?: AlertDialogEducational;
}

interface AlertDialogActionProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  emoji?: string;
  className?: string;
  style?: React.CSSProperties;
  analytics?: AlertDialogAnalytics;
  educational?: AlertDialogEducational;
}

interface AlertDialogCancelProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  emoji?: string;
  className?: string;
  style?: React.CSSProperties;
  analytics?: AlertDialogAnalytics;
  educational?: AlertDialogEducational;
}

interface AlertDialogTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'button' | 'icon' | 'text' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  analytics?: AlertDialogAnalytics;
  educational?: AlertDialogEducational;
}

type AlertDialogType = 
  | 'alert' | 'confirm' | 'prompt' | 'notification' | 'warning' | 'error' | 'success' | 'info'
  | 'tutorial' | 'wizard' | 'assessment' | 'achievement' | 'learning' | 'collaboration' | 'feedback'
  | 'form' | 'onboarding' | 'progress' | 'modal' | 'sheet' | 'popover' | 'tooltip';

type AlertDialogVariant = 
  | 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  | 'glass' | 'solid' | 'outline' | 'gradient' | 'neon' | 'metallic' | 'holographic' | '3d'
  | 'minimal' | 'maximal' | 'compact' | 'expanded' | 'responsive' | 'adaptive';

type AlertDialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

type AlertDialogPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type AlertDialogAnimation = 'none' | 'fade' | 'slide' | 'bounce' | 'zoom' | 'flip' | 'rotate' | 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'blur' | 'morph';

type AlertDialogPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'responsive';

type AlertDialogShadow = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'glow' | 'neon';

interface AlertDialogAccessibility {
  ariaLabel: string;
  ariaDescribedBy?: string;
  role: string;
  tabIndex: number;
  focusable: boolean;
  screenReader: boolean;
  highContrast: boolean;
  colorBlind: boolean;
  keyboardNavigation: boolean;
  focusTrap: boolean;
  ariaLive: boolean;
  ariaModal: boolean;
}

interface AlertDialogAnalytics {
  tracking: boolean;
  events: string[];
  goals: string[];
  conversions: string[];
  custom: Record<string, any>;
  platforms: string[];
}

interface AlertDialogAIOptionization {
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

interface AlertDialogEducational {
  type: 'tutorial' | 'assessment' | 'achievement' | 'progress' | 'learning_path' | 'collaboration' | 'feedback';
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
}

interface AlertDialogContextual {
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

interface AlertDialogAdaptive {
  content: boolean;
  layout: boolean;
  styling: boolean;
  behavior: boolean;
  recommendations: boolean;
  performance: boolean;
  accessibility: boolean;
  personalization: boolean;
}

interface AlertDialogWizard {
  steps: number;
  currentStep: number;
  stepLabels: string[];
  progress: number;
  onStepChange?: (step: number) => void;
  allowBack?: boolean;
  allowSkip?: boolean;
  autoProgress?: boolean;
  timeLimit?: number;
  adaptiveDifficulty?: boolean;
}

interface AlertDialogTutorial {
  steps: number;
  currentStep: number;
  stepContent: Array<{
    title: string;
    content: string;
    target?: string;
    position?: string;
    action?: string;
  }>;
  highlight?: string;
  overlay?: boolean;
  allowSkip?: boolean;
  autoAdvance?: boolean;
  showProgress?: boolean;
}

interface AlertDialogAssessment {
  questions: Array<{
    id: string;
    question: string;
    type: 'multiple-choice' | 'text' | 'boolean' | 'code' | 'drag-drop';
    options?: string[];
    correctAnswer?: string | string[] | number;
    explanation?: string;
    hints?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
    timeLimit?: number;
  }>;
  currentQuestion: number;
  score: number;
  timeElapsed: number;
  timeLimit?: number;
  allowReview?: boolean;
  showCorrectAnswers?: boolean;
  adaptiveDifficulty?: boolean;
  immediateFeedback?: boolean;
  explanationMode?: boolean;
}

interface AlertDialogAchievement {
  title: string;
  description: string;
  icon: string;
  badge?: string;
  score?: number;
  progress?: number;
  level?: number;
  category?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements?: string[];
  rewards?: string[];
  social?: boolean;
  shareable?: boolean;
}

interface AlertDialogCollaboration {
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
    role: string;
    status: 'online' | 'offline' | 'away';
    permissions: string[];
  }>;
  activity: string;
  timestamp: Date;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  allowJoin?: boolean;
  allowLeave?: boolean;
  showActivity?: boolean;
  chat?: boolean;
  video?: boolean;
  screenShare?: boolean;
}

interface AlertDialogPerformance {
  loadTime: number;
  renderTime: number;
  animationFPS: number;
  memoryUsage: number;
  batteryUsage: number;
  networkRequests: number;
  cacheHit: number;
  errorRate: number;
}

interface AlertDialogPersonalization {
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

// Main AlertDialog component
const AlertDialog: React.FC<AlertDialogProps> = ({
  children,
  open = false,
  onOpenChange,
  type = 'alert',
  variant = 'default',
  size = 'md',
  animation = 'fade',
  position = 'center',
  overlay = true,
  overlayBlur = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  trapFocus = true,
  persistent = false,
  modal = true,
  loading = false,
  error,
  success,
  warning,
  info,
  title,
  description,
  icon,
  emoji,
  educational,
  contextual,
  adaptive,
  interactive = false,
  wizard,
  tutorial,
  assessment,
  achievement,
  collaboration,
  aiRecommended = false,
  performance,
  personalization,
  accessibility,
  className = '',
  style,
  onOpen,
  onClose,
  onConfirm,
  onCancel,
  onError,
  onSuccess,
  onProgress,
  onComplete,
  ariaLabel,
  ariaDescribedBy,
  testId,
  id,
  ...props
}) => {
  // Hooks
  const analytics = useAnalytics();
  const ai = useAI();
  const preferences = usePreferences();
  
  // State
  const [isOpen, setIsOpen] = useState(open);
  const [animationKey, setAnimationKey] = useState(0);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  } | null>(null);

  // Refs
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Memoized values
  const currentTheme = useMemo(() => preferences.theme || 'light', [preferences.theme]);
  const isDark = currentTheme === 'dark';
  
  const positionClasses = useMemo(() => {
    const baseClasses = 'fixed inset-0 z-50 flex';
    const positionMap = {
      center: 'items-center justify-center',
      top: 'items-start justify-center pt-20',
      bottom: 'items-end justify-center pb-20',
      left: 'items-center justify-start pl-20',
      right: 'items-center justify-end pr-20',
      'top-left': 'items-start justify-start pt-20 pl-20',
      'top-right': 'items-start justify-end pt-20 pr-20',
      'bottom-left': 'items-end justify-start pb-20 pl-20',
      'bottom-right': 'items-end justify-end pb-20 pr-20'
    };
    
    return `${baseClasses} ${positionMap[position]}`;
  }, [position]);

  const sizeClasses = useMemo(() => {
    const sizeMap = {
      xs: 'max-w-sm',
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      '2xl': 'max-w-6xl',
      '3xl': 'max-w-7xl',
      full: 'max-w-full mx-4'
    };
    
    return sizeMap[size] || sizeMap.md;
  }, [size]);

  const variantClasses = useMemo(() => {
    const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-2xl';
    const variantMap = {
      default: '',
      primary: 'border-2 border-blue-200 dark:border-blue-800',
      secondary: 'border-2 border-gray-200 dark:border-gray-700',
      success: 'border-2 border-green-200 dark:border-green-800',
      warning: 'border-2 border-yellow-200 dark:border-yellow-800',
      error: 'border-2 border-red-200 dark:border-red-800',
      info: 'border-2 border-blue-200 dark:border-blue-800',
      glass: 'bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border border-white/20',
      solid: 'bg-gray-900 dark:bg-gray-100',
      outline: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      neon: 'bg-black dark:bg-gray-900 border-2 border-cyan-400 shadow-lg shadow-cyan-400/50',
      metallic: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600',
      holographic: 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400',
      '3d': 'transform perspective-1000 rotateX-5 bg-gray-800 text-white shadow-2xl',
      minimal: 'bg-transparent shadow-none border-none',
      maximal: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl transform scale-105',
      compact: 'p-4',
      expanded: 'p-8',
      responsive: 'p-4 md:p-6 lg:p-8',
      adaptive: 'transition-all duration-300 ease-in-out'
    };
    
    return `${baseClasses} ${variantMap[variant] || variantMap.default}`;
  }, [variant]);

  const animationClasses = useMemo(() => {
    const animationMap = {
      none: '',
      fade: 'animate-fade-in',
      slide: 'animate-slide-in',
      bounce: 'animate-bounce-in',
      zoom: 'animate-zoom-in',
      flip: 'animate-flip-in',
      rotate: 'animate-rotate-in',
      scale: 'animate-scale-in',
      'slide-up': 'animate-slide-up-in',
      'slide-down': 'animate-slide-down-in',
      'slide-left': 'animate-slide-left-in',
      'slide-right': 'animate-slide-right-in',
      blur: 'animate-blur-in',
      morph: 'animate-morph-in'
    };
    
    return animationMap[animation] || animationMap.fade;
  }, [animation]);

  // Event handlers
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!persistent && !loading) {
      setIsOpen(newOpen);
      onOpenChange?.(newOpen);
      
      if (newOpen) {
        setAnimationKey(prev => prev + 1);
        
        // Focus management
        previousFocusRef.current = document.activeElement as HTMLElement;
        
        // Analytics
        analytics.track('dialog_open', {
          type,
          variant,
          size,
          position,
          title,
          interactive
        });

        // AI optimization
        if (ai.isEnabled && !isProcessing) {
          setIsProcessing(true);
          ai.optimize({
            component: 'alert_dialog',
            action: 'open',
            context: {
              type,
              variant,
              size,
              position,
              userPreferences: preferences,
              educational,
              interactive
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

        onOpen?.();
      } else {
        // Restore focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
          previousFocusRef.current = null;
        }

        // Analytics
        analytics.track('dialog_close', {
          type,
          variant,
          size,
          position,
          duration: Date.now()
        });

        onClose?.();
      }
    }
  }, [
    persistent, loading, type, variant, size, position, title, interactive,
    analytics, ai, preferences, educational, onOpenChange, onOpen, onClose, isProcessing
  ]);

  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (closeOnOverlayClick && !persistent && !loading) {
      handleOpenChange(false);
    }
  }, [closeOnOverlayClick, persistent, loading, handleOpenChange]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (closeOnEscape && event.key === 'Escape' && !persistent && !loading) {
      handleOpenChange(false);
    }
    
    if (trapFocus && isOpen && event.key === 'Tab') {
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [closeOnEscape, trapFocus, isOpen, persistent, loading, handleOpenChange]);

  // Effects
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  // Notification effects
  useEffect(() => {
    if (error) {
      setNotification({
        type: 'error',
        message: error,
        duration: 5000
      });
      onError?.(error);
    }
  }, [error, onError]);

  useEffect(() => {
    if (success) {
      setNotification({
        type: 'success',
        message: success,
        duration: 3000
      });
      onSuccess?.(success);
    }
  }, [success, onSuccess]);

  useEffect(() => {
    if (warning) {
      setNotification({
        type: 'warning',
        message: warning,
        duration: 4000
      });
    }
  }, [warning]);

  useEffect(() => {
    if (info) {
      setNotification({
        type: 'info',
        message: info,
        duration: 3000
      });
    }
  }, [info]);

  // Auto-clear notifications
  useEffect(() => {
    if (notification?.duration) {
      timerRef.current = setTimeout(() => {
        setNotification(null);
      }, notification.duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [notification]);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  const dialogVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      transition: { duration: 0.2, ease: 'easeIn' }
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
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg border-2 ${notificationClasses[notification.type]} shadow-lg z-60 max-w-md`}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">{notification.message}</span>
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

  // Main render
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay */}
          {overlay && (
            <motion.div
              key={`overlay-${animationKey}`}
              className={`absolute inset-0 bg-black ${overlayBlur ? 'backdrop-blur-sm' : ''}`}
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleOverlayClick}
              aria-hidden="true"
            />
          )}

          {/* Dialog */}
          <div className={positionClasses}>
            <motion.div
              ref={dialogRef}
              key={`dialog-${animationKey}`}
              className={`relative ${sizeClasses} w-full ${variantClasses} ${animationClasses} ${className}`}
              style={style}
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal={modal}
              aria-label={ariaLabel || title || 'Alert Dialog'}
              aria-describedby={ariaDescribedBy}
              data-testid={testId}
              id={id}
              {...props}
            >
              {/* Loading overlay */}
              {loading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10 rounded-lg">
                  <motion.div
                    className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              )}

              {/* Icon/emoji */}
              {(icon || emoji) && (
                <div className="absolute top-4 left-4">
                  {icon && (
                    <img src={icon} alt="" className="w-6 h-6" />
                  )}
                  {emoji && (
                    <span className="text-2xl">{emoji}</span>
                  )}
                </div>
              )}

              {/* Close button */}
              {!persistent && (
                <button
                  onClick={() => handleOpenChange(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
                  aria-label="Close dialog"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Content */}
              <div className={variant === 'compact' ? 'p-4' : variant === 'expanded' ? 'p-8' : 'p-6'}>
                {children}
              </div>

              {/* AI Recommendation */}
              {renderAIRecommendation()}
            </motion.div>
          </div>

          {/* Notification */}
          {renderNotification()}
        </>
      )}
    </AnimatePresence>
  );
};

// AlertDialogContent component
const AlertDialogContent: React.FC<AlertDialogContentProps> = ({
  children,
  className = '',
  style,
  padding = 'md',
  gradient = false,
  glass = false,
  blur = true,
  shadow = 'lg',
  border = true,
  rounded = true,
  interactive = false,
  animated = true,
  soundEnabled = false,
  hapticFeedback = false,
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    responsive: 'p-4 md:p-6 lg:p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    glow: 'shadow-lg shadow-blue-500/50',
    neon: 'shadow-lg shadow-green-400/50'
  };

  const baseClasses = `
    ${rounded ? 'rounded-lg' : ''}
    ${border ? 'border border-gray-200 dark:border-gray-700' : ''}
    ${shadowClasses[shadow]}
    ${animated ? 'transition-all duration-200' : ''}
    ${interactive ? 'hover:shadow-xl cursor-pointer' : ''}
    ${glass ? 'bg-white/10 backdrop-blur-md border border-white/20' : ''}
    ${gradient ? 'bg-gradient-to-br from-purple-500 to-pink-500' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      className={`${baseClasses} ${paddingClasses[padding]}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

// AlertDialogHeader component
const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({
  children,
  className = '',
  style,
  icon,
  emoji,
  avatar,
  badge,
  progress,
  status,
  timestamp,
  interactive = false,
  collapsible = false,
  educational,
  contextual,
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`flex items-center space-x-3 mb-4 ${className}`} style={style} {...props}>
      {/* Icon/emoji */}
      {(icon || emoji) && (
        <div className="flex-shrink-0">
          {icon && <img src={icon} alt="" className="w-6 h-6" />}
          {emoji && <span className="text-2xl">{emoji}</span>}
        </div>
      )}

      {/* Avatar */}
      {avatar && (
        <div className="flex-shrink-0">
          <img src={avatar} alt="" className="w-8 h-8 rounded-full" />
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div className="flex-shrink-0">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {badge}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <div className={`${interactive ? 'cursor-pointer' : ''} ${collapsible ? 'flex items-center justify-between' : ''}`}>
          <div className={collapsible && isCollapsed ? 'line-clamp-2' : ''}>
            {children}
          </div>
          
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <svg className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Status and timestamp */}
        {(status || timestamp) && (
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            {status && (
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>{status}</span>
              </span>
            )}
            {timestamp && (
              <span>{timestamp.toLocaleTimeString()}</span>
            )}
          </div>
        )}

        {/* Progress */}
        {progress !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// AlertDialogTitle component
const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({
  children,
  className = '',
  style,
  level = 2,
  gradient = false,
  glow = false,
  animated = true,
  responsive = true,
  truncate = false,
  educational,
  contextual,
  ...props
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const baseClasses = `
    ${gradient ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' : ''}
    ${glow ? 'text-shadow-lg shadow-blue-500/50' : ''}
    ${animated ? 'transition-all duration-200' : ''}
    ${responsive ? 'text-lg md:text-xl' : 'text-xl'}
    ${truncate ? 'truncate' : ''}
    font-semibold text-gray-900 dark:text-gray-100
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Tag className={baseClasses} style={style} {...props}>
      {children}
    </Tag>
  );
};

// AlertDialogDescription component
const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({
  children,
  className = '',
  style,
  type = 'text',
  interactive = false,
  collapsible = false,
  educational,
  contextual,
  personalized = false,
  adaptive = false,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const baseClasses = `
    text-gray-600 dark:text-gray-300
    ${interactive ? 'cursor-pointer hover:text-gray-800 dark:hover:text-gray-100' : ''}
    ${animated ? 'transition-all duration-200' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const renderContent = () => {
    switch (type) {
      case 'markdown':
        return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: String(children) }} />;
      case 'html':
        return <div dangerouslySetInnerHTML={{ __html: String(children) }} />;
      case 'richtext':
        return <div className="whitespace-pre-wrap">{children}</div>;
      default:
        return <p className={baseClasses} style={style}>{children}</p>;
    }
  };

  return (
    <div className={collapsible ? 'space-y-2' : ''} {...props}>
      <div className={collapsible && !isExpanded ? 'line-clamp-3' : ''}>
        {renderContent()}
      </div>
      
      {collapsible && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

// AlertDialogFooter component
const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({
  children,
  className = '',
  style,
  layout = 'horizontal',
  alignment = 'right',
  spacing = 'normal',
  interactive = true,
  educational,
  ...props
}) => {
  const layoutClasses = {
    horizontal: 'flex flex-row space-x-3',
    vertical: 'flex flex-col space-y-3',
    stacked: 'flex flex-col space-y-2'
  };

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    spread: 'justify-between'
  };

  const spacingClasses = {
    compact: 'gap-2',
    normal: 'gap-3',
    relaxed: 'gap-4'
  };

  const baseClasses = `
    ${layoutClasses[layout]}
    ${alignmentClasses[alignment]}
    ${spacingClasses[spacing]}
    ${interactive ? 'transition-all duration-200' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={baseClasses} style={style} {...props}>
      {children}
    </div>
  );
};

// AlertDialogAction component
const AlertDialogAction: React.FC<AlertDialogActionProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  emoji,
  className = '',
  style,
  analytics,
  educational,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    info: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
      style={style}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {(icon || emoji) && (
        <span className="mr-2">
          {icon && <img src={icon} alt="" className="w-4 h-4" />}
          {emoji && <span>{emoji}</span>}
        </span>
      )}
      
      {children}
    </button>
  );
};

// AlertDialogCancel component
const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'secondary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  emoji,
  className = '',
  style,
  analytics,
  educational,
  ...props
}) => {
  const variantClasses = {
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
      style={style}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {(icon || emoji) && (
        <span className="mr-2">
          {icon && <img src={icon} alt="" className="w-4 h-4" />}
          {emoji && <span>{emoji}</span>}
        </span>
      )}
      
      {children}
    </button>
  );
};

// AlertDialogTrigger component
const AlertDialogTrigger: React.FC<AlertDialogTriggerProps> = ({
  children,
  onClick,
  className = '',
  style,
  disabled = false,
  loading = false,
  variant = 'button',
  size = 'md',
  analytics,
  educational,
  ...props
}) => {
  const handleClick = useCallback(() => {
    if (disabled || loading) return;
    
    // Analytics
    if (analytics?.tracking) {
      analytics.track?.('dialog_trigger_click', {
        variant,
        size,
        educational
      });
    }

    if (onClick) {
      onClick();
    }
  }, [disabled, loading, variant, size, educational, analytics, onClick]);

  const variantClasses = {
    button: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50',
    icon: 'p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50',
    text: 'text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50',
    custom: className
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium transition-all duration-200
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={baseClasses}
      style={style}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default AlertDialog;
export { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogTrigger 
};
export type { 
  AlertDialogProps, AlertDialogContentProps, AlertDialogHeaderProps, AlertDialogTitleProps, 
  AlertDialogDescriptionProps, AlertDialogFooterProps, AlertDialogActionProps, AlertDialogCancelProps, AlertDialogTriggerProps,
  AlertDialogType, AlertDialogVariant, AlertDialogSize, AlertDialogPosition, AlertDialogAnimation,
  AlertDialogPadding, AlertDialogShadow, AlertDialogConfig, AlertDialogAccessibility, AlertDialogAnalytics,
  AlertDialogAIOptionization, AlertDialogEducational, AlertDialogContextual, AlertDialogAdaptive,
  AlertDialogWizard, AlertDialogTutorial, AlertDialogAssessment, AlertDialogAchievement,
  AlertDialogCollaboration, AlertDialogPerformance, AlertDialogPersonalization
};