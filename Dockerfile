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

# Copy main files
COPY server.js ./
COPY ecosystem.config.js ./

# Copy source code explicitly
COPY src/ src/

# Debug: List copied files
RUN ls -la /app/src/ || echo "No src/" && ls -la /app/src/bridge/ || echo "No files in /app/src/bridge/"

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Create directories for data persistence
RUN mkdir -p src/bridge src/locales logs && \
    chown -R appuser:appgroup src/bridge src/locales logs

# Verify src/bridge/index.js after chown
USER appuser
RUN ls -la src/bridge/index.js || echo "src/bridge/index.js still not found after chown"
USER root

# Set Puppeteer to skip download and use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Start directly with Node
CMD ["node", "server.js"]