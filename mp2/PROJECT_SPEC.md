# UX Website Auditor - Claude Code Implementation Specification

## Project Mission

Build a professional UX audit tool for freelance consultants that analyzes uploaded HTML files and generates structured accessibility and navigation reports. Focus on objective, measurable checks that automate the data collection phase of manual audits.

---

## Technical Stack

### Frontend
- **React 18** + **Vite 5** (fast HMR, optimized builds)
- **TailwindCSS 3.4** (utility-first styling)
- **Lucide React** (consistent iconography)
- **Recharts 2** (data visualization - bar/pie charts)

### Backend (Vercel Serverless Functions)
- **Node.js 20** runtime
- **Cheerio 1.0** (jQuery-like HTML parsing, lightweight)
- **Chroma-js 2.4** (color manipulation and contrast calculations)
- **JSDOM** (optional, if DOM APIs needed beyond cheerio)

### File Upload
- **Browser FileReader API** (client-side HTML file reading)
- File size limit: 5MB (reasonable for most HTML files)
- Accepted formats: `.html`, `.htm`

---

## Project Structure

```
/
├── api/
│   └── analyze.js                 # Single analysis endpoint
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx         # Drag-drop HTML upload
│   │   ├── LoadingState.jsx       # Analysis progress indicator
│   │   ├── ReportHeader.jsx       # Summary metrics & score
│   │   ├── AccessibilityReport.jsx # Accessibility findings tab
│   │   ├── NavigationReport.jsx   # Navigation structure tab
│   │   ├── IssueCard.jsx          # Individual issue display
│   │   └── ExportButtons.jsx      # JSON/CSV download
│   ├── utils/
│   │   ├── accessibility/
│   │   │   ├── colorContrast.js   # WCAG contrast calculations
│   │   │   ├── headings.js        # Heading hierarchy analysis
│   │   │   ├── images.js          # Alt text checks
│   │   │   ├── forms.js           # Form accessibility
│   │   │   └── aria.js            # ARIA attribute checks
│   │   ├── navigation/
│   │   │   ├── structure.js       # Nav depth & breadcrumbs
│   │   │   ├── links.js           # Internal link analysis
│   │   │   └── orphans.js         # Orphaned page detection
│   │   ├── parser.js              # Cheerio HTML parsing utilities
│   │   └── export.js              # JSON/CSV generation
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── vercel.json
```

---

## Detailed Implementation Requirements

### 1. File Upload Component (`FileUpload.jsx`)

**UI Requirements**:
- Drag-and-drop zone (dashed border, hover state)
- "Click to browse" fallback
- File name display after selection
- Clear/remove file button
- File size validation (max 5MB)
- File type validation (.html, .htm only)
- Visual feedback states:
  - Empty state: "Drop HTML file here or click to browse"
  - Hover state: Blue border highlight
  - File loaded: Show filename with file icon
  - Error state: Red border with error message

**Functionality**:
```javascript
// Handle both drag-drop and click-to-browse
// Read file content as text using FileReader
// Pass HTML string to analysis endpoint
// Display loading state during analysis
```

**Error Handling**:
- File too large (>5MB): "File too large. Maximum size is 5MB"
- Wrong file type: "Please upload an HTML file (.html or .htm)"
- Empty file: "File is empty or corrupted"

---

### 2. Analysis Endpoint (`/api/analyze.js`)

**Input**:
```json
{
  "html": "<html>...</html>",
  "filename": "example.html"
}
```

**Processing Steps**:
1. Load HTML into cheerio: `const $ = cheerio.load(html, { decodeEntities: false })`
2. Run all accessibility checks in parallel (Promise.all)
3. Run navigation structure analysis
4. Aggregate results into structured report
5. Return JSON response

