#!/bin/bash
# Quick fix for environment variable loading

echo "🔧 Fixing environment variable loading..."

# Navigate to backend directory where .env is located
cd backend/

# Load environment variables properly
if [ -f .env ]; then
    echo "📄 Loading .env file..."
    # Source the .env file instead of using export $(grep...)
    set -a
    source .env
    set +a
    echo "✅ Environment variables loaded"
else
    echo "❌ .env file not found in backend/ directory"
fi

# Test if Django is available
echo "🧪 Testing Django import..."
python -c "import django; print(f'Django version: {django.get_version()}')"

echo "✅ Environment fix complete!"