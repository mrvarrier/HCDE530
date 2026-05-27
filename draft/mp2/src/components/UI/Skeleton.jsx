import React from 'react';

export const Skeleton = ({ className = '', variant = 'rect' }) => {
  const variants = {
    rect: 'rounded-md',
    circle: 'rounded-full',
    text: 'rounded h-4'
  };

  return (
    <div
      className={`
        bg-gray-200 animate-pulse
        ${variants[variant]}
        ${className}
      `}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton variant="circle" className="w-24 h-24 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
};
