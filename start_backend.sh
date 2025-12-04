#!/bin/bash

# Start Backend Server Script
# Starts Django development server

echo "🚀 Starting JESECI Interactive Learning Platform - Backend Server"

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

# Display service information
print_info "====================================="
print_info "Backend Server Information:"
print_info "====================================="
print_info "Backend API: http://localhost:8000"
print_info "API Docs: http://localhost:8000/api/schema/"
print_info "Admin Panel: http://localhost:8000/admin/"
print_info "Health Check: http://localhost:8000/api/health/"
print_info "====================================="

# Start Django development server
print_success "Starting Django development server..."
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python manage.py runserver 0.0.0.0:8000