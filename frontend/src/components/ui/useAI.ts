// JAC Learning Platform - AI Integration Hook
// Enhanced by Cavin Otieno - Cavin Otieno
// AI-powered optimization and recommendations for Button Intelligence Platform

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ButtonProps, ButtonVariant, ButtonSize, AIOptimization } from './Button';

/**
 * AI service configuration
 */
interface AIConfig {
  provider: 'openai' | 'gemini' | 'custom';
  apiKey?: string;
  endpoint?: string;
  model?: string;
  enableRealTime?: boolean;
  cacheResults?: boolean;
  maxRetries?: number;
  timeout?: number;
}

/**
 * AI training data for button optimization
 */
interface TrainingData {
  buttonVariants: Array<{
    variant: ButtonVariant;
    performance: number;
    conversions: number;
    clicks: number;
    accessibility: number;
    userSatisfaction: number;
  }>;
  userContext: {
    demographics: Record<string, any>;
    behavior: Record<string, any>;
    preferences: Record<string, any>;
  };
  contextFeatures: {
    deviceType: string;
    screenSize: string;
    theme: string;
    accessibilityNeeds: string[];
  };
}

/**
 * Custom hook for AI-powered button optimization
 */
export const useAI = (config: Partial<AIConfig> = {}) => {
  const {
    provider = 'openai',
    apiKey = process.env.REACT_APP_OPENAI_API_KEY,
    model = 'gpt-3.5-turbo',
    enableRealTime = true,
    cacheResults = true,
    maxRetries = 3,
    timeout = 10000,
  } = config;

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cache, setCache] = useState<Map<string, AIOptimization>>(new Map());
  const [trainingData, setTrainingData] = useState<TrainingData | null>(null);

  // Initialize AI service
  useEffect(() => {
    const initializeAI = async () => {
      try {
        if (provider === 'custom' && !config.endpoint) {
          throw new Error('Custom provider requires an endpoint');
        }

        if ((provider === 'openai' || provider === 'gemini') && !apiKey) {
          throw new Error(`${provider} provider requires an API key`);
        }

        // Load training data
        await loadTrainingData();
        
        setIsInitialized(true);
      } catch (error) {
        console.warn('AI initialization failed:', error);
      }
    };

    initializeAI();
  }, [provider, apiKey, config.endpoint]);

  /**
   * Load training data for AI optimization
   */
  const loadTrainingData = async () => {
    // This would typically load from your backend or external service
    // For now, we'll use mock data that represents real button performance patterns
    
    const mockTrainingData: TrainingData = {
      buttonVariants: [
        { variant: 'primary', performance: 0.85, conversions: 1250, clicks: 1500, accessibility: 0.95, userSatisfaction: 0.82 },
        { variant: 'secondary', performance: 0.72, conversions: 890, clicks: 1200, accessibility: 0.92, userSatisfaction: 0.78 },
        { variant: 'success', performance: 0.88, conversions: 2100, clicks: 2400, accessibility: 0.94, userSatisfaction: 0.89 },
        { variant: 'gradient', performance: 0.91, conversions: 1800, clicks: 2000, accessibility: 0.88, userSatisfaction: 0.85 },
        { variant: 'glass', performance: 0.76, conversions: 950, clicks: 1250, accessibility: 0.90, userSatisfaction: 0.80 },
        { variant: 'neon', performance: 0.65, conversions: 450, clicks: 700, accessibility: 0.75, userSatisfaction: 0.70 },
        { variant: 'outline', performance: 0.68, conversions: 650, clicks: 950, accessibility: 0.93, userSatisfaction: 0.75 },
        { variant: 'ghost', performance: 0.71, conversions: 780, clicks: 1100, accessibility: 0.91, userSatisfaction: 0.77 },
      ],
      userContext: {
        demographics: {
          age: '25-34',
          device: 'mobile',
          region: 'north-america',
        },
        behavior: {
          clickSpeed: 'fast',
          readingTime: 'slow',
          interactionStyle: 'exploratory',
        },
        preferences: {
          visualComplexity: 'moderate',
          colorContrast: 'high',
          buttonSize: 'large',
        },
      },
      contextFeatures: {
        deviceType: 'mobile',
        screenSize: 'small',
        theme: 'light',
        accessibilityNeeds: ['high-contrast', 'large-targets'],
      },
    };

    setTrainingData(mockTrainingData);
  };

  /**
   * Generate AI optimization recommendations
   */
  const optimizeButton = useCallback(async (
    buttonProps: ButtonProps,
    context?: {
      userAgent?: string;
      screenSize?: { width: number; height: number };
      theme?: string;
      accessibilityNeeds?: string[];
      userPreferences?: Record<string, any>;
    }
  ): Promise<AIOptimization | null> => {
    if (!isInitialized || !trainingData) return null;

    // Check cache first
    const cacheKey = generateCacheKey(buttonProps, context);
    if (cacheResults && cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    setIsLoading(true);

    try {
      let optimization: AIOptimization;

      switch (provider) {
        case 'openai':
          optimization = await optimizeWithOpenAI(buttonProps, context);
          break;
        
        case 'gemini':
          optimization = await optimizeWithGemini(buttonProps, context);
          break;
        
        case 'custom':
          optimization = await optimizeWithCustom(buttonProps, context);
          break;
        
        default:
          optimization = await optimizeWithLocalAI(buttonProps, context);
      }

      // Cache the result
      if (cacheResults) {
        setCache(prev => new Map(prev.set(cacheKey, optimization)));
      }

      return optimization;
    } catch (error) {
      console.warn('AI optimization failed:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, trainingData, provider, apiKey, cacheResults, maxRetries, timeout]);

  /**
   * Optimize using OpenAI
   */
  const optimizeWithOpenAI = async (
    buttonProps: ButtonProps,
    context?: any
  ): Promise<AIOptimization> => {
    const prompt = generateOptimizationPrompt(buttonProps, context);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a UI/UX optimization expert. Analyze button properties and provide optimization recommendations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return parseAIResponse(content, buttonProps);
  };

  /**
   * Optimize using Gemini
   */
  const optimizeWithGemini = async (
    buttonProps: ButtonProps,
    context?: any
  ): Promise<AIOptimization> => {
    const prompt = generateOptimizationPrompt(buttonProps, context);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a UI/UX optimization expert. Analyze button properties and provide optimization recommendations.\n\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        },
      }),
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;

    return parseAIResponse(content, buttonProps);
  };

  /**
   * Optimize using custom endpoint
   */
  const optimizeWithCustom = async (
    buttonProps: ButtonProps,
    context?: any
  ): Promise<AIOptimization> => {
    const response = await fetch(config.endpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        buttonProps,
        context,
        trainingData,
      }),
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.optimization as AIOptimization;
  };

  /**
   * Optimize using local AI logic
   */
  const optimizeWithLocalAI = async (
    buttonProps: ButtonProps,
    context?: any
  ): Promise<AIOptimization> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const analysis = analyzeButtonProperties(buttonProps, context);
    
    return {
      suggestedVariant: analysis.bestVariant,
      suggestedSize: analysis.bestSize,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning,
      predictedPerformance: analysis.predictedPerformance,
      optimizationSuggestions: analysis.suggestions,
    };
  };

  /**
   * Generate cache key for optimization results
   */
  const generateCacheKey = (buttonProps: ButtonProps, context?: any): string => {
    const key = JSON.stringify({
      variant: buttonProps.variant,
      size: buttonProps.size,
      theme: buttonProps.theme,
      educationalType: buttonProps.educationalType,
      context: context ? {
        screenSize: context.screenSize,
        theme: context.theme,
        accessibilityNeeds: context.accessibilityNeeds,
      } : null,
    });
    
    return btoa(key);
  };

  /**
   * Generate optimization prompt for AI
   */
  const generateOptimizationPrompt = (buttonProps: ButtonProps, context?: any): string => {
    return `
Analyze this button and provide optimization recommendations:

Button Properties:
- Variant: ${buttonProps.variant}
- Size: ${buttonProps.size}
- Theme: ${buttonProps.theme}
- Educational Type: ${buttonProps.educationalType}
- Glass Effect: ${buttonProps.glass}
- Animation: ${buttonProps.animation}

Context:
${context ? `
- Device: ${context.userAgent}
- Screen Size: ${context.screenSize?.width}x${context.screenSize?.height}
- Theme: ${context.theme}
- Accessibility Needs: ${context.accessibilityNeeds?.join(', ') || 'None'}
` : 'No additional context'}

Provide optimization in JSON format:
{
  "suggestedVariant": "recommended variant",
  "suggestedSize": "recommended size", 
  "confidence": 0.0-1.0,
  "reasoning": ["reason1", "reason2"],
  "predictedPerformance": 0.0-1.0,
  "optimizationSuggestions": ["suggestion1", "suggestion2"]
}
`;
  };

  /**
   * Parse AI response into optimization object
   */
  const parseAIResponse = (content: string, buttonProps: ButtonProps): AIOptimization => {
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        suggestedVariant: parsed.suggestedVariant || buttonProps.variant || 'primary',
        suggestedSize: parsed.suggestedSize || buttonProps.size || 'md',
        confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5)),
        reasoning: Array.isArray(parsed.reasoning) ? parsed.reasoning : ['AI optimization applied'],
        predictedPerformance: Math.max(0, Math.min(1, parsed.predictedPerformance || 0.7)),
        optimizationSuggestions: Array.isArray(parsed.optimizationSuggestions) 
          ? parsed.optimizationSuggestions 
          : ['Consider testing different variants'],
      };
    } catch (error) {
      console.warn('Failed to parse AI response:', error);
      
      // Return fallback optimization
      return {
        suggestedVariant: buttonProps.variant || 'primary',
        suggestedSize: buttonProps.size || 'md',
        confidence: 0.3,
        reasoning: ['Fallback optimization applied'],
        predictedPerformance: 0.6,
        optimizationSuggestions: ['Unable to generate specific suggestions'],
      };
    }
  };

  /**
   * Local AI analysis for fallback optimization
   */
  const analyzeButtonProperties = (
    buttonProps: ButtonProps,
    context?: any
  ) => {
    const { variant = 'primary', size = 'md', theme = 'auto' } = buttonProps;
    
    // Analyze performance based on training data
    const variantData = trainingData?.buttonVariants.find(v => v.variant === variant);
    const variantPerformance = variantData?.performance || 0.7;
    
    // Consider context factors
    const contextMultiplier = calculateContextMultiplier(context);
    
    // Generate recommendations
    const recommendations = generateRecommendations(buttonProps, context);
    
    return {
      bestVariant: recommendations.bestVariant,
      bestSize: recommendations.bestSize,
      confidence: Math.min(1, variantPerformance * contextMultiplier),
      reasoning: recommendations.reasoning,
      predictedPerformance: variantPerformance,
      suggestions: recommendations.suggestions,
    };
  };

  /**
   * Calculate context multiplier for AI recommendations
   */
  const calculateContextMultiplier = (context?: any): number => {
    if (!context) return 1.0;

    let multiplier = 1.0;
    
    // Screen size considerations
    if (context.screenSize) {
      const { width } = context.screenSize;
      if (width < 768) {
        // Mobile devices prefer larger buttons
        multiplier *= 1.1;
      } else if (width > 1024) {
        // Desktop can handle smaller elements
        multiplier *= 0.95;
      }
    }
    
    // Accessibility considerations
    if (context.accessibilityNeeds?.includes('large-targets')) {
      multiplier *= 0.9; // Lower confidence for small buttons
    }
    
    return Math.max(0.1, Math.min(1.5, multiplier));
  };

  /**
   * Generate optimization recommendations
   */
  const generateRecommendations = (buttonProps: ButtonProps, context?: any) => {
    const reasoning: string[] = [];
    const suggestions: string[] = [];
    
    let bestVariant = buttonProps.variant || 'primary';
    let bestSize = buttonProps.size || 'md';

    // Performance-based recommendations
    if (trainingData) {
      const topPerformers = trainingData.buttonVariants
        .sort((a, b) => b.performance - a.performance)
        .slice(0, 3);
      
      if (topPerformers.length > 0 && topPerformers[0].variant !== buttonProps.variant) {
        bestVariant = topPerformers[0].variant;
        reasoning.push(`${bestVariant} shows highest performance in similar contexts`);
      }
    }

    // Context-based recommendations
    if (context?.screenSize?.width < 768) {
      if (buttonProps.size === 'sm' || buttonProps.size === 'xs') {
        bestSize = 'md';
        reasoning.push('Mobile devices require larger touch targets');
      }
    }

    // Accessibility recommendations
    if (context?.accessibilityNeeds?.includes('high-contrast')) {
      if (!['primary', 'success', 'error', 'warning'].includes(bestVariant)) {
        bestVariant = 'primary';
        suggestions.push('Consider using high-contrast colors for accessibility');
      }
    }

    // Educational context recommendations
    if (buttonProps.educationalType === 'quiz') {
      if (!['success', 'primary'].includes(bestVariant)) {
        bestVariant = 'success';
        reasoning.push('Quiz buttons benefit from success/positive associations');
      }
    }

    return {
      bestVariant,
      bestSize,
      reasoning: reasoning.length > 0 ? reasoning : ['Current configuration is optimal'],
      suggestions: suggestions.length > 0 ? suggestions : ['Current configuration appears optimal'],
    };
  };

  /**
   * Get AI insights and recommendations
   */
  const getInsights = useCallback(() => {
    if (!trainingData) return null;

    const topVariants = trainingData.buttonVariants
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 5);

    const insights = {
      topPerformingVariants: topVariants.map(v => ({
        variant: v.variant,
        performance: v.performance,
        userSatisfaction: v.userSatisfaction,
        conversions: v.conversions,
      })),
      averagePerformance: trainingData.buttonVariants.reduce((acc, v) => acc + v.performance, 0) / trainingData.buttonVariants.length,
      accessibilityLeaders: trainingData.buttonVariants
        .filter(v => v.accessibility >= 0.9)
        .sort((a, b) => b.accessibility - a.accessibility),
      recommendations: [
        'Use primary variants for main actions',
        'Consider success variants for positive outcomes',
        'Ensure adequate size for mobile touch targets',
        'Test variants with real users for validation',
      ],
    };

    return insights;
  }, [trainingData]);

  return {
    optimizeButton,
    isInitialized,
    isLoading,
    getInsights,
    cache: cacheResults ? cache : new Map(),
  };
};