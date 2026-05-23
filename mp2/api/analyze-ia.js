/**
 * Information Architecture Analysis Endpoint
 * Extracts real navigation structure and site hierarchy
 */

import { load } from 'cheerio';

export default async function handler(req, res) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { html, url } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'HTML is required' });
  }

  try {
    console.log(`[IA] Starting IA analysis for: ${url || 'unknown'}`);

    // Load HTML with cheerio
    const $ = load(html);

    // Extract navigation structure
    const navigation = extractNavigation($, url);

    // Analyze navigation depth and breadth
    const analysis = analyzeNavigationStructure(navigation);

    console.log(`[IA] Analysis complete. Pages: ${analysis.totalPages}, Depth: ${analysis.depth}`);

    return res.status(200).json({
      structure: navigation,
      depth: analysis.depth,
      totalPages: analysis.totalPages,
      issues: analysis.issues,
      recommendations: analysis.recommendations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[IA] Error analyzing IA:`, error.message);

    return res.status(500).json({
      error: 'Failed to analyze information architecture',
      message: error.message
    });
  }
}

/**
 * Extract navigation structure from HTML
 */
function extractNavigation($, baseUrl) {
  const structure = [];

  // Helper to clean URLs
  const cleanUrl = (href) => {
    if (!href) return null;
    href = href.trim();

    // Skip anchors, javascript, mailto, tel
    if (href.startsWith('#') || href.startsWith('javascript:') ||
        href.startsWith('mailto:') || href.startsWith('tel:')) {
      return null;
    }

    return href;
  };

  // Helper to extract link text
  const getLinkText = (element) => {
    let text = $(element).text().trim();
    if (!text) {
      // Try aria-label
      text = $(element).attr('aria-label') || '';
    }
    return text || 'Untitled Link';
  };

  // Find all navigation elements
  const navElements = $('nav, [role="navigation"], header nav, .nav, .navigation, .menu');

  if (navElements.length === 0) {
    // Fallback: look for header links
    const headerLinks = $('header a, .header a');
    if (headerLinks.length > 0) {
      headerLinks.each((i, el) => {
        const href = cleanUrl($(el).attr('href'));
        const text = getLinkText(el);

        if (href && text) {
          structure.push({
            name: text,
            url: href,
            depth: 0,
            children: []
          });
        }
      });
    }
  } else {
    // Extract from proper nav elements
    navElements.each((i, navEl) => {
      const $nav = $(navEl);

      // Look for lists (most common pattern)
      const lists = $nav.find('ul, ol').first();

      if (lists.length > 0) {
        // Extract hierarchical structure
        const extracted = extractList($, lists.first(), 0);
        structure.push(...extracted);
      } else {
        // Extract flat links
        $nav.find('a').each((j, el) => {
          const href = cleanUrl($(el).attr('href'));
          const text = getLinkText(el);

          if (href && text) {
            structure.push({
              name: text,
              url: href,
              depth: 0,
              children: []
            });
          }
        });
      }
    });
  }

  // Deduplicate structure
  const seen = new Set();
  const uniqueStructure = structure.filter(item => {
    const key = `${item.name}-${item.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return uniqueStructure.length > 0 ? uniqueStructure : generateFallbackStructure($);
}

/**
 * Recursively extract list structure
 */
function extractList($, listEl, depth) {
  const items = [];

  $(listEl).children('li').each((i, li) => {
    const $li = $(li);
    const link = $li.children('a').first();

    if (link.length > 0) {
      const href = $(link).attr('href');
      const text = $(link).text().trim() || 'Untitled';

      const item = {
        name: text,
        url: href || '#',
        depth: depth,
        children: []
      };

      // Check for nested lists
      const nestedList = $li.children('ul, ol').first();
      if (nestedList.length > 0) {
        item.children = extractList($, nestedList, depth + 1);
      }

      items.push(item);
    }
  });

  return items;
}

/**
 * Generate fallback structure when no nav found
 */
function generateFallbackStructure($) {
  const structure = [];

  // Try to find common page sections
  const commonPages = [
    { selector: 'a[href*="about"]', name: 'About' },
    { selector: 'a[href*="contact"]', name: 'Contact' },
    { selector: 'a[href*="product"]', name: 'Products' },
    { selector: 'a[href*="service"]', name: 'Services' },
    { selector: 'a[href*="blog"]', name: 'Blog' },
    { selector: 'a[href="/"]', name: 'Home' }
  ];

  commonPages.forEach(({ selector, name }) => {
    const link = $(selector).first();
    if (link.length > 0) {
      structure.push({
        name,
        url: link.attr('href') || '#',
        depth: 0,
        children: []
      });
    }
  });

  if (structure.length === 0) {
    // Absolute fallback - count all links
    const allLinks = $('a[href]');
    structure.push({
      name: 'Links detected',
      url: '#',
      depth: 0,
      children: [],
      note: `${allLinks.length} total links found but no clear navigation structure`
    });
  }

  return structure;
}

/**
 * Analyze navigation structure for issues
 */
function analyzeNavigationStructure(structure) {
  const issues = [];
  const recommendations = [];

  // Calculate max depth
  const getMaxDepth = (items) => {
    if (!items || items.length === 0) return 0;
    return 1 + Math.max(...items.map(item =>
      item.children ? getMaxDepth(item.children) : 0
    ));
  };

  // Count total pages
  const countPages = (items) => {
    if (!items || items.length === 0) return 0;
    return items.length + items.reduce((sum, item) =>
      sum + (item.children ? countPages(item.children) : 0), 0
    );
  };

  // Get breadth at each level
  const getBreadth = (items, level = 0, breadths = {}) => {
    if (!items || items.length === 0) return breadths;

    breadths[level] = (breadths[level] || 0) + items.length;

    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        getBreadth(item.children, level + 1, breadths);
      }
    });

    return breadths;
  };

  const depth = getMaxDepth(structure);
  const totalPages = countPages(structure);
  const breadths = getBreadth(structure);
  const maxBreadth = Math.max(...Object.values(breadths), 0);

  // Generate issues based on analysis
  if (depth > 4) {
    issues.push(`Navigation hierarchy is ${depth} levels deep. Users may have difficulty finding content buried this deep.`);
    recommendations.push('Flatten navigation structure to 3 levels maximum for better usability.');
  }

  if (depth === 1 && totalPages > 10) {
    issues.push(`Flat navigation with ${totalPages} items. Consider grouping related pages into categories.`);
    recommendations.push('Group related pages under parent categories to improve scannability.');
  }

  if (maxBreadth > 9) {
    issues.push(`Some navigation levels have ${maxBreadth} items. Research shows 7±2 items is optimal for scanability.`);
    recommendations.push('Limit each navigation level to 7-9 items maximum.');
  }

  if (totalPages < 3) {
    issues.push('Very limited navigation structure detected. Ensure all major site sections are accessible.');
    recommendations.push('Add clear navigation to all important site sections.');
  }

  // Check for common usability patterns
  if (!structure.some(item => item.name.toLowerCase().includes('home'))) {
    issues.push('No clear "Home" link found in main navigation.');
    recommendations.push('Include a clear way to return to the homepage from all pages.');
  }

  if (totalPages > 15 && depth === 1) {
    recommendations.push('Consider implementing a mega menu or dropdown navigation for better organization.');
  }

  return {
    depth,
    totalPages,
    maxBreadth,
    breadths,
    issues,
    recommendations
  };
}
