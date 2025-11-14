# QuizHub Platform - Installation & Setup Guide

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** v18.x or higher ([Download](https://nodejs.org/))
- **npm** v9.x or higher (comes with Node.js)
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/downloads))
- **MongoDB Atlas** account (free tier available at [MongoDB.com](https://www.mongodb.com/))

## 🚀 Quick Start

### 1. Install Dependencies

Open PowerShell in the project root directory:

```powershell
# Navigate to project directory
cd C:\Users\user\Documents\CLIENT\QuizHub

# Install root dependencies
npm install

# Install workspace dependencies
npm install --workspaces
```

### 2. Configure Environment Variables

```powershell
# Copy the example environment file
Copy-Item .env.example .env

# Edit the .env file with your actual values
notepad .env
```

**Important:** Update these values in your `.env` file:

```env
# MongoDB - Replace <db_password> with your actual MongoDB password
MONGO_URI=mongodb+srv://easinarafatbn_db_user:YOUR_PASSWORD@quizhub.cu2kxvn.mongodb.net/?appName=QuizHub

# JWT Secrets - Generate strong random strings
JWT_SECRET=generate-a-strong-random-secret-here
JWT_REFRESH_SECRET=generate-another-strong-random-secret

# OpenAI API Key (for Phase 3)
OPENAI_API_KEY=your-openai-api-key-here
```

### 3. Build Shared Package

```powershell
cd packages\shared
npm run build
cd ..\..
```

### 4. Running the Services

#### Option A: Run All Services with Docker (Recommended)

```powershell
# Build Docker images
docker-compose build

# Start all services
docker-compose up

# To run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

#### Option B: Run Services Individually (Development)

Open **multiple PowerShell windows** (one for each service):

**Window 1 - Auth Service:**

```powershell
cd apps\auth-service
npm install
npm run dev
```

**Window 2 - Gateway:**

```powershell
cd apps\gateway
npm install
npm run dev
```

**Window 3 - Frontend:**

```powershell
cd apps\frontend
npm install
npm run dev
```

### 5. Verify Services are Running

Open your browser and check:

- **Auth Service**: http://localhost:3001/health
- **API Gateway**: http://localhost:3000/health
- **Frontend**: http://localhost:3006
- **Auth API Docs**: http://localhost:3001/api-docs

## 📦 Service Architecture

```
Port 3000 - API Gateway (Main Entry Point)
Port 3001 - Auth Service
Port 3002 - Quiz Service
Port 3003 - Leaderboard Service
Port 3004 - Feedback Service (AI)
Port 3005 - Notification Service
Port 3006 - Frontend (Next.js)
Port 6379 - Redis
```

## 🏗️ Project Structure Explained

```
QuizHub/
├── apps/                      # All microservices and frontend
│   ├── auth-service/         # ✅ Authentication & User Management
│   ├── quiz-service/         # 🚧 Quiz CRUD & Logic
│   ├── leaderboard-service/  # 🚧 Rankings & XP System
│   ├── feedback-service/     # 🚧 AI-powered Feedback
│   ├── notification-service/ # 🚧 Email & Push Notifications
│   ├── gateway/              # 🚧 API Gateway (BFF)
│   └── frontend/             # 🚧 Next.js Application
├── packages/
│   └── shared/               # ✅ Shared types & utilities
├── docker-compose.yml        # ✅ Docker orchestration
├── package.json              # ✅ Monorepo configuration
└── .env                      # Configuration
```

**Legend:**

- ✅ Completed
- 🚧 In Progress / To Be Developed

## 🛠️ Development Workflow

### Adding New Features

1. **Work on a specific service:**

```powershell
cd apps\[service-name]
npm run dev
```

2. **Make changes to shared types:**

```powershell
cd packages\shared
# Edit files in src/
npm run build
```

3. **Test your changes:**

```powershell
npm run test --workspace=apps/[service-name]
```

### Common Commands

```powershell
# Install all dependencies
npm install

# Run all services in development
npm run dev

# Build all services
npm run build

# Clean all build artifacts
npm run clean

# Run specific service
npm run dev:[service-name]
# Example: npm run dev:auth
```

## 🧪 Testing

```powershell
# Run all tests
npm run test

# Test specific service
cd apps\auth-service
npm run test
```

## 📚 API Documentation

Each microservice has its own Swagger documentation:

- **Auth Service**: http://localhost:3001/api-docs
- **Quiz Service**: http://localhost:3002/api-docs
- **Leaderboard**: http://localhost:3003/api-docs
- **Feedback**: http://localhost:3004/api-docs
- **Notification**: http://localhost:3005/api-docs

## 🔧 Troubleshooting

### Issue: MongoDB Connection Failed

**Solution:**

1. Check your `MONGO_URI` in `.env` file
2. Ensure you've replaced `<db_password>` with your actual password
3. Verify your IP is whitelisted in MongoDB Atlas (or use 0.0.0.0/0 for development)

### Issue: Port Already in Use

**Solution:**

```powershell
# Find process using port (e.g., 3001)
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID [PID] /F
```

### Issue: TypeScript Errors

**Solution:**

```powershell
# Rebuild shared package
cd packages\shared
npm run build

# Clear TypeScript cache
Remove-Item -Recurse -Force node_modules\.cache
```

### Issue: Docker Build Fails

**Solution:**

```powershell
# Clean Docker system
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

## 🔐 Security Notes

### Before Deploying to Production:

1. **Generate Strong Secrets:**

```powershell
# Generate random strings for JWT secrets
# Use online generators or:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

2. **Update Environment Variables:**

   - Change all default secrets
   - Use production MongoDB cluster
   - Configure proper CORS origins
   - Enable rate limiting
   - Set NODE_ENV=production

3. **Enable HTTPS:**
   - Use SSL certificates
   - Configure reverse proxy (Nginx)

## 📈 Next Steps

### Phase 1 (MVP) - ✅ Mostly Complete

- [x] Monorepo structure
- [x] Shared package
- [x] Auth service
- [ ] Quiz service
- [ ] API Gateway
- [ ] Basic frontend

### Phase 2 - Gamification

- [ ] Leaderboard service
- [ ] XP system
- [ ] Badges
- [ ] Rankings

### Phase 3 - AI Features

- [ ] Feedback service
- [ ] OpenAI integration
- [ ] Adaptive difficulty

### Phase 4 - Real-time

- [ ] Socket.io setup
- [ ] Live battles
- [ ] Multiplayer mode

### Phase 5 - Production Ready

- [ ] Notification service
- [ ] Payment integration
- [ ] CI/CD pipeline
- [ ] Monitoring setup

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs:**

```powershell
docker-compose logs -f [service-name]
```

2. **Verify environment variables:**

```powershell
Get-Content .env
```

3. **Check service health:**

```powershell
curl http://localhost:3001/health
```

## 📞 Support

For questions or issues:

- Check service README files in `apps/[service-name]/README.md`
- Review API documentation at `/api-docs` endpoints
- Check Docker logs for errors

---

**Happy Coding! 🚀**
