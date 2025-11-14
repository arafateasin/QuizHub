# Auth Service

Authentication and user management microservice for QuizHub platform.

## Features

- User registration and login
- JWT-based authentication
- Refresh token mechanism
- Role-based access control (RBAC)
- User profile management
- Password hashing with bcrypt

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/validate` - Validate JWT token

### Users

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Environment Variables

```env
PORT=3001
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3006
```

## Running Locally

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run in production
npm start
```

## Running with Docker

```bash
docker build -t auth-service .
docker run -p 3001:3001 --env-file .env auth-service
```

## API Documentation

Swagger documentation is available at: `http://localhost:3001/api-docs`
