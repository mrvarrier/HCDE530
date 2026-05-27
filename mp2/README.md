# UX Auditor

A professional web-based tool for analyzing website accessibility, navigation, and performance. Built for UX designers, freelance consultants, and web developers who need quick, actionable insights about website quality.

## What It Does

UX Auditor provides two types of analysis:

### 1. HTML File Analysis
Upload any HTML file and get a comprehensive accessibility and navigation audit that checks:
- **WCAG 2.1 Accessibility Compliance**: Color contrast ratios, heading hierarchy, image alt text, form labels, and ARIA attributes
- **Navigation Structure**: Link analysis, navigation depth, and usability patterns
- **Structured Reporting**: Issues categorized by severity (critical, serious, moderate, minor)

### 2. PageSpeed Insights
Enter any live website URL and get real-time performance metrics from Google PageSpeed Insights:
- **Performance Scores**: Overall scores for Performance, Accessibility, Best Practices, and SEO
- **Core Web Vitals**: First Contentful Paint, Largest Contentful Paint, Total Blocking Time, Cumulative Layout Shift, Speed Index
- **Optimization Opportunities**: Actionable recommendations with potential time savings
- **Accessibility Issues**: Real-time detection of accessibility problems on live sites

## Who It's For

- **Freelance UX Consultants**: Generate professional audit reports for clients quickly
- **Web Developers**: Validate accessibility compliance before launch
- **UX Designers**: Identify usability issues in navigation and information architecture
- **Product Managers**: Get quantifiable metrics on website quality
- **Students & Educators**: Learn about web accessibility and performance standards

## How to Use It

### Access the Live Tool
Visit: **https://mp2-gamma.vercel.app/**

### For HTML File Analysis:
1. Click the **"HTML File Analysis"** tab
2. Drag and drop an HTML file (or click to browse)
3. Wait 5-10 seconds for analysis
4. Review the detailed report
5. Export results as JSON, CSV, or PDF

### For PageSpeed Insights:
1. Click the **"PageSpeed Insights"** tab
2. Enter a valid website URL (must include `https://`)
3. Wait 30-60 seconds for analysis (Google PageSpeed API takes time)
4. Review performance metrics and recommendations

## Understanding the Reports

### HTML Analysis Report

#### **Report Header**
- **Overall Score**: Calculated as `(Passed Checks / Total Checks) × 100`
- **Letter Grade**: A (90%+), B (80-89%), C (70-79%), D (60-69%), F (<60%)
- **Issue Distribution Chart**: Pie chart showing breakdown of passed checks vs. issues by severity
- **Metadata**: File name, file size, analysis timestamp

#### **Accessibility Report**
Checks five critical accessibility areas:

**1. Color Contrast**
- Validates text-to-background contrast ratios against WCAG 2.1 standards
- **Pass Threshold**: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)
- **What it checks**: All text elements with computed background colors
- **Why it matters**: Low contrast makes text unreadable for users with visual impairments

**2. Heading Hierarchy**
- Ensures proper heading structure (`<h1>` through `<h6>`)
- **Pass Threshold**: Single `<h1>` per page, no skipped levels (e.g., `<h1>` → `<h3>` skips `<h2>`)
- **What it checks**: All heading tags and their nesting order
- **Why it matters**: Screen readers use headings to navigate; broken hierarchy confuses assistive technology

**3. Image Accessibility**
- Validates that images have meaningful alt text
- **Pass Threshold**: All `<img>` tags have non-empty `alt` attributes
- **What it checks**: Presence and quality of alt text (flags generic text like "image" or "picture")
- **Why it matters**: Screen readers cannot interpret images without alt text

**4. Form Accessibility**
- Ensures form inputs have associated labels
- **Pass Threshold**: Every `<input>`, `<select>`, `<textarea>` has a `<label>` or `aria-label`
- **What it checks**: Label-input associations and ARIA labeling
- **Why it matters**: Users need to know what each form field is for; critical for screen reader users

**5. ARIA Attributes**
- Validates proper use of ARIA (Accessible Rich Internet Applications) attributes
- **Pass Threshold**: Valid `role`, `aria-label`, `aria-labelledby`, `aria-describedby` attributes
- **What it checks**: Presence and correctness of ARIA attributes
- **Why it matters**: ARIA enhances accessibility for dynamic web applications

#### **Navigation Report**

**Links Analysis**
- **Total Links**: Count of all `<a>` tags with `href` attributes
- **Internal Links**: Links to same domain (e.g., `/about`)
- **External Links**: Links to other domains (e.g., `https://google.com`)
- **Anchor Links**: Links to page sections (e.g., `#section-1`)
- **Empty Hrefs**: Links with no destination (flagged as errors)

**Navigation Issues**
- **Too Deep**: Navigation with more than 2 levels (e.g., Menu → Submenu → Sub-submenu → Sub-sub-submenu)
- **Too Many Items**: More than 7 top-level navigation items (exceeds cognitive load limits)
- **Empty Navigation**: `<nav>` elements with no items
- **Missing Navigation**: No `<nav>` landmark element found

### PageSpeed Insights Report

#### **Performance Scores**
Circular gauges showing scores from 0-100:
- **Green (90-100)**: Good
- **Orange (50-89)**: Needs Improvement
- **Red (0-49)**: Poor