**Output Schema**:
```json
{
  "metadata": {
    "filename": "example.html",
    "analyzedAt": "2025-05-26T12:00:00Z",
    "pageTitle": "Extracted from <title>",
    "htmlSize": 45678
  },
  "summary": {
    "totalIssues": 42,
    "critical": 5,
    "serious": 12,
    "moderate": 15,
    "minor": 10,
    "passed": 23
  },
  "accessibility": {
    "colorContrast": {
      "passed": 15,
      "failed": 8,
      "issues": [
        {
          "severity": "serious",
          "element": "p.text-gray-400",
          "selector": "body > main > p:nth-child(3)",
          "foreground": "#9CA3AF",
          "background": "#FFFFFF",
          "contrastRatio": 2.85,
          "required": 4.5,
          "wcag": "1.4.3 Contrast (Minimum)",
          "recommendation": "Increase contrast to at least 4.5:1"
        }
      ]
    },
    "headings": {
      "passed": 18,
      "failed": 4,
      "issues": [
        {
          "severity": "moderate",
          "element": "h3",
          "selector": "body > main > section > h3",
          "description": "Heading level skipped from h1 to h3",
          "wcag": "1.3.1 Info and Relationships",
          "recommendation": "Use h2 before h3 to maintain hierarchy"
        }
      ],
      "structure": {
        "h1Count": 1,
        "h2Count": 5,
        "h3Count": 8,
        "h4Count": 3,
        "h5Count": 0,
        "h6Count": 0
      }
    },
    "images": {
      "passed": 12,
      "failed": 6,
      "issues": [
        {
          "severity": "serious",
          "element": "img",
          "selector": "body > header > img",
          "src": "/logo.png",
          "description": "Image missing alt attribute",
          "wcag": "1.1.1 Non-text Content",
          "recommendation": "Add descriptive alt text for non-decorative images"
        }
      ]
    },
    "forms": {
      "passed": 8,
      "failed": 3,
      "issues": [
        {
          "severity": "serious",
          "element": "input[type=email]",
          "selector": "form#contact > input:nth-child(2)",
          "id": "email-input",
          "description": "Input field has no associated label",
          "wcag": "3.3.2 Labels or Instructions",
          "recommendation": "Add <label for='email-input'> or aria-label attribute"
        }
      ]
    },
    "aria": {
      "passed": 15,
      "failed": 5,
      "issues": [
        {
          "severity": "moderate",
          "element": "nav",
          "selector": "body > nav",
          "description": "Navigation landmark missing aria-label",
          "wcag": "4.1.2 Name, Role, Value",
          "recommendation": "Add aria-label='Main navigation' for clarity"
        }
      ]
    }
  },
  "navigation": {
    "structure": {
      "maxDepth": 3,
      "topLevelItems": 6,
      "totalNavItems": 24,
      "hasBreadcrumbs": false
    },
    "links": {
      "totalLinks": 142,
      "internalLinks": 98,
      "externalLinks": 44,
      "anchorLinks": 12,
      "emptyHrefs": 2
    },
    "issues": [
      {
        "severity": "minor",
        "description": "Navigation depth of 3 levels may complicate user navigation",
        "recommendation": "Consider flattening navigation to 2 levels maximum"
      },
      {
        "severity": "moderate",
        "element": "a[href='']",
        "selector": "nav > ul > li:nth-child(5) > a",
        "description": "Link with empty href attribute",
        "recommendation": "Remove or add valid href destination"
      }
    ]
  }
}
```

**Error Responses**:
```json
{
  "error": "Invalid HTML",
  "message": "Failed to parse HTML: [specific error]"
}
```

**Timeout Handling**:
- Vercel limit: 10 seconds (Hobby), 60 seconds (Pro)
- Ensure analysis completes in <5 seconds for safety
- If parsing takes >3 seconds, return partial results

---

### 3. Accessibility Checks Implementation

#### 3.1 Color Contrast (`utils/accessibility/colorContrast.js`)

