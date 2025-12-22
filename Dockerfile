FROM node:18-alpine

# Install necessary packages for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Create directories for data persistence
RUN mkdir -p src/bridge src/locales logs && \
    chown -R appuser:appgroup src/bridge src/locales logs

# Set Puppeteer to skip download and use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Start with PM2
CMD ["npx", "pm2-runtime", "start", "ecosystem.config.js"]