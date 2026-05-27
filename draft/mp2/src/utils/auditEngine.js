import { classifyURL, getSiteTypeLabel } from './urlClassifier';
import { createSeedFromURL, SeededRandom } from './hashSeed';
import { generateRealisticIA } from './iaGenerator';
import {
  accessibilityFindings,
  designFindings,
  performanceFindings,
  iaFindings
} from '../data/findingTemplates';

// Generate typography data based on site type
const generateTypography = (siteType, rng) => {
  const commonFonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
    'Poppins', 'Source Sans Pro', 'Raleway', 'Nunito', 'Work Sans',
    'DM Sans', 'Plus Jakarta Sans', 'Manrope', 'Space Grotesk'
  ];

  const headingFonts = [...commonFonts, 'Playfair Display', 'Merriweather', 'Crimson Text',
    'Fraunces', 'Libre Baskerville', 'Spectral', 'Cardo'];

  // Pick fonts
  const bodyFont = rng.pick(commonFonts);
  const headingFont = rng.nextInt(0, 100) > 30 ? rng.pick(headingFonts) : bodyFont;

  // Generate some inconsistencies
  const hasInconsistencies = rng.nextInt(0, 100) < 40;
  const additionalFonts = hasInconsistencies ? rng.pickMultiple(commonFonts, rng.nextInt(1, 2)) : [];

  // Generate varied type scales (not all sites use the same scale)
  const baseScales = [
    ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'], // Standard
    ['14px', '16px', '18px', '20px', '24px', '28px', '36px', '54px'], // Larger
    ['11px', '13px', '15px', '17px', '19px', '22px', '30px', '44px'], // Tighter
    ['13px', '15px', '17px', '20px', '23px', '28px', '40px', '60px'], // Varied
    ['12px', '14px', '16px', '19px', '22px', '26px', '34px', '48px']  // Custom
  ];

  // Some sites have inconsistent scales (more sizes)
  let scale = rng.pick(baseScales);
  const hasScaleIssues = rng.nextInt(0, 100) < 30;
  if (hasScaleIssues) {
    scale = [...scale, `${rng.nextInt(21, 27)}px`, `${rng.nextInt(38, 44)}px`];
  }

  const issues = [];
  if (hasInconsistencies) {
    issues.push('Multiple font families reduce visual consistency');
  }
  if (hasScaleIssues) {
    issues.push('Inconsistent type scale with too many sizes');
  }

  return {
    fonts: [bodyFont, ...(headingFont !== bodyFont ? [headingFont] : []), ...additionalFonts],
    bodyFont,
    headingFont,
    scale,
    issues
  };
};

