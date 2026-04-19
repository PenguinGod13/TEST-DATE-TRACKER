# Revision Planner — Deployment Guide

## Deploy to Vercel

### 1. Create a Postgres database on Vercel

1. Go to [vercel.com](https://vercel.com) → your project → **Storage**
2. Click **Create Database** → **Neon Serverless Postgres**
3. After creation, go to the database settings and copy the **DATABASE_URL** connection string

### 2. Add environment variable

In your Vercel project settings → **Environment Variables**, add:
```
DATABASE_URL = <your connection string from step 1>
```

### 3. Run migrations

After deploying, run the migration to create tables:
```bash
# In your local terminal with DATABASE_URL set in .env:
npx prisma migrate deploy
```

Or add a Vercel build command:
```
prisma migrate deploy && next build
```

### 4. Seed initial subjects and topics

```bash
DATABASE_URL="<your url>" npx prisma db seed
```

---

## Local Development

1. Copy `.env.example` to `.env` and fill in your `DATABASE_URL`
2. `npm install`
3. `npx prisma migrate dev --name init`
4. `npx prisma db seed`
5. `npm run dev`

Open [http://localhost:3000](http://localhost:3000)
