// Enterprise Data Visualization Intelligence Platform - JAC Learning Platform
// Author: Cavin Otieno
// Enhanced with AI-powered insights, educational analytics, and enterprise-grade features

declare module 'recharts' {
  import { ComponentType, ReactNode, ReactEventHandler, ChangeEvent } from 'react';

  // =============================================================================
  // CORE BASE INTERFACES
  // =============================================================================

  export interface ChartProps {
    width?: number | string;
    height?: number | string;
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    syncId?: string;
    className?: string;
    children?: ReactNode;
    layout?: 'horizontal' | 'vertical';
    stackOffset?: 'none' | 'expand' | 'wiggle' | 'silhouette';
    barCategoryGap?: number | string;
    barGap?: number | string;
    maxBarSize?: number;
    
    // Enterprise AI Integration
    aiInsights?: boolean;
    autoRefresh?: boolean;
    refreshInterval?: number;
    realTimeEnabled?: boolean;
    
    // Educational Analytics
    studentTracking?: boolean;
    learningObjective?: string;
    competencyLevel?: 'novice' | 'intermediate' | 'advanced' | 'expert';
    
    // Accessibility Compliance
    wcagCompliant?: boolean;
    screenReaderSupport?: boolean;
    highContrastMode?: boolean;
    
    // Performance Monitoring
    performanceTracking?: boolean;
    analyticsEnabled?: boolean;
    dataRetentionPeriod?: number;
  }

  // =============================================================================
  // AI-POWERED DATA INSIGHTS INTERFACES
  // =============================================================================

  export interface AIInsight {
    id: string;
    type: 'trend' | 'anomaly' | 'prediction' | 'recommendation' | 'correlation';
    confidence: number; // 0-1
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    actionable: boolean;
    generatedAt: Date;
    expiresAt?: Date;
    dataPoints: any[];
    recommendations: string[];
    relatedMetrics?: string[];
    visualEnhancement?: {
      highlight: boolean;
      color: string;
      icon: string;
      animation: string;
    };
  }

  export interface PredictiveAnalytics {
    model: 'linear-regression' | 'neural-network' | 'decision-tree' | 'ensemble' | 'custom';
    prediction: {
      value: number;
      confidenceInterval: [number, number];
      accuracy: number;
    };
    timeframe: {
      past: number; // days
      present: number; // days
      future: number; // days
    };
    factors: Array<{
      name: string;
      weight: number;
      impact: number;
    }>;
    scenarioAnalysis: Array<{
      scenario: string;
      prediction: number;
      probability: number;
    }>;
  }

  export interface SmartRecommendations {
    visualizationType: 'bar' | 'line' | 'area' | 'scatter' | 'radar' | 'pie' | 'heatmap' | 'treemap';
    reasoning: string;
    benefits: string[];
    colorScheme?: string[];
    accessibilityScore: number;
    performanceScore: number;
    engagementScore: number;
    alternativeOptions: Array<{
      type: string;
      score: number;
      reasoning: string;
    }>;
  }

  // =============================================================================
  // EDUCATIONAL ANALYTICS INTELLIGENCE
  // =============================================================================

  export interface LearningMetrics {
    studentId: string;
    competencyProgress: Record<string, {
      current: number; // 0-100
      target: number;
      trajectory: 'improving' | 'declining' | 'stable';
      masteryLevel: 'none' | 'emerging' | 'developing' | 'proficient' | 'advanced';
      timeInvested: number; // minutes
      attempts: number;
      successRate: number;
      lastActivity: Date;
    }>;
    engagementScore: number; // 0-100
    retentionRate: number; // 0-100
    averageSessionDuration: number; // minutes
    interactionRate: number; // events per session
    learningVelocity: number; // points per hour
    socialLearningScore: number; // 0-100
    collaborationMetrics?: {
      peerInteractions: number;
      groupContributions: number;
      leadershipScore: number;
    };
  }

  export interface AssessmentAnalytics {
    assessmentId: string;
    overallPerformance: {
      averageScore: number;
      medianScore: number;
      standardDeviation: number;
      completionRate: number;
      averageTimeToComplete: number; // minutes
    };
    itemAnalysis: Array<{
      questionId: string;
      difficulty: 'very-easy' | 'easy' | 'medium' | 'hard' | 'very-hard';
      discriminationIndex: number;
      correctnessRate: number;
      avgTimeSpent: number;
      commonWrongAnswers: string[];
    }>;
    learningOutcomes: {
      standardsMet: number;
      standardsTotal: number;
      remediationNeeded: string[];
      enrichmentRecommended: string[];
    };
    predictiveInsights: {
      successProbability: number;
      atRiskStudents: string[];
      highAchievers: string[];
      recommendedInterventions: string[];
    };
  }

