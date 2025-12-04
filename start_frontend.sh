#!/bin/bash

# Start Frontend React Application Script

echo "🎨 Starting JESECI Interactive Learning Platform - React Frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
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

# Change to frontend directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/frontend"

print_info "Current directory: $(pwd)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found! Run setup.sh first."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "✅ Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_success "✅ Dependencies already installed"
fi

# Check Node.js version
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node -v)
    print_info "Node.js version: $NODE_VERSION"
else
    print_error "Node.js not found! Please install Node.js first."
    exit 1
fi

# Check npm version
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm -v)
    print_info "npm version: $NPM_VERSION"
else
    print_error "npm not found! Please install npm first."
    exit 1
fi

# Display service information
print_info "====================================="
print_info "Frontend Application Information:"
print_info "====================================="
print_info "Frontend URL: http://localhost:3000"
print_info "API Endpoint: http://localhost:8000/api/"
print_info "Built with: React 18.2.0 + TypeScript"
print_info "UI Framework: Tailwind CSS"
print_info "====================================="

print_info "Available routes after startup:"
print_info "  • / - Home/Dashboard"
print_info "  • /login - User Login"
print_info "  • /register - User Registration"
print_info "  • /dashboard - Main Dashboard"
print_info "  • /learning - Interactive Learning"
print_info "  • /progress - Progress Tracking"

# Start React development server
print_success "Starting React development server..."
echo ""
echo "The application will open automatically in your browser"
echo "Press Ctrl+C to stop the server"
echo ""

npm start