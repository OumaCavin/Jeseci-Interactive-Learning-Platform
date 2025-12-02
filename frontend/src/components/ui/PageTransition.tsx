import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  pageKey,
  className = '' 
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.3, 
          ease: 'easeInOut'
        }}
        className={`min-h-screen ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

interface PageLoadingFallbackProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const PageLoadingFallback: React.FC<PageLoadingFallbackProps> = ({ 
  size = 'lg',
  text = 'Loading...' 
}) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <LoadingSpinner size={size} />
    <p className="mt-4 text-gray-600 text-sm">{text}</p>
  </div>
);

export default PageTransition;