**Metrics Measured:**
1. **Performance**: Overall page load speed and responsiveness
2. **Accessibility**: Same WCAG checks as HTML analysis, but on live site
3. **Best Practices**: Modern web development standards (HTTPS, console errors, deprecated APIs)
4. **SEO**: Search engine optimization (meta tags, crawlability, mobile-friendliness)

#### **Core Web Vitals**
Google's official user experience metrics:

- **First Contentful Paint (FCP)**: Time until first text/image appears
  - **Good**: < 1.8s | **Needs Improvement**: 1.8-3.0s | **Poor**: > 3.0s

- **Largest Contentful Paint (LCP)**: Time until main content is visible
  - **Good**: < 2.5s | **Needs Improvement**: 2.5-4.0s | **Poor**: > 4.0s

- **Total Blocking Time (TBT)**: How long page is unresponsive during load
  - **Good**: < 200ms | **Needs Improvement**: 200-600ms | **Poor**: > 600ms

- **Cumulative Layout Shift (CLS)**: How much page layout shifts unexpectedly
  - **Good**: < 0.1 | **Needs Improvement**: 0.1-0.25 | **Poor**: > 0.25

- **Speed Index**: How quickly content is visually populated
  - **Good**: < 3.4s | **Needs Improvement**: 3.4-5.8s | **Poor**: > 5.8s

#### **Optimization Opportunities**
Actionable recommendations ranked by potential time savings:
- Shows what to fix first (largest impact)
- Includes specific resources to optimize (images, scripts, CSS)
- Displays milliseconds saved per optimization

#### **Accessibility Issues**
Real-time accessibility problems detected on the live site:
- Same categories as HTML analysis
- Scored from 0-100 (higher is better)
- Issues listed with severity and remediation steps

## Export Options

### JSON Export
- Raw structured data
- Useful for integrating with other tools or databases
- Contains all analysis results in machine-readable format

### CSV Export
- Tabular format with all issues in rows
- Easy to import into Excel or Google Sheets
- Good for sorting, filtering, and sharing with non-technical stakeholders

### PDF Export
- Professional formatted report
- Includes summary, all issues by category, and metadata
- Ready to send to clients or include in project documentation

## Running Locally

If you want to run this tool on your own machine:

### Prerequisites
- Node.js 20+ installed
- Git installed
- A Google PageSpeed API key (free from [Google Cloud Console](https://console.cloud.google.com/))

### Installation
```bash
# Clone the repository
git clone [your-repo-url]
cd mp2

# Install dependencies
npm install

# Create environment file
echo "VITE_PAGESPEED_API_KEY=your-api-key-here" > .env.local

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production
```bash
npm run build
```

Output will be in the `dist/` folder.

## Technology Stack

- **Frontend**: React 18, Vite 5, TailwindCSS 3.4
- **UI Components**: Lucide React (icons), Recharts 2 (data visualization)
- **HTML Parsing**: Cheerio 1.0 (server-side DOM manipulation)
- **Color Analysis**: Chroma.js 2.4 (WCAG contrast ratio calculations)
- **PDF Generation**: jsPDF 2.5.2 + jspdf-autotable 3.8.4
- **API Integration**: Google PageSpeed Insights API v5
- **Deployment**: Vercel (serverless functions with 60s timeout)

## Recent Updates

### Version 1.2 (May 26, 2026)
- ✅ **Website Favicon**: Added complete favicon package with support for all devices and browsers
- ✅ **PageSpeed Insights**: Real-time performance analysis with Core Web Vitals
- ✅ **PDF Export**: Professional PDF reports with tables and multi-page support
- ✅ **Enhanced Meta Tags**: SEO-optimized meta description and theme color
- ✅ **Upgraded Libraries**: jsPDF v2.5.2 for better PDF compatibility

### Version 1.1 (May 25, 2026)
- ✅ **Modern UI/UX**: Gradient designs, animations, and improved data visualization
- ✅ **Progress Bars**: Visual pass rate indicators in accessibility report
- ✅ **Pie Charts**: Issue distribution visualization using Recharts
- ✅ **Export Options**: JSON, CSV, and PDF export functionality

### Version 1.0 (May 24, 2026)
- ✅ **Initial Release**: HTML accessibility and navigation analysis
- ✅ **WCAG 2.1 Compliance Checks**: 5 comprehensive accessibility categories
- ✅ **Navigation Analysis**: Link classification and structure validation
- ✅ **Vercel Deployment**: Serverless architecture with automatic deployments

## Limitations & Known Issues

1. **PageSpeed Analysis Time**: Google's API can take 30-60 seconds for complex sites
2. **HTML Upload Size**: Limited to 5MB per file (browser constraint)
3. **Client-Side Processing**: HTML analysis happens in the browser, not on a server
4. **Static Analysis Only**: HTML analysis checks structure, not runtime behavior
5. **No Authentication**: Anyone with the URL can use the tool

## Future Enhancements

- Batch analysis for multiple pages
- Historical tracking of scores over time
- Desktop vs. mobile strategy selection for PageSpeed
- Automated screenshot comparison
- Integration with CI/CD pipelines
- Custom accessibility rule configuration

## Credits

Built for HCDE 530 at the University of Washington.

## License

MIT License - feel free to use, modify, and distribute.
