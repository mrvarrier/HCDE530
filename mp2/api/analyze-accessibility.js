/**
 * Accessibility Analysis Endpoint
 * Runs axe-core accessibility scanner on provided HTML to find WCAG violations
 */

import { load } from 'cheerio';
import axe from 'axe-core';

/**
 * Calculate color contrast ratio between foreground and background colors
 * Based on WCAG 2.1 contrast calculation algorithm
 */
function calculateContrast(fgColor, bgColor) {
  // Parse RGB values from color strings (handles rgb(), rgba(), hex, etc.)
  const parseColor = (color) => {
    if (!color || color === 'transparent') return null;

    // Handle rgba/rgb
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
    }

    // Handle hex colors
    const hexMatch = color.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    if (hexMatch) {
      return [
        parseInt(hexMatch[1], 16),
        parseInt(hexMatch[2], 16),
        parseInt(hexMatch[3], 16)
      ];
    }

    // Handle named colors (basic set)
    const namedColors = {
      white: [255, 255, 255],
      black: [0, 0, 0],
      red: [255, 0, 0],
      green: [0, 128, 0],
      blue: [0, 0, 255]
    };

    return namedColors[color.toLowerCase()] || null;
  };

  const fg = parseColor(fgColor);
  const bg = parseColor(bgColor);

  if (!fg || !bg) return null;

  // Calculate relative luminance for each color
  const getLuminance = (rgb) => {
    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);

  // Calculate contrast ratio
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return ratio;
}

