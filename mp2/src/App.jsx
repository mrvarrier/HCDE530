import { useState } from 'react'
import FileUpload from './components/FileUpload'
import LoadingState from './components/LoadingState'
import ReportHeader from './components/ReportHeader'
import AccessibilityReport from './components/AccessibilityReport'
import NavigationReport from './components/NavigationReport'
import ExportButtons from './components/ExportButtons'

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleFileUpload = async (html, filename) => {
    setIsAnalyzing(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, filename })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Analysis failed')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setResults(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            UX Auditor
          </h1>
          <p className="text-lg text-gray-600">
            Accessibility & Navigation Analysis Tool
          </p>
        </header>

        {/* File Upload */}
        {!results && !isAnalyzing && (
          <FileUpload onFileUpload={handleFileUpload} />
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Analysis Error
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 text-sm font-medium text-red-700 hover:text-red-600"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && <LoadingState />}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <ReportHeader
              metadata={results.metadata}
              summary={results.summary}
            />

            <ExportButtons data={results} />

            <div className="grid gap-6 lg:grid-cols-2">
              <AccessibilityReport accessibility={results.accessibility} />
              <NavigationReport navigation={results.navigation} />
            </div>

            <button
              onClick={handleReset}
              className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Analyze Another File
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
