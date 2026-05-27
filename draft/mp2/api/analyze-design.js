/**
 * Design System Analysis Endpoint
 * Extracts real typography, colors, and design patterns from HTML/CSS
 */

import { load } from 'cheerio';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { html, url, computedStyles } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'HTML is required' });
  }

  try {
    console.log(`[Design] Starting design analysis for: ${url || 'unknown'}`);

    // Load HTML with cheerio
    const $ = load(html);

    // Use computed styles if available (much more accurate), fallback to CSS parsing
    let fontsData, colorsData;

    if (computedStyles) {
      console.log('[Design] Using computed styles from browser (accurate data)');
      fontsData = processComputedTypography(computedStyles);
      colorsData = processComputedColors(computedStyles);
    } else {
      console.log('[Design] Using CSS parsing (fallback - less accurate)');
      fontsData = extractFonts($, html);
      colorsData = extractColors($, html);
    }

    // Extract spacing patterns
    const spacingData = extractSpacing(html);

    console.log(`[Design] Analysis complete`);

    return res.status(200).json({
      typography: fontsData,
      colors: colorsData,
      spacing: spacingData,
      dataSource: computedStyles ? 'computed-styles' : 'css-parsing',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[Design] Error analyzing design:`, error.message);

    return res.status(500).json({
      error: 'Failed to analyze design',
      message: error.message
    });
  }
}

/**
 * Process computed styles from browser (NEW - more accurate)
 */
function processComputedTypography(computedStyles) {
  const { fonts, fontSizes, fontWeights, lineHeights, letterSpacings } = computedStyles;

  // Clean and deduplicate fonts
  const cleanFonts = fonts
    .map(f => f.split(',')[0].trim().replace(/['"]/g, ''))
    .filter((f, i, arr) => arr.indexOf(f) === i && f.length > 1)
    .filter(f => !['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui'].includes(f.toLowerCase()))
    .slice(0, 10);

  const issues = [];
  const recommendations = [];

  if (cleanFonts.length > 6) {
    issues.push(`Using ${cleanFonts.length} different font families. Recommend 2-3 fonts maximum for consistency.`);
  }

  if (fontSizes.length > 12) {
    issues.push(`Detected ${fontSizes.length} unique font sizes. Recommend a type scale with 6-8 sizes.`);
  }

  if (cleanFonts.length === 0) {
    issues.push('No custom fonts detected. Site is using browser defaults.');
  }

  return {
    fonts: cleanFonts,
    allFontSizes: fontSizes.slice(0, 20),
    fontWeights: fontWeights.slice(0, 10), // NEW
    lineHeights: lineHeights.slice(0, 10), // NEW
    letterSpacings: letterSpacings.slice(0, 10), // NEW
    uniqueFontCount: cleanFonts.length,
    uniqueSizeCount: fontSizes.length,
    externalStylesheets: [],
    issues,
    recommendations: generateTypographyRecommendations(cleanFonts, fontSizes)
  };
}

/**
 * Process computed colors from browser (NEW - more accurate)
 */
function processComputedColors(computedStyles) {
  const { colors, backgroundColors } = computedStyles;

  // Helper to normalize RGB to hex
  const rgbToHex = (rgb) => {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return rgb;

    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  // Convert and deduplicate
  const allColors = [...colors, ...backgroundColors]
    .map(c => c.startsWith('rgb') ? rgbToHex(c) : c)
    .filter((c, i, arr) => arr.indexOf(c) === i && c && c !== 'transparent');

  const palette = allColors.slice(0, 20);
  const bgColors = backgroundColors.map(c => c.startsWith('rgb') ? rgbToHex(c) : c).slice(0, 10);
  const textColors = colors.map(c => c.startsWith('rgb') ? rgbToHex(c) : c).slice(0, 10);

  const issues = [];

  if (palette.length > 15) {
    issues.push(`Using ${palette.length} unique colors. Recommend 8-12 colors for consistency.`);
  }

  if (palette.length < 3) {
    issues.push('Very limited color palette. Consider adding accent colors.');
  }

  return {
    palette,
    backgroundColors: bgColors,
    textColors: textColors,
    borderColors: [], // Could be extracted similarly
    totalUniqueColors: palette.length,
    issues,
    recommendations: generateColorRecommendations(palette)
  };
}

/**
 * Extract font information from HTML and CSS (FALLBACK)
 */
function extractFonts($, html) {
  const fonts = new Set();
  const fontSizes = new Set();
  const issues = [];

  // Extract fonts from inline styles
  $('[style]').each((i, el) => {
    const style = $(el).attr('style');
    const fontFamilyMatch = style.match(/font-family:\s*([^;]+)/i);
    const fontSizeMatch = style.match(/font-size:\s*([^;]+)/i);

    if (fontFamilyMatch) {
      const families = fontFamilyMatch[1].split(',').map(f => f.trim().replace(/['"]/g, ''));
      families.forEach(f => fonts.add(f));
    }

    if (fontSizeMatch) {
      fontSizes.add(fontSizeMatch[1].trim());
    }
  });

  // Extract from CSS in <style> tags
  $('style').each((i, el) => {
    const css = $(el).html();

    // Extract font-family declarations
    const fontFamilyMatches = css.matchAll(/font-family:\s*([^;}]+)/gi);
    for (const match of fontFamilyMatches) {
      const families = match[1].split(',').map(f => f.trim().replace(/['"]/g, ''));
      families.forEach(f => fonts.add(f));
    }

    // Extract font-size declarations
    const fontSizeMatches = css.matchAll(/font-size:\s*([^;}]+)/gi);
    for (const match of fontSizeMatches) {
      fontSizes.add(match[1].trim());
    }
  });

  // Extract from link tags (external stylesheets - we can only see the URL)
  const externalStylesheets = [];
  $('link[rel="stylesheet"]').each((i, el) => {
    const href = $(el).attr('href');
    if (href) {
      externalStylesheets.push(href);
    }
  });

  // Clean up fonts (remove generic font families)
  const genericFonts = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui'];
  const cleanFonts = Array.from(fonts).filter(f =>
    f && !genericFonts.includes(f.toLowerCase()) && f.length > 1
  );

  // Convert font sizes to sortable numbers
  const cleanSizes = Array.from(fontSizes)
    .filter(s => s && s !== 'inherit' && s !== 'initial')
    .sort((a, b) => {
      const aVal = parseFloat(a);
      const bVal = parseFloat(b);
      return aVal - bVal;
    });

  // Generate issues
  if (cleanFonts.length > 6) {
    issues.push(`Using ${cleanFonts.length} different font families reduces visual consistency. Recommend 2-3 fonts maximum.`);
  }

  if (cleanSizes.length > 12) {
    issues.push(`Detected ${cleanSizes.length} unique font sizes. Recommend establishing a type scale with 6-8 sizes.`);
  }

  if (cleanFonts.length === 0) {
    issues.push('No custom fonts detected. Site may be using browser defaults.');
  }

  return {
    fonts: cleanFonts.slice(0, 10), // Limit to top 10
    allFontSizes: cleanSizes,
    uniqueFontCount: cleanFonts.length,
    uniqueSizeCount: cleanSizes.length,
    externalStylesheets,
    issues,
    recommendations: generateTypographyRecommendations(cleanFonts, cleanSizes)
  };
}

/**
 * Extract color palette from HTML and CSS
 */
function extractColors($, html) {
  const colors = new Set();
  const backgroundColors = new Set();
  const textColors = new Set();
  const borderColors = new Set();
  const issues = [];

  // Helper to normalize colors
  const normalizeColor = (color) => {
    if (!color) return null;
    color = color.trim().toLowerCase();

    // Skip transparent and inherit
    if (color === 'transparent' || color === 'inherit' || color === 'initial') {
      return null;
    }

    // Convert rgb to hex (simplified)
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
      const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
      const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }

    return color;
  };

  // Extract from inline styles
  $('[style]').each((i, el) => {
    const style = $(el).attr('style');

    const colorMatch = style.match(/color:\s*([^;]+)/i);
    const bgMatch = style.match(/background(-color)?:\s*([^;]+)/i);
    const borderMatch = style.match(/border(-color)?:\s*([^;]+)/i);

    if (colorMatch) {
      const color = normalizeColor(colorMatch[1]);
      if (color) {
        colors.add(color);
        textColors.add(color);
      }
    }

    if (bgMatch) {
      const color = normalizeColor(bgMatch[2]);
      if (color) {
        colors.add(color);
        backgroundColors.add(color);
      }
    }

    if (borderMatch) {
      const color = normalizeColor(borderMatch[2]);
      if (color) {
        colors.add(color);
        borderColors.add(color);
      }
    }
  });

  // Extract from CSS in <style> tags
  $('style').each((i, el) => {
    const css = $(el).html();

    // Extract color declarations
    const colorMatches = css.matchAll(/color:\s*([^;}]+)/gi);
    for (const match of colorMatches) {
      const color = normalizeColor(match[1]);
      if (color) {
        colors.add(color);
        textColors.add(color);
      }
    }

    // Extract background colors
    const bgMatches = css.matchAll(/background(-color)?:\s*([^;}]+)/gi);
    for (const match of bgMatches) {
      const color = normalizeColor(match[2]);
      if (color) {
        colors.add(color);
        backgroundColors.add(color);
      }
    }

    // Extract border colors
    const borderMatches = css.matchAll(/border(-color)?:\s*([^;}]+)/gi);
    for (const match of borderMatches) {
      const color = normalizeColor(match[2]);
      if (color) {
        colors.add(color);
        borderColors.add(color);
      }
    }
  });

  const palette = Array.from(colors).slice(0, 20); // Limit to top 20

  // Generate issues
  if (palette.length > 15) {
    issues.push(`Using ${palette.length} unique colors. Recommend limiting palette to 8-12 colors for consistency.`);
  }

  if (palette.length < 3) {
    issues.push('Very limited color palette detected. Consider adding accent colors for visual interest.');
  }

  return {
    palette,
    backgroundColors: Array.from(backgroundColors).slice(0, 10),
    textColors: Array.from(textColors).slice(0, 10),
    borderColors: Array.from(borderColors).slice(0, 10),
    totalUniqueColors: palette.length,
    issues,
    recommendations: generateColorRecommendations(palette)
  };
}

/**
 * Extract spacing patterns (margin, padding)
 */
function extractSpacing(html) {
  const spacingValues = new Set();
  const issues = [];

  // Extract from inline styles using regex
  const spacingMatches = html.matchAll(/(margin|padding):\s*([^;"}]+)/gi);
  for (const match of spacingMatches) {
    const values = match[2].trim().split(/\s+/);
    values.forEach(v => {
      if (v && !v.includes('%') && !v.includes('auto')) {
        spacingValues.add(v);
      }
    });
  }

  const uniqueSpacing = Array.from(spacingValues).sort((a, b) => {
    return parseFloat(a) - parseFloat(b);
  });

  if (uniqueSpacing.length > 15) {
    issues.push(`Detected ${uniqueSpacing.length} unique spacing values. Recommend using a consistent spacing scale (e.g., 4px, 8px, 16px, 24px, 32px).`);
  }

  return {
    values: uniqueSpacing.slice(0, 20),
    totalUnique: uniqueSpacing.length,
    issues,
    recommendation: 'Consider using a consistent spacing scale based on multiples of 4 or 8.'
  };
}

/**
 * Generate typography recommendations
 */
function generateTypographyRecommendations(fonts, sizes) {
  const recs = [];

  if (fonts.length === 1) {
    recs.push('Consider adding a secondary font for headings to create visual hierarchy.');
  }

  if (sizes.length > 12) {
    recs.push('Consolidate font sizes into a modular type scale (6-8 sizes recommended).');
  }

  if (sizes.length < 4) {
    recs.push('Consider expanding type scale to include more heading and body text sizes.');
  }

  recs.push('Ensure consistent line-height across similar text elements.');
  recs.push('Use font-weight variations to create hierarchy without adding new fonts.');

  return recs;
}

/**
 * Generate color recommendations
 */
function generateColorRecommendations(palette) {
  const recs = [];

  if (palette.length > 15) {
    recs.push('Reduce color palette to 8-12 core colors for better brand consistency.');
  }

  recs.push('Ensure sufficient contrast ratios (4.5:1 for text, 3:1 for UI components).');
  recs.push('Define primary, secondary, and accent colors clearly.');
  recs.push('Use color consistently across similar UI elements.');

  return recs;
}
