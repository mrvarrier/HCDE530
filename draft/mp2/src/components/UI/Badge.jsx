import React from 'react';

const severityStyles = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-red-50 text-red-700 border-red-100',
  moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  minor: 'bg-blue-100 text-blue-800 border-blue-200',
  low: 'bg-blue-50 text-blue-700 border-blue-100',
  info: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
};

export const Badge = ({
  children,
  severity = 'info',
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${severityStyles[severity]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
