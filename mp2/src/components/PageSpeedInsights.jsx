import { useState } from 'react'
import { Globe, TrendingUp, Zap, AlertCircle } from 'lucide-react'

export default function PageSpeedInsights({ onAnalysisComplete }) {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async (e) => {
    e.preventDefault()

    if (!url || !url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/pagespeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'PageSpeed analysis failed')
      }

      const data = await response.json()
      onAnalysisComplete(data, 'pagespeed')
    } catch (err) {
      setError(err.message)
      console.error('PageSpeed analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">PageSpeed Insights</h3>
            <p className="text-sm text-gray-600">Analyze live website performance</p>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
              Website URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="block w-full pl-12 pr-4 py-4 text-gray-900 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-lg"
                disabled={isAnalyzing}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start space-x-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isAnalyzing}
            className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${
              isAnalyzing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transform hover:-translate-y-0.5 hover:shadow-xl'
            }`}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing (may take 30-60 seconds)...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                <span>Run PageSpeed Analysis</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">Performance</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <svg className="h-6 w-6 text-green-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
            <p className="text-xs text-gray-600 font-medium">Accessibility</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <svg className="h-6 w-6 text-purple-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-gray-600 font-medium">Best Practices</p>
          </div>
        </div>
      </div>
    </div>
  )
}
