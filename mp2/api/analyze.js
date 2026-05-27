/**
 * UX Auditor Analysis API Endpoint
 * Analyzes HTML for accessibility and navigation issues
 */

import * as cheerio from 'cheerio'
import { analyzeColorContrast } from '../src/utils/accessibility/colorContrast.js'
import { analyzeHeadings } from '../src/utils/accessibility/headings.js'
import { analyzeImages } from '../src/utils/accessibility/images.js'
import { analyzeForms } from '../src/utils/accessibility/forms.js'
import { analyzeAria } from '../src/utils/accessibility/aria.js'
import { analyzeNavigationStructure } from '../src/utils/navigation/structure.js'
import { analyzeLinks } from '../src/utils/navigation/links.js'

/**
 * API handler function
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
    const { html, filename } = req.body

    // Validate input
    if (!html || typeof html !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'HTML content is required and must be a string'
      })
    }

    if (html.length === 0) {
      return res.status(400).json({
        error: 'Empty file',
        message: 'HTML content is empty'
      })
    }

    if (html.length > 5 * 1024 * 1024) {
      return res.status(400).json({
        error: 'File too large',
        message: 'HTML file must be under 5MB'
      })
    }

    // Parse HTML with Cheerio
    const $ = cheerio.load(html, {
      decodeEntities: false,
      _useHtmlParser2: true
    })

    // Extract metadata
    const pageTitle = $('title').first().text().trim() || 'Untitled Page'

    // Run all analysis checks in parallel
    const startTime = Date.now()

    const [
      colorContrast,
      headings,
      images,
      forms,
      aria,
      navStructure,
      links
    ] = await Promise.all([
      Promise.resolve(analyzeColorContrast($)),
      Promise.resolve(analyzeHeadings($)),
      Promise.resolve(analyzeImages($)),
      Promise.resolve(analyzeForms($)),
      Promise.resolve(analyzeAria($)),
      Promise.resolve(analyzeNavigationStructure($)),
      Promise.resolve(analyzeLinks($))
    ])

    const analysisTime = Date.now() - startTime

    // Calculate summary statistics
    const totalIssues =
      (colorContrast.failed || 0) +
      (headings.failed || 0) +
      (images.failed || 0) +
      (forms.failed || 0) +
      (aria.failed || 0) +
      (navStructure.issues?.length || 0) +
      (links.issues?.length || 0)

    const totalPassed =
      (colorContrast.passed || 0) +
      (headings.passed || 0) +
      (images.passed || 0) +
      (forms.passed || 0) +
      (aria.passed || 0)

    // Count issues by severity
    const allIssues = [
      ...(colorContrast.issues || []),
      ...(headings.issues || []),
      ...(images.issues || []),
      ...(forms.issues || []),
      ...(aria.issues || []),
      ...(navStructure.issues || []),
      ...(links.issues || [])
    ]

    const critical = allIssues.filter(i => i.severity === 'critical').length
    const serious = allIssues.filter(i => i.severity === 'serious').length
    const moderate = allIssues.filter(i => i.severity === 'moderate').length
    const minor = allIssues.filter(i => i.severity === 'minor').length

    // Build structured response
    const results = {
      metadata: {
        filename: filename || 'unknown.html',
        analyzedAt: new Date().toISOString(),
        pageTitle,
        htmlSize: html.length,
        analysisTime
      },
      summary: {
        totalIssues,
        critical,
        serious,
        moderate,
        minor,
        passed: totalPassed
      },
      accessibility: {
        colorContrast,
        headings,
        images,
        forms,
        aria
      },
      navigation: {
        structure: {
          maxDepth: navStructure.maxDepth,
          topLevelItems: navStructure.topLevelItems,
          totalNavItems: navStructure.totalNavItems,
          hasBreadcrumbs: navStructure.hasBreadcrumbs
        },
        links: {
          totalLinks: links.totalLinks,
          internalLinks: links.internalLinks,
          externalLinks: links.externalLinks,
          anchorLinks: links.anchorLinks,
          emptyHrefs: links.emptyHrefs
        },
        issues: [...(navStructure.issues || []), ...(links.issues || [])]
      }
    }

    // Return results
    return res.status(200).json(results)

  } catch (error) {
    console.error('Analysis error:', error)

    // Check if it's a parsing error
    if (error.message && error.message.includes('Parse')) {
      return res.status(400).json({
        error: 'Invalid HTML',
        message: `Failed to parse HTML: ${error.message}`
      })
    }

    // Generic error
    return res.status(500).json({
      error: 'Analysis failed',
      message: error.message || 'An unexpected error occurred during analysis'
    })
  }
}
