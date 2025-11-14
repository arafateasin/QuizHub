# Firebase Integration Guide

## Overview

QuizHub uses Firebase for:

- **Authentication**: Google OAuth, Email/Password authentication
- **Analytics**: User behavior tracking and engagement metrics
- **Hosting**: Static site hosting for the Next.js frontend
- **Storage**: User avatars and quiz media files
- **Firestore** (Optional): Real-time data sync for multiplayer features

## Configuration

### Firebase Project Details

- **Project ID**: `quizhub-98649`
- **App Nickname**: `QuizHub`
- **Hosting Site**: `quizhub-98649`
- **App ID**: `1:113444927449:web:846d144c88f1b2045bcbc8`

### Environment Variables

Add these to your `.env.local` file in `apps/frontend/`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDQzIyWyRlpxZdwcF4eVQqK7yns_QbTNpM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=quizhub-98649.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=quizhub-98649
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=quizhub-98649.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=113444927449
NEXT_PUBLIC_FIREBASE_APP_ID=1:113444927449:web:846d144c88f1b2045bcbc8
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-VEMWBTK5DG
```

## Setup Instructions

### 1. Install Firebase Tools

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase (Already Done)

The project is already configured with:

- `firebase.json` - Hosting and emulator configuration
- `.firebaserc` - Project aliases
- `firestore.rules` - Security rules for Firestore
- `firestore.indexes.json` - Database indexes
- `storage.rules` - Storage security rules

### 4. Install Firebase SDK

```bash
cd apps/frontend
npm install firebase
```

## Available Firebase Services

### 1. Authentication (`apps/frontend/src/lib/firebase-auth.ts`)

```typescript
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
} from "@/lib/firebase-auth";

// Sign up
await signUpWithEmail("user@example.com", "password", "Display Name");

// Sign in
await signInWithEmail("user@example.com", "password");

// Google Sign-in
await signInWithGoogle();

// Sign out
await signOutUser();
```

### 2. Analytics (`apps/frontend/src/lib/firebase-analytics.ts`)

```typescript
import {
  trackQuizStarted,
  trackQuizCompleted,
  trackLogin,
} from "@/lib/firebase-analytics";

// Track quiz events
trackQuizStarted("quiz-id-123", "My Quiz Title");
trackQuizCompleted("quiz-id-123", 85, 120);

// Track user events
trackLogin("google");
```

### 3. Storage (`apps/frontend/src/lib/firebase-storage.ts`)

```typescript
import { uploadAvatar, uploadQuizImage } from "@/lib/firebase-storage";

// Upload user avatar with progress
const avatarURL = await uploadAvatar(userId, file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

// Upload quiz image
const imageURL = await uploadQuizImage(quizId, file);
```

## Security Rules

### Firestore Rules

The `firestore.rules` file defines access control:

- Users can read/write their own data
- Public quizzes are readable by all
- Private quizzes only by owner/admin
- Admins have elevated permissions

### Storage Rules

The `storage.rules` file controls file access:

- User avatars: Max 5MB, only owner can upload
- Quiz images: Public read, authenticated write
- Automatic image type validation

## Firebase Hosting

### Deploy to Firebase Hosting

```bash
# Build the frontend
cd apps/frontend
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Preview Deployment

```bash
firebase hosting:channel:deploy preview
```

### View Deployed Site

```
https://quizhub-98649.web.app
https://quizhub-98649.firebaseapp.com
```

## Firebase Emulator Suite

Run Firebase services locally for development:

```bash
# Start all emulators
firebase emulators:start

# Access emulator UI
# http://localhost:4000
```

**Available Emulators:**

- Authentication: `localhost:9099`
- Firestore: `localhost:8080`
- Storage: `localhost:9199`
- Hosting: `localhost:5000`

## Analytics Dashboard

View analytics data in Firebase Console:

- Go to: https://console.firebase.google.com/project/quizhub-98649/analytics
- Track: User engagement, quiz completions, retention rates

## Common Tasks

### Enable Google Sign-In

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Google provider
3. Add authorized domains

### Create Firestore Database

1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Choose production mode
4. Deploy security rules: `firebase deploy --only firestore:rules`

### Set Up Storage Bucket

1. Go to Firebase Console → Storage
2. Click "Get Started"
3. Deploy storage rules: `firebase deploy --only storage`

### Deploy Security Rules Only

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage

# Deploy all rules
firebase deploy --only firestore:rules,storage
```

## CI/CD with GitHub Actions

The `.github/workflows/firebase-deploy.yml` workflow automatically:

1. Builds the frontend on push to `main`
2. Deploys to Firebase Hosting
3. Requires `FIREBASE_SERVICE_ACCOUNT` secret

### Set Up GitHub Secret

1. Generate service account key:
   ```bash
   firebase init hosting:github
   ```
2. Follow prompts to connect GitHub repository
3. Secret is automatically added

## Monitoring and Logs

### View Logs

```bash
# Hosting logs
firebase hosting:logs

# Functions logs (if using Cloud Functions)
firebase functions:log
```

### Performance Monitoring

Enable in Firebase Console → Performance

- Track page load times
- Monitor API latency
- Identify slow operations

## Cost Optimization

**Spark Plan (Free Tier):**

- 10 GB hosting storage
- 360 MB/day hosting transfer
- 50K reads, 20K writes (Firestore)
- 5 GB storage, 1 GB/day downloads

**Tips:**

- Use caching for static assets
- Implement pagination for large queries
- Optimize images before upload
- Monitor usage in Firebase Console

## Troubleshooting

### Authentication Issues

```bash
# Clear auth state
firebase logout
firebase login

# Check current user
firebase projects:list
```

### Deployment Failures

```bash
# Check deployment status
firebase deploy --debug

# Validate configuration
firebase deploy --only hosting --dry-run
```

### Emulator Connection Issues

```bash
# Clear emulator data
firebase emulators:export ./emulator-data
firebase emulators:start --import=./emulator-data
```

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/project/quizhub-98649)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Next.js + Firebase Guide](https://firebase.google.com/docs/hosting/frameworks/nextjs)

## Support

For Firebase-specific issues:

- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow - Firebase](https://stackoverflow.com/questions/tagged/firebase)
- [Firebase Community Slack](https://firebase.community/)
