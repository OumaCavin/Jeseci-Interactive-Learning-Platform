import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'glass';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  variant = 'default',
  padding = 'md'
}) => {
  const baseClasses = variant === 'glass' 
    ? 'bg-white/10 backdrop-blur-md border border-white/20 rounded-xl'
    : 'bg-white rounded-lg shadow border';
  
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };
  
  const classes = `${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;