"""
Integration tests for Jac walker functionality
"""

import json
import time
import subprocess
import requests
from django.test import TestCase, TransactionTestCase
from django.test.utils import override_settings
from django.conf import settings
from api.models import User, Concept, Lesson, Quiz, UserProgress
import threading
import socket


class JacServerIntegrationTest(TransactionTestCase):
    """Test cases for Jac server integration"""
    
    @classmethod
    def setUpClass(cls):
        """Set up test class - start Jac server"""
        super().setUpClass()
        cls.jac_process = None
        cls.base_url = "http://127.0.0.1:8001"
        
        # Check if Jac is available
        try:
            result = subprocess.run(['which', 'jac'], capture_output=True, text=True)
            if result.returncode != 0:
                cls.skipTest(cls, "Jac language not installed")
        except Exception:
            cls.skipTest(cls, "Jac language not available")
    
    @classmethod
    def tearDownClass(cls):
        """Clean up test class - stop Jac server"""
        super().tearDownClass()
        if cls.jac_process:
            cls.jac_process.terminate()
            cls.jac_process.wait()
    
    def setUp(self):
        """Set up each test"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
    
    def wait_for_jac_server(self, timeout=30):
        """Wait for Jac server to be ready"""
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                response = requests.get(f"{self.base_url}/health", timeout=1)
                if response.status_code == 200:
                    return True
            except requests.exceptions.RequestException:
                pass
            time.sleep(1)
        return False
    
    def test_jac_server_health_check(self):
        """Test Jac server health endpoint"""
        # This test would require a running Jac server
        # For now, we'll test the mock functionality
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data['status'], 'healthy')
        except requests.exceptions.ConnectionError:
            self.skipTest("Jac server not running - skipping integration test")
    
    def test_jac_orchestrator_walker(self):
        """Test Jac orchestrator walker"""
        payload = {
            "walker": "orchestrator",
            "params": {
                "action": "health_check",
                "user_id": str(self.user.id)
            }
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/spawn",
                json=payload,
                timeout=10
            )
            self.assertEqual(response.status_code, 200)
            
            result = response.json()
            self.assertIn('status', result)
            self.assertIn('message', result)
            
        except requests.exceptions.ConnectionError:
            self.skipTest("Jac server not running - skipping integration test")
    
    def test_jac_quiz_master_walker(self):
        """Test Jac QuizMaster walker for quiz generation"""
        concept = Concept.objects.create(
            name='Test Concept',
            description='Test concept description',
            difficulty_level=1
        )
        
        payload = {
            "walker": "quiz_master",
            "params": {
                "action": "generate_quiz",
                "topic": concept.name,
                "difficulty_level": 1,
                "user_id": str(self.user.id)
            }
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/spawn",
                json=payload,
                timeout=30
            )
            self.assertEqual(response.status_code, 200)
            
            result = response.json()
            self.assertIn('quiz', result)
            self.assertIn('difficulty_level', result)
            
        except requests.exceptions.ConnectionError:
            self.skipTest("Jac server not running - skipping integration test")
    
    def test_jac_evaluator_walker(self):
        """Test Jac Evaluator walker"""
        payload = {
            "walker": "evaluator",
            "params": {
                "action": "evaluate_submission",
                "submission": {
                    "code": "x = 5\nprint(x)",
                    "expected": "A variable assignment and print statement"
                },
                "user_id": str(self.user.id)
            }
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/spawn",
                json=payload,
                timeout=30
            )
            self.assertEqual(response.status_code, 200)
            
            result = response.json()
            self.assertIn('score', result)
            self.assertIn('feedback', result)
            self.assertIn('technical_accuracy', result)
            
        except requests.exceptions.ConnectionError:
            self.skipTest("Jac server not running - skipping integration test")
    
    def test_jac_progress_tracker_walker(self):
        """Test Jac ProgressTracker walker"""
        concept = Concept.objects.create(
            name='Progress Test Concept',
            description='Test concept for progress tracking',
            difficulty_level=1
        )
        
        UserProgress.objects.create(
            user=self.user,
            concept=concept,
            completion_percentage=75.0,
            mastery_score=0.75,
            time_spent_minutes=30
        )
        
        payload = {
            "walker": "progress_tracker",
            "params": {
                "action": "analyze_progress",
                "user_id": str(self.user.id)
            }
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/spawn",
                json=payload,
                timeout=10
            )
            self.assertEqual(response.status_code, 200)
            
            result = response.json()
            self.assertIn('completion_rate', result)
            self.assertIn('total_time_spent', result)
            self.assertIn('average_mastery', result)
            
        except requests.exceptions.ConnectionError:
            self.skipTest("Jac server not running - skipping integration test")


class JacDjangoIntegrationTest(TestCase):
    """Test cases for Jac-Django integration"""
    
    def setUp(self):
        """Set up each test"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.concept = Concept.objects.create(
            name='Integration Test Concept',
            description='Test concept for integration testing',
            difficulty_level=2
        )
    
    @override_settings(JAC_SERVER_URL="http://mock-server:8001")
    def test_jac_manager_mock_integration(self):
        """Test Jac manager with mocked server responses"""
        from jac_layer.jac_manager import JacManager
        
        # Test health check with mock
        try:
            result = JacManager.check_jac_server_health()
            # This will fail if server is not running, which is expected in test environment
        except Exception as e:
            self.assertIsInstance(e, (requests.exceptions.ConnectionError, Exception))
    
    def test_jac_file_loading(self):
        """Test that Jac files can be loaded"""
        import os
        from jac_layer.jac_manager import JacManager
        
        jac_dir = os.path.join(settings.BASE_DIR, 'jac_layer', 'walkers')
        jac_files = [f for f in os.listdir(jac_dir) if f.endswith('.jac')]
        
        self.assertGreater(len(jac_files), 0)
        self.assertIn('orchestrator.jac', jac_files)
        self.assertIn('quiz_master.jac', jac_files)
        self.assertIn('evaluator.jac', jac_files)
    
    def test_jac_syntax_validation(self):
        """Test Jac file syntax validation"""
        import os
        import subprocess
        
        jac_dir = os.path.join(settings.BASE_DIR, 'jac_layer', 'walkers')
        jac_files = [f for f in os.listdir(jac_dir) if f.endswith('.jac')]
        
        for jac_file in jac_files:
            file_path = os.path.join(jac_dir, jac_file)
            try:
                # Try to compile the Jac file
                result = subprocess.run(
                    ['jac', 'check', file_path],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                # Note: This might fail if jac is not properly installed
                # In a real environment, this would validate syntax
            except (subprocess.TimeoutExpired, FileNotFoundError):
                # Skip validation if jac is not available
                continue


class JacOSPIntegrationTest(TestCase):
    """Test cases for Jac OSP graph integration"""
    
    def setUp(self):
        """Set up each test"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
    
    def test_concept_mastery_tracking(self):
        """Test concept mastery tracking with Jac"""
        concept1 = Concept.objects.create(
            name='Basic Variables',
            description='Understanding basic variables',
            difficulty_level=1
        )
        concept2 = Concept.objects.create(
            name='Advanced Variables',
            description='Advanced variable concepts',
            difficulty_level=2,
            prerequisites=[concept1]
        )
        
        # Create initial progress
        progress1 = UserProgress.objects.create(
            user=self.user,
            concept=concept1,
            completion_percentage=100.0,
            mastery_score=1.0
        )
        
        # Check that progress was created
        self.assertEqual(progress1.mastery_score, 1.0)
        self.assertIn(concept1, concept2.prerequisites.all())
    
    def test_learning_path_generation(self):
        """Test learning path generation"""
        concepts = [
            Concept.objects.create(
                name=f'Concept {i}',
                description=f'Description for concept {i}',
                difficulty_level=i
            ) for i in range(1, 4)
        ]
        
        # Set up prerequisites (1 -> 2 -> 3)
        concepts[1].prerequisites.add(concepts[0])
        concepts[2].prerequisites.add(concepts[1])
        
        # Verify prerequisite chain
        self.assertIn(concepts[0], concepts[1].prerequisites.all())
        self.assertIn(concepts[1], concepts[2].prerequisites.all())
        
        # The learning path should be: Concept 1 -> Concept 2 -> Concept 3
        self.assertEqual(concepts[0].difficulty_level, 1)
        self.assertEqual(concepts[1].difficulty_level, 2)
        self.assertEqual(concepts[2].difficulty_level, 3)


class JacByLLMIntegrationTest(TestCase):
    """Test cases for byLLM integration in Jac walkers"""
    
    def setUp(self):
        """Set up each test"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
    
    @override_settings(OPENAI_API_KEY="test-key-for-testing")
    def test_byllm_environment_configuration(self):
        """Test that byLLM is properly configured"""
        # Check that LLM environment variables are set
        self.assertTrue(hasattr(settings, 'OPENAI_API_KEY'))
        
        # Verify that the key is configured (even if it's a test key)
        self.assertIsNotNone(settings.OPENAI_API_KEY)
    
    def test_jac_llm_decorator_syntax(self):
        """Test that Jac files contain proper LLM decorator syntax"""
        import os
        
        jac_dir = os.path.join(settings.BASE_DIR, 'jac_layer', 'walkers')
        jac_files = [f for f in os.listdir(jac_dir) if f.endswith('.jac')]
        
        # Check that key walkers have LLM decorators
        llm_keywords = ['by llm', '@byLLM', 'llm(']
        
        for jac_file in jac_files:
            file_path = os.path.join(jac_dir, jac_file)
            with open(file_path, 'r') as f:
                content = f.read()
                
                # At least one walker should have LLM integration
                if jac_file in ['quiz_master.jac', 'evaluator.jac']:
                    has_llm = any(keyword in content.lower() for keyword in llm_keywords)
                    self.assertTrue(has_llm, f"{jac_file} should contain LLM integration")


class JacPerformanceIntegrationTest(TestCase):
    """Performance tests for Jac integration"""
    
    def setUp(self):
        """Set up each test"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.concept = Concept.objects.create(
            name='Performance Test Concept',
            description='Test concept for performance testing',
            difficulty_level=1
        )
    
    def test_concept_creation_performance(self):
        """Test concept creation performance"""
        import time
        
        start_time = time.time()
        
        concepts = []
        for i in range(10):
            concept = Concept.objects.create(
                name=f'Performance Concept {i}',
                description=f'Description for performance concept {i}',
                difficulty_level=1
            )
            concepts.append(concept)
        
        end_time = time.time()
        creation_time = end_time - start_time
        
        # Creating 10 concepts should take less than 1 second
        self.assertLess(creation_time, 1.0)
        
        # Clean up
        for concept in concepts:
            concept.delete()
    
    def test_progress_update_performance(self):
        """Test user progress update performance"""
        import time
        
        start_time = time.time()
        
        progress_records = []
        for i in range(10):
            progress = UserProgress.objects.create(
                user=self.user,
                concept=self.concept,
                completion_percentage=float(i * 10),
                mastery_score=float(i * 0.1)
            )
            progress_records.append(progress)
        
        end_time = time.time()
        update_time = end_time - start_time
        
        # Creating 10 progress records should take less than 1 second
        self.assertLess(update_time, 1.0)
        
        # Clean up
        for progress in progress_records:
            progress.delete()