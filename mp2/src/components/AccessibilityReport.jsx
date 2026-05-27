import { useState } from 'react'
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import IssueCard from './IssueCard'

const categories = [
  { key: 'colorContrast', label: 'Color Contrast', icon: '🎨' },
  { key: 'headings', label: 'Heading Hierarchy', icon: '📝' },
  { key: 'images', label: 'Image Accessibility', icon: '🖼️' },
  { key: 'forms', label: 'Form Accessibility', icon: '📋' },
  { key: 'aria', label: 'ARIA Attributes', icon: '♿' }
]

function CategorySection({ category, data }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const hasIssues = data.issues && data.issues.length > 0
  const passed = data.passed || 0
  const failed = data.failed || data.issues?.length || 0
  const total = passed + failed
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(0) : 100

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 px-6 py-4 flex items-center justify-between transition-all"
      >
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-sm">
            <span className="text-3xl">{category.icon}</span>
          </div>
          <div className="text-left flex-1">
            <h3 className="font-bold text-gray-900 text-lg">{category.label}</h3>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <div className="w-full bg-gray-200 rounded-full h-2" style={{width: '120px'}}>
                  <div
                    className={`h-2 rounded-full transition-all ${passRate >= 80 ? 'bg-green-500' : passRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{width: `${passRate}%`}}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">{passRate}%</span>
              </div>
              <div className="flex items-center space-x-1 text-green-700 bg-green-100 px-3 py-1 rounded-full">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-semibold">{passed}</span>
              </div>
              {failed > 0 && (
                <div className="flex items-center space-x-1 text-red-700 bg-red-100 px-3 py-1 rounded-full">
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm font-semibold">{failed}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 bg-white">
          {/* Heading Structure (if applicable) */}
          {category.key === 'headings' && data.structure && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Heading Structure
              </h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {Object.entries(data.structure).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {hasIssues ? (
            <div className="space-y-3">
              {data.issues.map((issue, idx) => (
                <IssueCard key={idx} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
              <p>No issues found in this category</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AccessibilityReport({ accessibility }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Accessibility Report
        </h2>
      </div>

      <div className="space-y-5">
        {categories.map((category) => (
          <CategorySection
            key={category.key}
            category={category}
            data={accessibility[category.key] || { passed: 0, failed: 0, issues: [] }}
          />
        ))}
      </div>
    </div>
  )
}
