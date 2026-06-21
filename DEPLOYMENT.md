# Deployment Guide: Vercel + Render + Supabase

This project is configured to be deployed with:

- **Frontend**: Vercel (static Vite build)
- **Backend API**: Render (Node.js web service)
- **Database**: Supabase PostgreSQL

---

## 1. Supabase Setup

1. Create a new project on [Supabase](https://supabase.com/).
2. Go to **Project Settings → Database**.
3. Copy the **URI** connection string under **Connection string → URI**.
   - Use the **connection pooler** URL (starts with `db.PROJECT_REF.pooler.supabase.com`) for Render.
4. Replace `[YOUR-PASSWORD]` with your database password.
5. Save this string — you will need it for the Render environment variables.

> **Note:** Supabase requires SSL. The backend is already configured to enable SSL automatically in production.

---

## 2. Backend Deployment on Render

The backend is located in the `backend/` folder.

### Option A: Use the Render Blueprint (recommended)

1. Push the repo to GitHub.
2. In Render, click **New → Blueprint** and select this repository.
3. Render will read `backend/render.yaml` and create the service.
4. After creation, open the service **Environment** tab and set:
   - `DATABASE_URL` = your Supabase pooler URI
   - `FRONTEND_URL` = your Vercel frontend URL (set this after deploying the frontend)
5. Deploy the service.

### Option B: Manual Web Service

1. In Render, click **New → Web Service**.
2. Connect your GitHub repo.
3. Set the **Root Directory** to `backend`.
4. Use these settings:
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Add the environment variables listed below.
6. Deploy.

### Environment Variables (Backend)

| Variable | Value | Example |
|---|---|---|
| `NODE_ENV` | `production` | `production` |
| `PORT` | `5000` | `5000` |
| `DATABASE_URL` | Supabase pooler URI | `postgresql://postgres.owwuhsqyskydngwowpyy:password@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres` |
| `FRONTEND_URL` | Your deployed frontend URL | `https://your-app.vercel.app` |
| `JWT_ACCESS_SECRET` | Strong random string | generate with `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | Strong random string | generate with `openssl rand -base64 32` |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry | `15m` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry | `7d` |

### Run Database Migrations

Migrations are **not** run automatically on deploy. Run them manually after the database is connected:

```bash
cd backend
# Set DATABASE_URL to your Supabase URI, then:
npm run migrate:up
```

Or use the Supabase SQL Editor to run the contents of `backend/migrations/1710000000000_initial-schema-up.sql`.

### Seed the Database

After migrations, seed the default users:

```bash
cd backend
# Set DATABASE_URL to your Supabase URI, then:
npm run seed
```

Default users:
- `admin@pitambari.com` / `admin123`
- `production@pitambari.com` / `production123`
- `store@pitambari.com` / `store123`

> **Important:** Change these passwords after first login if this is a production deployment.

---

## 3. Frontend Deployment on Vercel

The frontend is the Vite app at the project root.

### Environment Variables (Frontend)

Add this in the Vercel project dashboard:

| Variable | Value | Example |
|---|---|---|
| `VITE_API_URL` | Your deployed Render backend URL | `https://ruru-pitambari-api.onrender.com` |

### Deploy Steps

1. Import the root folder as a Vercel project.
2. Vercel will detect `vercel.json` and use the Vite framework preset.
3. Build command: `npm run build`
4. Output directory: `dist`

---

## 4. Post-Deployment Checklist

- [ ] Backend builds and starts successfully on Render
- [ ] Database migrations applied to Supabase
- [ ] Seed data inserted (default admin/production/store users)
- [ ] Frontend `VITE_API_URL` points to the deployed Render backend
- [ ] Backend `FRONTEND_URL` matches the deployed Vercel frontend (CORS)
- [ ] Login works with one of the seeded users

---

## 5. Local Development (Unchanged)

Local development still uses Docker Compose for Postgres:

```bash
cd backend
docker-compose up -d
npm run dev
```

And for the frontend:

```bash
npm run dev
```

---

## 6. Optional: Backend on Vercel Instead

If you later want to move the backend to Vercel, the files `backend/vercel.json` and `backend/api/index.ts` are already configured. You can create a second Vercel project with **Root Directory** set to `backend`.
