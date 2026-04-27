# Stage 1: Build Phase
FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDependencies for building)
COPY package*.json ./
RUN npm install

# Copy source code and build the React frontend
COPY . .
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy build artifacts and server source
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts

# Ensure tsx is available to run the server
RUN npm install -g tsx

# Expose the Cloud Run default port
EXPOSE 3000

# Start server using tsx
CMD ["tsx", "server.ts"]
