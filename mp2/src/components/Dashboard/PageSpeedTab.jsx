import React from 'react';
import { Zap, Clock, Eye, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI';

export const PageSpeedTab = ({ audit }) => {
  const pageSpeedData = audit?.pageSpeedData;
  const browserMetrics = pageSpeedData?.browserMetrics;

  if (!pageSpeedData && !browserMetrics) {
    return (
      <div className="text-center py-12">
        <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Performance Data Available</h3>
        <p className="text-gray-600">Performance data was not collected for this audit.</p>
      </div>
    );
  }

  const { coreWebVitals, metrics, opportunities, diagnostics, resources } = pageSpeedData || {};

  return (
    <div className="space-y-8">
      {/* Browser Performance Metrics (NEW - Phase 2) */}
      {browserMetrics && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browser Performance Metrics</h2>
          <p className="text-sm text-gray-600 mb-4">
            Measured directly from the browser during page load (independent of PageSpeed API)
          </p>

          {/* Load Timings */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card hover={false}>
              <CardContent className="text-center py-4">
                <div className="text-sm text-gray-500 mb-1">First Paint</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatTime(browserMetrics.firstPaint)}
                </div>
              </CardContent>
            </Card>
            <Card hover={false}>
              <CardContent className="text-center py-4">
                <div className="text-sm text-gray-500 mb-1">First Contentful Paint</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatTime(browserMetrics.firstContentfulPaint)}
                </div>
              </CardContent>
            </Card>
            <Card hover={false}>
              <CardContent className="text-center py-4">
                <div className="text-sm text-gray-500 mb-1">DOM Content Loaded</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatTime(browserMetrics.domContentLoaded)}
                </div>
              </CardContent>
            </Card>
            <Card hover={false}>
              <CardContent className="text-center py-4">
                <div className="text-sm text-gray-500 mb-1">Load Complete</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatTime(browserMetrics.loadComplete)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resource Summary */}
          <Card hover={false}>
            <CardHeader>
              <CardTitle>Resource Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Resource Counts */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Resource Counts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Resources:</span>
                      <span className="font-semibold">{browserMetrics.resourceCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scripts:</span>
                      <span className="font-semibold">{browserMetrics.scriptCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stylesheets:</span>
                      <span className="font-semibold">{browserMetrics.styleCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Images:</span>
                      <span className="font-semibold">{browserMetrics.imageCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fonts:</span>
                      <span className="font-semibold">{browserMetrics.fontCount}</span>
                    </div>
                  </div>
                </div>

                {/* Resource Sizes */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Resource Sizes</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Size:</span>
                      <span className="font-semibold">{formatBytes(browserMetrics.totalResourceSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scripts:</span>
                      <span className="font-semibold">{formatBytes(browserMetrics.scriptSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Styles:</span>
                      <span className="font-semibold">{formatBytes(browserMetrics.styleSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Images:</span>
                      <span className="font-semibold">{formatBytes(browserMetrics.imageSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fonts:</span>
                      <span className="font-semibold">{formatBytes(browserMetrics.fontSize)}</span>
                    </div>
                  </div>
                </div>

                {/* DOM & Third-Party */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">DOM & Third-Party</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">DOM Size:</span>
                      <span className="font-semibold">{browserMetrics.domSize} elements</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">DOM Depth:</span>
                      <span className="font-semibold">{browserMetrics.domDepth} levels</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Third-party Scripts:</span>
                      <span className="font-semibold">{browserMetrics.thirdPartyScriptCount}</span>
                    </div>
                    {browserMetrics.thirdPartyScripts && browserMetrics.thirdPartyScripts.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <span className="text-xs text-gray-500">Third-party domains:</span>
                        <div className="mt-1 space-y-1">
                          {browserMetrics.thirdPartyScripts.slice(0, 3).map((domain, idx) => (
                            <div key={idx} className="text-xs text-gray-700">{domain}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Format Analysis */}
              {browserMetrics.imageFormats && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Image Format Analysis</h4>
                  <div className="grid md:grid-cols-5 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-gray-600 mb-1">WebP</div>
                      <div className="text-2xl font-bold text-green-600">{browserMetrics.imageFormats.webp}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600 mb-1">PNG</div>
                      <div className="text-2xl font-bold text-gray-900">{browserMetrics.imageFormats.png}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600 mb-1">JPG</div>
                      <div className="text-2xl font-bold text-gray-900">{browserMetrics.imageFormats.jpg}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600 mb-1">GIF</div>
                      <div className="text-2xl font-bold text-gray-900">{browserMetrics.imageFormats.gif}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600 mb-1">SVG</div>
                      <div className="text-2xl font-bold text-gray-900">{browserMetrics.imageFormats.svg}</div>
                    </div>
                  </div>
                  {!browserMetrics.hasWebP && browserMetrics.unoptimizedImages > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Consider using WebP format for better image compression.
                        {browserMetrics.unoptimizedImages} images could be optimized.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Core Web Vitals */}
      {coreWebVitals && (
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
      )}

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
function formatTime(ms) {
  if (ms === null || ms === undefined) return 'N/A';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

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
