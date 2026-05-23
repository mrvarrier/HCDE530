/**
 * Accessibility Analysis Endpoint
 * Runs axe-core accessibility scanner on provided HTML to find WCAG violations
 */

import { load } from 'cheerio';
import axe from 'axe-core';

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
