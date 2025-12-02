// Authentication Service - Handles user authentication and authorization

import api from './api';

export interface LoginCredentials {
  username: string; // Using email as username for backend compatibility
  password: string;
  rememberMe?: boolean;
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
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  learning_style?: string;
  preferred_difficulty?: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REMEMBER_ME_KEY = 'remember_me';
  private readonly USER_DATA_KEY = 'user_data';

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login/', {
        email: credentials.username, // Backend expects email field
        password: credentials.password,
      });

      const { user, token, refresh_token } = response.data;

      // Store token and user data
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

      // Store user data for immediate access
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));

      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different error types
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (error.response?.status === 429) {
        throw new Error('Too many login attempts. Please try again later.');
      } else if (error.response?.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else {
        throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register/', userData);

      const { user, token, refresh_token } = response.data;

      // Store token and user data
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }

      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle different error types
      if (error.response?.status === 400) {
        const message = error.response.data?.message;
        if (message?.includes('email')) {
          throw new Error('Email is already registered. Please use a different email.');
        } else if (message?.includes('username')) {
          throw new Error('Username is already taken. Please choose a different username.');
        } else {
          throw new Error(message || 'Registration failed. Please check your information.');
        }
      } else if (error.response?.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else {
        throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    }
  }

  /**
   * Logout user and clear all stored data
   */
  async logout(): Promise<void> {
    try {
      // Try to notify backend (optional)
      await api.post('/auth/logout/');
    } catch (error) {
      // Continue with logout even if backend call fails
      console.warn('Logout notification failed:', error);
    }

    // Clear all stored authentication data
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REMEMBER_ME_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem('refresh_token');
    
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REMEMBER_ME_KEY);
    sessionStorage.removeItem('refresh_token');

    // Remove authorization header
    delete api.defaults.headers.common['Authorization'];
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string> {
    try {
      const refresh_token = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
      
      if (!refresh_token) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<{ token: string }>('/auth/token/refresh/', {
        refresh_token,
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

      return token;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await this.logout();
      throw error;
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
    } catch (error: any) {
      console.error('Change password error:', error);
      
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

export const authService = new AuthService();
export default authService;