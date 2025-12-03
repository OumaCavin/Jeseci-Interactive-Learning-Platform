#!/bin/bash
echo "=== Starting Redis and Celery Worker ==="

# Start Redis if not already running
echo "Checking Redis status..."
if ! pgrep -x "redis-server" > /dev/null; then
    echo "Starting Redis server..."
    redis-server --daemonize yes --port 6379 --bind 127.0.0.1
    sleep 2
else
    echo "Redis is already running"
fi

# Verify Redis is accessible
echo "Testing Redis connection..."
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is responding"
else
    echo "❌ Redis is not responding - trying to start manually..."
    redis-server --daemonize yes --port 6379 --bind 127.0.0.1
    sleep 3
    if redis-cli ping > /dev/null 2>&1; then
        echo "✅ Redis is now responding"
    else
        echo "❌ Failed to start Redis"
        exit 1
    fi
fi

echo ""
echo "Starting Celery worker..."
cd backend
source venv/bin/activate
celery -A jeseci_platform worker -l info