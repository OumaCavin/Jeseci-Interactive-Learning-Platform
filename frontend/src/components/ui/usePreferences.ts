// JAC Learning Platform - User Preferences Hook
// Enhanced by Cavin Otieno - Cavin Otieno
// Comprehensive user preferences and personalization system for Button Intelligence Platform

import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * User preference types
 */
export interface UserPreferences {
  // Visual preferences
  theme: 'light' | 'dark' | 'auto' | 'high-contrast';
  colorScheme: 'default' | 'blue' | 'green' | 'purple' | 'orange';
  buttonSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  animationLevel: 'none' | 'subtle' | 'moderate' | 'enhanced';

  // Accessibility preferences
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  contrast: 'normal' | 'high' | 'extra-high';
  motionSensitivity: 'none' | 'reduced' | 'full';
  screenReader: boolean;
  keyboardNavigation: boolean;

  // Educational preferences
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
  progressTracking: boolean;
  achievementNotifications: boolean;
  interactiveHints: boolean;

  // Interaction preferences
  clickFeedback: 'visual' | 'audio' | 'haptic' | 'none';
  hoverEffects: boolean;
  loadingStates: boolean;
  confirmationDialogs: boolean;

  // Performance preferences
  analyticsEnabled: boolean;
  dataCollection: 'minimal' | 'standard' | 'comprehensive';
  realTimeUpdates: boolean;
  cachingEnabled: boolean;

  // Personalization
  preferredVariants: string[];
  recentChoices: Array<{
    variant: string;
    size: string;
    timestamp: number;
    satisfaction: number;
  }>;
  usagePatterns: {
    mostUsedVariants: string[];
    mostUsedSizes: string[];
    preferredThemes: string[];
  };
}

/**
 * Default user preferences
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  colorScheme: 'default',
  buttonSize: 'auto',
  animationLevel: 'moderate',
  fontSize: 'medium',
  contrast: 'normal',
  motionSensitivity: 'full',
  screenReader: false,
  keyboardNavigation: true,
  learningStyle: 'mixed',
  difficultyLevel: 'intermediate',
  progressTracking: true,
  achievementNotifications: true,
  interactiveHints: true,
  clickFeedback: 'visual',
  hoverEffects: true,
  loadingStates: true,
  confirmationDialogs: false,
  analyticsEnabled: true,
  dataCollection: 'standard',
  realTimeUpdates: true,
  cachingEnabled: true,
  preferredVariants: ['primary', 'secondary', 'success'],
  recentChoices: [],
  usagePatterns: {
    mostUsedVariants: ['primary'],
    mostUsedSizes: ['md'],
    preferredThemes: ['auto'],
  },
};

/**
 * Storage keys and configuration
 */
const STORAGE_KEYS = {
  preferences: 'jac_button_preferences',
  choices: 'jac_button_choices',
  analytics: 'jac_button_analytics',
  patterns: 'jac_button_patterns',
};

/**
 * Analytics data structure
 */
interface AnalyticsData {
  buttonInteractions: Record<string, {
    clicks: number;
    hover: number;
    conversions: number;
    satisfaction: number;
    lastUsed: number;
  }>;
  usageStats: {
    totalInteractions: number;
    averageSessionTime: number;
    preferredDevice: string;
    accessibilityNeeds: string[];
  };
  learningProgress: {
    currentLevel: string;
    completedActions: number;
    achievements: string[];
    streak: number;
  };
}

/**
 * Custom hook for comprehensive user preferences management
 */
