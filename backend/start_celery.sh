#!/bin/bash

# Celery startup script for Jeseci Learning Platform
echo "Starting Celery worker for Jeseci Learning Platform..."

# Change to backend directory
cd "$(dirname "$0")"

# Activate virtual environment if exists
if [ -d "../venv" ]; then
    source ../venv/bin/activate
elif [ -d "venv" ]; then
    source venv/bin/activate
fi

# Start Celery worker
celery -A jeseci_platform worker --loglevel=info

echo "Celery worker started successfully!"