export default async function handler(req, res) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { html, url, computedStyles, accessibilityChecks } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'HTML is required' });
  }

  try {
    console.log(`[A11y] Starting accessibility analysis for: ${url || 'unknown'}`);

    // Load HTML with cheerio for parsing
    const $ = load(html);

    // Extract accessibility-related findings
    const findings = [];
    let score = 100; // Start with perfect score

    // Check 1: Images missing alt text
    const imagesWithoutAlt = $('img:not([alt])').length;
    if (imagesWithoutAlt > 0) {
      findings.push({
        id: 'image-alt',
        title: 'Images missing alt text',
        description: `${imagesWithoutAlt} images do not have alt attributes, making them inaccessible to screen readers.`,
        category: 'accessibility',
        severity: 'high',
        impact: 'critical',
        affectedElements: imagesWithoutAlt,
        wcagCriteria: '1.1.1 Non-text Content',
        recommendation: 'Add descriptive alt text to all images. Decorative images should have empty alt="".'
      });
      score -= Math.min(20, imagesWithoutAlt * 2);
    }

    // Check 2: Form inputs without labels
    const inputsWithoutLabels = $('input:not([type="hidden"]):not([aria-label]):not([aria-labelledby])').filter((i, el) => {
      const $el = $(el);
      const id = $el.attr('id');
      return !id || $(`label[for="${id}"]`).length === 0;
    }).length;

    if (inputsWithoutLabels > 0) {
      findings.push({
        id: 'form-label',
        title: 'Form inputs without labels',
        description: `${inputsWithoutLabels} form inputs lack associated labels, making forms difficult for screen reader users.`,
        category: 'accessibility',
        severity: 'high',
        impact: 'critical',
        affectedElements: inputsWithoutLabels,
        wcagCriteria: '3.3.2 Labels or Instructions',
        recommendation: 'Associate every form input with a descriptive label element using for/id attributes or wrap inputs in label tags.'
      });
      score -= Math.min(15, inputsWithoutLabels * 3);
    }

    // Check 3: Missing language attribute
    const hasLang = $('html').attr('lang');
    if (!hasLang) {
      findings.push({
        id: 'html-lang',
        title: 'HTML language attribute missing',
        description: 'The <html> element lacks a lang attribute, preventing screen readers from using the correct language.',
        category: 'accessibility',
        severity: 'moderate',
        impact: 'serious',
        affectedElements: 1,
        wcagCriteria: '3.1.1 Language of Page',
        recommendation: 'Add lang attribute to <html> element (e.g., <html lang="en">).'
      });
      score -= 10;
    }

    // Check 4: Heading hierarchy
    const headings = [];
    $('h1, h2, h3, h4, h5, h6').each((i, el) => {
      const level = parseInt(el.tagName.substring(1));
      headings.push(level);
    });

    let headingIssues = 0;
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] > headings[i-1] + 1) {
        headingIssues++;
      }
    }

    if (headingIssues > 0) {
      findings.push({
        id: 'heading-order',
        title: 'Heading hierarchy skips levels',
        description: `${headingIssues} heading level jumps detected (e.g., h1 to h3). This creates confusion for screen reader users.`,
        category: 'accessibility',
        severity: 'moderate',
        impact: 'moderate',
        affectedElements: headingIssues,
        wcagCriteria: '1.3.1 Info and Relationships',
        recommendation: 'Use headings in sequential order without skipping levels (h1 → h2 → h3).'
      });
      score -= Math.min(10, headingIssues * 2);
    }

    // Check 5: Multiple h1 elements
    const h1Count = $('h1').length;
    if (h1Count > 1) {
      findings.push({
        id: 'multiple-h1',
        title: 'Multiple h1 headings on page',
        description: `Found ${h1Count} h1 elements. Pages should typically have only one main h1 heading.`,
        category: 'accessibility',
        severity: 'low',
        impact: 'moderate',
        affectedElements: h1Count,
        wcagCriteria: '1.3.1 Info and Relationships',
        recommendation: 'Use only one h1 per page to indicate the main heading. Use h2-h6 for subsections.'
      });
      score -= 5;
    } else if (h1Count === 0) {
      findings.push({
        id: 'missing-h1',
        title: 'No h1 heading found',
        description: 'Page lacks a main h1 heading, which is important for document structure and SEO.',
        category: 'accessibility',
        severity: 'moderate',
        impact: 'moderate',
        affectedElements: 0,
        wcagCriteria: '1.3.1 Info and Relationships',
        recommendation: 'Add a descriptive h1 heading to identify the main content of the page.'
      });
      score -= 8;
    }

    // Check 6: Links without text
    const linksWithoutText = $('a').filter((i, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      const ariaLabel = $el.attr('aria-label');
      const ariaLabelledby = $el.attr('aria-labelledby');
      const title = $el.attr('title');
      return !text && !ariaLabel && !ariaLabelledby && !title;
    }).length;

    if (linksWithoutText > 0) {
      findings.push({
        id: 'link-name',
        title: 'Links without accessible text',
        description: `${linksWithoutText} links lack accessible text or labels, making their purpose unclear to screen readers.`,
        category: 'accessibility',
        severity: 'high',
        impact: 'serious',
        affectedElements: linksWithoutText,
        wcagCriteria: '2.4.4 Link Purpose (In Context)',
        recommendation: 'Ensure all links have descriptive text, aria-label, or title attributes.'
      });
      score -= Math.min(15, linksWithoutText * 2);
    }

    // Check 7: Buttons without text
    const buttonsWithoutText = $('button').filter((i, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      const ariaLabel = $el.attr('aria-label');
      return !text && !ariaLabel;
    }).length;

    if (buttonsWithoutText > 0) {
      findings.push({
        id: 'button-name',
        title: 'Buttons without accessible names',
        description: `${buttonsWithoutText} buttons lack accessible names, making their function unclear.`,
        category: 'accessibility',
        severity: 'high',
        impact: 'serious',
        affectedElements: buttonsWithoutText,
        wcagCriteria: '4.1.2 Name, Role, Value',
        recommendation: 'Add visible text or aria-label to all buttons to describe their action.'
      });
      score -= Math.min(15, buttonsWithoutText * 3);
    }

    // Check 8: Meta viewport for mobile accessibility
    const hasViewport = $('meta[name="viewport"]').length > 0;
    if (!hasViewport) {
      findings.push({
        id: 'meta-viewport',
        title: 'Missing viewport meta tag',
        description: 'Page lacks viewport meta tag, which can cause mobile accessibility issues.',
        category: 'accessibility',
        severity: 'moderate',
        impact: 'serious',
        affectedElements: 0,
        wcagCriteria: '1.4.4 Resize text',
        recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to <head>.'
      });
      score -= 8;
    }

    // Check 9: Color Contrast (NEW - Phase 2)
    // Extract computed styles from the request if available
    const { computedStyles } = req.body;
    const contrastViolations = [];

    if (computedStyles && computedStyles.textElements) {
      // Process text elements with their colors
      computedStyles.textElements.forEach(element => {
        const ratio = calculateContrast(element.color, element.backgroundColor);

        if (ratio !== null) {
          // WCAG AA requires:
          // - 4.5:1 for normal text (< 18pt or < 14pt bold)
          // - 3:1 for large text (>= 18pt or >= 14pt bold)
          const isLargeText = element.fontSize >= 18 || (element.fontSize >= 14 && element.fontWeight >= 700);
          const requiredRatio = isLargeText ? 3.0 : 4.5;

          if (ratio < requiredRatio) {
            contrastViolations.push({
              element: element.selector,
              text: element.text?.substring(0, 50) + (element.text?.length > 50 ? '...' : ''),
              color: element.color,
              backgroundColor: element.backgroundColor,
              ratio: ratio.toFixed(2),
              required: requiredRatio,
              fontSize: element.fontSize,
              isLargeText
            });
          }
        }
      });
    }

    if (contrastViolations.length > 0) {
      findings.push({
        id: 'color-contrast',
        title: 'Color contrast violations',
        description: `${contrastViolations.length} text elements have insufficient color contrast, making them difficult to read for users with low vision.`,
        category: 'accessibility',
        severity: 'high',
        impact: 'critical',
        affectedElements: contrastViolations.length,
        wcagCriteria: '1.4.3 Contrast (Minimum)',
        recommendation: 'Increase contrast between text and background colors. Normal text requires 4.5:1, large text requires 3:1.',
        violations: contrastViolations.slice(0, 10) // Limit to first 10 for performance
      });
      score -= Math.min(20, contrastViolations.length * 2);
    }

    // Check 10: ARIA role validation (NEW - Phase 2)
    const validARIARoles = [
      'alert', 'alertdialog', 'application', 'article', 'banner', 'button', 'cell', 'checkbox',
      'columnheader', 'combobox', 'complementary', 'contentinfo', 'definition', 'dialog',
      'directory', 'document', 'feed', 'figure', 'form', 'grid', 'gridcell', 'group',
      'heading', 'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 'marquee',
      'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'navigation',
      'none', 'note', 'option', 'presentation', 'progressbar', 'radio', 'radiogroup', 'region',
      'row', 'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'separator', 'slider',
      'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term', 'textbox',
      'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem'
    ];

    const invalidARIA = $('[role]').filter((i, el) => {
      const role = $(el).attr('role');
      return role && !validARIARoles.includes(role.toLowerCase());
    }).length;

    if (invalidARIA > 0) {
      findings.push({
        id: 'invalid-aria',
        title: 'Invalid ARIA roles detected',
        description: `${invalidARIA} elements have invalid or unrecognized ARIA roles.`,
        category: 'accessibility',
        severity: 'moderate',
        impact: 'moderate',
        affectedElements: invalidARIA,
        wcagCriteria: '4.1.2 Name, Role, Value',
        recommendation: 'Use only valid ARIA roles from the ARIA specification. Check MDN or W3C documentation for valid roles.'
      });
      score -= Math.min(10, invalidARIA * 2);
    }

    // Check 11: Landmark regions (NEW - Phase 2)
    const hasMain = $('main, [role="main"]').length > 0;
    const hasNav = $('nav, [role="navigation"]').length > 0;
    const hasHeader = $('header, [role="banner"]').length > 0;
    const hasFooter = $('footer, [role="contentinfo"]').length > 0;

    const missingLandmarks = [];
    if (!hasMain) missingLandmarks.push('main');
    if (!hasNav) missingLandmarks.push('navigation');
    if (!hasHeader) missingLandmarks.push('header/banner');
    if (!hasFooter) missingLandmarks.push('footer/contentinfo');

    if (missingLandmarks.length > 0) {
      findings.push({
        id: 'missing-landmarks',
        title: 'Missing landmark regions',
        description: `Missing ${missingLandmarks.join(', ')} landmark regions. Landmarks help screen reader users navigate the page.`,
        category: 'accessibility',
        severity: 'moderate',
        impact: 'moderate',
        affectedElements: missingLandmarks.length,
        wcagCriteria: '1.3.1 Info and Relationships',
        recommendation: `Add semantic HTML5 landmarks: <main>, <nav>, <header>, <footer>, or use ARIA roles.`
      });
      score -= missingLandmarks.length * 3;
    }

    // Check 12: Skip links (NEW - Phase 2)
    const skipLinks = $('a[href^="#"]').filter((i, el) => {
      const text = $(el).text().toLowerCase();
      return text.includes('skip') && (text.includes('content') || text.includes('main') || text.includes('navigation'));
    }).length;

    if (skipLinks === 0) {
      findings.push({
        id: 'missing-skip-link',
        title: 'No skip navigation link found',
        description: 'Skip links allow keyboard users to bypass repetitive navigation and jump to main content.',
        category: 'accessibility',
        severity: 'moderate',
        impact: 'moderate',
        affectedElements: 0,
        wcagCriteria: '2.4.1 Bypass Blocks',
        recommendation: 'Add a skip link at the top of the page: <a href="#main-content">Skip to main content</a>'
      });
      score -= 5;
    }

    // Check 13: Focus indicators (NEW - Phase 2 - from browser checks)
    if (accessibilityChecks?.focusableWithoutIndicators > 0) {
      findings.push({
        id: 'missing-focus-indicators',
        title: 'Focusable elements without visible focus indicators',
        description: `${accessibilityChecks.focusableWithoutIndicators} interactive elements lack visible focus indicators, making keyboard navigation difficult.`,
        category: 'accessibility',
        severity: 'high',
        impact: 'serious',
        affectedElements: accessibilityChecks.focusableWithoutIndicators,
        wcagCriteria: '2.4.7 Focus Visible',
        recommendation: 'Add visible focus styles to all interactive elements using CSS :focus pseudo-class. Ensure outline or box-shadow is visible.'
      });
      score -= Math.min(15, accessibilityChecks.focusableWithoutIndicators * 2);
    }

    // Check 14: Touch target sizes (NEW - Phase 2 - from browser checks)
    if (accessibilityChecks?.smallTouchTargets > 0) {
      findings.push({
        id: 'small-touch-targets',
        title: 'Touch targets smaller than recommended size',
        description: `${accessibilityChecks.smallTouchTargets} interactive elements are smaller than 44x44px, making them difficult to tap on mobile devices.`,
        category: 'accessibility',
        severity: 'moderate',
        impact: 'moderate',
        affectedElements: accessibilityChecks.smallTouchTargets,
        wcagCriteria: '2.5.5 Target Size',
        recommendation: 'Ensure all interactive elements are at least 44x44 pixels for easier touch interaction.',
        violations: accessibilityChecks.touchTargetIssues || []
      });
      score -= Math.min(10, accessibilityChecks.smallTouchTargets);
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    console.log(`[A11y] Analysis complete. Score: ${score}, Findings: ${findings.length}`);

    return res.status(200).json({
      score,
      findings,
      summary: {
        totalIssues: findings.length,
        critical: findings.filter(f => f.impact === 'critical').length,
        serious: findings.filter(f => f.impact === 'serious').length,
        moderate: findings.filter(f => f.impact === 'moderate').length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[A11y] Error analyzing accessibility:`, error.message);

    return res.status(500).json({
      error: 'Failed to analyze accessibility',
      message: error.message
    });
  }
}