  export interface EngagementTracking {
    sessionId: string;
    userId: string;
    eventType: 'view' | 'click' | 'hover' | 'scroll' | 'interaction' | 'completion';
    timestamp: Date;
    duration: number; // seconds
    interactionCount: number;
    featuresUsed: string[];
    navigationPattern: Array<{
      page: string;
      timestamp: Date;
      timeSpent: number;
    }>;
    attentionMetrics: {
      focusTime: number; // seconds focused on task
      distractionEvents: number;
      returnToTask: number;
      eyeTracking?: {
        fixationDuration: number;
        gazePattern: Array<{ x: number; y: number; timestamp: Date }>;
      };
    };
    deviceInfo: {
      type: 'desktop' | 'tablet' | 'mobile';
      screenSize: { width: number; height: number };
      browserInfo: string;
    };
  }

  // =============================================================================
  // ADVANCED CHART COMPONENTS
  // =============================================================================

  export interface LearningProgressChartProps extends ChartProps {
    competencies: Array<{
      id: string;
      name: string;
      currentLevel: number;
      targetLevel: number;
      progressRate: number; // percentage change per week
      learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
      difficultyCurve: Array<{ level: number; difficulty: number }>;
      milestones: Array<{
        name: string;
        achieved: boolean;
        date?: Date;
        score: number;
      }>;
    }>;
    timeFrame: 'daily' | 'weekly' | 'monthly' | 'semester';
    aiGuidance?: boolean;
    adaptivePathways?: boolean;
    socialComparison?: {
      enabled: boolean;
      comparisonGroup: 'class' | 'grade' | 'school' | 'global';
    };
  }

  export interface CompetencyMatrixChartProps extends ChartProps {
    matrix: Array<{
      skill: string;
      domain: string;
      current: number; // 0-100
      target: number;
      importance: number; // 1-5
      complexity: number; // 1-5
      dependencies: string[]; // other skills needed
      prerequisites: string[];
      learningPath: Array<{
        sequence: number;
        activity: string;
        estimatedTime: number; // hours
        resources: string[];
      }>;
      assessmentCriteria: string[];
      masteryIndicators: string[];
    }>;
    viewMode: 'progress' | 'importance' | 'complexity' | 'dependencies';
    groupingBy: 'domain' | 'skill-type' | 'difficulty' | 'sequence';
    aiInsights?: {
      suggestFocus: boolean;
      identifyGaps: boolean;
      recommendSequence: boolean;
    };
  }

  export interface AdaptivePathwayChartProps extends ChartProps {
    studentProfile: {
      id: string;
      learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';
      cognitiveLoad: 'low' | 'medium' | 'high';
      priorKnowledge: Record<string, number>;
      preferences: {
        contentFormat: string[];
        difficulty: 'adaptive' | 'challenging' | 'comfortable';
        pacing: 'self-paced' | 'guided' | 'intensive';
      };
    };
    pathway: Array<{
      nodeId: string;
      type: 'learning-objective' | 'activity' | 'assessment' | 'reflection' | 'application';
      content: {
        title: string;
        description: string;
        objectives: string[];
        estimatedTime: number; // minutes
        resources: Array<{
          type: 'video' | 'reading' | 'interactive' | 'simulation' | 'discussion';
          url: string;
          format: string;
        }>;
      };
      prerequisites: string[];
      mastery: {
        requiredScore: number;
        minTimeSpent: number;
        skillsGained: string[];
      };
      adaptivity: {
        skipIf: Array<{ condition: string; value: any }>;
        redirectTo: Array<{ condition: string; nodeId: string }>;
        additionalSupport: Array<{ condition: string; resource: string }>;
      };
      analytics: {
        completionRate: number;
        averageScore: number;
        commonFailures: string[];
        recommendedImprovements: string[];
      };
    }>;
    realTimeAdjustments: boolean;
    collaborativeFeatures: {
      peerLearning: boolean;
      groupActivities: boolean;
      mentorship: boolean;
    };
  }

  export interface CollaborationNetworkChartProps extends ChartProps {
    network: {
      nodes: Array<{
        id: string;
        type: 'student' | 'instructor' | 'resource' | 'activity' | 'concept';
        attributes: {
          name: string;
          role?: string;
          expertise?: string[];
          performance?: number;
          engagement?: number;
          connections?: number;
        };
        centrality: number;
        clustering: number;
        influence: number;
      }>;
      edges: Array<{
        source: string;
        target: string;
        type: 'collaboration' | 'guidance' | 'resource-sharing' | 'peer-influence' | 'knowledge-transfer';
        strength: number; // 0-1
        frequency: number;
        reciprocity: number;
        timeline: Array<{
          date: Date;
          strength: number;
        }>;
      }>;
    };
    metrics: {
      density: number;
      diameter: number;
      averagePathLength: number;
      clusteringCoefficient: number;
      communityStructure: Array<{
        members: string[];
        name: string;
        purpose: string;
        interactionIntensity: number;
      }>;
    };
    analysis: {
      keyPlayers: string[];
      influencers: string[];
      bridges: string[];
      isolates: string[];
      emergingGroups: Array<{
        members: string[];
        cohesion: number;
        potentialForConflict: number;
        recommendation: string;
      }>;
    };
    interventions: Array<{
      target: string;
      type: 'connect-isolates' | 'strengthen-bridges' | 'manage-influence' | 'support-emerging';
      description: string;
      expectedOutcome: string;
    }>;
  }