**Algorithm**:
```javascript
// 1. Find all text elements with visible text content
// 2. For each element:
//    - Get computed foreground color from style/class
//    - Get computed background color (walk up DOM if transparent)
//    - Calculate relative luminance (WCAG formula)
//    - Calculate contrast ratio
//    - Determine pass/fail based on font size & weight

// WCAG Requirements:
// - Normal text (< 18pt): 4.5:1
// - Large text (≥ 18pt or 14pt bold): 3:1
// - UI components: 3:1

function getRelativeLuminance(rgb) {
  const [r, g, b] = rgb.map(val => {
    const sRGB = val / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(lum1, lum2) {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}
```

**Color Extraction Strategy**:
```javascript
// Priority order:
// 1. Inline styles: style="color: #000"
// 2. Class-based: Extract from <style> tags or linked CSS
// 3. Default browser values: #000000 text, #FFFFFF background

// Use chroma-js for color parsing:
import chroma from 'chroma-js';
const color = chroma('#FF5733');
const rgb = color.rgb(); // [255, 87, 51]
```

**Handling Transparency**:
```javascript
// If background is transparent/rgba, walk up DOM:
function getBackgroundColor($element, $) {
  let bg = $element.css('background-color');
  while (isTransparent(bg) && $element.parent().length) {
    $element = $element.parent();
    bg = $element.css('background-color');
  }
  return bg || '#FFFFFF'; // Default to white
}
```

#### 3.2 Heading Hierarchy (`utils/accessibility/headings.js`)

**Checks**:
1. **Multiple H1s**: Flag if more than one `<h1>` exists
2. **Skipped Levels**: Detect jumps (h1 → h3, h2 → h5)
3. **Empty Headings**: Headings with no text content
4. **Heading Order**: Ensure logical progression

**Implementation**:
```javascript
function analyzeHeadings($) {
  const headings = [];
  $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
    const level = parseInt(elem.tagName[1]);
    const text = $(elem).text().trim();
    headings.push({ level, text, selector: getSelector(elem) });
  });

  const issues = [];

  // Check multiple h1s
  const h1Count = headings.filter(h => h.level === 1).length;
  if (h1Count > 1) {
    issues.push({
      severity: 'moderate',
      description: `${h1Count} h1 tags found. Use only one per page.`
    });
  }

  // Check skipped levels
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1].level;
    const curr = headings[i].level;
    if (curr > prev + 1) {
      issues.push({
        severity: 'moderate',
        element: `h${curr}`,
        selector: headings[i].selector,
        description: `Heading level skipped from h${prev} to h${curr}`
      });
    }
  }

  return issues;
}
```

#### 3.3 Image Accessibility (`utils/accessibility/images.js`)

**Checks**:
1. Missing `alt` attribute
2. Empty `alt=""` on non-decorative images (heuristic: large images likely not decorative)
3. Alt text quality (basic heuristics):
   - Too long (>125 chars)
   - Suspicious patterns ("image of", "picture of")
   - Filename as alt text

**Implementation**:
```javascript
function analyzeImages($) {
  const issues = [];

  $('img').each((i, elem) => {
    const $img = $(elem);
    const alt = $img.attr('alt');
    const src = $img.attr('src');

    // Missing alt
    if (alt === undefined) {
      issues.push({
        severity: 'serious',
        element: 'img',
        selector: getSelector(elem),
        src: src,
        description: 'Image missing alt attribute'
      });
    }

    // Empty alt on potentially non-decorative images
    else if (alt === '' && !seemsDecorative($img)) {
      issues.push({
        severity: 'moderate',
        element: 'img',
        selector: getSelector(elem),
        src: src,
        description: 'Empty alt on potentially non-decorative image'
      });
    }

    // Alt text quality checks
    else if (alt.length > 125) {
      issues.push({
        severity: 'minor',
        element: 'img',
        selector: getSelector(elem),
        description: 'Alt text too long (>125 characters)'
      });
    }
  });

  return issues;
}

function seemsDecorative($img) {
  // Heuristics: small size, inside link, CSS background pattern
  const width = parseInt($img.attr('width')) || 0;
  const height = parseInt($img.attr('height')) || 0;
  const isSmall = width < 50 && height < 50;
  const insideLink = $img.closest('a').length > 0;
  return isSmall || insideLink;
}
```

