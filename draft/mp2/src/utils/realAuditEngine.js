/**
 * Real Audit Engine
 * Calls backend APIs to perform actual website scraping and analysis
 */

import { BACKEND_CONFIG, FEATURES } from '../config';
import { fetchPageSpeedData } from './pageSpeedAPI';

/**
 * Main function to run a real audit using backend APIs
 * @param {string} url - The URL to audit
 * @param {function} setProgress - Progress callback function
 * @returns {Promise<Object>} Complete audit results
 */
export async function runRealAudit(url, setProgress = null) {
  const steps = [
    'Preparing browser',
    'Fetching website',
    'Analyzing accessibility',
    'Extracting design system',
    'Mapping navigation structure',
    'Running performance tests',
    'Generating recommendations',
    'Finalizing audit report'
  ];

  let currentStep = 0;

  const updateProgress = (step, message) => {
    if (setProgress) {
      setProgress({
        step,
        message,
        percentage: Math.round((step / steps.length) * 100)
      });
    }
  };

  try {
    // Step 1: Scrape website
    updateProgress(currentStep++, steps[0]);
    updateProgress(currentStep++, steps[1]);

    const scrapeData = await scrapeWebsite(url);

    if (!scrapeData || !scrapeData.html) {
      throw new Error('Failed to fetch website data');
    }

    // Check if website blocked or partially loaded
    const scrapeWarnings = [];
    if (scrapeData.scrapeStatus === 'blocked') {
      scrapeWarnings.push({
        type: 'error',
        message: 'Website is blocking automated access',
        detail: scrapeData.scrapeWarning || 'The website could not be fully scraped due to access restrictions or timeouts.'
      });
    } else if (scrapeData.scrapeStatus === 'partial') {
      scrapeWarnings.push({
        type: 'warning',
        message: 'Website loaded partially',
        detail: 'Some content may not have loaded completely. Results may be incomplete.'
      });
    }

    // Step 2: Run parallel analysis on scraped HTML
    updateProgress(currentStep++, steps[2]);

    const [a11yData, designData, iaData, perfData] = await Promise.all([
      analyzeAccessibility(scrapeData.html, url, scrapeData.computedStyles, scrapeData.accessibilityChecks), // Pass computed styles and a11y checks
      analyzeDesign(scrapeData.html, url, scrapeData.computedStyles), // Pass computed styles
      analyzeIA(scrapeData.html, url),
      FEATURES.pageSpeedAPI ? fetchPageSpeedData(url) : Promise.resolve(null)
    ]);

    // Update progress through remaining steps
    updateProgress(currentStep++, steps[4]);
    updateProgress(currentStep++, steps[5]);
    updateProgress(currentStep++, steps[6]);

    // Step 3: Calculate scores
    const scores = calculateRealScores(a11yData, designData, iaData, perfData);

    // Step 4: Combine findings
    const findings = combineFindings(a11yData, designData, iaData, perfData);

    // Step 5: Generate recommendations
    const recommendations = generateRecommendations(findings, scores);

    updateProgress(currentStep++, steps[7]);

    // Build complete audit object
    const audit = {
      url,
      timestamp: new Date().toISOString(),
      dataSource: 'real', // Mark as real data
      siteType: classifySiteType(url, iaData),
      siteTypeLabel: getSiteTypeLabel(classifySiteType(url, iaData)),

      scores,
      findings,
      recommendations,

      // Real extracted data
      typography: designData?.typography || null,
      colors: designData?.colors || null,
      spacing: designData?.spacing || null,
      ia: iaData || null,

      // PageSpeed data if available (combine with browser metrics)
      pageSpeedData: perfData ? {
        ...perfData,
        browserMetrics: scrapeData.performanceMetrics // Add browser metrics
      } : {
        browserMetrics: scrapeData.performanceMetrics // Only browser metrics if PageSpeed unavailable
      },
      pageSpeedAvailable: !!perfData,
      browserMetricsAvailable: !!scrapeData.performanceMetrics,

      // Scrape warnings (blocking, timeouts, etc.)
      scrapeWarnings: scrapeWarnings.length > 0 ? scrapeWarnings : null,
      scrapeStatus: scrapeData.scrapeStatus,

      // Metadata
      metadata: {
        scrapeTimestamp: scrapeData.timestamp,
        screenshot: scrapeData.screenshot,
        pageTitle: scrapeData.metadata?.title,
        totalImages: scrapeData.metadata?.images,
        totalLinks: scrapeData.metadata?.links,
        coreWebVitals: perfData?.coreWebVitals || null,
        coreWebVitalsSeverity: perfData?.metrics ? getCoreWebVitalsSeverity(perfData.metrics) : null,
        viewportData: scrapeData.viewportData || null // NEW: Multi-viewport testing results
      }
    };

    return audit;

  } catch (error) {
    console.error('Real audit failed:', error);
    throw error;
  }
}

