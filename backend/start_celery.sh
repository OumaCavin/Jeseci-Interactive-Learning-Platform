#!/bin/bash

# Celery startup script for Jeseci Learning Platform
echo "Starting Celery worker for Jeseci Learning Platform..."

# Change to backend directory
cd "$(dirname "$0")"

# Load environment variables
if [ -f ".env" ]; then
    echo "Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
else
    echo "No .env file found, using system environment"
fi

# Activate virtual environment if exists
if [ -d "../venv" ]; then
    source ../venv/bin/activate
elif [ -d "venv" ]; then
    source venv/bin/activate
fi

# Initialize JaC walkers before starting Celery
echo "Initializing JaC walkers..."
python manage.py init_jac_walkers

# Test Redis connection
echo "Testing Redis connection..."
python manage.py setup_redis_auth --test-connection

# Start Celery worker with correct module name
echo "Starting Celery worker..."
celery -A jeseci_platform worker --loglevel=info

echo "Celery worker started successfully!"