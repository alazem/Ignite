#!/usr/bin/env bash
# exit on error
set -o errexit

# If we are running from the root (as Render does), go to the backend directory
if [ -d "backend" ]; then
  cd backend
fi

pip install -r requirements.txt

# Clean static files to prevent corruption
rm -rf staticfiles/

python manage.py collectstatic --noinput
python manage.py migrate

# Create superuser from environment variables (skips if already exists)
if [ "$DJANGO_SUPERUSER_USERNAME" ]; then
  python manage.py createsuperuser --noinput || true
fi

# Seed initial data (safe to run multiple times)
python seed_data.py