import React from 'react';
import { Sparkles, Zap, Eye, Layout, TrendingUp } from 'lucide-react';
import { AuditForm } from '../components/Audit/AuditForm';
import { EmptyState } from '../components/UI';

export const Landing = ({ onRunAudit, loading, usePageSpeed, onTogglePageSpeed }) => {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Professional UX Website Auditor
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Generate comprehensive UX audit reports in seconds. Identify accessibility issues,
          design inconsistencies, and usability concerns like a pro.
        </p>
        {usePageSpeed && (
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
            <Zap className="w-4 h-4" />
            <span>Real performance data enabled via PageSpeed Insights</span>
          </div>
        )}
      </div>

      {/* Audit Form */}
      <div className="mb-16">
        <AuditForm onSubmit={onRunAudit} loading={loading} />
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <FeatureCard
          icon={Eye}
          title="Accessibility"
          description="WCAG compliance checks, contrast ratios, and screen reader compatibility"
        />
        <FeatureCard
          icon={Layout}
          title="Design System"
          description="Typography analysis, color palette extraction, and consistency audit"
        />
        <FeatureCard
          icon={Zap}
          title="Performance"
          description="Load time analysis, image optimization, and mobile responsiveness"
        />
        <FeatureCard
          icon={TrendingUp}
          title="UX Strategy"
          description="Prioritized recommendations and client-ready reports"
        />
      </div>

      {/* Use Cases */}
      <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Built for UX Professionals
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <UseCase
            title="Freelance Consultants"
            description="Quickly assess client websites and generate professional audit reports for proposals"
          />
          <UseCase
            title="UX Researchers"
            description="Identify usability issues and accessibility barriers for research studies"
          />
          <UseCase
            title="Design Teams"
            description="Document design system inconsistencies and prioritize improvements"
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Step number="1" title="Enter URL" description="Paste any website URL" />
          <Step number="2" title="Run Audit" description="8-step automated analysis" />
          <Step number="3" title="Review Findings" description="Detailed dashboard with scores" />
          <Step number="4" title="Export Report" description="Copy client-ready summary" />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-6 hover:shadow-medium transition-shadow">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg mb-4">
      <Icon className="w-6 h-6 text-primary-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const UseCase = ({ title, description }) => (
  <div className="text-center">
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const Step = ({ number, title, description }) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-600 text-white rounded-full font-bold mb-3">
      {number}
    </div>
    <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);
