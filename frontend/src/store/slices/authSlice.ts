// JAC Learning Platform - Enterprise Authentication System
// Author: Cavin Otieno
// Architecture: Zustand with enterprise-grade security features

import { create } from 'zustand';
import { subscribeWithSelector, devtools, immer } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';

// ===== ENTERPRISE TYPES =====
export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  grade?: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
  security: UserSecurity;
  analytics: UserAnalytics;
  metadata: Record<string, any>;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceInfo?: DeviceInfo;
  mfaCode?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  grade?: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingOptIn?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: 'Bearer' | 'JWT';
  scope?: string[];
}

export interface DeviceInfo {
  deviceId: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  browser: string;
  os: string;
  ipAddress: string;
  location?: GeoLocation;
  isTrusted: boolean;
  lastSeen: string;
}

export interface GeoLocation {
  country: string;
  region: string;
  city: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  accessibility: AccessibilityPreferences;
  privacy: PrivacyPreferences;
  learning: LearningPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  quizReminders: boolean;
  assignmentDue: boolean;
  progressUpdates: boolean;
  achievementUnlocked: boolean;
  systemUpdates: boolean;
  securityAlerts: boolean;
}

export interface AccessibilityPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlindFriendly: boolean;
}

export interface PrivacyPreferences {
  dataSharing: boolean;
  analyticsTracking: boolean;
  thirdPartyIntegrations: boolean;
  profileVisibility: 'public' | 'private' | 'restricted';
  activityVisibility: 'public' | 'private' | 'friends';
}

export interface LearningPreferences {
  adaptiveDifficulty: boolean;
  preferredPace: 'slow' | 'normal' | 'fast';
  visualLearning: boolean;
  auditoryLearning: boolean;
  kinestheticLearning: boolean;
  gamification: boolean;
  peerCollaboration: boolean;
}

export interface UserSecurity {
  passwordStrength: number;
  lastPasswordChange: string;
  mfaEnabled: boolean;
  mfaMethods: MFAMethod[];
  loginAttempts: number;
  accountLocked: boolean;
  lockoutUntil?: string;
  trustedDevices: string[];
  securityQuestions: SecurityQuestion[];
  securityScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  biometricEnabled: boolean;
  biometricMethods: BiometricMethod[];
}

export interface MFAMethod {
  type: 'sms' | 'email' | 'totp' | 'u2f' | 'webauthn';
  isPrimary: boolean;
  isEnabled: boolean;
  phoneNumber?: string;
  email?: string;
  deviceId?: string;
  backupCodes: string[];
  lastUsed?: string;
}

export interface BiometricMethod {
  type: 'fingerprint' | 'faceid' | 'windows_hello' | 'android_biometric';
  isEnabled: boolean;
  deviceId: string;
  lastUsed?: string;
}

export interface SecurityQuestion {
  id: string;
  question: string;
  answerHash: string;
  isAnswered: boolean;
}

export interface UserAnalytics {
  totalLogins: number;
  lastActivity: string;
  sessionDuration: number;
  deviceUsage: Record<string, number>;
  locationHistory: GeoLocation[];
  securityEvents: SecurityEvent[];
  riskScore: number;
  trustLevel: number;
  engagementScore: number;
}

export interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'mfa_enabled' | 'device_added' | 'suspicious_activity';
  timestamp: string;
  ipAddress: string;
  location: GeoLocation;
  deviceInfo: DeviceInfo;
  success: boolean;
  riskScore: number;
  description: string;
}

export interface SocialLoginProvider {
  provider: 'google' | 'microsoft' | 'apple' | 'linkedin' | 'facebook' | 'twitter';
  isConnected: boolean;
  email: string;
  providerId: string;
  lastUsed?: string;
}

export interface SSOProvider {
  provider: 'saml' | 'oauth2' | 'oidc' | 'ldap';
  isConfigured: boolean;
  isActive: boolean;
  domain: string;
  attributes: Record<string, string>;
  lastUsed?: string;
}

export interface SessionInfo {
  sessionId: string;
  userId: string;
  deviceId: string;
  ipAddress: string;
  location: GeoLocation;
  startTime: string;
  lastActivity: string;
  isActive: boolean;
  expiresAt: string;
  riskScore: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  metadata: Record<string, any>;
}

export type UserRole = 'student' | 'teacher' | 'admin' | 'parent' | 'guardian' | 'moderator' | 'supervisor';

