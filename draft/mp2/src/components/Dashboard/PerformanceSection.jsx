import React from 'react';
import { Activity, Zap, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../UI';

export const PerformanceSection = ({ audit }) => {
  const { pageSpeedData, dataSource, metadata } = audit;

  // If we have real PageSpeed data, show it
  if (pageSpeedData && dataSource === 'hybrid') {
    return <RealPerformanceSection pageSpeedData={pageSpeedData} metadata={metadata} />;
  }

  // Otherwise show simulated message
  return <SimulatedPerformanceMessage />;
};

const RealPerformanceSection = ({ pageSpeedData, metadata }) => {
  // Add null checks for metadata and its properties
  if (!metadata || !metadata.coreWebVitals) {
    console.warn('Performance metadata is missing or incomplete');
    return <SimulatedPerformanceMessage />;
  }

  const { coreWebVitals, coreWebVitalsSeverity } = metadata;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="bg-green-100 p-2 rounded-lg">
          <Activity className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real Performance Data</h2>
          <p className="text-gray-600 flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Powered by Google PageSpeed Insights</span>
          </p>
        </div>
      </div>

      {/* Core Web Vitals */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Real-world performance metrics from Google
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <WebVitalCard
              name="LCP"
              fullName="Largest Contentful Paint"
              value={coreWebVitals.lcp}
              severity={coreWebVitalsSeverity?.lcp}
              description="Time to render largest content"
            />
            <WebVitalCard
              name="FID"
              fullName="First Input Delay"
              value={coreWebVitals.fid}
              severity={coreWebVitalsSeverity?.fid}
              description="Time to first interaction"
            />
            <WebVitalCard
              name="CLS"
              fullName="Cumulative Layout Shift"
              value={coreWebVitals.cls}
              severity={coreWebVitalsSeverity?.cls}
              description="Visual stability score"
            />
            <WebVitalCard
              name="FCP"
              fullName="First Contentful Paint"
              value={coreWebVitals.fcp}
              severity={coreWebVitalsSeverity?.fcp}
              description="Time to first content render"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard
              label="Speed Index"
              value={coreWebVitals.si}
              description="Visual progress metric"
            />
            <MetricCard
              label="Time to Interactive"
              value={coreWebVitals.tti}
              description="When page becomes fully interactive"
            />
            <MetricCard
              label="Total Blocking Time"
              value={coreWebVitals.tbt}
              description="Sum of blocking time"
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Opportunities */}
      {pageSpeedData.opportunities && pageSpeedData.opportunities.length > 0 && (
        <Card hover={false}>
          <CardHeader>
            <CardTitle>Performance Opportunities</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Suggested optimizations with estimated time savings
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pageSpeedData.opportunities.map((opp, index) => (
                <OpportunityItem key={index} opportunity={opp} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resource Summary */}
      {pageSpeedData.resources && (
        <Card hover={false}>
          <CardHeader>
            <CardTitle>Resource Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ResourceStat
                label="Total Size"
                value={pageSpeedData.resources.totalSize || 'N/A'}
                icon={<Zap className="w-5 h-5" />}
              />
              <ResourceStat
                label="Requests"
                value={pageSpeedData.resources.requests || 0}
                icon={<Activity className="w-5 h-5" />}
              />
              <ResourceStat
                label="Scripts"
                value={pageSpeedData.resources.scripts || 0}
                icon={<AlertCircle className="w-5 h-5" />}
              />
              <ResourceStat
                label="Images"
                value={pageSpeedData.resources.images || 0}
                icon={<Info className="w-5 h-5" />}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const WebVitalCard = ({ name, fullName, value, severity, description }) => {
  const severityColors = {
    good: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    'needs-improvement': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    poor: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    unknown: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' }
  };

  const colors = severityColors[severity] || severityColors.unknown;

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{name}</span>
        {severity && (
          <span className={`text-xs px-2 py-0.5 rounded ${colors.text} bg-white`}>
            {severity === 'needs-improvement' ? 'Needs work' : severity}
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold ${colors.text} mb-1`}>
        {value}
      </div>
      <div className="text-xs text-gray-600 mb-2">{fullName}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  );
};

const MetricCard = ({ label, value, description }) => {
  return (
    <div className="text-sm">
      <div className="font-medium text-gray-900 mb-1">{label}</div>
      <div className="text-lg font-semibold text-primary-600 mb-1">{value}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  );
};

const OpportunityItem = ({ opportunity }) => {
  const savingsSeconds = (opportunity.savings / 1000).toFixed(2);

  return (
    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-gray-900 text-sm">{opportunity.title}</h4>
          <span className="text-sm font-medium text-blue-600">
            Save ~{savingsSeconds}s
          </span>
        </div>
        <p className="text-sm text-gray-600">{opportunity.description}</p>
      </div>
    </div>
  );
};

const ResourceStat = ({ label, value, icon }) => {
  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className="text-gray-500">{icon}</div>
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-lg font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
};

const SimulatedPerformanceMessage = () => {
  return (
    <Card hover={false} className="border-l-4 border-blue-500">
      <CardContent>
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Using Simulated Performance Data
            </h3>
            <p className="text-gray-600 mb-3">
              This audit is currently using simulated performance data. For real-world performance metrics,
              the app can integrate with Google PageSpeed Insights API.
            </p>
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700">
              <p className="font-medium mb-1">To enable real performance data:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Get a free API key from Google Cloud Console</li>
                <li>Add key to environment variables</li>
                <li>Real Core Web Vitals, opportunities, and diagnostics will be fetched automatically</li>
              </ol>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
