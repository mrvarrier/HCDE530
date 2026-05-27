/**
 * Image Accessibility Analysis
 * WCAG 1.1.1 Non-text Content
 */

import { getSelector } from '../parser.js'

/**
 * Analyze image accessibility
 * @param {CheerioStatic} $ - Cheerio instance
 * @returns {Object} Analysis results
 */
export function analyzeImages($) {
  const issues = []
  let totalImages = 0
  let passedCount = 0

  $('img').each((i, elem) => {
    totalImages++
    const $img = $(elem)
    const alt = $img.attr('alt')
    const src = $img.attr('src') || ''
    const selector = getSelector(elem, $)
    const width = parseInt($img.attr('width')) || 0
    const height = parseInt($img.attr('height')) || 0

    let hasissue = false

    // Check 1: Missing alt attribute
    if (alt === undefined) {
      issues.push({
        severity: 'serious',
        element: 'img',
        selector,
        src,
        description: 'Image missing alt attribute',
        wcag: '1.1.1 Non-text Content',
        recommendation: 'Add descriptive alt text for non-decorative images, or alt="" for decorative images'
      })
      hasissue = true
    }
    // Check 2: Empty alt on potentially non-decorative images
    else if (alt === '' && !seemsDecorative($img, width, height, $)) {
      issues.push({
        severity: 'moderate',
        element: 'img',
        selector,
        src,
        description: 'Empty alt attribute on potentially non-decorative image',
        wcag: '1.1.1 Non-text Content',
        recommendation: 'Add descriptive alt text if image conveys information, or verify it is decorative'
      })
      hasissue = true
    }
    // Check 3: Alt text quality
    else if (alt && alt.length > 0) {
      // Too long
      if (alt.length > 125) {
        issues.push({
          severity: 'minor',
          element: 'img',
          selector,
          src,
          description: `Alt text too long (${alt.length} characters)`,
          wcag: '1.1.1 Non-text Content',
          recommendation: 'Keep alt text concise (under 125 characters)'
        })
        hasissue = true
      }

      // Suspicious patterns
      const suspiciousPatterns = [
        { pattern: /^image of /i, desc: 'Starts with "image of"' },
        { pattern: /^picture of /i, desc: 'Starts with "picture of"' },
        { pattern: /^photo of /i, desc: 'Starts with "photo of"' },
        { pattern: /\.(jpg|jpeg|png|gif|svg|webp)$/i, desc: 'Contains filename' }
      ]

      suspiciousPatterns.forEach(({ pattern, desc }) => {
        if (pattern.test(alt)) {
          issues.push({
            severity: 'minor',
            element: 'img',
            selector,
            src,
            description: `Alt text quality issue: ${desc}`,
            wcag: '1.1.1 Non-text Content',
            recommendation: 'Describe what the image shows, not that it is an image'
          })
          hasissue = true
        }
      })
    }

    if (!hasissue) {
      passedCount++
    }
  })

  return {
    passed: passedCount,
    failed: issues.length,
    issues
  }
}

/**
 * Heuristic to determine if image is likely decorative
 * @param {CheerioElement} $img - Cheerio image element
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {CheerioStatic} $ - Cheerio instance
 * @returns {boolean} True if likely decorative
 */
function seemsDecorative($img, width, height, $) {
  // Small images (< 50x50) likely decorative
  if (width > 0 && height > 0 && width < 50 && height < 50) {
    return true
  }

  // Images inside links might be decorative if link has text
  const $parentLink = $img.closest('a')
  if ($parentLink.length > 0) {
    const linkText = $parentLink.text().trim()
    if (linkText.length > 0) {
      return true // Link has text, image is supplementary
    }
  }

  // Check for decorative role
  if ($img.attr('role') === 'presentation' || $img.attr('role') === 'none') {
    return true
  }

  // Check for common decorative class names
  const className = $img.attr('class') || ''
  const decorativeClasses = ['icon', 'decoration', 'decorative', 'spacer', 'divider']
  if (decorativeClasses.some(cls => className.includes(cls))) {
    return true
  }

  return false
}