/**
 * Scrape website using backend API
 */
async function scrapeWebsite(url) {
  const endpoint = `${BACKEND_CONFIG.baseUrl}/scrape`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url }),
    signal: AbortSignal.timeout(BACKEND_CONFIG.timeout)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.message || `Scrape failed with status ${response.status}`);
  }

  return await response.json();
}

/**
 * Analyze accessibility using backend API
 */
async function analyzeAccessibility(html, url, computedStyles = null, accessibilityChecks = null) {
  const endpoint = `${BACKEND_CONFIG.baseUrl}/analyze-accessibility`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      html,
      url,
      computedStyles, // Pass computed styles for contrast checking
      accessibilityChecks // Pass focus and touch target data
    }),
    signal: AbortSignal.timeout(BACKEND_CONFIG.timeout)
  });

  if (!response.ok) {
    console.warn('Accessibility analysis failed');
    return null;
  }

  return await response.json();
}

/**
 * Analyze design system using backend API
 */
async function analyzeDesign(html, url, computedStyles = null) {
  const endpoint = `${BACKEND_CONFIG.baseUrl}/analyze-design`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ html, url, computedStyles }), // Pass computed styles
    signal: AbortSignal.timeout(BACKEND_CONFIG.timeout)
  });

  if (!response.ok) {
    console.warn('Design analysis failed');
    return null;
  }

  return await response.json();
}

/**
 * Analyze information architecture using backend API
 */
async function analyzeIA(html, url) {
  const endpoint = `${BACKEND_CONFIG.baseUrl}/analyze-ia`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ html, url }),
    signal: AbortSignal.timeout(BACKEND_CONFIG.timeout)
  });

  if (!response.ok) {
    console.warn('IA analysis failed');
    return null;
  }

  return await response.json();
}

/**
 * Calculate scores based on real data
 */
function calculateRealScores(a11yData, designData, iaData, perfData) {
  // Accessibility score from backend
  const accessibility = a11yData?.score || 50;

  // Design score based on issues
  let design = 100;
  if (designData?.typography?.issues) {
    design -= designData.typography.issues.length * 10;
  }
  if (designData?.colors?.issues) {
    design -= designData.colors.issues.length * 10;
  }
  design = Math.max(0, design);

  // IA score based on issues
  let ia = 100;
  if (iaData?.issues) {
    ia -= iaData.issues.length * 15;
  }
  ia = Math.max(0, ia);

  // Performance score from PageSpeed or default
  const performance = perfData?.scores?.performance || 50;

  // Usability is composite of other scores
  const usability = Math.round((accessibility + design + ia) / 3);

  // Overall score
  const overall = Math.round((accessibility + design + ia + performance + usability) / 5);

  return {
    overall,
    accessibility,
    design,
    ia,
    performance,
    usability
  };
}

/**
 * Combine findings from all analyses
 */
