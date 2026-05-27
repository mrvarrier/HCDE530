import { Globe, Zap, AlertTriangle, TrendingUp, Clock } from 'lucide-react'

const getScoreColor = (score) => {
  if (score >= 90) return { bg: 'bg-green-500', text: 'text-green-600', label: 'Good' }
  if (score >= 50) return { bg: 'bg-orange-500', text: 'text-orange-600', label: 'Needs Improvement' }
  return { bg: 'bg-red-500', text: 'text-red-600', label: 'Poor' }
}

const ScoreGauge = ({ score, label }) => {
  const config = getScoreColor(score)
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={config.text}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{score}</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-900">{label}</p>
      <p className={`text-xs font-medium ${config.text}`}>{config.label}</p>
    </div>
  )
}

export default function PageSpeedResults({ data }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">PageSpeed Insights</h2>
              <p className="text-green-100 text-sm mt-1 break-all">{data.metadata.url}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-green-100 mt-4">
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <Clock className="h-4 w-4" />
              <span>{new Date(data.metadata.fetchTime).toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="capitalize">{data.metadata.strategy} Analysis</span>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="p-8 bg-gray-50">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <ScoreGauge score={data.scores.performance} label="Performance" />
            <ScoreGauge score={data.scores.accessibility} label="Accessibility" />
            <ScoreGauge score={data.scores.bestPractices} label="Best Practices" />
            <ScoreGauge score={data.scores.seo} label="SEO" />
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
          <Zap className="h-6 w-6 text-yellow-500" />
          <span>Core Web Vitals</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-l-4 border-blue-500">
            <p className="text-sm font-semibold text-blue-900 mb-1">First Contentful Paint</p>
            <p className="text-2xl font-bold text-blue-600">{data.metrics.firstContentfulPaint}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-l-4 border-purple-500">
            <p className="text-sm font-semibold text-purple-900 mb-1">Largest Contentful Paint</p>
            <p className="text-2xl font-bold text-purple-600">{data.metrics.largestContentfulPaint}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border-l-4 border-orange-500">
            <p className="text-sm font-semibold text-orange-900 mb-1">Total Blocking Time</p>
            <p className="text-2xl font-bold text-orange-600">{data.metrics.totalBlockingTime}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-l-4 border-green-500">
            <p className="text-sm font-semibold text-green-900 mb-1">Cumulative Layout Shift</p>
            <p className="text-2xl font-bold text-green-600">{data.metrics.cumulativeLayoutShift}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border-l-4 border-yellow-500">
            <p className="text-sm font-semibold text-yellow-900 mb-1">Speed Index</p>
            <p className="text-2xl font-bold text-yellow-600">{data.metrics.speedIndex}</p>
          </div>
        </div>
      </div>

      {/* Opportunities */}
      {data.opportunities && data.opportunities.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <span>Optimization Opportunities</span>
          </h3>

          <div className="space-y-4">
            {data.opportunities.map((opp, idx) => (
              <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-l-4 border-blue-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{opp.title}</h4>
                    <p className="text-sm text-gray-700">{opp.description}</p>
                    {opp.displayValue && (
                      <p className="text-sm text-blue-600 font-medium mt-2">{opp.displayValue}</p>
                    )}
                  </div>
                  {opp.savings && (
                    <div className="ml-4 text-right">
                      <p className="text-xs text-gray-600">Potential Savings</p>
                      <p className="text-lg font-bold text-green-600">{Math.round(opp.savings)}ms</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accessibility Issues */}
      {data.accessibilityIssues && data.accessibilityIssues.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <span>Accessibility Issues</span>
          </h3>

          <div className="space-y-4">
            {data.accessibilityIssues.map((issue, idx) => (
              <div key={idx} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-5 border-l-4 border-orange-500">
                <h4 className="font-semibold text-gray-900 mb-1">{issue.title}</h4>
                <p className="text-sm text-gray-700">{issue.description}</p>
                {issue.displayValue && (
                  <p className="text-sm text-orange-600 font-medium mt-2">{issue.displayValue}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
