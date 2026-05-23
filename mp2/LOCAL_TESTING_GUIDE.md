# Local Testing Guide

## Quick Start - Test Real Web Scraping Locally

This guide will help you test the real web scraping functionality on your local machine before deploying to Vercel.

---

## Prerequisites

- ✅ Node.js 20+ installed
- ✅ npm installed
- ✅ All dependencies installed (`npm install` in both root and api directories)

---

## Step 1: Start the Backend Server

The backend needs to run on `localhost:3000` for the frontend to connect.

### Option A: Using Vercel Dev (Recommended)

```bash
# Make sure you're in the project root
cd /Users/manishvarrier/Documents/HCDE530/mp2

# Install Vercel CLI if not already installed
npm install -g vercel

# Start Vercel dev server (this runs the serverless functions locally)
vercel dev --listen 3000
```

**Expected Output:**
```
Vercel CLI 28.x.x
> Ready! Available at http://localhost:3000
```

**Note**: First time running `vercel dev` will ask some questions:
- "Set up and develop...?" → **Yes**
- "Which scope...?" → Choose your account
- "Link to existing project?" → **No**
- "What's your project's name?" → **mp2** (or whatever you prefer)
- "In which directory...?" → **.** (current directory)

### Option B: Direct Node Execution (Alternative)

If Vercel dev doesn't work, you can test endpoints directly:

```bash
# Navigate to api directory
cd api

# Run test script
node test-endpoints.js
```

This will test the endpoints with mock data but won't start a server.

---

## Step 2: Start the Frontend Server

In a **NEW TERMINAL WINDOW** (keep backend running in first terminal):

```bash
# Navigate to project root
cd /Users/manishvarrier/Documents/HCDE530/mp2

# Start Vite dev server
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Step 3: Test in Browser

1. **Open Browser**: Navigate to `http://localhost:5173/mp2/`

2. **Verify Setup**:
   - Page should load normally
   - You should see "Use Real Performance Data" toggle in header
   - Click "Start Audit" button should be visible

3. **Check Console** (Open DevTools → Console):
   - Look for: `[Enhanced Audit] Using real web scraping`
   - This confirms real scraping is enabled

---

## Step 4: Run Your First Real Audit

### Test with a Simple Website

**Recommended test sites** (least likely to block scraping):

1. **example.com** - Simple, always works
2. **github.com** - Good navigation structure
3. **wikipedia.org** - Good test for IA
4. **Your own website** - If you have one

### Steps:

1. **Enter URL**: Type `example.com` in the input field
2. **Click "Run Audit"**
3. **Watch Progress**: You should see 8 steps:
   ```
   ✓ Preparing browser
   ✓ Fetching website
   ✓ Analyzing accessibility
   ✓ Extracting design system
   ✓ Mapping navigation structure
   ✓ Running performance tests
   ✓ Generating recommendations
   ✓ Finalizing audit report
   ```

4. **Wait**: Real scraping takes 15-30 seconds (vs 8s simulated)

5. **Check Results**: Look for:
   - Real accessibility findings (specific element counts)
   - Real fonts extracted from the site
   - Real colors from the CSS
   - Real navigation structure

---

## Step 5: Verify Real Data

### How to Know It's Working:

#### Check 1: Console Logs
Open DevTools → Console, you should see:
```
[Enhanced Audit] Using real web scraping
[Scrape] Starting scrape for: example.com
[A11y] Starting accessibility analysis for: example.com
[Design] Starting design analysis for: example.com
[IA] Starting IA analysis for: example.com
```

#### Check 2: Data Source Badge
In the audit results, you should see indicators that data is real:
- "Real Performance Data" badge if PageSpeed API worked
- Specific element counts (not rounded numbers)
- Actual fonts from the website (not generic ones)

#### Check 3: Different Results for Different URLs
- Audit `example.com` → Note the results
- Audit `github.com` → Results should be completely different
- If both have same generic findings → still using simulation

---

## Troubleshooting

### Backend Server Won't Start

**Error**: `Error: listen EADDRINUSE :::3000`
**Solution**: Port 3000 is already in use
```bash
# Find what's using port 3000
lsof -ti:3000

# Kill that process
kill -9 $(lsof -ti:3000)

# Try again
vercel dev --listen 3000
```

---

### Frontend Can't Connect to Backend

**Error in Console**: `Failed to fetch` or `Network error`

**Check**:
1. Is backend server running? (Check first terminal)
2. Is it on port 3000? (Should show `http://localhost:3000`)
3. Check `.env` file exists with `VITE_ENABLE_SCRAPING=true`
4. Restart frontend server after creating `.env`

**Solution**:
```bash
# Stop frontend (Ctrl+C in terminal 2)
# Restart it
npm run dev
```

