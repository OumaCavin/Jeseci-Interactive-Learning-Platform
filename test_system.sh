#!/bin/bash
# Quick Test Script to Verify All Components

echo "🧪 Testing System Components..."

# Test 1: Environment Variables
echo ""
echo "1️⃣ Testing Environment Variables..."
cd backend/
if [ -f ".env" ]; then
    source .env 2>/dev/null
    if [ "$DEBUG" = "True" ]; then
        echo "✅ Environment variables loaded correctly"
        echo "   DEBUG: $DEBUG"
        echo "   REDIS_PASSWORD: $REDIS_PASSWORD"
        echo "   EMAIL_HOST_USER: $EMAIL_HOST_USER"
    else
        echo "❌ Environment variables not loaded properly"
    fi
else
    echo "❌ .env file not found"
fi

# Test 2: Python Dependencies
echo ""
echo "2️⃣ Testing Python Dependencies..."
if [[ "$VIRTUAL_ENV" != "" ]]; then
    echo "✅ Virtual environment active: $VIRTUAL_ENV"
else
    echo "⚠️  Virtual environment not active"
fi

python -c "
try:
    import django
    print('✅ Django available')
except ImportError:
    print('❌ Django missing')

try:
    import redis
    print('✅ Redis available')
except ImportError:
    print('❌ Redis missing')

try:
    import celery
    print('✅ Celery available')
except ImportError:
    print('❌ Celery missing')

try:
    import jaclang
    print('✅ Jaclang available')
except ImportError:
    print('❌ Jaclang missing')
"

# Test 3: JaC Walker Files
echo ""
echo "3️⃣ Testing JaC Walker Files..."
for walker in orchestrator quiz_master content_curator evaluator progress_tracker motivator; do
    if [ -f "jac_layer/walkers/${walker}.jac" ]; then
        # Check if syntax is corrected
        if grep -q '`root entry`' "jac_layer/walkers/${walker}.jac"; then
            echo "✅ ${walker}.jac syntax corrected"
        else
            echo "⚠️  ${walker}.jac may still have syntax issues"
        fi
    else
        echo "❌ ${walker}.jac not found"
    fi
done

cd ..

# Test 4: Frontend
echo ""
echo "4️⃣ Testing Frontend..."
cd frontend/
if [ -d "node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "⚠️  Frontend dependencies may need installation"
fi

if [ -f "tsconfig.json" ]; then
    echo "✅ TypeScript configuration exists"
else
    echo "⚠️  TypeScript configuration missing"
fi

cd ..

# Test 5: Startup Scripts
echo ""
echo "5️⃣ Testing Startup Scripts..."
for script in start_backend.sh start_celery.sh start_frontend.sh; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            echo "✅ $script is executable"
        else
            echo "⚠️  $script exists but not executable"
        fi
    else
        echo "❌ $script not found"
    fi
done

echo ""
echo "🎯 System Test Complete!"
echo ""
echo "💡 If any tests show issues, run:"
echo "   bash complete_system_fix.sh"
echo ""
echo "🔧 Then start the services:"
echo "   ./start_backend.sh"
echo "   ./start_celery.sh" 
echo "   ./start_frontend.sh"