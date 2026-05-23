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

    // Launch headless browser
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (compatible; UXAuditorBot/2.0)',
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Set timeout for navigation
    await page.goto(fullURL, {
      waitUntil: 'networkidle',
      timeout: 20000
    });

    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded');

    // Extract HTML content
    const html = await page.content();

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

    // Take screenshot
    const screenshot = await page.screenshot({
      fullPage: false,
      type: 'png',
      encoding: 'base64'
    });

    await browser.close();

    console.log(`[Scrape] Successfully scraped: ${url}`);

    // Return data
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
      screenshot,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[Scrape] Error scraping ${url}:`, error.message);

    if (browser) {
      await browser.close();
    }

    return res.status(500).json({
      error: 'Failed to scrape website',
      message: error.message,
      url
    });
  }
}

// Set CORS headers on all responses
export const config = {
  api: {
    bodyParser: true,
  },
};
