# TalentLink Deployment Guide

This guide provides step-by-step instructions for deploying TalentLink to production using free-tier services.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Render/Heroku)](#backend-deployment)
3. [Frontend Deployment (Vercel/Netlify)](#frontend-deployment)
4. [Database Setup (PostgreSQL)](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment](#post-deployment)

---

## Prerequisites

- GitHub account (for hosting code)
- Email account (for environment variables)
- Git installed on your machine

---

## Backend Deployment

### Option 1: Render (Recommended - Free Tier)

1. **Sign up at [Render.com](https://render.com)**
   - Use GitHub to sign up

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing TalentLink

3. **Configure Build Settings**
   - **Name**: `talentlink-backend` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend/core` (leave empty if project root is backend/core)
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r ../../requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
     ```
   - **Start Command**: 
     ```bash
     gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
     ```

4. **Set Environment Variables** (see [Environment Variables](#environment-variables) section)

5. **Create PostgreSQL Database**
   - Go to Dashboard → "New +" → "PostgreSQL"
   - Choose free tier
   - Copy the "Internal Database URL"
   - Add it as `DATABASE_URL` in your web service environment variables

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://talentlink-backend.onrender.com`)

### Option 2: Heroku (Alternative)

1. **Install Heroku CLI**
   ```bash
   # Windows
   winget install Heroku.HerokuCLI
   
   # Or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create talentlink-backend
   ```

3. **Add PostgreSQL Add-on (Free Tier)**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set SECRET_KEY=your-secret-key-here
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS=talentlink-backend.herokuapp.com
   # ... add other env vars (see Environment Variables section)
   ```

5. **Deploy**
   ```bash
   cd backend/core
   git subtree push --prefix backend/core heroku main
   # Or use Heroku Git
   heroku git:remote -a talentlink-backend
   git push heroku main
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended - Free Tier)

1. **Sign up at [Vercel.com](https://vercel.com)**
   - Use GitHub to sign up

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = your backend URL (e.g., `https://talentlink-backend.onrender.com`)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Note your frontend URL

### Option 2: Netlify (Alternative)

1. **Sign up at [Netlify.com](https://netlify.com)**
   - Use GitHub to sign up

2. **Add New Site**
   - "Add new site" → "Import an existing project"
   - Connect GitHub repository

3. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. **Set Environment Variables**
   - Site settings → Environment variables
   - Add `VITE_API_URL` = your backend URL

5. **Deploy**
   - Click "Deploy site"

---

## Database Setup

### Using Render PostgreSQL (Free Tier)

1. Create PostgreSQL database in Render dashboard
2. Copy the "Internal Database URL"
3. Add to backend environment variables as `DATABASE_URL`

### Manual PostgreSQL Setup (if needed)

1. Install PostgreSQL locally or use cloud provider
2. Create database:
   ```sql
   CREATE DATABASE talentlink_db;
   CREATE USER talentlink_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE talentlink_db TO talentlink_user;
   ```
3. Update `DATABASE_URL` in environment variables

---

## Environment Variables

### Backend Environment Variables

Add these to your backend deployment (Render/Heroku):

```bash
# Required
SECRET_KEY=your-very-long-random-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-backend-url.onrender.com,localhost,127.0.0.1

# Database (if not using DATABASE_URL)
DATABASE_URL=postgresql://user:password@host:port/dbname

# CORS (replace with your frontend URL)
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.netlify.app

# Redis (optional, for WebSockets - can use free tier from Upstash/Redis Cloud)
REDIS_URL=redis://username:password@host:port

# Email (optional, for notifications)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@talentlink.com
```

**How to generate SECRET_KEY:**
```python
# In Python shell
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

### Frontend Environment Variables

Add to your frontend deployment (Vercel/Netlify):

```bash
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## Post-Deployment

### 1. Run Database Migrations

If migrations didn't run automatically:

```bash
# For Render: Add to build command
python manage.py migrate

# For Heroku: Run via CLI
heroku run python manage.py migrate
```

### 2. Create Superuser (for Admin Panel)

```bash
# Render: Use Render Shell or add to build script
python manage.py createsuperuser

# Heroku
heroku run python manage.py createsuperuser
```

### 3. Seed Sample Data (Optional)

```bash
# Render Shell or Heroku CLI
python manage.py seed_data
```

### 4. Update CORS Settings

Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL in backend environment variables.

### 5. Verify Deployment

- ✅ Backend API accessible at `https://your-backend-url.onrender.com/api/`
- ✅ Frontend accessible at `https://your-frontend.vercel.app`
- ✅ Database migrations applied
- ✅ Static files collected
- ✅ CORS configured correctly

---

## Troubleshooting

### Backend Issues

**Static files not loading:**
- Ensure `collectstatic` runs in build command
- Check `STATIC_ROOT` is set correctly
- Verify WhiteNoise middleware is in MIDDLEWARE

**Database connection errors:**
- Verify `DATABASE_URL` is set correctly
- Check database is running
- Ensure SSL mode if required

**CORS errors:**
- Check `CORS_ALLOWED_ORIGINS` includes frontend URL
- Ensure no trailing slashes in URLs

### Frontend Issues

**API connection errors:**
- Verify `VITE_API_URL` is set correctly
- Check backend URL is accessible
- Ensure CORS is configured on backend

**Build failures:**
- Check Node.js version (should be 18+)
- Verify all dependencies in package.json
- Check build logs for specific errors

---

## Free Tier Limits

### Render
- **Web Service**: 750 hours/month (enough for 1 service 24/7)
- **PostgreSQL**: 90 days data retention, 1GB storage
- **Sleep after inactivity**: Free services sleep after 15 minutes

### Vercel
- **Bandwidth**: 100GB/month
- **Build minutes**: 6000/month
- **Serverless functions**: 100GB-hours/month

### Netlify
- **Bandwidth**: 100GB/month
- **Build minutes**: 300 minutes/month
- **Form submissions**: 100/month

---

## Cost Optimization Tips

1. **Use Render for backend** (generous free tier)
2. **Use Vercel for frontend** (excellent for static sites)
3. **Combine small databases** if possible
4. **Monitor usage** to avoid hitting limits
5. **Use Upstash Redis** (free tier) for Redis if needed

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Ensure all dependencies are in requirements.txt
4. Check database connectivity
5. Review CORS and security settings
