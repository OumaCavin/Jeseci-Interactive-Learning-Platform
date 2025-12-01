"""
Django Models for Jeseci Interactive Learning Platform

Database models for user management, learning content, and progress tracking.
"""
import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class UserProfile(models.Model):
    """Extended user profile for learning preferences"""
    LEARNING_STYLES = [
        ('visual', 'Visual'),
        ('auditory', 'Auditory'),
        ('kinesthetic', 'Kinesthetic'),
        ('reading', 'Reading/Writing'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    learning_style = models.CharField(max_length=20, choices=LEARNING_STYLES, default='visual')
    preferred_difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='beginner')
    avatar_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    class Meta:
        db_table = 'user_profile'

class Concept(models.Model):
    """Learning concepts for organizing content"""
    CATEGORIES = [
        ('programming', 'Programming'),
        ('algorithms', 'Algorithms'),
        ('data_structures', 'Data Structures'),
        ('web_development', 'Web Development'),
        ('database', 'Database'),
        ('ai_ml', 'AI/ML'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORIES)
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS)
    related_concepts = models.ManyToManyField('self', symmetrical=True, blank=True)
    mastery_score = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    last_practiced = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'concept'
        ordering = ['name']

class Lesson(models.Model):
    """Individual learning lessons"""
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    content = models.TextField()  # Rich content including code examples
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS)
    estimated_duration = models.IntegerField(help_text='Estimated duration in minutes')
    concepts = models.ManyToManyField(Concept, related_name='lessons')
    prerequisites = models.ManyToManyField('self', symmetrical=False, blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'lesson'
        ordering = ['title']

class Quiz(models.Model):
    """Adaptive quizzes for assessment"""
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    QUESTION_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('true_false', 'True/False'),
        ('code_completion', 'Code Completion'),
        ('essay', 'Essay'),
        ('code_output', 'Code Output Prediction'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    questions = models.JSONField()  # Dynamic questions structure
    concepts = models.ManyToManyField(Concept, related_name='quizzes')
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS)
    time_limit = models.IntegerField(null=True, blank=True, help_text='Time limit in minutes')
    is_adaptive = models.BooleanField(default=True)  # Questions adapt based on performance
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'quiz'
        ordering = ['title']

class LearningProgress(models.Model):
    """Track user learning progress and performance"""
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    progress_percentage = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)]
    )
    time_spent = models.IntegerField(default=0, help_text='Time spent in minutes')
    completed_at = models.DateTimeField(null=True, blank=True)
    quiz_score = models.FloatField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)]
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'learning_progress'
        unique_together = ['user', 'lesson']
        ordering = ['-updated_at']

class UserMastery(models.Model):
    """Track user's mastery levels across concepts"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mastery')
    concept = models.ForeignKey(Concept, on_delete=models.CASCADE, related_name='user_mastery')
    mastery_level = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    confidence_level = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    last_assessment = models.DateTimeField(default=timezone.now)
    assessment_history = models.JSONField(default=list)  # History of assessments
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_mastery'
        unique_together = ['user', 'concept']
        ordering = ['-updated_at']

class LearningSession(models.Model):
    """Track individual learning sessions"""
    SESSION_TYPES = [
        ('lesson', 'Lesson Study'),
        ('quiz', 'Quiz Taking'),
        ('practice', 'Practice Session'),
        ('review', 'Review Session'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_type = models.CharField(max_length=20, choices=SESSION_TYPES)
    content_id = models.UUIDField()  # ID of lesson or quiz
    content_title = models.CharField(max_length=200)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)
    interactions = models.JSONField(default=list)  # Track user interactions
    performance_data = models.JSONField(default=dict)  # Performance metrics
    
    class Meta:
        db_table = 'learning_session'
        ordering = ['-start_time']