export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    buttonInteractions: {},
    usageStats: {
      totalInteractions: 0,
      averageSessionTime: 0,
      preferredDevice: 'desktop',
      accessibilityNeeds: [],
    },
    learningProgress: {
      currentLevel: 'beginner',
      completedActions: 0,
      achievements: [],
      streak: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load preferences from storage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedPreferences = localStorage.getItem(STORAGE_KEYS.preferences);
        const storedAnalytics = localStorage.getItem(STORAGE_KEYS.analytics);

        if (storedPreferences) {
          const parsed = JSON.parse(storedPreferences);
          setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
        }

        if (storedAnalytics) {
          const parsedAnalytics = JSON.parse(storedAnalytics);
          setAnalytics(parsedAnalytics);
        }

        // Detect user preferences from browser
        await detectBrowserPreferences();
        
        setIsInitialized(true);
      } catch (error) {
        console.warn('Failed to load preferences:', error);
        setPreferences(DEFAULT_PREFERENCES);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to storage
  const savePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    try {
      const updated = { ...preferences, ...newPreferences };
      setPreferences(updated);
      
      localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(updated));
      
      // Trigger preference change event for other components
      window.dispatchEvent(new CustomEvent('preferencesChanged', { 
        detail: { preferences: updated } 
      }));
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  }, [preferences]);

  /**
   * Detect user preferences from browser settings
   */
  const detectBrowserPreferences = async () => {
    const detected: Partial<UserPreferences> = {};

    // Detect dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      detected.theme = 'auto';
    }

    // Detect reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      detected.motionSensitivity = 'reduced';
      detected.animationLevel = 'subtle';
    }

    // Detect high contrast preference
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      detected.contrast = 'high';
      detected.theme = 'high-contrast';
    }

    // Detect font size preference
    if (window.matchMedia && window.matchMedia('(min-resolution: 150dpi)').matches) {
      detected.fontSize = 'large';
    }

    // Detect screen reader usage
    detected.screenReader = !!navigator.userAgent.match(/NVDA|JAWS|VoiceOver/);

    // Detect device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && preferences.buttonSize === 'auto') {
      detected.buttonSize = 'md';
    }

    if (Object.keys(detected).length > 0) {
      savePreferences(detected);
    }
  };

  /**
   * Update user choice and track usage
   */
  const recordChoice = useCallback((
    variant: string,
    size: string,
    satisfaction: number = 0.5,
    context?: {
      educationalType?: string;
      theme?: string;
      device?: string;
    }
  ) => {
    try {
      // Update preferences with recent choice
      const recentChoice = {
        variant,
        size,
        timestamp: Date.now(),
        satisfaction,
      };

      const updatedChoices = [recentChoice, ...preferences.recentChoices]
        .slice(0, 50); // Keep last 50 choices

      // Update usage patterns
      const updatedPatterns = { ...preferences.usagePatterns };
      
      // Update most used variants
      const variantCount = updatedChoices.filter(c => c.variant === variant).length;
      if (variantCount >= 3 && !updatedPatterns.mostUsedVariants.includes(variant)) {
        updatedPatterns.mostUsedVariants = [...updatedPatterns.mostUsedVariants, variant].slice(-5);
      }

      // Update most used sizes
      const sizeCount = updatedChoices.filter(c => c.size === size).length;
      if (sizeCount >= 3 && !updatedPatterns.mostUsedSizes.includes(size)) {
        updatedPatterns.mostUsedSizes = [...updatedPatterns.mostUsedSizes, size].slice(-5);
      }

      // Update preferred variants list
      if (!preferences.preferredVariants.includes(variant)) {
        updatedPatterns.mostUsedVariants = updatedPatterns.mostUsedVariants.filter(v => v !== variant);
        updatedPatterns.mostUsedVariants.unshift(variant);
      }

      const updatedPreferences = {
        ...preferences,
        recentChoices: updatedChoices,
        usagePatterns: updatedPatterns,
      };

      savePreferences(updatedPreferences);

      // Update analytics
      const interactionKey = `${variant}_${size}`;
      setAnalytics(prev => ({
        ...prev,
        buttonInteractions: {
          ...prev.buttonInteractions,
          [interactionKey]: {
            clicks: (prev.buttonInteractions[interactionKey]?.clicks || 0) + 1,
            hover: prev.buttonInteractions[interactionKey]?.hover || 0,
            conversions: prev.buttonInteractions[interactionKey]?.conversions || 0,
            satisfaction: (prev.buttonInteractions[interactionKey]?.satisfaction || satisfaction + 0.5) / 2,
            lastUsed: Date.now(),
          },
        },
        usageStats: {
          ...prev.usageStats,
          totalInteractions: prev.usageStats.totalInteractions + 1,
        },
      }));

      // Save analytics
      const updatedAnalytics = {
        ...analytics,
        buttonInteractions: {
          ...analytics.buttonInteractions,
          [interactionKey]: {
            ...analytics.buttonInteractions[interactionKey],
            clicks: (analytics.buttonInteractions[interactionKey]?.clicks || 0) + 1,
            satisfaction: (analytics.buttonInteractions[interactionKey]?.satisfaction || satisfaction + 0.5) / 2,
            lastUsed: Date.now(),
          },
        },
        usageStats: {
          ...analytics.usageStats,
          totalInteractions: analytics.usageStats.totalInteractions + 1,
        },
      };
      
      localStorage.setItem(STORAGE_KEYS.analytics, JSON.stringify(updatedAnalytics));
    } catch (error) {
      console.warn('Failed to record choice:', error);
    }
  }, [preferences, analytics, savePreferences]);

  /**
   * Track button interaction for analytics
   */
  const trackInteraction = useCallback((
    variant: string,
    size: string,
    action: 'click' | 'hover' | 'conversion',
    metadata?: Record<string, any>
  ) => {
    const interactionKey = `${variant}_${size}`;
    
    setAnalytics(prev => ({
      ...prev,
      buttonInteractions: {
        ...prev.buttonInteractions,
        [interactionKey]: {
          clicks: action === 'click' ? (prev.buttonInteractions[interactionKey]?.clicks || 0) + 1 : (prev.buttonInteractions[interactionKey]?.clicks || 0),
          hover: action === 'hover' ? (prev.buttonInteractions[interactionKey]?.hover || 0) + 1 : (prev.buttonInteractions[interactionKey]?.hover || 0),
          conversions: action === 'conversion' ? (prev.buttonInteractions[interactionKey]?.conversions || 0) + 1 : (prev.buttonInteractions[interactionKey]?.conversions || 0),
          satisfaction: prev.buttonInteractions[interactionKey]?.satisfaction || 0.5,
          lastUsed: Date.now(),
        },
      },
    }));

    // Update learning progress
    if (action === 'conversion') {
      setAnalytics(prev => ({
        ...prev,
        learningProgress: {
          ...prev.learningProgress,
          completedActions: prev.learningProgress.completedActions + 1,
          streak: prev.learningProgress.streak + 1,
        },
      }));
    }
  }, []);

  /**
   * Get personalized recommendations based on usage patterns
   */
  const getRecommendations = useCallback((): {
    recommendedVariant: string;
    recommendedSize: string;
    confidence: number;
    reasoning: string[];
  } => {
    const { recentChoices, usagePatterns, analytics } = preferences;
    
    if (recentChoices.length === 0) {
      return {
        recommendedVariant: 'primary',
        recommendedSize: 'md',
        confidence: 0.3,
        reasoning: ['No usage history available, defaulting to primary'],
      };
    }

    // Analyze recent choices for patterns
    const recentVariants = recentChoices.slice(0, 10).map(c => c.variant);
    const recentSizes = recentChoices.slice(0, 10).map(c => c.size);
    
    // Find most frequent choices
    const variantFrequency = recentVariants.reduce((acc, variant) => {
      acc[variant] = (acc[variant] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sizeFrequency = recentSizes.reduce((acc, size) => {
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topVariant = Object.entries(variantFrequency)
      .sort(([,a], [,b]) => b - a)[0];
    const topSize = Object.entries(sizeFrequency)
      .sort(([,a], [,b]) => b - a)[0];

    // Calculate confidence based on frequency and consistency
    const totalChoices = recentChoices.length;
    const variantConfidence = topVariant ? (topVariant[1] / totalChoices) : 0;
    const sizeConfidence = topSize ? (topSize[1] / totalChoices) : 0;
    const overallConfidence = (variantConfidence + sizeConfidence) / 2;

    // Consider analytics data
    const interactionKey = `${topVariant?.[0]}_${topSize?.[0]}`;
    const interactionData = analytics.buttonInteractions[interactionKey];
    const satisfactionBonus = interactionData ? (interactionData.satisfaction - 0.5) * 0.2 : 0;
    const finalConfidence = Math.min(1, overallConfidence + satisfactionBonus);

    const reasoning = [
      `Most frequently used variant: ${topVariant?.[0]}`,
      `Most frequently used size: ${topSize?.[0]}`,
      `${totalChoices} total choices analyzed`,
    ];

    if (interactionData?.satisfaction > 0.7) {
      reasoning.push(`High user satisfaction (${(interactionData.satisfaction * 100).toFixed(0)}%)`);
    }

    return {
      recommendedVariant: topVariant?.[0] || 'primary',
      recommendedSize: topSize?.[0] || 'md',
      confidence: finalConfidence,
      reasoning,
    };
  }, [preferences]);

  /**
   * Reset preferences to defaults
   */
  const resetPreferences = useCallback(() => {
    try {
      setPreferences(DEFAULT_PREFERENCES);
      localStorage.removeItem(STORAGE_KEYS.preferences);
      localStorage.removeItem(STORAGE_KEYS.analytics);
      
      window.dispatchEvent(new CustomEvent('preferencesReset'));
    } catch (error) {
      console.warn('Failed to reset preferences:', error);
    }
  }, []);

  /**
   * Export preferences for backup
   */
  const exportPreferences = useCallback(() => {
    const exportData = {
      preferences,
      analytics,
      timestamp: Date.now(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jac-button-preferences-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [preferences, analytics]);

  /**
   * Import preferences from backup
   */
  const importPreferences = useCallback((file: File) => {
    return new Promise<UserPreferences>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (data.preferences) {
            setPreferences({ ...DEFAULT_PREFERENCES, ...data.preferences });
            if (data.analytics) {
              setAnalytics(data.analytics);
            }
            
            localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(data.preferences));
            if (data.analytics) {
              localStorage.setItem(STORAGE_KEYS.analytics, JSON.stringify(data.analytics));
            }
            
            resolve({ ...DEFAULT_PREFERENCES, ...data.preferences });
          } else {
            reject(new Error('Invalid preferences file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  /**
   * Get accessibility recommendations
   */
  const getAccessibilityRecommendations = useCallback(() => {
    const recommendations = [];
    const issues = [];

    // Check font size
    if (preferences.fontSize === 'small') {
      issues.push('Small font size may be difficult to read');
      recommendations.push('Consider increasing font size for better readability');
    }

    // Check contrast
    if (preferences.contrast === 'normal' && preferences.theme === 'auto') {
      issues.push('Normal contrast may not meet WCAG guidelines');
      recommendations.push('Enable high contrast mode for better accessibility');
    }

    // Check motion sensitivity
    if (preferences.motionSensitivity === 'full' && preferences.animationLevel === 'enhanced') {
      issues.push('High animation level with full motion sensitivity');
      recommendations.push('Consider reducing animation level for users with motion sensitivity');
    }

    // Check screen reader compatibility
    if (!preferences.screenReader && preferences.analyticsEnabled) {
      recommendations.push('Screen reader users may benefit from additional ARIA labels');
    }

    // Check touch target sizes for mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && ['xs', 'sm'].includes(preferences.buttonSize)) {
      issues.push('Small button sizes may be difficult to tap on mobile');
      recommendations.push('Use medium or large button sizes on touch devices');
    }

    return {
      issues,
      recommendations,
      score: Math.max(0, 100 - (issues.length * 20)),
    };
  }, [preferences]);

  return {
    preferences,
    analytics,
    isLoading,
    isInitialized,
    savePreferences,
    recordChoice,
    trackInteraction,
    getRecommendations,
    resetPreferences,
    exportPreferences,
    importPreferences,
    getAccessibilityRecommendations,
  };
};