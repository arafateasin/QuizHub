# Deployment Guide - Digital Ocean App Platform

This guide explains how to deploy the QuizHub backend services to Digital Ocean App Platform.

## Prerequisites
- Digital Ocean Account
- GitHub Repository connected to Digital Ocean

## Step 1: Create App
1.  Go to **Apps** in Digital Ocean dashboard.
2.  Click **Create App**.
3.  Select **GitHub** as the source.
4.  Choose the `QuizHub` repository and `main` branch.
5.  Click **Next**.

## Step 2: Configure Services
Digital Ocean will try to auto-detect services. Since this is a monorepo with Dockerfiles, you might need to edit the resources.

You need to add **3 Services** (Components) pointing to the same repository but using different Dockerfiles.

### 1. Gateway Service
-   **Name**: `gateway`
-   **Type**: Web Service
-   **Source Directory**: `/` (Root)
-   **Dockerfile Path**: `apps/gateway/Dockerfile`
-   **HTTP Port**: `3000`
-   **Environment Variables**:
    -   `PORT`: `3000`
    -   `NODE_ENV`: `production`
    -   `CORS_ORIGIN`: `https://your-frontend-url.netlify.app` (Update this after frontend deploy)
    -   `AUTH_SERVICE_URL`: `${auth-service.PRIVATE_URL}` (Internal URL)
    -   `QUIZ_SERVICE_URL`: `${quiz-service.PRIVATE_URL}` (Internal URL)

### 2. Auth Service
-   **Name**: `auth-service`
-   **Type**: Web Service (or Internal Service if not accessed publicly)
-   **Source Directory**: `/` (Root)
-   **Dockerfile Path**: `apps/auth-service/Dockerfile`
-   **HTTP Port**: `3001`
-   **Environment Variables**:
    -   `PORT`: `3001`
    -   `NODE_ENV`: `production`
    -   `MONGO_URI`: `your_mongo_connection_string`
    -   `JWT_SECRET`: `secure_random_string`
    -   `JWT_REFRESH_SECRET`: `secure_random_string`
    -   `FIREBASE_PROJECT_ID`: `quizhub-98649`
    -   `GOOGLE_APPLICATION_CREDENTIALS`: (See Note below)

> **Note on Google Credentials**: For production, you should convert `serviceAccountKey.json` to a base64 string or use a secret manager, and update the code to read from the env var directly, or mount the file.

### 3. Quiz Service
-   **Name**: `quiz-service`
-   **Type**: Web Service (or Internal Service)
-   **Source Directory**: `/` (Root)
-   **Dockerfile Path**: `apps/quiz-service/Dockerfile`
-   **HTTP Port**: `3002`
-   **Environment Variables**:
    -   `PORT`: `3002`
    -   `NODE_ENV`: `production`
    -   `MONGO_URI`: `your_mongo_connection_string`
    -   `AUTH_SERVICE_URL`: `${auth-service.PRIVATE_URL}`

## Step 3: Review and Launch
1.  Review the plan (Basic or Pro).
2.  Click **Create Resources**.

## Step 4: Post-Deployment
1.  Get the **Public URL** of the `gateway` service.
2.  Update your Frontend's `NEXT_PUBLIC_API_URL` on Netlify to this URL.
3.  Update the `CORS_ORIGIN` on Gateway/Auth/Quiz services to your Netlify URL.
