// JAC Learning Platform - Enterprise Tabs Intelligence Platform
// Enhanced by Cavin Otieno - MiniMax Agent
// Comprehensive AI-powered tabs system with advanced analytics and educational intelligence

import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAnalytics } from './useAnalytics';
import { useAI } from './useAI';
import { usePreferences } from './usePreferences';

// =============================================================================
// CONTEXT AND STATE MANAGEMENT
// =============================================================================

/**
 * Tabs Context for managing state across components
 */
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabs: Array<{ value: string; label: string; disabled?: boolean }>;
  registerTab: (tab: { value: string; label: string; disabled?: boolean }) => void;
  unregisterTab: (value: string) => void;
  variant: TabVariant;
  theme: TabTheme;
  aiOptimization: boolean;
  trackEvents: boolean;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

// =============================================================================
// TYPE DEFINITIONS & INTERFACES
// =============================================================================

/**
 * Comprehensive tab variant types for different use cases
 */
export type TabVariant = 
  | 'default' | 'glass' | 'solid' | 'outline' | 'pills'
  | 'segmented' | 'underlined' | 'bordered' | 'minimal'
  | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  | 'gradient' | 'neon' | 'metallic' | 'holographic' | '3d'
  | 'floating' | 'floating-glow' | 'neon-border' | 'liquid'
  | 'morphing' | 'cyberpunk' | 'retro' | 'animated'
  | 'educational' | 'quiz' | 'learning' | 'course' | 'assessment'
  | 'interactive' | 'adaptive' | 'intelligent' | 'custom';

/**
 * Tab size variants with responsive scaling
 */
export type TabSize = 
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  | 'responsive' | 'full-width' | 'auto' | 'compact';

/**
 * Tab layout types for different content structures
 */
export type TabLayout = 
  | 'horizontal' | 'vertical' | 'stacked' | 'grid'
  | 'educational' | 'course' | 'assessment' | 'quiz'
  | 'wizard' | 'stepper' | 'accordion' | 'carousel';

/**
 * Animation types for tab interactions
 */
export type TabAnimation = 
  | 'none' | 'fade' | 'slide' | 'zoom' | 'rotate' | 'flip'
  | 'bounce' | 'pulse' | 'glow' | 'hover-lift' | 'magnetic'
  | 'wave' | 'particle' | 'liquid' | 'neon' | 'cyber'
  | 'educational' | 'achievement' | 'custom';

/**
 * Theme options for different contexts
 */
export type TabTheme = 
  | 'light' | 'dark' | 'auto' | 'high-contrast'
  | 'neon' | 'cyberpunk' | 'glass' | 'minimal'
  | 'corporate' | 'education' | 'gaming' | 'creative'
  | 'professional' | 'friendly' | 'modern' | 'classic';

/**
 * AI Optimization modes
 */
export type AITabOptimizationMode = 
  | 'none' | 'adaptive' | 'predictive' | 'personalized' | 'contextual'
  | 'educational' | 'learning-path' | 'course-structured'
  | 'skill-based' | 'achievement-driven';

/**
 * Analytics tracking events
 */
export type TabTrackingEvent = 
  | 'tab-viewed' | 'tab-switched' | 'tab-activated' | 'tab-completed'
  | 'course-section-accessed' | 'quiz-started' | 'assessment-completed'
  | 'learning-path-progressed' | 'skill-tab-visited' | 'achievement-unlocked';

/**
 * Educational tab categories
 */
export type EducationalTabCategory = 
  | 'course' | 'module' | 'lesson' | 'quiz' | 'assignment'
  | 'assessment' | 'skill' | 'achievement' | 'resource'
  | 'progress' | 'certificate' | 'discussion' | 'feedback';

/**
 * Comprehensive Tabs Intelligence Props Interface
 */
export interface TabsIntelligenceProps {
  // Core Tabs Properties
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: TabVariant;
  size?: TabSize;
  layout?: TabLayout;
  theme?: TabTheme;
  
  // Educational Intelligence
  educationalCategory?: EducationalTabCategory;
  learningPath?: string;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  adaptiveLayout?: boolean;
  personalizedOrder?: boolean;
  
  // AI Features
  aiOptimization?: boolean;
  aiMode?: AITabOptimizationMode;
  smartRecommendations?: boolean;
  adaptiveContent?: boolean;
  
