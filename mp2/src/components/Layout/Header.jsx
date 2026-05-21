import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { Button } from '../UI';

export const Header = ({ onNewAudit, showNewAuditButton = false, usePageSpeed = false, onTogglePageSpeed }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 rounded-lg p-2">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                UX Website Auditor
              </h1>
              <p className="text-xs text-gray-500">
                Professional UX Analysis Tool
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onTogglePageSpeed && (
              <button
                onClick={onTogglePageSpeed}
                className={`
                  flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${usePageSpeed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                title={usePageSpeed ? 'Real performance data enabled' : 'Using simulated data only'}
              >
                <Zap className="w-4 h-4" />
                <span>{usePageSpeed ? 'PageSpeed ON' : 'PageSpeed OFF'}</span>
              </button>
            )}

            {showNewAuditButton && (
              <Button onClick={onNewAudit} size="md">
                New Audit
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
