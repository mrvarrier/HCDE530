import React from 'react';
import { Target, TrendingUp, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../UI';

export const RecommendationsSection = ({ audit }) => {
  const { recommendations } = audit;

  // Group by impact/effort
  const highImpactLowEffort = recommendations.filter(r => r.impact === 'high' && r.effort === 'low');
  const highImpactMediumEffort = recommendations.filter(r => r.impact === 'high' && r.effort === 'medium');
  const otherRecommendations = recommendations.filter(r => !(r.impact === 'high' && (r.effort === 'low' || r.effort === 'medium')));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <Target className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">UX Recommendations</h2>
          <p className="text-gray-600">Prioritized by impact and implementation effort</p>
        </div>
      </div>

      {/* Priority Matrix */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Quick Wins */}
        {highImpactLowEffort.length > 0 && (
          <Card hover={false} className="border-l-4 border-green-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-green-600" />
                <CardTitle>Quick Wins</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-1">High impact / Low effort</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {highImpactLowEffort.map((rec, index) => (
                  <RecommendationCard key={index} recommendation={rec} priority="high" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Major Improvements */}
        {highImpactMediumEffort.length > 0 && (
          <Card hover={false} className="border-l-4 border-yellow-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                <CardTitle>Major Improvements</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-1">High impact / Medium effort</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {highImpactMediumEffort.map((rec, index) => (
                  <RecommendationCard key={index} recommendation={rec} priority="medium" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Future Enhancements */}
        {otherRecommendations.length > 0 && (
          <Card hover={false} className="border-l-4 border-blue-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <CardTitle>Future Enhancements</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-1">Consider for next iteration</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {otherRecommendations.map((rec, index) => (
                  <RecommendationCard key={index} recommendation={rec} priority="low" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const RecommendationCard = ({ recommendation, priority }) => {
  const priorityColors = {
    high: 'bg-green-50 border-green-200',
    medium: 'bg-yellow-50 border-yellow-200',
    low: 'bg-blue-50 border-blue-200'
  };

  const badgeColors = {
    accessibility: 'info',
    design: 'success',
    performance: 'info',
    ia: 'info'
  };

  return (
    <div className={`p-3 rounded-lg border ${priorityColors[priority]}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm">{recommendation.title}</h4>
        <Badge severity={badgeColors[recommendation.category]} size="sm">
          {recommendation.category}
        </Badge>
      </div>
      <p className="text-sm text-gray-700">{recommendation.description}</p>
    </div>
  );
};
