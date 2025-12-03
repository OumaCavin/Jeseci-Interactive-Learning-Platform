#!/usr/bin/env python3
"""
Test script to verify Celery configuration with Redis
"""
import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, '/workspace/backend')

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jeseci_platform.settings')

# Test Redis connection
try:
    import redis
    r = redis.Redis(host='127.0.0.1', port=6379, decode_responses=True)
    result = r.ping()
    print(f"✅ Redis connection successful: {result}")
except Exception as e:
    print(f"❌ Redis connection failed: {e}")
    sys.exit(1)

# Test Celery configuration
try:
    from jeseci_platform.celery import app as celery_app
    print("✅ Celery app imported successfully")
    print(f"✅ Broker URL: {celery_app.conf.broker_url}")
    print(f"✅ Result backend: {celery_app.conf.result_backend}")
    
    # Test task discovery
    celery_app.autodiscover_tasks()
    print("✅ Tasks discovered successfully")
    
    # List available tasks
    print(f"✅ Available tasks: {list(celery_app.tasks.keys())}")
    
except Exception as e:
    print(f"❌ Celery configuration failed: {e}")
    sys.exit(1)

print("\n🎉 Celery configuration with Redis is working correctly!")