// Generate color palette
const generateColors = (siteType, rng) => {
  const colorPalettes = {
    ecommerce: [
      ['#0F172A', '#1E40AF', '#3B82F6', '#F59E0B', '#EF4444'],
      ['#1F2937', '#7C3AED', '#A78BFA', '#F472B6', '#10B981'],
      ['#18181B', '#DC2626', '#F87171', '#FBBF24', '#34D399'],
      ['#171717', '#0EA5E9', '#38BDF8', '#FB923C', '#F43F5E'],
      ['#0C0A09', '#15803D', '#4ADE80', '#F97316', '#DC2626'],
      ['#1C1917', '#2563EB', '#60A5FA', '#FACC15', '#EF4444'],
      ['#18181B', '#9333EA', '#C084FC', '#FCD34D', '#10B981']
    ],
    marketing: [
      ['#111827', '#2563EB', '#60A5FA', '#F97316', '#FBBF24'],
      ['#0F172A', '#6366F1', '#818CF8', '#EC4899', '#F472B6'],
      ['#18181B', '#0891B2', '#22D3EE', '#F59E0B', '#FB923C'],
      ['#171717', '#7C3AED', '#A78BFA', '#FBBF24', '#F472B6'],
      ['#1C1917', '#059669', '#34D399', '#EAB308', '#F97316'],
      ['#0C0A09', '#4F46E5', '#818CF8', '#F59E0B', '#FB7185'],
      ['#1F2937', '#0284C7', '#0EA5E9', '#D97706', '#DC2626']
    ],
    saas: [
      ['#0F172A', '#0891B2', '#06B6D4', '#14B8A6', '#F59E0B'],
      ['#1E293B', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E'],
      ['#18181B', '#2563EB', '#60A5FA', '#10B981', '#FCD34D'],
      ['#171717', '#7C3AED', '#A78BFA', '#34D399', '#FB923C'],
      ['#0C0A09', '#0891B2', '#22D3EE', '#4ADE80', '#FBBF24'],
      ['#1C1917', '#4F46E5', '#818CF8', '#14B8A6', '#F59E0B'],
      ['#111827', '#8B5CF6', '#C084FC', '#06B6D4', '#FCD34D']
    ],
    blog: [
      ['#1F2937', '#4B5563', '#6B7280', '#F59E0B', '#EF4444'],
      ['#111827', '#374151', '#6B7280', '#3B82F6', '#F472B6'],
      ['#18181B', '#52525B', '#71717A', '#FB923C', '#DC2626'],
      ['#171717', '#3F3F46', '#737373', '#FBBF24', '#7C3AED'],
      ['#0C0A09', '#57534E', '#78716C', '#F97316', '#0891B2'],
      ['#1C1917', '#44403C', '#A8A29E', '#EAB308', '#2563EB']
    ],
    portfolio: [
      ['#0F172A', '#1E293B', '#475569', '#06B6D4', '#F59E0B'],
      ['#111827', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E'],
      ['#18181B', '#18181B', '#52525B', '#22D3EE', '#FB923C'],
      ['#171717', '#27272A', '#71717A', '#C084FC', '#34D399'],
      ['#0C0A09', '#1C1917', '#57534E', '#14B8A6', '#FBBF24'],
      ['#1F2937', '#374151', '#6B7280', '#7C3AED', '#F97316']
    ],
    documentation: [
      ['#0F172A', '#1E40AF', '#3B82F6', '#10B981', '#F59E0B'],
      ['#111827', '#059669', '#10B981', '#3B82F6', '#F59E0B'],
      ['#18181B', '#0284C7', '#0EA5E9', '#14B8A6', '#FBBF24'],
      ['#171717', '#2563EB', '#60A5FA', '#059669', '#FB923C'],
      ['#0C0A09', '#4F46E5', '#818CF8', '#22C55E', '#F97316'],
      ['#1C1917', '#7C3AED', '#A78BFA', '#10B981', '#EAB308']
    ]
  };

  const palette = rng.pick(colorPalettes[siteType] || colorPalettes.marketing);

  // Sometimes add color inconsistencies (random additional colors)
  const hasColorIssues = rng.nextInt(0, 100) < 25;
  let finalPalette = [...palette];
  const issues = [];

  if (hasColorIssues) {
    const extraColors = ['#22D3EE', '#F472B6', '#A78BFA', '#FCD34D', '#34D399'];
    finalPalette = [...finalPalette, ...rng.pickMultiple(extraColors, rng.nextInt(1, 2))];
    issues.push('Too many brand colors may dilute brand identity');
  }

  return {
    colors: finalPalette,
    primary: palette[1],
    secondary: palette[2],
    accent: palette[3],
    issues
  };
};

// Generate information architecture (now uses realistic generator)
const generateIA = (url, siteType, rng) => {
  return generateRealisticIA(url, siteType, rng);
};

// Generate scores based on site type
const generateScores = (siteType, rng) => {
  const baseScores = {
    ecommerce: { accessibility: 70, design: 75, ia: 72, performance: 68, usability: 74 },
    marketing: { accessibility: 75, design: 80, ia: 78, performance: 72, usability: 79 },
    saas: { accessibility: 78, design: 82, ia: 75, performance: 76, usability: 80 },
    blog: { accessibility: 72, design: 77, ia: 80, performance: 75, usability: 78 },
    portfolio: { accessibility: 76, design: 85, ia: 82, performance: 70, usability: 81 },
    documentation: { accessibility: 80, design: 78, ia: 77, performance: 82, usability: 79 }
  };

  const base = baseScores[siteType] || baseScores.marketing;

  // Add some variation
  const scores = {};
  for (const [key, value] of Object.entries(base)) {
    scores[key] = Math.max(50, Math.min(95, value + rng.nextInt(-8, 8)));
  }

  // Calculate overall score (weighted average)
  scores.overall = Math.round(
    (scores.accessibility * 0.25) +
    (scores.design * 0.20) +
    (scores.ia * 0.20) +
    (scores.performance * 0.20) +
    (scores.usability * 0.15)
  );

  return scores;
};

// Pick findings based on scores
const pickFindings = (templates, count, rng) => {
  return rng.pickMultiple(templates, Math.min(count, templates.length));
};

// Generate recommendations
const generateRecommendations = (findings, rng) => {
  const recommendations = [];

  // Group findings by priority
  const criticalFindings = findings.filter(f => f.severity === 'critical');
  const highFindings = findings.filter(f => f.severity === 'high');
  const moderateFindings = findings.filter(f => f.severity === 'moderate');

  // High impact / low effort
  if (moderateFindings.length > 0) {
    const finding = rng.pick(moderateFindings);
    recommendations.push({
      title: `Quick win: ${finding.title}`,
      impact: 'high',
      effort: 'low',
      category: finding.category,
      description: finding.recommendation
    });
  }

  // High impact / medium effort
  if (highFindings.length > 0 || criticalFindings.length > 0) {
    const finding = rng.pick([...highFindings, ...criticalFindings]);
    recommendations.push({
      title: `Priority fix: ${finding.title}`,
      impact: 'high',
      effort: 'medium',
      category: finding.category,
      description: finding.recommendation
    });
  }

  // Lower priority
  if (findings.length > 0) {
    const finding = rng.pick(findings);
    recommendations.push({
      title: `Enhancement: ${finding.title}`,
      impact: 'medium',
      effort: 'low',
      category: finding.category,
      description: finding.recommendation
    });
  }

  return recommendations;
};

// Generate client summary
const generateClientSummary = (url, siteType, scores, findings) => {
  const siteName = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const highCount = findings.filter(f => f.severity === 'high').length;

  const getScoreDescription = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 60) return 'fair';
    return 'needs improvement';
  };

  const strengthCategories = Object.entries(scores)
    .filter(([key, value]) => key !== 'overall' && value >= 80)
    .map(([key]) => key);

  const improvementCategories = Object.entries(scores)
    .filter(([key, value]) => key !== 'overall' && value < 70)
    .map(([key]) => key);

  return `# UX Audit Summary: ${siteName}

## Executive Summary
${siteName} (${getSiteTypeLabel(siteType)}) received an overall UX score of ${scores.overall}/100, indicating ${getScoreDescription(scores.overall)} user experience quality. This audit identified ${findings.length} findings across accessibility, design, information architecture, and performance categories.

## Key Findings
${criticalCount > 0 ? `• **${criticalCount} Critical Issues** requiring immediate attention\n` : ''}${highCount > 0 ? `• **${highCount} High-Priority Issues** that significantly impact user experience\n` : ''}• **Accessibility Score: ${scores.accessibility}/100** - ${getScoreDescription(scores.accessibility)}
• **Design Consistency: ${scores.design}/100** - ${getScoreDescription(scores.design)}
• **Information Architecture: ${scores.ia}/100** - ${getScoreDescription(scores.ia)}
• **Performance: ${scores.performance}/100** - ${getScoreDescription(scores.performance)}

## Strengths
${strengthCategories.length > 0
  ? strengthCategories.map(cat => `• Strong ${cat} implementation with score above 80`).join('\n')
  : '• Overall solid foundation with opportunities for targeted improvements'}

## Areas for Improvement
${improvementCategories.length > 0
  ? improvementCategories.map(cat => `• ${cat.charAt(0).toUpperCase() + cat.slice(1)} requires attention to improve user experience`).join('\n')
  : '• Focus on maintaining current standards while addressing moderate-priority issues'}

## Recommended Next Steps
1. **Immediate Actions**: Address all critical and high-severity findings
2. **Short-term (1-2 weeks)**: Implement quick-win improvements with low effort/high impact
3. **Medium-term (1-2 months)**: Systematic improvements to design consistency and information architecture
4. **Ongoing**: Establish UX testing protocols and maintain accessibility standards

This audit provides a foundation for prioritizing UX improvements. Recommend conducting user testing to validate findings and measure impact of implemented changes.`;
};

