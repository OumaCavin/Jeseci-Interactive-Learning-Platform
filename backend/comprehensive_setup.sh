#!/bin/bash

# Comprehensive Setup Script for JESECI Interactive Learning Platform
# This script fixes all compilation and configuration issues

echo "🚀 JESECI Interactive Learning Platform - Comprehensive Setup"
echo "=========================================================="

# Navigate to backend directory
cd "$(dirname "$0")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "🔧 Fixing configuration and compilation issues..."

# =============================================================================
# STEP 1: Environment Setup
# =============================================================================
print_status "📋 Step 1: Setting up environment..."

# Load environment variables
if [ -f ".env" ]; then
    print_success "Loading .env file..."
    export $(grep -v '^#' .env | xargs)
else
    print_error ".env file not found!"
    exit 1
fi

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
    print_success "Virtual environment activated"
elif [ -d "../venv" ]; then
    source ../venv/bin/activate
    print_success "Virtual environment activated (parent dir)"
else
    print_error "Virtual environment not found!"
    exit 1
fi

# Set Python path
export PYTHONPATH="${PWD}:${PYTHONPATH}"
print_success "Python path configured"

# =============================================================================
# STEP 2: Dependencies Installation
# =============================================================================
print_status "📦 Step 2: Installing/updating dependencies..."

# Install/update jaclang
print_status "Installing jaclang 0.9.3..."
pip install jaclang[all]==0.9.3

# Install/update other Python dependencies
print_status "Installing Python dependencies..."
pip install -r requirements.txt 2>/dev/null || print_warning "requirements.txt not found, using Django packages only"

# =============================================================================
# STEP 3: JaC Walker Compilation
# =============================================================================
print_status "🏗️  Step 3: Compiling JaC walker files..."

# Check if jac command is available
if ! command -v jac &> /dev/null; then
    print_error "jac command not found after installation!"
    exit 1
fi

print_success "jac command available: $(jac --version)"

# Method 1: Try compiling the walkers directory
if jac build jac_layer/walkers/ 2>/dev/null; then
    print_success "✅ Successfully compiled walkers using: jac build jac_layer/walkers/"
else
    print_warning "Primary compilation failed, trying alternative methods..."
    
    # Method 2: Try compiling each walker individually
    print_status "🔄 Compiling individual walker files..."
    for walker in jac_layer/walkers/*.jac; do
        if [[ -f "$walker" ]]; then
            filename=$(basename "$walker")
            print_status "📝 Compiling $filename..."
            if jac build "$walker" 2>/dev/null; then
                print_success "✅ Compiled $filename"
            else
                print_warning "⚠️  Warning: Could not compile $filename"
            fi
        fi
    done
    
    # Method 3: Try compiling the main graph file
    print_status "🔄 Trying main graph file compilation..."
    if [[ -f "jac_layer/main.jac" ]]; then
        if jac build jac_layer/main.jac 2>/dev/null; then
            print_success "✅ Compiled main.jac"
        else
            print_warning "⚠️  Warning: Could not compile main.jac"
        fi
    fi
fi

print_status "🔍 Checking for compiled files..."
find . -name "*.jac.py" -o -name "__pycache__" -type d 2>/dev/null | head -5

# =============================================================================
# STEP 4: Django Management Commands
# =============================================================================
print_status "🗂️  Step 4: Running Django management commands..."

# Run JaC walker initialization
print_status "Initializing JaC walkers..."
if python manage.py init_jac_walkers; then
    print_success "✅ JaC walkers initialized successfully"
else
    print_warning "⚠️  JaC walker initialization had issues"
fi

# Test JaC integration
print_status "Testing JaC integration..."
if python manage.py test_jac_integration; then
    print_success "✅ JaC integration test passed"
else
    print_warning "⚠️  JaC integration test had issues"
fi

# =============================================================================
# STEP 5: Redis Configuration Test
# =============================================================================
print_status "🔴 Step 5: Testing Redis configuration..."

if [ -n "$REDIS_PASSWORD" ]; then
    print_success "✅ Redis password configured: $REDIS_PASSWORD"
    
    # Test Redis connection
    print_status "Testing Redis connection..."
    if redis-cli -a "$REDIS_PASSWORD" ping 2>/dev/null; then
        print_success "✅ Redis connection successful"
    else
        print_warning "⚠️  Redis connection failed - may need to start Redis service"
    fi
    
    # Test Redis from Python
    print_status "Testing Redis connection from Python..."
    python -c "
import redis
import os
r = redis.Redis(host='localhost', port=6379, password='$REDIS_PASSWORD', decode_responses=True)
try:
    result = r.ping()
    print('✅ Python Redis connection successful')
except Exception as e:
    print(f'⚠️  Python Redis connection failed: {e}')
" 2>/dev/null || print_warning "⚠️  Python Redis test failed"
else
    print_warning "⚠️  No Redis password configured in .env"
fi

# =============================================================================
# STEP 6: Final Validation
# =============================================================================
print_status "🧪 Step 6: Final validation..."

# Check walker availability
print_status "Checking available walkers..."
python manage.py shell -c "
from jac_layer.jac_manager import jac_manager
walkers = jac_manager.get_available_walkers()
loaded_count = sum(1 for info in walkers.values() if info['loaded'])
total_count = len(walkers)
print(f'📊 Loaded {loaded_count}/{total_count} walkers successfully')
for name, info in walkers.items():
    status = '✅ Loaded' if info['loaded'] else '❌ Not loaded'
    print(f'  {name}: {status}')
" 2>/dev/null

# =============================================================================
# STEP 7: Start Services
# =============================================================================
print_status "🚀 Step 7: Starting services..."

# Ask user what they want to start
echo ""
echo "Setup complete! What would you like to start?"
echo "1) Celery worker only"
echo "2) Django development server only"
echo "3) Both Celery and Django"
echo "4) Just test everything (no services)"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        print_status "Starting Celery worker..."
        ./start_celery.sh
        ;;
    2)
        print_status "Starting Django development server..."
        python manage.py runserver 0.0.0.0:8000
        ;;
    3)
        print_status "Starting both services..."
        print_status "Starting Django server in background..."
        python manage.py runserver 0.0.0.0:8000 &
        DJANGO_PID=$!
        sleep 3
        print_status "Starting Celery worker..."
        ./start_celery.sh
        kill $DJANGO_PID 2>/dev/null
        ;;
    4)
        print_status "Validation complete - no services started"
        ;;
    *)
        print_warning "Invalid choice. No services started."
        ;;
esac

print_success "🎉 Setup script completed!"
echo ""
echo "Next steps:"
echo "- Check that all services started without errors"
echo "- Visit http://localhost:3000 for frontend"
echo "- Visit http://localhost:8000/api/ for backend API"
echo "- Monitor Celery worker logs for any JaC compilation warnings"