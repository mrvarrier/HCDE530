# Debug Guide - Verifying Data Generation

## Quick Test: Is the Audit Engine Working?

### Step 1: Start the App
```bash
cd /Users/manishvarrier/Documents/HCDE530/mp2
npm run dev
```

Visit: `http://localhost:5175/mp2/` (or whatever port Vite shows)

### Step 2: Run a Test Audit

1. **On the landing page**, you should see:
   - Hero section with "Professional UX Website Auditor"
   - URL input form
   - Example URLs at the bottom

2. **Enter a test URL**:
   - Try: `amazon.com` (ecommerce)
   - Or: `stripe.com` (marketing)
   - Or: `notion.so` (saas)

3. **Click "Run UX Audit"**

4. **Watch the progress**:
   - Should show 8-9 animated steps
   - Takes 8-10 seconds (or 12-18 with PageSpeed ON)

5. **View Results Dashboard**:
   - Should see 5 tabs: Overview, Performance, Findings, Recommendations, Summary
   - Click through each tab

### Step 3: Verify Data is NOT Placeholder

Check these specific items:

#### ✅ Overview Tab Should Show:
- [ ] **URL** at top (e.g., "amazon.com")
- [ ] **Site Type Badge** (e.g., "E-commerce")
- [ ] **Overall Score** (a number 50-95, NOT "N/A" or "0")
- [ ] **5 Score Cards**: Accessibility, Design, Info Architecture, Performance, Usability (each with number)
- [ ] **Executive Summary** with actual text mentioning the URL
- [ ] **Top Priority Issues** (2-3 specific issues with descriptions)

#### ✅ Performance Tab Should Show:
- If **PageSpeed is OFF**: Info message about simulated data
- If **PageSpeed is ON**:
  - [ ] **Core Web Vitals** cards with actual values (e.g., "2.5s", "0.1")
  - [ ] **Color coding**: Green/Yellow/Red based on performance
  - [ ] **Performance Opportunities** list (if real data available)
  - [ ] **Resource Summary** with page size and request count

#### ✅ Findings Tab Should Show:
- [ ] **Accessibility Audit** section with specific findings
- [ ] **Design Consistency** with typography (fonts like "Inter", "Roboto") and color swatches
- [ ] **Information Architecture** with sitemap tree visualization
- [ ] **Performance + UX Friction** with specific issues

#### ✅ Recommendations Tab Should Show:
- [ ] **Quick Wins** (green border)
- [ ] **Major Improvements** (yellow border)
- [ ] **Future Enhancements** (blue border)
- Each with specific titles and descriptions

#### ✅ Summary Tab Should Show:
- [ ] **Client Report Summary** with full markdown text
- [ ] URL mentioned in summary
- [ ] Scores and findings referenced
- [ ] **Copy Summary** button that works

## Common Issues & Fixes

### Issue 1: "Everything looks like placeholders"

**Symptoms:**
- Scores show as 0 or N/A
- No findings appear
- Typography shows no fonts
- Colors are all gray

**Solution:**
Check browser console (F12) for errors:
- Look for import errors
- Look for "Cannot read property of undefined"
- Check Network tab for failed requests

### Issue 2: "Audit never completes"

**Symptoms:**
- Progress animation stays at one step
- Never shows results

**Solution:**
1. Check browser console for JavaScript errors
2. Verify network connectivity (if PageSpeed is ON)
3. Try with PageSpeed OFF
4. Check if URL is valid format

### Issue 3: "PageSpeed data not showing"

**Symptoms:**
- Performance tab shows simulation message even with PageSpeed ON
- No Core Web Vitals

**Expected:**
- PageSpeed API is rate-limited (50/day free)
- API call takes 5-10 seconds
- Some URLs might not be accessible by Google's servers
- CORS-protected sites won't work

**Solution:**
1. Check "PageSpeed ON" toggle is green in header
2. Try public websites: `stripe.com`, `github.com`, `google.com`
3. Check browser console for API errors
4. Look for "dataSource: 'hybrid'" in console logs

## Manual Console Testing

### Test 1: Generate Audit Data

Open browser console (F12) and paste:

