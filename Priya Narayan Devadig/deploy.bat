@echo off
REM Deployment script for Freelance Marketplace (Windows)

echo 🚀 Starting deployment process...
echo ==================================

REM Check if virtual environment is activated
if not defined VIRTUAL_ENV (
    echo ⚠️  Virtual environment not activated. Activating...
    call venv\Scripts\activate
)

REM Install production dependencies
echo 📦 Installing production dependencies...
pip install -r requirements-production.txt

REM Collect static files
echo 📁 Collecting static files...
python manage.py collectstatic --noinput --settings=freelance_marketplace.settings_production

REM Run migrations
echo 🗄️  Running database migrations...
python manage.py migrate --settings=freelance_marketplace.settings_production

REM Check for issues
echo 🔍 Running system checks...
python manage.py check --deploy --settings=freelance_marketplace.settings_production

echo ==================================
echo ✅ Deployment preparation complete!
echo.
echo Next steps:
echo 1. Set environment variables
echo 2. Push to your hosting platform
echo 3. Run seed data (optional): python seed_data.py
echo 4. Create superuser: python manage.py createsuperuser
echo.
echo 🎉 Ready for production!
pause
