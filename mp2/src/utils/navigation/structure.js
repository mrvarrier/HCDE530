/**
 * Navigation Structure Analysis
 * Analyzes navigation depth, breadcrumbs, and menu structure
 */

/**
 * Analyze navigation structure
 * @param {CheerioStatic} $ - Cheerio instance
 * @returns {Object} Analysis results
 */
export function analyzeNavigationStructure($) {
  const nav = $('nav').first()
  const issues = []

  if (!nav.length || nav.length === 0) {
    return {
      maxDepth: 0,
      topLevelItems: 0,
      totalNavItems: 0,
      hasBreadcrumbs: false,
      issues: [{
        severity: 'moderate',
        description: 'No <nav> element found on page',
        recommendation: 'Wrap main navigation in a <nav> landmark element for accessibility'
      }]
    }
  }

  // Count nesting levels of lists - check within the nav scope
  let maxDepth = 0
  const listsInNav = nav.find('ul, ol')

  if (listsInNav.length > 0) {
    listsInNav.each((i, elem) => {
      const $elem = $(elem)
      // Count parent lists within the nav element
      const parents = $elem.parentsUntil(nav, 'ul, ol')
      const depth = parents.length + 1
      maxDepth = Math.max(maxDepth, depth)
    })
  }

  // Count top-level navigation items - be more flexible with structure
  let topLevelItems = 0

  // Try different common nav structures
  const directListItems = nav.find('> ul > li, > ol > li')
  const wrappedListItems = nav.find('> div > ul > li, > div > ol > li, > ul:first > li, > ol:first > li')

  if (directListItems.length > 0) {
    topLevelItems = directListItems.length
  } else if (wrappedListItems.length > 0) {
    topLevelItems = wrappedListItems.length
  } else {
    // Fallback: count first-level list items
    const firstList = nav.find('ul, ol').first()
    if (firstList.length > 0) {
      topLevelItems = firstList.children('li').length
    }
  }

  // Count total navigation items
  const totalNavItems = nav.find('li').length

  // Check for breadcrumbs
  const hasBreadcrumbs = $(
    '[aria-label*="breadcrumb" i], ' +
    '[aria-label*="breadcrumbs" i], ' +
    '.breadcrumb, ' +
    '.breadcrumbs, ' +
    'nav.breadcrumbs, ' +
    'nav[aria-label*="breadcrumb" i]'
  ).length > 0

  // Issue 1: Navigation too deep
  if (maxDepth > 2) {
    issues.push({
      severity: 'minor',
      description: `Navigation depth of ${maxDepth} levels may complicate user navigation`,
      recommendation: 'Consider flattening navigation to 2 levels maximum for better usability'
    })
  }

  // Issue 2: Too many top-level items
  if (topLevelItems > 7) {
    issues.push({
      severity: 'minor',
      description: `${topLevelItems} top-level nav items exceeds recommended limit (7±2)`,
      recommendation: 'Consider grouping items or using a mega-menu pattern to reduce cognitive load'
    })
  }

  // Issue 3: Single top-level item (unusual)
  if (topLevelItems === 1) {
    issues.push({
      severity: 'minor',
      description: 'Only one top-level navigation item found',
      recommendation: 'Verify navigation structure is correct; single-item menus are unusual'
    })
  }

  // Issue 4: Empty navigation
  if (totalNavItems === 0) {
    issues.push({
      severity: 'moderate',
      description: 'Navigation element contains no items',
      recommendation: 'Add navigation links or remove empty <nav> element'
    })
  }

  return {
    maxDepth,
    topLevelItems,
    totalNavItems,
    hasBreadcrumbs,
    issues
  }
}
