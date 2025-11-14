# QuizHub Platform - Development Reference

## 🎯 Current Status (Phase 1 - MVP)

### ✅ Completed (40%)

- [x] **Monorepo Structure** - Workspaces configured
- [x] **Shared Package** - Common types & utilities
- [x] **Auth Service** - Complete with JWT authentication
- [x] **Docker Setup** - docker-compose.yml ready
- [x] **CI/CD Pipeline** - GitHub Actions workflow
- [x] **Documentation** - README, SETUP, CONTRIBUTING

### 🚧 In Progress / TODO (60%)

- [ ] **Quiz Service** - Core quiz functionality
- [ ] **API Gateway** - Request routing & aggregation
- [ ] **Frontend** - Next.js with TailwindCSS
- [ ] **Leaderboard Service** - XP & rankings
- [ ] **Feedback Service** - AI-powered insights
- [ ] **Notification Service** - Email & push notifications

---

## 📊 Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│                   Port 3006 - React UI                  │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                   API Gateway (BFF)                     │
│              Port 3000 - Request Router                 │
└─┬────────────┬──────────────┬──────────────┬───────────┘
  │            │              │              │
  ▼            ▼              ▼              ▼
┌─────┐   ┌────────┐   ┌─────────────┐   ┌──────────┐
│Auth │   │ Quiz   │   │ Leaderboard │   │Feedback  │
│3001 │   │ 3002   │   │    3003     │   │  3004    │
└──┬──┘   └───┬────┘   └──────┬──────┘   └────┬─────┘
   │          │               │                │
   ▼          ▼               ▼                ▼
  MongoDB    MongoDB     MongoDB+Redis      MongoDB
```

---

## 🛠️ Quick Commands Reference

### Development

```powershell
# Root directory commands
npm install                    # Install all dependencies
npm run dev                    # Run all services
npm run build                  # Build all services
npm run test                   # Run all tests
npm run clean                  # Clean build artifacts

# Individual services
npm run dev:auth              # Auth service only
npm run dev:quiz              # Quiz service only
npm run dev:gateway           # Gateway only
npm run dev:frontend          # Frontend only

# Shared package
cd packages\shared
npm run build                 # Build shared types
npm run dev                   # Watch mode
```

### Docker

```powershell
# Build and run
docker-compose build          # Build all images
docker-compose up             # Start all containers
docker-compose up -d          # Start in background
docker-compose down           # Stop all containers

# Individual services
docker-compose up auth-service
docker-compose logs -f auth-service

# Clean up
docker-compose down -v        # Remove volumes
docker system prune -a        # Clean Docker system
```

### Database

```powershell
# Connect to MongoDB Atlas
mongosh "mongodb+srv://quizhub.cu2kxvn.mongodb.net/" --username easinarafatbn_db_user

# View databases
show dbs

# Use auth database
use quizhub_auth

# View collections
show collections

# Query users
db.users.find()
```

---

## 📁 Project File Structure

```
QuizHub/
│
├── 📄 Configuration Files
│   ├── package.json              # Monorepo workspaces
│   ├── tsconfig.json             # TypeScript config
│   ├── docker-compose.yml        # Container orchestration
│   ├── .env.example              # Environment template
│   ├── .env                      # Your configuration
│   └── .gitignore                # Git ignore rules
│
├── 📚 Documentation
│   ├── README.md                 # Project overview
│   ├── SETUP.md                  # Setup instructions
│   ├── PROJECT_STATUS.md         # Current status
│   ├── CONTRIBUTING.md           # Contributing guide
│   ├── DEVELOPMENT.md            # This file
│   └── LICENSE                   # MIT License
│
├── 🔧 Scripts
│   ├── setup.ps1                 # Windows setup script
│   └── Makefile                  # Build automation
│
├── 📦 packages/
│   └── shared/                   # Shared library
│       ├── src/
│       │   ├── types.ts          # TypeScript interfaces
│       │   ├── constants.ts      # System constants
│       │   ├── utils.ts          # Helper functions
│       │   └── index.ts          # Exports
│       ├── package.json
│       └── tsconfig.json
│
└── 🏢 apps/
    │
    ├── auth-service/ ✅          # COMPLETE
    │   ├── src/
    │   │   ├── config/           # Database, Swagger
    │   │   ├── controllers/      # Auth, User controllers
    │   │   ├── middleware/       # Auth, Error, Validation
    │   │   ├── models/           # User model
    │   │   ├── routes/           # Auth, User routes
    │   │   ├── utils/            # JWT, Logger
    │   │   └── index.ts          # Entry point
    │   ├── Dockerfile
    │   ├── package.json
    │   └── README.md
    │
    ├── quiz-service/ 🚧          # TO BUILD
    ├── leaderboard-service/ 🚧
    ├── feedback-service/ 🚧
    ├── notification-service/ 🚧
    ├── gateway/ 🚧
    └── frontend/ 🚧
```

---

## 🔑 Environment Variables Reference

### Required for All Services

```env
NODE_ENV=development              # development | production
MONGO_URI=mongodb+srv://...       # MongoDB connection string
JWT_SECRET=your-secret            # Access token secret
JWT_REFRESH_SECRET=your-secret    # Refresh token secret
CORS_ORIGIN=http://localhost:3006 # Frontend URL
```

### Service-Specific

```env
# Auth Service
PORT=3001
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Quiz Service
PORT=3002
QUIZ_SERVICE_URL=http://localhost:3002