  // =============================================================================
  // REAL-TIME DATA STREAMING
  // =============================================================================

  export interface LiveDataStream {
    streamId: string;
    source: 'webSocket' | 'serverSentEvents' | 'polling' | 'mqtt';
    endpoint: string;
    authentication: {
      type: 'token' | 'oauth' | 'api-key' | 'certificate';
      credentials: any;
      refreshInterval?: number;
    };
    dataFormat: {
      schema: any;
      validation: boolean;
      compression?: 'gzip' | 'brotli' | 'none';
      encryption?: boolean;
    };
    performance: {
      latency: number; // milliseconds
      throughput: number; // messages per second
      reliability: number; // 0-1
      retryPolicy: {
        maxAttempts: number;
        backoffStrategy: 'linear' | 'exponential' | 'fixed';
        initialDelay: number;
      };
    };
    quality: {
      dataIntegrity: boolean;
      consistencyChecks: boolean;
      anomalyDetection: boolean;
      dataValidation: boolean;
    };
  }

  export interface WebSocketDataSource extends LiveDataStream {
    connection: {
      url: string;
      protocols?: string[];
      reconnect: {
        enabled: boolean;
        maxRetries: number;
        retryInterval: number;
        backoffMultiplier: number;
      };
      heartbeat: {
        enabled: boolean;
        interval: number; // seconds
        timeout: number; // seconds
      };
    };
    messageHandling: {
      bufferSize: number;
      messageQueue: 'fifo' | 'lifo' | 'priority';
      compression: boolean;
      batching: {
        enabled: boolean;
        batchSize: number;
        flushInterval: number;
      };
    };
  }

  export interface PerformanceStreaming {
    metrics: Array<{
      name: string;
      type: 'counter' | 'gauge' | 'histogram' | 'timer';
      value: number;
      timestamp: Date;
      tags: Record<string, string>;
      metadata?: any;
    }>;
    aggregation: {
      windowSize: number; // seconds
      functions: Array<{
        type: 'avg' | 'min' | 'max' | 'sum' | 'count' | 'percentile';
        percentile?: number; // for percentile function
      }>;
    };
    alerting: {
      enabled: boolean;
      rules: Array<{
        name: string;
        condition: string;
        threshold: number;
        duration: number; // seconds
        severity: 'info' | 'warning' | 'error' | 'critical';
        actions: string[];
      }>;
    };
    retention: {
      rawData: number; // days
      aggregatedData: number; // days
      archiving: boolean;
    };
  }

  // =============================================================================
  // ENTERPRISE ACCESSIBILITY INTERFACES
  // =============================================================================

  export interface WCAGChartProps extends ChartProps {
    accessibility: {
      wcagLevel: 'AA' | 'AAA';
      screenReaderSupport: {
        enabled: boolean;
        ariaLabels: Record<string, string>;
        ariaDescriptions: Record<string, string>;
        liveRegions?: {
          announcements: string[];
          regions: Array<{
            id: string;
            type: 'polite' | 'assertive';
            priority: 'low' | 'medium' | 'high';
          }>;
        };
      };
      keyboardNavigation: {
        enabled: boolean;
        focusManagement: boolean;
        shortcuts: Array<{
          key: string;
          action: string;
          description: string;
        }>;
        trapFocus: boolean;
      };
      visualAccessibility: {
        highContrast: boolean;
        colorBlindSupport: boolean;
        fontSize: 'small' | 'medium' | 'large' | 'extra-large';
        reducedMotion: boolean;
        focusIndicators: {
          enabled: boolean;
          style: 'outline' | 'background' | 'border';
          color: string;
          width: number;
        };
      };
      cognitiveAccessibility: {
        simplifiedDisplay: boolean;
        progressiveDisclosure: boolean;
        consistentLayout: boolean;
        clearInstructions: boolean;
        errorPrevention: boolean;
      };
    };
  }

