# Testing Checklist - Verify Everything Works

## ⚠️ IMPORTANT: You Must RUN AN AUDIT First!

The **landing page is intentionally empty** - it's waiting for you to enter a URL and run an audit!

## Step-by-Step Test

### 1. Start the Application

```bash
cd /Users/manishvarrier/Documents/HCDE530/mp2
npm run dev
```

Open browser to the URL Vite shows (usually `http://localhost:5173/mp2/`)

---

### 2. You Should See: LANDING PAGE

#### What's Normal Here:
- ✅ Large heading: "Professional UX Website Auditor"
- ✅ Empty URL input box (THIS IS EXPECTED!)
- ✅ 4 example URLs below input: amazon.com, airbnb.com, notion.so, stripe.com
- ✅ 4 feature cards
- ✅ PageSpeed toggle in header (green or gray)

#### What's NOT Placeholder:
- The landing page is **supposed to look empty** - you haven't run an audit yet!
- This is like opening Google before typing a search

---

### 3. Run Your First Audit

**Do This:**
1. Click on example URL `amazon.com` (or type it)
2. Click the big **"Run UX Audit"** button
3. **WAIT 8-10 seconds** for progress animation

**What You'll See:**
```
Reading website structure... ✓
Checking accessibility... ✓
Extracting typography... ✓
Extracting color system... ✓
Mapping information architecture... ✓
Detecting UX inconsistencies... ✓
Generating recommendations... ✓
Preparing client summary... ✓
```

---

### 4. NOW Check for Real Data

After progress completes, you'll see the **RESULTS DASHBOARD**.

## ✅ OVERVIEW TAB - What Real Data Looks Like

### Website Info Card
```
amazon.com [external link icon]
E-commerce badge

Overall Score
    73
    Good
```

**✅ REAL DATA = Number between 50-95**
**❌ PLACEHOLDER = "0", "N/A", or missing**

### Score Cards Row
```
┌─────────────┬─────────┬──────────────────┬─────────────┬───────────┐
│Accessibility│ Design  │Info Architecture │Performance  │ Usability │
│     72      │   75    │       71         │     68      │    74     │
│  out of 100 │out of 100│   out of 100    │ out of 100  │out of 100 │
└─────────────┴─────────┴──────────────────┴─────────────┴───────────┘
```

**✅ REAL DATA = All different numbers, some green/yellow/red backgrounds**
**❌ PLACEHOLDER = All zeros or all the same number**

### Executive Summary
```
This UX audit identified 8 findings across accessibility, design,
information architecture, and performance categories. The website
scored 73/100 overall, indicating good user experience quality.
Immediate attention required for 2 high-priority issues.
```

**✅ REAL DATA = Mentions actual number of findings and score**
**❌ PLACEHOLDER = Generic text with "[X findings]" or "Lorem ipsum"**

### Top Priority Issues
```
🔴 Missing alt text on product images (critical, accessibility)
Users cannot identify products with screen readers
Recommendation: Add descriptive alt text to all product images...

🟠 Checkout form lacks proper labels (critical, accessibility)
Users with screen readers cannot complete purchases
Recommendation: Ensure all form inputs have associated labels...
```

**✅ REAL DATA = Specific, contextual issues (e.g., "product images" for amazon.com)**
**❌ PLACEHOLDER = Generic "Issue 1", "Issue 2" or repeated text**

---

## ✅ PERFORMANCE TAB - What Real Data Looks Like

### If PageSpeed is OFF:
```
ℹ️ Using Simulated Performance Data
This audit is currently using simulated performance data...
```
**This is CORRECT - not a bug!**

### If PageSpeed is ON (and API succeeds):
```
✅ Real Performance Data
Powered by Google PageSpeed Insights

Core Web Vitals:
┌────────┬────────┬────────┬────────┐
│  LCP   │  FID   │  CLS   │  FCP   │
│ 2.5 s  │100 ms  │  0.12  │ 1.8 s  │
│  🟡    │  🟢    │  🟡    │  🟢    │
└────────┴────────┴────────┴────────┘
```

**✅ REAL DATA = Actual metrics from Google (e.g., "2.5 s", "100 ms")**
**❌ PLACEHOLDER = "N/A", "0.0", or missing values**

---

## ✅ FINDINGS TAB - What Real Data Looks Like

### Accessibility Audit Section
```
👁️ Accessibility Audit

🔴 Missing alt text on product images (critical)
Impact: Screen reader users cannot identify products
Recommendation: Add descriptive alt text to all product images...

🟡 Product filter buttons too small (moderate)
Impact: Mobile users have difficulty tapping
Recommendation: Increase touch target size to minimum 44x44px...
```

**✅ REAL DATA = Specific findings relevant to site type (e.g., "product" for ecommerce)**
**❌ PLACEHOLDER = Generic "Accessibility Issue 1", "Fix this problem"**

### Design Consistency Section

**Typography:**
```
Font Families:
  Roboto
  Playfair Display

Type Scale:
[12px] [14px] [16px] [18px] [20px] [24px] [32px] [48px]
```

**✅ REAL DATA = Actual font names (Inter, Roboto, Open Sans, etc.)**
**❌ PLACEHOLDER = "Font 1", "Font 2", or empty**

**Color Palette:**
```
[Dark blue] [Blue] [Light blue] [Orange] [Red]
#0F172A    #1E40AF  #3B82F6     #F59E0B   #EF4444

Primary: #1E40AF
Secondary: #3B82F6
Accent: #F59E0B
```

**✅ REAL DATA = Hex color codes with visible color swatches**
**❌ PLACEHOLDER = "#000000" all black, or no colors shown**

### Information Architecture Section

