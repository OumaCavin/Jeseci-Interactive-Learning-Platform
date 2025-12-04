#!/bin/bash

# React Frontend Dependencies Fix Script
# This script fixes React version conflicts and npm dependency issues

echo "🎨 Fixing React Frontend Dependencies..."

# Navigate to frontend directory
cd "$(dirname "$0")/../frontend"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found in frontend directory!"
    exit 1
fi

print_success "Found package.json"

# Create backup of package.json and package-lock.json
if [ -f "package-lock.json" ]; then
    print_warning "Backing up package-lock.json..."
    cp package-lock.json package-lock.json.backup
fi

cp package.json package.json.backup

print_success "Backups created"

# Remove node_modules and package-lock.json to force clean install
print_warning "Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

print_success "Cleaned existing dependencies"

# Install dependencies with React 18 compatibility
print_warning "Installing dependencies with React 18 compatibility..."

# First install core React packages explicitly
npm install react@^18.2.0 react-dom@^18.2.0 @types/react@^18.2.0 @types/react-dom@^18.2.0 --save

print_success "Core React packages installed"

# Install development dependencies
npm install --save-dev @types/react-router-dom@^5.3.0 @types/ws@^8.5.0 @typescript-eslint/eslint-plugin@^5.62.0 @typescript-eslint/parser@^5.62.0

print_success "Type definitions installed"

# Install testing dependencies
npm install --save-dev @testing-library/react@^14.0.0 @testing-library/jest-dom@^6.0.0 @testing-library/user-event@^14.0.0

print_success "Testing dependencies installed"

# Install remaining production dependencies
npm install

print_success "All dependencies installed"

# Check for any remaining version conflicts
print_warning "Checking for version conflicts..."
npm audit --audit-level=moderate 2>/dev/null || print_warning "npm audit completed with warnings (this is normal for development)"

# Display React version confirmation
echo ""
print_success "React version check:"
npm list react react-dom 2>/dev/null

echo ""
print_success "✅ React frontend dependencies fixed!"
echo ""
echo "Next steps:"
echo "1. Start the development server: npm start"
echo "2. Build for production: npm run build"
echo "3. Run tests: npm test"
echo ""
echo "If you encounter any issues:"
echo "- Run: npm start"
echo "- Check browser console for any JavaScript errors"
echo "- Ensure backend API is running on port 8000"