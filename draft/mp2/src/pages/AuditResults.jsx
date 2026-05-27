import React, { useState } from 'react';
import { AuditHeader } from '../components/Dashboard/AuditHeader';
import { PageSpeedTab } from '../components/Dashboard/PageSpeedTab';
import { WCAGTab } from '../components/Dashboard/WCAGTab';
import { DesignTab } from '../components/Dashboard/DesignTab';

export const AuditResults = ({ audit }) => {
  const [activeTab, setActiveTab] = useState('design');

  const tabs = [
    { id: 'design', label: 'Design System' },
    { id: 'pagespeed', label: 'PageSpeed Insights' },
    { id: 'wcag', label: 'WCAG Accessibility' }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Audit Header */}
      <AuditHeader audit={audit} />

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 sticky top-16 z-40">
        <div className="flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-3 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'design' && <DesignTab audit={audit} />}
        {activeTab === 'pagespeed' && <PageSpeedTab audit={audit} />}
        {activeTab === 'wcag' && <WCAGTab audit={audit} />}
      </div>
    </div>
  );
};
