#!/bin/bash
# Build script for deployment

cd backend/core

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate --noinput

echo "Build complete!"
