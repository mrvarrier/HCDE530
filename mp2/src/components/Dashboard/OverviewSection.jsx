import React from 'react';
import { ExternalLink, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CircularProgress, Badge } from '../UI';

export const OverviewSection = ({ audit }) => {
  const { url, siteTypeLabel, scores, findings } = audit;

  const topIssues = findings
    .filter(f => f.severity === 'critical' || f.severity === 'high')
    .slice(0, 3);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="space-y-6">
      {/* Website Info */}
      <Card hover={false}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{url}</h2>
              <a
                href={url.startsWith('http') ? url : `https://${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
            <Badge severity="info" size="sm">{siteTypeLabel}</Badge>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Overall Score</div>
            <div className={`text-4xl font-bold ${getScoreColor(scores.overall)}`}>
              {scores.overall}
            </div>
            <div className="text-sm text-gray-600">{getScoreLabel(scores.overall)}</div>
          </div>
        </div>
      </Card>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <ScoreCard
          title="Accessibility"
          score={scores.accessibility}
        />
        <ScoreCard
          title="Design"
          score={scores.design}
        />
        <ScoreCard
          title="Info Architecture"
          score={scores.ia}
        />
        <ScoreCard
          title="Performance"
          score={scores.performance}
        />
        <ScoreCard
          title="Usability"
          score={scores.usability}
        />
      </div>

      {/* Executive Summary */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            This UX audit identified <strong>{findings.length} findings</strong> across accessibility,
            design, information architecture, and performance categories. The website scored{' '}
            <strong className={getScoreColor(scores.overall)}>{scores.overall}/100</strong> overall,
            indicating {getScoreLabel(scores.overall).toLowerCase()} user experience quality.
            {topIssues.length > 0 && (
              <> Immediate attention required for {topIssues.length} high-priority issues.</>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Top Priority Issues */}
      {topIssues.length > 0 && (
        <Card hover={false}>
          <CardHeader>
            <CardTitle>Top Priority Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topIssues.map((finding, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{finding.title}</h4>
                      <Badge severity={finding.severity} size="sm">
                        {finding.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{finding.impact}</p>
                    <p className="text-sm text-gray-700">
                      <strong>Recommendation:</strong> {finding.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ScoreCard = ({ title, score }) => {
  const getColor = () => {
    if (score >= 80) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    if (score >= 60) return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  };

  const colors = getColor();

  return (
    <div className={`${colors.bg} rounded-lg border ${colors.border} p-4 text-center`}>
      <div className="text-sm font-medium text-gray-600 mb-2">{title}</div>
      <div className={`text-3xl font-bold ${colors.text}`}>{score}</div>
      <div className="text-xs text-gray-500 mt-1">out of 100</div>
    </div>
  );
};
