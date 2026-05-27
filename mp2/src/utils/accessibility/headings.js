/**
 * Heading Hierarchy Analysis
 * WCAG 1.3.1 Info and Relationships
 */

import { getSelector, getText } from '../parser.js'

/**
 * Analyze heading structure and hierarchy
 * @param {CheerioStatic} $ - Cheerio instance
 * @returns {Object} Analysis results
 */
export function analyzeHeadings($) {
  const headings = []
  const issues = []
  const structure = {
    h1Count: 0,
    h2Count: 0,
    h3Count: 0,
    h4Count: 0,
    h5Count: 0,
    h6Count: 0
  }

  // Collect all headings
  $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
    const $elem = $(elem)
    const level = parseInt(elem.tagName[1], 10)
    const text = getText($elem)
    const selector = getSelector(elem, $)

    headings.push({ level, text, selector, elem })
    structure[`h${level}Count`]++
  })

  // Check 1: Multiple H1s
  if (structure.h1Count === 0) {
    issues.push({
      severity: 'serious',
      element: 'h1',
      description: 'No h1 heading found on page',
      wcag: '1.3.1 Info and Relationships',
      recommendation: 'Add a single h1 heading that describes the main content'
    })
  } else if (structure.h1Count > 1) {
    issues.push({
      severity: 'moderate',
      element: 'h1',
      description: `${structure.h1Count} h1 tags found. Use only one per page`,
      wcag: '1.3.1 Info and Relationships',
      recommendation: 'Replace additional h1 tags with h2 or lower level headings'
    })
  }

  // Check 2: Empty headings
  headings.forEach(heading => {
    if (!heading.text || heading.text.length === 0) {
      issues.push({
        severity: 'serious',
        element: `h${heading.level}`,
        selector: heading.selector,
        description: 'Heading has no text content',
        wcag: '1.3.1 Info and Relationships',
        recommendation: 'Add descriptive text to the heading or remove it'
      })
    }
  })

  // Check 3: Skipped heading levels
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1].level
    const curr = headings[i].level

    // Only flag when jumping down (h1 → h3)
    if (curr > prev + 1) {
      issues.push({
        severity: 'moderate',
        element: `h${curr}`,
        selector: headings[i].selector,
        description: `Heading level skipped from h${prev} to h${curr}`,
        wcag: '1.3.1 Info and Relationships',
        recommendation: `Use h${prev + 1} before h${curr} to maintain hierarchy`
      })
    }
  }

  // Check 4: Heading used for styling (very long headings)
  headings.forEach(heading => {
    if (heading.text && heading.text.length > 120) {
      issues.push({
        severity: 'minor',
        element: `h${heading.level}`,
        selector: heading.selector,
        description: `Heading text is very long (${heading.text.length} characters)`,
        wcag: '1.3.1 Info and Relationships',
        recommendation: 'Headings should be concise. Consider using a paragraph instead'
      })
    }
  })

  // Calculate passed count
  const totalHeadings = headings.length
  const failed = issues.length
  const passed = Math.max(0, totalHeadings - failed)

  return {
    passed,
    failed,
    issues,
    structure
  }
}
