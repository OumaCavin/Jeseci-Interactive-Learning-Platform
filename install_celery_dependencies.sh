#!/bin/bash

echo "Installing Celery and Redis dependencies for Jeseci Learning Platform..."

# Install Celery and Redis client
pip install celery redis

echo "Checking if Celery is installed..."
celery --version

echo "Installation complete!"
echo ""
echo "To start Celery worker, run:"
echo "bash start_celery.sh"