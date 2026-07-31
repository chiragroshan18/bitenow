# Root Dockerfile for the food-delivery-app monorepo
# Builds the client workspace assets and packages the Express backend.

# --- Builder stage ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy root workspace manifest and workspace package manifests
COPY package.json package-lock.json ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json

# Install all workspace dependencies
RUN npm ci

# Build the frontend client assets
RUN npm run build --workspace=client

# --- Runtime stage ---
FROM node:20-alpine AS runtime
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy server source and production dependencies
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/server ./server
COPY --from=builder /usr/src/app/client/dist ./client/dist
COPY package.json package-lock.json ./

WORKDIR /usr/src/app/server
EXPOSE 5000

CMD ["node", "index.js"]
