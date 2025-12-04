#!/bin/bash
# Check JaC walker compilation issues

echo "🔍 Analyzing JaC Walker Compilation Issues..."

# Navigate to backend directory
cd backend/

echo "📝 Testing individual JaC walker compilation..."

# Test each walker file
for walker in orchestrator quiz_master content_curator evaluator progress_tracker motivator; do
    echo ""
    echo "--- Testing $walker.jac ---"
    if [ -f "jac_layer/walkers/${walker}.jac" ]; then
        jac c jac_layer/walkers/${walker}.jac 2>&1 || echo "❌ Compilation failed for $walker.jac"
    else
        echo "❌ File not found: jac_layer/walkers/${walker}.jac"
    fi
done

echo ""
echo "📊 JaC Compilation Status Summary:"
echo "If all show 'Compilation failed', the JaC syntax needs to be corrected."
echo "The system will use fallback execution until syntax is fixed."