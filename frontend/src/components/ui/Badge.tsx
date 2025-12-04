import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glass?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '',
  glass = false 
}) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  
  const variantClasses = glass ? {
    default: 'bg-white/10 text-white border border-white/20 backdrop-blur-sm',
    success: 'bg-green-400/20 text-green-100 border border-green-400/30 backdrop-blur-sm',
    warning: 'bg-yellow-400/20 text-yellow-100 border border-yellow-400/30 backdrop-blur-sm',
    error: 'bg-red-400/20 text-red-100 border border-red-400/30 backdrop-blur-sm',
    info: 'bg-blue-400/20 text-blue-100 border border-blue-400/30 backdrop-blur-sm'
  } : {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;