function combineFindings(a11yData, designData, iaData, perfData) {
  const findings = [];

  // Add accessibility findings
  if (a11yData?.findings) {
    findings.push(...a11yData.findings);
  }

  // Add design findings
  if (designData?.typography?.issues) {
    designData.typography.issues.forEach((issue, index) => {
      findings.push({
        id: `typography-${index}`,
        title: 'Typography Issue',
        description: issue,
        category: 'design',
        severity: 'moderate',
        impact: 'moderate'
      });
    });
  }

  if (designData?.colors?.issues) {
    designData.colors.issues.forEach((issue, index) => {
      findings.push({
        id: `color-${index}`,
        title: 'Color System Issue',
        description: issue,
        category: 'design',
        severity: 'moderate',
        impact: 'moderate'
      });
    });
  }

  // Add IA findings
  if (iaData?.issues) {
    iaData.issues.forEach((issue, index) => {
      findings.push({
        id: `ia-${index}`,
        title: 'Navigation Structure Issue',
        description: issue,
        category: 'ia',
        severity: 'moderate',
        impact: 'moderate'
      });
    });
  }

  // Add performance findings from PageSpeed
  if (perfData?.opportunities) {
    perfData.opportunities.slice(0, 5).forEach((opp, index) => {
      findings.push({
        id: `perf-${index}`,
        title: opp.title,
        description: opp.description,
        category: 'performance',
        severity: opp.score < 0.5 ? 'high' : 'moderate',
        impact: 'serious',
        savings: opp.savings
      });
    });
  }

  return findings;
}

/**
 * Generate recommendations based on findings
 */
function generateRecommendations(findings, scores) {
  const recommendations = [];

  // Group by category
  const categories = {
    accessibility: findings.filter(f => f.category === 'accessibility'),
    design: findings.filter(f => f.category === 'design'),
    ia: findings.filter(f => f.category === 'ia'),
    performance: findings.filter(f => f.category === 'performance')
  };

  // Generate category-specific recommendations
  if (categories.accessibility.length > 0) {
    recommendations.push({
      id: 'rec-a11y',
      title: 'Address Accessibility Issues',
      description: `Fix ${categories.accessibility.length} accessibility violations to improve WCAG compliance.`,
      impact: 'high',
      effort: 'medium',
      priority: 1,
      category: 'accessibility'
    });
  }

  if (categories.design.length > 0) {
    recommendations.push({
      id: 'rec-design',
      title: 'Standardize Design System',
      description: 'Consolidate typography and color usage for better visual consistency.',
      impact: 'medium',
      effort: 'medium',
      priority: 2,
      category: 'design'
    });
  }

  if (categories.ia.length > 0) {
    recommendations.push({
      id: 'rec-ia',
      title: 'Optimize Navigation Structure',
      description: 'Simplify information architecture for better discoverability.',
      impact: 'medium',
      effort: 'high',
      priority: 3,
      category: 'ia'
    });
  }

  if (categories.performance.length > 0) {
    recommendations.push({
      id: 'rec-perf',
      title: 'Improve Page Performance',
      description: 'Optimize images, reduce bundle size, and minimize render-blocking resources.',
      impact: 'high',
      effort: 'medium',
      priority: 1,
      category: 'performance'
    });
  }

  // Sort by priority
  return recommendations.sort((a, b) => a.priority - b.priority);
}

/**
 * Classify site type based on URL and IA
 */
function classifySiteType(url, iaData) {
  const urlLower = url.toLowerCase();

  // Check URL patterns
  if (urlLower.includes('shop') || urlLower.includes('store') || urlLower.includes('cart')) {
    return 'ecommerce';
  }

  if (urlLower.includes('blog') || urlLower.includes('article')) {
    return 'blog';
  }

  if (urlLower.includes('docs') || urlLower.includes('documentation')) {
    return 'documentation';
  }

  // Check IA structure
  if (iaData?.structure) {
    const navNames = iaData.structure.map(item => item.name.toLowerCase()).join(' ');

    if (navNames.includes('products') || navNames.includes('shop') || navNames.includes('cart')) {
      return 'ecommerce';
    }

    if (navNames.includes('pricing') || navNames.includes('features') || navNames.includes('login')) {
      return 'saas';
    }

    if (navNames.includes('portfolio') || navNames.includes('projects') || navNames.includes('work')) {
      return 'portfolio';
    }
  }

  return 'marketing';
}

function getSiteTypeLabel(type) {
  const labels = {
    ecommerce: 'E-commerce',
    blog: 'Blog',
    documentation: 'Documentation',
    saas: 'SaaS Application',
    portfolio: 'Portfolio',
    marketing: 'Marketing'
  };
  return labels[type] || 'Website';
}

function getCoreWebVitalsSeverity(metrics) {
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
}
