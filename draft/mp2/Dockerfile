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
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies including dev (needed for Vite build)
# Explicitly set NODE_ENV to ensure devDependencies are installed
RUN NODE_ENV=development npm install

# Copy api package files
COPY api/package*.json ./api/

# Install api dependencies (production only)
RUN cd api && npm install --production

# Copy source code
COPY . .

# Build frontend with Vite
RUN npm run build

# Remove devDependencies after build to reduce image size
RUN npm prune --production

# Set NODE_ENV to production for runtime
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "server.js"]
