import React from 'react';
import { FileSearch } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FileSearch,
  title,
  description,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-primary-50 rounded-full p-6 mb-4">
        <Icon className="w-12 h-12 text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 max-w-md mb-6">
        {description}
      </p>
      {action}
    </div>
  );
};