  export interface ScreenReaderCompatible {
    enableAriaSupport: boolean;
    ariaLabels: {
      chart: string;
      axes: Record<string, string>;
      dataPoints: Record<string, string>;
      legend: string;
      tooltip: string;
    };
    ariaDescriptions: {
      chart: string;
      patterns: string;
      trends: string;
      insights: string;
    };
    dataTable: {
      enabled: boolean;
      headers: string[];
      captions: string;
      scope: 'row' | 'col' | 'rowgroup' | 'colgroup';
    };
    liveRegions: {
      dataChanges: boolean;
      errorAnnouncements: boolean;
      progressUpdates: boolean;
      insightsGeneration: boolean;
    };
  }

  export interface HighContrastMode {
    enabled: boolean;
    theme: 'dark' | 'light' | 'auto';
    contrastRatio: number; // minimum 4.5:1 for AA, 7:1 for AAA
    colorSchemes: {
      dataColors: string[];
      backgroundColor: string;
      textColor: string;
      axisColor: string;
      gridColor: string;
      highlightColor: string;
      errorColor: string;
      warningColor: string;
      successColor: string;
    };
    patterns: {
      enabled: boolean;
      patterns: Record<string, string>; // pattern types for color-blind support
      textures: Record<string, string>; // texture types for enhanced differentiation
    };
    customOverrides: {
      enabled: boolean;
      userColors: Record<string, string>;
      brandColors: Record<string, string>;
    };
  }

  // =============================================================================
  // ADVANCED ANALYTICS INTEGRATION
  // =============================================================================

  export interface ABTestingChart extends ChartProps {
    experiment: {
      id: string;
      name: string;
      description: string;
      hypothesis: string;
      successMetrics: string[];
      duration: number; // days
      participants: number;
      variants: Array<{
        id: string;
        name: string;
        description: string;
        trafficAllocation: number; // percentage
        modifications: Array<{
          property: string;
          original: any;
          variant: any;
        }>;
      }>;
    };
    statisticalAnalysis: {
      significanceLevel: number; // 0.05 default
      power: number; // 0.8 default
      testType: 't-test' | 'z-test' | 'chi-square' | 'mann-whitney';
      effectSize: number;
      confidenceInterval: [number, number];
    };
    results: {
      overall: {
        participantsAnalyzed: number;
        conversionRate: number;
        averageValue: number;
        standardDeviation: number;
      };
      byVariant: Array<{
        variantId: string;
        participants: number;
        metrics: Record<string, {
          value: number;
          confidenceInterval: [number, number];
          significance: boolean;
        }>;
        winner: boolean;
        lift: number; // percentage improvement
      }>;
      recommendations: Array<{
        type: 'implement-winner' | 'extend-test' | 'stop-test' | 'modify-test';
        reason: string;
        confidence: number;
      }>;
    };
  }

  export interface PerformanceBenchmarking {
    baselines: Record<string, {
      metric: string;
      value: number;
      timestamp: Date;
      source: 'historical' | 'industry' | 'peer' | 'best-in-class';
      confidence: number;
    }>;
    comparisons: Array<{
      benchmarkId: string;
      currentValue: number;
      targetValue: number;
      percentile: number; // where current stands in benchmark distribution
      gapAnalysis: {
        magnitude: number;
        areas: string[];
        priorities: Array<{
          area: string;
          impact: 'low' | 'medium' | 'high';
          effort: 'low' | 'medium' | 'high';
        }>;
      };
      actionPlan: Array<{
        initiative: string;
        owner: string;
        timeline: string;
        expectedImpact: number;
        resources: string[];
      }>;
    }>;
    trends: Array<{
      metric: string;
      direction: 'improving' | 'declining' | 'stable';
      rateOfChange: number; // per period
      forecast: Array<{
        date: Date;
        value: number;
        confidence: number;
      }>;
    }>;
  }

  export interface PredictiveSuccessMetrics {
    model: {
      algorithm: 'linear-regression' | 'random-forest' | 'neural-network' | 'svm' | 'ensemble';
      features: Array<{
        name: string;
        importance: number;
        type: 'numerical' | 'categorical' | 'text' | 'datetime';
        transformation?: string;
      }>;
      trainingData: {
        period: { start: Date; end: Date };
        samples: number;
        validation: {
          method: 'k-fold' | 'holdout' | 'cross-validation';
          folds?: number;
          testSize: number;
        };
      };
    };
    predictions: Array<{
      studentId: string;
      outcome: 'success' | 'struggling' | 'at-risk' | 'needs-intervention';
      probability: number;
      confidenceInterval: [number, number];
      timeline: {
        prediction: Date;
        targetAchievement: Date;
        criticalMilestones: Array<{
          date: Date;
          milestone: string;
          probability: number;
        }>;
      };
      factors: Array<{
        name: string;
        impact: number; // positive or negative
        confidence: number;
      }>;
      recommendations: Array<{
        type: 'intervention' | 'support' | 'enrichment' | 'modification';
        action: string;
        priority: 'low' | 'medium' | 'high';
        expectedImprovement: number;
      }>;
    }>;
    validation: {
      accuracy: number;
      precision: number;
      recall: number;
      f1Score: number;
      confusionMatrix: Record<string, Record<string, number>>;
      featureImportance: Array<{
        feature: string;
        importance: number;
      }>;
    };
  }

