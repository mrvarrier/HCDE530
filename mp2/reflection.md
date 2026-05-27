# MP2 Reflection: UX Auditor

**Project**: UX Auditor - Professional Accessibility & Performance Analysis Tool
**Live URL**: https://mp2-gamma.vercel.app/
**Repository**: https://github.com/mrvarrier/HCDE530/tree/main/mp2

---

## What I Built

I built **UX Auditor**, a web-based tool for freelance UX consultants to analyze website accessibility and performance. The tool has two modes. First, upload HTML files for WCAG 2.1 compliance checks: color contrast ratios (4.5:1 threshold), heading hierarchy (single H1, no skipped levels), image alt text, form labels, and ARIA attributes. It also analyzes navigation structure, link classification, and navigation depth. Second, enter any live URL for real-time PageSpeed Insights via Google's API: performance scores, Core Web Vitals (FCP, LCP, TBT, CLS, Speed Index), optimization opportunities with time savings, and live accessibility issues. Results display in interactive reports with pie charts, circular score gauges, and progress bars. Users export as JSON, CSV, or professional PDF reports for clients. Built on Vercel serverless with React frontend and Node.js API functions.

## What Decisions I Made

I chose **Vercel serverless** over traditional hosting because consultants need instant availability without server maintenance. I implemented **client-side HTML parsing** (FileReader API) instead of server uploads to avoid GDPR concerns with sensitive client data. For PageSpeed, I selected Google's official API over WebPageTest because Core Web Vitals are the industry standard clients trust. I **expanded scope significantly** from MP2a: originally just HTML analysis, but added PageSpeed when I realized consultants need both static (code structure) and runtime (live performance) analysis. The biggest scope change was **PDF export** — initially planned JSON/CSV only, but consultants need client-ready deliverables. I chose **jsPDF over print-to-PDF** for programmatic control: automated tables, multi-page pagination, and consistent formatting. Selected **React with Vite over Next.js** because this single-page app needs no SSR.

## What I Would Do Differently

**First, implement TypeScript from day one**. Google's PageSpeed API returns deeply nested JSON (`data.lighthouseResult.audits['first-contentful-paint']?.displayValue`) with dozens of optional fields. I spent hours debugging "Cannot read property of undefined" errors that TypeScript would catch during development. The `opportunities` filtering crashed twice because I assumed `audit.details` existed — TypeScript interfaces would force handling optional cases upfront.

**Second, build PageSpeed result caching**. Each analysis takes 30-60 seconds. Consultants often analyze URLs twice (before/after improvements) and wait another minute unnecessarily. I would implement localStorage caching with 1-hour TTL: store by `${url}_${strategy}`, check cache before API calls, show "Using cached results from 15 minutes ago — Run fresh?" This requires ~50 lines in `PageSpeedInsights.jsx` but dramatically improves consultant workflow when iterating.

## What This Work Demonstrates

**C8 (Building and Deploying)** — Deployed at https://mp2-gamma.vercel.app/ with serverless APIs (`api/analyze.js`, `api/pagespeed.js`), React components, three export formats. Fixed post-deployment bugs: Cheerio compatibility (`headings.js:29`), timeout (`vercel.json:20`), jsPDF imports (`ExportButtons.jsx:3`) with documented commit messages.

**C2 (Documentation)** — README explains WCAG thresholds for non-technical readers. Comments (`api/analyze.js:28-32`) explain Promise.all reduces time 500ms→150ms. Commits describe what and why.

**C4 (APIs)** — `api/pagespeed.js` integrates Google API v5 with env authentication, parses complex JSON, handles JSON/HTTP/timeout errors. AbortController (49-53) prevents hanging.

**C7 (Critical Evaluation)** — jsPDF failed; checked docs, found v4.2.1/v2.5.2 incompatibility, upgraded. PageSpeed timed out; tested URLs, measured 45s latency, increased timeout to 60s from evidence.