# QuizHub Frontend

A modern, responsive quiz platform built with Next.js 14, React 18, TailwindCSS, and Firebase.

## Features

- 🔐 **Authentication**: Firebase Auth with Google OAuth and Email/Password
- 📊 **Dashboard**: User stats, XP tracking, level progression
- 📝 **Quiz Taking**: Interactive quiz interface with timer and progress tracking
- 🎮 **Gamification**: XP system, levels, badges, and leaderboards
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS and animations
- 🔥 **Real-time**: Firebase integration for real-time updates
- 📈 **Analytics**: Firebase Analytics for tracking user engagement

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Authentication**: Firebase Auth
- **UI Components**: Lucide Icons, Framer Motion
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Analytics**: Firebase Analytics
- **Storage**: Firebase Storage

## Prerequisites

- Node.js 18+ installed
- Firebase project configured
- Backend services running (Gateway, Auth, Quiz services)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npm run type-check
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages (login, signup, forgot-password)
│   ├── dashboard/         # User dashboard
│   ├── quizzes/           # Quiz browsing
│   ├── quiz/[id]/         # Quiz taking interface
│   ├── profile/           # User profile
│   ├── leaderboard/       # Rankings and leaderboard
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── dashboard-layout.tsx
│   ├── protected-route.tsx
│   └── providers.tsx
├── contexts/              # React contexts
│   └── auth-context.tsx
├── lib/                   # Utilities and services
│   ├── api/              # API client functions
│   │   ├── quiz.ts
│   │   └── user.ts
│   ├── api-client.ts     # Axios instance and interceptors
│   ├── firebase.ts       # Firebase initialization
│   ├── firebase-auth.ts  # Auth helper functions
│   ├── firebase-analytics.ts  # Analytics tracking
│   ├── firebase-storage.ts    # Storage operations
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
```

## Key Features Implementation

### Authentication Flow

1. Firebase Authentication (Google OAuth + Email/Password)
2. Automatic token refresh
3. Protected routes with auth guard
4. Session management with Firebase

### Dashboard

- User statistics (XP, Level, Quizzes completed)
- Progress tracking with visual indicators
- Recent quiz attempts history
- Quick actions to start new quizzes

### Quiz Taking

- Multi-question interface with pagination
- Support for multiple question types (MCQ, True/False, Short Answer)
- Timer with countdown for timed quizzes
- Progress bar showing completion status
- Auto-submit when time expires

### Gamification

- XP system with level progression
- Visual progress bars
- Badge collection
- Leaderboard rankings
- Streak tracking

## API Integration

The frontend communicates with the backend through the API Gateway:

- **Auth Service**: `/api/auth/*`, `/api/users/*`
- **Quiz Service**: `/api/quizzes/*`, `/api/attempts/*`

All API requests include Firebase ID token in Authorization header.

## Styling Guidelines

- Use Tailwind utility classes
- Custom theme colors: `primary` (blue) and `secondary` (purple)
- Responsive breakpoints: `sm`, `md`, `lg`, `xl`
- Custom animations defined in `tailwind.config.ts`
- Font families: Inter (body), Space Grotesk (headings)

## Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- React Query for data caching and synchronization
- Lazy loading for non-critical components
- Firebase Analytics for performance monitoring

## Deployment

### Firebase Hosting

```bash
# Build the application
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Development Tips

1. **State Management**: Use React Query for server state, Zustand for client state
2. **Forms**: Always use React Hook Form with Zod validation
3. **Error Handling**: All errors are caught by axios interceptors and shown as toasts
4. **Authentication**: Check auth state before making API calls
5. **Analytics**: Track important user actions with Firebase Analytics

## Available Scripts

- `npm run dev` - Start development server on port 3006
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Troubleshooting

### Firebase Auth Errors

- Check Firebase console for enabled auth providers
- Verify environment variables are correct
- Ensure Firebase config is properly initialized

### API Connection Errors

- Verify backend services are running
- Check CORS configuration in gateway
- Confirm API_URL environment variable

### Build Errors

- Clear Next.js cache: `rm -rf .next`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

## Contributing

1. Follow the existing code style
2. Add TypeScript types for all new components
3. Write descriptive commit messages
4. Test on multiple screen sizes
5. Ensure no console errors or warnings

## License

MIT License - see LICENSE file for details
