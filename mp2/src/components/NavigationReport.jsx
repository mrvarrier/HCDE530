import { Navigation, Link2, CheckCircle } from 'lucide-react'
import IssueCard from './IssueCard'

export default function NavigationReport({ navigation }) {
  const { structure, links, issues } = navigation

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Navigation Report
      </h2>

      {/* Navigation Structure */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Navigation className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Navigation Structure
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Maximum Depth</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {structure.maxDepth} {structure.maxDepth === 1 ? 'level' : 'levels'}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Top-Level Items</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {structure.topLevelItems}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Total Nav Items</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {structure.totalNavItems}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Breadcrumbs</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {structure.hasBreadcrumbs ? (
                <span className="text-green-600">Yes</span>
              ) : (
                <span className="text-gray-400">No</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Links Analysis */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Link2 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Links Analysis
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-900">Total Links</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {links.totalLinks}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-900">Internal</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {links.internalLinks}
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-purple-900">External</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              {links.externalLinks}
            </div>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <div className="text-sm text-indigo-900">Anchor Links</div>
            <div className="text-2xl font-bold text-indigo-600 mt-1">
              {links.anchorLinks}
            </div>
          </div>

          {links.emptyHrefs > 0 && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-sm text-red-900">Empty Hrefs</div>
              <div className="text-2xl font-bold text-red-600 mt-1">
                {links.emptyHrefs}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Issues */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Navigation Issues
        </h3>

        {issues && issues.length > 0 ? (
          <div className="space-y-3">
            {issues.map((issue, idx) => (
              <IssueCard key={idx} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
            <p className="text-gray-500">No navigation issues found</p>
          </div>
        )}
      </div>
    </div>
  )
}
