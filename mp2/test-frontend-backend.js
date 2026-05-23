/**
 * Test script to simulate frontend calling backend
 * This mimics what realAuditEngine.js does
 */

const BACKEND_URL = 'http://localhost:3000/api';

async function testRealAudit(url) {
  console.log('🧪 Testing Real Audit Integration');
  console.log('Target URL:', url);
  console.log('Backend:', BACKEND_URL);
  console.log('');

  try {
    // Step 1: Scrape
    console.log('📡 Step 1: Scraping website...');
    const scrapeResponse = await fetch(`${BACKEND_URL}/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (!scrapeResponse.ok) {
      throw new Error(`Scrape failed: ${scrapeResponse.statusText}`);
    }

    const scrapeData = await scrapeResponse.json();
    console.log('✅ Scrape success!');
    console.log('  - Title:', scrapeData.metadata.title);
    console.log('  - Links:', scrapeData.metadata.links);
    console.log('  - Images:', scrapeData.metadata.images);
    console.log('  - HTML length:', scrapeData.html.length);
    console.log('');

    // Step 2: Accessibility
    console.log('📡 Step 2: Analyzing accessibility...');
    const a11yResponse = await fetch(`${BACKEND_URL}/analyze-accessibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: scrapeData.html, url: scrapeData.url })
    });

    const a11yData = await a11yResponse.json();
    console.log('✅ Accessibility analysis complete!');
    console.log('  - Score:', a11yData.score);
    console.log('  - Findings:', a11yData.findings.length);
    console.log('');

    // Step 3: Design
    console.log('📡 Step 3: Analyzing design...');
    const designResponse = await fetch(`${BACKEND_URL}/analyze-design`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: scrapeData.html, url: scrapeData.url })
    });

    const designData = await designResponse.json();
    console.log('✅ Design analysis complete!');
    console.log('  - Fonts:', designData.fonts ? designData.fonts.join(', ') : 'N/A');
    console.log('  - Colors:', designData.colors ? designData.colors.length : 0);
    console.log('');

    // Step 4: IA
    console.log('📡 Step 4: Analyzing information architecture...');
    const iaResponse = await fetch(`${BACKEND_URL}/analyze-ia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: scrapeData.html, url: scrapeData.url })
    });

    const iaData = await iaResponse.json();
    console.log('✅ IA analysis complete!');
    console.log('  - Navigation depth:', iaData.depth);
    console.log('  - Total pages:', iaData.totalPages);
    console.log('');

    console.log('🎉 All steps completed successfully!');
    console.log('');
    console.log('Summary:');
    console.log('  - Accessibility Score:', a11yData.score);
    console.log('  - Design Score:', designData.score);
    console.log('  - IA Score:', iaData.score);
    console.log('  - Total Findings:',
      a11yData.findings.length + designData.findings.length + iaData.findings.length
    );

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  }
}

// Run test
const testUrl = process.argv[2] || 'example.com';
testRealAudit(testUrl);