export interface AuthState {
  // Core Authentication State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokens: AuthTokens | null;
  session: SessionInfo | null;
  
  // Security State
  securityEvents: SecurityEvent[];
  auditLogs: AuditLog[];
  riskAssessment: RiskAssessment;
  threats: SecurityThreat[];
  
  // Multi-Factor Authentication
  mfaRequired: boolean;
  mfaChallengeId: string | null;
  mfaMethods: MFAMethod[];
  biometricAvailable: boolean;
  biometricEnabled: boolean;
  
  // Social & SSO
  socialProviders: SocialLoginProvider[];
  ssoProviders: SSOProvider[];
  socialLoginInProgress: boolean;
  ssoLoginInProgress: boolean;
  
  // Session Management
  activeSessions: SessionInfo[];
  trustedDevices: DeviceInfo[];
  deviceTracking: boolean;
  
  // Compliance & Analytics
  complianceStatus: ComplianceStatus;
  dataRetention: DataRetentionPolicy;
  privacyControls: PrivacyControls;
  
  // Performance & Caching
  lastSync: string;
  cacheExpiry: string;
  offlineMode: boolean;
}

// ===== ENTERPRISE ACTION TYPES =====
export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  recommendations: string[];
  lastAssessed: string;
}

export interface RiskFactor {
  type: 'location' | 'device' | 'behavior' | 'network' | 'time';
  description: string;
  riskScore: number;
  weight: number;
  details: Record<string, any>;
}

export interface SecurityThreat {
  id: string;
  type: 'brute_force' | 'credential_stuffing' | 'suspicious_login' | 'account_takeover' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  status: 'active' | 'mitigated' | 'investigating' | 'resolved';
  affectedUsers: string[];
  mitigation: string[];
}

export interface ComplianceStatus {
  gdpr: ComplianceLevel;
  coppa: ComplianceLevel;
  ferpa: ComplianceLevel;
  iso27001: ComplianceLevel;
  soc2: ComplianceLevel;
  lastAudit: string;
  nextAudit: string;
  certificates: string[];
}

export type ComplianceLevel = 'compliant' | 'partially_compliant' | 'non_compliant' | 'not_applicable';

export interface DataRetentionPolicy {
  userData: number; // days
  analyticsData: number; // days
  auditLogs: number; // days
  securityLogs: number; // days
  sessionData: number; // days
}

export interface PrivacyControls {
  dataExport: boolean;
  dataDeletion: boolean;
  consentManagement: boolean;
  dataMinimization: boolean;
  purposeLimitation: boolean;
  storageLimitation: boolean;
}

