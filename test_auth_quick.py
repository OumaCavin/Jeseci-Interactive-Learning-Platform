#!/usr/bin/env python3
"""Quick test of Django authentication endpoints"""
import requests
import json

BASE_URL = 'http://localhost:8000'
session = requests.Session()

def test_endpoint(name, method, url, data=None):
    """Test a single endpoint"""
    print(f"\n=== Testing {name} ===")
    try:
        if method == 'GET':
            response = requests.get(url, timeout=10)
        elif method == 'POST':
            response = session.post(url, json=data, headers={'Content-Type': 'application/json'}, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code in [200, 201]:
            print(f"✅ {name}: PASSED")
            return True
        else:
            print(f"❌ {name}: FAILED")
            return False
    except Exception as e:
        print(f"❌ {name}: ERROR - {e}")
        return False

def main():
    print("Django Authentication System Test")
    print("=" * 40)
    
    # 1. Health Check
    health_ok = test_endpoint(
        "Health Check", "GET", f"{BASE_URL}/api/health/"
    )
    
    # 2. Registration with Confirm Password
    reg_data = {
        "username": "frontendtest",
        "email": "frontendtest@example.com",
        "password": "TestPass123!",
        "password_confirm": "TestPass123!",
        "first_name": "Frontend",
        "last_name": "Tester"
    }
    reg_ok = test_endpoint(
        "Registration (with confirm password)", "POST", 
        f"{BASE_URL}/api/auth/register/", reg_data
    )
    
    # 3. Password Reset Request
    reset_data = {"email": "frontendtest@example.com"}
    reset_ok = test_endpoint(
        "Password Reset Request", "POST",
        f"{BASE_URL}/api/auth/password-reset/", reset_data
    )
    
    # 4. Login
    login_data = {
        "email": "frontendtest@example.com",
        "password": "TestPass123!"
    }
    login_ok = test_endpoint(
        "Login", "POST",
        f"{BASE_URL}/api/auth/login/", login_data
    )
    
    # 5. Password Reset Confirm
    confirm_data = {
        "email": "frontendtest@example.com",
        "token": "demo_reset_token_123",
        "new_password": "NewPass456!",
        "new_password_confirm": "NewPass456!"
    }
    confirm_ok = test_endpoint(
        "Password Reset Confirmation", "POST",
        f"{BASE_URL}/api/auth/password-reset-confirm/", confirm_data
    )
    
    # 6. Logout
    logout_ok = test_endpoint(
        "Logout", "POST",
        f"{BASE_URL}/api/auth/logout/"
    )
    
    print("\n" + "=" * 40)
    print("FINAL RESULTS:")
    print("=" * 40)
    print(f"Health Check: {'✅' if health_ok else '❌'}")
    print(f"Registration (with confirm password): {'✅' if reg_ok else '❌'}")
    print(f"Password Reset Request: {'✅' if reset_ok else '❌'}")
    print(f"Login: {'✅' if login_ok else '❌'}")
    print(f"Password Reset Confirmation: {'✅' if confirm_ok else '❌'}")
    print(f"Logout: {'✅' if logout_ok else '❌'}")
    
    total_passed = sum([health_ok, reg_ok, reset_ok, login_ok, confirm_ok, logout_ok])
    print(f"\nTests Passed: {total_passed}/6")
    
    if total_passed == 6:
        print("\n🎉 ALL TESTS PASSED!")
        print("✅ Your authentication system is fully working!")
        print("✅ Frontend integration ready!")
    else:
        print(f"\n⚠️  {6-total_passed} test(s) failed")

if __name__ == "__main__":
    main()