import { AlertTriangle, Info } from 'lucide-react'

const severityConfig = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-800',
    icon: 'text-red-600'
  },
  serious: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    badge: 'bg-orange-100 text-orange-800',
    icon: 'text-orange-600'
  },
  moderate: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-800',
    icon: 'text-yellow-600'
  },
  minor: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-800',
    icon: 'text-blue-600'
  }
}

export default function IssueCard({ issue }) {
  const config = severityConfig[issue.severity] || severityConfig.moderate

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4`}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className={`h-5 w-5 ${config.icon} flex-shrink-0 mt-0.5`} />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded ${config.badge}`}>
                {issue.severity.toUpperCase()}
              </span>
              {issue.element && (
                <code className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded font-mono">
                  &lt;{issue.element}&gt;
                </code>
              )}
            </div>
            {issue.wcag && (
              <a
                href={`https://www.w3.org/WAI/WCAG21/quickref/#${issue.wcag.split(' ')[0].replace(/\./g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 hover:text-gray-900 flex items-center space-x-1"
              >
                <Info className="h-3 w-3" />
                <span>{issue.wcag}</span>
              </a>
            )}
          </div>

          {/* Description */}
          <p className={`mt-2 text-sm ${config.text} font-medium`}>
            {issue.description}
          </p>

          {/* Selector */}
          {issue.selector && (
            <div className="mt-2">
              <code className="text-xs text-gray-600 font-mono break-all">
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
            <div className="mt-3 p-3 bg-white rounded border border-gray-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Recommendation:</span>{' '}
                {issue.recommendation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
