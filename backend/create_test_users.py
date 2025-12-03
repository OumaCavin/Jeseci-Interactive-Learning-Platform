#!/usr/bin/env python
"""
Create test users for the Jeseci Interactive Learning Platform
This script creates demo users with different roles for testing authentication.
"""

import os
import sys
import django

# Setup Django environment
sys.path.append('/workspace/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jeseci_platform.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserProfile
from django.core.management.base import BaseCommand

def create_test_users():
    """Create test users with different roles and profiles"""
    
    # Define test users
    test_users = [
        {
            'username': 'teacher_admin',
            'email': 'teacher@jeseci.com',
            'password': 'teach123',
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'is_staff': True,
            'is_superuser': True,
            'learning_style': 'visual',
            'preferred_difficulty': 'expert'
        },
        {
            'username': 'student_demo',
            'email': 'student@jeseci.com',
            'password': 'learn123',
            'first_name': 'Alex',
            'last_name': 'Chen',
            'is_staff': False,
            'is_superuser': False,
            'learning_style': 'kinesthetic',
            'preferred_difficulty': 'intermediate'
        },
        {
            'username': 'learner_student',
            'email': 'learner@jeseci.com',
            'password': 'student456',
            'first_name': 'Emma',
            'last_name': 'Williams',
            'is_staff': False,
            'is_superuser': False,
            'learning_style': 'auditory',
            'preferred_difficulty': 'beginner'
        },
        {
            'username': 'demo_user',
            'email': 'demo@jeseci.com',
            'password': 'demo789',
            'first_name': 'Demo',
            'last_name': 'User',
            'is_staff': False,
            'is_superuser': False,
            'learning_style': 'mixed',
            'preferred_difficulty': 'intermediate'
        }
    ]
    
    created_count = 0
    
    for user_data in test_users:
        username = user_data['username']
        
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            print(f"❌ User '{username}' already exists - skipping")
            continue
        
        try:
            # Extract user profile data
            profile_data = {
                'learning_style': user_data.pop('learning_style'),
                'preferred_difficulty': user_data.pop('preferred_difficulty')
            }
            
            # Create user
            user = User.objects.create_user(**user_data)
            print(f"✅ Created user: {username}")
            
            # Create user profile
            user_profile = UserProfile.objects.create(user=user, **profile_data)
            print(f"✅ Created profile for: {username}")
            
            created_count += 1
            
        except Exception as e:
            print(f"❌ Error creating user '{username}': {str(e)}")
    
    print(f"\n📊 Summary: Successfully created {created_count} new test users")
    
    if created_count > 0:
        print("\n🔐 Test User Credentials:")
        print("=" * 50)
        for user_data in test_users:
            if User.objects.filter(username=user_data['username']).exists():
                print(f"Username: {user_data['username']}")
                print(f"Password: {user_data['password']}")
                print(f"Email: {user_data['email']}")
                print("-" * 30)

def print_login_instructions():
    """Print instructions for testing login"""
    print("\n🚀 Login Testing Instructions:")
    print("=" * 50)
    print("1. Start the development server:")
    print("   cd /workspace/backend && python manage.py runserver")
    print("\n2. Frontend login page is at:")
    print("   http://localhost:3000")
    print("\n3. Backend API endpoints:")
    print("   POST http://localhost:8000/api/auth/login/")
    print("   POST http://localhost:8000/api/auth/register/")
    print("   POST http://localhost:8000/api/auth/logout/")
    print("\n4. Use any of the test user credentials above")
    print("\n5. JWT tokens will be returned in the response:")
    print("   - access_token: For authenticated API calls")
    print("   - refresh_token: For token refresh")

if __name__ == '__main__':
    print("🎓 Jeseci Interactive Learning Platform")
    print("🔐 Test User Creation Script")
    print("=" * 50)
    
    # Create test users
    create_test_users()
    
    # Print instructions
    print_login_instructions()
    
    print("\n✅ Test user setup complete!")