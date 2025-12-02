import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout-container">
      {/* Left side - Branding and background */}
      <div className="auth-layout-left">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <h1 className="text-4xl font-bold mb-4">
              JAC Learning Platform
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Master AI-first programming with JAC (Jaseci Architecture Code)
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-semibold">1</span>
                </div>
                <span className="text-primary-100">Interactive learning paths</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-semibold">2</span>
                </div>
                <span className="text-primary-100">Real-time code execution</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-semibold">3</span>
                </div>
                <span className="text-primary-100">AI-powered assessments</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-semibold">4</span>
                </div>
                <span className="text-primary-100">Multi-agent collaboration</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating code elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-secondary-500/20 rounded-full blur-xl"></div>
      </div>

      {/* Right side - Auth form */}
      <div className="auth-layout-right">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Logo for mobile */}
          <div className="lg:hidden mb-8 text-center" role="banner">
            <h1 className="text-2xl font-bold text-gray-900">
              JAC Learning Platform
            </h1>
            <p className="text-gray-600 mt-2">
              Master AI-first programming
            </p>
          </div>

          {/* Auth form container */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100" role="main" aria-label="Authentication form">
            {children}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Powered by{' '}
              <span className="font-semibold text-primary-600">Jaseci</span>
              {' '}and{' '}
              <span className="font-semibold text-secondary-600">AI Agents</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};