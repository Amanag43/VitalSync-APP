# Use official Node.js 20 LTS Alpine image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml* ./

# Install dependencies in frozen lockfile mode
RUN npm install --only=production

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=5000

# Start server
CMD ["node", "server.js"]
