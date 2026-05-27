import { AlertTriangle, Info } from 'lucide-react'

const severityConfig = {
  critical: {
    bg: 'bg-gradient-to-r from-red-50 to-rose-50',
    border: 'border-l-4 border-red-500',
    text: 'text-red-900',
    badge: 'bg-red-500 text-white',
    icon: 'text-red-600',
    glow: 'shadow-red-100'
  },
  serious: {
    bg: 'bg-gradient-to-r from-orange-50 to-amber-50',
    border: 'border-l-4 border-orange-500',
    text: 'text-orange-900',
    badge: 'bg-orange-500 text-white',
    icon: 'text-orange-600',
    glow: 'shadow-orange-100'
  },
  moderate: {
    bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
    border: 'border-l-4 border-yellow-500',
    text: 'text-yellow-900',
    badge: 'bg-yellow-500 text-white',
    icon: 'text-yellow-600',
    glow: 'shadow-yellow-100'
  },
  minor: {
    bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    border: 'border-l-4 border-blue-500',
    text: 'text-blue-900',
    badge: 'bg-blue-500 text-white',
    icon: 'text-blue-600',
    glow: 'shadow-blue-100'
  }
}

export default function IssueCard({ issue }) {
  const config = severityConfig[issue.severity] || severityConfig.moderate

  return (
    <div className={`${config.bg} ${config.border} rounded-xl p-5 shadow-lg ${config.glow} hover:shadow-xl transition-all duration-200`}>
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-lg bg-white shadow-sm`}>
          <AlertTriangle className={`h-5 w-5 ${config.icon} flex-shrink-0`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 text-xs font-bold rounded-lg ${config.badge} shadow-sm`}>
                {issue.severity.toUpperCase()}
              </span>
              {issue.element && (
                <code className="px-3 py-1 bg-white text-gray-900 text-xs rounded-lg font-mono border border-gray-200 shadow-sm">
                  &lt;{issue.element}&gt;
                </code>
              )}
            </div>
            {issue.wcag && (
              <a
                href={`https://www.w3.org/WAI/WCAG21/quickref/#${issue.wcag.split(' ')[0].replace(/\./g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 hover:text-blue-600 flex items-center space-x-1.5 px-3 py-1 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all shadow-sm"
              >
                <Info className="h-3.5 w-3.5" />
                <span className="font-medium">{issue.wcag}</span>
              </a>
            )}
          </div>

          {/* Description */}
          <p className={`text-sm ${config.text} font-semibold leading-relaxed`}>
            {issue.description}
          </p>

          {/* Selector */}
          {issue.selector && (
            <div className="mt-3 p-3 bg-white/70 rounded-lg border border-gray-200">
              <code className="text-xs text-gray-700 font-mono break-all">
                {issue.selector}
              </code>
            </div>
          )}

          {/* Additional Details */}
          {(issue.foreground || issue.background || issue.contrastRatio) && (
            <div className="mt-3 flex items-center space-x-4 text-xs text-gray-700">
              {issue.foreground && (
                <div className="flex items-center space-x-1">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: issue.foreground }}
                  />
                  <span>{issue.foreground}</span>
                </div>
              )}
              {issue.background && (
                <div className="flex items-center space-x-1">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: issue.background }}
                  />
                  <span>{issue.background}</span>
                </div>
              )}
              {issue.contrastRatio && (
                <span>
                  Contrast: {issue.contrastRatio}:1
                  {issue.required && ` (required: ${issue.required}:1)`}
                </span>
              )}
            </div>
          )}

          {/* Recommendation */}
          {issue.recommendation && (
            <div className="mt-4 p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Recommendation</p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {issue.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
