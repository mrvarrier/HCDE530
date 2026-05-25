/**
 * Express server for serving frontend and API endpoints
 * Used for Docker deployment on platforms like Render.com
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import API handlers
import scrapeHandler from './api/scrape.js';
import analyzeAccessibilityHandler from './api/analyze-accessibility.js';
import analyzeDesignHandler from './api/analyze-design.js';
import analyzeIAHandler from './api/analyze-ia.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes - wrap Vercel handlers for Express compatibility
app.post('/api/scrape', async (req, res) => {
  try {
    await scrapeHandler(req, res);
  } catch (error) {
    console.error('[Server] Error in /api/scrape:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
});

app.post('/api/analyze-accessibility', async (req, res) => {
  try {
    await analyzeAccessibilityHandler(req, res);
  } catch (error) {
    console.error('[Server] Error in /api/analyze-accessibility:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
});

app.post('/api/analyze-design', async (req, res) => {
  try {
    await analyzeDesignHandler(req, res);
  } catch (error) {
    console.error('[Server] Error in /api/analyze-design:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
});

app.post('/api/analyze-ia', async (req, res) => {
  try {
    await analyzeIAHandler(req, res);
  } catch (error) {
    console.error('[Server] Error in /api/analyze-ia:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
});

// Handle OPTIONS for CORS preflight
app.options('/api/:endpoint', (req, res) => {
  res.status(200).json({ ok: true });
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: serve index.html for any route that doesn't match static files or API
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }

  // For all other routes, serve index.html
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      next(err);
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});