# Leaderboard Service
PORT=3003
REDIS_URL=redis://localhost:6379

# Feedback Service (AI)
PORT=3004
OPENAI_API_KEY=sk-...

# Notification Service
PORT=3005
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password

# Gateway
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
QUIZ_SERVICE_URL=http://localhost:3002

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🧪 Testing Reference

### Unit Tests

```typescript
// Example: User service test
import { createUser } from "./user.service";

describe("User Service", () => {
  it("should create a user", async () => {
    const user = await createUser({
      email: "test@example.com",
      username: "testuser",
      password: "Test@1234",
    });

    expect(user).toHaveProperty("id");
    expect(user.email).toBe("test@example.com");
  });
});
```

### API Tests (Postman/Thunder Client)

```http
### Register User
POST http://localhost:3001/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "username": "testuser",
  "password": "Test@1234",
  "role": "student"
}

### Login
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@1234"
}

### Get Profile (requires token)
GET http://localhost:3001/api/users/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🎨 API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "abc123",
      "email": "test@example.com",
      "username": "testuser"
    }
  },
  "message": "Operation successful",
  "statusCode": 200
}
```

### Error Response

```json
{
  "success": false,
  "error": "Invalid credentials",
  "statusCode": 401
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## 🔒 Authentication Flow

```
1. User Registration/Login
   ↓
2. Server validates credentials
   ↓
3. Generate JWT (15min) + Refresh Token (7days)
   ↓
4. Client stores tokens
   ↓
5. Include JWT in Authorization header for requests
   Bearer <access_token>
   ↓
6. When JWT expires, use refresh token
   POST /api/auth/refresh
   ↓
7. Receive new JWT + Refresh Token
```

---

## 📊 Database Schemas

### User Schema (Auth Service)

```typescript
{
  email: string;          // unique, indexed
  username: string;       // unique, indexed
  password: string;       // hashed with bcrypt
  role: 'student' | 'teacher' | 'admin';
  isVerified: boolean;
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    institution?: string;
    grade?: string;
  };
  refreshToken?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Quiz Schema (Quiz Service - To Build)

```typescript
{
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  createdBy: ObjectId;    // User reference
  isPublic: boolean;
  timeLimit?: number;     // minutes
  passingScore: number;   // percentage
  questions: Question[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Update all environment variables for production
- [ ] Generate strong JWT secrets (64+ characters)
- [ ] Configure MongoDB Atlas production cluster
- [ ] Set up Redis instance (Upstash/AWS ElastiCache)
- [ ] Configure CORS for production domains
- [ ] Enable rate limiting
- [ ] Set up SSL certificates
- [ ] Configure logging service (Sentry/LogDNA)
- [ ] Set up monitoring (Prometheus/Grafana)

### Environment Variables for Production

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://prod-cluster...
JWT_SECRET=<64-char-random-string>
CORS_ORIGIN=https://quizhub.com
RATE_LIMIT_ENABLED=true
```

### Hosting Options

| Service       | Recommended Hosting      |
| ------------- | ------------------------ |
| Frontend      | Vercel, Netlify          |
| Gateway       | Railway, Render          |
| Microservices | Railway, Render, AWS ECS |
| Database      | MongoDB Atlas            |
| Redis         | Upstash, Redis Labs      |
| File Storage  | AWS S3, Cloudinary       |

---

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Connection Failed

```
Error: MongooseError: The `uri` parameter to `openUri()` must be a string
```

**Solution:** Check `.env` file and ensure MONGO_URI is set correctly.

### Issue 2: Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**

```powershell
# Find process
netstat -ano | findstr :3001

# Kill process
taskkill /PID <PID> /F
```

### Issue 3: TypeScript Module Not Found

```
Error: Cannot find module '@quizhub/shared'
```

**Solution:**

```powershell
cd packages\shared
npm run build
```

### Issue 4: Docker Build Fails

**Solution:**

```powershell
docker system prune -a
docker-compose build --no-cache
```

---

## 📚 Useful Resources

### Documentation

- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [MongoDB](https://docs.mongodb.com/)
- [Mongoose](https://mongoosejs.com/docs/)
- [JWT](https://jwt.io/)
- [Next.js](https://nextjs.org/docs)
- [Docker](https://docs.docker.com/)

### Tools

- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - DB GUI
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [VS Code Extensions](https://marketplace.visualstudio.com/)
  - ESLint
  - Prettier
  - Docker
  - REST Client

---

## 💡 Tips & Best Practices

1. **Always use TypeScript** - Leverage type safety
2. **Validate inputs** - Use express-validator
3. **Handle errors properly** - Use error middleware
4. **Document APIs** - Maintain Swagger docs
5. **Write tests** - Unit + Integration tests
6. **Use environment variables** - Never hardcode secrets
7. **Follow REST conventions** - Consistent API design
8. **Log everything** - Use structured logging
9. **Version your APIs** - /api/v1/...
10. **Keep services independent** - Microservice principle

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**Status:** Phase 1 - MVP in Progress
