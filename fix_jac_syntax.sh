#!/bin/bash
# Fix JaC Walker Syntax Errors

echo "🔧 Fixing JaC Walker Syntax..."

# Navigate to backend directory
cd backend/

# Function to fix JaC walker syntax in a file
fix_jac_syntax() {
    local file="$1"
    echo "📝 Fixing $file..."
    
    # Replace the incorrect syntax with correct syntax
    sed -i 's/with `root entry {/`root entry` {/g' "$file"
    sed -i 's/with `root entry/`root entry`/g' "$file"
    
    echo "✅ Fixed $file"
}

# Fix all JaC walker files
for walker in orchestrator quiz_master content_curator evaluator progress_tracker motivator; do
    if [ -f "jac_layer/walkers/${walker}.jac" ]; then
        fix_jac_syntax "jac_layer/walkers/${walker}.jac"
    else
        echo "❌ File not found: jac_layer/walkers/${walker}.jac"
    fi
done

echo ""
echo "🧪 Testing JaC compilation after fix..."

# Test compilation of all walkers
for walker in orchestrator quiz_master content_curator evaluator progress_tracker motivator; do
    echo ""
    echo "--- Testing $walker.jac ---"
    jac c jac_layer/walkers/${walker}.jac 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ $walker.jac compiled successfully!"
    else
        echo "❌ $walker.jac still has errors"
    fi
done

echo ""
echo "🎉 JaC syntax fix complete!"