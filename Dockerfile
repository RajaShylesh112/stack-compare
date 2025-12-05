# Dockerfile for the Next.js frontend

# 1. Base Image
FROM node:18-alpine AS base

# 2. Build Stage
FROM base AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# 3. Production Stage
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Environment variables for the Green environment
ENV NEXT_PUBLIC_API_URL="http://localhost:3001"
ENV NEXT_PUBLIC_AUTH_PROVIDER="dual"
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "start"]
