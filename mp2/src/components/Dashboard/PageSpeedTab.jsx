import React from 'react';
import { Zap, Clock, Eye, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI';

export const PageSpeedTab = ({ audit }) => {
  const pageSpeedData = audit?.pageSpeedData;

  if (!pageSpeedData) {
    return (
      <div className="text-center py-12">
        <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No PageSpeed Data Available</h3>
        <p className="text-gray-600">PageSpeed Insights data was not collected for this audit.</p>
      </div>
    );
  }

  const { coreWebVitals, metrics, opportunities, diagnostics, resources } = pageSpeedData;

  return (
    <div className="space-y-8">
      {/* Core Web Vitals */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Web Vitals</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* LCP */}
          <Card hover={false}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Largest Contentful Paint</h3>
                <div className="text-3xl font-bold text-gray-900">{coreWebVitals?.lcp || 'N/A'}</div>
                <p className="text-sm text-gray-600 mt-2">
                  Time until largest content element is rendered
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FID */}
          <Card hover={false}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">First Input Delay</h3>
                <div className="text-3xl font-bold text-gray-900">{coreWebVitals?.fid || 'N/A'}</div>
                <p className="text-sm text-gray-600 mt-2">
                  Time until page becomes interactive
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CLS */}
          <Card hover={false}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Cumulative Layout Shift</h3>
                <div className="text-3xl font-bold text-gray-900">{coreWebVitals?.cls || 'N/A'}</div>
                <p className="text-sm text-gray-600 mt-2">
                  Visual stability during page load
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Performance Metrics */}
      {metrics && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
          <Card hover={false}>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-gray-900 font-semibold">{formatMetricValue(value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Opportunities */}
      {opportunities && opportunities.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Optimization Opportunities</h2>
          <Card hover={false}>
            <CardContent>
              <div className="space-y-4">
                {opportunities.map((opp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900 mb-1">{opp.title}</h4>
                    {opp.savings && (
                      <p className="text-sm text-gray-600 mb-2">
                        Potential savings: <span className="font-medium text-blue-600">{formatSavings(opp.savings)}</span>
                      </p>
                    )}
                    <p className="text-sm text-gray-700">{opp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Diagnostics */}
      {diagnostics && diagnostics.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Diagnostics</h2>
          <Card hover={false}>
            <CardContent>
              <div className="space-y-3">
                {diagnostics.map((diag, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-gray-900">{diag.title}</div>
                    <div className="text-gray-600 mt-1">{diag.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Resource Summary */}
      {resources && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resource Summary</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card hover={false}>
              <CardContent className="text-center">
                <div className="text-sm text-gray-500 mb-1">Total Size</div>
                <div className="text-2xl font-bold text-gray-900">{formatBytes(resources.totalSize)}</div>
              </CardContent>
            </Card>
            <Card hover={false}>
              <CardContent className="text-center">
                <div className="text-sm text-gray-500 mb-1">Requests</div>
                <div className="text-2xl font-bold text-gray-900">{resources.requests}</div>
              </CardContent>
            </Card>
            <Card hover={false}>
              <CardContent className="text-center">
                <div className="text-sm text-gray-500 mb-1">Scripts</div>
                <div className="text-2xl font-bold text-gray-900">{resources.scripts || 0}</div>
              </CardContent>
            </Card>
            <Card hover={false}>
              <CardContent className="text-center">
                <div className="text-sm text-gray-500 mb-1">Stylesheets</div>
                <div className="text-2xl font-bold text-gray-900">{resources.stylesheets || 0}</div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};

// Helper functions
function formatMetricValue(value) {
  if (typeof value === 'number') {
    if (value > 1000) {
      return `${(value / 1000).toFixed(2)}s`;
    }
    return `${value}ms`;
  }
  return value;
}

function formatSavings(ms) {
  if (ms > 1000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${ms}ms`;
}

function formatBytes(bytes) {
  if (!bytes) return 'N/A';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
