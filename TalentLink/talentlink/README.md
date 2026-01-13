# Local Development Setup

## Quick Start for Local Development

1. **Set up local environment:**
   ```bash
   cd talentlink
   copy .env.local .env
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start development server:**
   ```bash
   python manage.py runserver
   ```

## Environment Files

- **`.env.local`** - SQLite database for local development
- **`.env.prod`** - PostgreSQL on Neon for production
- **`.env.example`** - Template for environment variables

## Deployment

For production deployment on Render:
1. Copy `.env.prod` to `.env`
2. Set environment variables in Render dashboard
3. Deploy