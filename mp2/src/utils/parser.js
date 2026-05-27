/**
 * Cheerio HTML parsing utilities
 * Helper functions for generating CSS selectors and DOM traversal
 */

/**
 * Generate a CSS selector for an element
 * @param {CheerioElement} elem - Cheerio element
 * @returns {string} CSS selector
 */
export function getSelector(elem, $) {
  if (!elem || !$) return ''

  const $elem = $(elem)
  const parts = []

  // Build selector from bottom up
  let current = $elem
  while (current.length && current[0].tagName !== 'html') {
    const tag = current[0].tagName || ''
    const id = current.attr('id')
    const classes = current.attr('class')

    if (id) {
      parts.unshift(`#${id}`)
      break // ID is unique, stop here
    }

    let selector = tag
    if (classes) {
      const classList = classes.trim().split(/\s+/).slice(0, 2) // Max 2 classes
      selector += '.' + classList.join('.')
    }

    // Add nth-child for specificity if no ID
    const parent = current.parent()
    if (parent.length) {
      const siblings = parent.children(tag)
      if (siblings.length > 1) {
        const index = siblings.index(current[0]) + 1
        selector += `:nth-child(${index})`
      }
    }

    parts.unshift(selector)
    current = parent
  }

  return parts.join(' > ').substring(0, 150) // Limit length
}

/**
 * Get text content safely
 * @param {CheerioElement} elem - Cheerio element
 * @returns {string} Trimmed text content
 */
export function getText($elem) {
  if (!$elem || !$elem.text) return ''
  return $elem.text().trim()
}

/**
 * Check if element is visible (heuristic based on attributes)
 * @param {CheerioElement} $elem - Cheerio element
 * @returns {boolean} True if likely visible
 */
export function isVisible($elem) {
  if (!$elem) return false

  const style = $elem.attr('style') || ''
  const className = $elem.attr('class') || ''

  // Check for common hiding patterns
  const hiddenPatterns = [
    /display\s*:\s*none/i,
    /visibility\s*:\s*hidden/i,
    /opacity\s*:\s*0/i,
    /hidden/i
  ]

  const isHidden = hiddenPatterns.some(pattern =>
    pattern.test(style) || pattern.test(className)
  )

  return !isHidden
}

/**
 * Extract color from style attribute or class
 * @param {CheerioElement} $elem - Cheerio element
 * @param {string} property - CSS property ('color' or 'background-color')
 * @returns {string|null} Color value or null
 */
export function getColor($elem, property, $) {
  if (!$elem) return null

  // Check inline style first
  const style = $elem.attr('style') || ''
  const regex = new RegExp(`${property}\\s*:\\s*([^;]+)`, 'i')
  const match = style.match(regex)
  if (match) {
    return match[1].trim()
  }

  // Check for common Tailwind classes
  const className = $elem.attr('class') || ''

  if (property === 'color') {
    // Match text-color-shade patterns
    const textMatch = className.match(/text-(gray|red|blue|green|yellow|purple|pink|indigo)(-\d{2,3})?/)
    if (textMatch) {
      return getTailwindColor(textMatch[0])
    }
  }

  if (property === 'background-color' || property === 'backgroundColor') {
    // Match bg-color-shade patterns
    const bgMatch = className.match(/bg-(gray|red|blue|green|yellow|purple|pink|indigo|white|black)(-\d{2,3})?/)
    if (bgMatch) {
      return getTailwindColor(bgMatch[0])
    }
  }

  return null
}

/**
 * Get Tailwind color value approximations
 * @param {string} className - Tailwind class name
 * @returns {string} Hex color approximation
 */
function getTailwindColor(className) {
  // Simplified Tailwind color mappings
  const colors = {
    // Grays
    'text-gray-50': '#F9FAFB',
    'text-gray-100': '#F3F4F6',
    'text-gray-200': '#E5E7EB',
    'text-gray-300': '#D1D5DB',
    'text-gray-400': '#9CA3AF',
    'text-gray-500': '#6B7280',
    'text-gray-600': '#4B5563',
    'text-gray-700': '#374151',
    'text-gray-800': '#1F2937',
    'text-gray-900': '#111827',

    // Backgrounds
    'bg-white': '#FFFFFF',
    'bg-black': '#000000',
    'bg-gray-50': '#F9FAFB',
    'bg-gray-100': '#F3F4F6',
    'bg-gray-200': '#E5E7EB',
    'bg-gray-300': '#D1D5DB',
    'bg-gray-400': '#9CA3AF',
    'bg-gray-500': '#6B7280',
    'bg-gray-600': '#4B5563',
    'bg-gray-700': '#374151',
    'bg-gray-800': '#1F2937',
    'bg-gray-900': '#111827',

    // Common colors
    'text-blue-500': '#3B82F6',
    'text-blue-600': '#2563EB',
    'text-red-500': '#EF4444',
    'text-red-600': '#DC2626',
    'bg-blue-500': '#3B82F6',
    'bg-red-500': '#EF4444',
  }

  return colors[className] || null
}

/**
 * Walk up DOM to find background color
 * @param {CheerioElement} $elem - Cheerio element
 * @param {CheerioStatic} $ - Cheerio instance
 * @returns {string} Background color (defaults to white)
 */
export function getBackgroundColor($elem, $) {
  if (!$elem || !$) return '#FFFFFF'

  let current = $elem
  let depth = 0
  const maxDepth = 10 // Prevent infinite loops

  while (current.length && depth < maxDepth) {
    const bgColor = getColor(current, 'background-color', $) ||
                    getColor(current, 'backgroundColor', $)

    if (bgColor && !isTransparent(bgColor)) {
      return bgColor
    }

    current = current.parent()
    depth++
  }

  return '#FFFFFF' // Default to white background
}

/**
 * Check if color is transparent
 * @param {string} color - Color value
 * @returns {boolean} True if transparent
 */
function isTransparent(color) {
  if (!color) return true
  const lower = color.toLowerCase()
  return lower === 'transparent' ||
         lower === 'rgba(0,0,0,0)' ||
         lower === 'rgba(0, 0, 0, 0)' ||
         lower.includes('rgba') && lower.includes(', 0)')
}

/**
 * Get font size from element (for contrast ratio requirements)
 * @param {CheerioElement} $elem - Cheerio element
 * @returns {number} Font size in pixels (default 16)
 */
export function getFontSize($elem) {
  if (!$elem) return 16

  const style = $elem.attr('style') || ''
  const match = style.match(/font-size\s*:\s*(\d+)px/i)
  if (match) {
    return parseInt(match[1], 10)
  }

  // Check tag name for heading sizes
  const tag = $elem[0]?.tagName
  const headingSizes = {
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    h5: 16,
    h6: 14
  }

  return headingSizes[tag] || 16
}

/**
 * Check if font is bold
 * @param {CheerioElement} $elem - Cheerio element
 * @returns {boolean} True if bold
 */
export function isBold($elem) {
  if (!$elem) return false

  const tag = $elem[0]?.tagName
  if (['b', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
    return true
  }

  const style = $elem.attr('style') || ''
  if (/font-weight\s*:\s*(bold|[6-9]00)/i.test(style)) {
    return true
  }

  const className = $elem.attr('class') || ''
  if (/font-(bold|semibold|extrabold|black)/.test(className)) {
    return true
  }

  return false
}
