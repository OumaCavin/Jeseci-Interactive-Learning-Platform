#!/bin/bash
# Complete Python Dependencies Installation

echo "🔧 Installing Python dependencies for Jeseci Interactive Learning Platform..."

# Check if virtual environment is active
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "⚠️  Virtual environment not active. Activating..."
    if [ -d "venv" ]; then
        source venv/bin/activate
        echo "✅ Virtual environment activated"
    else
        echo "❌ Virtual environment not found. Please create it first:"
        echo "   python3 -m venv venv"
        echo "   source venv/bin/activate"
        exit 1
    fi
fi

# Navigate to backend directory
cd backend/

# Upgrade pip first
echo "📦 Upgrading pip..."
pip install --upgrade pip

# Install core dependencies
echo "🚀 Installing core dependencies..."
pip install Django==5.2.8
pip install djangorestframework
pip install django-cors-headers

# Install database and caching
echo "🗄️  Installing database and caching dependencies..."
pip install psycopg2-binary==2.9.11
pip install redis==7.1.0
pip install django-redis==6.0.0

# Install Celery
echo "⚡ Installing Celery..."
pip install celery[redis]

# Install environment and configuration
echo "⚙️  Installing configuration dependencies..."
pip install python-decouple==3.8
pip install dj-database-url

# Install media and file handling
echo "📁 Installing file handling dependencies..."
pip install Pillow==12.0.0
pip install django-storages

# Install development and testing
echo "🧪 Installing development dependencies..."
pip install django-debug-toolbar
pip install django-extensions
pip install pytest==9.0.1
pip install pytest-django==4.11.1
pip install pytest-cov==7.0.0

# Install documentation
echo "📚 Installing documentation dependencies..."
pip install sphinx
pip install sphinx-rtd-theme==3.0.2

# Install security
echo "🔒 Installing security dependencies..."
pip install django-security

# Install system monitoring
echo "📊 Installing monitoring dependencies..."
pip install psutil==6.1.1

# Install API documentation
echo "📖 Installing API documentation..."
pip install drf-spectacular==0.29.0

# Install JWT authentication
echo "🔑 Installing JWT authentication..."
pip install djangorestframework-simplejwt==5.3.0

# Install JaC lang
echo "🎯 Installing JaC language..."
pip install jaclang[all]==0.9.3

echo ""
echo "✅ All Python dependencies installed successfully!"

# Verify installation
echo ""
echo "📋 Verifying key packages:"
pip list | grep -E "(Django|djangorestframework|celery|redis|jaclang)"
echo ""
echo "🎉 Python setup complete!"