  // Visual & Animation
  animation?: TabAnimation;
  animateTransitions?: boolean;
  duration?: number;
  showIndicators?: boolean;
  showBadges?: boolean;
  showProgress?: boolean;
  
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
  focusManagement?: boolean;
  
  // Advanced Features
  lazyLoad?: boolean;
  preserveState?: boolean;
  historySupport?: boolean;
  urlSync?: boolean;
  
  // Tab Content Management
  tabs?: Array<{
    value: string;
    label: string;
    disabled?: boolean;
    badge?: string | number;
    progress?: number;
    completed?: boolean;
    locked?: boolean;
    icon?: string;
    description?: string;
  }>;
  
  // Callbacks & Events
  onTabSwitch?: (value: string, previousValue: string) => void;
  onTabComplete?: (value: string) => void;
  onTabAccess?: (value: string) => void;
  onAIAction?: (action: string, data: any) => void;
  
  // Styling & Classes
  className?: string;
  style?: React.CSSProperties;
  customClasses?: {
    container?: string;
    tabsList?: string;
    tab?: string;
    content?: string;
    indicator?: string;
  };
  
  // Performance
  optimizeRendering?: boolean;
  cacheContent?: boolean;
  virtualization?: boolean;
  
  // Experimental Features
  experimental?: boolean;
  betaFeatures?: boolean;
  debugMode?: boolean;
  
  // Children
  children: React.ReactNode;
}

/**
 * TabsList Props
 */
export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  scrollable?: boolean;
}

/**
 * TabsTrigger Props
 */
export interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
  badge?: string | number;
  progress?: number;
  completed?: boolean;
  locked?: boolean;
  icon?: string;
  description?: string;
  className?: string;
  onClick?: (value: string) => void;
}

/**
 * TabsContent Props
 */
export interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  lazy?: boolean;
  unmount?: boolean;
  className?: string;
  onEnter?: () => void;
  onExit?: () => void;
}

// =============================================================================
// DEFAULT CONFIGURATION & CONSTANTS
// =============================================================================

/**
 * Default tab layouts for educational contexts
 */
const EDUCATIONAL_LAYOUTS = {
  course: [
    { value: 'overview', label: 'Course Overview', progress: 0 },
    { value: 'modules', label: 'Course Modules', progress: 0 },
    { value: 'assignments', label: 'Assignments', progress: 0 },
    { value: 'discussions', label: 'Discussions', progress: 0 },
    { value: 'resources', label: 'Resources', progress: 0 },
    { value: 'progress', label: 'Your Progress', progress: 0 }
  ],
  quiz: [
    { value: 'instructions', label: 'Instructions', progress: 0 },
    { value: 'questions', label: 'Questions', progress: 0 },
    { value: 'results', label: 'Results', progress: 0 },
    { value: 'review', label: 'Review', progress: 0 }
  ],
  assessment: [
    { value: 'setup', label: 'Setup', progress: 0 },
    { value: 'assessment', label: 'Assessment', progress: 0 },
    { value: 'results', label: 'Results', progress: 0 },
    { value: 'feedback', label: 'Feedback', progress: 0 },
    { value: 'certificate', label: 'Certificate', progress: 0 }
  ]
};

/**
 * Animation variants for different tab states
 */
const ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  active: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  inactive: { 
    scale: 1,
    transition: { duration: 0.2 }
  }
};

/**
 * Content animation variants
 */
const CONTENT_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

/**
 * AI recommendation patterns for tabs
 */
const AI_TAB_PATTERNS = {
  educational: {
    beginner: 'Start with overview and basic concepts',
    intermediate: 'Focus on practical applications and exercises',
    advanced: 'Explore advanced topics and case studies',
    expert: 'Engage with complex challenges and research'
  },
  engagement: {
    low: 'Try interactive content or multimedia resources',
    medium: 'Great engagement! Consider peer discussions',
    high: 'Excellent progress! Share your knowledge',
    stuck: 'Take a break and return with fresh perspective'
  }
};

// =============================================================================
// HELPER FUNCTIONS & UTILITIES
// =============================================================================

/**
 * Generate AI-powered tab recommendations
 */
