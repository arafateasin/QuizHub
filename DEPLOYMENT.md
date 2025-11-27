# Deployment Guide: Digital Ocean + Netlify

This guide explains how to deploy the **Backend** to Digital Ocean App Platform and the **Frontend** to Netlify.

## Part 1: Backend Deployment (Digital Ocean)

We will deploy the 3 backend services (`gateway`, `auth-service`, `quiz-service`) as components within a single Digital Ocean App.

### 1. Create App
1.  Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps).
2.  Click **Create App**.
3.  **Service Provider**: Select **GitHub**.
4.  **Repository**: Select `QuizHub`.
5.  **Branch**: `main`.
6.  **Source Directory**: `/` (Keep as default).
7.  Click **Next**.

### 2. Configure Resources (Services)
Digital Ocean might try to auto-detect. You need to configure **3 separate services**. If it detects one, edit it. You can add more components later or configure them all now.

#### Service 1: Gateway (Public Entry Point)
*   **Name**: `quizhub-gateway`
*   **Type**: Web Service
*   **Dockerfile Path**: `apps/gateway/Dockerfile`
*   **HTTP Port**: `3000`
*   **Environment Variables**:
    *   `PORT`: `3000`
    *   `NODE_ENV`: `production`
    *   `CORS_ORIGIN`: `*` (Update to Netlify URL later)
    *   `AUTH_SERVICE_URL`: `${quizhub-auth.PRIVATE_URL}` (or the public URL if private networking fails)
    *   `QUIZ_SERVICE_URL`: `${quizhub-quiz.PRIVATE_URL}`

#### Service 2: Auth Service
*   **Name**: `quizhub-auth`
*   **Type**: Web Service
*   **Dockerfile Path**: `apps/auth-service/Dockerfile`
*   **HTTP Port**: `3001`
*   **Environment Variables**:
    *   `PORT`: `3001`
    *   `NODE_ENV`: `production`
    *   `MONGO_URI`: (Your MongoDB Connection String)
    *   `JWT_SECRET`: (Generate a secure random string)
    *   `JWT_REFRESH_SECRET`: (Generate a secure random string)
    *   `FIREBASE_PROJECT_ID`: `quizhub-98649`
    *   `FIREBASE_SERVICE_ACCOUNT_JSON`: (Paste the entire content of `serviceAccountKey.json` here)

#### Service 3: Quiz Service
*   **Name**: `quizhub-quiz`
*   **Type**: Web Service
*   **Dockerfile Path**: `apps/quiz-service/Dockerfile`
*   **HTTP Port**: `3002`
*   **Environment Variables**:
    *   `PORT`: `3002`
    *   `NODE_ENV`: `production`
    *   `MONGO_URI`: (Your MongoDB Connection String)
    *   `AUTH_SERVICE_URL`: `${quizhub-auth.PRIVATE_URL}`

### 3. Review and Create
1.  Select your plan (Basic or Pro).
2.  Click **Create Resources**.

---

## Part 2: Frontend Deployment (Netlify)

(Same as before)

1.  **New Site** -> Import from Git -> `QuizHub`.
2.  **Base directory**: `apps/frontend`.
3.  **Build command**: `npm --workspace @quizhub/frontend run build`.
4.  **Publish directory**: `apps/frontend/.next`.
5.  **Env Vars**:
    *   `NEXT_PUBLIC_API_URL`: (Your Digital Ocean Gateway URL)
    *   (Add all Firebase public vars)

---

## Part 3: Final Config
1.  Update `CORS_ORIGIN` in Digital Ocean `quizhub-gateway` to your Netlify URL.
