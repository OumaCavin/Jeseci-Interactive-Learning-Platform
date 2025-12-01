"""
Unit tests for Django API models
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from api.models import Lesson, Quiz, Concept, UserProgress, User

User = get_user_model()


class UserModelTest(TestCase):
    """Test cases for User model"""
    
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword123'
        }
    
    def test_create_user(self):
        """Test creating a user with required fields"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpassword123'))
        self.assertFalse(user.is_superuser)
    
    def test_user_str_representation(self):
        """Test string representation of user"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(str(user), 'testuser')


class ConceptModelTest(TestCase):
    """Test cases for Concept model"""
    
    def setUp(self):
        self.concept_data = {
            'name': 'Variables and Data Types',
            'description': 'Understanding variables, data types, and type conversion',
            'difficulty_level': 1,
            'prerequisites': []
        }
    
    def test_create_concept(self):
        """Test creating a concept"""
        concept = Concept.objects.create(**self.concept_data)
        self.assertEqual(concept.name, 'Variables and Data Types')
        self.assertEqual(concept.difficulty_level, 1)
        self.assertEqual(concept.mastery_score, 0.0)
    
    def test_concept_str_representation(self):
        """Test string representation of concept"""
        concept = Concept.objects.create(**self.concept_data)
        self.assertEqual(str(concept), 'Variables and Data Types')


class LessonModelTest(TestCase):
    """Test cases for Lesson model"""
    
    def setUp(self):
        self.concept = Concept.objects.create(
            name='Test Concept',
            description='Test concept description',
            difficulty_level=1
        )
        self.lesson_data = {
            'title': 'Introduction to Variables',
            'content': 'This is a lesson about variables...',
            'concept': self.concept,
            'order_index': 1,
            'is_published': True
        }
    
    def test_create_lesson(self):
        """Test creating a lesson"""
        lesson = Lesson.objects.create(**self.lesson_data)
        self.assertEqual(lesson.title, 'Introduction to Variables')
        self.assertEqual(lesson.concept, self.concept)
        self.assertTrue(lesson.is_published)
    
    def test_lesson_str_representation(self):
        """Test string representation of lesson"""
        lesson = Lesson.objects.create(**self.lesson_data)
        self.assertEqual(str(lesson), 'Introduction to Variables')


class QuizModelTest(TestCase):
    """Test cases for Quiz model"""
    
    def setUp(self):
        self.concept = Concept.objects.create(
            name='Test Concept',
            description='Test concept description',
            difficulty_level=1
        )
        self.quiz_data = {
            'title': 'Variables Quiz',
            'concept': self.concept,
            'difficulty_level': 1,
            'questions': [
                {
                    'type': 'multiple_choice',
                    'question': 'What is a variable?',
                    'options': ['A', 'B', 'C', 'D'],
                    'correct_answer': 'A'
                }
            ]
        }
    
    def test_create_quiz(self):
        """Test creating a quiz"""
        quiz = Quiz.objects.create(**self.quiz_data)
        self.assertEqual(quiz.title, 'Variables Quiz')
        self.assertEqual(quiz.concept, self.concept)
        self.assertEqual(quiz.difficulty_level, 1)
    
    def test_quiz_str_representation(self):
        """Test string representation of quiz"""
        quiz = Quiz.objects.create(**self.quiz_data)
        self.assertEqual(str(quiz), 'Variables Quiz')


class UserProgressModelTest(TestCase):
    """Test cases for UserProgress model"""
    
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
        self.progress_data = {
            'user': self.user,
            'concept': self.concept,
            'completion_percentage': 0.0,
            'mastery_score': 0.0,
            'time_spent_minutes': 0,
            'attempts_count': 0
        }
    
    def test_create_user_progress(self):
        """Test creating user progress"""
        progress = UserProgress.objects.create(**self.progress_data)
        self.assertEqual(progress.user, self.user)
        self.assertEqual(progress.concept, self.concept)
        self.assertEqual(progress.completion_percentage, 0.0)
        self.assertEqual(progress.mastery_score, 0.0)
    
    def test_user_progress_str_representation(self):
        """Test string representation of user progress"""
        progress = UserProgress.objects.create(**self.progress_data)
        expected_str = f'{self.user.username} - {self.concept.name}'
        self.assertEqual(str(progress), expected_str)