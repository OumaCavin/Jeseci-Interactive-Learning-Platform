// Service Type Definitions
// Enhanced by Cavin Otieno

export interface AIInsightObject {
  type?: string;
  title?: string;
  description?: string;
  recommendation?: string;
  content?: string;
  confidence?: number;
  insights?: string[];
  isAnomaly?: boolean;
  layoutRecommendations?: any;
  suggestions?: any[];
  relationships?: any[];
  categoryScores?: any;
  overallScore?: number;
  optimization?: string;
  engagementPrediction?: number;
  churnRisk?: number;
  
  // Theme properties
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textPrimary?: string;
  textSecondary?: string;
  textDisabled?: string;
  textInverse?: string;
  optimizedColors?: any;
}

export interface SecurityConfiguration {
  enableEncryption: boolean;
  enableTwoFactor: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
}

export interface UIThemeState {
  mode: 'light' | 'dark' | 'system' | 'auto' | 'custom';
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      inverse: string;
    };
    aiOptimizedColors?: any;
    computedAt: string;
  };
  aiGeneratedTheme: boolean;
  aiThemeVariant?: string;
  aiThemeConfidence: number;
  compliance?: {
    accessibility?: {
      contrastRatio: number;
      colorBlindnessCompatibility: number;
    };
    categoryScores?: any;
    overallScore?: number;
  };
  accessibilityMode?: string;
}

export interface UINavigationInsight {
  type: string;
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  implemented: boolean;
  timestamp: string;
}

export interface UIAIGeneratedSuggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  confidence: number;
  category: string;
  implemented: boolean;
  timestamp: string;
}

export interface UIPerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  lastMeasured: string;
  frameRate?: number;
  cpuUsage?: number;
  interactionLatency?: number;
  scrollPerformance?: number;
  history?: any[];
}

export interface UIMetric {
  current: number;
  average: number;
  min: number;
  max: number;
  trend: string;
  status: string;
}

export interface UIState {
  theme: UIThemeState;
  layout: any;
  uxIntelligence: any;
  performance: {
    metrics: {
      renderTime: UIMetric;
      frameRate: UIMetric;
      memoryUsage: UIMetric;
      cpuUsage: UIMetric;
    };
    optimization: any;
  };
  accessibility: any;
  enterprise: any;
  development: any;
  userAnalytics?: {
    engagement?: number;
    insights?: any[];
  };
}

export interface UserEngagement {
  sessions: number;
  averageSessionDuration: number;
  bounceRate: number;
  pageViews: number;
  clickThroughRate: number;
}
