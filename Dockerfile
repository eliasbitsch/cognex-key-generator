# Builder
FROM node:24-alpine AS builder
WORKDIR /app

# Install build deps
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build
RUN npm run build

# Production image
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built app and prod deps
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
# `public` is optional in this project; skip copying if it doesn't exist

EXPOSE 3000

# Use a non-root user for better security
RUN addgroup -S nextgroup && adduser -S nextuser -G nextgroup
USER nextuser

CMD ["npm", "start"]
