/**
 * Simple Express server for local development
 * Serves the Vercel serverless functions as regular Express routes
 */

import express from 'express';
import cors from 'cors';

// Import the serverless function handlers
import scrapeHandler from './scrape.js';
import accessibilityHandler from './analyze-accessibility.js';
import designHandler from './analyze-design.js';
import iaHandler from './analyze-ia.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper to wrap Vercel serverless functions for Express
const wrapHandler = (handler) => {
  return async (req, res) => {
    try {
      // Create mock Vercel request/response objects
      const mockReq = {
        method: req.method,
        body: req.body,
        query: req.query,
        headers: req.headers
      };

      const mockRes = {
        status: (code) => {
          res.status(code);
          return mockRes;
        },
        json: (data) => {
          res.json(data);
          return mockRes;
        }
      };

      await handler(mockReq, mockRes);
    } catch (error) {
      console.error('Handler error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
};

// API Routes
app.post('/api/scrape', wrapHandler(scrapeHandler));
app.post('/api/analyze-accessibility', wrapHandler(accessibilityHandler));
app.post('/api/analyze-design', wrapHandler(designHandler));
app.post('/api/analyze-ia', wrapHandler(iaHandler));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend API server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend API server running at http://localhost:${PORT}`);
  console.log(`📡 Available endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/scrape`);
  console.log(`   POST http://localhost:${PORT}/api/analyze-accessibility`);
  console.log(`   POST http://localhost:${PORT}/api/analyze-design`);
  console.log(`   POST http://localhost:${PORT}/api/analyze-ia`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
});
