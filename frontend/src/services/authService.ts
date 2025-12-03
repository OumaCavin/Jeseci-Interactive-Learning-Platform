// Enterprise Authentication Intelligence Platform
// Advanced authentication service with AI-powered security, real-time monitoring, and enterprise compliance

import api from './api';

// =============================================================================
// CORE AUTHENTICATION INTERFACES
// =============================================================================

export interface LoginCredentials {
  username: string; // Using email as username for backend compatibility
  password: string;
  rememberMe?: boolean;
  deviceId?: string;
  userAgent?: string;
  locationData?: LocationData;
  biometricData?: BiometricData;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string; // 'student', 'admin', 'instructor', etc.
  profile: {
    learning_style?: string;
    preferred_difficulty?: string;
    avatar_url?: string;
    is_staff?: boolean;
    first_name?: string;
    last_name?: string;
    bio?: string;
    date_joined?: string;
  };
  // Gamification fields
  level: number;
  experience_level: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  achievements_count: number;
  completed_modules: number;
  total_study_time: number; // in minutes
  weekly_goal: number;
  weekly_progress: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
  mfa_required?: boolean;
  mfa_methods?: MFAMethod[];
  security_score?: number;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  session_id?: string;
  expires_at?: string;
  permissions?: Permission[];
  security_context?: SecurityContext;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  learning_style?: string;
  preferred_difficulty?: string;
  invite_code?: string;
  device_fingerprint?: string;
  consent_given?: boolean;
  privacy_consent?: boolean;
  marketing_consent?: boolean;
}

// =============================================================================
// AI-POWERED SECURITY INTERFACES
// =============================================================================

export interface SecurityContext {
  risk_score: number;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: RiskFactor[];
  suspicious_indicators: SuspiciousIndicator[];
  geolocation_anomaly?: GeolocationAnomaly;
  device_anomaly?: DeviceAnomaly;
  behavioral_anomaly?: BehavioralAnomaly;
  network_anomaly?: NetworkAnomaly;
  security_recommendations: SecurityRecommendation[];
}

export interface RiskFactor {
  type: 'geolocation' | 'device' | 'behavioral' | 'network' | 'temporal' | 'credential';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  data: Record<string, any>;
}

export interface SuspiciousIndicator {
  type: 'multiple_failed_attempts' | 'unusual_location' | 'device_change' | 'time_anomaly' | 'speed_attack' | 'bot_detection';
  description: string;
  timestamp: string;
  evidence: Record<string, any>;
  automated_action?: 'block' | 'challenge' | 'monitor' | 'allow';
}

export interface GeolocationAnomaly {
  current_location: LocationData;
  typical_locations: LocationData[];
  distance_from_home: number;
  country_change: boolean;
  city_change: boolean;
  is_vpn: boolean;
  is_tor: boolean;
  proxy_detected: boolean;
}

export interface DeviceAnomaly {
  current_device: DeviceFingerprint;
  typical_devices: DeviceFingerprint[];
  device_recognized: boolean;
  browser_changed: boolean;
  os_changed: boolean;
  hardware_changed: boolean;
  fingerprint_similarity: number;
}

export interface BehavioralAnomaly {
  login_patterns: TemporalPattern[];
  interaction_anomalies: InteractionAnomaly[];
  speed_analysis: SpeedAnalysis;
  cognitive_load: number;
  engagement_metrics: EngagementMetrics;
}

export interface NetworkAnomaly {
  ip_address: string;
  isp: string;
  connection_type: string;
  latency_analysis: LatencyAnalysis;
  packet_loss: number;
  bandwidth_analysis: BandwidthAnalysis;
  geo_routing_anomaly: boolean;
}

// =============================================================================
// MULTI-FACTOR AUTHENTICATION INTERFACES
// =============================================================================

export interface MFAMethod {
  id: string;
  type: 'totp' | 'sms' | 'email' | 'push' | 'hardware_key' | 'biometric' | 'app' | 'backup_codes';
  name: string;
  description: string;
  is_enabled: boolean;
  is_verified: boolean;
  priority: number;
  backup_enabled: boolean;
  last_used?: string;
  setup_required: boolean;
}

export interface BiometricData {
  type: 'fingerprint' | 'face' | 'voice' | 'iris' | 'behavioral';
  template_data: string;
  confidence_threshold: number;
  verification_token: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  action_required: boolean;
  expires_at: string;
  context: Record<string, any>;
}

// =============================================================================
// SESSION MANAGEMENT INTERFACES
// =============================================================================

export interface Session {
  id: string;
  user_id: number;
  device_fingerprint: DeviceFingerprint;
  ip_address: string;
  location: LocationData;
  created_at: string;
  last_activity: string;
  expires_at: string;
  is_active: boolean;
  is_trusted: boolean;
  concurrent_sessions: ConcurrentSession[];
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  permissions: Permission[];
}

export interface DeviceFingerprint {
  device_id: string;
  browser: string;
  browser_version: string;
  os: string;
  os_version: string;
  screen_resolution: string;
  timezone: string;
  language: string;
  user_agent: string;
  touch_support: boolean;
  plugins: string[];
  fonts: string[];
  canvas_fingerprint: string;
  webrtc_leak: boolean;
  webgl_fingerprint: string;
}

export interface LocationData {
  country: string;
  region: string;
  city: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
  isp?: string;
  is_proxy: boolean;
  is_vpn: boolean;
  is_tor: boolean;
}

export interface ConcurrentSession {
  session_id: string;
  device_fingerprint: DeviceFingerprint;
  ip_address: string;
  location: LocationData;
  created_at: string;
  last_activity: string;
  risk_score: number;
}

// =============================================================================
// ROLE-BASED ACCESS CONTROL INTERFACES
// =============================================================================

export interface Permission {
  id: string;
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
  expires_at?: string;
  metadata?: Record<string, any>;
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'greater_than' | 'less_than' | 'regex';
  value: any;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  hierarchy_level: number;
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  user_id: number;
  role_id: string;
  assigned_by: number;
  assigned_at: string;
  expires_at?: string;
  conditions?: RoleCondition[];
}

export interface RoleCondition {
  field: string;
  operator: string;
  value: any;
  expires_at?: string;
}

// =============================================================================
// AUDIT & COMPLIANCE INTERFACES
// =============================================================================

export interface SecurityAuditLog {
  id: string;
  user_id: number;
  event_type: SecurityEventType;
  event_category: 'authentication' | 'authorization' | 'data_access' | 'configuration' | 'threat' | 'compliance';
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: string;
  ip_address: string;
  user_agent: string;
  location: LocationData;
  device_fingerprint: DeviceFingerprint;
  details: AuditEventDetails;
  risk_score: number;
  automated_action?: string;
  reviewed_by?: number;
  review_status?: 'pending' | 'approved' | 'rejected' | 'false_positive';
  retention_until?: string;
}

export type SecurityEventType = 
  | 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'session_start' | 'session_end'
  | 'password_change' | 'password_reset' | 'mfa_setup' | 'mfa_verification' | 'mfa_bypass'
  | 'permission_change' | 'role_assignment' | 'data_access' | 'data_modification' | 'export_attempt'
  | 'suspicious_activity' | 'security_violation' | 'threat_detected' | 'security_response'
  | 'account_lock' | 'account_unlock' | 'account_disable' | 'account_enable' | 'registration'
  | 'device_registration' | 'device_deregistration' | 'api_key_generation' | 'oauth_login'
  | 'consent_granted' | 'consent_withdrawn' | 'data_export' | 'data_deletion' | 'privacy_request'
  | 'compliance_check' | 'audit_export' | 'system_config_change';

