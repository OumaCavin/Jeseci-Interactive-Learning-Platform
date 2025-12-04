#!/bin/bash
# Fix Environment Variable Issues

echo "🔧 Fixing environment variable issues..."

cd backend/

# Create a properly formatted .env file
cat > .env << 'EOF'
# Backend Environment Configuration
SECRET_KEY=django-insecure-jac-learning-platform-secret-key-for-development-only-2024
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Database Configuration
DATABASE_URL=postgresql://jeseci_user:jeseci_password@localhost:5432/jeseci_db
# Alternative: sqlite for development
# DATABASE_URL=sqlite:///db.sqlite3

# Redis Configuration
REDIS_PASSWORD=redis_password
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379/0

# Jac Server Configuration
JAC_SERVER_URL=http://localhost:8001
JAC_GRAPH_PATH=backend/jac_layer/main.jac
JAC_CONFIG_COMPILE_TIMEOUT=30
JAC_CONFIG_EXECUTION_TIMEOUT=60
JAC_CONFIG_MAX_MEMORY_MB=512
JAC_CONFIG_LOG_LEVEL=DEBUG

# LLM API Keys (Required for byLLM features)
OPENAI_API_KEY=AIzaSyB3OhghL8KcNaixdZkM4Wfd07_dAoQvrI0
GEMINI_API_KEY=your-gemini-api-key-here
LLM_PROVIDER=openai

# Celery Configuration
CELERY_BROKER_URL=redis://:redis_password@localhost:6379/1
CELERY_RESULT_BACKEND=redis://:redis_password@localhost:6379/2

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CORS_ALLOW_CREDENTIALS=True

# File Upload Configuration
MAX_UPLOAD_SIZE=10485760

# Logging Configuration
LOG_LEVEL=INFO

# Security Configuration
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=cavin.otieno012@gmail.com
EMAIL_HOST_PASSWORD=oakjazoekos

# Codebase Genius Configuration
GITHUB_TOKEN=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
DOCS_OUTPUT_PATH=docs/generated

# Monitoring & Analytics
SENTRY_DSN=https://759a58b1fc0aee913b2cb184db7fd880@o4510403562307584.ingest.de.sentry.io/4510403573842000
GOOGLE_ANALYTICS_ID=your-ga-id-here

# Jac Language Settings
JAC_LANGUAGE_PATH=/workspace/backend/jac_layer/walkers

# Author Information
AUTHOR_EMAIL=cavin.otieno012@gmail.com
AUTHOR_PHONE=+254708101604
AUTHOR_NAME=Cavin Otieno
EOF

echo "✅ Environment variables fixed and formatted properly"

# Test environment loading
echo "🧪 Testing environment variable loading..."
source .env
echo "✅ Environment variables loaded successfully"
echo "DEBUG: $DEBUG"
echo "REDIS_PASSWORD: $REDIS_PASSWORD"
echo "EMAIL_HOST_USER: $EMAIL_HOST_USER"