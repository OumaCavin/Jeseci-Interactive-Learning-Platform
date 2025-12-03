#!/usr/bin/env python3
"""
Comprehensive Authentication Testing Script
Tests Login, Register, and Logout functionality for frontend compatibility
"""

import os
import sys
import django
import json
import requests
from datetime import datetime, timedelta
from urllib.parse import urljoin

# Django Setup
sys.path.append('/workspace/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jeseci_platform.settings')
django.setup()

# Import after Django setup
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

# Test Configuration
BASE_URL = "http://localhost:8000/api"
HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

class AuthenticationTester:
    def __init__(self):
        self.access_token = None
        self.refresh_token = None
        self.user_data = None
        self.test_results = {
            "total_tests": 0,
            "passed_tests": 0,
            "failed_tests": 0,
            "test_details": []
        }

    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        self.test_results["total_tests"] += 1
        
        if success:
            self.test_results["passed_tests"] += 1
            print(f"✅ {test_name}: SUCCESS - {message}")
        else:
            self.test_results["failed_tests"] += 1
            print(f"❌ {test_name}: FAILED - {message}")
        
        test_detail = {
            "test_name": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        if details:
            test_detail["details"] = details
        
        self.test_results["test_details"].append(test_detail)

    def test_register_functionality(self):
        """Test user registration endpoint"""
        print("\n🧪 Testing Registration Functionality")
        print("=" * 50)
        
        # Test data that matches frontend expectations
        test_user_data = {
            "username": "frontend_test_user",
            "email": "frontend.test@example.com",
            "password": "TestPassword123!",
            "first_name": "Frontend",
            "last_name": "Tester",
            "learning_style": "visual",
            "preferred_difficulty": "intermediate"
        }
        
        try:
            # Test registration
            response = requests.post(
                f"{BASE_URL}/auth/register/",
                headers=HEADERS,
                json=test_user_data
            )
            
            print(f"📤 Register Request: {json.dumps(test_user_data, indent=2)}")
            print(f"📥 Register Response: {response.status_code}")
            print(f"📄 Response Body: {response.text[:500]}...")
            
            if response.status_code == 201:
                data = response.json()
                
                # Verify response structure matches frontend expectations
                if "status" in data and data["status"] == "success":
                    if "data" in data:
                        response_data = data["data"]
                        
                        # Check tokens
                        if "tokens" in response_data:
                            tokens = response_data["tokens"]
                            if "access" in tokens and "refresh" in tokens:
                                self.log_test(
                                    "Register - Token Structure", 
                                    True, 
                                    "Tokens present and properly structured",
                                    {"has_access": bool(tokens["access"]), "has_refresh": bool(tokens["refresh"])}
                                )
                            else:
                                self.log_test(
                                    "Register - Token Structure", 
                                    False, 
                                    "Missing access or refresh token"
                                )
                        else:
                            self.log_test(
                                "Register - Token Structure", 
                                False, 
                                "No tokens in response"
                            )
                        
                        # Check user data
                        if "user" in response_data:
                            user_info = response_data["user"]
                            expected_fields = ["id", "username", "email", "first_name", "last_name"]
                            missing_fields = [field for field in expected_fields if field not in user_info]
                            
                            if not missing_fields:
                                self.log_test(
                                    "Register - User Data", 
                                    True, 
                                    "User data properly structured",
                                    {"user_id": user_info.get("id"), "username": user_info.get("username")}
                                )
                            else:
                                self.log_test(
                                    "Register - User Data", 
                                    False, 
                                    f"Missing user fields: {missing_fields}"
                                )
                        else:
                            self.log_test(
                                "Register - User Data", 
                                False, 
                                "No user data in response"
                            )
                        
                        # Store tokens for logout test
                        self.access_token = tokens["access"]
                        self.refresh_token = tokens["refresh"]
                        self.user_data = user_info
                        
                        self.log_test(
                            "Register - Overall", 
                            True, 
                            "Registration completed successfully with proper response structure"
                        )
                    else:
                        self.log_test(
                            "Register - Overall", 
                            False, 
                            "No data field in response"
                        )
                else:
                    self.log_test(
                        "Register - Overall", 
                        False, 
                        f"Unexpected status field: {data.get('status')}"
                    )
            else:
                error_details = response.text[:200]
                self.log_test(
                    "Register - Overall", 
                    False, 
                    f"Registration failed with status {response.status_code}: {error_details}"
                )
        
        except Exception as e:
            self.log_test(
                "Register - Overall", 
                False, 
                f"Exception during registration: {str(e)}"
            )

    def test_login_functionality(self):
        """Test login with existing user"""
        print("\n🔐 Testing Login Functionality")
        print("=" * 50)
        
        # Use one of our test users
        login_data = {
            "email": "teacher@jeseci.com",
            "password": "teach123"
        }
        
        try:
            response = requests.post(
                f"{BASE_URL}/auth/login/",
                headers=HEADERS,
                json=login_data
            )
            
            print(f"📤 Login Request: {json.dumps(login_data, indent=2)}")
            print(f"📥 Login Response: {response.status_code}")
            print(f"📄 Response Body: {response.text[:500]}...")
            
            if response.status_code == 200:
                data = response.json()
                
                if "status" in data and data["status"] == "success":
                    if "data" in data:
                        response_data = data["data"]
                        
                        if "tokens" in response_data:
                            tokens = response_data["tokens"]
                            self.access_token = tokens.get("access")
                            self.refresh_token = tokens.get("refresh")
                            
                            self.log_test(
                                "Login - Tokens", 
                                True, 
                                "Login successful with tokens",
                                {"has_access": bool(self.access_token), "has_refresh": bool(self.refresh_token)}
                            )
                            
                            if "user" in response_data:
                                self.user_data = response_data["user"]
                                self.log_test(
                                    "Login - User Data", 
                                    True, 
                                    "User data retrieved",
                                    {"user_id": self.user_data.get("id"), "username": self.user_data.get("username")}
                                )
                            else:
                                self.log_test("Login - User Data", False, "No user data in response")
                        else:
                            self.log_test("Login - Tokens", False, "No tokens in response")
                    else:
                        self.log_test("Login - Overall", False, "No data field in response")
                else:
                    self.log_test("Login - Overall", False, f"Unexpected status: {data.get('status')}")
            else:
                self.log_test(
                    "Login - Overall", 
                    False, 
                    f"Login failed with status {response.status_code}"
                )
        
        except Exception as e:
            self.log_test(
                "Login - Overall", 
                False, 
                f"Exception during login: {str(e)}"
            )

    def test_logout_functionality(self):
        """Test logout endpoint"""
        print("\n🚪 Testing Logout Functionality")
        print("=" * 50)
        
        if not self.refresh_token:
            self.log_test("Logout", False, "No refresh token available for logout test")
            return
        
        # Test logout with refresh token
        logout_data = {
            "refresh_token": self.refresh_token
        }
        
        # Headers with authorization
        auth_headers = {
            **HEADERS,
            "Authorization": f"Bearer {self.access_token}" if self.access_token else ""
        }
        
        try:
            response = requests.post(
                f"{BASE_URL}/auth/logout/",
                headers=auth_headers,
                json=logout_data
            )
            
            print(f"📤 Logout Request: {json.dumps(logout_data, indent=2)}")
            print(f"📥 Logout Response: {response.status_code}")
            print(f"📄 Response Body: {response.text[:500]}...")
            
            if response.status_code == 200:
                data = response.json()
                
                if "status" in data and data["status"] == "success":
                    self.log_test(
                        "Logout - Success", 
                        True, 
                        "Logout completed successfully",
                        {"message": data.get("message")}
                    )
                else:
                    self.log_test(
                        "Logout - Success", 
                        False, 
                        f"Unexpected status: {data.get('status')}"
                    )
            else:
                self.log_test(
                    "Logout - Success", 
                    False, 
                    f"Logout failed with status {response.status_code}"
                )
            
            # Test token refresh after logout (should fail)
            print("\n🔄 Testing Token Refresh After Logout")
            refresh_data = {
                "refresh_token": self.refresh_token
            }
            
            refresh_response = requests.post(
                f"{BASE_URL}/auth/refresh/",
                headers=HEADERS,
                json=refresh_data
            )
            
            print(f"📥 Refresh Response After Logout: {refresh_response.status_code}")
            
            if refresh_response.status_code == 401:
                self.log_test(
                    "Logout - Token Invalidation", 
                    True, 
                    "Refresh token properly invalidated after logout"
                )
            else:
                self.log_test(
                    "Logout - Token Invalidation", 
                    False, 
                    f"Refresh token still valid after logout: {refresh_response.status_code}"
                )
        
        except Exception as e:
            self.log_test(
                "Logout - Overall", 
                False, 
                f"Exception during logout: {str(e)}"
            )

    def test_frontend_integration(self):
        """Test frontend integration compatibility"""
        print("\n🌐 Testing Frontend Integration Compatibility")
        print("=" * 50)
        
        # Test what frontend expects from auth service
        frontend_requirements = [
            "Access and refresh tokens",
            "User information (id, username, email, name)",
            "Profile information",
            "Consistent response structure",
            "Proper HTTP status codes"
        ]
        
        # Verify login response matches frontend expectations
        login_data = {
            "email": "student@jeseci.com",
            "password": "learn123"
        }
        
        try:
            response = requests.post(
                f"{BASE_URL}/auth/login/",
                headers=HEADERS,
                json=login_data
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check frontend expects
                checks = []
                
                # 1. Tokens structure
                if "data" in data and "tokens" in data["data"]:
                    tokens = data["data"]["tokens"]
                    checks.append(("Tokens", bool(tokens.get("access") and tokens.get("refresh"))))
                else:
                    checks.append(("Tokens", False))
                
                # 2. User data structure
                if "data" in data and "user" in data["data"]:
                    user = data["data"]["user"]
                    user_checks = [
                        bool(user.get("id")),
                        bool(user.get("username")),
                        bool(user.get("email")),
                        bool(user.get("first_name")),
                        bool(user.get("last_name"))
                    ]
                    checks.append(("User Data", all(user_checks)))
                else:
                    checks.append(("User Data", False))
                
                # 3. Profile data
                if "data" in data and "profile" in data["data"]:
                    checks.append(("Profile Data", True))
                else:
                    checks.append(("Profile Data", False))
                
                # 4. Response structure
                checks.append(("Response Structure", "status" in data and "data" in data))
                
                # 5. Success handling
                checks.append(("Success Response", data.get("status") == "success"))
                
                for check_name, check_result in checks:
                    self.log_test(
                        f"Frontend Integration - {check_name}", 
                        check_result, 
                        f"Frontend {'can' if check_result else 'cannot'} properly consume this response"
                    )
                
                overall_compatible = all(check[1] for check in checks)
                self.log_test(
                    "Frontend Integration - Overall", 
                    overall_compatible, 
                    f"Frontend {'is' if overall_compatible else 'is NOT'} compatible with backend responses"
                )
            else:
                self.log_test(
                    "Frontend Integration - Overall", 
                    False, 
                    f"Login failed, cannot test frontend compatibility"
                )
        
        except Exception as e:
            self.log_test(
                "Frontend Integration - Overall", 
                False, 
                f"Exception during frontend compatibility test: {str(e)}"
            )

    def run_all_tests(self):
        """Run all authentication tests"""
        print("🚀 Starting Comprehensive Authentication Testing")
        print("=" * 60)
        print(f"Target URL: {BASE_URL}")
        print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)
        
        # Test in logical order
        self.test_register_functionality()
        self.test_login_functionality()
        self.test_logout_functionality()
        self.test_frontend_integration()
        
        # Print summary
        print("\n" + "=" * 60)
        print("🎯 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.test_results['total_tests']}")
        print(f"✅ Passed: {self.test_results['passed_tests']}")
        print(f"❌ Failed: {self.test_results['failed_tests']}")
        print(f"Success Rate: {(self.test_results['passed_tests'] / max(self.test_results['total_tests'], 1) * 100):.1f}%")
        
        if self.test_results['failed_tests'] == 0:
            print("\n🎉 ALL TESTS PASSED! Authentication system is fully functional.")
            print("✅ Frontend can login, register, and logout successfully!")
        else:
            print(f"\n⚠️  {self.test_results['failed_tests']} test(s) failed. Review the details above.")
        
        return self.test_results

def main():
    """Main test runner"""
    try:
        tester = AuthenticationTester()
        results = tester.run_all_tests()
        
        # Save detailed results to file
        results_file = "/workspace/backend/auth_test_results.json"
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n📄 Detailed results saved to: {results_file}")
        
        return results['failed_tests'] == 0
        
    except KeyboardInterrupt:
        print("\n⏹️  Tests interrupted by user")
        return False
    except Exception as e:
        print(f"\n💥 Critical error during testing: {str(e)}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)