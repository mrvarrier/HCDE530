/**
 * Web Scraping Endpoint
 * Fetches website HTML and metadata using Playwright headless browser
 */

import { chromium } from 'playwright';

// CORS headers for allowing frontend requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
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
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled' // Avoid bot detection
      ]
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
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
        }
      }

      return {
        fonts: Array.from(styles.fonts).filter(f => f && f !== 'inherit'),
        fontSizes: Array.from(styles.fontSizes).filter(s => s && s !== 'inherit').sort((a, b) => parseFloat(a) - parseFloat(b)),
        fontWeights: Array.from(styles.fontWeights).filter(w => w && w !== 'inherit'),
        lineHeights: Array.from(styles.lineHeights).filter(l => l && l !== 'inherit' && l !== 'normal'),
        colors: Array.from(styles.colors).filter(c => c && c !== 'inherit' && !c.includes('rgba(0, 0, 0, 0)')),
        backgroundColors: Array.from(styles.backgroundColors).filter(c => c && c !== 'inherit' && !c.includes('rgba(0, 0, 0, 0)')),
        letterSpacings: Array.from(styles.letterSpacings).filter(s => s && s !== 'inherit' && s !== 'normal')
      };
    });

    // Take screenshot (only for smaller sites to save bandwidth)
    let screenshot = null;
    if (html.length < 500000) { // Only screenshot if HTML < 500KB
      screenshot = await page.screenshot({
        fullPage: false,
        type: 'png',
        encoding: 'base64'
      });
    } else {
      console.log('[Scrape] Skipping screenshot for large site to reduce payload size');
    }

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
      screenshot, // May be null for large sites
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
