import { generateAudit, runAudit as runSimulatedAudit } from './auditEngine';
import { fetchPageSpeedData, getCoreWebVitalsSeverity } from './pageSpeedAPI';
import { runRealAudit } from './realAuditEngine';
import { FEATURES } from '../config';

/**
 * Enhanced audit that integrates real web scraping or PageSpeed data
 * Falls back to simulated data if real scraping unavailable or fails
 */
export const runEnhancedAudit = async (url, onProgress, usePageSpeed = true) => {
  // If real scraping is enabled, use it
  if (FEATURES.realScraping) {
    try {
      console.log('[Enhanced Audit] Using real web scraping');
      const realAudit = await runRealAudit(url, onProgress);
      return realAudit;
    } catch (error) {
      console.error('[Enhanced Audit] Real scraping failed, falling back to simulation:', error);
      // Fall through to simulated audit
    }
  }
  let pageSpeedData = null;

  // Try to fetch PageSpeed data if enabled
  if (usePageSpeed) {
    try {
      if (onProgress) {
        onProgress({
          step: 0,
          total: 9,
          message: 'Fetching real performance data...',
          progress: 0
        });
      }

      // Fetch PageSpeed data (mobile by default)
      pageSpeedData = await fetchPageSpeedData(url, 'mobile');

      if (onProgress && pageSpeedData) {
        onProgress({
          step: 1,
          total: 9,
          message: 'Performance data received!',
          progress: 11
        });
      }

      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.warn('PageSpeed fetch failed, using simulation:', error);
      pageSpeedData = null;
    }
  }

  // Run the simulated audit with adjusted progress
  const adjustProgress = (progress) => {
    if (onProgress) {
      onProgress({
        ...progress,
        step: progress.step + (usePageSpeed ? 1 : 0),
        total: usePageSpeed ? 9 : 8,
        progress: usePageSpeed ? 11 + (progress.progress * 0.89) : progress.progress
      });
    }
  };

  // Get simulated audit
  const simulatedAudit = await runSimulatedAudit(url, adjustProgress);

  // If we have PageSpeed data, enhance the audit
  if (pageSpeedData) {
    return enhanceAuditWithPageSpeed(simulatedAudit, pageSpeedData);
  }

  // Return simulated audit with flag
  return {
    ...simulatedAudit,
    dataSource: 'simulated',
    pageSpeedAvailable: false
  };
};

/**
 * Enhance simulated audit with real PageSpeed Insights data
 */
const enhanceAuditWithPageSpeed = (simulatedAudit, pageSpeedData) => {
  // Update performance score with real data
  const enhancedScores = {
    ...simulatedAudit.scores,
    performance: pageSpeedData.scores.performance,
    accessibility: Math.round((simulatedAudit.scores.accessibility + pageSpeedData.scores.accessibility) / 2)
  };

  // Recalculate overall score
  enhancedScores.overall = Math.round(
    (enhancedScores.accessibility * 0.25) +
    (enhancedScores.design * 0.20) +
    (enhancedScores.ia * 0.20) +
    (enhancedScores.performance * 0.20) +
    (enhancedScores.usability * 0.15)
  );

  // Add real performance findings
  const realPerformanceFindings = convertPageSpeedToFindings(pageSpeedData);

  // Merge with simulated findings, prioritizing real data for performance category
  const enhancedFindings = [
    ...simulatedAudit.findings.filter(f => f.category !== 'performance'),
    ...realPerformanceFindings
  ];

  // Update metadata with real metrics
  const enhancedMetadata = {
    ...simulatedAudit.metadata,
    pageSize: pageSpeedData.resources.totalSize,
    requestCount: pageSpeedData.resources.requests,
    // Keep simulated domSize as PageSpeed doesn't provide this
    realPerformanceData: true,
    coreWebVitals: pageSpeedData.coreWebVitals,
    coreWebVitalsSeverity: getCoreWebVitalsSeverity(pageSpeedData.metrics)
  };

  return {
    ...simulatedAudit,
    scores: enhancedScores,
    findings: enhancedFindings,
    metadata: enhancedMetadata,
    pageSpeedData,
    dataSource: 'hybrid', // Mix of real and simulated
    pageSpeedAvailable: true
  };
};

/**
 * Convert PageSpeed opportunities and diagnostics to our finding format
 */
const convertPageSpeedToFindings = (pageSpeedData) => {
  const findings = [];

  // Add Core Web Vitals findings if poor
  const cwvSeverity = getCoreWebVitalsSeverity(pageSpeedData.metrics);

  if (cwvSeverity.lcp === 'poor') {
    findings.push({
      title: 'Slow Largest Contentful Paint (LCP)',
      severity: 'high',
      category: 'performance',
      impact: `LCP is ${pageSpeedData.coreWebVitals.lcp}, users experience slow page loads`,
      recommendation: 'Optimize images, remove render-blocking resources, and improve server response times.'
    });
  }

  if (cwvSeverity.cls === 'poor') {
    findings.push({
      title: 'High Cumulative Layout Shift (CLS)',
      severity: 'high',
      category: 'performance',
      impact: `CLS is ${pageSpeedData.coreWebVitals.cls}, content shifts unexpectedly during load`,
      recommendation: 'Add size attributes to images and embeds, avoid inserting content above existing content.'
    });
  }

  if (cwvSeverity.fcp === 'poor') {
    findings.push({
      title: 'Slow First Contentful Paint (FCP)',
      severity: 'moderate',
      category: 'performance',
      impact: `FCP is ${pageSpeedData.coreWebVitals.fcp}, users see blank page for too long`,
      recommendation: 'Eliminate render-blocking resources, minify CSS, and use font-display: swap.'
    });
  }

  // Add top 3 opportunities
  pageSpeedData.opportunities.slice(0, 3).forEach(opp => {
    findings.push({
      title: opp.title,
      severity: opp.savings > 1000 ? 'high' : 'moderate',
      category: 'performance',
      impact: `Could save ${(opp.savings / 1000).toFixed(1)}s`,
      recommendation: opp.description
    });
  });

  // Add accessibility issues from PageSpeed
  pageSpeedData.accessibilityIssues.slice(0, 2).forEach(issue => {
    findings.push({
      title: issue.title,
      severity: issue.impact,
      category: 'accessibility',
      impact: `${issue.elements} elements affected`,
      recommendation: issue.description
    });
  });

  return findings;
};

/**
 * Create performance section component data from PageSpeed
 */
export const createPerformanceSection = (pageSpeedData) => {
  if (!pageSpeedData) return null;

  return {
    coreWebVitals: pageSpeedData.coreWebVitals,
    severity: getCoreWebVitalsSeverity(pageSpeedData.metrics),
    opportunities: pageSpeedData.opportunities.slice(0, 5),
    diagnostics: pageSpeedData.diagnostics.slice(0, 5),
    resources: pageSpeedData.resources
  };
};
