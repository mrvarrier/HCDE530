import React from 'react';
import { Eye, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI';

export const WCAGTab = ({ audit }) => {
  // Get accessibility findings from the audit
  const a11yFindings = audit?.findings?.filter(f => f.category === 'accessibility') || [];

  // If no findings, show success message
  if (a11yFindings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <Eye className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Accessibility Issues Found</h3>
        <p className="text-gray-600">This page passed all automated WCAG accessibility checks.</p>
      </div>
    );
  }

  // Group findings by severity
  const critical = a11yFindings.filter(f => f.severity === 'critical');
  const high = a11yFindings.filter(f => f.severity === 'high');
  const moderate = a11yFindings.filter(f => f.severity === 'moderate' || f.severity === 'medium');
  const minor = a11yFindings.filter(f => f.severity === 'minor' || f.severity === 'low');

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessibility Issues Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {critical.length > 0 && (
            <Card hover={false}>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-1">{critical.length}</div>
                <div className="text-sm text-gray-600">Critical</div>
              </CardContent>
            </Card>
          )}
          {high.length > 0 && (
            <Card hover={false}>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-1">{high.length}</div>
                <div className="text-sm text-gray-600">High</div>
              </CardContent>
            </Card>
          )}
          {moderate.length > 0 && (
            <Card hover={false}>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-yellow-600 mb-1">{moderate.length}</div>
                <div className="text-sm text-gray-600">Moderate</div>
              </CardContent>
            </Card>
          )}
          {minor.length > 0 && (
            <Card hover={false}>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-1">{minor.length}</div>
                <div className="text-sm text-gray-600">Minor</div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Critical Issues */}
      {critical.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-red-600 mr-2">🔴</span>
            Critical Issues
          </h2>
          <Card hover={false}>
            <CardContent>
              <div className="space-y-4">
                {critical.map((finding, index) => (
                  <IssueItem key={index} finding={finding} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* High Priority Issues */}
      {high.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-orange-600 mr-2">🟠</span>
            High Priority Issues
          </h2>
          <Card hover={false}>
            <CardContent>
              <div className="space-y-4">
                {high.map((finding, index) => (
                  <IssueItem key={index} finding={finding} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Moderate Issues */}
      {moderate.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-yellow-600 mr-2">🟡</span>
            Moderate Issues
          </h2>
          <Card hover={false}>
            <CardContent>
              <div className="space-y-4">
                {moderate.map((finding, index) => (
                  <IssueItem key={index} finding={finding} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Minor Issues */}
      {minor.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-blue-600 mr-2">🔵</span>
            Minor Issues
          </h2>
          <Card hover={false}>
            <CardContent>
              <div className="space-y-4">
                {minor.map((finding, index) => (
                  <IssueItem key={index} finding={finding} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};

const IssueItem = ({ finding }) => {
  return (
    <div className="border-l-4 border-gray-300 pl-4 py-3">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">{finding.title}</h4>
          <div className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Impact: </span>
            {finding.impact}
          </div>
          {finding.elements && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <span className="font-medium">Affected Elements: </span>
              {finding.elements}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
