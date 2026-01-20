# Local Development Setup Guide

This guide will help you run TalentLink locally on your machine for testing and development.

## Prerequisites

Before starting, make sure you have installed:
- **Python 3.12+** - [Download here](https://www.python.org/downloads/)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL** (optional, for production-like setup) or SQLite (default)
- **Git** - [Download here](https://git-scm.com/downloads)

## Step-by-Step Setup

### 1. Clone and Navigate to Project

```bash
cd "C:\Users\U S A GAMES KARUR\Documents\TalentLink"
```

### 2. Backend Setup

#### 2.1 Activate Virtual Environment

**Windows PowerShell:**
```powershell
.\env\Scripts\Activate.ps1
```

If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Windows Command Prompt:**
```cmd
env\Scripts\activate.bat
```

**Mac/Linux:**
```bash
source env/bin/activate
```

#### 2.2 Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### 2.3 Configure Environment Variables

Create a `.env` file in `backend/core/` directory:

```bash
cd backend/core
```

Create `.env` file with this content:

```env
# Django Settings
SECRET_KEY=django-insecure-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (using SQLite for local development)
# Leave DB_ENGINE empty or set to 'sqlite' for SQLite
# Set to 'postgresql' if using PostgreSQL

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Redis (optional, for WebSockets - can skip for basic testing)
# REDIS_URL=redis://127.0.0.1:6379
```

**Note:** If you want to use PostgreSQL locally instead:
```env
DB_ENGINE=postgresql
DB_NAME=talentlink_db
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

#### 2.4 Run Database Migrations

```bash
python manage.py migrate
```

#### 2.5 Create Superuser (Admin Account)

```bash
python manage.py createsuperuser
```

Follow prompts to create admin username, email, and password.

#### 2.6 Seed Sample Data (Optional but Recommended)

```bash
python manage.py seed_data
```

This creates:
- Test client accounts: `client1` / `testpass123`
- Test freelancer accounts: `freelancer1` / `testpass123`
- Sample projects, proposals, and contracts

#### 2.7 Start Backend Server

```bash
python manage.py runserver
```

The backend will run at **http://127.0.0.1:8000**

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

**Keep this terminal window open!**

---

### 3. Frontend Setup

Open a **new terminal window** (keep backend running).

#### 3.1 Navigate to Frontend Directory

```bash
cd "C:\Users\U S A GAMES KARUR\Documents\TalentLink\frontend"
```

#### 3.2 Install Node Dependencies

```bash
npm install
```

This may take a few minutes on first run.

#### 3.3 Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

#### 3.4 Start Frontend Development Server

```bash
npm run dev
```

The frontend will run at **http://localhost:5173**

You should see:
```
  VITE v7.2.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Keep this terminal window open!**

---

## 4. Access the Application

### Frontend (Main App)
- **URL**: http://localhost:5173
- This is where you'll interact with the application

### Backend API
- **URL**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/api/ (if browsable API is enabled)

### Admin Panel
- **URL**: http://127.0.0.1:8000/admin
- Use the superuser credentials you created in step 2.5

---

## 5. Testing the Application

### Test Accounts (if you ran `seed_data`)

**Client Account:**
- Username: `client1`
- Password: `testpass123`

**Freelancer Account:**
- Username: `freelancer1`
- Password: `testpass123`

### Manual Testing Flow

1. **Register New User**
   - Go to http://localhost:5173/register
   - Create a client or freelancer account

2. **Login**
   - Go to http://localhost:5173/login
   - Use test accounts or newly created account

3. **As a Client:**
   - View dashboard: http://localhost:5173/client/dashboard
   - Create project: http://localhost:5173/client/create-project
   - View projects: http://localhost:5173/client/projects

4. **As a Freelancer:**
   - View dashboard: http://localhost:5173/freelancer/dashboard
   - Browse projects: http://localhost:5173/freelancer/browse
   - View proposals: http://localhost:5173/freelancer/proposals

---

## Troubleshooting

### Backend Issues

**"ModuleNotFoundError: No module named 'django'"**
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

**"Port 8000 already in use"**
- Kill the process using port 8000, or
- Run on different port: `python manage.py runserver 8001`
- Update `VITE_API_URL` in frontend `.env` to match

**"Database connection error"**
- If using SQLite: Check file permissions
- If using PostgreSQL: Verify database exists and credentials are correct

**"CORS error"**
- Verify `CORS_ALLOWED_ORIGINS` in backend `.env` includes `http://localhost:5173`
- Restart backend server after changing `.env`

### Frontend Issues

**"Cannot connect to API"**
- Verify backend is running at http://127.0.0.1:8000
- Check `VITE_API_URL` in `frontend/.env` matches backend URL
- Restart frontend dev server after changing `.env`

**"npm install fails"**
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- Make sure Node.js version is 18+

**"Port 5173 already in use"**
- Vite will automatically use next available port
- Or specify: `npm run dev -- --port 3000`

**"Module not found" errors**
- Delete `node_modules` folder
- Run `npm install` again

### Both Services

**Changes not reflecting:**
- Backend: Restart `python manage.py runserver`
- Frontend: Vite hot-reloads automatically, but if stuck, restart `npm run dev`

---

## Stopping the Servers

To stop the servers:
- Press `Ctrl + C` in each terminal window
- Deactivate virtual environment: `deactivate` (in backend terminal)

---

## Additional Commands

### Backend Commands

```bash
# Run tests
python manage.py test

# Create new migration after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Access Django shell
python manage.py shell

# Collect static files (for production)
python manage.py collectstatic
```

### Frontend Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## What's Running?

When everything is set up correctly, you should have:

1. **Backend Terminal:**
   ```
   (env) C:\...\backend\core> python manage.py runserver
   Starting development server at http://127.0.0.1:8000/
   ```

2. **Frontend Terminal:**
   ```
   > npm run dev
   VITE v7.2.4  ready in XXX ms
   ➜  Local:   http://localhost:5173/
   ```

3. **Browser:**
   - Open http://localhost:5173
   - You should see the TalentLink homepage

---

## Next Steps

- Explore the application using test accounts
- Check the [README.md](./README.md) for feature documentation
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) when ready to deploy
- Read API endpoints in the codebase or use `/admin` panel

Happy coding! 🚀
