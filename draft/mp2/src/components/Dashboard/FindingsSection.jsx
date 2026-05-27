import React from 'react';
import { AlertCircle, Eye, Palette, Map, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../UI';

export const FindingsSection = ({ audit }) => {
  const { findings, typography, colors, ia } = audit;

  // Group findings by category
  const accessibilityFindings = findings.filter(f => f.category === 'accessibility');
  const designFindings = findings.filter(f => f.category === 'design');
  const performanceFindings = findings.filter(f => f.category === 'performance');
  const iaFindings = findings.filter(f => f.category === 'ia');

  return (
    <div className="space-y-8">
      {/* Accessibility Section */}
      {accessibilityFindings.length > 0 && (
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Accessibility Audit</h2>
          </div>

          <Card hover={false}>
            <CardContent>
              <div className="space-y-4">
                {accessibilityFindings.map((finding, index) => (
                  <FindingItem key={index} finding={finding} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Design Consistency Section */}
      <section>
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-pink-100 p-2 rounded-lg">
            <Palette className="w-6 h-6 text-pink-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Design Consistency</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Typography */}
          <Card hover={false}>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Font Families</div>
                  <div className="space-y-1">
                    {typography.fonts.map((font, index) => (
                      <div key={index} className="text-gray-800 font-medium" style={{ fontFamily: font }}>
                        {font}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Type Scale</div>
                  <div className="flex flex-wrap gap-2">
                    {typography.scale.map((size, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                {typography.issues.length > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-start space-x-2 text-yellow-700 text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>{typography.issues[0]}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card hover={false}>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  {colors.colors.map((color, index) => (
                    <div key={index} className="space-y-1">
                      <div
                        className="w-full h-16 rounded-lg border-2 border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                      <div className="text-xs text-gray-600 font-mono text-center">
                        {color}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500">Primary</div>
                      <div className="font-mono text-gray-800">{colors.primary}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Secondary</div>
                      <div className="font-mono text-gray-800">{colors.secondary}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Accent</div>
                      <div className="font-mono text-gray-800">{colors.accent}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Design Findings */}
        {designFindings.length > 0 && (
          <Card hover={false}>
            <CardContent>
              <div className="space-y-4">
                {designFindings.map((finding, index) => (
                  <FindingItem key={index} finding={finding} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Information Architecture Section */}
      <section>
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Map className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Information Architecture</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>Site Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <SiteMapNode node={ia.home} level={0} />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Navigation Depth</div>
                  <div className="font-semibold text-gray-900">{ia.depth} levels</div>
                </div>
                <div>
                  <div className="text-gray-500">Complexity</div>
                  <div className="font-semibold text-gray-900 capitalize">{ia.complexity}</div>
                </div>
                <div>
                  <div className="text-gray-500">Total Pages</div>
                  <div className="font-semibold text-gray-900">{ia.pageCount || 'N/A'}</div>
                </div>
              </div>
              {ia.issues && ia.issues.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start space-x-2 text-yellow-700 text-sm bg-yellow-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>{ia.issues[0]}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {iaFindings.length > 0 && (
            <Card hover={false}>
              <CardHeader>
                <CardTitle>IA Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {iaFindings.map((finding, index) => (
                    <FindingItem key={index} finding={finding} compact />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Performance Section */}
      {performanceFindings.length > 0 && (
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Performance & UX Friction</h2>
          </div>

          <Card hover={false}>
            <CardContent>
              <div className="space-y-4">
                {performanceFindings.map((finding, index) => (
                  <FindingItem key={index} finding={finding} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};

const FindingItem = ({ finding, compact = false }) => {
  const severityIcons = {
    critical: '🔴',
    high: '🟠',
    moderate: '🟡',
    medium: '🟡',
    minor: '🔵',
    low: '🔵'
  };

  if (compact) {
    return (
      <div className="text-sm">
        <div className="flex items-center space-x-2 mb-1">
          <span>{severityIcons[finding.severity]}</span>
          <span className="font-semibold text-gray-900">{finding.title}</span>
        </div>
        <p className="text-gray-600 ml-6">{finding.impact}</p>
      </div>
    );
  }

  return (
    <div className="border-l-4 border-gray-200 pl-4 py-2">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{severityIcons[finding.severity]}</span>
          <h4 className="font-semibold text-gray-900">{finding.title}</h4>
        </div>
        <Badge severity={finding.severity} size="sm">
          {finding.severity}
        </Badge>
      </div>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium text-gray-700">Impact: </span>
          <span className="text-gray-600">{finding.impact}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Recommendation: </span>
          <span className="text-gray-600">{finding.recommendation}</span>
        </div>
      </div>
    </div>
  );
};

const SiteMapNode = ({ node, level }) => {
  const indent = level * 20;

  return (
    <>
      <div
        className="flex items-center space-x-2 py-1"
        style={{ marginLeft: `${indent}px` }}
      >
        {level > 0 && (
          <span className="text-gray-400">{'└─'}</span>
        )}
        <span className={`${level === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
          {node.name}
        </span>
      </div>
      {node.children && node.children.map((child, index) => (
        <SiteMapNode key={index} node={child} level={level + 1} />
      ))}
    </>
  );
};
