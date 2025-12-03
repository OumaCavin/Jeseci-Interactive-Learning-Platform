#!/usr/bin/env python3
"""
Test Django Authentication Endpoints
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint"""
    print("1. Testing Health Endpoint:")
    try:
        response = requests.get(f"{BASE_URL}/api/health/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_registration():
    """Test the registration endpoint"""
    print("\n2. Testing Registration Endpoint:")
    data = {
        "username": "testuser",
        "email": "test@example.com", 
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "User"
    }
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register/",
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 201
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_login():
    """Test the login endpoint"""
    print("\n3. Testing Login Endpoint:")
    data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    try:
        # Use a session to maintain cookies
        session = requests.Session()
        response = session.post(
            f"{BASE_URL}/api/auth/login/",
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Save session for logout test
        if response.status_code == 200:
            return session
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def test_logout(session):
    """Test the logout endpoint"""
    print("\n4. Testing Logout Endpoint:")
    try:
        response = session.post(
            f"{BASE_URL}/api/auth/logout/",
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Run all tests"""
    print("Testing Django Authentication Endpoints")
    print("=" * 50)
    
    # Test health
    health_ok = test_health()
    
    # Test registration
    reg_ok = test_registration()
    
    # Test login
    session = test_login()
    login_ok = session is not None
    
    # Test logout
    if session:
        logout_ok = test_logout(session)
    else:
        logout_ok = False
    
    # Summary
    print("\n" + "=" * 50)
    print("TEST SUMMARY:")
    print(f"Health Check: {'✓' if health_ok else '✗'}")
    print(f"Registration: {'✓' if reg_ok else '✗'}")
    print(f"Login: {'✓' if login_ok else '✗'}")
    print(f"Logout: {'✓' if logout_ok else '✗'}")
    
    if all([health_ok, reg_ok, login_ok, logout_ok]):
        print("\n🎉 All tests PASSED! Authentication system is working correctly.")
    else:
        print("\n❌ Some tests FAILED. Please check the errors above.")

if __name__ == "__main__":
    main()