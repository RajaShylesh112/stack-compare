# Dockerfile for the Node.js backend server

# 1. Base Image
FROM node:18-alpine

# 2. Setup
WORKDIR /usr/src/app

# 3. Copy files and install dependencies
COPY package*.json ./
COPY bun.lockb ./
RUN bun install --frozen-lockfile --production

# Copy the rest of the application code
COPY . .

# Drizzle migrations (optional, can be run in a separate step in CI/CD)
# RUN npx drizzle-kit generate:pg
# RUN bun run drizzle:migrate

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# 4. Start command
CMD [ "bun", "src/index.ts" ]
