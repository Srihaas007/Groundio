# Use official Node.js runtime as base image
FROM node:20-alpine

# Set working directory in container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve to serve the built files
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["serve", "-s", "dist", "-l", "3000"]
