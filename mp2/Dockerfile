# Use Node.js 20 Alpine as base
FROM node:20-alpine

# Install Chromium and dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm

# Tell Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install root dependencies
RUN npm ci --only=production

# Copy api package files
COPY api/package*.json ./api/

# Install api dependencies
RUN cd api && npm ci --only=production

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "server.js"]
