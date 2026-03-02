#!/bin/bash
# Deployment script for Freelance Marketplace

echo "🚀 Starting deployment process..."
echo "=================================="

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "⚠️  Virtual environment not activated. Activating..."
    source venv/bin/activate
fi

# Install production dependencies
echo "📦 Installing production dependencies..."
pip install -r requirements-production.txt

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput --settings=freelance_marketplace.settings_production

# Run migrations
echo "🗄️  Running database migrations..."
python manage.py migrate --settings=freelance_marketplace.settings_production

# Check for issues
echo "🔍 Running system checks..."
python manage.py check --deploy --settings=freelance_marketplace.settings_production

echo "=================================="
echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables"
echo "2. Push to your hosting platform"
echo "3. Run seed data (optional): python seed_data.py"
echo "4. Create superuser: python manage.py createsuperuser"
echo ""
echo "🎉 Ready for production!"
