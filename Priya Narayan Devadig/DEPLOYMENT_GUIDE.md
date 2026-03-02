# 🚀 Deployment Guide - Freelance Marketplace

## 📋 **Pre-Deployment Checklist**

- [ ] All features tested locally
- [ ] Database migrations created and tested
- [ ] Environment variables documented
- [ ] Static files collected
- [ ] CORS configured
- [ ] SSL/HTTPS ready
- [ ] Email service configured

---

## 🎯 **Option 1: Deploy to Render.com (Recommended)**

### **Why Render?**
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ PostgreSQL included
- ✅ Easy deployment
- ✅ Auto-deploy from Git

### **Step 1: Prepare Your Repository**

```bash
# Add production requirements
pip install -r requirements-production.txt

# Create .env file from example
cp .env.production.example .env
# Edit .env with your values

# Test production settings locally
python manage.py check --settings=freelance_marketplace.settings_production
```

### **Step 2: Push to GitHub**

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### **Step 3: Deploy on Render**

1. **Go to [render.com](https://render.com)** and sign up
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure:**
   - **Name:** `talentlink-backend`
   - **Environment:** `Python 3`
   - **Build Command:** 
     ```
     pip install -r requirements-production.txt && python manage.py collectstatic --noinput && python manage.py migrate
     ```
   - **Start Command:** 
     ```
     gunicorn freelance_marketplace.wsgi:application
     ```

5. **Add Environment Variables:**
   ```
   PYTHON_VERSION=3.10.0
   DJANGO_SETTINGS_MODULE=freelance_marketplace.settings_production
   SECRET_KEY=<generate-random-key>
   DEBUG=False
   DATABASE_URL=<will-be-auto-filled>
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   ```

6. **Create PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - Name: `talentlink-db`
   - Copy the **Internal Database URL**
   - Add it as `DATABASE_URL` in your web service

7. **Deploy!** Click "Create Web Service"

### **Step 4: Deploy Frontend**

#### **Option A: Netlify**

1. **Build your frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Update API URL in frontend:**
   - Create `frontend/.env.production`:
     ```
     REACT_APP_API_URL=https://your-backend.onrender.com
     ```

3. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag & drop the `build` folder
   - Or connect GitHub for auto-deploy

#### **Option B: Vercel**

```bash
cd frontend
npm install -g vercel
vercel --prod
```

---

## 🎯 **Option 2: Deploy to Heroku**

### **Step 1: Install Heroku CLI**

```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
heroku login
```

### **Step 2: Create Heroku App**

```bash
# Create app
heroku create talentlink-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set DJANGO_SETTINGS_MODULE=freelance_marketplace.settings_production
heroku config:set SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
heroku config:set DEBUG=False
heroku config:set EMAIL_HOST=smtp.gmail.com
heroku config:set EMAIL_PORT=587
heroku config:set EMAIL_HOST_USER=your-email@gmail.com
heroku config:set EMAIL_HOST_PASSWORD=your-app-password
```

### **Step 3: Create Procfile**

```bash
echo "web: gunicorn freelance_marketplace.wsgi:application" > Procfile
echo "release: python manage.py migrate" >> Procfile
```

### **Step 4: Deploy**

```bash
git add .
git commit -m "Configure for Heroku"
git push heroku main

# Run migrations
heroku run python manage.py migrate

# Create superuser
heroku run python manage.py createsuperuser

# Open app
heroku open
```

---

## 🎯 **Option 3: Deploy to AWS (Advanced)**

### **Backend on AWS Elastic Beanstalk**

1. **Install EB CLI:**
   ```bash
   pip install awsebcli
   ```

2. **Initialize:**
   ```bash
   eb init -p python-3.10 talentlink-backend
   ```

3. **Create environment:**
   ```bash
   eb create talentlink-prod
   ```

4. **Set environment variables:**
   ```bash
   eb setenv DJANGO_SETTINGS_MODULE=freelance_marketplace.settings_production
   eb setenv SECRET_KEY=your-secret-key
   eb setenv DEBUG=False
   ```

5. **Deploy:**
   ```bash
   eb deploy
   ```

### **Frontend on AWS S3 + CloudFront**

1. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 bucket and upload:**
   ```bash
   aws s3 mb s3://talentlink-frontend
   aws s3 sync build/ s3://talentlink-frontend
   ```

3. **Configure CloudFront for CDN**

---

## 🔒 **Security Configuration**

### **1. Generate Secret Key**

```python
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### **2. Configure CORS**

Update `settings_production.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
]
```

### **3. SSL/HTTPS**

- Render/Heroku: Automatic HTTPS ✅
- Custom domain: Use Let's Encrypt or Cloudflare

### **4. Email Configuration**

**Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Generate App Password
4. Use in `EMAIL_HOST_PASSWORD`

---

## 📊 **Post-Deployment Tasks**

### **1. Create Seed Data**

```bash
# On Render/Heroku
python manage.py shell

# Run seed script
exec(open('seed_data.py').read())
```

### **2. Test Endpoints**

```bash
# Test API
curl https://your-backend.onrender.com/api/

# Test authentication
curl -X POST https://your-backend.onrender.com/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

### **3. Monitor Logs**

```bash
# Render
render logs

# Heroku
heroku logs --tail

# AWS
eb logs
```

---

## 🔧 **Environment Variables Reference**

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | `django-insecure-...` |
| `DEBUG` | Debug mode | `False` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host/db` |
| `ALLOWED_HOSTS` | Allowed domains | `your-domain.com` |
| `EMAIL_HOST` | SMTP server | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_HOST_USER` | Email username | `your-email@gmail.com` |
| `EMAIL_HOST_PASSWORD` | Email password | `app-specific-password` |
| `FRONTEND_URL` | Frontend URL | `https://your-frontend.com` |

---

## 🐛 **Troubleshooting**

### **Issue: Static files not loading**

```bash
python manage.py collectstatic --noinput
```

### **Issue: Database connection error**

Check `DATABASE_URL` format:
```
postgresql://username:password@host:5432/database_name
```

### **Issue: CORS errors**

Update `CORS_ALLOWED_ORIGINS` in settings_production.py

### **Issue: 500 Internal Server Error**

Check logs:
```bash
# Render
render logs

# Heroku
heroku logs --tail
```

---

## ✅ **Deployment Checklist**

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database migrations applied
- [ ] Static files served correctly
- [ ] CORS configured properly
- [ ] HTTPS working
- [ ] Email notifications working
- [ ] Seed data loaded
- [ ] Admin panel accessible
- [ ] All API endpoints tested
- [ ] Error monitoring set up
- [ ] Backup strategy in place

---

## 📚 **Additional Resources**

- [Render Documentation](https://render.com/docs)
- [Heroku Django Guide](https://devcenter.heroku.com/articles/django-app-configuration)
- [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)

---

## 🎉 **Your App is Live!**

Backend: `https://your-backend.onrender.com`
Frontend: `https://your-frontend.netlify.app`
Admin: `https://your-backend.onrender.com/admin`

**Next Steps:**
1. Share with users
2. Monitor performance
3. Collect feedback
4. Iterate and improve!