#### 3.4 Form Accessibility (`utils/accessibility/forms.js`)

**Checks**:
1. Inputs without labels (check for `<label for="id">` or `aria-label`)
2. Placeholder-only labels (anti-pattern)
3. Missing fieldset/legend for radio/checkbox groups
4. Submit buttons without labels

**Implementation**:
```javascript
function analyzeForms($) {
  const issues = [];

  $('input, textarea, select').each((i, elem) => {
    const $input = $(elem);
    const id = $input.attr('id');
    const type = $input.attr('type');
    const ariaLabel = $input.attr('aria-label');
    const ariaLabelledby = $input.attr('aria-labelledby');

    // Find associated label
    const hasLabel = id && $(`label[for="${id}"]`).length > 0;
    const hasAriaLabel = ariaLabel || ariaLabelledby;

    if (!hasLabel && !hasAriaLabel && type !== 'hidden' && type !== 'submit') {
      issues.push({
        severity: 'serious',
        element: elem.tagName.toLowerCase(),
        selector: getSelector(elem),
        description: 'Input field has no associated label'
      });
    }

    // Placeholder-only check
    const placeholder = $input.attr('placeholder');
    if (placeholder && !hasLabel && !hasAriaLabel) {
      issues.push({
        severity: 'moderate',
        element: elem.tagName.toLowerCase(),
        selector: getSelector(elem),
        description: 'Using placeholder as label (not accessible)'
      });
    }
  });

  return issues;
}
```

#### 3.5 ARIA Checks (`utils/accessibility/aria.js`)

**Checks**:
1. Landmarks without labels (`<nav>`, `<main>`, `<aside>`)
2. Buttons without accessible names
3. Interactive elements without roles
4. Invalid ARIA attributes

**Implementation**:
```javascript
function analyzeAria($) {
  const issues = [];

  // Check landmarks
  $('nav, main, aside, section').each((i, elem) => {
    const $elem = $(elem);
    const role = $elem.attr('role');
    const ariaLabel = $elem.attr('aria-label');
    const ariaLabelledby = $elem.attr('aria-labelledby');

    if (!ariaLabel && !ariaLabelledby && elem.tagName === 'nav') {
      issues.push({
        severity: 'moderate',
        element: elem.tagName.toLowerCase(),
        selector: getSelector(elem),
        description: 'Navigation landmark missing aria-label'
      });
    }
  });

  // Check buttons
  $('button, [role="button"]').each((i, elem) => {
    const $button = $(elem);
    const text = $button.text().trim();
    const ariaLabel = $button.attr('aria-label');

    if (!text && !ariaLabel) {
      issues.push({
        severity: 'serious',
        element: 'button',
        selector: getSelector(elem),
        description: 'Button has no accessible name'
      });
    }
  });

  return issues;
}
```

---

### 4. Navigation Structure Analysis (`utils/navigation/`)

#### 4.1 Navigation Depth (`structure.js`)

**Algorithm**:
```javascript
function analyzeNavigationStructure($) {
  const nav = $('nav').first();
  if (!nav.length) return { maxDepth: 0, issues: [] };

  // Count nesting levels of <ul>/<ol>
  let maxDepth = 0;
  nav.find('ul, ol').each((i, elem) => {
    const depth = $(elem).parents('ul, ol').length + 1;
    maxDepth = Math.max(maxDepth, depth);
  });

  // Count top-level items
  const topLevelItems = nav.find('> ul > li, > ol > li').length;

  const issues = [];
  if (maxDepth > 2) {
    issues.push({
      severity: 'minor',
      description: `Navigation depth of ${maxDepth} levels may complicate user navigation`,
      recommendation: 'Consider flattening navigation to 2 levels maximum'
    });
  }

  if (topLevelItems > 7) {
    issues.push({
      severity: 'minor',
      description: `${topLevelItems} top-level nav items exceeds recommended limit (7±2)`,
      recommendation: 'Consider grouping items or using mega-menu pattern'
    });
  }

  // Check for breadcrumbs
  const hasBreadcrumbs = $('[aria-label*="breadcrumb"], .breadcrumb, nav.breadcrumbs').length > 0;

  return { maxDepth, topLevelItems, hasBreadcrumbs, issues };
}
```