  // =============================================================================
  // CUSTOM LEARNING VISUALIZATIONS
  // =============================================================================

  export interface LearningEfficiencyChart extends ChartProps {
    efficiencyMetrics: {
      timeBasedEfficiency: {
        actualTime: number; // minutes
        optimalTime: number; // minutes
        efficiency: number; // percentage
        wastedTime: Array<{
          activity: string;
          duration: number; // minutes
          reason: string;
          avoidable: boolean;
        }>;
      };
      cognitiveEfficiency: {
        cognitiveLoad: number; // 1-10 scale
        processingSpeed: number; // tasks per hour
        accuracyRate: number; // percentage
        mentalFatigue: number; // 1-10 scale
        peakPerformance: {
          timeOfDay: string;
          duration: number; // minutes
          efficiency: number; // percentage
        };
      };
      resourceEfficiency: {
        attemptsPerSuccess: number;
        hintsUsed: number;
        resourcesAccessed: number;
        supportRequests: number;
        collaborativeInteractions: number;
      };
    };
    optimization: {
      recommendations: Array<{
        area: string;
        currentState: string;
        targetState: string;
        strategies: string[];
        expectedImprovement: number;
        implementation: {
          priority: 'low' | 'medium' | 'high';
          complexity: 'low' | 'medium' | 'high';
          timeframe: string;
          resources: string[];
        };
      }>;
      personalizedTips: string[];
      scheduleOptimization: {
        bestTimes: Array<{
          time: string;
          efficiency: number;
          reason: string;
        }>;
        breakRecommendations: {
          frequency: number; // minutes
          duration: number; // minutes
          type: 'active' | 'passive' | 'social';
        };
      };
    };
  }

  export interface KnowledgeRetentionChart extends ChartProps {
    retentionAnalysis: {
      forgettingCurve: Array<{
        timeElapsed: number; // hours
        retentionRate: number; // percentage
        confidence: number;
        dataSource: 'actual' | 'model' | 'hybrid';
      }>;
      memoryStrength: {
        strong: number; // >80% retention
        moderate: number; // 50-80% retention
        weak: number; // <50% retention
        fragile: number; // <20% retention
      };
      retentionFactors: Array<{
        factor: string;
        impact: number; // positive or negative
        strength: number;
        modifiable: boolean;
      }>;
    };
    interventionStrategies: {
      spacedRepetition: {
        schedule: Array<{
          reviewNumber: number;
          timeAfterLearning: number; // hours
          retentionTarget: number; // percentage
          confidence: number;
        }>;
        effectiveness: number; // percentage improvement
      };
      activeRecall: {
        techniques: string[];
        effectiveness: number;
        optimalFrequency: number; // times per review
      };
      elaboration: {
        methods: string[];
        impactOnRetention: number;
        cognitiveLoad: 'low' | 'medium' | 'high';
      };
      interleaving: {
        benefits: number;
        optimalInterval: number; // minutes
        varietyNeeded: number; // number of different topics
      };
    };
    predictions: {
      optimalReviewSchedule: Array<{
        concept: string;
        reviewDate: Date;
        confidence: number;
        method: string;
      }>;
      retentionForecast: Array<{
        date: Date;
        overallRetention: number;
        riskConcepts: string[];
        interventionNeeded: boolean;
      }>;
    };
  }

