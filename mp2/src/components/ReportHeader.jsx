import { FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

export default function ReportHeader({ metadata, summary }) {
  // Calculate score
  const totalChecks = summary.passed + summary.totalIssues
  const score = totalChecks > 0 ? Math.round((summary.passed / totalChecks) * 100) : 0

  // Letter grade
  const getGrade = (score) => {
    if (score >= 90) return { letter: 'A', color: 'text-green-600' }
    if (score >= 80) return { letter: 'B', color: 'text-blue-600' }
    if (score >= 70) return { letter: 'C', color: 'text-yellow-600' }
    if (score >= 60) return { letter: 'D', color: 'text-orange-600' }
    return { letter: 'F', color: 'text-red-600' }
  }

  const grade = getGrade(score)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-gray-400" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {metadata.pageTitle}
              </h2>
              <p className="text-sm text-gray-600">
                {metadata.filename}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(metadata.analyzedAt).toLocaleString()}
              </span>
            </div>
            <div>
              {(metadata.htmlSize / 1024).toFixed(1)} KB
            </div>
            {metadata.analysisTime && (
              <div>
                Analyzed in {metadata.analysisTime}ms
              </div>
            )}
          </div>
        </div>

        {/* Score Display */}
        <div className="flex flex-col items-center">
          <div className={`text-6xl font-bold ${grade.color}`}>
            {grade.letter}
          </div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">
            {score}%
          </div>
          <div className="text-sm text-gray-600">
            Score
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Passed</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-green-600">
            {summary.passed}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">Critical</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-red-600">
            {summary.critical}
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Serious</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-orange-600">
            {summary.serious}
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Moderate</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-yellow-600">
            {summary.moderate}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Minor</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-blue-600">
            {summary.minor}
          </div>
        </div>
      </div>
    </div>
  )
}
