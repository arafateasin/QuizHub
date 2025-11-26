FROM node:18-alpine

WORKDIR /app

# Copy root workspace definition
COPY package*.json ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy service source
COPY apps/quiz-service ./apps/quiz-service

# Install dependencies
RUN npm install

# Build shared package first
WORKDIR /app/packages/shared
RUN npm run build

# Build service
WORKDIR /app/apps/quiz-service
RUN npm run build

EXPOSE 3002

CMD ["npm", "start"]
