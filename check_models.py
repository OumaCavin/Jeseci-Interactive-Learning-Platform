#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the path
sys.path.append('/workspace/backend')

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jeseci_platform.settings')
django.setup()

from django.apps import apps
from django.db import connection

print('=== DATABASE MODELS VERIFICATION ===\n')

# Get all models from the api app
api_models = [cls for name, cls in apps.get_app_config('api').models.items()]
print(f'Total models in api app: {len(api_models)}')

# List all models with their field information
for model in sorted(api_models, key=lambda x: x.__name__):
    print(f'\n📊 Model: {model.__name__}')
    print(f'   Table: {model._meta.db_table}')
    
    # Get field information
    fields = model._meta.fields
    print(f'   Fields ({len(fields)}):')
    for field in fields:
        field_type = field.get_internal_type()
        nullable = 'NULL' if field.null else 'NOT NULL'
        print(f'     - {field.name}: {field_type} ({nullable})')
    
    # Check relationships
    relations = model._meta.get_fields()
    relation_fields = [f for f in relations if f.is_relation and f.name not in [field.name for field in fields]]
    if relation_fields:
        print(f'   Relations:')
        for relation in relation_fields:
            print(f'     - {relation.name}: {relation.__class__.__name__}')

print('\n=== DATABASE CONNECTION ===')
print(f'Database engine: {connection.vendor}')
print(f'Database name: {connection.settings_dict["NAME"]}')
print(f'Host: {connection.settings_dict.get("HOST", "localhost")}')

# Test table existence
print('\n=== TABLE EXISTENCE CHECK ===')
try:
    cursor = connection.cursor()
    for model in api_models:
        table_name = model._meta.db_table
        cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}';")
        exists = cursor.fetchone() is not None
        status = '✅ EXISTS' if exists else '❌ MISSING'
        print(f'{table_name}: {status}')
except Exception as e:
    print(f'Error checking tables: {e}')

# Check data in tables
print('\n=== SAMPLE DATA COUNT ===')
try:
    cursor = connection.cursor()
    for model in api_models:
        table_name = model._meta.db_table
        cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
        count = cursor.fetchone()[0]
        print(f'{model.__name__}: {count} records')
except Exception as e:
    print(f'Error counting records: {e}')

print('\n=== AUTHENTICATION MODELS CHECK ===')
try:
    from django.contrib.auth.models import User
    user_count = User.objects.count()
    print(f'User model: {user_count} records')
    
    # Check UserProfile model
    from api.models import UserProfile
    profile_count = UserProfile.objects.count()
    print(f'UserProfile model: {profile_count} records')
    
except Exception as e:
    print(f'Error checking auth models: {e}')