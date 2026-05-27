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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            UX Auditor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional accessibility & navigation analysis for modern websites
          </p>
        </header>

        {/* File Upload */}
        {!results && !isAnalyzing && (
          <FileUpload onFileUpload={handleFileUpload} />
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-6 shadow-lg animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-red-900">
                  Analysis Error
                </h3>
                <p className="mt-2 text-sm text-red-700 leading-relaxed">{error}</p>
                <button
                  onClick={handleReset}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium shadow-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
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

            <div className="flex justify-center mt-8">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Analyze Another File</span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
