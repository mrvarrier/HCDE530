import React from 'react';

export const Card = ({ children, className = '', onClick, hover = true }) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-soft border border-gray-100 p-6
        ${hover ? 'hover:shadow-medium hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`text-gray-600 ${className}`}>
      {children}
    </div>
  );
};
