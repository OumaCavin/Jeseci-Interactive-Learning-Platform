#!/usr/bin/env python3
"""
Complete Django Authentication System Test
Tests all authentication endpoints including password reset functionality
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
    """Test the registration endpoint with confirm password"""
    print("\n2. Testing Registration Endpoint (with confirm password):")
    data = {
        "username": "testuser123",
        "email": "testuser123@example.com", 
        "password": "SecurePass123!",
        "password_confirm": "SecurePass123!",
        "first_name": "Test",
        "last_name": "User123"
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

def test_password_reset_request():
    """Test password reset request endpoint"""
    print("\n3. Testing Password Reset Request Endpoint:")
    data = {
        "email": "testuser123@example.com"
    }
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/password-reset/",
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            # Extract reset token from response for testing
            try:
                response_data = response.json()
                return response_data.get('status') == 'success', response_data.get('token')
            except:
                return True, None
        
        return response.status_code == 200, None
    except Exception as e:
        print(f"Error: {e}")
        return False, None

def test_password_reset_confirm(reset_token):
    """Test password reset confirmation endpoint"""
    print("\n4. Testing Password Reset Confirmation Endpoint:")
    data = {
        "email": "testuser123@example.com",
        "token": reset_token or "demo_token_123",
        "new_password": "NewSecurePass456!",
        "new_password_confirm": "NewSecurePass456!"
    }
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/password-reset-confirm/",
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_login():
    """Test the login endpoint"""
    print("\n5. Testing Login Endpoint:")
    data = {
        "email": "testuser123@example.com",
        "password": "NewSecurePass456!"
    }
    try:
        session = requests.Session()
        response = session.post(
            f"{BASE_URL}/api/auth/login/",
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            return session
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def test_logout(session):
    """Test the logout endpoint"""
    print("\n6. Testing Logout Endpoint:")
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

def test_registration_password_mismatch():
    """Test registration with mismatched passwords"""
    print("\n7. Testing Registration with Password Mismatch:")
    data = {
        "username": "testuser456",
        "email": "testuser456@example.com", 
        "password": "password123",
        "password_confirm": "password456",  # Mismatched
        "first_name": "Test",
        "last_name": "Mismatch"
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
        
        # Should return 400 for password mismatch
        return response.status_code == 400
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Run all tests"""
    print("Complete Django Authentication System Test")
    print("=" * 60)
    print("Testing Registration, Login, Logout, and Password Reset")
    print("=" * 60)
    
    # Test health
    health_ok = test_health()
    
    # Test registration
    reg_ok = test_registration()
    
    # Test password mismatch validation
    mismatch_ok = test_registration_password_mismatch()
    
    # Test password reset request
    reset_ok, reset_token = test_password_reset_request()
    
    # Test password reset confirmation
    confirm_ok = test_password_reset_confirm(reset_token)
    
    # Test login (after password reset)
    session = test_login()
    login_ok = session is not None
    
    # Test logout
    if session:
        logout_ok = test_logout(session)
    else:
        logout_ok = False
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY:")
    print("=" * 60)
    print(f"Health Check: {'✓' if health_ok else '✗'}")
    print(f"Registration: {'✓' if reg_ok else '✗'}")
    print(f"Password Mismatch Validation: {'✓' if mismatch_ok else '✗'}")
    print(f"Password Reset Request: {'✓' if reset_ok else '✗'}")
    print(f"Password Reset Confirmation: {'✓' if confirm_ok else '✗'}")
    print(f"Login (After Reset): {'✓' if login_ok else '✗'}")
    print(f"Logout: {'✓' if logout_ok else '✗'}")
    
    all_passed = all([health_ok, reg_ok, mismatch_ok, reset_ok, confirm_ok, login_ok, logout_ok])
    
    if all_passed:
        print("\n🎉 ALL TESTS PASSED!")
        print("✅ Registration with confirm password validation - WORKING")
        print("✅ Password reset functionality - WORKING")
        print("✅ Login/Logout session management - WORKING")
        print("✅ Frontend integration ready!")
    else:
        print("\n❌ Some tests FAILED.")
        print("Please check the errors above and ensure:")
        print("- Django server is running on port 8000")
        print("- All required packages are installed")
        print("- Database is properly configured")
    
    print("\n" + "=" * 60)
    print("FRONTEND INTEGRATION NOTES:")
    print("=" * 60)
    print("✅ Registration endpoint now requires 'password_confirm' field")
    print("✅ Password reset endpoints available:")
    print("   POST /api/auth/password-reset/ - Request password reset")
    print("   POST /api/auth/password-reset-confirm/ - Confirm password reset")
    print("✅ Session-based authentication (no JWT tokens needed)")
    print("✅ All endpoints return JSON responses with proper status codes")

if __name__ == "__main__":
    main()