export interface AuditEventDetails {
  event_name: string;
  description: string;
  success: boolean;
  failure_reason?: string;
  previous_state?: Record<string, any>;
  new_state?: Record<string, any>;
  affected_resources?: string[];
  additional_context?: Record<string, any>;
  correlation_id?: string;
  parent_event_id?: string;
}

export interface ComplianceReport {
  report_id: string;
  type: 'gdpr' | 'ferpa' | 'coppa' | 'security_audit' | 'access_review' | 'data_retention';
  generated_at: string;
  period_start: string;
  period_end: string;
  summary: ComplianceSummary;
  findings: ComplianceFinding[];
  recommendations: ComplianceRecommendation[];
  generated_by: number;
  status: 'draft' | 'completed' | 'reviewed' | 'archived';
}

export interface ComplianceSummary {
  total_events: number;
  critical_issues: number;
  warnings: number;
  compliance_score: number;
  key_metrics: Record<string, number>;
  trend_analysis: TrendAnalysis;
}

export interface ComplianceFinding {
  id: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string[];
  affected_users: number[];
  remediation_steps: string[];
  due_date?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
}

export interface ComplianceRecommendation {
  category: string;
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  impact: string;
  implementation_effort: 'low' | 'medium' | 'high';
  cost_benefit_analysis: string;
}

// =============================================================================
// ANALYTICS & INTELLIGENCE INTERFACES
// =============================================================================

export interface SecurityAnalytics {
  timestamp: string;
  metrics: SecurityMetrics;
  trends: SecurityTrends;
  predictions: SecurityPrediction[];
  alerts: SecurityAlert[];
  recommendations: SecurityRecommendation[];
}

export interface SecurityMetrics {
  total_login_attempts: number;
  successful_logins: number;
  failed_logins: number;
  mfa_success_rate: number;
  average_session_duration: number;
  concurrent_sessions_average: number;
  suspicious_activity_count: number;
  blocked_attempts: number;
  data_access_events: number;
  compliance_violations: number;
}

export interface SecurityTrends {
  login_attempts_trend: TrendPoint[];
  failure_rate_trend: TrendPoint[];
  mfa_adoption_trend: TrendPoint[];
  session_duration_trend: TrendPoint[];
  security_score_trend: TrendPoint[];
  threat_level_trend: TrendPoint[];
}

export interface TrendPoint {
  timestamp: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface SecurityPrediction {
  type: 'login_failure' | 'suspicious_activity' | 'session_timeout' | 'password_attack' | 'account_lockout';
  probability: number;
  time_horizon: string;
  confidence: number;
  contributing_factors: string[];
  recommended_actions: string[];
}

export interface SecurityAlert {
  id: string;
  type: 'threat' | 'anomaly' | 'violation' | 'compliance' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  affected_assets: string[];
  status: 'new' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive';
  auto_generated: boolean;
  escalation_level: number;
}

export interface SecurityRecommendation {
  id: string;
  category: 'authentication' | 'authorization' | 'monitoring' | 'compliance' | 'configuration' | 'training';
  title: string;
  description: string;
  rationale: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
  effort: 'low' | 'medium' | 'high';
  dependencies?: string[];
  success_metrics: string[];
  implementation_steps: string[];
  estimated_cost?: number;
  roi_analysis?: string;
}

// =============================================================================
// THREAT INTELLIGENCE INTERFACES
// =============================================================================

export interface ThreatIntelligence {
  threats: ThreatIndicator[];
  ioc_matches: IOCMatch[];
  reputation_scores: ReputationScore[];
  mitre_attack_techniques: MITRETechnique[];
  threat_actors: ThreatActor[];
}

export interface ThreatIndicator {
  id: string;
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'file' | 'behavior';
  value: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  first_seen: string;
  last_seen: string;
  source: string;
  description: string;
  tags: string[];
  mitre_techniques?: string[];
}

export interface IOCMatch {
  ioc_id: string;
  match_type: 'exact' | 'fuzzy' | 'behavioral' | 'correlation';
  confidence: number;
  context: Record<string, any>;
  historical_context: Record<string, any>;
}

export interface ReputationScore {
  entity_type: 'ip' | 'domain' | 'email' | 'user' | 'device';
  entity_value: string;
  reputation_score: number; // 0-100
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  factors: ReputationFactor[];
  last_updated: string;
  source: string;
}

export interface ReputationFactor {
  factor_type: string;
  weight: number;
  score: number;
  description: string;
  evidence: string[];
}

export interface MITRETechnique {
  id: string;
  name: string;
  description: string;
  tactics: string[];
  techniques: string[];
  mitigations: string[];
  references: string[];
  detection_rules: string[];
  confidence: number;
  last_observed: string;
}

export interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  motivation: string[];
  capabilities: string[];
  targets: string[];
 ttps: string[];
  iocs: string[];
  confidence: number;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
}

// =============================================================================
// SUPPORTING INTERFACES
// =============================================================================

export interface TemporalPattern {
  event_type: string;
  typical_time_range: [string, string];
  frequency: number;
  seasonality: string[];
  anomalies: TemporalAnomaly[];
}

export interface TemporalAnomaly {
  timestamp: string;
  deviation_from_pattern: number;
  confidence: number;
  context: Record<string, any>;
}

export interface InteractionAnomaly {
  interaction_type: string;
  deviation_from_baseline: number;
  context: string;
  timestamp: string;
}

export interface SpeedAnalysis {
  typing_speed: number;
  mouse_movement_patterns: number;
  cognitive_load_indicators: number;
  engagement_metrics: number;
  deviation_from_baseline: number;
}

export interface EngagementMetrics {
  interaction_frequency: number;
  session_duration: number;
  feature_usage_patterns: number;
  attention_indicators: number;
  navigation_patterns: number;
}

export interface LatencyAnalysis {
  average_latency: number;
  latency_variance: number;
  packet_loss_rate: number;
  jitter_analysis: number;
  connection_stability: number;
}

export interface BandwidthAnalysis {
  upload_speed: number;
  download_speed: number;
  bandwidth_utilization: number;
  consistency_score: number;
  throttling_indicators: number;
}

export interface ComplianceData {
  consent_records: ConsentRecord[];
  data_processing_activities: DataProcessingActivity[];
  retention_policies: RetentionPolicy[];
  access_requests: AccessRequest[];
  deletion_requests: DeletionRequest[];
  export_requests: ExportRequest[];
}

export interface ConsentRecord {
  user_id: number;
  consent_type: 'privacy' | 'marketing' | 'analytics' | 'third_party' | 'data_processing';
  granted: boolean;
  granted_at?: string;
  withdrawn_at?: string;
  version: string;
  legal_basis: string;
  purpose: string;
  retention_period: string;
  data_categories: string[];
}

export interface DataProcessingActivity {
  id: string;
  purpose: string;
  legal_basis: string;
  data_categories: string[];
  processing_operations: string[];
  recipients: string[];
  retention_period: string;
  safeguards: string[];
  risk_assessment: string;
  compliance_status: 'compliant' | 'non_compliant' | 'pending_review';
}

