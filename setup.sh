#!/bin/bash

# Jeseci Interactive Learning Platform Setup Script
# Author: Cavin Otieno
# Description: Automated setup script for the complete platform

set -e  # Exit on any error

echo "🚀 Jeseci Interactive Learning Platform Setup"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if we're in WSL (recommended for development)
if ! grep -qi microsoft /proc/version 2>/dev/null; then
    print_warning "This setup is optimized for WSL. Continue anyway? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check prerequisites
print_status "Checking prerequisites..."

command -v python3 >/dev/null 2>&1 || { print_error "Python 3 is required but not installed."; exit 1; }
command -v node >/dev/null 2>&1 || { print_error "Node.js is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed."; exit 1; }

print_success "Prerequisites check passed"

# Install system dependencies if not present
print_status "Installing system dependencies..."

# Check and install Python 3.12 if needed
if ! command -v python3.12 >/dev/null 2>&1; then
    print_warning "Python 3.12 not found. Installing..."
    sudo apt-get update
    sudo apt-get install -y python3.12 python3.12-venv python3.12-dev python3-pip
    sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12 1
fi

# Check and install other system dependencies
if ! command -v redis-server >/dev/null 2>&1; then
    print_warning "Redis not found. Installing..."
    sudo apt-get install -y redis-server
    sudo systemctl enable redis-server
    sudo systemctl start redis-server
fi

if ! command -v postgresql >/dev/null 2>&1; then
    print_warning "PostgreSQL not found. Installing..."
    sudo apt-get install -y postgresql postgresql-contrib
    sudo systemctl enable postgresql
    sudo systemctl start postgresql
fi

if ! command -v gcc >/dev/null 2>&1; then
    print_warning "Build tools not found. Installing..."
    sudo apt-get install -y build-essential
fi

if ! command -v npm >/dev/null 2>&1; then
    print_warning "npm not found. Installing..."
    sudo apt-get install -y npm
fi

print_success "System dependencies installation completed"

# Python version check
python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
print_status "Python version: $python_version"

if [[ $(echo "$python_version >= 3.12" | bc -l) -eq 0 ]]; then
    print_error "Python 3.12 or higher is required. Current version: $python_version"
    exit 1
fi

# Node.js version check
node_version=$(node -v | sed 's/v//')
print_status "Node.js version: $node_version"

# Setup backend
print_status "Setting up backend (Django + JacLang)..."

cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install -r requirements.txt

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs static media

# Setup Django
print_status "Setting up Django..."

# Generate migrations
python manage.py makemigrations api
python manage.py makemigrations jac_layer

# Run migrations
python manage.py migrate

# Create superuser (optional)
print_status "Creating Django superuser (optional)..."
python manage.py shell << EOF
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("Superuser created: admin / admin123")
else:
    print("Superuser already exists")
EOF

print_success "Backend setup completed!"

# Setup frontend
print_status "Setting up frontend (React)..."

cd ../frontend

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install

# Create environment file
print_status "Creating environment configuration..."
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000
REACT_APP_APP_NAME=Jeseci Learning Platform
REACT_APP_VERSION=1.0.0
EOF

print_success "Frontend setup completed!"

# Setup Redis (if not running)
print_status "Checking Redis service..."

if ! pgrep -x redis-server > /dev/null; then
    print_status "Starting Redis service..."
    
    # Try to start Redis
    if command -v redis-server >/dev/null 2>&1; then
        redis-server --daemonize yes
        print_success "Redis server started"
    else
        print_warning "Redis not found. Please install Redis manually:"
        print_warning "  Ubuntu/Debian: sudo apt-get install redis-server"
        print_warning "  macOS: brew install redis"
        print_warning "  Windows: Download from https://redis.io/download"
    fi
else
    print_success "Redis is already running"
fi

# Final setup
print_status "Final setup..."

cd ..

# Create startup scripts
print_status "Creating startup scripts..."

# Backend startup script
cat > start_backend.sh << 'EOF'
#!/bin/bash
cd backend
source venv/bin/activate
echo "Starting Django backend on http://localhost:8000"
python manage.py runserver 0.0.0.0:8000
EOF

# Frontend startup script
cat > start_frontend.sh << 'EOF'
#!/bin/bash
cd frontend
echo "Starting React frontend on http://localhost:3000"
npm start
EOF

# Celery startup script
cat > start_celery.sh << 'EOF'
#!/bin/bash
cd backend
source venv/bin/activate
echo "Starting Celery worker"
celery -A jac_platform worker -l info
EOF

# Make scripts executable
chmod +x start_backend.sh start_frontend.sh start_celery.sh

print_success "Startup scripts created!"

# Create development guide
cat > DEVELOPMENT.md << 'EOF'
# Development Guide

## Quick Start

1. **Start Backend:**
   ```bash
   ./start_backend.sh
   ```

2. **Start Celery Worker (in new terminal):**
   ```bash
   ./start_celery.sh
   ```

3. **Start Frontend (in new terminal):**
   ```bash
   ./start_frontend.sh
   ```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/
- **API Docs**: http://localhost:8000/api/schema/

## Development Commands

### Backend
```bash
cd backend
source venv/bin/activate

# Run tests
python manage.py test

# Create migrations
python manage.py makemigrations

# Django shell
python manage.py shell

# Check Jac walkers
python manage.py shell
>>> from jac_layer.jac_manager import jac_manager
>>> jac_manager.get_available_walkers()
```

### Frontend
```bash
cd frontend

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

## Troubleshooting

### Backend Issues
- Check logs in `backend/logs/`
- Verify database: `python manage.py dbshell`
- Test Jac integration: Check Django shell commands above

### Frontend Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Check environment variables in `.env`
- Verify API connectivity in browser dev tools

### Redis Issues
- Check if Redis is running: `redis-cli ping`
- Restart Redis: `redis-server --daemonize yes`

## Jac Development

Jac walker files are in `backend/jac_layer/walkers/`:
- orchestrator.jac - System coordination
- content_curator.jac - Content management
- quiz_master.jac - Adaptive quizzes
- evaluator.jac - Evaluation (Cavin Otieno methodology)
- progress_tracker.jac - Progress monitoring
- motivator.jac - Motivation and gamification

Reload walkers after changes:
```python
python manage.py shell
>>> from jac_layer.jac_manager import jac_manager
>>> jac_manager.reload_walkers()
```
EOF

print_success "Development guide created!"

# Create git ignore
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# Virtual Environment
venv/
ENV/
env/

# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
media/

# Static files
staticfiles/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnp/
.pnp.js

# React build
build/
*.tgz

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Redis
dump.rdb

# Coverage
htmlcov/
.coverage
.coverage.*
coverage.xml
*.cover
.hypothesis/

# Backup files
*.bak
*.backup
EOF

print_success "Git ignore created!"

# Final status
echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🎉 Your Jeseci Interactive Learning Platform is ready!"
echo ""
echo "📋 Next steps:"
echo "   1. Activate backend environment: cd backend && source venv/bin/activate"
echo "   2. Start backend: ./start_backend.sh"
echo "   3. Start Celery worker: ./start_celery.sh"
echo "   4. Start frontend: ./start_frontend.sh"
echo ""
echo "🌐 Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000/api/"
echo "   - Admin Panel: http://localhost:8000/admin/ (admin/admin123)"
echo ""
echo "📚 Development guide: DEVELOPMENT.md"
echo ""
print_success "Happy coding with Cavin Otieno's Multi-Agent Learning System! 🚀"