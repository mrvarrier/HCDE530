/**
 * Web Scraping Endpoint
 * Fetches website HTML and metadata using Playwright headless browser
 */

import { chromium } from 'playwright-core';
import chromiumPkg from '@sparticuz/chromium';

// CORS headers for allowing frontend requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let browser = null;

  try {
    console.log(`[Scrape] Starting scrape for: ${url}`);

    // Ensure URL has protocol
    const fullURL = url.startsWith('http') ? url : `https://${url}`;

    // Launch headless browser with better settings
    // Use serverless chromium for Vercel deployment
    browser = await chromium.launch({
      args: chromiumPkg.args,
      executablePath: await chromiumPkg.executablePath(),
      headless: true
    });

    // IMPROVEMENT #2: Multi-Viewport Testing (NEW - Phase 2)
    // Define viewports to test
    const viewports = [
      { name: 'mobile', width: 375, height: 667, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1' },
      { name: 'tablet', width: 768, height: 1024, userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1' },
      { name: 'desktop', width: 1920, height: 1080, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    ];

    // Start with desktop viewport for main scrape
    const context = await browser.newContext({
      userAgent: viewports[2].userAgent,
      viewport: { width: viewports[2].width, height: viewports[2].height },
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const page = await context.newPage();

    let scrapeStatus = 'success';
    let scrapeError = null;

    // Try to navigate with multiple fallback strategies
    try {
      // Strategy 1: Wait for networkidle (best quality)
      await page.goto(fullURL, {
        waitUntil: 'networkidle',
        timeout: 30000
      });
    } catch (error) {
      console.log(`[Scrape] Networkidle timeout, trying domcontentloaded...`);
      scrapeStatus = 'partial';

      try {
        // Strategy 2: Just wait for DOM (faster)
        await page.goto(fullURL, {
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });
      } catch (error2) {
        console.log(`[Scrape] DOM timeout, trying basic load...`);

        try {
          // Strategy 3: Basic load only
          await page.goto(fullURL, {
            waitUntil: 'load',
            timeout: 10000
          });
        } catch (error3) {
          // Complete failure
          scrapeStatus = 'blocked';
          scrapeError = 'Website may be blocking automated access or is too slow to load';
          throw error3;
        }
      }
    }

    // Wait a bit for dynamic content
    await page.waitForTimeout(2000);

    // Extract HTML content
    let html = await page.content();

    // For very large pages, clean up the HTML to reduce size
    if (html.length > 1000000) { // > 1MB
      console.log(`[Scrape] Large HTML detected (${(html.length / 1024 / 1024).toFixed(2)}MB), cleaning...`);

      // Remove inline base64 images (huge space waste)
      html = html.replace(/src="data:image\/[^"]+"/g, 'src="data:image/removed"');

      // Remove comments
      html = html.replace(/<!--[\s\S]*?-->/g, '');

      // Remove excessive whitespace
      html = html.replace(/\s+/g, ' ');

      console.log(`[Scrape] Cleaned HTML size: ${(html.length / 1024 / 1024).toFixed(2)}MB`);
    }

    // Extract page title
    const title = await page.title();

    // Count various elements
    const images = await page.$$eval('img', imgs => imgs.length);
    const links = await page.$$eval('a', as => as.length);
    const scripts = await page.$$eval('script', scripts => scripts.length);
    const stylesheets = await page.$$eval('link[rel="stylesheet"]', links => links.length);
    const headings = {
      h1: await page.$$eval('h1', hs => hs.length),
      h2: await page.$$eval('h2', hs => hs.length),
      h3: await page.$$eval('h3', hs => hs.length),
      h4: await page.$$eval('h4', hs => hs.length),
      h5: await page.$$eval('h5', hs => hs.length),
      h6: await page.$$eval('h6', hs => hs.length)
    };

    // Extract meta tags
    const metaTags = await page.$$eval('meta', metas =>
      metas.map(meta => ({
        name: meta.getAttribute('name'),
        property: meta.getAttribute('property'),
        content: meta.getAttribute('content')
      }))
    );

    // IMPROVEMENT #4: Browser Performance Metrics (NEW - Phase 2)
    const performanceMetrics = await page.evaluate(() => {
      const perf = window.performance;
      const timing = perf.timing;
      const navigation = perf.navigation;

      // Get resource timing data
      const resources = perf.getEntriesByType('resource');

      // Calculate load times
      const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      const loadComplete = timing.loadEventEnd - timing.navigationStart;
      const domInteractive = timing.domInteractive - timing.navigationStart;

      // Get paint timings
      const paintEntries = perf.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0;
      const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

      // DOM metrics
      const domSize = document.getElementsByTagName('*').length;
      const domDepth = calculateDOMDepth(document.body);

      function calculateDOMDepth(element, depth = 0) {
        if (!element || !element.children || element.children.length === 0) {
          return depth;
        }
        let maxDepth = depth;
        for (let child of element.children) {
          const childDepth = calculateDOMDepth(child, depth + 1);
          maxDepth = Math.max(maxDepth, childDepth);
        }
        return maxDepth;
      }

      // Analyze resources
      const scripts = resources.filter(r => r.initiatorType === 'script');
      const styles = resources.filter(r => r.initiatorType === 'link' && r.name.includes('.css'));
      const images = resources.filter(r => r.initiatorType === 'img');
      const fonts = resources.filter(r => r.name.match(/\.(woff2?|ttf|otf|eot)/i));

      // Calculate total sizes
      const totalResourceSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const scriptSize = scripts.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const styleSize = styles.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const imageSize = images.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const fontSize = fonts.reduce((sum, r) => sum + (r.transferSize || 0), 0);

      // Detect third-party scripts
      const currentHostname = window.location.hostname;
      const thirdPartyScripts = scripts.filter(r => {
        try {
          const url = new URL(r.name);
          return url.hostname !== currentHostname;
        } catch {
          return false;
        }
      });

      // Check image formats
      const imageFormats = {
        webp: 0,
        png: 0,
        jpg: 0,
        gif: 0,
        svg: 0
      };

      images.forEach(img => {
        const url = img.name.toLowerCase();
        if (url.includes('.webp')) imageFormats.webp++;
        else if (url.includes('.png')) imageFormats.png++;
        else if (url.includes('.jpg') || url.includes('.jpeg')) imageFormats.jpg++;
        else if (url.includes('.gif')) imageFormats.gif++;
        else if (url.includes('.svg')) imageFormats.svg++;
      });

      return {
        // Load timings (ms)
        domContentLoaded: Math.round(domContentLoaded),
        loadComplete: Math.round(loadComplete),
        domInteractive: Math.round(domInteractive),
        firstPaint: Math.round(firstPaint),
        firstContentfulPaint: Math.round(firstContentfulPaint),

        // DOM metrics
        domSize,
        domDepth,

        // Resource counts
        resourceCount: resources.length,
        scriptCount: scripts.length,
        styleCount: styles.length,
        imageCount: images.length,
        fontCount: fonts.length,

        // Resource sizes (bytes)
        totalResourceSize,
        scriptSize,
        styleSize,
        imageSize,
        fontSize,

        // Third-party detection
        thirdPartyScriptCount: thirdPartyScripts.length,
        thirdPartyScripts: thirdPartyScripts.slice(0, 5).map(r => {
          try {
            return new URL(r.name).hostname;
          } catch {
            return 'Unknown';
          }
        }),

        // Image optimization
        imageFormats,
        hasWebP: imageFormats.webp > 0,
        unoptimizedImages: imageFormats.png + imageFormats.jpg
      };
    });

    // IMPROVEMENT #3: Enhanced Accessibility Checks (NEW - Phase 2)
    const accessibilityChecks = await page.evaluate(() => {
      // Check 1: Focusable elements without visible focus indicators
      const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      let focusableWithoutIndicators = 0;

      focusable.forEach(el => {
        // Temporarily focus to check styles
        const originalFocus = document.activeElement;
        el.focus();
        const focusStyles = window.getComputedStyle(el, ':focus');
        const styles = window.getComputedStyle(el);

        // Check if focus indicator is present
        const hasOutline = focusStyles.outline !== 'none' && focusStyles.outline !== '0px';
        const hasBoxShadow = focusStyles.boxShadow !== 'none' && focusStyles.boxShadow !== styles.boxShadow;
        const hasBorder = focusStyles.border !== styles.border;

        if (!hasOutline && !hasBoxShadow && !hasBorder) {
          focusableWithoutIndicators++;
        }

        // Restore original focus
        if (originalFocus) {
          originalFocus.focus();
        }
      });

      // Check 2: Touch target sizes (for mobile)
      const interactive = document.querySelectorAll('a, button, input[type="button"], input[type="submit"], [role="button"], [onclick]');
      let smallTouchTargets = 0;
      const touchTargetIssues = [];

      interactive.forEach(el => {
        const rect = el.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // WCAG recommends 44x44px minimum for touch targets
        if ((width > 0 && width < 44) || (height > 0 && height < 44)) {
          smallTouchTargets++;
          if (touchTargetIssues.length < 5) {
            touchTargetIssues.push({
              element: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ')[0] : ''),
              text: el.textContent?.trim().substring(0, 30) || el.getAttribute('aria-label') || 'No text',
              width: Math.round(width),
              height: Math.round(height)
            });
          }
        }
      });

      return {
        focusableWithoutIndicators,
        smallTouchTargets,
        touchTargetIssues
      };
    });

    // IMPROVEMENT #1: Extract computed styles from rendered page
    const computedStyles = await page.evaluate(() => {
      const elements = document.querySelectorAll('body *');
      const styles = {
        fonts: new Set(),
        fontSizes: new Set(),
        fontWeights: new Set(),
        lineHeights: new Set(),
        colors: new Set(),
        backgroundColors: new Set(),
        letterSpacings: new Set()
      };

      // NEW: Track text elements for color contrast analysis
      const textElements = [];

      // Sample up to 500 elements to avoid timeout
      const sampleSize = Math.min(elements.length, 500);
      const step = Math.max(1, Math.floor(elements.length / sampleSize));

      for (let i = 0; i < elements.length; i += step) {
        const el = elements[i];
        const computed = window.getComputedStyle(el);

        // Only collect if element is visible
        if (el.offsetWidth > 0 && el.offsetHeight > 0) {
          styles.fonts.add(computed.fontFamily);
          styles.fontSizes.add(computed.fontSize);
          styles.fontWeights.add(computed.fontWeight);
          styles.lineHeights.add(computed.lineHeight);
          styles.colors.add(computed.color);
          styles.backgroundColors.add(computed.backgroundColor);
          styles.letterSpacings.add(computed.letterSpacing);

          // NEW: Collect text elements with colors for contrast checking
          const text = el.textContent?.trim();
          if (text && text.length > 0 && text.length < 200) {
            // Get background color (traverse up to find non-transparent)
            let bgColor = computed.backgroundColor;
            let parent = el.parentElement;

            while (parent && (bgColor.includes('rgba(0, 0, 0, 0)') || bgColor === 'transparent')) {
              bgColor = window.getComputedStyle(parent).backgroundColor;
              parent = parent.parentElement;
            }

            // Default to white if no background found
            if (bgColor.includes('rgba(0, 0, 0, 0)') || bgColor === 'transparent') {
              bgColor = 'rgb(255, 255, 255)';
            }

            textElements.push({
              selector: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ')[0] : ''),
              text: text.substring(0, 100),
              color: computed.color,
              backgroundColor: bgColor,
              fontSize: parseFloat(computed.fontSize),
              fontWeight: parseInt(computed.fontWeight) || 400
            });
          }
        }
      }

      return {
        fonts: Array.from(styles.fonts).filter(f => f && f !== 'inherit'),
        fontSizes: Array.from(styles.fontSizes).filter(s => s && s !== 'inherit').sort((a, b) => parseFloat(a) - parseFloat(b)),
        fontWeights: Array.from(styles.fontWeights).filter(w => w && w !== 'inherit'),
        lineHeights: Array.from(styles.lineHeights).filter(l => l && l !== 'inherit' && l !== 'normal'),
        colors: Array.from(styles.colors).filter(c => c && c !== 'inherit' && !c.includes('rgba(0, 0, 0, 0)')),
        backgroundColors: Array.from(styles.backgroundColors).filter(c => c && c !== 'inherit' && !c.includes('rgba(0, 0, 0, 0)')),
        letterSpacings: Array.from(styles.letterSpacings).filter(s => s && s !== 'inherit' && s !== 'normal'),
        textElements: textElements.slice(0, 100) // Limit to 100 text elements for performance
      };
    });

    // IMPROVEMENT #2: Multi-Viewport Testing (NEW - Phase 2)
    // Test all viewports and capture data
    const viewportData = {};

    for (const viewport of viewports) {
      console.log(`[Scrape] Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`);

      try {
        // Set viewport size
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(1000); // Wait for responsive changes

        // Capture viewport-specific data
        const viewportInfo = await page.evaluate(() => {
          // Count visible elements
          const allElements = document.querySelectorAll('*');
          let visibleElements = 0;
          let hiddenElements = 0;

          allElements.forEach(el => {
            const styles = window.getComputedStyle(el);
            if (styles.display === 'none' || styles.visibility === 'hidden') {
              hiddenElements++;
            } else if (el.offsetWidth > 0 && el.offsetHeight > 0) {
              visibleElements++;
            }
          });

          // Detect responsive breakpoints
          const bodyWidth = document.body.offsetWidth;

          return {
            visibleElements,
            hiddenElements,
            bodyWidth,
            scrollHeight: document.documentElement.scrollHeight
          };
        });

        // Take screenshot for this viewport (only for smaller sites)
        let viewportScreenshot = null;
        if (html.length < 500000) {
          viewportScreenshot = await page.screenshot({
            fullPage: false,
            type: 'png',
            encoding: 'base64'
          });
        }

        viewportData[viewport.name] = {
          ...viewportInfo,
          screenshot: viewportScreenshot,
          dimensions: {
            width: viewport.width,
            height: viewport.height
          }
        };

      } catch (error) {
        console.error(`[Scrape] Error testing ${viewport.name} viewport:`, error.message);
        viewportData[viewport.name] = {
          error: error.message,
          dimensions: {
            width: viewport.width,
            height: viewport.height
          }
        };
      }
    }

    // Desktop screenshot for backward compatibility
    const screenshot = viewportData.desktop?.screenshot || null;

    await browser.close();

    console.log(`[Scrape] Successfully scraped: ${url} (status: ${scrapeStatus})`);

    // Return data with scrape status
    return res.status(200).json({
      url: fullURL,
      html,
      metadata: {
        title,
        images,
        links,
        scripts,
        stylesheets,
        headings,
        metaTags
      },
      computedStyles, // NEW: Actual rendered styles
      accessibilityChecks, // NEW: Focus indicators and touch targets
      performanceMetrics, // NEW: Browser performance data
      viewportData, // NEW: Multi-viewport testing data
      screenshot, // May be null for large sites (desktop screenshot)
      scrapeStatus, // NEW: success, partial, or blocked
      scrapeWarning: scrapeStatus !== 'success' ? 'Website loaded with issues - some data may be incomplete' : null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[Scrape] Error scraping ${url}:`, error.message);

    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('[Scrape] Error closing browser:', closeError.message);
      }
    }

    // Determine if this is a blocking/timeout issue or other error
    const isTimeout = error.message.includes('Timeout') || error.message.includes('timeout');
    const isBlocked = error.message.includes('net::ERR') || error.message.includes('NS_ERROR');

    return res.status(500).json({
      error: 'Failed to scrape website',
      message: error.message,
      url,
      blocked: isTimeout || isBlocked,
      suggestion: isTimeout
        ? 'Website took too long to load or is blocking automated access. Try a simpler website or check if the site is accessible.'
        : isBlocked
        ? 'Website is blocking automated access or has network restrictions.'
        : 'An unexpected error occurred while scraping.'
    });
  }
}

// Set CORS headers on all responses
export const config = {
  api: {
    bodyParser: true,
  },
};
