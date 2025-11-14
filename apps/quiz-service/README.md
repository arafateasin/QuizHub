# Quiz Service

Quiz management and attempt tracking microservice for QuizHub platform.

## Features

- Create, read, update, delete quizzes
- Multiple question types (multiple choice, true/false, short answer)
- Quiz attempt tracking
- Automatic scoring and XP calculation
- Quiz statistics (average score, total attempts)
- Search and filter quizzes
- User quiz history

## API Endpoints

### Quizzes

- `POST /api/quizzes` - Create new quiz (auth required)
- `GET /api/quizzes` - List all public quizzes (paginated)
- `GET /api/quizzes/:id` - Get quiz by ID
- `PUT /api/quizzes/:id` - Update quiz (auth required, owner only)
- `DELETE /api/quizzes/:id` - Delete quiz (auth required, owner only)
- `GET /api/quizzes/user/my-quizzes` - Get user's created quizzes

### Attempts

- `POST /api/attempts/start` - Start a quiz attempt
- `POST /api/attempts/:id/submit` - Submit quiz answers
- `GET /api/attempts/:id` - Get attempt details
- `GET /api/attempts/user/history` - Get user's attempt history

## Environment Variables

```env
PORT=3002
MONGO_URI=mongodb+srv://...
AUTH_SERVICE_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3006
```

## Running Locally

```bash
npm install
npm run dev
```

## API Documentation

Swagger docs: `http://localhost:3002/api-docs`