// ===== MAIN STORE =====
export const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    devtools(
      immer(
        (set, get) => ({
          // ===== INITIAL STATE =====
          // Core Authentication
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          tokens: null,
          session: null,
          
          // Security
          securityEvents: [],
          auditLogs: [],
          riskAssessment: {
            overallRisk: 'low',
            factors: [],
            recommendations: [],
            lastAssessed: new Date().toISOString()
          },
          threats: [],
          
          // Multi-Factor Authentication
          mfaRequired: false,
          mfaChallengeId: null,
          mfaMethods: [],
          biometricAvailable: false,
          biometricEnabled: false,
          
          // Social & SSO
          socialProviders: [],
          ssoProviders: [],
          socialLoginInProgress: false,
          ssoLoginInProgress: false,
          
          // Session Management
          activeSessions: [],
          trustedDevices: [],
          deviceTracking: true,
          
          // Compliance & Analytics
          complianceStatus: {
            gdpr: 'compliant',
            coppa: 'compliant',
            ferpa: 'compliant',
            iso27001: 'partially_compliant',
            soc2: 'partially_compliant',
            lastAudit: new Date().toISOString(),
            nextAudit: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            certificates: []
          },
          dataRetention: {
            userData: 2555, // 7 years
            analyticsData: 1095, // 3 years
            auditLogs: 2555, // 7 years
            securityLogs: 2555, // 7 years
            sessionData: 90 // 90 days
          },
          privacyControls: {
            dataExport: true,
            dataDeletion: true,
            consentManagement: true,
            dataMinimization: true,
            purposeLimitation: true,
            storageLimitation: true
          },
          
          // Performance
          lastSync: new Date().toISOString(),
          cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          offlineMode: false,

          // ===== CORE AUTHENTICATION ACTIONS =====
          
          // Initialize Authentication
          initializeAuth: async () => {
            set(state => { state.isLoading = true; state.error = null; });
            
            try {
              // Check for existing session
              const tokens = localStorage.getItem('auth_tokens');
              if (tokens) {
                const parsedTokens = JSON.parse(tokens);
                
                // Validate token and fetch user data
                const userData = await fetchUserFromToken(parsedTokens.accessToken);
                if (userData) {
                  set(state => {
                    state.user = userData;
                    state.tokens = parsedTokens;
                    state.isAuthenticated = true;
                    state.lastSync = new Date().toISOString();
                  });
                  
                  // Perform security checks
                  await get().performSecurityChecks();
                }
              }
            } catch (error: any) {
              set(state => { 
                state.error = error.message; 
                state.isAuthenticated = false; 
              });
            } finally {
              set(state => { state.isLoading = false; });
            }
          },

          // User Login
          login: async (credentials: LoginCredentials) => {
            set(state => { 
              state.isLoading = true; 
              state.error = null;
              state.mfaRequired = false;
            });
            
            try {
              // Device fingerprinting for security
              const deviceInfo = credentials.deviceInfo || await getDeviceInfo();
              
              // Initial login attempt
              const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...credentials,
                  deviceInfo
                })
              });
              
              const data = await loginResponse.json();
              
              if (!loginResponse.ok) {
                throw new Error(data.message || 'Login failed');
              }
              
              // Check if MFA is required
              if (data.mfaRequired) {
                set(state => {
                  state.mfaRequired = true;
                  state.mfaChallengeId = data.challengeId;
                  state.mfaMethods = data.availableMethods || [];
                });
                return { requiresMFA: true };
              }
              
              // Successful login
              await get().handleSuccessfulLogin(data, deviceInfo);
              return { requiresMFA: false };
              
            } catch (error: any) {
              set(state => { 
                state.error = error.message;
                state.isAuthenticated = false;
              });
              
              // Log failed login attempt
              await get().logSecurityEvent({
                type: 'failed_login',
                ipAddress: await getClientIP(),
                description: error.message,
                success: false
              });
              
              throw error;
            } finally {
              set(state => { state.isLoading = false; });
            }
          },

          // Complete MFA Challenge
          completeMFA: async (challengeId: string, code: string) => {
            set(state => { state.isLoading = true; state.error = null; });
            
            try {
              const response = await fetch('/api/auth/mfa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ challengeId, code })
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'MFA verification failed');
              }
              
              const deviceInfo = await getDeviceInfo();
              await get().handleSuccessfulLogin(data, deviceInfo);
              
              set(state => {
                state.mfaRequired = false;
                state.mfaChallengeId = null;
              });
              
              return { success: true };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.isLoading = false; });
            }
          },

          // Social Login
          loginWithSocial: async (provider: string, token: string) => {
            set(state => { 
              state.socialLoginInProgress = true;
              state.error = null;
            });
            
            try {
              const deviceInfo = await getDeviceInfo();
              
              const response = await fetch('/api/auth/social/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider, token, deviceInfo })
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'Social login failed');
              }
              
              await get().handleSuccessfulLogin(data, deviceInfo);
              
              // Update social provider status
              set(state => {
                const providerIndex = state.socialProviders.findIndex(p => p.provider === provider);
                if (providerIndex >= 0) {
                  state.socialProviders[providerIndex].isConnected = true;
                  state.socialProviders[providerIndex].lastUsed = new Date().toISOString();
                }
              });
              
              return { success: true };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.socialLoginInProgress = false; });
            }
          },

          // SSO Login
          loginWithSSO: async (provider: string, assertion: string) => {
            set(state => { 
              state.ssoLoginInProgress = true;
              state.error = null;
            });
            
            try {
              const deviceInfo = await getDeviceInfo();
              
              const response = await fetch('/api/auth/sso/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider, assertion, deviceInfo })
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'SSO login failed');
              }
              
              await get().handleSuccessfulLogin(data, deviceInfo);
              return { success: true };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.ssoLoginInProgress = false; });
            }
          },

          // User Registration
          register: async (data: RegisterData) => {
            set(state => { 
              state.isLoading = true; 
              state.error = null;
            });
            
            try {
              const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });
              
              const responseData = await response.json();
              
              if (!response.ok) {
                throw new Error(responseData.message || 'Registration failed');
              }
              
              // Log successful registration
              await get().logSecurityEvent({
                type: 'login',
                description: 'User registration',
                success: true
              });
              
              set(state => {
                state.user = responseData.user;
                state.tokens = responseData.tokens;
                state.isAuthenticated = true;
              });
              
              return { success: true };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.isLoading = false; });
            }
          },

          // User Logout
          logout: async (allDevices = false) => {
            set(state => { state.isLoading = true; });
            
            try {
              await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                },
                body: JSON.stringify({ allDevices })
              });
              
              // Log logout event
              await get().logSecurityEvent({
                type: 'logout',
                description: allDevices ? 'Logout from all devices' : 'Single device logout',
                success: true
              });
              
            } catch (error) {
              // Continue with logout even if API call fails
              console.warn('Logout API call failed:', error);
            } finally {
              // Clear all authentication state
              set(state => {
                state.user = null;
                state.tokens = null;
                state.isAuthenticated = false;
                state.session = null;
                state.activeSessions = [];
                state.mfaRequired = false;
                state.mfaChallengeId = null;
                state.error = null;
              });
              
              // Clear local storage
              localStorage.removeItem('auth_tokens');
              localStorage.removeItem('user_preferences');
              
              set(state => { state.isLoading = false; });
            }
          },

          // Refresh Authentication Token
          refreshToken: async () => {
            try {
              const currentTokens = get().tokens;
              if (!currentTokens?.refreshToken) {
                throw new Error('No refresh token available');
              }
              
              const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: currentTokens.refreshToken })
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'Token refresh failed');
              }
              
              set(state => {
                state.tokens = data.tokens;
              });
              
              return data.tokens;
              
            } catch (error: any) {
              // If refresh fails, logout user
              await get().logout();
              throw error;
            }
          },

          // ===== USER PROFILE MANAGEMENT =====
          
          // Update User Profile
          updateProfile: async (updates: Partial<User>) => {
            set(state => { state.isLoading = true; state.error = null; });
            
            try {
              const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                },
                body: JSON.stringify(updates)
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'Profile update failed');
              }
              
              set(state => {
                state.user = { ...state.user, ...data.user };
                state.lastSync = new Date().toISOString();
              });
              
              // Log profile update
              await get().logSecurityEvent({
                type: 'password_change',
                description: 'User profile updated',
                success: true
              });
              
              return data.user;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.isLoading = false; });
            }
          },

          // Update User Preferences
          updatePreferences: async (preferences: Partial<UserPreferences>) => {
            try {
              const response = await fetch('/api/auth/preferences', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                },
                body: JSON.stringify(preferences)
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'Preferences update failed');
              }
              
              set(state => {
                if (state.user) {
                  state.user.preferences = { ...state.user.preferences, ...data.preferences };
                }
              });
              
              return data.preferences;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },

          // ===== SECURITY & COMPLIANCE ACTIONS =====
          
          // Change Password
          changePassword: async (currentPassword: string, newPassword: string) => {
            set(state => { state.isLoading = true; state.error = null; });
            
            try {
              const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'Password change failed');
              }
              
              // Log password change
              await get().logSecurityEvent({
                type: 'password_change',
                description: 'Password changed',
                success: true
              });
              
              // Update password strength score
              set(state => {
                if (state.user) {
                  state.user.security.passwordStrength = data.passwordStrength;
                  state.user.security.lastPasswordChange = new Date().toISOString();
                }
              });
              
              return { success: true };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.isLoading = false; });
            }
          },

          // Enable Multi-Factor Authentication
          enableMFA: async (method: string, data: any) => {
            set(state => { state.isLoading = true; state.error = null; });
            
            try {
              const response = await fetch('/api/auth/mfa/enable', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                },
                body: JSON.stringify({ method, ...data })
              });
              
              const responseData = await response.json();
              
              if (!response.ok) {
                throw new Error(responseData.message || 'MFA enable failed');
              }
              
              // Update user's MFA methods
              set(state => {
                if (state.user) {
                  state.user.security.mfaEnabled = true;
                  state.user.security.mfaMethods = responseData.methods;
                }
                state.mfaMethods = responseData.methods;
              });
              
              // Log MFA enable event
              await get().logSecurityEvent({
                type: 'mfa_enabled',
                description: `MFA enabled: ${method}`,
                success: true
              });
              
              return responseData;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.isLoading = false; });
            }
          },

          // Disable Multi-Factor Authentication
          disableMFA: async (method: string, verificationCode: string) => {
            set(state => { state.isLoading = true; state.error = null; });
            
            try {
              const response = await fetch('/api/auth/mfa/disable', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                },
                body: JSON.stringify({ method, verificationCode })
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'MFA disable failed');
              }
              
              set(state => {
                if (state.user) {
                  state.user.security.mfaMethods = data.methods;
                  state.user.security.mfaEnabled = data.methods.length > 0;
                }
                state.mfaMethods = data.methods;
              });
              
              return { success: true };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.isLoading = false; });
            }
          },

          // Generate Backup Codes
          generateBackupCodes: async () => {
            try {
              const response = await fetch('/api/auth/mfa/backup-codes', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                }
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'Backup codes generation failed');
              }
              
              // Update user's backup codes
              set(state => {
                if (state.user) {
                  const method = state.user.security.mfaMethods.find(m => m.type === 'totp');
                  if (method) {
                    method.backupCodes = data.codes;
                  }
                }
              });
              
              return data.codes;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },

          // Enable Biometric Authentication
          enableBiometric: async (type: string, publicKey: string) => {
            set(state => { state.isLoading = true; state.error = null; });
            
            try {
              const response = await fetch('/api/auth/biometric/enable', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                },
                body: JSON.stringify({ type, publicKey })
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'Biometric enable failed');
              }
              
              set(state => {
                if (state.user) {
                  state.user.security.biometricEnabled = true;
                  state.user.security.biometricMethods = data.methods;
                }
                state.biometricEnabled = true;
              });
              
              return { success: true };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.isLoading = false; });
            }
          },

          // Authenticate with Biometrics
          authenticateWithBiometric: async (type: string, signature: string) => {
            try {
              const response = await fetch('/api/auth/biometric/authenticate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                },
                body: JSON.stringify({ type, signature })
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'Biometric authentication failed');
              }
              
              // Update last used timestamp
              set(state => {
                const method = state.user?.security.biometricMethods.find(m => m.type === type);
                if (method) {
                  method.lastUsed = new Date().toISOString();
                }
              });
              
              return { success: true };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },

          // Trust Device
          trustDevice: async (deviceId: string) => {
            try {
              const response = await fetch('/api/auth/devices/trust', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                },
                body: JSON.stringify({ deviceId })
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'Device trust failed');
              }
              
              set(state => {
                const deviceIndex = state.trustedDevices.findIndex(d => d.deviceId === deviceId);
                if (deviceIndex >= 0) {
                  state.trustedDevices[deviceIndex].isTrusted = true;
                }
              });
              
              return { success: true };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },

          // Revoke Device Trust
          revokeDeviceTrust: async (deviceId: string) => {
            try {
              const response = await fetch('/api/auth/devices/revoke', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                },
                body: JSON.stringify({ deviceId })
              });
              
              if (!response.ok) {
                throw new Error('Device trust revocation failed');
              }
              
              set(state => {
                state.trustedDevices = state.trustedDevices.filter(d => d.deviceId !== deviceId);
              });
              
              return { success: true };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },

          // ===== SESSION MANAGEMENT =====
          
          // Get Active Sessions
          getActiveSessions: async () => {
            try {
              const response = await fetch('/api/auth/sessions', {
                headers: {
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                }
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch sessions');
              }
              
              set(state => {
                state.activeSessions = data.sessions;
              });
              
              return data.sessions;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },

          // Terminate Session
          terminateSession: async (sessionId: string) => {
            try {
              const response = await fetch(`/api/auth/sessions/${sessionId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                }
              });
              
              if (!response.ok) {
                throw new Error('Session termination failed');
              }
              
              set(state => {
                state.activeSessions = state.activeSessions.filter(s => s.sessionId !== sessionId);
              });
              
              return { success: true };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },

          // Terminate All Other Sessions
          terminateAllOtherSessions: async () => {
            try {
              const response = await fetch('/api/auth/sessions/terminate-others', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                }
              });
              
              if (!response.ok) {
                throw new Error('Failed to terminate other sessions');
              }
              
              // Refresh sessions list
              await get().getActiveSessions();
              
              return { success: true };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },

          // ===== SECURITY MONITORING =====
          
          // Perform Security Checks
          performSecurityChecks: async () => {
            try {
              const response = await fetch('/api/auth/security/check', {
                headers: {
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                }
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error('Security check failed');
              }
              
              set(state => {
                state.riskAssessment = data.riskAssessment;
                state.threats = data.threats || [];
                state.securityEvents = data.securityEvents || [];
              });
              
              return data;
              
            } catch (error: any) {
              console.warn('Security checks failed:', error);
              return null;
            }
          },

          // Log Security Event
          logSecurityEvent: async (eventData: Partial<SecurityEvent>) => {
            try {
              const event: SecurityEvent = {
                id: crypto.randomUUID(),
                type: eventData.type || 'login',
                timestamp: new Date().toISOString(),
                ipAddress: eventData.ipAddress || await getClientIP(),
                location: eventData.location || await getCurrentLocation(),
                deviceInfo: eventData.deviceInfo || await getDeviceInfo(),
                success: eventData.success ?? true,
                riskScore: eventData.riskScore || 0,
                description: eventData.description || '',
                ...eventData
              };
              
              set(state => {
                state.securityEvents = [event, ...state.securityEvents.slice(0, 99)]; // Keep last 100
              });
              
              // Send to server for audit logging
              await fetch('/api/auth/security/events', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                },
                body: JSON.stringify(event)
              });
              
            } catch (error) {
              console.warn('Failed to log security event:', error);
            }
          },

          // Get Security Report
          getSecurityReport: async (timeRange: '24h' | '7d' | '30d' | '90d' = '30d') => {
            try {
              const response = await fetch(`/api/auth/security/report?range=${timeRange}`, {
                headers: {
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                }
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error('Failed to fetch security report');
              }
              
              return data;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },

          // ===== COMPLIANCE & AUDIT =====
          
          // Export User Data (GDPR)
          exportUserData: async () => {
            try {
              const response = await fetch('/api/auth/data/export', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                }
              });
              
              if (!response.ok) {
                throw new Error('Data export request failed');
              }
              
              const data = await response.json();
              
              // Log data export request
              await get().logSecurityEvent({
                type: 'login',
                description: 'User data export requested',
                success: true
              });
              
              return { exportId: data.exportId, downloadUrl: data.downloadUrl };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },

          // Request Account Deletion (Right to be Forgotten)
          requestAccountDeletion: async (reason: string, confirmationPhrase: string) => {
            set(state => { state.isLoading = true; state.error = null; });
            
            try {
              const response = await fetch('/api/auth/data/deletion', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                },
                body: JSON.stringify({ reason, confirmationPhrase })
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.message || 'Account deletion request failed');
              }
              
              // Log deletion request
              await get().logSecurityEvent({
                type: 'login',
                description: 'Account deletion requested',
                success: true
              });
              
              return { deletionId: data.deletionId, scheduledDate: data.scheduledDate };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.isLoading = false; });
            }
          },

          // Cancel Account Deletion
          cancelAccountDeletion: async (deletionId: string) => {
            try {
              const response = await fetch(`/api/auth/data/deletion/${deletionId}/cancel`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                }
              });
              
              if (!response.ok) {
                throw new Error('Deletion cancellation failed');
              }
              
              return { success: true };
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },

          // Get Audit Logs
          getAuditLogs: async (filters?: {
            startDate?: string;
            endDate?: string;
            action?: string;
            resource?: string;
            limit?: number;
          }) => {
            try {
              const queryParams = new URLSearchParams(filters as any).toString();
              const response = await fetch(`/api/auth/audit/logs?${queryParams}`, {
                headers: {
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                }
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error('Failed to fetch audit logs');
              }
              
              set(state => {
                state.auditLogs = data.logs;
              });
              
              return data.logs;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },

          // ===== UTILITY ACTIONS =====
          
          // Clear Error
          clearError: () => {
            set(state => { state.error = null; });
          },

          // Set Offline Mode
          setOfflineMode: (offline: boolean) => {
            set(state => { state.offlineMode = offline; });
          },

          // Sync with Server
          syncWithServer: async () => {
            try {
              const response = await fetch('/api/auth/sync', {
                headers: {
                  'Authorization': `Bearer ${get().tokens?.accessToken}`
                }
              });
              
              const data = await response.json();
              
              if (response.ok && data.user) {
                set(state => {
                  state.user = data.user;
                  state.lastSync = new Date().toISOString();
                });
              }
              
              return data;
              
            } catch (error) {
              console.warn('Sync with server failed:', error);
              return null;
            }
          },

          // ===== HELPER METHODS (Private) =====
          
          // Handle Successful Login
          handleSuccessfulLogin: async (data: any, deviceInfo: DeviceInfo) => {
            const session: SessionInfo = {
              sessionId: data.sessionId,
              userId: data.user.userId,
              deviceId: deviceInfo.deviceId,
              ipAddress: deviceInfo.ipAddress,
              location: deviceInfo.location!,
              startTime: new Date().toISOString(),
              lastActivity: new Date().toISOString(),
              isActive: true,
              expiresAt: data.expiresAt,
              riskScore: data.riskScore || 0
            };
            
            set(state => {
              state.user = data.user;
              state.tokens = data.tokens;
              state.isAuthenticated = true;
              state.session = session;
              state.lastSync = new Date().toISOString();
              state.mfaRequired = false;
              state.mfaChallengeId = null;
              state.activeSessions = [session];
            });
            
            // Store tokens securely
            localStorage.setItem('auth_tokens', JSON.stringify(data.tokens));
            
            // Log successful login
            await get().logSecurityEvent({
              type: 'login',
              ipAddress: deviceInfo.ipAddress,
              description: 'Successful login',
              success: true,
              riskScore: data.riskScore || 0
            });
            
            // Perform security assessment
            if (data.riskScore && data.riskScore > 50) {
              await get().performSecurityChecks();
            }
          }
        }),
        {
          name: 'auth-store',
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            user: state.user,
            tokens: state.tokens,
            trustedDevices: state.trustedDevices,
            userPreferences: state.user?.preferences
          })
        }
      )
    )
  )
);

// ===== SELECTORS =====
export const useAuth = () => useAuthStore(state => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  error: state.error,
  tokens: state.tokens,
  session: state.session
}));

export const useUser = () => useAuthStore(state => state.user);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error);
export const useAuthTokens = () => useAuthStore(state => state.tokens);
export const useSession = () => useAuthStore(state => state.session);

export const useSecurityState = () => useAuthStore(state => ({
  securityEvents: state.securityEvents,
  auditLogs: state.auditLogs,
  riskAssessment: state.riskAssessment,
  threats: state.threats
}));

export const useMFAState = () => useAuthStore(state => ({
  mfaRequired: state.mfaRequired,
  mfaChallengeId: state.mfaChallengeId,
  mfaMethods: state.mfaMethods,
  biometricEnabled: state.biometricEnabled,
  biometricAvailable: state.biometricAvailable
}));

export const useSessionManagement = () => useAuthStore(state => ({
  activeSessions: state.activeSessions,
  trustedDevices: state.trustedDevices,
  deviceTracking: state.deviceTracking
}));

export const useComplianceState = () => useAuthStore(state => ({
  complianceStatus: state.complianceStatus,
  dataRetention: state.dataRetention,
  privacyControls: state.privacyControls
}));

// ===== UTILITY FUNCTIONS =====

// Get current client IP address
async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}

// Get current geolocation
async function getCurrentLocation(): Promise<GeoLocation> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        timezone: 'UTC'
      });
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          country: 'Unknown',
          region: 'Unknown',
          city: 'Unknown',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
      },
      () => {
        resolve({
          country: 'Unknown',
          region: 'Unknown',
          city: 'Unknown',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
      }
    );
  });
}

// Generate device fingerprint
async function getDeviceInfo(): Promise<DeviceInfo> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  const deviceId = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fingerprint))
    .then(buffer => Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(''));
  
  const ua = navigator.userAgent;
  const deviceType = /Mobile|Android|iPhone|iPad/.test(ua) ? 
    (/iPad/.test(ua) ? 'tablet' : 'mobile') : 'desktop';
  
  return {
    deviceId,
    deviceType: deviceType as any,
    browser: getBrowserName(ua),
    os: getOSName(ua),
    ipAddress: await getClientIP(),
    location: await getCurrentLocation(),
    isTrusted: false,
    lastSeen: new Date().toISOString()
  };
}

// Get browser name from user agent
function getBrowserName(ua: string): string {
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return 'Unknown';
}

// Get OS name from user agent
function getOSName(ua: string): string {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS')) return 'iOS';
  return 'Unknown';
}

// Fetch user data from token
async function fetchUserFromToken(token: string): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.user;
    
  } catch (error) {
    console.error('Failed to fetch user from token:', error);
    return null;
  }
}

export default useAuthStore;