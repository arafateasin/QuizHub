FROM node:18-alpine

WORKDIR /app

# Copy root workspace definition
COPY package*.json ./
COPY tsconfig.json ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy service source
COPY apps/auth-service ./apps/auth-service

# Install dependencies (including devDependencies for build)
RUN npm install

# Build shared package first
WORKDIR /app/packages/shared
RUN npm run build

# Build service
WORKDIR /app/apps/auth-service
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