  export interface SocialLearningGraph extends ChartProps {
    socialNetwork: {
      nodes: Array<{
        id: string;
        type: 'student' | 'tutor' | 'peer-group' | 'resource' | 'community';
        attributes: {
          name: string;
          role: string;
          expertise: string[];
          personality?: string[];
          learningStyle: string;
          timezone: string;
          availability: Record<string, { start: string; end: string }>;
        };
        network: {
          connections: number;
          influence: number; // 0-1
          centrality: number; // 0-1
          diversity: number; // 0-1 variety in connections
        };
        engagement: {
          contribution: number; // 0-1
          responsiveness: number; // 0-1
          qualityScore: number; // 0-1
          learningGain: number; // percentage
        };
      }>;
      edges: Array<{
        source: string;
        target: string;
        type: 'mentorship' | 'peer-learning' | 'collaboration' | 'competition' | 'reference';
        strength: number; // 0-1
        interaction: {
          frequency: number; // per week
          quality: number; // 0-1
          reciprocity: number; // 0-1
          timeliness: number; // 0-1
        };
        outcomes: {
          learningImprovement: number; // percentage
          satisfaction: number; // 0-1
          retention: number; // 0-1
          motivation: number; // 0-1
        };
      }>;
    };
    analysis: {
      communityDetection: Array<{
        id: string;
        members: string[];
        size: number;
        density: number;
        purpose: string;
        success: number; // 0-1
        leader: string;
        activities: string[];
      }>;
      influenceFlow: {
        pathways: Array<{
          source: string;
          target: string;
          intermediate: string[];
          strength: number;
          type: 'knowledge-transfer' | 'motivation' | 'peer-support';
        }>;
        bottlenecks: string[];
        bridges: string[];
        influencers: string[];
      };
      collaborationPatterns: {
        optimalGroupSizes: number[];
        successfulPairings: Array<{
          pair: string[];
          compatibility: number;
          outcomes: Record<string, number>;
        }>;
        conflictAreas: Array<{
          nodes: string[];
          severity: number;
          causes: string[];
          resolution: string[];
        }>;
      };
    };
    interventions: Array<{
      target: 'individual' | 'pair' | 'group' | 'network';
      nodes: string[];
      type: 'connect-disconnected' | 'strengthen-weak-ties' | 'manage-influence' | 'resolve-conflict' | 'optimize-groups';
      strategy: string;
      expectedOutcome: Record<string, number>;
      implementation: {
        steps: string[];
        timeline: string;
        resources: string[];
        successMetrics: string[];
      };
    }>;
  }

  // =============================================================================
  // ENHANCED AXIS AND COMPONENT INTERFACES
  // =============================================================================

  export interface AxisProps {
    dataKey?: string;
    domain?: [number | string | ((dataMin: number) => number), number | string | ((dataMax: number) => number)];
    type?: 'number' | 'category';
    allowDataOverflow?: boolean;
    allowDuplicatedCategory?: boolean;
    allowDecimals?: boolean;
    allowTickFormatting?: boolean;
    axisLine?: boolean | React.CSSProperties;
    className?: string;
    tick?: boolean | ComponentType<any> | ReactNode | React.CSSProperties;
    tickFormatter?: (value: any, index: number) => string;
    tickLine?: boolean | React.CSSProperties;
    tickMargin?: number;
    tickSize?: number;
    interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd';
    angle?: number;
    fontSize?: number;
    fontFamily?: string;
    label?: string | number | ReactNode | ((props: any) => ReactNode);
    scale?: 'auto' | 'linear' | 'pow' | 'sqrt' | 'log' | 'identity' | 'time' | 'band' | 'point' | 'ordinal' | 'quantile' | 'quantize' | 'utc' | 'sequential' | 'threshold';
    tickCount?: number;
    unit?: string | number;
    name?: string | number;
    width?: number;
    height?: number;
    orientation?: 'left' | 'right' | 'middle' | 'top' | 'bottom';
    yAxisId?: string | number;
    xAxisId?: string | number;
    reversed?: boolean;

    // Enterprise Educational Features
    learningObjectives?: string[];
    competencyLevel?: 'novice' | 'intermediate' | 'advanced' | 'expert';
    adaptiveScaling?: boolean;
    aiSuggestedTicks?: boolean;
    accessibility?: {
      screenReaderLabel: string;
      description: string;
      navigationOrder: number;
    };
  }

  export interface TooltipProps {
    active?: boolean;
    coordinate?: { x?: number; y?: number };
    cursor?: boolean | ComponentType<any> | React.CSSProperties;
    separator?: string;
    offset?: number;
    filterNull?: boolean;
    itemStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    cursorStyle?: React.CSSProperties;
    viewBox?: { x?: number; y?: number; width?: number; height?: number };
    labelFormatter?: (label: any, payload: any[]) => ReactNode;
    itemFormatter?: (value: any, name: any, props: any) => ReactNode;
    position?: { x?: number; y?: number };
    wrapperStyle?: React.CSSProperties;
    content?: ComponentType<any>;

    // Enhanced Educational Features
    learningInsights?: boolean;
    showCompetencyLevels?: boolean;
    adaptiveRecommendations?: boolean;
    peerComparison?: {
      enabled: boolean;
      showPercentile: boolean;
      comparisonGroup: 'class' | 'grade' | 'school';
    };
    accessibility?: {
      keyboardNavigation: boolean;
      screenReaderSupport: boolean;
      highContrast: boolean;
    };
    aiEnhancements?: {
      insights: boolean;
      predictions: boolean;
      suggestions: boolean;
    };
  }

  // =============================================================================
  // ENHANCED CHART COMPONENTS WITH ENTERPRISE FEATURES
  // =============================================================================

