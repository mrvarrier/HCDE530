/**
 * Application Configuration
 * Centralized config for API keys, endpoints, and environment-specific settings
 */

// Google PageSpeed Insights API Configuration
export const PAGESPEED_CONFIG = {
  // API key (optional - can use limited free tier without key)
  // Get your free API key at: https://developers.google.com/speed/docs/insights/v5/get-started
  apiKey: import.meta.env.VITE_PAGESPEED_API_KEY || null,

  // Base URL for PageSpeed API
  baseUrl: 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed',

  // Rate limits (free tier)
  rateLimits: {
    requestsPerDay: 50,
    requestsPerMinute: 5
  }
};

// Backend API Configuration
export const BACKEND_CONFIG = {
  // Backend API base URL (changes based on environment)
  baseUrl: import.meta.env.PROD
    ? import.meta.env.VITE_BACKEND_URL || 'https://your-backend.vercel.app/api'
    : 'http://localhost:3000/api',

  // Timeout for API requests (in milliseconds)
  timeout: 30000, // 30 seconds

  // Retry configuration
  retries: {
    maxAttempts: 3,
    backoff: 1000 // Start with 1 second, exponential backoff
  }
};

// Feature Flags
export const FEATURES = {
  // Enable/disable real web scraping (requires backend)
  realScraping: import.meta.env.VITE_ENABLE_SCRAPING === 'true',

  // Enable/disable PageSpeed API integration
  pageSpeedAPI: true,

  // Enable/disable audit history persistence
  persistHistory: true,

  // Max number of audits to store in history
  maxHistoryItems: 10
};

// Debug logging for environment variables (helpful for troubleshooting)
console.log('🔧 Feature Flags:', FEATURES);

// App Metadata
export const APP_INFO = {
  name: 'UX Website Auditor',
  version: '2.0.0',
  description: 'Professional UX audit tool for freelance consultants',
  author: 'Your Name',
  repository: 'https://github.com/yourusername/mp2'
};

export default {
  PAGESPEED_CONFIG,
  BACKEND_CONFIG,
  FEATURES,
  APP_INFO
};
