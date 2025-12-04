#!/bin/bash
# Quick fix for missing dependencies

echo "🔧 Installing missing Python dependencies..."

# Navigate to backend directory
cd backend/

# Activate virtual environment if not already activated
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "⚠️  Virtual environment not active. Please activate it first:"
    echo "   source venv/bin/activate"
    exit 1
fi

# Install all required dependencies
pip install -r requirements.txt

echo "✅ Python dependencies installed!"
echo "📋 Installed packages:"
pip list | grep -E "(Django|djangorestframework|celery|redis|jaclang)"