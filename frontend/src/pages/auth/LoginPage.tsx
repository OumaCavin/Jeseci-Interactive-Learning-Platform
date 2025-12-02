import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { authService, LoginCredentials } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';

// Form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get auth store methods
  const { login: loginStore, isAuthenticated } = useAuthStore();
  
  // Show message from registration redirect
  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      toast.success(message);
      // Clear the message by updating the state
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // Use authentication service to login
      const credentials: LoginCredentials = {
        username: data.email, // Using email as username for the backend
        password: data.password,
        rememberMe: data.rememberMe,
      };

      const result = await authService.login(credentials);

      // Update Zustand store with the user data and tokens
      loginStore(data.email, data.password);

      toast.success('Welcome back! You have been logged in successfully.');
      
      // Redirect to dashboard after successful login
      navigate('/dashboard', { replace: true });

    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide specific error messages for backend connectivity
      if (error.message.includes('backend') || error.message.includes('connection')) {
        toast.error('Unable to connect to backend server. Please ensure Django backend is running.');
      } else {
        toast.error(error.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return null; // Will be redirected by the route protection
  }

  return (
    <div className="w-full max-w-md mx-auto login-form-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20"
      >
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            Welcome back
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            Sign in to your JAC Learning Platform account
          </motion.p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 login-form">
          {/* Email Field */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="input-wrapper"
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
              Email address
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              autoComplete="email"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.email 
                  ? 'border-red-300 bg-red-50/50' 
                  : 'border-gray-300 bg-white/70 hover:bg-white/90'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message field-error text-red-600 text-sm mt-1"
              >
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="input-wrapper"
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                className={`w-full px-4 py-3 pr-12 border rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.password 
                    ? 'border-red-300 bg-red-50/50' 
                    : 'border-gray-300 bg-white/70 hover:bg-white/90'
                }`}
                placeholder="Enter your password"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </motion.button>
            </div>
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message field-error text-red-600 text-sm mt-1"
              >
                {errors.password.message}
              </motion.p>
            )}
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="remember-forgot-section flex items-center justify-between"
          >
            <div className="flex items-center">
              <input
                {...register('rememberMe')}
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-800 font-medium">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                />
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </motion.button>

          {/* Production Notice */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="production-notice bg-blue-50/50 border border-blue-200/50 rounded-lg p-4"
          >
            <h4 className="text-sm font-semibold text-blue-800 mb-1">🚀 Production System</h4>
            <p className="text-xs text-blue-700">
              Please use your registered account credentials. Create an account at the registration page if you don't have one.
            </p>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="signup-section text-center"
          >
            <p className="text-sm text-gray-700">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="signup-link text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;