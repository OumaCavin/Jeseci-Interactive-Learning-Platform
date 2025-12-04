#!/bin/bash

# Start Celery Worker Script
# Includes JaC initialization and Redis testing

echo "🔄 Starting JESECI Interactive Learning Platform - Celery Worker"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Change to backend directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/backend"

print_info "Current directory: $(pwd)"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found! Run setup.sh first."
    exit 1
fi

# Load environment variables
print_info "Loading environment variables..."
source .env

# Check virtual environment
if [ -d "venv" ]; then
    print_info "Activating virtual environment..."
    source venv/bin/activate
    print_success "Virtual environment activated"
elif [[ "$VIRTUAL_ENV" != "" ]]; then
    print_success "Already in virtual environment: $VIRTUAL_ENV"
else
    print_warning "No virtual environment found or active"
fi

# Set Python path
export PYTHONPATH="${PWD}:${PYTHONPATH}"

# Initialize JaC walkers before starting Celery
print_info "Initializing JaC walkers..."
python manage.py init_jac_walkers
if [ $? -eq 0 ]; then
    print_success "✅ JaC walkers initialized successfully"
else
    print_warning "⚠️  JaC walker initialization had issues - using fallback execution"
fi

# Test Redis connection
print_info "Testing Redis connection..."
if [ -n "$REDIS_PASSWORD" ]; then
    print_info "Using Redis password: $REDIS_PASSWORD"
    
    # Test Redis CLI connection
    if command -v redis-cli >/dev/null 2>&1; then
        if redis-cli -a "$REDIS_PASSWORD" ping 2>/dev/null; then
            print_success "✅ Redis CLI connection successful"
        else
            print_warning "⚠️  Redis CLI connection failed - make sure Redis is running"
            print_info "Try: sudo systemctl start redis"
        fi
    fi
    
    # Test Python Redis connection
    python -c "
import redis
import os
try:
    r = redis.Redis(host='localhost', port=6379, password='$REDIS_PASSWORD', decode_responses=True)
    result = r.ping()
    print('✅ Python Redis connection successful')
except Exception as e:
    print(f'⚠️  Python Redis connection failed: {e}')
    print('Note: Celery will retry connection periodically')
" 2>/dev/null
else
    print_warning "⚠️  No Redis password configured"
fi

# Check JaC walker status
print_info "Checking JaC walker status..."
python manage.py shell -c "
from jac_layer.jac_manager import jac_manager
try:
    walkers = jac_manager.get_available_walkers()
    loaded_count = sum(1 for info in walkers.values() if info['loaded'])
    total_count = len(walkers)
    print(f'📊 JaC Status: {loaded_count}/{total_count} walkers loaded')
    for name, info in walkers.items():
        status = '✅' if info['loaded'] else '❌'
        print(f'  {status} {name}')
except Exception as e:
    print(f'⚠️  Error checking walkers: {e}')
" 2>/dev/null

# Display service information
print_info "====================================="
print_info "Celery Worker Information:"
print_info "====================================="
print_info "Broker URL: $CELERY_BROKER_URL"
print_info "Result Backend: $CELERY_RESULT_BACKEND"
print_info "Tasks will be processed from Django API"
print_info "Monitor logs for JaC walker execution"
print_info "====================================="

# Start Celery worker
print_success "Starting Celery worker..."
echo ""
echo "Press Ctrl+C to stop the worker"
echo ""

celery -A jeseci_platform worker --loglevel=info