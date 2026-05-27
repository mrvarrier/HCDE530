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

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gray-50 hover:bg-gray-100 px-4 py-3 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{category.icon}</span>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{category.label}</h3>
            <div className="flex items-center space-x-4 mt-1 text-sm">
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>{passed} passed</span>
              </div>
              {failed > 0 && (
                <div className="flex items-center space-x-1 text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span>{failed} issues</span>
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Accessibility Report
      </h2>

      <div className="space-y-4">
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
