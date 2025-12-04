// Utility Types for JAC Learning Platform
// Enhanced by Cavin Otieno

export interface IntegrationConfig {
  id?: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  configuration: any;
}

export interface ComplianceFinding {
  id: string;
  status: 'in_progress' | 'open' | 'resolved' | 'accepted';
  [key: string]: any;
}

export interface MLModel {
  name: string;
  version: string;
  accuracy: number;
  lastTrained: string;
  featureImportance: Record<string, number>;
}

export interface RemediationAction {
  id: string;
  name: string;
  conditions: Record<string, any>;
  implementation: string;
  rollbackPlan: string | null;
  status: string;
  successRate: number;
}

export interface ErrorReport {
  id: string;
  message: string;
  url: string;
  lineNumber?: number;
  columnNumber?: number;
  stack?: string;
  timestamp: string;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  severity: 'fatal' | 'critical' | 'high' | 'medium' | 'low';
  category?: string;
  userRole?: string;
  timeOfDay?: string;
  platform?: string;
  environment?: string;
}

export interface UIConfiguration {
  aiConfig: AIConfiguration;
  performanceConfig: PerformanceConfiguration;
  securityConfig: SecurityConfiguration;
  maintenanceMode: boolean;
}

export interface AIConfiguration {
  enabled: boolean;
  provider: 'openai' | 'gemini' | 'both';
  maxTokens: number;
  temperature: number;
}

export interface PerformanceConfiguration {
  enableCaching: boolean;
  cacheTimeout: number;
  enableMonitoring: boolean;
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