---

### Scraping Times Out

**Error**: `Failed to scrape website`

**Possible Causes**:
1. **Website blocks scrapers**: Try a different site (example.com always works)
2. **Slow internet**: Increase timeout in `src/config.js` (line 30)
3. **Playwright not installed**:
   ```bash
   cd api
   npx playwright install chromium
   ```

---

### Still Getting Simulated Data

**Check**:
1. `.env` file exists in project root? (`ls -la .env`)
2. File contains `VITE_ENABLE_SCRAPING=true`?
3. Did you restart frontend after creating `.env`?
4. Check console for `[Enhanced Audit] Using real web scraping`

**If still not working**:
```bash
# Check if environment variable is loaded
# Add this temporarily to src/App.jsx
console.log('Real scraping enabled:', import.meta.env.VITE_ENABLE_SCRAPING);

# Should log: "Real scraping enabled: true"
```

---

### Playwright Errors

**Error**: `browserType.launch: Executable doesn't exist`

**Solution**: Install Playwright browsers
```bash
cd api
npx playwright install
# or just chromium
npx playwright install chromium
```

---

## Testing Checklist

Use this checklist to verify everything works:

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Browser loads the app at `localhost:5173/mp2/`
- [ ] Console shows "Using real web scraping"
- [ ] Audit of `example.com` completes successfully
- [ ] Results show real accessibility findings
- [ ] Results show real fonts (not generic ones)
- [ ] Results show real colors from the site
- [ ] Results show real navigation structure
- [ ] Audit of different URL gives different results
- [ ] PageSpeed data loads (if toggle is ON)
- [ ] Screenshots appear in metadata (check console)

---

## What to Test

### Test Cases:

#### 1. Happy Path (Everything Works)
- URL: `example.com`
- Expected: Simple results, 1-2 accessibility issues, basic fonts

#### 2. Complex Site
- URL: `github.com`
- Expected: Multiple navigation levels, real GitHub fonts/colors

#### 3. E-commerce
- URL: `amazon.com` or `etsy.com`
- Expected: Product navigation, e-commerce classification
- ⚠️ May block scraping (Cloudflare protection)

#### 4. Blog
- URL: `medium.com` or a personal blog
- Expected: Article navigation, blog classification

#### 5. Error Handling
- URL: `https://thissitedoesnotexist123456.com`
- Expected: Graceful error message, doesn't crash

---

## Expected Performance

### Timing:
- **Simulation Mode**: 8 seconds
- **Real Scraping Mode**: 15-30 seconds
  - Scraping: 5-10s
  - Accessibility: 2-3s
  - Design: 1-2s
  - IA: 1-2s
  - PageSpeed: 3-5s (if enabled)
  - Processing: 1-2s

### Resource Usage:
- **Backend**: ~200MB RAM (Playwright browser)
- **Frontend**: ~100MB RAM
- **Network**: ~500KB-2MB per audit (depends on site)

---

## Debugging Tips

### Enable Verbose Logging

Add this to `src/utils/realAuditEngine.js` at the top:
```javascript
const DEBUG = true;
const log = (...args) => DEBUG && console.log('[RealAudit]', ...args);
```

Then add `log()` calls throughout to see detailed progress.

### Check Backend Response

In DevTools → Network tab:
1. Filter by "Fetch/XHR"
2. Find requests to `localhost:3000/api/*`
3. Click on request → Preview tab
4. Should see JSON response with real data

### Check API Directly

Test backend independently:
```bash
# Test scrape endpoint
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url":"example.com"}'

# Should return JSON with html, metadata, screenshot
```

---

## When Everything Works

You should see:
- ✅ Real accessibility violations with specific element counts
- ✅ Actual fonts used on the website
- ✅ Real color palette extracted from CSS
- ✅ Real navigation structure from the site
- ✅ Different results for different URLs
- ✅ Longer audit time (15-30s instead of 8s)
- ✅ "Real Performance Data" if PageSpeed enabled

**Next Step**: If everything works locally, you're ready to deploy to Vercel!

---

## Quick Command Reference

```bash
# Terminal 1: Start backend
vercel dev --listen 3000

# Terminal 2: Start frontend
npm run dev

# Test backend independently
cd api && node test-endpoints.js

# Install Playwright browsers
cd api && npx playwright install chromium

# Check what's using port 3000
lsof -ti:3000
```

---

## Need Help?

If something doesn't work:
1. Check this troubleshooting section first
2. Look at console errors (both terminal and browser)
3. Verify both servers are running
4. Try with `example.com` first (always works)
5. Check that `.env` file exists and has correct settings

**Common Issue**: "Still getting simulated data"
- Most likely: `.env` file not created or frontend not restarted after creating it
