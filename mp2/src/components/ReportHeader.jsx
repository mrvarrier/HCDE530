import { FileText, Clock, AlertTriangle, CheckCircle, TrendingUp, Award } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

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

  // Prepare data for pie chart
  const chartData = [
    { name: 'Passed', value: summary.passed, color: '#10B981' },
    { name: 'Critical', value: summary.critical, color: '#EF4444' },
    { name: 'Serious', value: summary.serious, color: '#F97316' },
    { name: 'Moderate', value: summary.moderate, color: '#F59E0B' },
    { name: 'Minor', value: summary.minor, color: '#3B82F6' }
  ].filter(item => item.value > 0)

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {metadata.pageTitle}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {metadata.filename}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100 mt-4">
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(metadata.analyzedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <span>{(metadata.htmlSize / 1024).toFixed(1)} KB</span>
              </div>
              {metadata.analysisTime && (
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>{metadata.analysisTime}ms</span>
                </div>
              )}
            </div>
          </div>

          {/* Score Badge */}
          <div className="flex flex-col items-center bg-white rounded-2xl p-6 shadow-2xl">
            <Award className={`h-8 w-8 mb-2 ${grade.color}`} />
            <div className={`text-6xl font-black ${grade.color}`}>
              {grade.letter}
            </div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {score}%
            </div>
            <div className="text-sm text-gray-600 font-medium mt-1">
              Overall Score
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="p-8 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-l-4 border-green-500 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-900">Passed</span>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-3xl font-black text-green-600">
                {summary.passed}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border-l-4 border-red-500 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-red-900">Critical</span>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-3xl font-black text-red-600">
                {summary.critical}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border-l-4 border-orange-500 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-orange-900">Serious</span>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-3xl font-black text-orange-600">
                {summary.serious}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border-l-4 border-yellow-500 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-yellow-900">Moderate</span>
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-3xl font-black text-yellow-600">
                {summary.moderate}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-l-4 border-blue-500 shadow-sm col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-900">Minor Issues</span>
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-blue-600">
                {summary.minor}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
