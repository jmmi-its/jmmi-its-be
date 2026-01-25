# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production Stage
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
# Copy generated prisma client (if located in node_modules)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3333

# Start command (migrates then starts)
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
