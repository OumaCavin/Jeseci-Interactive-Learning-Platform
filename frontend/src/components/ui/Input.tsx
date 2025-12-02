import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  glass?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  glass = false,
  className = '',
  ...props
}) => {
  const baseClasses = glass
    ? 'glass rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent'
    : 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500';

  const errorClasses = error
    ? glass 
      ? 'border-red-400 focus:ring-red-400' 
      : 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : '';

  const classes = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={classes}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;