#### 4.2 Link Analysis (`links.js`)

**Checks**:
1. Total link count
2. Internal vs external links (heuristic: same domain or relative paths)
3. Anchor links (`#section`)
4. Empty hrefs
5. Links opening in new window without warning

**Implementation**:
```javascript
function analyzeLinks($) {
  const links = [];
  const issues = [];

  $('a[href]').each((i, elem) => {
    const $link = $(elem);
    const href = $link.attr('href');
    const text = $link.text().trim();
    const target = $link.attr('target');

    // Classify link type
    const isAnchor = href.startsWith('#');
    const isExternal = /^https?:\/\//.test(href) && !href.includes(window.location?.hostname || '');
    const isInternal = !isExternal && !isAnchor;

    links.push({ href, text, isAnchor, isExternal, isInternal });

    // Empty href
    if (!href || href === '#') {
      issues.push({
        severity: 'moderate',
        element: 'a',
        selector: getSelector(elem),
        description: 'Link with empty or placeholder href'
      });
    }

    // New window without warning
    if (target === '_blank' && !text.toLowerCase().includes('new window')) {
      issues.push({
        severity: 'minor',
        element: 'a',
        selector: getSelector(elem),
        description: 'Link opens in new window without warning text'
      });
    }
  });

  return {
    totalLinks: links.length,
    internalLinks: links.filter(l => l.isInternal).length,
    externalLinks: links.filter(l => l.isExternal).length,
    anchorLinks: links.filter(l => l.isAnchor).length,
    issues
  };
}
```

---

### 5. UI Components

#### 5.1 Report Header (`ReportHeader.jsx`)

**Display**:
- Filename and analysis timestamp
- Overall score (0-100 based on passed/failed ratio)
- Score visualization (circular progress or letter grade)
- Issue count breakdown (critical, serious, moderate, minor)

**Score Calculation**:
```javascript
const totalChecks = summary.passed + summary.totalIssues;
const score = Math.round((summary.passed / totalChecks) * 100);

// Letter grade
const grade =
  score >= 90 ? 'A' :
  score >= 80 ? 'B' :
  score >= 70 ? 'C' :
  score >= 60 ? 'D' : 'F';
```

#### 5.2 Accessibility Report (`AccessibilityReport.jsx`)

**Layout**:
- Tabs or accordion for each category (Color, Headings, Images, Forms, ARIA)
- Each category shows:
  - Pass/fail count badge
  - List of issues sorted by severity
  - Collapsible details for each issue

**Issue Card Display**:
- Severity badge (color-coded: red=critical, orange=serious, yellow=moderate, blue=minor)
- Element type and selector
- Description and WCAG reference
- Recommendation with "Learn more" link to WCAG docs

#### 5.3 Navigation Report (`NavigationReport.jsx`)

**Display**:
- Navigation structure metrics (depth, top-level count, breadcrumbs)
- Link statistics (total, internal, external, anchors)
- Issues list with recommendations

#### 5.4 Export Functionality (`ExportButtons.jsx`)

**JSON Export**:
```javascript
function exportJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `audit-${data.metadata.filename}-${Date.now()}.json`;
  a.click();
}
```

**CSV Export** (flattened issues):
```csv
Severity,Category,Element,Selector,Description,WCAG,Recommendation
serious,Color Contrast,p.text-gray-400,body > main > p:nth-child(3),Low contrast ratio (2.85:1),1.4.3,Increase contrast to 4.5:1
moderate,Headings,h3,body > section > h3,Skipped heading level,1.3.1,Use h2 before h3
```