const generateTabRecommendations = (
  activeTab: string,
  skillLevel: string,
  educationalCategory: string,
  ai: any
): string[] => {
  const recommendations = [];
  
  // Skill-based recommendations
  const skillRecommendation = AI_TAB_PATTERNS.educational[skillLevel as keyof typeof AI_TAB_PATTERNS.educational];
  if (skillRecommendation) {
    recommendations.push(skillRecommendation);
  }
  
  // Category-specific recommendations
  if (educationalCategory === 'course') {
    recommendations.push('Complete modules in order for optimal learning');
  } else if (educationalCategory === 'quiz') {
    recommendations.push('Review instructions carefully before starting');
  } else if (educationalCategory === 'assessment') {
    recommendations.push('Take your time and review your answers');
  }
  
  return recommendations;
};

/**
 * Calculate tab completion percentage
 */
const calculateTabCompletion = (tabValue: string, tabs: any[]): number => {
  const tab = tabs.find(t => t.value === tabValue);
  if (!tab || tab.progress === undefined) return 0;
  return tab.progress;
};

/**
 * Check if tab is accessible based on prerequisites
 */
const isTabAccessible = (
  tabValue: string,
  activeTabs: string[],
  tabs: any[]
): boolean => {
  const tabIndex = tabs.findIndex(t => t.value === tabValue);
  if (tabIndex === 0) return true; // First tab is always accessible
  
  // Check if previous tabs are completed
  for (let i = 0; i < tabIndex; i++) {
    const previousTab = tabs[i];
    if (!previousTab.completed && !activeTabs.includes(previousTab.value)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Generate adaptive tab order based on user behavior
 */
const generateAdaptiveOrder = (
  tabs: any[],
  userPreferences: any,
  skillLevel: string
): any[] => {
  // Simple adaptive ordering - can be enhanced with ML
  const priority = {
    beginner: ['overview', 'basics', 'practice'],
    intermediate: ['examples', 'exercises', 'projects'],
    advanced: ['challenges', 'research', 'peer-review'],
    expert: ['innovation', 'leadership', 'mentoring']
  };
  
  const skillPriority = priority[skillLevel as keyof typeof priority] || priority.intermediate;
  const sortedTabs = [...tabs];
  
  // Sort tabs based on priority
  return sortedTabs.sort((a, b) => {
    const aIndex = skillPriority.indexOf(a.value);
    const bIndex = skillPriority.indexOf(b.value);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
};

/**
 * Track tab analytics event
 */
const trackTabEvent = (
  analytics: any,
  event: TabTrackingEvent,
  data: any,
  customEventName?: string
) => {
  if (!analytics) return;
  
  const eventName = customEventName || event;
  
  try {
    analytics.track(eventName, {
      ...data,
      category: 'tabs-intelligence',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`
    });
  } catch (error) {
    console.warn('Tab analytics tracking failed:', error);
  }
};

/**
 * Validate tabs props
 */
const validateTabsProps = (props: TabsIntelligenceProps): boolean => {
  const { defaultValue, value, tabs } = props;
  
  if (defaultValue && value) {
    console.warn('Both defaultValue and value provided. Using controlled mode.');
  }
  
  if (tabs && tabs.length === 0) {
    console.warn('Tabs array is empty');
    return false;
  }
  
  return true;
};

/**
 * Get optimized rendering props
 */
const getOptimizedTabsProps = (props: TabsIntelligenceProps) => {
  const { optimizeRendering, value, variant } = props;
  
  if (!optimizeRendering) return { shouldRender: true, memoKey: 'default' };
  
  const shouldRender = value !== undefined; // Only render in controlled mode
  const memoKey = `${value}-${variant}-${props.layout}`;
  
  return { shouldRender, memoKey };
};

// =============================================================================
// MAIN TABS COMPONENT IMPLEMENTATION
// =============================================================================

/**
 * Enterprise Tabs Intelligence Component
 * 
 * A comprehensive tabs system with AI optimization, educational intelligence,
 * and advanced analytics integration.
 */
export const Tabs: React.FC<TabsIntelligenceProps> = ({
  // Core Tabs Properties
  defaultValue,
  value,
  onValueChange,
  variant = 'default',
  size = 'md',
  layout = 'horizontal',
  theme = 'light',
  
  // Educational Intelligence
  educationalCategory,
  learningPath,
  skillLevel = 'intermediate',
  adaptiveLayout = false,
  personalizedOrder = false,
  
  // AI Features
  aiOptimization = false,
  aiMode = 'adaptive',
  smartRecommendations = false,
  adaptiveContent = false,
  
  // Visual & Animation
  animation = 'slide',
  animateTransitions = true,
  duration = 0.3,
  showIndicators = false,
  showBadges = false,
  showProgress = false,
  
  // Analytics & Tracking
  trackEvents = true,
  customEventName,
  analyticsCategory = 'tabs',
  performanceTracking = true,
  engagementMetrics = true,
  
  // Accessibility
  ariaLabel,
  ariaDescription,
  highContrast = false,
  screenReaderOptimized = true,
  keyboardNavigation = true,
  focusManagement = true,
  
  // Advanced Features
  lazyLoad = false,
  preserveState = false,
  historySupport = false,
  urlSync = false,
  
  // Tab Content Management
  tabs,
  
  // Callbacks & Events
  onTabSwitch,
  onTabComplete,
  onTabAccess,
  onAIAction,
  
  // Styling & Classes
  className = '',
  style,
  customClasses = {},
  
  // Performance
  optimizeRendering = true,
  cacheContent = true,
  virtualization = false,
  
  // Experimental Features
  experimental = false,
  betaFeatures = false,
  debugMode = false,
  
  // Children
  children,
  ...props
}) => {
  // =============================================================================
  // STATE MANAGEMENT & HOOKS
  // =============================================================================
  
  const [activeTab, setActiveTab] = useState(value || defaultValue || '');
  const [previousTab, setPreviousTab] = useState('');
  const [tabHistory, setTabHistory] = useState<string[]>([]);
  const [registeredTabs, setRegisteredTabs] = useState<Array<{ value: string; label: string; disabled?: boolean }>>([]);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  
  // Analytics & AI Hooks
  const analytics = useAnalytics();
  const ai = useAI();
  const preferences = usePreferences();
  
  // Refs
  const tabsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  
  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================
  
  const contextValue: TabsContextValue = {
    activeTab,
    setActiveTab,
    tabs: registeredTabs,
    registerTab: useCallback((tab) => {
      setRegisteredTabs(prev => {
        if (prev.find(t => t.value === tab.value)) return prev;
        return [...prev, tab];
      });
    }, []),
    unregisterTab: useCallback((value) => {
      setRegisteredTabs(prev => prev.filter(t => t.value !== value));
    }, []),
    variant,
    theme,
    aiOptimization,
    trackEvents
  };
  
  // =============================================================================
  // MEMOIZED CALCULATIONS
  // =============================================================================
  
  const effectiveTabs = useMemo(() => {
    const contextTabs = registeredTabs.length > 0 ? registeredTabs : tabs;
    if (adaptiveLayout && preferences) {
      return generateAdaptiveOrder(contextTabs || [], preferences, skillLevel);
    }
    return contextTabs || [];
  }, [registeredTabs, tabs, adaptiveLayout, preferences, skillLevel]);
  
  const activeTabData = useMemo(() => {
    return effectiveTabs.find(tab => tab.value === activeTab);
  }, [effectiveTabs, activeTab]);
  
  const completionPercentage = useMemo(() => {
    if (!effectiveTabs.length) return 0;
    const completedTabs = effectiveTabs.filter(tab => tab.completed).length;
    return (completedTabs / effectiveTabs.length) * 100;
  }, [effectiveTabs]);
  
  const shouldAnimate = useMemo(() => {
    return animation !== 'none' && animateTransitions && previousTab !== activeTab;
  }, [animation, animateTransitions, previousTab, activeTab]);
  
  // =============================================================================
  // AI OPTIMIZATION LOGIC
  // =============================================================================
  
  const generateAIInsights = useCallback(async () => {
    if (!aiOptimization || !ai) return;
    
    try {
      const recommendations = generateTabRecommendations(
        activeTab,
        skillLevel,
        educationalCategory || 'general',
        ai
      );
      
      setAiRecommendations(recommendations);
      onAIAction?.('insights_generated', { recommendations, activeTab });
    } catch (error) {
      if (debugMode) {
        console.error('AI tab insights generation failed:', error);
      }
    }
  }, [aiOptimization, ai, activeTab, skillLevel, educationalCategory, debugMode, onAIAction]);
  
  // =============================================================================
  // ANALYTICS TRACKING
  // =============================================================================
  
  const trackTabInteraction = useCallback((event: TabTrackingEvent, data: any) => {
    if (!trackEvents || !analytics) return;
    
    trackTabEvent(analytics, event, {
      activeTab,
      previousTab,
      category: educationalCategory,
      skillLevel,
      layout,
      variant,
      ...data
    }, customEventName);
  }, [trackEvents, analytics, activeTab, previousTab, educationalCategory, skillLevel, layout, variant, customEventName]);
  
  // =============================================================================
  // TAB MANAGEMENT
  // =============================================================================
  
  const handleTabChange = useCallback((newValue: string, previousValue: string = activeTab) => {
    // Check accessibility
    if (!isTabAccessible(newValue, tabHistory, effectiveTabs)) {
      return; // Tab is locked or requires prerequisites
    }
    
    // Update state
    setPreviousTab(previousValue);
    setActiveTab(newValue);
    setTabHistory(prev => [...prev, newValue].slice(-10)); // Keep last 10 tabs
    
    // Callbacks
    onTabSwitch?.(newValue, previousValue);
    onTabAccess?.(newValue);
    trackTabInteraction('tab-switched', { newValue, previousValue });
    
    // History support
    if (historySupport) {
      window.history.pushState({ tab: newValue }, '', `#${newValue}`);
    }
    
    // URL sync
    if (urlSync) {
      const url = new URL(window.location.href);
      url.hash = newValue;
      window.history.replaceState(null, '', url.toString());
    }
    
    // AI insights
    if (aiOptimization) {
      generateAIInsights();
    }
  }, [activeTab, effectiveTabs, tabHistory, onTabSwitch, onTabAccess, trackTabInteraction, historySupport, urlSync, aiOptimization, generateAIInsights]);
  
  // =============================================================================
  // KEYBOARD NAVIGATION
  // =============================================================================
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!keyboardNavigation) return;
    
    const currentIndex = effectiveTabs.findIndex(tab => tab.value === activeTab);
    if (currentIndex === -1) return;
    
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        do {
          newIndex = (newIndex - 1 + effectiveTabs.length) % effectiveTabs.length;
        } while (effectiveTabs[newIndex].disabled && newIndex !== currentIndex);
        break;
        
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        do {
          newIndex = (newIndex + 1) % effectiveTabs.length;
        } while (effectiveTabs[newIndex].disabled && newIndex !== currentIndex);
        break;
        
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
        
      case 'End':
        event.preventDefault();
        newIndex = effectiveTabs.length - 1;
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        const tab = effectiveTabs[newIndex];
        if (!tab.disabled) {
          handleTabChange(tab.value);
        }
        return;
    }
    
    if (newIndex !== currentIndex) {
      const newTab = effectiveTabs[newIndex];
      if (!newTab.disabled) {
        handleTabChange(newTab.value);
      }
    }
  }, [keyboardNavigation, effectiveTabs, activeTab, handleTabChange]);
  
  // =============================================================================
  // EFFECT HOOKS
  // =============================================================================
  
  // Initialize tabs
  useEffect(() => {
    if (!validateTabsProps({ defaultValue, value, tabs })) return;
    
    // Set initial active tab
    const initialTab = value || defaultValue;
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
    
    // Track initial view
    trackTabInteraction('tab-viewed', { initialTab });
  }, []); // Empty dependency array for initial setup
  
  // Controlled mode effect
  useEffect(() => {
    if (value !== undefined && value !== activeTab) {
      handleTabChange(value, activeTab);
    }
  }, [value, activeTab, handleTabChange]);
  
  // AI optimization effects
  useEffect(() => {
    if (aiOptimization) {
      generateAIInsights();
    }
  }, [aiOptimization, activeTab, generateAIInsights]);
  
  // History support
  useEffect(() => {
    if (!historySupport) return;
    
    const handlePopState = (event: PopStateEvent) => {
      const hash = window.location.hash.slice(1);
      if (hash && hash !== activeTab) {
        handleTabChange(hash);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Set initial history state
    if (window.location.hash) {
      const hash = window.location.hash.slice(1);
      if (hash !== activeTab) {
        handleTabChange(hash);
      }
    }
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [historySupport, activeTab, handleTabChange]);
  
  // =============================================================================
  // RENDER LOGIC
  // =============================================================================
  
  // Get optimized rendering props
  const { shouldRender, memoKey } = getOptimizedTabsProps({
    value,
    variant,
    ...props
  });
  
  if (!shouldRender) {
    return null;
  }
  
  // Component base classes
  const baseClasses = [
    'tabs-intelligence-container',
    `tabs-variant-${variant}`,
    `tabs-size-${size}`,
    `tabs-layout-${layout}`,
    `tabs-theme-${theme}`,
    highContrast ? 'tabs-high-contrast' : '',
    screenReaderOptimized ? 'tabs-screen-reader-optimized' : '',
    adaptiveLayout ? 'tabs-adaptive-layout' : '',
    aiOptimization ? 'tabs-ai-optimized' : '',
    className
  ].filter(Boolean).join(' ');
  
  // Container classes
  const containerClasses = [
    'tabs-container',
    customClasses.container || ''
  ].filter(Boolean).join(' ');
  
  // Accessibility attributes
  const accessibilityProps = {
    role: 'tablist',
    'aria-label': ariaLabel || 'Tabs navigation',
    'aria-describedby': ariaDescription,
    'aria-orientation': layout === 'vertical' ? 'vertical' : 'horizontal',
    tabIndex: keyboardNavigation ? 0 : undefined,
    onKeyDown: keyboardNavigation ? handleKeyDown : undefined,
  };
  
  // =============================================================================
  // MAIN JSX RETURN
  // =============================================================================
  
  return (
    <TabsContext.Provider value={contextValue}>
      <motion.div
        ref={tabsRef}
        className={baseClasses}
        style={{
          '--active-tab': activeTab,
          '--previous-tab': previousTab,
          '--tab-count': effectiveTabs.length.toString(),
          '--completion-percentage': `${completionPercentage}%`,
          '--animation-duration': `${duration}s`,
          ...style
        } as React.CSSProperties & { [key: string]: string | number }}
        {...accessibilityProps}
        data-tabs-variant={variant}
        data-tabs-size={size}
        data-tabs-layout={layout}
        data-tabs-theme={theme}
        data-skill-level={skillLevel}
        data-category={educationalCategory}
        data-memo-key={memoKey}
        data-debug={debugMode ? 'true' : 'false'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={containerClasses}>
          {/* Tabs Header */}
          <div className="tabs-header">
            <div className="tabs-info">
              <span className="tabs-category">{educationalCategory || 'General'}</span>
              <span className="tabs-completion">{Math.round(completionPercentage)}% Complete</span>
            </div>
            
            {/* AI Recommendations */}
            {aiOptimization && aiRecommendations.length > 0 && (
              <div className="tabs-ai-recommendations">
                <div className="tabs-ai-header">
                  <span>🤖 AI Suggestions</span>
                </div>
                <div className="tabs-ai-list">
                  {aiRecommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      className="tabs-ai-recommendation"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="tabs-ai-text">{recommendation}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Render Children with Context */}
          {children}
          
          {/* Performance Metrics (Debug Mode) */}
          {debugMode && (
            <div className="tabs-debug-info">
              <div className="tabs-debug-stats">
                <span>Active: {activeTab}</span>
                <span>Previous: {previousTab || 'None'}</span>
                <span>History: {tabHistory.length}</span>
                <span>Tabs: {effectiveTabs.length}</span>
                <span>Animation: {shouldAnimate ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Screen Reader Only Content */}
        {screenReaderOptimized && (
          <div className="sr-only">
            Tabs navigation. Currently viewing: {activeTabData?.label || activeTab}. {
              effectiveTabs.length > 0 ? 
              `Available tabs: ${effectiveTabs.map(tab => tab.label).join(', ')}.` : 
              'No tabs available.'
            } Progress: {Math.round(completionPercentage)}% complete.
          </div>
        )}
      </motion.div>
    </TabsContext.Provider>
  );
};

// =============================================================================
// TABS LIST COMPONENT
// =============================================================================

/**
 * TabsList Component
 * 
 * Container for tab triggers with various layout options and animations.
 */
export const TabsList: React.FC<TabsListProps> = ({
  children,
  className = '',
  orientation = 'horizontal',
  scrollable = false
}) => {
  const { 
    activeTab, 
    tabs, 
    variant, 
    theme, 
    aiOptimization, 
    trackEvents 
  } = useTabsContext();
  
  const tabsListClasses = [
    'tabs-list',
    `tabs-list-orientation-${orientation}`,
    `tabs-list-variant-${variant}`,
    `tabs-list-theme-${theme}`,
    scrollable ? 'tabs-list-scrollable' : '',
    aiOptimization ? 'tabs-list-ai-optimized' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <motion.div
      className={tabsListClasses}
      data-orientation={orientation}
      layout
    >
      {children}
    </motion.div>
  );
};

// =============================================================================
// TABS TRIGGER COMPONENT
// =============================================================================

/**
 * TabsTrigger Component
 * 
 * Individual tab trigger with AI optimization, accessibility, and animations.
 */
export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  children,
  value,
  disabled = false,
  badge,
  progress,
  completed = false,
  locked = false,
  icon,
  description,
  className = '',
  onClick,
  ...props
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    registerTab, 
    unregisterTab, 
    trackEvents 
  } = useTabsContext();
  
  const [isHovered, setIsHovered] = useState(false);
  const isActive = activeTab === value;
  const isDisabled = disabled || locked;
  
  // Register/unregister tab
  useEffect(() => {
    registerTab({ value, label: children?.toString() || value, disabled: isDisabled });
    return () => unregisterTab(value);
  }, [value, children, isDisabled, registerTab, unregisterTab]);
  
  // Handle tab selection
  const handleClick = useCallback(() => {
    if (isDisabled) return;
    
    if (onClick) {
      onClick(value);
    } else {
      setActiveTab(value);
    }
  }, [isDisabled, onClick, value, setActiveTab]);
  
  // Animation variants
  const triggerVariants: Variants = {
    inactive: { 
      scale: 1,
      opacity: 0.7,
      transition: { duration: 0.2 }
    },
    active: { 
      scale: 1.02,
      opacity: 1,
      transition: { duration: 0.2 }
    },
    disabled: {
      scale: 1,
      opacity: 0.5,
      transition: { duration: 0.2 }
    }
  };
  
  // Progress indicator animation
  const progressVariants: Variants = {
    hidden: { width: 0 },
    visible: { width: `${progress || 0}%` }
  };
  
  const triggerClasses = [
    'tabs-trigger',
    `tabs-trigger-${isActive ? 'active' : 'inactive'}`,
    `tabs-trigger-${isDisabled ? 'disabled' : 'enabled'}`,
    isActive ? 'tabs-trigger-active' : 'tabs-trigger-inactive',
    isDisabled ? 'tabs-trigger-disabled' : '',
    completed ? 'tabs-trigger-completed' : '',
    locked ? 'tabs-trigger-locked' : '',
    className
  ].filter(Boolean).join(' ');
  
  // Accessibility attributes
  const accessibilityProps = {
    role: 'tab',
    'aria-selected': isActive,
    'aria-controls': `tabs-content-${value}`,
    'aria-describedby': description ? `tabs-description-${value}` : undefined,
    disabled: isDisabled,
    tabIndex: isActive ? 0 : -1,
    'data-tab-value': value,
    'data-completed': completed ? 'true' : 'false',
    'data-locked': locked ? 'true' : 'false'
  };
  
  return (
    <motion.button
      className={triggerClasses}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={triggerVariants}
      animate={isDisabled ? 'disabled' : (isActive ? 'active' : 'inactive')}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      {...accessibilityProps}
      {...props}
    >
      {/* Icon */}
      {icon && (
        <span className="tabs-trigger-icon">
          {icon}
        </span>
      )}
      
      {/* Label */}
      <span className="tabs-trigger-label">
        {children}
      </span>
      
      {/* Badge */}
      {showBadges && badge && (
        <span className="tabs-trigger-badge">
          {badge}
        </span>
      )}
      
      {/* Completion Indicator */}
      {completed && (
        <span className="tabs-trigger-completion">
          ✓
        </span>
      )}
      
      {/* Lock Indicator */}
      {locked && (
        <span className="tabs-trigger-lock">
          🔒
        </span>
      )}
      
      {/* Progress Indicator */}
      {showProgress && progress !== undefined && (
        <motion.div
          className="tabs-trigger-progress"
          variants={progressVariants}
          animate="visible"
          initial="hidden"
        />
      )}
      
      {/* Hover Effect */}
      <AnimatePresence>
        {isHovered && !isDisabled && (
          <motion.div
            className="tabs-trigger-hover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      
      {/* Description */}
      {description && (
        <div id={`tabs-description-${value}`} className="tabs-trigger-description">
          {description}
        </div>
      )}
    </motion.button>
  );
};

// =============================================================================
// TABS CONTENT COMPONENT
// =============================================================================

/**
 * TabsContent Component
 * 
 * Tab content panel with lazy loading, animations, and state preservation.
 */
export const TabsContent: React.FC<TabsContentProps> = ({
  children,
  value,
  lazy = false,
  unmount = false,
  className = '',
  onEnter,
  onExit,
  ...props
}) => {
  const { activeTab } = useTabsContext();
  const [isLoaded, setIsLoaded] = useState(!lazy);
  const [hasEntered, setHasEntered] = useState(false);
  
  const isActive = activeTab === value;
  const shouldRender = isActive || !unmount || isLoaded;
  
  // Lazy loading effect
  useEffect(() => {
    if (lazy && isActive && !isLoaded) {
      setIsLoaded(true);
    }
  }, [lazy, isActive, isLoaded]);
  
  // Enter/exit effects
  useEffect(() => {
    if (isActive && !hasEntered) {
      setHasEntered(true);
      onEnter?.();
    } else if (!isActive && hasEntered) {
      onExit?.();
    }
  }, [isActive, hasEntered, onEnter, onExit]);
  
  const contentClasses = [
    'tabs-content',
    `tabs-content-${isActive ? 'active' : 'inactive'}`,
    isActive ? 'tabs-content-active' : 'tabs-content-inactive',
    className
  ].filter(Boolean).join(' ');
  
  if (!shouldRender) {
    return null;
  }
  
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          id={`tabs-content-${value}`}
          className={contentClasses}
          role="tabpanel"
          aria-labelledby={`tabs-trigger-${value}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={CONTENT_ANIMATION_VARIANTS}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          data-tab-content={value}
        >
          <div className="tabs-content-wrapper">
            {isLoaded ? children : (
              <div className="tabs-content-loading">
                <div className="tabs-loading-spinner" />
                <span>Loading content...</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// =============================================================================
// CONVENIENCE COMPONENTS
// =============================================================================

/**
 * Educational Tabs Component
 * Pre-configured for educational contexts with learning-specific features.
 */
export const EducationalTabs: React.FC<Omit<TabsIntelligenceProps, 'educationalCategory'>> = (props) => (
  <Tabs {...props} educationalCategory="educational" />
);

/**
 * Course Tabs Component
 * Designed for course structure navigation.
 */
export const CourseTabs: React.FC<Omit<TabsIntelligenceProps, 'educationalCategory' | 'layout'>> = (props) => (
  <Tabs {...props} educationalCategory="course" layout="horizontal" />
);

/**
 * Quiz Tabs Component
 * Optimized for quiz and assessment workflows.
 */
export const QuizTabs: React.FC<Omit<TabsIntelligenceProps, 'educationalCategory' | 'layout'>> = (props) => (
  <Tabs {...props} educationalCategory="quiz" layout="stepper" />
);

/**
 * Vertical Tabs Component
 * Vertical layout for sidebar navigation.
 */
export const VerticalTabs: React.FC<Omit<TabsIntelligenceProps, 'layout'>> = (props) => (
  <Tabs {...props} layout="vertical" />
);

/**
 * Stepper Tabs Component
 * Step-by-step navigation for multi-step processes.
 */
export const StepperTabs: React.FC<Omit<TabsIntelligenceProps, 'layout'>> = (props) => (
  <Tabs {...props} layout="stepper" />
);

// =============================================================================
// DEFAULT EXPORTS
// =============================================================================

export { Tabs, TabsList, TabsTrigger, TabsContent };
export default Tabs;
