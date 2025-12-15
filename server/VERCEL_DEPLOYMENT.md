# Backend Deployment Guide - Vercel

## Prerequisites
- Vercel CLI installed: `npm i -g vercel`
- GitHub repository with backend code
- Vercel account

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub
```bash
cd C:\Users\rsmgo\Desktop\Prog\Projects\stackcompare\stack-comparev1
git add server/
git commit -m "Add backend server"
git push origin main
```

### Step 2: Create New Vercel Project
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

### Step 3: Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=<your_neon_database_url>
GITHUB_TOKEN=<your_github_token>
STACKOVERFLOW_API_KEY=<your_stackoverflow_api_key>
LIBRARIES_IO_API_KEY=<your_libraries_io_api_key>
B2_KEY_ID=<your_b2_key_id>
B2_APP_KEY=<your_b2_app_key>
B2_BUCKET=stack-compare
B2_BUCKET_ID=<your_b2_bucket_id>
B2_ENDPOINT=s3.us-east-005.backblazeb2.com
OPENAI_API_KEY=<your_openai_api_key>
NEON_AUTH_SECRET=<your_neon_auth_secret>
INTERNAL_API_KEY=<your_internal_api_key>
```

**Important:** Copy the actual values from your local `.env` file!

### Step 4: Deploy
Click **"Deploy"** - Vercel will auto-deploy!

---

## Option 2: Deploy via CLI

```bash
cd server
vercel --prod
```

Follow prompts and set environment variables when asked.

---

## Option 3: Automatic Deployment (CI/CD)

Once connected to GitHub, Vercel automatically deploys on every push to `main`!

### Setup Auto-Deploy:
1. Connect GitHub repo in Vercel Dashboard
2. Enable "Production Branch": `main`
3. Set "Root Directory": `server`
4. Every `git push` triggers deployment

---

## Post-Deployment

### Your API will be available at:
```
https://your-backend.vercel.app/
https://your-backend.vercel.app/docs  # Swagger UI
https://your-backend.vercel.app/health
```

### Update Frontend to Use Backend:
In your Next.js frontend, update API base URL:

```typescript
// app/config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.vercel.app'
```

Then add to frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

---

## Important Notes

⚠️ **Serverless Limitations:**
- Max execution time: 10s (Hobby), 60s (Pro)
- Stateless - no persistent file storage
- Cold starts (~1-2s first request)

✅ **Solutions:**
- Use Backblaze B2 for file storage (already configured)
- Use Neon PostgreSQL for database (already configured)
- Keep functions small and focused

---

## Troubleshooting

### Build Fails
```bash
# Check logs in Vercel Dashboard → Deployments → View Build Logs
```

### Import Errors
Ensure all dependencies are in `requirements.txt`:
```bash
pip freeze > requirements.txt
```

### Environment Variables Not Working
- Check they're set in Vercel Dashboard
- Redeploy after adding env vars

---

## Separate Deployments

**Frontend**: `https://stackcompare.vercel.app` (root directory)
**Backend**: `https://stackcompare-api.vercel.app` (server directory)

Both auto-deploy on git push! 🚀