// Main audit generation function
export const generateAudit = (url) => {
  const siteType = classifyURL(url);
  const seed = createSeedFromURL(url);
  const rng = new SeededRandom(seed);

  const scores = generateScores(siteType, rng);
  const typography = generateTypography(siteType, rng);
  const colors = generateColors(siteType, rng);
  const ia = generateIA(url, siteType, rng);

  // Pick findings based on scores (lower score = more findings)
  const a11yCount = Math.max(2, Math.floor((100 - scores.accessibility) / 20));
  const designCount = Math.max(2, Math.floor((100 - scores.design) / 20));
  const perfCount = Math.max(1, Math.floor((100 - scores.performance) / 25));
  const iaCount = Math.max(1, Math.floor((100 - scores.ia) / 30));

  const findings = [
    ...pickFindings(accessibilityFindings[siteType] || accessibilityFindings.marketing, a11yCount, rng),
    ...pickFindings(designFindings[siteType] || designFindings.marketing, designCount, rng),
    ...pickFindings(performanceFindings[siteType] || performanceFindings.marketing, perfCount, rng),
    ...pickFindings(iaFindings[siteType] || iaFindings.marketing, iaCount, rng),
  ];

  const recommendations = generateRecommendations(findings, rng);
  const clientSummary = generateClientSummary(url, siteType, scores, findings);

  return {
    id: `audit_${Date.now()}_${seed}`,
    url,
    siteType,
    siteTypeLabel: getSiteTypeLabel(siteType),
    timestamp: new Date().toISOString(),
    scores,
    findings,
    typography,
    colors,
    ia,
    recommendations,
    clientSummary,
    metadata: {
      pageSize: `${rng.nextRange(0.5, 5).toFixed(1)}MB`,
      loadTime: `${rng.nextRange(1.2, 4.5).toFixed(1)}s`,
      requestCount: rng.nextInt(50, 200),
      domSize: rng.nextInt(500, 3000)
    }
  };
};

// Simulate async audit process
export const runAudit = async (url, onProgress) => {
  const steps = [
    { message: 'Reading website structure...', duration: 800 },
    { message: 'Checking accessibility...', duration: 1200 },
    { message: 'Extracting typography...', duration: 700 },
    { message: 'Extracting color system...', duration: 700 },
    { message: 'Mapping information architecture...', duration: 1000 },
    { message: 'Detecting UX inconsistencies...', duration: 1100 },
    { message: 'Generating recommendations...', duration: 900 },
    { message: 'Preparing client summary...', duration: 600 }
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (onProgress) {
      onProgress({
        step: i + 1,
        total: steps.length,
        message: step.message,
        progress: ((i + 1) / steps.length) * 100
      });
    }

    await new Promise(resolve => setTimeout(resolve, step.duration));
  }

  return generateAudit(url);
};
