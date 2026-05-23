// Google PageSpeed Insights API Integration
// Provides real performance data to enhance the simulated audit

import { PAGESPEED_CONFIG } from '../config';

const PAGESPEED_API_URL = PAGESPEED_CONFIG.baseUrl;

/**
 * Fetch PageSpeed Insights data for a URL
 * @param {string} url - The URL to analyze
 * @param {string} strategy - 'mobile' or 'desktop'
 * @param {string} apiKey - Optional Google API key for higher quota
 * @returns {Promise<Object>} PageSpeed data
 */
export const fetchPageSpeedData = async (url, strategy = 'mobile', apiKey = null) => {
  try {
    // Ensure URL has protocol
    const fullURL = url.startsWith('http') ? url : `https://${url}`;

    // Use provided API key or fall back to config
    const keyToUse = apiKey || PAGESPEED_CONFIG.apiKey;

    // Build API URL - note: multiple categories need to be added separately
    const params = new URLSearchParams({
      url: fullURL,
      strategy: strategy
    });

    // Add categories separately (URLSearchParams allows duplicate keys)
    params.append('category', 'performance');
    params.append('category', 'accessibility');
    params.append('category', 'best-practices');
    params.append('category', 'seo');

    if (keyToUse) {
      params.append('key', keyToUse);
      console.log('Using PageSpeed API with authentication');
    } else {
      console.warn('No API key provided - using free tier (limited to 50 requests/day)');
    }

    const response = await fetch(`${PAGESPEED_API_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`PageSpeed API error ${response.status}:`, errorText);
      throw new Error(`PageSpeed API error: ${response.status}`);
    }

    const data = await response.json();
    const parsed = parsePageSpeedData(data);

    // Return null if parsing failed
    if (!parsed) {
      console.warn('Failed to parse PageSpeed data');
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn('PageSpeed API call failed:', error.message);
    return null;
  }
};

/**
 * Parse PageSpeed Insights response into usable format
 */
const parsePageSpeedData = (data) => {
  // Add comprehensive null checks to prevent crashes
  if (!data || !data.lighthouseResult) {
    console.warn('Invalid PageSpeed data structure');
    return null;
  }

  const lighthouse = data.lighthouseResult;
  const categories = lighthouse.categories || {};
  const audits = lighthouse.audits || {};

  // Helper to safely get score
  const getScore = (category) => {
    return category && typeof category.score === 'number'
      ? Math.round(category.score * 100)
      : 0;
  };

  return {
    // Core Web Vitals
    coreWebVitals: {
      lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
      fid: audits['max-potential-fid']?.displayValue || 'N/A',
      cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
      fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
      tti: audits['interactive']?.displayValue || 'N/A',
      tbt: audits['total-blocking-time']?.displayValue || 'N/A',
      si: audits['speed-index']?.displayValue || 'N/A'
    },

    // Category Scores (0-100) with safe access
    scores: {
      performance: getScore(categories.performance),
      accessibility: getScore(categories.accessibility),
      bestPractices: getScore(categories['best-practices']),
      seo: getScore(categories.seo)
    },

    // Performance Metrics
    metrics: {
      firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
      largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
      totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
      cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
      speedIndex: audits['speed-index']?.numericValue || 0
    },

    // Opportunities (performance improvements)
    opportunities: extractOpportunities(audits),

    // Diagnostics (issues found)
    diagnostics: extractDiagnostics(audits),

    // Accessibility issues
    accessibilityIssues: extractAccessibilityIssues(audits),

    // Resource summary
    resources: {
      totalSize: formatBytes(audits['total-byte-weight']?.numericValue || 0),
      requests: audits['network-requests']?.details?.items?.length || 0,
      scripts: audits['bootup-time']?.details?.items?.length || 0,
      images: audits['uses-optimized-images']?.details?.items?.length || 0
    },

    // Raw data for advanced use
    raw: data
  };
};

/**
 * Extract performance opportunities from audits
 */
const extractOpportunities = (audits) => {
  const opportunities = [];

  const opportunityAudits = [
    'uses-optimized-images',
    'modern-image-formats',
    'offscreen-images',
    'render-blocking-resources',
    'unminified-css',
    'unminified-javascript',
    'unused-css-rules',
    'unused-javascript',
    'uses-text-compression',
    'uses-responsive-images',
    'efficient-animated-content',
    'uses-rel-preconnect',
    'font-display',
    'uses-http2',
    'uses-long-cache-ttl'
  ];

  opportunityAudits.forEach(auditId => {
    const audit = audits[auditId];
    if (audit && audit.score !== null && audit.score < 1) {
      opportunities.push({
        id: auditId,
        title: audit.title,
        description: audit.description,
        savings: audit.numericValue || 0,
        score: audit.score
      });
    }
  });

  return opportunities.sort((a, b) => b.savings - a.savings).slice(0, 10);
};

/**
 * Extract diagnostic issues from audits
 */
const extractDiagnostics = (audits) => {
  const diagnostics = [];

  const diagnosticAudits = [
    'mainthread-work-breakdown',
    'bootup-time',
    'uses-passive-event-listeners',
    'no-document-write',
    'long-tasks',
    'non-composited-animations',
    'unsized-images',
    'preload-lcp-image',
    'layout-shift-elements',
    'third-party-summary'
  ];

  diagnosticAudits.forEach(auditId => {
    const audit = audits[auditId];
    if (audit && audit.score !== null && audit.score < 1) {
      diagnostics.push({
        id: auditId,
        title: audit.title,
        description: audit.description,
        value: audit.displayValue || 'N/A'
      });
    }
  });

  return diagnostics.slice(0, 10);
};

/**
 * Extract accessibility issues from audits
 */
const extractAccessibilityIssues = (audits) => {
  const issues = [];

  const a11yAudits = [
    'aria-allowed-attr',
    'aria-required-attr',
    'aria-valid-attr',
    'button-name',
    'color-contrast',
    'document-title',
    'duplicate-id-aria',
    'html-has-lang',
    'image-alt',
    'input-image-alt',
    'label',
    'link-name',
    'meta-viewport',
    'heading-order',
    'tabindex'
  ];

  a11yAudits.forEach(auditId => {
    const audit = audits[auditId];
    if (audit && audit.score !== null && audit.score < 1) {
      issues.push({
        id: auditId,
        title: audit.title,
        description: audit.description,
        impact: audit.score === 0 ? 'high' : 'moderate',
        elements: audit.details?.items?.length || 0
      });
    }
  });

  return issues;
};

/**
 * Convert Core Web Vitals metrics to severity
 */
export const getCoreWebVitalsSeverity = (metrics) => {
  const thresholds = {
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 },
    fcp: { good: 1800, poor: 3000 },
    tti: { good: 3800, poor: 7300 }
  };

  const results = {};

  Object.keys(metrics).forEach(metric => {
    const value = metrics[metric];
    const threshold = thresholds[metric];

    // Fix: Handle 0 as a valid value, only reject null/undefined
    if (!threshold || value === null || value === undefined) {
      results[metric] = 'unknown';
      return;
    }

    if (value <= threshold.good) {
      results[metric] = 'good';
    } else if (value <= threshold.poor) {
      results[metric] = 'needs-improvement';
    } else {
      results[metric] = 'poor';
    }
  });

  return results;
};

/**
 * Format bytes to human-readable size
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Fetch both mobile and desktop data
 */
export const fetchBothStrategies = async (url, apiKey = null) => {
  try {
    const [mobile, desktop] = await Promise.all([
      fetchPageSpeedData(url, 'mobile', apiKey),
      fetchPageSpeedData(url, 'desktop', apiKey)
    ]);

    return { mobile, desktop };
  } catch (error) {
    console.warn('Failed to fetch both strategies:', error);
    return { mobile: null, desktop: null };
  }
};

/**
 * Check if PageSpeed API is available (no API key needed for basic usage)
 */
export const checkPageSpeedAvailability = async () => {
  try {
    const testURL = 'https://example.com';
    const params = new URLSearchParams({
      url: testURL,
      strategy: 'mobile',
      category: 'performance'
    });

    const response = await fetch(`${PAGESPEED_API_URL}?${params}`, {
      method: 'HEAD'
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};
