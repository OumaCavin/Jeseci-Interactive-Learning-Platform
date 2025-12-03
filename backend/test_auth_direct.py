#!/usr/bin/env python3
"""
Direct Authentication Testing Script
Tests the authentication views directly without HTTP server
"""

import os
import sys
import django
import json
from datetime import datetime
from django.test import RequestFactory
from django.contrib.auth.models import User

# Django Setup
sys.path.append('/workspace/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jeseci_platform.settings')
django.setup()

# Import views after Django setup
from api.views import LoginView, RegisterView, LogoutView, RefreshTokenView
from api.serializers import LoginSerializer, RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class DirectAuthTester:
    def __init__(self):
        self.test_results = {
            "total_tests": 0,
            "passed_tests": 0,
            "failed_tests": 0,
            "test_details": []
        }
        self.factory = RequestFactory()
        self.test_user = None

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

    def setup_test_user(self):
        """Create a test user for testing"""
        try:
            # Clear any existing test user
            User.objects.filter(username="test_user_direct").delete()
            
            # Create new test user
            self.test_user = User.objects.create_user(
                username="test_user_direct",
                email="direct.test@example.com",
                password="TestPassword123!",
                first_name="Direct",
                last_name="Tester"
            )
            print(f"👤 Created test user: {self.test_user.username}")
            return True
        except Exception as e:
            print(f"❌ Failed to create test user: {str(e)}")
            return False

    def test_login_view(self):
        """Test the LoginView directly"""
        print("\n🔐 Testing LoginView Directly")
        print("=" * 50)
        
        if not self.test_user:
            self.log_test("LoginView - Setup", False, "No test user available")
            return
        
        # Create request with login data
        login_data = {
            "email": "direct.test@example.com",
            "password": "TestPassword123!"
        }
        
        request = self.factory.post('/api/auth/login/', login_data, content_type='application/json')
        
        try:
            view = LoginView.as_view()
            response = view(request)
            
            print(f"📥 Response Status: {response.status_code}")
            
            # Parse response data
            try:
                response_data = json.loads(response.content)
                print(f"📄 Response Data: {json.dumps(response_data, indent=2)[:500]}...")
            except:
                response_data = {}
            
            if response.status_code == 200:
                if "status" in response_data and response_data["status"] == "success":
                    if "data" in response_data:
                        data = response_data["data"]
                        
                        # Check tokens
                        if "tokens" in data:
                            tokens = data["tokens"]
                            if "access" in tokens and "refresh" in tokens:
                                self.log_test(
                                    "LoginView - Response Structure", 
                                    True, 
                                    "LoginView returns proper response structure",
                                    {
                                        "has_tokens": True,
                                        "has_user": "user" in data,
                                        "access_token_length": len(tokens["access"]) if tokens["access"] else 0
                                    }
                                )
                                
                                # Store tokens for logout test
                                self.access_token = tokens["access"]
                                self.refresh_token = tokens["refresh"]
                            else:
                                self.log_test(
                                    "LoginView - Response Structure", 
                                    False, 
                                    "Missing access or refresh token"
                                )
                        else:
                            self.log_test(
                                "LoginView - Response Structure", 
                                False, 
                                "No tokens in response"
                            )
                    else:
                        self.log_test(
                            "LoginView - Response Structure", 
                            False, 
                            "No data field in response"
                        )
                else:
                    self.log_test(
                        "LoginView - Response Structure", 
                        False, 
                        f"Unexpected status: {response_data.get('status')}"
                    )
            else:
                error_message = response_data.get('message', 'Unknown error')
                self.log_test(
                    "LoginView - Response Structure", 
                    False, 
                    f"Login failed with status {response.status_code}: {error_message}"
                )
        
        except Exception as e:
            self.log_test(
                "LoginView - Response Structure", 
                False, 
                f"Exception in LoginView: {str(e)}"
            )

    def test_register_view(self):
        """Test the RegisterView directly"""
        print("\n🧪 Testing RegisterView Directly")
        print("=" * 50)
        
        # Create request with registration data
        register_data = {
            "username": "new_test_user_direct",
            "email": "new.direct.test@example.com",
            "password": "NewTestPassword123!",
            "first_name": "New",
            "last_name": "Tester",
            "learning_style": "visual",
            "preferred_difficulty": "beginner"
        }
        
        request = self.factory.post('/api/auth/register/', register_data, content_type='application/json')
        
        try:
            view = RegisterView.as_view()
            response = view(request)
            
            print(f"📥 Response Status: {response.status_code}")
            
            # Parse response data
            try:
                response_data = json.loads(response.content)
                print(f"📄 Response Data: {json.dumps(response_data, indent=2)[:500]}...")
            except:
                response_data = {}
            
            if response.status_code == 201:
                if "status" in response_data and response_data["status"] == "success":
                    if "data" in response_data:
                        data = response_data["data"]
                        
                        # Check tokens
                        if "tokens" in data:
                            tokens = data["tokens"]
                            if "access" in tokens and "refresh" in tokens:
                                self.log_test(
                                    "RegisterView - Response Structure", 
                                    True, 
                                    "RegisterView returns proper response structure",
                                    {
                                        "has_tokens": True,
                                        "has_user": "user" in data,
                                        "user_id": data.get("user", {}).get("id") if "user" in data else None
                                    }
                                )
                                
                                # Store tokens for logout test
                                self.access_token = tokens["access"]
                                self.refresh_token = tokens["refresh"]
                                
                                # Verify user was created
                                try:
                                    created_user = User.objects.get(username=register_data["username"])
                                    self.log_test(
                                        "RegisterView - User Creation", 
                                        True, 
                                        "User was successfully created in database",
                                        {"created_user_id": created_user.id}
                                    )
                                except User.DoesNotExist:
                                    self.log_test(
                                        "RegisterView - User Creation", 
                                        False, 
                                        "User was not created in database"
                                    )
                            else:
                                self.log_test(
                                    "RegisterView - Response Structure", 
                                    False, 
                                    "Missing access or refresh token"
                                )
                        else:
                            self.log_test(
                                "RegisterView - Response Structure", 
                                False, 
                                "No tokens in response"
                            )
                    else:
                        self.log_test(
                            "RegisterView - Response Structure", 
                            False, 
                            "No data field in response"
                        )
                else:
                    self.log_test(
                        "RegisterView - Response Structure", 
                        False, 
                        f"Unexpected status: {response_data.get('status')}"
                    )
            else:
                error_message = response_data.get('message', 'Unknown error')
                errors = response_data.get('errors', {})
                self.log_test(
                    "RegisterView - Response Structure", 
                    False, 
                    f"Registration failed with status {response.status_code}: {error_message}",
                    {"errors": errors}
                )
        
        except Exception as e:
            self.log_test(
                "RegisterView - Response Structure", 
                False, 
                f"Exception in RegisterView: {str(e)}"
            )

    def test_logout_view(self):
        """Test the LogoutView directly"""
        print("\n🚪 Testing LogoutView Directly")
        print("=" * 50)
        
        if not self.test_user:
            self.log_test("LogoutView - Setup", False, "No test user available")
            return
        
        if not hasattr(self, 'refresh_token') or not self.refresh_token:
            self.log_test("LogoutView - Setup", False, "No refresh token available")
            return
        
        # Create request with logout data and authentication
        logout_data = {
            "refresh_token": self.refresh_token
        }
        
        request = self.factory.post('/api/auth/logout/', logout_data, content_type='application/json')
        request.user = self.test_user  # Simulate authenticated user
        
        try:
            view = LogoutView.as_view()
            response = view(request)
            
            print(f"📥 Response Status: {response.status_code}")
            
            # Parse response data
            try:
                response_data = json.loads(response.content)
                print(f"📄 Response Data: {json.dumps(response_data, indent=2)}")
            except:
                response_data = {}
            
            if response.status_code == 200:
                if "status" in response_data and response_data["status"] == "success":
                    self.log_test(
                        "LogoutView - Response Structure", 
                        True, 
                        "LogoutView returns proper response structure",
                        {"message": response_data.get("message")}
                    )
                else:
                    self.log_test(
                        "LogoutView - Response Structure", 
                        False, 
                        f"Unexpected status: {response_data.get('status')}"
                    )
            else:
                error_message = response_data.get('message', 'Unknown error')
                self.log_test(
                    "LogoutView - Response Structure", 
                    False, 
                    f"Logout failed with status {response.status_code}: {error_message}"
                )
        
        except Exception as e:
            self.log_test(
                "LogoutView - Response Structure", 
                False, 
                f"Exception in LogoutView: {str(e)}"
            )

    def test_serializer_validation(self):
        """Test the serializers to ensure they work with frontend data"""
        print("\n🔍 Testing Serializer Validation")
        print("=" * 50)
        
        # Test LoginSerializer
        login_test_data = {
            "email": "direct.test@example.com",
            "password": "TestPassword123!"
        }
        
        try:
            login_serializer = LoginSerializer(data=login_test_data)
            if login_serializer.is_valid():
                self.log_test(
                    "LoginSerializer - Validation", 
                    True, 
                    "LoginSerializer validates frontend login data correctly"
                )
            else:
                self.log_test(
                    "LoginSerializer - Validation", 
                    False, 
                    f"LoginSerializer validation failed: {login_serializer.errors}"
                )
        except Exception as e:
            self.log_test(
                "LoginSerializer - Validation", 
                False, 
                f"Exception in LoginSerializer: {str(e)}"
            )
        
        # Test RegisterSerializer
        register_test_data = {
            "username": "serializer_test_user",
            "email": "serializer.test@example.com",
            "password": "SerializerTest123!",
            "first_name": "Serializer",
            "last_name": "Tester"
        }
        
        try:
            register_serializer = RegisterSerializer(data=register_test_data)
            if register_serializer.is_valid():
                self.log_test(
                    "RegisterSerializer - Validation", 
                    True, 
                    "RegisterSerializer validates frontend registration data correctly"
                )
            else:
                self.log_test(
                    "RegisterSerializer - Validation", 
                    False, 
                    f"RegisterSerializer validation failed: {register_serializer.errors}"
                )
        except Exception as e:
            self.log_test(
                "RegisterSerializer - Validation", 
                False, 
                f"Exception in RegisterSerializer: {str(e)}"
            )

    def test_frontend_compatibility(self):
        """Test frontend integration compatibility"""
        print("\n🌐 Testing Frontend Integration Compatibility")
        print("=" * 50)
        
        # Check that views return the expected structure for frontend
        test_cases = [
            {
                "name": "Login Response Structure",
                "view": LoginView,
                "data": {
                    "email": "direct.test@example.com",
                    "password": "TestPassword123!"
                },
                "expected_status": 200,
                "expected_fields": ["status", "message", "data"]
            },
            {
                "name": "Register Response Structure", 
                "view": RegisterView,
                "data": {
                    "username": "frontend_comp_test_user",
                    "email": "frontend.comp@example.com",
                    "password": "FrontendTest123!",
                    "first_name": "Frontend",
                    "last_name": "Compat"
                },
                "expected_status": 201,
                "expected_fields": ["status", "message", "data"]
            }
        ]
        
        for test_case in test_cases:
            try:
                request = self.factory.post('/api/auth/test/', test_case["data"], content_type='application/json')
                view = test_case["view"].as_view()
                response = view(request)
                
                if response.status_code == test_case["expected_status"]:
                    try:
                        response_data = json.loads(response.content)
                        
                        # Check expected fields
                        missing_fields = [field for field in test_case["expected_fields"] if field not in response_data]
                        
                        if not missing_fields:
                            self.log_test(
                                f"Frontend Compatibility - {test_case['name']}", 
                                True, 
                                f"Response contains all expected fields for frontend"
                            )
                        else:
                            self.log_test(
                                f"Frontend Compatibility - {test_case['name']}", 
                                False, 
                                f"Missing fields: {missing_fields}"
                            )
                    except:
                        self.log_test(
                            f"Frontend Compatibility - {test_case['name']}", 
                            False, 
                            "Could not parse response data"
                        )
                else:
                    self.log_test(
                        f"Frontend Compatibility - {test_case['name']}", 
                        False, 
                        f"Unexpected status code: {response.status_code}"
                    )
            
            except Exception as e:
                self.log_test(
                    f"Frontend Compatibility - {test_case['name']}", 
                    False, 
                    f"Exception: {str(e)}"
                )

    def run_all_tests(self):
        """Run all authentication tests"""
        print("🚀 Starting Direct Authentication Testing")
        print("=" * 60)
        print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)
        
        # Setup test user
        if not self.setup_test_user():
            print("❌ Cannot proceed without test user")
            return self.test_results
        
        # Run tests
        self.test_serializer_validation()
        self.test_login_view()
        self.test_register_view()
        self.test_logout_view()
        self.test_frontend_compatibility()
        
        # Print summary
        print("\n" + "=" * 60)
        print("🎯 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.test_results['total_tests']}")
        print(f"✅ Passed: {self.test_results['passed_tests']}")
        print(f"❌ Failed: {self.test_results['failed_tests']}")
        print(f"Success Rate: {(self.test_results['passed_tests'] / max(self.test_results['total_tests'], 1) * 100):.1f}%")
        
        if self.test_results['failed_tests'] == 0:
            print("\n🎉 ALL TESTS PASSED! Authentication endpoints are working correctly.")
            print("✅ Frontend can successfully integrate with the authentication system!")
        else:
            print(f"\n⚠️  {self.test_results['failed_tests']} test(s) failed. Review the details above.")
        
        return self.test_results

def main():
    """Main test runner"""
    try:
        tester = DirectAuthTester()
        results = tester.run_all_tests()
        
        # Save detailed results to file
        results_file = "/workspace/backend/direct_auth_test_results.json"
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2, default=str)
        
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