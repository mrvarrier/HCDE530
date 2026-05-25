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

// API routes
app.post('/api/scrape', async (req, res) => {
  await scrapeHandler(req, res);
});

app.post('/api/analyze-accessibility', async (req, res) => {
  await analyzeAccessibilityHandler(req, res);
});

app.post('/api/analyze-design', async (req, res) => {
  await analyzeDesignHandler(req, res);
});

app.post('/api/analyze-ia', async (req, res) => {
  await analyzeIAHandler(req, res);
});

// Handle OPTIONS for CORS preflight
app.options('/api/*', (req, res) => {
  res.status(200).json({ ok: true });
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});
