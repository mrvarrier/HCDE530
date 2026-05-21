# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Start Development Server

```bash
cd /Users/manishvarrier/Documents/HCDE530/mp2
npm run dev
```

Your app will open at: `http://localhost:5173`

### 2. Try It Out

Enter any URL to run an audit:
- `amazon.com` (e-commerce)
- `notion.so` (SaaS)
- `medium.com` (blog)
- `stripe.com` (marketing)

Each URL type generates different findings!

### 3. Deploy to GitHub Pages

#### Option A: Automatic (Recommended)

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Complete UX Website Auditor"
   git push origin main
   ```

2. In GitHub repo settings:
   - Go to **Settings** → **Pages**
   - Set Source to **GitHub Actions**
   - Done! Auto-deploys on every push

#### Option B: Manual

```bash
npm run build
npx gh-pages -d dist
```

---

## 📁 Project Structure

```
mp2/
├── src/
│   ├── App.jsx                          # Main app
│   ├── main.jsx                         # Entry point
│   ├── components/
│   │   ├── UI/                          # Reusable components
│   │   ├── Layout/                      # Header, Footer
│   │   ├── Audit/                       # Form, Progress
│   │   └── Dashboard/                   # Results sections
│   ├── pages/
│   │   ├── Landing.jsx                  # Home page
│   │   └── AuditResults.jsx             # Dashboard
│   ├── utils/
│   │   ├── auditEngine.js               # Core logic ⭐
│   │   ├── urlClassifier.js             # URL detection
│   │   └── hashSeed.js                  # Randomization
│   └── data/
│       └── findingTemplates.js          # 100+ findings
├── README.md                            # Full documentation
├── TODO.md                              # Progress tracker
└── PROJECT_SUMMARY.md                   # Academic summary
```

---

## 🎯 Key Features to Demo

1. **Landing Page**: Professional hero with features
2. **Audit Progress**: Smooth 8-step animation
3. **Overview Tab**: Scores and top issues
4. **Findings Tab**: Detailed audit results
5. **Recommendations Tab**: Impact/effort matrix
6. **Summary Tab**: Copy-ready client report

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Deployment
git push origin main     # Auto-deploys via GitHub Actions
```

---

## ⚙️ Configuration

### Change Base Path (if repo name ≠ "mp2")

Edit `vite.config.js`:

```javascript
export default defineConfig({
  base: '/your-repo-name/',  // ← Change this
  // ...
})
```

---

## 🐛 Troubleshooting

### Dev server won't start
```bash
rm -rf node_modules
npm install
npm run dev
```

### Build errors
Check that all imports use correct paths (case-sensitive!)

### GitHub Pages 404
Ensure `base` in `vite.config.js` matches repo name

---

## 📚 Documentation

- **README.md**: Full project documentation
- **TODO.md**: Development progress and future enhancements
- **PROJECT_SUMMARY.md**: Academic project summary

---

## ✅ Verification Checklist

Before deploying:

- [ ] `npm run build` succeeds
- [ ] `npm run preview` shows working app
- [ ] Try different URL types (ecommerce, blog, saas)
- [ ] Same URL gives same results
- [ ] All tabs work in results dashboard
- [ ] Copy summary button works
- [ ] "New Audit" resets to landing page
- [ ] No console errors

---

## 🎓 For Your Portfolio

**Project Name**: UX Website Auditor

**Role**: Solo Developer

**Tech Stack**: React, Vite, Tailwind CSS

**Key Achievement**: Built production-grade audit tool with simulated engine to overcome GitHub Pages static hosting constraints

**Impact**: Professional tool suitable for real UX consulting work

---

**Ready to go! 🚀**

Run `npm run dev` and start auditing!
