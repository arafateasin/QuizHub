# Deployment Guide: Render + Netlify

This guide explains how to deploy the **Backend** to Render and the **Frontend** to Netlify.

## Part 1: Backend Deployment (Render)

We will use the `render.yaml` blueprint to deploy all 3 backend services (Gateway, Auth, Quiz) automatically.

### 1. Push Changes
Ensure you have pushed the latest code (including `render.yaml` and `Dockerfile` fixes) to GitHub:
```bash
git add .
git commit -m "chore: ready for render deployment"
git push
```

### 2. Create Blueprint on Render
1.  Go to [dashboard.render.com](https://dashboard.render.com).
2.  Click **New +** -> **Blueprint**.
3.  Connect your GitHub account and select the `QuizHub` repository.
4.  **Name**: `quizhub-backend`.
5.  **Review Resources**: You will see 3 services listed (`quizhub-gateway`, `quizhub-auth`, `quizhub-quiz`).
6.  **Environment Variables**: You will be prompted to enter values for:
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `CORS_ORIGIN`: Put `*` (asterisk) for now. We will update this after deploying the frontend.
7.  Click **Apply**.

### 3. Upload Secret File (Crucial for Auth)
**IMMEDIATELY** after clicking Apply (while it's building):
1.  Click on the **quizhub-auth** service in the dashboard.
2.  Go to **Environment** tab.
3.  Scroll down to **Secret Files**.
4.  Click **Add Secret File**.
5.  **Filename**: `serviceAccountKey.json` (Must match exactly).
6.  **Content**: Paste the entire content of your local `serviceAccountKey.json`.
7.  Click **Save Changes**.

### 4. Get Gateway URL
Once deployment finishes (green checkmarks):
1.  Click on the `quizhub-gateway` service.
2.  Copy the URL (e.g., `https://quizhub-gateway.onrender.com`).
    *   **This is your `NEXT_PUBLIC_API_URL`.**

---

## Part 2: Frontend Deployment (Netlify)

### 1. New Site
1.  Go to [app.netlify.com](https://app.netlify.com).
2.  Click **Add new site** -> **Import from Git**.
3.  Select **GitHub** and choose `QuizHub`.

### 2. Configure Build
*   **Base directory**: `apps/frontend`
*   **Build command**: `npm --workspace @quizhub/frontend run build`
*   **Publish directory**: `apps/frontend/.next`

### 3. Environment Variables
Click **Add environment variables** and add:

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://quizhub-gateway.onrender.com` (Your Render Gateway URL) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyDQzIyWyRlpxZdwcF4eVQqK7yns_QbTNpM` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `quizhub-98649.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `quizhub-98649` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `quizhub-98649.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `113444927449` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:113444927449:web:846d144c88f1b2045bcbc8` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-VEMWBTK5DG` |

### 4. Deploy
Click **Deploy site**.

---

## Part 3: Final Security Step

Once your Netlify site is live (e.g., `https://quizhub-frontend.netlify.app`):

1.  Go back to **Render Dashboard**.
2.  Go to **Blueprints** -> `quizhub-backend` -> **Env Groups** (or individual services).
3.  Update `CORS_ORIGIN` to your Netlify URL: `https://quizhub-frontend.netlify.app` (No trailing slash!).
4.  Render will auto-redeploy.
