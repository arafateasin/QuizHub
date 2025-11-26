FROM node:18-alpine

WORKDIR /app

# Copy root workspace definition
COPY package*.json ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy service source
COPY apps/gateway ./apps/gateway

# Install dependencies
RUN npm install

# Build shared package first
WORKDIR /app/packages/shared
RUN npm run build

# Build service
WORKDIR /app/apps/gateway
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
