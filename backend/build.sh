#!/usr/bin/env bash
# exit on error
set -o errexit

# If we are running from the root (as Render does), go to the backend directory
if [ -d "backend" ]; then
  cd backend
fi

pip install -r requirements.txt

python manage.py collectstatic --noinput
python manage.py migrate