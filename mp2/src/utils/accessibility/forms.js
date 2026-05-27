/**
 * Form Accessibility Analysis
 * WCAG 3.3.2 Labels or Instructions
 * WCAG 1.3.1 Info and Relationships
 */

import { getSelector, getText } from '../parser.js'

/**
 * Analyze form accessibility
 * @param {CheerioStatic} $ - Cheerio instance
 * @returns {Object} Analysis results
 */
export function analyzeForms($) {
  const issues = []
  let totalFormElements = 0
  let passedCount = 0

  // Check inputs, textareas, and selects
  $('input, textarea, select').each((i, elem) => {
    const $input = $(elem)
    const type = $input.attr('type') || 'text'
    const id = $input.attr('id')
    const name = $input.attr('name')
    const placeholder = $input.attr('placeholder')
    const ariaLabel = $input.attr('aria-label')
    const ariaLabelledby = $input.attr('aria-labelledby')
    const selector = getSelector(elem, $)
    const tagName = (elem.tagName || elem.name || '').toLowerCase()

    // Skip hidden and submit buttons
    if (type === 'hidden' || type === 'submit' || type === 'button') {
      return
    }

    totalFormElements++
    let hasIssue = false

    // Find associated label
    const hasLabel = id && $(`label[for="${id}"]`).length > 0
    const hasAriaLabel = ariaLabel || ariaLabelledby
    const hasTitle = $input.attr('title')

    // Check 1: No label at all
    if (!hasLabel && !hasAriaLabel && !hasTitle) {
      issues.push({
        severity: 'serious',
        element: tagName,
        selector,
        id: id || name || '(no id)',
        description: 'Input field has no associated label',
        wcag: '3.3.2 Labels or Instructions',
        recommendation: `Add <label for="${id || 'input-id'}"> or aria-label attribute`
      })
      hasIssue = true
    }

    // Check 2: Placeholder-only label (anti-pattern)
    if (placeholder && !hasLabel && !hasAriaLabel) {
      issues.push({
        severity: 'moderate',
        element: tagName,
        selector,
        description: 'Using placeholder as label (not accessible)',
        wcag: '3.3.2 Labels or Instructions',
        recommendation: 'Add a visible <label> element; placeholders disappear when typing'
      })
      hasIssue = true
    }

    // Check 3: Required field without indication
    if ($input.attr('required') !== undefined) {
      const label = id ? $(`label[for="${id}"]`) : null
      const labelText = label ? getText(label) : ariaLabel || ''

      if (!labelText.includes('*') && !labelText.includes('required') &&
          !ariaLabel?.includes('required') && !$input.attr('aria-required')) {
        issues.push({
          severity: 'minor',
          element: tagName,
          selector,
          description: 'Required field without clear indication in label',
          wcag: '3.3.2 Labels or Instructions',
          recommendation: 'Add asterisk (*) or "required" text to label, or aria-required="true"'
        })
        hasIssue = true
      }
    }

    if (!hasIssue) {
      passedCount++
    }
  })

  // Check radio/checkbox groups for fieldset/legend
  $('input[type="radio"], input[type="checkbox"]').each((i, elem) => {
    const $input = $(elem)
    const name = $input.attr('name')

    if (!name) return

    // Check if part of a group (multiple elements with same name)
    const groupSize = $(`input[name="${name}"]`).length

    if (groupSize > 1) {
      // Check if inside a fieldset
      const $fieldset = $input.closest('fieldset')
      if ($fieldset.length === 0) {
        // Only add issue once per group
        if (i === 0 || $(`input[name="${name}"]`).index(elem) === 0) {
          issues.push({
            severity: 'moderate',
            element: 'fieldset',
            description: `${groupSize} ${$input.attr('type')} inputs with name="${name}" not grouped in <fieldset>`,
            wcag: '1.3.1 Info and Relationships',
            recommendation: 'Wrap related radio/checkbox groups in <fieldset> with <legend>'
          })
        }
      } else if ($fieldset.find('legend').length === 0) {
        // Has fieldset but no legend
        if (i === 0 || $(`input[name="${name}"]`).index(elem) === 0) {
          issues.push({
            severity: 'moderate',
            element: 'legend',
            description: `<fieldset> for ${$input.attr('type')} group missing <legend>`,
            wcag: '1.3.1 Info and Relationships',
            recommendation: 'Add <legend> element to describe the group'
          })
        }
      }
    }
  })

  return {
    passed: passedCount,
    failed: issues.length,
    issues
  }
}