```javascript
// Test the audit engine directly
import { generateAudit } from '/src/utils/auditEngine.js';

const audit = generateAudit('amazon.com');
console.log('=== AUDIT DATA ===');
console.log('URL:', audit.url);
console.log('Site Type:', audit.siteTypeLabel);
console.log('Overall Score:', audit.scores.overall);
console.log('All Scores:', audit.scores);
console.log('Finding Count:', audit.findings.length);
console.log('First Finding:', audit.findings[0]);
console.log('Typography Fonts:', audit.typography.fonts);
console.log('Colors:', audit.colors.colors);
console.log('=================');
```

**Expected Output:**
```
=== AUDIT DATA ===
URL: amazon.com
Site Type: E-commerce
Overall Score: 73
All Scores: {accessibility: 72, design: 75, ia: 71, performance: 70, usability: 76, overall: 73}
Finding Count: 8
First Finding: {title: "Missing alt text on product images", severity: "critical", ...}
Typography Fonts: ["Roboto", "Playfair Display"]
Colors: ["#0F172A", "#1E40AF", "#3B82F6", "#F59E0B", "#EF4444"]
=================
```

### Test 2: Check State

While on results page, in console:

```javascript
// Check React state (if you have React DevTools)
$r.props  // Should show audit prop with data
```

## Visual Verification Checklist

### Landing Page
- [ ] Hero with blue sparkle icon
- [ ] "Professional UX Website Auditor" heading
- [ ] URL input field is functional
- [ ] 4 example URLs are clickable
- [ ] 4 feature cards displayed
- [ ] PageSpeed toggle in header (green = ON, gray = OFF)

### Progress Screen
- [ ] 8 steps listed vertically
- [ ] Current step highlighted in blue
- [ ] Completed steps show green checkmark
- [ ] Progress bar fills from left to right
- [ ] "Step X of 8" text updates

### Results Dashboard
- [ ] 5 tabs visible (Overview, Performance, Findings, Recommendations, Summary)
- [ ] Active tab highlighted in blue
- [ ] "New Audit" button in header
- [ ] Content changes when clicking tabs

## Data Consistency Test

Run the **SAME URL twice** in a row:

**Expected**: Should get **IDENTICAL** results both times
- Same scores
- Same findings
- Same typography
- Same colors

**Why**: The audit engine uses deterministic seeding based on URL hash.

**If different**: Check for true randomness being used instead of seeded random.

## Success Indicators

If everything is working, you should see:

1. ✅ **Scores are varied** (not all the same number)
2. ✅ **Findings have actual content** (not "Lorem ipsum" or placeholder text)
3. ✅ **Typography shows real font names** (Inter, Roboto, Open Sans, etc.)
4. ✅ **Colors show hex codes** (#XXXXXX format)
5. ✅ **Site type is detected** (E-commerce, SaaS, Blog, etc.)
6. ✅ **Different URLs generate different results**
7. ✅ **Same URL generates same results** (consistency)
8. ✅ **Client summary contains actual analysis** (not generic template)

## If Still Seeing Placeholders

1. **Clear browser cache**: Ctrl+Shift+Delete
2. **Hard refresh**: Ctrl+Shift+R (Cmd+Shift+R on Mac)
3. **Check file was saved**: Verify `auditEngine.js` has recent timestamp
4. **Restart dev server**: Ctrl+C then `npm run dev` again
5. **Check for build errors**: Look at terminal where `npm run dev` is running
6. **Try incognito/private mode**: Rules out extension interference

## Quick Test Script

Run this in project directory:

```bash
# 1. Clean build
rm -rf node_modules dist
npm install
npm run build

# 2. Test build
npm run preview

# 3. Visit http://localhost:4173/mp2/
# 4. Run audit with any URL
# 5. Verify data appears
```

## Need More Help?

If data still looks like placeholders after following this guide:

1. Check the browser console for errors
2. Share the console output
3. Share a screenshot of what you're seeing
4. Verify which tab you're looking at (Overview, Performance, etc.)

---

**The app should generate rich, realistic UX audit data!**

Last Updated: 2026-05-20
