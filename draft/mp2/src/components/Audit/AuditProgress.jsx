import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { LinearProgress } from '../UI';

export const AuditProgress = ({ progress }) => {
  if (!progress) return null;

  const { step, total, message, progress: percentage } = progress;

  const steps = [
    'Reading website structure',
    'Checking accessibility',
    'Extracting typography',
    'Extracting color system',
    'Mapping information architecture',
    'Detecting UX inconsistencies',
    'Generating recommendations',
    'Preparing client summary'
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-soft border border-gray-100 p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Analyzing Your Website
        </h2>
        <p className="text-gray-600">
          {message}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {steps.map((stepText, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < step;
          const isCurrent = stepNumber === step;
          const isPending = stepNumber > step;

          return (
            <div
              key={index}
              className={`
                flex items-center space-x-3 p-3 rounded-lg transition-all
                ${isCurrent ? 'bg-primary-50' : ''}
                ${isComplete ? 'opacity-60' : ''}
              `}
            >
              <div
                className={`
                  flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                  ${isComplete ? 'bg-green-500' : ''}
                  ${isCurrent ? 'bg-primary-600' : ''}
                  ${isPending ? 'bg-gray-200' : ''}
                `}
              >
                {isComplete ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={`text-xs font-medium ${isCurrent || isPending ? 'text-white' : ''}`}>
                    {stepNumber}
                  </span>
                )}
              </div>
              <span
                className={`
                  text-sm font-medium
                  ${isCurrent ? 'text-gray-900' : 'text-gray-600'}
                `}
              >
                {stepText}
              </span>
            </div>
          );
        })}
      </div>

      <LinearProgress value={percentage} max={100} color="blue" className="h-2" />
      <div className="text-center mt-3 text-sm text-gray-500">
        Step {step} of {total} • {Math.round(percentage)}% Complete
      </div>
    </div>
  );
};
