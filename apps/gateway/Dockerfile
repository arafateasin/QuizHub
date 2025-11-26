FROM node:18-alpine

WORKDIR /app

# Copy root workspace definition
COPY package*.json ./
COPY tsconfig.json ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy service source
COPY apps/gateway ./apps/gateway

# Install dependencies (including devDependencies for build)
RUN npm install

# Build shared package first
WORKDIR /app/packages/shared
RUN npm run build

# Build service
WORKDIR /app/apps/gateway
RUN npm run build

# Remove devDependencies after build to keep image small (optional, skipping for simplicity)

EXPOSE 3000

CMD ["npm", "start"]
