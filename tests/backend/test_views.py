"""
Unit tests for Django API views
"""

from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from api.models import Lesson, Quiz, Concept, UserProgress
from api.views import (
    InitializeLearningView,
    GetLessonView,
    RequestQuizView,
    SubmitAnswerView,
    SkillMapView,
    HealthCheckView
)

User = get_user_model()


class HealthCheckViewTest(APITestCase):
    """Test cases for HealthCheckView"""
    
    def test_health_check(self):
        """Test health check endpoint"""
        url = reverse('health-check')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('status', response.data)
        self.assertEqual(response.data['status'], 'healthy')


class InitializeLearningViewTest(APITestCase):
    """Test cases for InitializeLearningView"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_initialize_learning(self):
        """Test initializing learning for a user"""
        url = reverse('initialize-learning')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('user_id', response.data)
    
    def test_initialize_learning_unauthenticated(self):
        """Test that unauthenticated users cannot initialize learning"""
        self.client.force_authenticate(user=None)
        url = reverse('initialize-learning')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class GetLessonViewTest(APITestCase):
    """Test cases for GetLessonView"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.concept = Concept.objects.create(
            name='Test Concept',
            description='Test concept description',
            difficulty_level=1
        )
        self.lesson = Lesson.objects.create(
            title='Test Lesson',
            content='Test lesson content',
            concept=self.concept,
            order_index=1,
            is_published=True
        )
        self.client.force_authenticate(user=self.user)
    
    def test_get_lesson_success(self):
        """Test successfully getting a lesson"""
        url = reverse('get-lesson', kwargs={'lesson_id': self.lesson.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Lesson')
        self.assertEqual(response.data['content'], 'Test lesson content')
    
    def test_get_lesson_not_found(self):
        """Test getting a non-existent lesson"""
        url = reverse('get-lesson', kwargs={'lesson_id': 999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_get_lesson_unauthenticated(self):
        """Test that unauthenticated users cannot get lessons"""
        self.client.force_authenticate(user=None)
        url = reverse('get-lesson', kwargs={'lesson_id': self.lesson.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RequestQuizViewTest(APITestCase):
    """Test cases for RequestQuizView"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.concept = Concept.objects.create(
            name='Test Concept',
            description='Test concept description',
            difficulty_level=1
        )
        self.client.force_authenticate(user=self.user)
    
    def test_request_quiz_success(self):
        """Test successfully requesting a quiz"""
        url = reverse('request-quiz', kwargs={'topic': 'variables'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('quiz', response.data)
        self.assertIn('difficulty_level', response.data)
    
    def test_request_quiz_unauthenticated(self):
        """Test that unauthenticated users cannot request quizzes"""
        self.client.force_authenticate(user=None)
        url = reverse('request-quiz', kwargs={'topic': 'variables'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class SubmitAnswerViewTest(APITestCase):
    """Test cases for SubmitAnswerView"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_submit_answer_success(self):
        """Test successfully submitting an answer"""
        url = reverse('submit-answer')
        data = {
            'question_id': 'test_question_1',
            'answer': 'A',
            'question_type': 'multiple_choice'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('correct', response.data)
        self.assertIn('feedback', response.data)
        self.assertIn('next_question', response.data)
    
    def test_submit_answer_invalid_data(self):
        """Test submitting answer with invalid data"""
        url = reverse('submit-answer')
        data = {
            'question_id': '',  # Empty question_id
            'answer': '',
            'question_type': 'invalid_type'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_submit_answer_unauthenticated(self):
        """Test that unauthenticated users cannot submit answers"""
        self.client.force_authenticate(user=None)
        url = reverse('submit-answer')
        data = {
            'question_id': 'test_question_1',
            'answer': 'A',
            'question_type': 'multiple_choice'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class SkillMapViewTest(APITestCase):
    """Test cases for SkillMapView"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.concept = Concept.objects.create(
            name='Test Concept',
            description='Test concept description',
            difficulty_level=1
        )
        UserProgress.objects.create(
            user=self.user,
            concept=self.concept,
            completion_percentage=50.0,
            mastery_score=0.5
        )
        self.client.force_authenticate(user=self.user)
    
    def test_skill_map_success(self):
        """Test successfully getting skill map"""
        url = reverse('skill-map')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('concepts', response.data)
        self.assertIn('progress', response.data)
        self.assertIn('recommendations', response.data)
    
    def test_skill_map_unauthenticated(self):
        """Test that unauthenticated users cannot access skill map"""
        self.client.force_authenticate(user=None)
        url = reverse('skill-map')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class WalkerAccessViewTest(APITestCase):
    """Test cases for walker direct access"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_jac_walker_access(self):
        """Test accessing Jac walker directly"""
        url = reverse('jac-walker', kwargs={'walker_name': 'health_check'})
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('result', response.data)
    
    def test_jac_walker_invalid_name(self):
        """Test accessing invalid Jac walker"""
        url = reverse('jac-walker', kwargs={'walker_name': 'invalid_walker'})
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_jac_walker_unauthenticated(self):
        """Test that unauthenticated users cannot access walkers"""
        self.client.force_authenticate(user=None)
        url = reverse('jac-walker', kwargs={'walker_name': 'health_check'})
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)