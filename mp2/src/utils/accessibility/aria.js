/**
 * ARIA Attributes Analysis
 * WCAG 4.1.2 Name, Role, Value
 */

import { getSelector, getText } from '../parser.js'

/**
 * Analyze ARIA attributes
 * @param {CheerioStatic} $ - Cheerio instance
 * @returns {Object} Analysis results
 */
export function analyzeAria($) {
  const issues = []
  let checksPerformed = 0
  let passedCount = 0

  // Check 1: Landmarks without labels
  $('nav, main, aside, section, form').each((i, elem) => {
    checksPerformed++
    const $elem = $(elem)
    const tagName = elem.tagName.toLowerCase()
    const role = $elem.attr('role')
    const ariaLabel = $elem.attr('aria-label')
    const ariaLabelledby = $elem.attr('aria-labelledby')
    const selector = getSelector(elem, $)

    // Count how many of this landmark type exist
    const landmarkCount = $(tagName).length

    // Navigation landmarks should have labels if multiple exist
    if (tagName === 'nav' && landmarkCount > 1 && !ariaLabel && !ariaLabelledby) {
      issues.push({
        severity: 'moderate',
        element: tagName,
        selector,
        description: `Multiple <nav> landmarks found (${landmarkCount}), but this one missing aria-label`,
        wcag: '4.1.2 Name, Role, Value',
        recommendation: 'Add aria-label to distinguish navigation regions (e.g., "Main navigation", "Footer navigation")'
      })
    }
    // Main landmarks should have label if multiple exist
    else if (tagName === 'main' && landmarkCount > 1) {
      issues.push({
        severity: 'serious',
        element: tagName,
        selector,
        description: `Multiple <main> landmarks found (should be only one)`,
        wcag: '4.1.2 Name, Role, Value',
        recommendation: 'Use only one <main> element per page'
      })
    }
    // Regions should have labels
    else if ((tagName === 'section' && role === 'region') || role === 'region') {
      if (!ariaLabel && !ariaLabelledby) {
        issues.push({
          severity: 'moderate',
          element: tagName,
          selector,
          description: 'Region landmark missing aria-label',
          wcag: '4.1.2 Name, Role, Value',
          recommendation: 'Add aria-label to describe the region purpose'
        })
      } else {
        passedCount++
      }
    }
    else {
      passedCount++
    }
  })

  // Check 2: Buttons without accessible names
  $('button, [role="button"]').each((i, elem) => {
    checksPerformed++
    const $button = $(elem)
    const text = getText($button)
    const ariaLabel = $button.attr('aria-label')
    const ariaLabelledby = $button.attr('aria-labelledby')
    const title = $button.attr('title')
    const selector = getSelector(elem, $)

    if (!text && !ariaLabel && !ariaLabelledby && !title) {
      issues.push({
        severity: 'serious',
        element: elem.tagName.toLowerCase(),
        selector,
        description: 'Button has no accessible name',
        wcag: '4.1.2 Name, Role, Value',
        recommendation: 'Add visible text content, aria-label, or aria-labelledby to button'
      })
    } else {
      passedCount++
    }
  })

  // Check 3: Links without accessible names
  $('a[href]').each((i, elem) => {
    checksPerformed++
    const $link = $(elem)
    const text = getText($link)
    const ariaLabel = $link.attr('aria-label')
    const ariaLabelledby = $link.attr('aria-labelledby')
    const title = $link.attr('title')
    const selector = getSelector(elem, $)

    if (!text && !ariaLabel && !ariaLabelledby && !title) {
      issues.push({
        severity: 'serious',
        element: 'a',
        selector,
        description: 'Link has no accessible name',
        wcag: '4.1.2 Name, Role, Value',
        recommendation: 'Add text content, aria-label, or descriptive title to link'
      })
    } else if (text && text.length > 0) {
      // Check for non-descriptive link text
      const nonDescriptive = ['click here', 'here', 'read more', 'more', 'link']
      if (nonDescriptive.includes(text.toLowerCase().trim())) {
        issues.push({
          severity: 'minor',
          element: 'a',
          selector,
          description: `Link text is not descriptive: "${text}"`,
          wcag: '2.4.4 Link Purpose',
          recommendation: 'Use descriptive link text that makes sense out of context'
        })
      } else {
        passedCount++
      }
    } else {
      passedCount++
    }
  })

  // Check 4: Invalid ARIA attributes
  $('[class], [id]').each((i, elem) => {
    const $elem = $(elem)
    const attrs = Object.keys(elem.attribs || {})

    attrs.forEach(attr => {
      if (attr.startsWith('aria-')) {
        checksPerformed++
        const value = $elem.attr(attr)

        // Check for empty ARIA attributes
        if (value === '' || value === undefined) {
          issues.push({
            severity: 'moderate',
            element: elem.tagName.toLowerCase(),
            selector: getSelector(elem, $),
            description: `Empty ARIA attribute: ${attr}`,
            wcag: '4.1.2 Name, Role, Value',
            recommendation: `Remove ${attr} or provide a valid value`
          })
        } else {
          passedCount++
        }
      }
    })
  })

  // Check 5: Tab index issues
  $('[tabindex]').each((i, elem) => {
    checksPerformed++
    const $elem = $(elem)
    const tabindex = parseInt($elem.attr('tabindex'), 10)
    const selector = getSelector(elem, $)

    if (tabindex > 0) {
      issues.push({
        severity: 'moderate',
        element: elem.tagName.toLowerCase(),
        selector,
        description: `Positive tabindex value (${tabindex}) disrupts natural tab order`,
        wcag: '2.4.3 Focus Order',
        recommendation: 'Use tabindex="0" for focusable elements or tabindex="-1" to remove from tab order'
      })
    } else {
      passedCount++
    }
  })

  return {
    passed: passedCount,
    failed: issues.length,
    issues
  }
}
