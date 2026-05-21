# UX Website Auditor

A professional browser-based tool for freelance UX/UI consultants to quickly audit websites and generate comprehensive client-ready reports.

![UX Website Auditor](https://img.shields.io/badge/Built%20with-React%20%2B%20Vite-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?logo=tailwind-css)
![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-222222?logo=github)

## 🎯 Project Overview

This is a Human-Centered Design (HCD) class project that demonstrates a workflow tool designed for freelance UX/UI consultants who need to:

- **Quickly understand** a client's website
- **Identify UX problems** systematically
- **Detect accessibility issues** based on WCAG guidelines
- **Review design consistency** across typography and color systems
- **Prepare professional findings** for client presentations

## ✨ Key Features

### ⚡ Real Performance Data (NEW!)

- **Google PageSpeed Insights Integration**: Optional real-world performance metrics
- **Core Web Vitals**: Actual LCP, FID, CLS, FCP, TTI, TBT, Speed Index from Lighthouse
- **Hybrid Mode**: Combines real performance data with simulated UX insights
- **Toggle On/Off**: Enable/disable PageSpeed API calls with one click
- **No API Key Required**: Works out-of-the-box with free tier (50 queries/day)

### 🔍 Comprehensive Audit Categories

- **Accessibility**: WCAG compliance, contrast ratios, alt text, keyboard navigation, screen reader compatibility
- **Design Consistency**: Typography analysis, color palette extraction, component consistency, spacing issues
- **Information Architecture**: Site structure visualization, navigation depth analysis, complexity assessment
- **Performance & UX Friction**: Real PageSpeed data + UX implications, image optimization, mobile responsiveness
- **Prioritized Recommendations**: Impact/effort matrix with quick wins, major improvements, and future enhancements

### 📊 Professional Dashboard

- Overall UX score (0-100) with category breakdowns
- Visual score cards with color-coded ratings
- Top priority issues highlighted
- Executive summary for stakeholders
- Detailed findings with severity badges
- Typography and color system visualization
- Interactive sitemap/information architecture tree
- Client-ready summary with copy-to-clipboard functionality

### 🎨 Modern UI Design

Inspired by professional tools like Notion, Linear, and Figma:
- Clean, minimalist interface
- Smooth animations and transitions
- Responsive design (desktop and tablet)
- Accessible and keyboard-navigable
- Professional color scheme and typography

## 🏗️ Architecture

### Tech Stack

- **React 18**: Modern hooks-based components
- **Vite 5**: Fast build tooling and dev server
- **Tailwind CSS 3**: Utility-first styling
- **Lucide React**: Beautiful, consistent icons
- **Recharts**: Data visualization (ready for future enhancements)

### Project Structure

```
mp2/
├── src/
│   ├── components/
│   │   ├── Layout/          # Header, MainLayout
│   │   ├── Dashboard/       # Overview, Findings, Recommendations, Summary
│   │   ├── Audit/           # AuditForm, AuditProgress
│   │   └── UI/              # Reusable components (Card, Badge, Button, etc.)
│   ├── pages/
│   │   ├── Landing.jsx      # Landing page with hero and features
│   │   └── AuditResults.jsx # Tabbed results dashboard
│   ├── utils/
│   │   ├── auditEngine.js   # Core audit generation logic
│   │   ├── urlClassifier.js # URL type detection
│   │   └── hashSeed.js      # Deterministic randomization
│   ├── data/
│   │   └── findingTemplates.js # Finding templates by category and site type
│   ├── styles/
│   │   └── index.css        # Global styles and animations
│   ├── App.jsx              # Main app with state management
│   └── main.jsx             # React entry point
├── public/                  # Static assets
├── .github/workflows/       # GitHub Actions deployment
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mp2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🌐 Deployment

### GitHub Pages Setup

This project is configured for automated deployment to GitHub Pages using GitHub Actions.

#### Initial Setup

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Configure GitHub Pages**
   - Go to your repository settings
   - Navigate to **Pages** section
   - Under **Source**, select **GitHub Actions**

3. **Automatic Deployment**
   - Every push to `main` branch triggers automatic deployment
   - GitHub Actions workflow builds and deploys to GitHub Pages
   - Your site will be available at: `https://<username>.github.io/<repo-name>/`

#### Manual Deployment

If you prefer manual deployment:

```bash
npm install -g gh-pages
npm run build
gh-pages -d dist
```

### Important Configuration

The `vite.config.js` base path must match your repository name:

```javascript
export default defineConfig({
  base: '/mp2/',  // Change this to match your repo name
  // ...
})
```

## 🔬 The Simulated Audit Engine

### Why Simulated?

GitHub Pages only supports static sites (HTML/CSS/JS). It cannot run:
- Backend servers (Express, FastAPI, Flask)
- Server-side web scraping (Puppeteer, Playwright)
- Database connections
- Long-running processes

### How It Works

The audit engine uses **deterministic simulation** to generate realistic, consistent results:

1. **URL Classification**: Detects site type (ecommerce, blog, SaaS, portfolio, marketing, documentation)
2. **Seeded Randomization**: Creates a hash from the URL to seed a pseudorandom generator
3. **Consistent Results**: Same URL always produces same audit results (within a session)
4. **Realistic Variation**: Different URLs generate different scores, findings, and recommendations
5. **Context-Aware**: Findings match the website type (e.g., ecommerce sites get checkout-related issues)

### Algorithm Components

- **URL Classifier** (`urlClassifier.js`): Pattern matching to identify website type
- **Hash Seed** (`hashSeed.js`): Deterministic random number generator
- **Score Generator**: Weighted scoring based on site type with realistic variation
- **Finding Templates** (`findingTemplates.js`): 100+ pre-written findings organized by category and site type
- **Recommendation Engine**: Prioritizes findings by impact and effort

### Real API Integration Status

**✅ ALREADY INTEGRATED**: Google PageSpeed Insights API
- Real Lighthouse performance data
- Actual Core Web Vitals
- Toggle on/off in header
- See [PAGESPEED_INTEGRATION.md](./PAGESPEED_INTEGRATION.md) for details

**Future Integration Opportunities**:
1. Additional real-time accessibility checking (aXe, WAVE APIs)
2. Real design token extraction via CSS parsing
3. Actual information architecture crawling
4. Backend server for comprehensive web scraping
5. Database storage for audit history and trends

The frontend architecture supports easy API integration!

## 👥 Target Audience

### Primary Users

- **Freelance UX/UI Consultants**: Quick client website assessments for proposals
- **UX Researchers**: Identify usability and accessibility barriers for studies
- **Design Teams**: Document design system inconsistencies and prioritize improvements

### Use Cases

1. **Client Onboarding**: Generate initial audit report for new client kickoff
2. **Competitive Analysis**: Compare multiple sites to identify opportunities
3. **Project Proposals**: Include professional audit findings in pitch decks
4. **Heuristic Evaluations**: Systematic UX review documentation
5. **Accessibility Audits**: WCAG compliance checking for remediation planning

## 📖 User Flow

1. **Landing Page**: User sees product value proposition and enters URL
2. **Audit Progress**: 8-step animated progress (20-30 seconds total)
   - Reading website structure
   - Checking accessibility
   - Extracting typography
   - Extracting color system
   - Mapping information architecture
   - Detecting UX inconsistencies
   - Generating recommendations
   - Preparing client summary
3. **Results Dashboard**: Tabbed interface with 4 main sections
   - Overview: Scores, top issues, executive summary
   - Detailed Findings: All findings organized by category
   - Recommendations: Prioritized by impact/effort matrix
   - Client Summary: Copy-ready report text
4. **New Audit**: User can run another audit with "New Audit" button

## 🎨 Design System

### Colors

- **Primary**: Blue (#0ea5e9) - Trust, professionalism
- **Success**: Green (#10b981) - Good scores, positive findings
- **Warning**: Yellow (#f59e0b) - Moderate issues
- **Error**: Red (#ef4444) - Critical issues
- **Neutral**: Grays for text and backgrounds

### Typography

- **Font Family**: Inter (clean, modern, professional)
- **Scale**: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 48px
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing

- **Base Unit**: 8px
- **Scale**: 8px, 16px, 24px, 32px, 48px, 64px

### Components

- Cards with soft shadows and hover effects
- Badges for severity indicators
- Buttons in multiple variants
- Progress indicators (linear and circular)
- Skeleton loaders for smooth loading states

## 🧪 Testing

### Manual Testing Checklist

- [ ] Enter various URLs (with and without https://)
- [ ] Test with example URLs (amazon.com, airbnb.com, etc.)
- [ ] Verify different site types generate different results
- [ ] Same URL produces consistent results
- [ ] Progress animation displays all 8 steps
- [ ] All dashboard tabs load correctly
- [ ] Copy to clipboard works in Summary section
- [ ] "New Audit" button resets to landing page
- [ ] Responsive on mobile and tablet
- [ ] Keyboard navigation works
- [ ] No console errors

### Automated Testing (Future)

```bash
# Unit tests (Vitest)
npm run test

# E2E tests (Playwright)
npm run test:e2e
```

## 🛠️ Development Notes

### Code Quality

- Consistent component structure
- Reusable UI components
- Clear separation of concerns
- TypeScript-ready (JSDoc comments)
- Accessible HTML semantics

### Performance

- Code splitting by route (ready for future expansion)
- Lazy loading for images
- Optimized bundle size (~60KB gzipped)
- Fast build times with Vite

### Accessibility

- Semantic HTML throughout
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast compliance
- Screen reader friendly

## 📚 Learning Outcomes

This project demonstrates:

1. **Human-Centered Design**: Built for specific user needs (UX consultants)
2. **Constraints-Driven Innovation**: Creative solution to GitHub Pages limitations
3. **Professional UI/UX**: Modern design patterns and smooth interactions
4. **Realistic Data Generation**: Believable simulation without real API
5. **Client-Ready Output**: Professional reports suitable for actual use
6. **Scalable Architecture**: Ready for future backend integration

## 🚧 Known Limitations

1. **Simulated Data**: Findings are template-based, not from actual website analysis
2. **No Real Crawling**: Cannot actually read website HTML/CSS due to CORS and static hosting
3. **Limited Personalization**: No user accounts or saved preferences
4. **No Comparison Mode**: Cannot compare multiple audits side-by-side (yet)

## 🔮 Future Enhancements

### Planned Features

- [ ] Audit history view (browse past audits)
- [ ] Export to PDF
- [ ] Shareable audit links
- [ ] Customizable report templates
- [ ] Dark mode
- [ ] Charts and visualizations
- [ ] Comparison mode

### Technical Improvements

- [ ] TypeScript migration
- [ ] Unit tests with Vitest
- [ ] E2E tests with Playwright
- [ ] Real API integration (when backend available)
- [ ] Offline capability with service workers

## 📄 License

This is an educational project created for HCDE530. Feel free to use as a reference or starting point for your own projects.

## 🙏 Acknowledgments

- **Anthropic Claude**: AI assistant for development guidance
- **Lucide Icons**: Beautiful open-source icon library
- **Tailwind CSS**: Rapid UI development framework
- **Vite**: Lightning-fast build tool

## 📞 Contact

For questions or feedback about this project, please reach out through GitHub issues.

---

**Built with ❤️ for UX professionals**

Last Updated: May 2026