  export const LineChart: ComponentType<ChartProps & {
    animations?: {
      enabled: boolean;
      duration?: number;
      easing?: string;
    };
    realTimeUpdates?: boolean;
    aiInsights?: boolean;
    educationalAnalytics?: {
      progressTracking: boolean;
      competencyMapping: boolean;
      adaptiveFeedback: boolean;
    };
  }>;

  export const BarChart: ComponentType<ChartProps & {
    animations?: {
      enabled: boolean;
      duration?: number;
      easing?: string;
    };
    realTimeUpdates?: boolean;
    aiInsights?: boolean;
    educationalAnalytics?: {
      comparisonMode: 'peer' | 'historical' | 'benchmark';
      competencyAssessment: boolean;
    };
  }>;

  export const AreaChart: ComponentType<ChartProps & {
    animations?: {
      enabled: boolean;
      duration?: number;
      easing?: string;
    };
    realTimeUpdates?: boolean;
    aiInsights?: boolean;
    educationalAnalytics?: {
      trendAnalysis: boolean;
      predictiveModeling: boolean;
      interventionTracking: boolean;
    };
  }>;

  export const ComposedChart: ComponentType<ChartProps & {
    animations?: {
      enabled: boolean;
      duration?: number;
      easing?: string;
    };
    realTimeUpdates?: boolean;
    aiInsights?: boolean;
    educationalAnalytics?: {
      multiMetricAnalysis: boolean;
      correlationDetection: boolean;
      learningPathOptimization: boolean;
    };
  }>;

  // Educational-specific chart components
  export const LearningProgressChart: ComponentType<LearningProgressChartProps>;
  export const CompetencyMatrixChart: ComponentType<CompetencyMatrixChartProps>;
  export const AdaptivePathwayChart: ComponentType<AdaptivePathwayChartProps>;
  export const CollaborationNetworkChart: ComponentType<CollaborationNetworkChartProps>;
  export const LearningEfficiencyChart: ComponentType<LearningEfficiencyChart>;
  export const KnowledgeRetentionChart: ComponentType<KnowledgeRetentionChart>;
  export const SocialLearningGraph: ComponentType<SocialLearningGraph>;

  // =============================================================================
  // UTILITY COMPONENTS WITH ENHANCED FEATURES
  // =============================================================================

  export const CartesianGrid: ComponentType<{
    stroke?: string;
    strokeDasharray?: string;
    strokeWidth?: number;
    className?: string;
    
    // Enterprise Features
    accessibilityGrid?: boolean;
    educationalTheming?: boolean;
    aiSuggested?: boolean;
    adaptive?: boolean;
  }>;

  export const Tooltip: ComponentType<TooltipProps>;
  export const Legend: ComponentType<LegendProps & {
    // Educational Features
    competencyLevels?: boolean;
    learningObjectives?: boolean;
    peerComparison?: boolean;
    aiInsights?: boolean;
    accessibility?: {
      screenReaderSupport: boolean;
      keyboardNavigation: boolean;
    };
  }>;

  export const ResponsiveContainer: ComponentType<ResponsiveContainerProps & {
    // Performance and Accessibility
    performanceMode?: 'speed' | 'quality' | 'adaptive';
    accessibilityMode?: 'standard' | 'enhanced' | 'maximum';
    realTimeOptimization?: boolean;
  }>;

  // Enhanced Line and Bar components
  export const Line: ComponentType<LineProps & {
    // Educational Intelligence
    competencyTracking?: boolean;
    learningObjective?: string;
    adaptiveStyling?: boolean;
    aiEnhanced?: boolean;
    accessibility?: {
      screenReaderLabel: string;
      focusable: boolean;
    };
  }>;

  export const Bar: ComponentType<BarProps & {
    // Educational Intelligence
    competencyLevel?: number;
    masteryIndicator?: boolean;
    adaptiveHeight?: boolean;
    aiOptimized?: boolean;
    accessibility?: {
      screenReaderLabel: string;
      focusable: boolean;
    };
  }>;

  // =============================================================================
  // AI-POWERED ENHANCEMENT COMPONENTS
  // =============================================================================

  export interface AIEnhancementLayer {
    enabled: boolean;
    insights: {
      automatic: boolean;
      confidence: number;
      topics: string[];
      realTime: boolean;
    };
    recommendations: {
      colorScheme: boolean;
      layout: boolean;
      accessibility: boolean;
      performance: boolean;
    };
    predictions: {
      engagement: boolean;
      understanding: boolean;
      retention: boolean;
      success: boolean;
    };
    interventions: {
      notifications: boolean;
      adaptations: boolean;
      supports: boolean;
    };
  }

