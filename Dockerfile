# Dockerfile pour Railway - Backend uniquement
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++ openssl openssl-dev

# Copy only backend files
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma/

# Set working directory to backend
WORKDIR /app/backend

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Install dev dependencies for build
RUN npm install --only=dev

# Copy backend source code and configs
COPY backend/src ./src/
COPY backend/tsconfig.json ./
COPY backend/tsconfig.build.json ./
COPY backend/.env.example ./

# Build the application with tsc-alias
RUN npm run build

# Try to push database schema (ignore errors)
RUN npx prisma db push --accept-data-loss || echo "Database push failed, will try at runtime"

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Create directories and set permissions
RUN mkdir -p /app/backend/uploads /app/backend/logs
RUN chown -R backend:nodejs /app/backend

# Switch to non-root user
USER backend

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