**Site Structure:**
```
Home
  └─ Products
      └─ Category 1
      └─ Category 2
      └─ Category 3
  └─ Cart
  └─ Checkout
  └─ Account
      └─ Orders
      └─ Profile

Navigation Depth: 3 levels
Complexity: moderate
```

**✅ REAL DATA = Tree structure with pages relevant to site type**
**❌ PLACEHOLDER = "Page 1", "Page 2", flat list**

---

## ✅ RECOMMENDATIONS TAB - What Real Data Looks Like

```
🎯 UX Recommendations

⚡ Quick Wins (High impact / Low effort)
┌─────────────────────────────────────────┐
│ Quick win: Product filter buttons too   │
│ small                                    │
│ Category: accessibility                  │
│ Increase touch target size to 44x44px   │
└─────────────────────────────────────────┘

📈 Major Improvements (High impact / Medium effort)
┌─────────────────────────────────────────┐
│ Priority fix: Missing alt text on       │
│ product images                           │
│ Category: accessibility                  │
│ Add descriptive alt text to all images  │
└─────────────────────────────────────────┘
```

**✅ REAL DATA = Specific recommendations from findings**
**❌ PLACEHOLDER = "Recommendation 1", generic advice**

---

## ✅ SUMMARY TAB - What Real Data Looks Like

```
# UX Audit Summary: amazon.com

## Executive Summary
amazon.com (E-commerce) received an overall UX score of 73/100,
indicating good user experience quality. This audit identified
8 findings across accessibility, design, information architecture,
and performance categories.

## Key Findings
• 2 Critical Issues requiring immediate attention
• 1 High-Priority Issues that significantly impact user experience
• Accessibility Score: 72/100 - good
• Design Consistency: 75/100 - good
...
```

**✅ REAL DATA = Full markdown report with actual URL, scores, and findings**
**❌ PLACEHOLDER = "Your website", "[score]", template text**

**Copy Summary button should copy this entire text to clipboard!**

---

## Testing Different Site Types

Run audits for **different URLs** to verify variation:

### Test 1: E-commerce
```
URL: amazon.com
Expected Site Type: E-commerce
Expected Findings: Product images, checkout flow, cart issues
```

### Test 2: SaaS
```
URL: notion.so
Expected Site Type: SaaS Application
Expected Findings: Dashboard navigation, form issues, onboarding
```

### Test 3: Blog
```
URL: medium.com
Expected Site Type: Blog / Content
Expected Findings: Reading width, typography, article categorization
```

### Test 4: Marketing
```
URL: stripe.com
Expected Site Type: Marketing / Corporate
Expected Findings: Hero images, CTA buttons, video content
```

**✅ EACH URL TYPE SHOULD HAVE DIFFERENT FINDINGS**

---

## Consistency Test

Run the **SAME URL twice**:

1. Run audit for `amazon.com`
2. Note the overall score (e.g., 73)
3. Click "New Audit"
4. Run audit for `amazon.com` again
5. **Should get EXACT SAME score (73) and findings**

**✅ PASS = Same results**
**❌ FAIL = Different results (means randomness not seeded)**

---

## Common Mistakes

### ❌ Mistake 1: Only Looking at Landing Page
**Problem:** "Everything looks empty!"
**Solution:** You must click "Run UX Audit" first!

### ❌ Mistake 2: Not Waiting for Progress
**Problem:** "Audit never finishes"
**Solution:** Wait 8-10 seconds for animation to complete

### ❌ Mistake 3: Expecting Real Web Scraping
**Problem:** "It's not analyzing the actual website"
**Solution:** This is a **simulated** audit engine (by design, per project requirements)

### ❌ Mistake 4: PageSpeed Always Works
**Problem:** "Performance tab says simulated"
**Solution:**
- PageSpeed API has rate limits (50/day free)
- Some sites block Google's crawler
- Toggle must be ON (green)
- Requires internet connection

---

## Quick Visual Test

If you see these, **everything is working**:

- ✅ Different URLs → Different scores
- ✅ Each audit has 6-10 findings
- ✅ Typography shows font names (Inter, Roboto, etc.)
- ✅ Colors show as hex codes (#XXXXXX)
- ✅ Sitemap shows tree structure
- ✅ Client summary mentions the actual URL
- ✅ Scores are varied (not all 50 or all 100)
- ✅ Same URL → Same results (consistency)

---

## Still Having Issues?

### Check Browser Console (F12):
1. Look for JavaScript errors (red text)
2. Check Network tab for failed requests
3. Look for import/module errors

### Try These:
```bash
# 1. Clean install
rm -rf node_modules dist
npm install

# 2. Rebuild
npm run build

# 3. Preview production build
npm run preview

# Visit http://localhost:4173/mp2/
```

---

## Summary: What's Real vs. Placeholder

### REAL DATA (Generated):
- ✅ Scores (50-95 range)
- ✅ Findings (8-15 per audit)
- ✅ Typography (actual font names)
- ✅ Colors (hex codes with swatches)
- ✅ Site structure (tree visualization)
- ✅ Recommendations (impact/effort matrix)
- ✅ Client summary (full markdown report)

### INTENTIONALLY "EMPTY" (Not Placeholder):
- Landing page before audit
- Performance tab when PageSpeed is OFF
- No audit history initially

### SHOULD NEVER BE PLACEHOLDER:
- Scores showing as 0 or N/A
- Findings saying "Issue 1", "Issue 2"
- Typography with no fonts
- Colors all gray or black
- Client summary with "[Your Website]"

**If you're seeing actual placeholder text after running an audit, that's a bug. But the landing page being empty is correct!**

---

Last Updated: 2026-05-20
