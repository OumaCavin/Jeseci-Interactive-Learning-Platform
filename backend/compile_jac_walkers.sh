#!/bin/bash

# JaC Walker Compilation Script
# This script compiles all JaC walker files to resolve bytecode compilation issues

echo "🔧 Compiling JaC Walker Files..."

# Navigate to the backend directory
cd "$(dirname "$0")/../.."

# Activate virtual environment
source venv/bin/activate 2>/dev/null || source .venv/bin/activate 2>/dev/null

# Set Python path
export PYTHONPATH="${PWD}:${PYTHONPATH}"

echo "📁 Current directory: $(pwd)"
echo "🐍 Python path: ${PYTHONPATH}"

# Check if jac command is available
if ! command -v jac &> /dev/null; then
    echo "❌ jac command not found. Installing jaclang..."
    pip install jaclang[all]==0.9.3
fi

echo "🏗️  Compiling JaC walker files..."

# Method 1: Try compiling the walkers directory
if jac build jac_layer/walkers/ 2>/dev/null; then
    echo "✅ Successfully compiled walkers using: jac build jac_layer/walkers/"
else
    echo "⚠️  Primary compilation failed, trying alternative methods..."
    
    # Method 2: Try compiling each walker individually
    echo "🔄 Compiling individual walker files..."
    for walker in jac_layer/walkers/*.jac; do
        if [[ -f "$walker" ]]; then
            echo "📝 Compiling $walker..."
            jac build "$walker" 2>/dev/null && echo "✅ Compiled $walker" || echo "⚠️  Warning: Could not compile $walker"
        fi
    done
    
    # Method 3: Try compiling the main graph file
    echo "🔄 Trying main graph file compilation..."
    if [[ -f "jac_layer/main.jac" ]]; then
        jac build jac_layer/main.jac 2>/dev/null && echo "✅ Compiled main.jac" || echo "⚠️  Warning: Could not compile main.jac"
    fi
fi

echo "🔍 Checking for compiled bytecode files..."
find . -name "*.jac.py" -o -name "__pycache__" -type d | head -10

echo "📋 Running JaC initialization through Django..."
python manage.py init_jac_walkers

echo "🧪 Testing JaC integration..."
python manage.py test_jac_integration

echo "✅ JaC walker compilation and initialization complete!"

# List available walkers
echo "📊 Available walkers:"
python manage.py shell -c "
from jac_layer.jac_manager import jac_manager
walkers = jac_manager.get_available_walkers()
for name, info in walkers.items():
    status = '✅ Loaded' if info['loaded'] else '❌ Not loaded'
    print(f'{name}: {status}')
"