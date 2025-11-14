# API Gateway (BFF)

Backend for Frontend (BFF) gateway that routes requests to microservices.

## Features

- Request routing to microservices
- Rate limiting
- CORS configuration
- Error handling
- Service health monitoring
- Request logging

## Routes

### Auth Service Routes

- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management endpoints

### Quiz Service Routes

- `/api/quizzes/*` - Quiz management endpoints
- `/api/attempts/*` - Quiz attempt endpoints

## Environment Variables

```env
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
QUIZ_SERVICE_URL=http://localhost:3002
LEADERBOARD_SERVICE_URL=http://localhost:3003
FEEDBACK_SERVICE_URL=http://localhost:3004
NOTIFICATION_SERVICE_URL=http://localhost:3005
CORS_ORIGIN=http://localhost:3006
NODE_ENV=development
```

## Running Locally

```bash
npm install
npm run dev
```

## Health Check

`GET /health` - Returns gateway status and connected services

## Architecture

```
Client → Gateway (Port 3000)
    ├── /api/auth → Auth Service (3001)
    ├── /api/users → Auth Service (3001)
    ├── /api/quizzes → Quiz Service (3002)
    └── /api/attempts → Quiz Service (3002)
```
