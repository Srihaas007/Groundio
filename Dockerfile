# Multi-stage build for React Native Web + Node.js backend
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY web-app/package*.json ./web-app/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force
RUN cd web-app && npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/web-app/node_modules ./web-app/node_modules
COPY . .

# Build the web app
WORKDIR /app/web-app
RUN npm run build

# Production image
FROM nginx:alpine AS production

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy built web app
COPY --from=builder /app/web-app/dist /usr/share/nginx/html

# Copy Node.js backend (if needed)
FROM node:20-alpine AS server
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/web-app/node_modules ./web-app/node_modules
COPY . .
COPY --from=builder /app/web-app/dist ./web-app/dist

EXPOSE 3000
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
