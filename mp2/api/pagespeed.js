/**
 * PageSpeed Insights API Endpoint
 * Fetches performance data from Google PageSpeed Insights API
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Use POST method'
    })
  }

  try {
    const { url } = req.body

    // Validate input
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'URL is required and must be a string'
      })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return res.status(400).json({
        error: 'Invalid URL',
        message: 'Please provide a valid URL'
      })
    }

    // Get API key from environment variable
    const apiKey = process.env.VITE_PAGESPEED_API_KEY

    if (!apiKey) {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'PageSpeed API key not configured'
      })
    }

    // Call PageSpeed Insights API
    const categories = ['performance', 'accessibility', 'best-practices', 'seo']
    const strategy = 'mobile' // Can also be 'desktop'

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=${strategy}&category=${categories.join('&category=')}`

    const response = await fetch(apiUrl)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'PageSpeed API request failed')
    }

    const data = await response.json()

    // Extract relevant metrics
    const lighthouseResult = data.lighthouseResult
    const categories_scores = lighthouseResult.categories

    const results = {
      metadata: {
        url: data.id,
        fetchTime: data.analysisUTCTimestamp,
        strategy: strategy,
        lighthouseVersion: lighthouseResult.lighthouseVersion
      },
      scores: {
        performance: Math.round((categories_scores.performance?.score || 0) * 100),
        accessibility: Math.round((categories_scores.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories_scores['best-practices']?.score || 0) * 100),
        seo: Math.round((categories_scores.seo?.score || 0) * 100)
      },
      metrics: {
        firstContentfulPaint: lighthouseResult.audits['first-contentful-paint']?.displayValue || 'N/A',
        largestContentfulPaint: lighthouseResult.audits['largest-contentful-paint']?.displayValue || 'N/A',
        totalBlockingTime: lighthouseResult.audits['total-blocking-time']?.displayValue || 'N/A',
        cumulativeLayoutShift: lighthouseResult.audits['cumulative-layout-shift']?.displayValue || 'N/A',
        speedIndex: lighthouseResult.audits['speed-index']?.displayValue || 'N/A'
      },
      opportunities: lighthouseResult.audits ? Object.entries(lighthouseResult.audits)
        .filter(([key, audit]) => audit.score !== null && audit.score < 0.9 && audit.details?.overallSavingsMs > 100)
        .map(([key, audit]) => ({
          title: audit.title,
          description: audit.description,
          score: audit.score,
          displayValue: audit.displayValue,
          savings: audit.details?.overallSavingsMs
        }))
        .slice(0, 10) : [],
      accessibilityIssues: categories_scores.accessibility?.auditRefs
        ?.filter(ref => {
          const audit = lighthouseResult.audits[ref.id]
          return audit && audit.score !== null && audit.score < 1
        })
        .map(ref => {
          const audit = lighthouseResult.audits[ref.id]
          return {
            id: ref.id,
            title: audit.title,
            description: audit.description,
            score: audit.score,
            displayValue: audit.displayValue
          }
        })
        .slice(0, 10) || []
    }

    return res.status(200).json(results)

  } catch (error) {
    console.error('PageSpeed API error:', error)

    return res.status(500).json({
      error: 'PageSpeed analysis failed',
      message: error.message || 'An unexpected error occurred'
    })
  }
}