---

### 6. Vercel Configuration

**vercel.json**:
```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "functions": {
    "api/**/*.js": {
      "maxDuration": 10,
      "memory": 1024
    }
  }
}
```

**vite.config.js**:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Root deployment
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
```

**package.json dependencies**:
```json
{
  "dependencies": {
    "cheerio": "^1.0.0-rc.12",
    "chroma-js": "^2.4.2",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.8"
  }
}
```

---

## Development Workflow (Claude Code Optimized)

### Phase 1: Project Setup (30 minutes)
```bash
# Initialize Vite + React
npm create vite@latest ux-auditor -- --template react
cd ux-auditor
npm install

# Install dependencies
npm install cheerio chroma-js lucide-react recharts

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Create folder structure
mkdir -p api src/components src/utils/accessibility src/utils/navigation
touch api/analyze.js
touch src/components/{FileUpload,LoadingState,ReportHeader,AccessibilityReport,NavigationReport,IssueCard,ExportButtons}.jsx
touch src/utils/accessibility/{colorContrast,headings,images,forms,aria}.js
touch src/utils/navigation/{structure,links}.js
touch src/utils/{parser,export}.js
touch vercel.json
```

### Phase 2: Backend Implementation (3-4 hours)

**Priority Order**:
1. ✅ `/api/analyze.js` - Basic structure and cheerio setup
2. ✅ `utils/parser.js` - Helper functions for cheerio
3. ✅ `utils/accessibility/headings.js` - Easiest check to start
4. ✅ `utils/accessibility/images.js` - Second easiest
5. ✅ `utils/accessibility/forms.js` - Form label checks
6. ✅ `utils/accessibility/aria.js` - ARIA attribute checks
7. ✅ `utils/accessibility/colorContrast.js` - Most complex (save for last)
8. ✅ `utils/navigation/structure.js` - Nav depth analysis
9. ✅ `utils/navigation/links.js` - Link categorization

**Testing Strategy**:
- Create `test-samples/` folder with example HTML files:
  - `simple.html` - Basic structure, few issues
  - `complex.html` - Realistic website with many issues
  - `perfect.html` - Zero accessibility issues (baseline)
- Test each utility function in isolation before integration

### Phase 3: Frontend Implementation (4-5 hours)

**Priority Order**:
1. ✅ `FileUpload.jsx` - Get file input working first
2. ✅ `App.jsx` - Wire up API call and state management
3. ✅ `LoadingState.jsx` - Simple spinner component
4. ✅ `ReportHeader.jsx` - Summary display
5. ✅ `IssueCard.jsx` - Reusable issue display
6. ✅ `AccessibilityReport.jsx` - Main report view
7. ✅ `NavigationReport.jsx` - Secondary report
8. ✅ `ExportButtons.jsx` - JSON/CSV download

**Styling Strategy**:
- Use Tailwind utility classes
- Color palette:
  - Critical: `bg-red-100 text-red-800 border-red-300`
  - Serious: `bg-orange-100 text-orange-800 border-orange-300`
  - Moderate: `bg-yellow-100 text-yellow-800 border-yellow-300`
  - Minor: `bg-blue-100 text-blue-800 border-blue-300`
  - Passed: `bg-green-100 text-green-800 border-green-300`

### Phase 4: Testing & Refinement (2-3 hours)

**Test Cases**:
1. Upload small HTML file (<100 KB) - should analyze instantly
2. Upload large HTML file (2-5 MB) - should complete in <5 seconds
3. Upload invalid file (PDF, TXT) - should show error
4. Upload empty HTML - should handle gracefully
5. Test all accessibility categories - verify issue detection
6. Test export functionality - verify JSON and CSV downloads

**Performance Optimization**:
- Run Lighthouse on deployed site (should score 90+)
- Verify API response time <3 seconds for 1MB HTML
- Check bundle size (target <500 KB initial load)

### Phase 5: Deployment (1 hour)

```bash
# Connect to Vercel
vercel login
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Verify deployment
curl https://your-app.vercel.app/api/analyze -X POST -H "Content-Type: application/json" -d '{"html":"<html><body><h1>Test</h1></body></html>"}'
```

---

## Error Handling Strategy

### Frontend Errors
```javascript
try {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, filename })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Analysis failed');
  }

  const data = await response.json();
  setResults(data);
} catch (error) {
  setError(error.message);
  console.error('Analysis error:', error);
}
```

### Backend Errors
```javascript
export default async function handler(req, res) {
  try {
    const { html, filename } = req.body;

    if (!html || typeof html !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'HTML content is required'
      });
    }

    const results = await analyzeHTML(html, filename);
    return res.status(200).json(results);

  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
}
```

---

## Success Metrics

### Technical
- ✅ API response time <3 seconds for 1MB HTML
- ✅ Zero timeout errors on Vercel
- ✅ Bundle size <500 KB
- ✅ Lighthouse score 90+ (Performance, Accessibility, Best Practices)
- ✅ Mobile-responsive (works on 375px width)

### Functional
- ✅ Detects 80%+ of WCAG Level A violations
- ✅ Generates structured JSON report
- ✅ Exports CSV with all issues
- ✅ Handles files up to 5MB
- ✅ Graceful error handling for invalid inputs

### User Experience
- ✅ Drag-and-drop file upload works smoothly
- ✅ Loading state shows progress
- ✅ Results display clearly categorized
- ✅ Export buttons work on first click
- ✅ Responsive on mobile devices

---

## Key Implementation Notes for Claude Code

1. **Use cheerio selectors efficiently**: Cache common selectors at the top of analysis functions
2. **Avoid DOM walking when possible**: Use direct selectors instead of `.parent()` loops
3. **Batch checks**: Run all accessibility checks in parallel with `Promise.all()`
4. **Use TypeScript JSDoc comments**: Add `@param` and `@returns` for better intellisense
5. **Test incrementally**: Build and test one utility function at a time
6. **Mock API responses**: Create JSON fixtures for frontend development before backend is ready
7. **Use Vite's proxy**: Configure proxy in `vite.config.js` for local API testing
8. **Deploy often**: Push to Vercel preview after each major feature
9. **Log extensively**: Add console.logs in API route for debugging on Vercel
10. **Handle edge cases**: Empty HTML, malformed HTML, missing tags

---

## Claude Code Implementation Prompt

**Final Prompt to Give Claude Code**:

> Build a UX audit web application that accepts uploaded HTML files and generates accessibility and navigation reports. Use React + Vite frontend with TailwindCSS, and Vercel serverless functions with Cheerio for parsing.
>
> **Core Features**:
> 1. Drag-and-drop HTML file upload (max 5MB)
> 2. Accessibility checks: color contrast (WCAG), heading hierarchy, image alt text, form labels, ARIA attributes
> 3. Navigation analysis: depth, link categorization, structure issues
> 4. Structured JSON report with severity-categorized issues
> 5. Export to JSON and CSV
> 6. Mobile-responsive UI with Tailwind
>
> **Technical Requirements**:
> - API endpoint: `/api/analyze.js` (accepts HTML string, returns analysis)
> - Use `cheerio` for HTML parsing (no Puppeteer)
> - Use `chroma-js` for color contrast calculations
> - Complete analysis in <5 seconds
> - Deploy to Vercel without timeout errors
> - Follow exact file structure and data schema from specification
>
> **Quality Standards**:
> - Handle errors gracefully (invalid files, parsing errors)
> - Display issues with severity badges, selectors, and WCAG references
> - Professional UI suitable for client presentations
> - Lighthouse score 90+ for accessibility and performance
>
> Implement step-by-step: backend utilities first, then API endpoint, then frontend components. Test with sample HTML files at each stage.
