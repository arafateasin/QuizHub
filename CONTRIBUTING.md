# Contributing to QuizHub

Thank you for your interest in contributing to QuizHub! This document provides guidelines and best practices for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Service Development](#service-development)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/yourusername/quizhub.git
cd quizhub
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Build shared package
cd packages/shared && npm run build && cd ../..

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## 💻 Development Workflow

### Running Services Locally

```bash
# Run all services
npm run dev

# Run specific service
npm run dev:auth
npm run dev:quiz
npm run dev:gateway
```

### Making Changes

1. **Make your changes** in the appropriate service
2. **Test your changes** locally
3. **Run tests** before committing
4. **Update documentation** if needed

### Testing

```bash
# Run all tests
npm run test

# Test specific service
cd apps/[service-name]
npm run test
```

## 📝 Coding Standards

### TypeScript

- Use **TypeScript** for all new code
- Define proper types (no `any` unless absolutely necessary)
- Use interfaces from `@quizhub/shared` when possible

### File Naming

- Use **kebab-case** for file names: `user.controller.ts`, `auth.middleware.ts`
- Use **PascalCase** for classes: `UserController`, `AuthMiddleware`
- Use **camelCase** for functions and variables: `getUserProfile`, `isAuthenticated`

### Code Style

```typescript
// ✅ Good
export const createUser = async (userData: CreateUserDTO): Promise<User> => {
  const user = await User.create(userData);
  return user;
};

// ❌ Bad
export const createUser = async (userData: any) => {
  const user = await User.create(userData);
  return user;
};
```

### Error Handling

```typescript
// ✅ Always use try-catch and pass to error middleware
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.json(successResponse(user));
  } catch (error) {
    next(error);
  }
};
```

### API Responses

Always use response helpers from `@quizhub/shared`:

```typescript
import { successResponse, errorResponse } from "@quizhub/shared";

// Success
res.json(successResponse(data, "Operation successful"));

// Error (let middleware handle it)
throw new ValidationError("Invalid input");
```

## 📨 Commit Messages

Follow the **Conventional Commits** specification:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(auth): add password reset functionality

fix(quiz): correct score calculation for bonus points

docs(readme): update installation instructions

refactor(leaderboard): optimize ranking algorithm
```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] Comments added to complex sections
- [ ] Documentation updated
- [ ] Tests added/updated and passing
- [ ] No console.logs or debugging code
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

Describe how you tested your changes

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Tests added/updated
- [ ] Documentation updated
```

### Review Process

1. Create PR with clear description
2. Wait for automated tests to pass
3. Request review from maintainers
4. Address feedback
5. Merge once approved

## 🏗️ Service Development

### Creating a New Service

1. **Create service directory:**

```bash
mkdir apps/new-service
cd apps/new-service
```

2. **Copy structure from existing service** (e.g., auth-service)

3. **Update package.json:**

```json
{
  "name": "@quizhub/new-service",
  "version": "1.0.0",
  "main": "dist/index.js"
}
```

4. **Add to docker-compose.yml:**

```yaml
new-service:
  build:
    context: ./apps/new-service
  ports:
    - "300X:300X"
  env_file:
    - .env
```

5. **Add npm script to root package.json:**

```json
{
  "scripts": {
    "dev:new": "npm run dev --workspace=apps/new-service"
  }
}
```

### Service Structure

```
new-service/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   └── index.ts        # Entry point
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

### API Endpoints

Follow RESTful conventions:

```typescript
// ✅ Good
GET    /api/quizzes           - List all quizzes
GET    /api/quizzes/:id       - Get quiz by ID
POST   /api/quizzes           - Create quiz
PUT    /api/quizzes/:id       - Update quiz
DELETE /api/quizzes/:id       - Delete quiz

// ❌ Bad
GET    /api/getAllQuizzes
POST   /api/createNewQuiz
```

### Swagger Documentation

Add Swagger comments to all routes:

```typescript
/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Quiz created successfully
 */
```

## 🧪 Testing Guidelines

### Unit Tests

```typescript
describe("User Controller", () => {
  it("should create a new user", async () => {
    const userData = {
      email: "test@example.com",
      username: "testuser",
      password: "Test@1234",
    };

    const user = await createUser(userData);

    expect(user).toHaveProperty("id");
    expect(user.email).toBe(userData.email);
  });
});
```

### Integration Tests

```typescript
describe("POST /api/auth/signup", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: "test@example.com",
      username: "testuser",
      password: "Test@1234",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("accessToken");
  });
});
```

## 📖 Documentation

### Code Comments

```typescript
/**
 * Calculates user's current level based on XP
 * @param xp - Total experience points
 * @returns Current level number
 */
export const calculateLevel = (xp: number): number => {
  // Implementation
};
```

### README Updates

Update service README.md when:

- Adding new endpoints
- Changing configuration
- Adding dependencies
- Updating setup process

## 🎯 Priority Areas

### High Priority

1. **Quiz Service** - Core functionality
2. **API Gateway** - Request routing
3. **Frontend** - User interface

### Medium Priority

4. **Leaderboard Service** - Gamification
5. **Feedback Service** - AI features

### Low Priority

6. **Notification Service** - Engagement
7. **Real-time Features** - Multiplayer

## ❓ Questions?

If you have questions:

1. Check existing documentation
2. Look at similar implementations in other services
3. Open an issue for discussion
4. Reach out to maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to QuizHub! 🎉