export interface RetentionPolicy {
  data_category: string;
  retention_period: string;
  legal_basis: string;
  deletion_method: string;
  automated_deletion: boolean;
  exceptions: string[];
}

export interface AccessRequest {
  id: string;
  user_id: number;
  request_type: 'data_access' | 'portability' | 'rectification' | 'erasure' | 'restriction' | 'objection';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'partially_fulfilled';
  requested_data: string[];
  submitted_at: string;
  processed_at?: string;
  deadline: string;
  processing_notes: string[];
}

export interface DeletionRequest {
  id: string;
  user_id: number;
  data_categories: string[];
  reason: string;
  verification_method: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'partial';
  submitted_at: string;
  completed_at?: string;
  deadline: string;
  verification_required: boolean;
  legal_restrictions: string[];
}

export interface ExportRequest {
  id: string;
  user_id: number;
  export_format: 'json' | 'csv' | 'pdf' | 'xml';
  data_categories: string[];
  destination: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'expired';
  submitted_at: string;
  completed_at?: string;
  download_url?: string;
  expires_at?: string;
  file_size?: number;
}

// =============================================================================
// MAIN AUTHENTICATION SERVICE CLASS
// =============================================================================

class EnterpriseAuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REMEMBER_ME_KEY = 'remember_me';
  private readonly USER_DATA_KEY = 'user_data';
  private readonly SESSION_ID_KEY = 'session_id';
  private readonly SECURITY_CONTEXT_KEY = 'security_context';
  private readonly DEVICE_FINGERPRINT_KEY = 'device_fingerprint';
  private readonly MFA_SECRET_KEY = 'mfa_secret';
  private readonly PUSH_NOTIFICATION_KEY = 'push_notifications';
  private readonly AUDIT_SESSION_KEY = 'audit_session';
  
  private securityWebSocket: WebSocket | null = null;
  private securityEventHandlers: Map<string, Function[]> = new Map();
  private threatIntelligence: ThreatIntelligence | null = null;
  private complianceData: ComplianceData | null = null;

  // =============================================================================
  // CORE AUTHENTICATION METHODS
  // =============================================================================

  /**
   * Enhanced login with AI-powered security analysis
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Generate device fingerprint if not provided
      const deviceFingerprint = credentials.deviceFingerprint || await this.generateDeviceFingerprint();
      
      // Enhanced security analysis before login
      const securityContext = await this.analyzeSecurityContext({
        device_fingerprint: deviceFingerprint,
        user_agent: credentials.userAgent,
        location_data: credentials.locationData,
        timestamp: new Date().toISOString()
      });

      const response = await api.post<AuthResponse>('/auth/login/', {
        email: credentials.username,
        password: credentials.password,
        device_fingerprint: deviceFingerprint,
        security_context: securityContext,
        biometric_data: credentials.biometricData,
        remember_me: credentials.rememberMe
      });

      const { user, token, refresh_token, mfa_required, mfa_methods, security_score, risk_level, session_id, permissions, security_context } = response.data;

      // Store authentication data
      if (credentials.rememberMe) {
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.REMEMBER_ME_KEY, 'true');
        if (refresh_token) {
          localStorage.setItem('refresh_token', refresh_token);
        }
      } else {
        sessionStorage.setItem(this.TOKEN_KEY, token);
        sessionStorage.setItem(this.REMEMBER_ME_KEY, 'false');
        if (refresh_token) {
          sessionStorage.setItem('refresh_token', refresh_token);
        }
      }

      // Store user data and session information
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
      if (session_id) {
        localStorage.setItem(this.SESSION_ID_KEY, session_id);
      }
      if (security_context) {
        localStorage.setItem(this.SECURITY_CONTEXT_KEY, JSON.stringify(security_context));
      }
      if (deviceFingerprint) {
        localStorage.setItem(this.DEVICE_FINGERPRINT_KEY, JSON.stringify(deviceFingerprint));
      }

      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Initialize security monitoring
      await this.initializeSecurityMonitoring(session_id, security_score, risk_level);

      // Log successful authentication
      await this.logSecurityEvent('login_success', {
        user_id: user.id,
        session_id,
        security_score,
        risk_level,
        location: credentials.locationData,
        device_fingerprint: deviceFingerprint
      });

      // Auto-enroll in push notifications if risk is low
      if (risk_level === 'low' && mfa_methods?.some(m => m.type === 'push')) {
        await this.enrollPushNotifications(user.id);
      }

      return response.data;
    } catch (error: any) {
      console.error('Enhanced login error:', error);
      
      // Enhanced error handling with security analysis
      await this.handleLoginFailure(credentials, error);
      
      // Map specific error types
      if (error.response?.status === 401) {
        throw new Error('Invalid credentials or account locked. Please verify your information.');
      } else if (error.response?.status === 423) {
        throw new Error('Account is temporarily locked due to security measures. Please contact support.');
      } else if (error.response?.status === 429) {
        await this.analyzeLoginRateLimiting(credentials);
        throw new Error('Too many login attempts. Please wait before trying again.');
      } else if (error.response?.status === 503) {
        throw new Error('Authentication service temporarily unavailable. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to authentication service. Please check your connection.');
      } else {
        throw new Error(error.response?.data?.message || 'Authentication failed. Please try again.');
      }
    }
  }

  /**
   * Enhanced registration with compliance and security features
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Pre-registration security analysis
      const securityAnalysis = await this.analyzeRegistrationSecurity(userData);
      
      // Generate device fingerprint
      const deviceFingerprint = userData.device_fingerprint || await this.generateDeviceFingerprint();
      
      const response = await api.post<AuthResponse>('/auth/register/', {
        ...userData,
        device_fingerprint: deviceFingerprint,
        security_analysis: securityAnalysis,
        consent_records: {
          privacy: userData.privacy_consent || false,
          marketing: userData.marketing_consent || false,
          data_processing: userData.consent_given || false
        }
      });

      const { user, token, refresh_token, mfa_required, mfa_methods, security_score, session_id, permissions } = response.data;

      // Store authentication data
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
      localStorage.setItem(this.DEVICE_FINGERPRINT_KEY, JSON.stringify(deviceFingerprint));
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }
      if (session_id) {
        localStorage.setItem(this.SESSION_ID_KEY, session_id);
      }

      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Log successful registration
      await this.logSecurityEvent('registration', {
        user_id: user.id,
        session_id,
        device_fingerprint: deviceFingerprint,
        security_analysis: securityAnalysis,
        consent_given: userData.consent_given
      });

      // Initialize compliance data for new user
      await this.initializeUserCompliance(user.id, userData);

      // Setup default MFA if recommended
      if (security_score && security_score < 70 && mfa_methods?.length > 0) {
        await this.promptMFASetup(user.id, mfa_methods);
      }

      return response.data;
    } catch (error: any) {
      console.error('Enhanced registration error:', error);
      
      // Analyze registration failure
      await this.analyzeRegistrationFailure(userData, error);
      
      if (error.response?.status === 400) {
        const message = error.response.data?.message;
        if (message?.includes('email')) {
          throw new Error('Email is already registered. Please use a different email address.');
        } else if (message?.includes('username')) {
          throw new Error('Username is already taken. Please choose a different username.');
        } else if (message?.includes('invite_code')) {
          throw new Error('Invalid or expired invite code.');
        } else {
          throw new Error(message || 'Registration failed. Please check your information.');
        }
      } else if (error.response?.status === 409) {
        throw new Error('Account already exists with different credentials.');
      } else if (error.response?.status === 503) {
        throw new Error('Registration service temporarily unavailable. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to registration service. Please check your connection.');
      } else {
        throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    }
  }

  /**
   * Comprehensive logout with security cleanup
   */
  async logout(sessionId?: string): Promise<void> {
    try {
      // Get current session info for audit
      const currentSessionId = sessionId || this.getSessionId();
      const user = this.getCurrentUser();
      const deviceFingerprint = this.getDeviceFingerprint();

      // Notify backend for session termination
      await api.post('/auth/logout/', {
        session_id: currentSessionId,
        device_fingerprint: deviceFingerprint,
        logout_reason: 'user_initiated'
      });

      // Log logout event
      if (user) {
        await this.logSecurityEvent('logout', {
          user_id: user.id,
          session_id: currentSessionId,
          device_fingerprint: deviceFingerprint,
          session_duration: this.calculateSessionDuration()
        });
      }

      // Cleanup all stored data
      this.clearAllAuthData();

      // Close security monitoring connections
      await this.closeSecurityMonitoring();

      // Clear security event handlers
      this.securityEventHandlers.clear();

      // Remove authorization header
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.warn('Logout notification failed:', error);
      
      // Continue with logout even if backend notification fails
      this.clearAllAuthData();
      delete api.defaults.headers.common['Authorization'];
    }
  }

  // =============================================================================
  // MULTI-FACTOR AUTHENTICATION METHODS
  // =============================================================================

  /**
   * Setup MFA method for user
   */
  async setupMFAMethod(userId: number, methodType: MFAMethod['type'], methodData: Record<string, any>): Promise<MFAMethod> {
    try {
      const response = await api.post<MFAMethod>('/auth/mfa/setup/', {
        user_id: userId,
        method_type: methodType,
        method_data: methodData
      });

      // Log MFA setup
      await this.logSecurityEvent('mfa_setup', {
        user_id: userId,
        method_type: methodType,
        setup_success: true
      });

      return response.data;
    } catch (error: any) {
      console.error('MFA setup error:', error);
      
      await this.logSecurityEvent('mfa_setup', {
        user_id: userId,
        method_type: methodType,
        setup_success: false,
        error: error.message
      });

      if (error.response?.status === 400) {
        throw new Error('Invalid MFA method or method already configured.');
      } else if (error.response?.status === 409) {
        throw new Error('MFA method already exists.');
      } else {
        throw new Error('MFA setup failed. Please try again.');
      }
    }
  }

  /**
   * Verify MFA code/token
   */
  async verifyMFA(userId: number, methodId: string, verificationData: Record<string, any>): Promise<boolean> {
    try {
      const response = await api.post<{ verified: boolean }>('/auth/mfa/verify/', {
        user_id: userId,
        method_id: methodId,
        verification_data: verificationData
      });

      const { verified } = response.data;

      // Log verification attempt
      await this.logSecurityEvent('mfa_verification', {
        user_id: userId,
        method_id: methodId,
        verification_success: verified
      });

      // If verification failed multiple times, trigger security response
      if (!verified) {
        await this.handleMFAFailure(userId, methodId);
      }

      return verified;
    } catch (error: any) {
      console.error('MFA verification error:', error);
      
      await this.logSecurityEvent('mfa_verification', {
        user_id: userId,
        method_id: methodId,
        verification_success: false,
        error: error.message
      });

      throw new Error('MFA verification failed. Please try again.');
    }
  }

  /**
   * Generate TOTP secret for authenticator apps
   */
  async generateTOTPSecret(userId: number): Promise<{ secret: string; qr_code: string; backup_codes: string[] }> {
    try {
      const response = await api.post<{ secret: string; qr_code: string; backup_codes: string[] }>('/auth/mfa/totp/generate/', {
        user_id: userId
      });

      // Store secret locally for setup process
      localStorage.setItem(this.MFA_SECRET_KEY, response.data.secret);

      return response.data;
    } catch (error: any) {
      console.error('TOTP secret generation error:', error);
      throw new Error('Failed to generate TOTP secret. Please try again.');
    }
  }

  /**
   * Enable/disable push notifications for MFA
   */
  async enrollPushNotifications(userId: number): Promise<void> {
    try {
      await api.post('/auth/mfa/push/enroll/', {
        user_id: userId,
        device_info: await this.generateDeviceFingerprint()
      });
    } catch (error: any) {
      console.error('Push notification enrollment error:', error);
      // Don't throw error as this is optional
    }
  }

  // =============================================================================
  // SECURITY INTELLIGENCE METHODS
  // =============================================================================

  /**
   * Analyze security context for login attempt
   */
  private async analyzeSecurityContext(context: {
    device_fingerprint: DeviceFingerprint;
    user_agent?: string;
    location_data?: LocationData;
    timestamp: string;
  }): Promise<SecurityContext> {
    try {
      // Enhanced security analysis with AI
      const response = await api.post<SecurityContext>('/auth/security/analyze/', context);
      
      // Store security context for this session
      localStorage.setItem(this.SECURITY_CONTEXT_KEY, JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('Security context analysis failed:', error);
      
      // Return basic security context if analysis fails
      return {
        risk_score: 50,
        threat_level: 'medium',
        risk_factors: [],
        suspicious_indicators: [],
        security_recommendations: []
      };
    }
  }

  /**
   * Initialize real-time security monitoring
   */
  private async initializeSecurityMonitoring(sessionId: string, securityScore: number, riskLevel: string): Promise<void> {
    try {
      if (riskLevel === 'high' || riskLevel === 'critical') {
        // Initialize enhanced monitoring for high-risk sessions
        await this.startEnhancedMonitoring(sessionId);
      } else {
        // Start basic monitoring for all sessions
        await this.startBasicMonitoring(sessionId);
      }

      // Setup WebSocket connection for real-time security events
      await this.initializeSecurityWebSocket(sessionId);

    } catch (error) {
      console.error('Security monitoring initialization failed:', error);
      // Continue without monitoring if initialization fails
    }
  }

  /**
   * Start basic security monitoring
   */
  private async startBasicMonitoring(sessionId: string): Promise<void> {
    try {
      await api.post('/auth/monitoring/basic/', {
        session_id: sessionId,
        monitoring_level: 'basic'
      });
    } catch (error) {
      console.error('Basic monitoring start failed:', error);
    }
  }

  /**
   * Start enhanced security monitoring for high-risk sessions
   */
  private async startEnhancedMonitoring(sessionId: string): Promise<void> {
    try {
      await api.post('/auth/monitoring/enhanced/', {
        session_id: sessionId,
        monitoring_level: 'enhanced',
        features: [
          'real_time_threat_detection',
          'behavioral_analysis',
          'geolocation_monitoring',
          'device_tracking',
          'network_analysis'
        ]
      });
    } catch (error) {
      console.error('Enhanced monitoring start failed:', error);
    }
  }

  /**
   * Initialize WebSocket connection for real-time security monitoring
   */
  private async initializeSecurityWebSocket(sessionId: string): Promise<void> {
    try {
      const wsUrl = process.env.REACT_APP_SECURITY_WS_URL || 'wss://api.jac-learning.com/security/ws';
      const token = this.getToken();
      
      if (!token) return;

      this.securityWebSocket = new WebSocket(`${wsUrl}?session_id=${sessionId}&token=${token}`);

      this.securityWebSocket.onopen = () => {
        console.log('Security WebSocket connected');
        this.registerSecurityEventHandlers();
      };

      this.securityWebSocket.onmessage = (event) => {
        const securityEvent = JSON.parse(event.data);
        this.handleSecurityEvent(securityEvent);
      };

      this.securityWebSocket.onerror = (error) => {
        console.error('Security WebSocket error:', error);
      };

      this.securityWebSocket.onclose = () => {
        console.log('Security WebSocket disconnected');
        this.securityWebSocket = null;
      };

    } catch (error) {
      console.error('Security WebSocket initialization failed:', error);
    }
  }

  /**
   * Register security event handlers
   */
  private registerSecurityEventHandlers(): void {
    const events = [
      'threat_detected',
      'suspicious_activity',
      'session_anomaly',
      'device_change',
      'geolocation_anomaly',
      'compliance_violation',
      'security_recommendation'
    ];

    events.forEach(eventType => {
      this.registerSecurityEventHandler(eventType, (event: any) => {
        this.handleSecurityEvent(event);
      });
    });
  }

  /**
   * Register custom security event handler
   */
  private registerSecurityEventHandler(eventType: string, handler: Function): void {
    if (!this.securityEventHandlers.has(eventType)) {
      this.securityEventHandlers.set(eventType, []);
    }
    this.securityEventHandlers.get(eventType)!.push(handler);
  }

  /**
   * Handle security events from WebSocket
   */
  private handleSecurityEvent(event: any): void {
    const handlers = this.securityEventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }

    // Handle specific event types
    switch (event.type) {
      case 'threat_detected':
        this.handleThreatDetected(event);
        break;
      case 'suspicious_activity':
        this.handleSuspiciousActivity(event);
        break;
      case 'session_anomaly':
        this.handleSessionAnomaly(event);
        break;
      case 'device_change':
        this.handleDeviceChange(event);
        break;
      case 'geolocation_anomaly':
        this.handleGeolocationAnomaly(event);
        break;
      case 'compliance_violation':
        this.handleComplianceViolation(event);
        break;
    }
  }

  /**
   * Handle detected threat
   */
  private async handleThreatDetected(event: any): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (!user) return;

      // Log threat detection
      await this.logSecurityEvent('threat_detected', {
        user_id: user.id,
        threat_type: event.threat_type,
        severity: event.severity,
        description: event.description,
        automated_response: event.response_action
      });

      // Execute automated response if specified
      if (event.response_action) {
        await this.executeAutomatedResponse(event.response_action, event);
      }

      // Show user notification for high-severity threats
      if (event.severity === 'high' || event.severity === 'critical') {
        this.showSecurityAlert(event);
      }

    } catch (error) {
      console.error('Threat handling failed:', error);
    }
  }

  /**
   * Handle suspicious activity
   */
  private async handleSuspiciousActivity(event: any): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (!user) return;

      // Log suspicious activity
      await this.logSecurityEvent('suspicious_activity', {
        user_id: user.id,
        activity_type: event.activity_type,
        risk_score: event.risk_score,
        indicators: event.indicators
      });

      // Adjust monitoring level based on risk
      if (event.risk_score > 80) {
        await this.escalateMonitoring(user.id, event.session_id);
      }

    } catch (error) {
      console.error('Suspicious activity handling failed:', error);
    }
  }

  /**
   * Execute automated security response
   */
  private async executeAutomatedResponse(action: string, event: any): Promise<void> {
    try {
      switch (action) {
        case 'session_lock':
          await this.lockSession(event.session_id, 'automated_threat_response');
          break;
        case 'require_additional_auth':
          await this.requireAdditionalAuthentication(event.session_id);
          break;
        case 'log_user_out':
          await this.forceLogout(event.session_id, 'security_threat');
          break;
        case 'notify_security_team':
          await this.notifySecurityTeam(event);
          break;
        case 'enhance_monitoring':
          await this.enhanceMonitoring(event.session_id);
          break;
        default:
          console.warn('Unknown automated response action:', action);
      }
    } catch (error) {
      console.error('Automated response execution failed:', error);
    }
  }

  // =============================================================================
  // ROLE-BASED ACCESS CONTROL METHODS
  // =============================================================================

  /**
   * Check if user has specific permission
   */
  async hasPermission(resource: string, action: string, context?: Record<string, any>): Promise<boolean> {
    try {
      const user = this.getCurrentUser();
      if (!user) return false;

      const response = await api.post<{ has_permission: boolean }>('/auth/permissions/check/', {
        user_id: user.id,
        resource,
        action,
        context
      });

      return response.data.has_permission;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  /**
   * Get all permissions for current user
   */
  async getUserPermissions(userId: number): Promise<Permission[]> {
    try {
      const response = await api.get<Permission[]>(`/auth/permissions/user/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Get user permissions failed:', error);
      return [];
    }
  }

  /**
   * Assign role to user
   */
  async assignRole(userId: number, roleId: string, conditions?: RoleCondition[]): Promise<void> {
    try {
      await api.post('/auth/roles/assign/', {
        user_id: userId,
        role_id: roleId,
        conditions,
        assigned_by: this.getCurrentUser()?.id
      });

      // Log role assignment
      await this.logSecurityEvent('role_assignment', {
        target_user_id: userId,
        role_id: roleId,
        assigned_by: this.getCurrentUser()?.id,
        conditions
      });

    } catch (error) {
      console.error('Role assignment failed:', error);
      throw new Error('Failed to assign role. Please try again.');
    }
  }

  /**
   * Revoke role from user
   */
  async revokeRole(userId: number, roleId: string): Promise<void> {
    try {
      await api.post('/auth/roles/revoke/', {
        user_id: userId,
        role_id: roleId,
        revoked_by: this.getCurrentUser()?.id
      });

      // Log role revocation
      await this.logSecurityEvent('role_revocation', {
        target_user_id: userId,
        role_id: roleId,
        revoked_by: this.getCurrentUser()?.id
      });

    } catch (error) {
      console.error('Role revocation failed:', error);
      throw new Error('Failed to revoke role. Please try again.');
    }
  }

  // =============================================================================
  // AUDIT & COMPLIANCE METHODS
  // =============================================================================

  /**
   * Log security event for audit trail
   */
  private async logSecurityEvent(eventType: SecurityEventType, details: AuditEventDetails): Promise<void> {
    try {
      const user = this.getCurrentUser();
      const deviceFingerprint = this.getDeviceFingerprint();
      const locationData = await this.getCurrentLocation();

      const auditLog: Partial<SecurityAuditLog> = {
        user_id: user?.id || 0,
        event_type: eventType,
        event_category: this.categorizeEvent(eventType),
        severity: this.determineSeverity(eventType, details),
        timestamp: new Date().toISOString(),
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
        location: locationData,
        device_fingerprint: deviceFingerprint,
        details: {
          ...details,
          success: details.success !== false,
          timestamp: new Date().toISOString(),
          correlation_id: this.generateCorrelationId()
        },
        risk_score: this.calculateRiskScore(eventType, details),
        automated_action: details.automated_action
      };

      await api.post('/auth/audit/log/', auditLog);
    } catch (error) {
      console.error('Audit logging failed:', error);
      // Continue execution even if audit logging fails
    }
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    type: ComplianceReport['type'],
    periodStart: string,
    periodEnd: string
  ): Promise<ComplianceReport> {
    try {
      const response = await api.post<ComplianceReport>('/auth/compliance/report/', {
        type,
        period_start: periodStart,
        period_end: periodEnd,
        generated_by: this.getCurrentUser()?.id
      });

      return response.data;
    } catch (error) {
      console.error('Compliance report generation failed:', error);
      throw new Error('Failed to generate compliance report. Please try again.');
    }
  }

  /**
   * Submit data access request (GDPR compliance)
   */
  async submitDataAccessRequest(requestType: AccessRequest['request_type']): Promise<AccessRequest> {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const response = await api.post<AccessRequest>('/auth/compliance/access-request/', {
        user_id: user.id,
        request_type: requestType,
        requested_data: this.getRelevantDataCategories(requestType),
        submitted_at: new Date().toISOString(),
        deadline: this.calculateComplianceDeadline(requestType)
      });

      // Log compliance request
      await this.logSecurityEvent('compliance_request', {
        user_id: user.id,
        request_type: requestType,
        requested_data: response.data.requested_data,
        success: true
      });

      return response.data;
    } catch (error) {
      console.error('Data access request failed:', error);
      
      await this.logSecurityEvent('compliance_request', {
        user_id: user?.id,
        request_type: requestType,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new Error('Failed to submit data access request. Please try again.');
    }
  }

  /**
   * Submit data deletion request
   */
  async submitDataDeletionRequest(dataCategories: string[], reason: string): Promise<DeletionRequest> {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const response = await api.post<DeletionRequest>('/auth/compliance/deletion-request/', {
        user_id: user.id,
        data_categories: dataCategories,
        reason: reason,
        verification_method: 'email_confirmation',
        submitted_at: new Date().toISOString(),
        deadline: this.calculateDeletionDeadline(),
        verification_required: true,
        legal_restrictions: await this.checkLegalRestrictions(dataCategories)
      });

      // Log deletion request
      await this.logSecurityEvent('data_deletion_request', {
        user_id: user.id,
        data_categories: dataCategories,
        reason: reason,
        success: true
      });

      return response.data;
    } catch (error) {
      console.error('Data deletion request failed:', error);
      
      await this.logSecurityEvent('data_deletion_request', {
        user_id: user?.id,
        data_categories: dataCategories,
        reason: reason,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new Error('Failed to submit data deletion request. Please try again.');
    }
  }

  // =============================================================================
  // ANALYTICS & INTELLIGENCE METHODS
  // =============================================================================

  /**
   * Get security analytics dashboard data
   */
  async getSecurityAnalytics(timeRange: string = '24h'): Promise<SecurityAnalytics> {
    try {
      const response = await api.get<SecurityAnalytics>(`/auth/analytics/security/?time_range=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Security analytics retrieval failed:', error);
      throw new Error('Failed to retrieve security analytics. Please try again.');
    }
  }

  /**
   * Get threat intelligence updates
   */
  async getThreatIntelligence(): Promise<ThreatIntelligence> {
    try {
      const response = await api.get<ThreatIntelligence>('/auth/threat-intelligence/');
      this.threatIntelligence = response.data;
      return response.data;
    } catch (error) {
      console.error('Threat intelligence retrieval failed:', error);
      
      // Return cached data if available
      if (this.threatIntelligence) {
        return this.threatIntelligence;
      }
      
      // Return empty threat intelligence if all else fails
      return {
        threats: [],
        ioc_matches: [],
        reputation_scores: [],
        mitre_attack_techniques: [],
        threat_actors: []
      };
    }
  }

  /**
   * Check if IP/domain has threat intelligence match
   */
  async checkThreatIntelligence(entityType: 'ip' | 'domain' | 'email', entityValue: string): Promise<ThreatIndicator | null> {
    try {
      const response = await api.get<ThreatIndicator>(`/auth/threat-intelligence/check/?type=${entityType}&value=${entityValue}`);
      return response.data;
    } catch (error) {
      console.error('Threat intelligence check failed:', error);
      return null;
    }
  }

  // =============================================================================
  // DEVICE & SESSION MANAGEMENT METHODS
  // =============================================================================

  /**
   * Register trusted device
   */
  async registerTrustedDevice(deviceName: string, deviceFingerprint?: DeviceFingerprint): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const fingerprint = deviceFingerprint || await this.generateDeviceFingerprint();

      await api.post('/auth/devices/register/', {
        user_id: user.id,
        device_name: deviceName,
        device_fingerprint: fingerprint,
        is_trusted: true,
        registered_at: new Date().toISOString()
      });

      // Log device registration
      await this.logSecurityEvent('device_registration', {
        user_id: user.id,
        device_name: deviceName,
        device_fingerprint: fingerprint,
        success: true
      });

    } catch (error) {
      console.error('Device registration failed:', error);
      throw new Error('Failed to register device. Please try again.');
    }
  }

  /**
   * Get user's registered devices
   */
  async getRegisteredDevices(userId: number): Promise<DeviceFingerprint[]> {
    try {
      const response = await api.get<DeviceFingerprint[]>(`/auth/devices/user/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Get registered devices failed:', error);
      return [];
    }
  }

  /**
   * Revoke device access
   */
  async revokeDevice(deviceId: string): Promise<void> {
    try {
      await api.post('/auth/devices/revoke/', {
        device_id: deviceId,
        revoked_by: this.getCurrentUser()?.id,
        revoked_at: new Date().toISOString()
      });

      // Log device revocation
      await this.logSecurityEvent('device_deregistration', {
        device_id: deviceId,
        revoked_by: this.getCurrentUser()?.id,
        success: true
      });

    } catch (error) {
      console.error('Device revocation failed:', error);
      throw new Error('Failed to revoke device access. Please try again.');
    }
  }

  /**
   * Get active sessions for user
   */
  async getActiveSessions(userId: number): Promise<Session[]> {
    try {
      const response = await api.get<Session[]>(`/auth/sessions/user/${userId}/active/`);
      return response.data;
    } catch (error) {
      console.error('Get active sessions failed:', error);
      return [];
    }
  }

  /**
   * Terminate specific session
   */
  async terminateSession(sessionId: string, reason: string): Promise<void> {
    try {
      await api.post('/auth/sessions/terminate/', {
        session_id: sessionId,
        reason: reason,
        terminated_by: this.getCurrentUser()?.id,
        terminated_at: new Date().toISOString()
      });

      // Log session termination
      await this.logSecurityEvent('session_end', {
        session_id: sessionId,
        reason: reason,
        terminated_by: this.getCurrentUser()?.id,
        success: true
      });

      // If terminating current session, logout
      if (sessionId === this.getSessionId()) {
        await this.logout(sessionId);
      }

    } catch (error) {
      console.error('Session termination failed:', error);
      throw new Error('Failed to terminate session. Please try again.');
    }
  }

  // =============================================================================
  // TOKEN MANAGEMENT METHODS
  // =============================================================================

  /**
   * Enhanced token refresh with security analysis
   */
  async refreshToken(): Promise<string> {
    try {
      const refresh_token = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
      
      if (!refresh_token) {
        throw new Error('No refresh token available');
      }

      // Analyze security context before refresh
      const securityContext = await this.analyzeSecurityContext({
        device_fingerprint: await this.generateDeviceFingerprint(),
        user_agent: navigator.userAgent,
        location_data: await this.getCurrentLocation(),
        timestamp: new Date().toISOString()
      });

      const response = await api.post<{ token: string }>('/auth/token/refresh/', {
        refresh_token,
        security_context: securityContext
      });

      const { token } = response.data;

      // Store new token
      const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
      if (rememberMe) {
        localStorage.setItem(this.TOKEN_KEY, token);
      } else {
        sessionStorage.setItem(this.TOKEN_KEY, token);
      }

      // Update authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Log token refresh
      await this.logSecurityEvent('token_refresh', {
        security_context: securityContext,
        success: true
      });

      return token;
    } catch (error: any) {
      console.error('Enhanced token refresh error:', error);
      
      // Log failed refresh attempt
      await this.logSecurityEvent('token_refresh', {
        success: false,
        error: error.message
      });

      // If refresh fails, logout user
      await this.logout();
      throw error;
    }
  }

  // =============================================================================
  // UTILITY AND HELPER METHODS
  // =============================================================================

  /**
   * Generate unique device fingerprint
   */
  async generateDeviceFingerprint(): Promise<DeviceFingerprint> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx!.textBaseline = 'top';
      ctx!.font = '14px Arial';
      ctx!.fillText('Device fingerprint', 2, 2);
      
      const canvas_fingerprint = canvas.toDataURL();
      
      // Get WebGL fingerprint
      const webgl_fingerprint = await this.getWebGLFingerprint();
      
      // Collect plugins
      const plugins = Array.from(navigator.plugins).map(plugin => plugin.name);
      
      // Collect fonts (simplified)
      const fonts = await this.getAvailableFonts();

      const fingerprint: DeviceFingerprint = {
        device_id: this.generateDeviceId(),
        browser: this.getBrowserInfo().browser,
        browser_version: this.getBrowserInfo().version,
        os: this.getOSInfo().os,
        os_version: this.getOSInfo().version,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        user_agent: navigator.userAgent,
        touch_support: 'ontouchstart' in window,
        plugins,
        fonts,
        canvas_fingerprint,
        webrtc_leak: await this.detectWebRTCLeak(),
        webgl_fingerprint: webgl_fingerprint
      };

      return fingerprint;
    } catch (error) {
      console.error('Device fingerprint generation failed:', error);
      throw new Error('Failed to generate device fingerprint');
    }
  }

  /**
   * Get WebGL fingerprint
   */
  private async getWebGLFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'webgl_not_supported';

      const fingerprint = {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shading_language_version: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        max_texture_size: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        max_vertex_attribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
        max_vertex_uniform_vectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
        max_fragment_uniform_vectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
        extensions: gl.getSupportedExtensions() || []
      };

      return btoa(JSON.stringify(fingerprint));
    } catch (error) {
      return 'webgl_fingerprint_error';
    }
  }

  /**
   * Get available fonts
   */
  private async getAvailableFonts(): Promise<string[]> {
    try {
      // Simplified font detection
      const fonts = [
        'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
        'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
        'Trebuchet MS', 'Arial Black', 'Impact', 'Tahoma', 'Geneva'
      ];

      // Test font availability
      const detectedFonts: string[] = [];
      const testString = 'mmmmmmmmmmlliIWW@#';
      const testSize = '72px';

      fonts.forEach(font => {
        const testElement = document.createElement('div');
        testElement.style.fontSize = testSize;
        testElement.style.fontFamily = font;
        testElement.textContent = testString;
        document.body.appendChild(testElement);

        const defaultWidth = testElement.offsetWidth;
        const defaultHeight = testElement.offsetHeight;
        document.body.removeChild(testElement);

        if (defaultWidth !== 0 || defaultHeight !== 0) {
          detectedFonts.push(font);
        }
      });

      return detectedFonts;
    } catch (error) {
      return [];
    }
  }

  /**
   * Detect WebRTC leak
   */
  private async detectWebRTCLeak(): Promise<boolean> {
    try {
      const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
      if (!RTCPeerConnection) return false;

      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('test');
      
      const offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false
      });

      await pc.setLocalDescription(offer);

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate device ID
   */
  private generateDeviceId(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      window.screen.width + 'x' + window.screen.height,
      new Date().getTimezoneOffset(),
      navigator.platform
    ];

    let hash = 0;
    for (const component of components) {
      const char = component.charCodeAt(0);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36);
  }

  /**
   * Get browser information
   */
  private getBrowserInfo(): { browser: string; version: string } {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';

    if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
      version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
      version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
      version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
      version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
    }

    return { browser, version };
  }

  /**
   * Get OS information
   */
  private getOSInfo(): { os: string; version: string } {
    const userAgent = navigator.userAgent;
    let os = 'Unknown';
    let version = 'Unknown';

    if (userAgent.includes('Windows')) {
      os = 'Windows';
      version = userAgent.match(/Windows NT (\d+\.\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Mac OS X')) {
      os = 'macOS';
      version = userAgent.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || 'Unknown';
    } else if (userAgent.includes('Linux')) {
      os = 'Linux';
      version = 'Unknown';
    } else if (userAgent.includes('Android')) {
      os = 'Android';
      version = userAgent.match(/Android (\d+\.\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      os = 'iOS';
      version = userAgent.match(/OS (\d+[._]\d+)/)?.[1]?.replace('_', '.') || 'Unknown';
    }

    return { os, version };
  }

  /**
   * Get current location data
   */
  private async getCurrentLocation(): Promise<LocationData> {
    try {
      // This would typically use a geolocation service
      // For now, return basic timezone info
      return {
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        is_proxy: false,
        is_vpn: false,
        is_tor: false
      };
    } catch (error) {
      return {
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        timezone: 'Unknown',
        is_proxy: false,
        is_vpn: false,
        is_tor: false
      };
    }
  }

  /**
   * Get client IP address
   */
  private async getClientIP(): Promise<string> {
    try {
      // This would typically call an IP detection service
      return 'Unknown';
    } catch (error) {
      return 'Unknown';
    }
  }

  /**
   * Generate correlation ID for event tracking
   */
  private generateCorrelationId(): string {
    return 'corr_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  /**
   * Calculate risk score for event
   */
  private calculateRiskScore(eventType: SecurityEventType, details: AuditEventDetails): number {
    let baseScore = 0;

    switch (eventType) {
      case 'login_failure':
        baseScore = 60;
        break;
      case 'suspicious_activity':
        baseScore = 80;
        break;
      case 'threat_detected':
        baseScore = 90;
        break;
      case 'security_violation':
        baseScore = 95;
        break;
      case 'mfa_bypass':
        baseScore = 85;
        break;
      default:
        baseScore = 10;
    }

    // Adjust based on success/failure
    if (details.success === false) {
      baseScore += 20;
    }

    return Math.min(baseScore, 100);
  }

  /**
   * Determine event severity
   */
  private determineSeverity(eventType: SecurityEventType, details: AuditEventDetails): 'info' | 'warning' | 'error' | 'critical' {
    const criticalEvents = ['threat_detected', 'security_violation', 'account_lock', 'data_breach'];
    const errorEvents = ['login_failure', 'permission_violation', 'mfa_failure'];
    const warningEvents = ['suspicious_activity', 'geolocation_anomaly', 'device_change'];

    if (criticalEvents.includes(eventType)) return 'critical';
    if (errorEvents.includes(eventType)) return 'error';
    if (warningEvents.includes(eventType)) return 'warning';
    return 'info';
  }

  /**
   * Categorize event type
   */
  private categorizeEvent(eventType: SecurityEventType): SecurityAuditLog['event_category'] {
    if (['login_attempt', 'login_success', 'login_failure', 'logout', 'mfa_setup', 'mfa_verification'].includes(eventType)) {
      return 'authentication';
    }
    if (['permission_change', 'role_assignment', 'data_access', 'data_modification'].includes(eventType)) {
      return 'authorization';
    }
    if (['data_export', 'data_deletion', 'compliance_check'].includes(eventType)) {
      return 'compliance';
    }
    if (['suspicious_activity', 'threat_detected', 'security_violation'].includes(eventType)) {
      return 'threat';
    }
    return 'configuration';
  }

  /**
   * Calculate session duration
   */
  private calculateSessionDuration(): number {
    const sessionId = this.getSessionId();
    if (!sessionId) return 0;

    // This would typically be stored when session starts
    // For now, return estimated duration
    return 0; // Placeholder
  }

  /**
   * Get current session ID
   */
  private getSessionId(): string | null {
    return localStorage.getItem(this.SESSION_ID_KEY) || sessionStorage.getItem(this.SESSION_ID_KEY);
  }

  /**
   * Get current user data from storage
   */
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Get current device fingerprint
   */
  private getDeviceFingerprint(): DeviceFingerprint | null {
    try {
      const fingerprint = localStorage.getItem(this.DEVICE_FINGERPRINT_KEY);
      return fingerprint ? JSON.parse(fingerprint) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Clear all authentication data
   */
  private clearAllAuthData(): void {
    // Clear localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REMEMBER_ME_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.SESSION_ID_KEY);
    localStorage.removeItem(this.SECURITY_CONTEXT_KEY);
    localStorage.removeItem(this.DEVICE_FINGERPRINT_KEY);
    localStorage.removeItem(this.MFA_SECRET_KEY);
    localStorage.removeItem(this.PUSH_NOTIFICATION_KEY);
    localStorage.removeItem(this.AUDIT_SESSION_KEY);
    localStorage.removeItem('refresh_token');

    // Clear sessionStorage
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REMEMBER_ME_KEY);
    sessionStorage.removeItem(this.SESSION_ID_KEY);
    sessionStorage.removeItem('refresh_token');
  }

  /**
   * Close security monitoring connections
   */
  private async closeSecurityMonitoring(): Promise<void> {
    try {
      if (this.securityWebSocket) {
        this.securityWebSocket.close();
        this.securityWebSocket = null;
      }
    } catch (error) {
      console.error('Error closing security monitoring:', error);
    }
  }

  // =============================================================================
  // PLACEHOLDER METHODS (Implementation would depend on backend)
  // =============================================================================

  private async handleLoginFailure(credentials: LoginCredentials, error: any): Promise<void> {
    // Implementation would handle login failures with security analysis
  }

  private async analyzeLoginRateLimiting(credentials: LoginCredentials): Promise<void> {
    // Implementation would analyze rate limiting patterns
  }

  private async analyzeRegistrationSecurity(userData: RegisterData): Promise<any> {
    // Implementation would analyze registration for security risks
    return {};
  }

  private async initializeUserCompliance(userId: number, userData: RegisterData): Promise<void> {
    // Implementation would initialize compliance data for new user
  }

  private async promptMFASetup(userId: number, mfaMethods: MFAMethod[]): Promise<void> {
    // Implementation would prompt user to setup MFA
  }

  private async analyzeRegistrationFailure(userData: RegisterData, error: any): Promise<void> {
    // Implementation would analyze registration failures
  }

  private async handleMFAFailure(userId: number, methodId: string): Promise<void> {
    // Implementation would handle MFA failures
  }

  private async lockSession(sessionId: string, reason: string): Promise<void> {
    // Implementation would lock the session
  }

  private async requireAdditionalAuthentication(sessionId: string): Promise<void> {
    // Implementation would require additional authentication
  }

  private async forceLogout(sessionId: string, reason: string): Promise<void> {
    // Implementation would force logout
  }

  private async notifySecurityTeam(event: any): Promise<void> {
    // Implementation would notify security team
  }

  private async enhanceMonitoring(sessionId: string): Promise<void> {
    // Implementation would enhance monitoring
  }

  private async escalateMonitoring(userId: number, sessionId: string): Promise<void> {
    // Implementation would escalate monitoring
  }

  private showSecurityAlert(event: any): void {
    // Implementation would show security alert to user
  }

  private async handleSessionAnomaly(event: any): Promise<void> {
    // Implementation would handle session anomalies
  }

  private async handleDeviceChange(event: any): Promise<void> {
    // Implementation would handle device changes
  }

  private async handleGeolocationAnomaly(event: any): Promise<void> {
    // Implementation would handle geolocation anomalies
  }

  private async handleComplianceViolation(event: any): Promise<void> {
    // Implementation would handle compliance violations
  }

  private getRelevantDataCategories(requestType: AccessRequest['request_type']): string[] {
    // Implementation would return relevant data categories based on request type
    return [];
  }

  private calculateComplianceDeadline(requestType: AccessRequest['request_type']): string {
    // Implementation would calculate compliance deadline based on request type
    const now = new Date();
    switch (requestType) {
      case 'data_access':
      case 'portability':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
      case 'erasure':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
      default:
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  private calculateDeletionDeadline(): string {
    // Implementation would calculate deletion deadline
    const now = new Date();
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
  }

  private async checkLegalRestrictions(dataCategories: string[]): Promise<string[]> {
    // Implementation would check legal restrictions for data deletion
    return [];
  }

  // =============================================================================
  // ADDITIONAL UTILITY METHODS
  // =============================================================================

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/auth/password-reset/', { email });
    } catch (error: any) {
      console.error('Password reset request error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else {
        throw new Error('Password reset request failed. Please try again.');
      }
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/password-reset/confirm/', {
        token,
        new_password: newPassword,
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Invalid or expired reset token.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else {
        throw new Error('Password reset failed. Please try again.');
      }
    }
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
      });

      // Log password change
      const user = this.getCurrentUser();
      if (user) {
        await this.logSecurityEvent('password_change', {
          user_id: user.id,
          success: true
        });
      }
    } catch (error: any) {
      console.error('Change password error:', error);
      
      // Log failed password change
      const user = this.getCurrentUser();
      if (user) {
        await this.logSecurityEvent('password_change', {
          user_id: user.id,
          success: false,
          error: error.message
        });
      }

      if (error.response?.status === 400) {
        throw new Error('Current password is incorrect.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else {
        throw new Error('Password change failed. Please try again.');
      }
    }
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      await api.post('/auth/verify-email/', { token });
    } catch (error: any) {
      console.error('Email verification error:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Invalid or expired verification token.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else {
        throw new Error('Email verification failed. Please try again.');
      }
    }
  }
}

export const authService = new EnterpriseAuthService();
export default authService;