/**
 * Color Contrast Analysis
 * WCAG 1.4.3 Contrast (Minimum)
 * Uses chroma-js for color manipulation
 */

import chroma from 'chroma-js'
import { getSelector, getText, getColor, getBackgroundColor, getFontSize, isBold } from '../parser.js'

/**
 * Analyze color contrast
 * @param {CheerioStatic} $ - Cheerio instance
 * @returns {Object} Analysis results
 */
export function analyzeColorContrast($) {
  const issues = []
  const checkedElements = new Set()
  let checksPerformed = 0
  let passedCount = 0

  // Elements to check for contrast
  const textElements = $('p, h1, h2, h3, h4, h5, h6, span, a, li, td, th, div, button, label')

  textElements.each((i, elem) => {
    const $elem = $(elem)
    const text = getText($elem)

    // Skip if no visible text content
    if (!text || text.length === 0) {
      return
    }

    // Skip if already checked (avoid duplicates)
    const selector = getSelector(elem, $)
    if (checkedElements.has(selector)) {
      return
    }
    checkedElements.add(selector)

    checksPerformed++

    try {
      // Get foreground color
      let fgColor = getColor($elem, 'color', $)
      if (!fgColor) {
        fgColor = '#000000' // Default to black
      }

      // Get background color (walk up DOM if transparent)
      let bgColor = getBackgroundColor($elem, $)

      // Parse colors with chroma-js
      let fgChroma, bgChroma
      try {
        fgChroma = chroma(fgColor)
        bgChroma = chroma(bgColor)
      } catch (e) {
        // Invalid color, skip
        return
      }

      // Calculate contrast ratio
      const contrastRatio = chroma.contrast(fgChroma, bgChroma)

      // Determine required ratio based on font size and weight
      const fontSize = getFontSize($elem)
      const bold = isBold($elem)

      // WCAG 2.1 Level AA requirements:
      // - Normal text (<18pt or <14pt bold): 4.5:1
      // - Large text (≥18pt or ≥14pt bold): 3:1
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && bold)
      const requiredRatio = isLargeText ? 3.0 : 4.5

      // Check if passes
      if (contrastRatio < requiredRatio) {
        const severity = contrastRatio < (requiredRatio - 1.5) ? 'serious' : 'moderate'
        const tagName = (elem.tagName || elem.name || '').toLowerCase()

        issues.push({
          severity,
          element: tagName,
          selector,
          foreground: fgChroma.hex(),
          background: bgChroma.hex(),
          contrastRatio: Math.round(contrastRatio * 100) / 100,
          required: requiredRatio,
          fontSize,
          wcag: '1.4.3 Contrast (Minimum)',
          recommendation: `Increase contrast to at least ${requiredRatio}:1. Current: ${Math.round(contrastRatio * 100) / 100}:1`
        })
      } else {
        passedCount++
      }
    } catch (error) {
      // Skip elements with color parsing errors
      console.error('Color contrast analysis error:', error)
    }
  })

  return {
    passed: passedCount,
    failed: issues.length,
    issues
  }
}
