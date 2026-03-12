# Stage 1: Build
FROM node:20.10.0-alpine AS builder

WORKDIR /app

ARG REACT_APP_API_URL
ARG REACT_APP_API_GRAPHQL_URL
ARG REACT_APP_API_WS
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_API_GRAPHQL_URL=$REACT_APP_API_GRAPHQL_URL
ENV REACT_APP_API_WS=$REACT_APP_API_WS

# Copy package files first (better layer caching)
COPY package.json package-lock.json* yarn.lock* ./

# Install deps - Alpine is smaller, use npm
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Production - minimal standalone image
FROM node:20.10.0-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy standalone output (only ~50MB vs full node_modules)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
