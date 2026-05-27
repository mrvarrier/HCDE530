/**
 * Link Analysis
 * Analyzes link structure, types, and potential issues
 */

import { getSelector, getText } from '../parser.js'

/**
 * Analyze links on the page
 * @param {CheerioStatic} $ - Cheerio instance
 * @returns {Object} Analysis results
 */
export function analyzeLinks($) {
  const links = []
  const issues = []
  let internalLinks = 0
  let externalLinks = 0
  let anchorLinks = 0
  let emptyHrefs = 0

  $('a').each((i, elem) => {
    const $link = $(elem)
    const href = $link.attr('href')
    const text = getText($link)
    const target = $link.attr('target')
    const selector = getSelector(elem, $)

    if (!href) {
      // Link with no href attribute
      issues.push({
        severity: 'moderate',
        element: 'a',
        selector,
        description: 'Link without href attribute',
        recommendation: 'Add href attribute or use <button> for interactive elements'
      })
      return
    }

    // Classify link type
    const isAnchor = href.startsWith('#')
    const isMailto = href.startsWith('mailto:')
    const isTel = href.startsWith('tel:')
    const isExternal = /^https?:\/\//.test(href)
    const isEmpty = !href || href === '#' || href === '#!'
    const isInternal = !isExternal && !isAnchor && !isMailto && !isTel && !isEmpty

    // Count categories
    if (isAnchor) anchorLinks++
    else if (isInternal) internalLinks++
    else if (isExternal) externalLinks++

    if (isEmpty) {
      emptyHrefs++
      issues.push({
        severity: 'moderate',
        element: 'a',
        selector,
        description: 'Link with empty or placeholder href',
        recommendation: 'Remove link or add valid href destination'
      })
    }

    // Check for new window without warning
    if (target === '_blank') {
      const hasWarning = text.toLowerCase().includes('new window') ||
                        text.toLowerCase().includes('new tab') ||
                        text.toLowerCase().includes('opens in') ||
                        $link.attr('aria-label')?.toLowerCase().includes('new window')

      if (!hasWarning) {
        issues.push({
          severity: 'minor',
          element: 'a',
          selector,
          description: 'Link opens in new window without warning text',
          recommendation: 'Add text like "(opens in new window)" for screen reader users'
        })
      }

      // Check for security attributes
      const rel = $link.attr('rel') || ''
      if (isExternal && !rel.includes('noopener')) {
        issues.push({
          severity: 'moderate',
          element: 'a',
          selector,
          description: 'External link with target="_blank" missing rel="noopener"',
          recommendation: 'Add rel="noopener noreferrer" for security'
        })
      }
    }

    // Check for broken hash links (anchor links to non-existent IDs)
    if (isAnchor && href !== '#') {
      const targetId = href.substring(1)
      const targetExists = $(`#${targetId}, [name="${targetId}"]`).length > 0

      if (!targetExists) {
        issues.push({
          severity: 'moderate',
          element: 'a',
          selector,
          description: `Anchor link points to non-existent ID: "${targetId}"`,
          recommendation: `Add element with id="${targetId}" or fix the href`
        })
      }
    }

    links.push({
      href,
      text,
      isAnchor,
      isExternal,
      isInternal,
      isMailto,
      isTel,
      isEmpty
    })
  })

  return {
    totalLinks: links.length,
    internalLinks,
    externalLinks,
    anchorLinks,
    emptyHrefs,
    issues
  }
}
