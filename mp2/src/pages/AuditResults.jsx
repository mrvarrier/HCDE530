import React, { useState } from 'react';
import { OverviewSection } from '../components/Dashboard/OverviewSection';
import { FindingsSection } from '../components/Dashboard/FindingsSection';
import { PerformanceSection } from '../components/Dashboard/PerformanceSection';
import { RecommendationsSection } from '../components/Dashboard/RecommendationsSection';
import { SummarySection } from '../components/Dashboard/SummarySection';

export const AuditResults = ({ audit }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'performance', label: 'Performance', badge: audit.dataSource === 'hybrid' ? 'Live' : null },
    { id: 'findings', label: 'Detailed Findings' },
    { id: 'recommendations', label: 'Recommendations' },
    { id: 'summary', label: 'Client Summary' }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 sticky top-16 z-40">
        <div className="flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-3 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center space-x-2
                ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <OverviewSection audit={audit} />}
        {activeTab === 'performance' && <PerformanceSection audit={audit} />}
        {activeTab === 'findings' && <FindingsSection audit={audit} />}
        {activeTab === 'recommendations' && <RecommendationsSection audit={audit} />}
        {activeTab === 'summary' && <SummarySection audit={audit} />}
      </div>
    </div>
  );
};