  export const AIInsightsOverlay: ComponentType<{
    insights: AIInsight[];
    position: 'top' | 'bottom' | 'left' | 'right' | 'floating';
    style: 'subtle' | 'highlight' | 'interactive';
    autoHide: boolean;
    userInteraction: boolean;
  }>;

  export const PredictiveAnalyticsLayer: ComponentType<{
    predictions: PredictiveAnalytics[];
    transparency: 'low' | 'medium' | 'high';
    userControl: boolean;
    adaptation: 'immediate' | 'gradual' | 'manual';
  }>;

  export const SmartRecommendationsPanel: ComponentType<{
    recommendations: SmartRecommendations[];
    userPreferences: {
      style: string;
      complexity: 'simple' | 'moderate' | 'advanced';
      accessibility: boolean;
    };
    autoApply: boolean;
    feedback: boolean;
  }>;

  // =============================================================================
  // PERFORMANCE AND MONITORING INTERFACES
  // =============================================================================

  export interface PerformanceMetrics {
    rendering: {
      firstPaint: number; // milliseconds
      firstContentfulPaint: number;
      largestContentfulPaint: number;
      cumulativeLayoutShift: number;
      firstInputDelay: number;
    };
    dataProcessing: {
      dataLoadTime: number;
      chartRenderTime: number;
      animationDuration: number;
      memoryUsage: number; // MB
    };
    userExperience: {
      interactionLatency: number; // milliseconds
      scrollPerformance: number;
      animationSmoothness: number; // fps
      responsiveness: number; // 0-1
    };
    accessibility: {
      contrast: number; // ratio
      focusManagement: number; // 0-1
      screenReaderCompatibility: number; // 0-1
      keyboardNavigation: number; // 0-1
    };
  }

  export interface MonitoringConfig {
    enabled: boolean;
    realTime: boolean;
    metrics: PerformanceMetrics;
    alerting: {
      thresholds: Record<string, number>;
      channels: string[];
      frequency: number; // seconds
    };
    optimization: {
      autoOptimize: boolean;
      adaptiveQuality: boolean;
      cacheStrategy: 'memory' | 'session' | 'persistent';
    };
  }

  // =============================================================================
  // EXPORT ALL COMPONENTS
  // =============================================================================

  // Standard Recharts components
  export const XAxis: ComponentType<AxisProps>;
  export const YAxis: ComponentType<AxisProps>;
  export const CartesianGrid: ComponentType<any>;
  export const Tooltip: ComponentType<TooltipProps>;
  export const Legend: ComponentType<LegendProps>;
  export const ResponsiveContainer: ComponentType<ResponsiveContainerProps>;
  export const Line: ComponentType<LineProps>;
  export const Bar: ComponentType<BarProps>;
  export const Area: ComponentType<any>;
  export const Radar: ComponentType<any>;
  export const Scatter: ComponentType<any>;
  export const Pie: ComponentType<any>;
  export const Cell: ComponentType<any>;
  export const PolarGrid: ComponentType<any>;
  export const PolarAngleAxis: ComponentType<any>;
  export const PolarRadiusAxis: ComponentType<any>;

  // Educational chart components
  export const LearningProgressChart: ComponentType<LearningProgressChartProps>;
  export const CompetencyMatrixChart: ComponentType<CompetencyMatrixChartProps>;
  export const AdaptivePathwayChart: ComponentType<AdaptivePathwayChartProps>;
  export const CollaborationNetworkChart: ComponentType<CollaborationNetworkChartProps>;
  export const LearningEfficiencyChart: ComponentType<LearningEfficiencyChart>;
  export const KnowledgeRetentionChart: ComponentType<KnowledgeRetentionChart>;
  export const SocialLearningGraph: ComponentType<SocialLearningGraph>;

  // AI enhancement components
  export const AIInsightsOverlay: ComponentType<any>;
  export const PredictiveAnalyticsLayer: ComponentType<any>;
  export const SmartRecommendationsPanel: ComponentType<any>;

  // =============================================================================
  // STANDARD RECHARTS COMPONENTS (for compatibility)
  // =============================================================================

  // Missing chart types - add any not already defined above
  export const PieChart: ComponentType<ChartProps>;
  export const RadarChart: ComponentType<ChartProps>;
  export const ScatterChart: ComponentType<ChartProps>;
  export const ZAxis: ComponentType<any>;
  
  // Missing utility components
  export const ReferenceLine: ComponentType<any>;
  export const Brush: ComponentType<any>;
  export const FunnelChart: ComponentType<any>;
  export const Funnel: ComponentType<any>;
  export const LabelList: ComponentType<any>;
  export const WaterfallChart: ComponentType<any>;
  export const RadialBarChart: ComponentType<any>;
  export const RadialBar: ComponentType<any>;
  export const Treemap: ComponentType<any>;
}