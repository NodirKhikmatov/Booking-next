# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Production Stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./
RUN yarn install --production --frozen-lockfile

EXPOSE 3000

CMD ["yarn", "start"]
