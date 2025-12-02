#!/bin/bash
# Upgrade Jeseci Interactive Learning Platform to Latest Versions
# Execute this script in your local environment

echo "🚀 Upgrading Jeseci Platform to Latest Versions..."

# 1. Upgrade Django from 4.2.26 to 5.2.8
echo "📦 Upgrading Django to 5.2.8..."
cd backend
pip install Django==5.2.8
pip install djangorestframework djangorestframework==3.16.1 drf-spectacular==0.29.0

# Test Django upgrade
python manage.py check

# 2. Upgrade Node.js from 18.19.1 to 25.2.1
echo "🚀 Upgrading Node.js to 25.2.1..."

# Method 1: Using Node Version Manager (nvm) - RECOMMENDED
if command -v nvm &> /dev/null; then
    echo "Using nvm to upgrade Node.js..."
    nvm install 25.2.1
    nvm use 25.2.1
    nvm alias default 25.2.1
else
    echo "nvm not found. Installing nvm first..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    source ~/.bashrc
    nvm install 25.2.1
    nvm use 25.2.1
    nvm alias default 25.2.1
fi

# Method 2: Direct installation (alternative)
# Download and install Node.js 25.2.1 directly from nodejs.org
# curl -fsSL https://nodejs.org/dist/v25.2.1/node-v25.2.1-linux-x64.tar.xz | tar -xJ
# sudo cp -r node-v25.2.1-linux-x64/{bin,lib,share,include} /usr/local/

# Verify upgrades
echo "✅ Verifying upgrades..."
node --version
npm --version
python -c "import django; print(f'Django version: {django.get_version()}')"

echo "🎉 Upgrade complete!"
echo "📍 Django 5.2.8 ✅"
echo "📍 Node.js 25.2.1 ✅"