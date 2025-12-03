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

class Achievement(models.Model):
    """Achievement definitions for the platform"""
    DIFFICULTY_LEVELS = [
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
    ]
    
    CATEGORIES = [
        ('learning', 'Learning'),
        ('coding', 'Coding'),
        ('streak', 'Streaks'),
        ('special', 'Special'),
        ('milestone', 'Milestones'),
    ]
    
    RARITIES = [
        ('common', 'Common'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, help_text='Icon name or class')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS)
    category = models.CharField(max_length=20, choices=CATEGORIES)
    rarity = models.CharField(max_length=20, choices=RARITIES, default='common')
    points = models.IntegerField(default=0)
    criteria_type = models.CharField(max_length=50)  # module_completion, points, streak, etc.
    criteria_value = models.IntegerField(help_text='Target value for achievement')
    criteria_operator = models.CharField(max_length=10, default='>=', help_text='Comparison operator')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'achievement'
        ordering = ['name']

class UserAchievement(models.Model):
    """Track user achievement progress and unlocks"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='user_achievements')
    progress = models.IntegerField(default=0, help_text='Current progress towards achievement')
    is_unlocked = models.BooleanField(default=False)
    unlocked_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_achievement'
        unique_together = ['user', 'achievement']
        ordering = ['-updated_at']

class Badge(models.Model):
    """Badge definitions"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50)
    color = models.CharField(max_length=20, default='blue')
    requirements = models.JSONField(default=dict, help_text='Requirements to earn badge')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'badge'
        ordering = ['name']

class UserBadge(models.Model):
    """Track user badges"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='user_badges')
    earned_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'user_badge'
        unique_together = ['user', 'badge']
        ordering = ['-earned_at']

class SystemLog(models.Model):
    """System activity and error logs"""
    LOG_TYPES = [
        ('user_registration', 'User Registration'),
        ('path_completion', 'Path Completion'),
        ('module_completion', 'Module Completion'),
        ('agent_action', 'Agent Action'),
        ('system_alert', 'System Alert'),
        ('login', 'User Login'),
        ('logout', 'User Logout'),
        ('quiz_completion', 'Quiz Completion'),
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    log_type = models.CharField(max_length=30, choices=LOG_TYPES)
    message = models.TextField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS, default='low')
    metadata = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'system_log'
        ordering = ['-timestamp']

class AIAgent(models.Model):
    """AI Agent definitions and status"""
    AGENT_TYPES = [
        ('motivator', 'Motivator'),
        ('progress_tracker', 'Progress Tracker'),
        ('content_curator', 'Content Curator'),
        ('evaluator', 'Evaluator'),
        ('quiz_master', 'Quiz Master'),
        ('orchestrator', 'Orchestrator'),
    ]
    
    STATUS_TYPES = [
        ('idle', 'Idle'),
        ('busy', 'Busy'),
        ('active', 'Active'),
        ('error', 'Error'),
        ('offline', 'Offline'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    agent_type = models.CharField(max_length=30, choices=AGENT_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_TYPES, default='offline')
    description = models.TextField()
    tasks = models.IntegerField(default=0)
    uptime = models.IntegerField(default=0, help_text='Uptime in seconds')
    performance = models.FloatField(default=0.0, help_text='Performance score 0-100')
    response_time = models.FloatField(default=0.0, help_text='Average response time in ms')
    last_active = models.DateTimeField(null=True, blank=True)
    health_score = models.FloatField(default=0.0, help_text='Health score 0-100')
    queue_size = models.IntegerField(default=0)
    capabilities = models.JSONField(default=list)
    config = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'ai_agent'
        ordering = ['name']

class SystemHealth(models.Model):
    """System health metrics"""
    OVERALL_STATUS = [
        ('healthy', 'Healthy'),
        ('degraded', 'Degraded'),
        ('unhealthy', 'Unhealthy'),
        ('offline', 'Offline'),
    ]
    
    overall_status = models.CharField(max_length=20, choices=OVERALL_STATUS)
    health_score = models.FloatField(default=0.0)
    active_sessions = models.IntegerField(default=0)
    cpu_usage = models.FloatField(default=0.0)
    memory_usage = models.FloatField(default=0.0)
    disk_usage = models.FloatField(default=0.0)
    network_latency = models.FloatField(default=0.0)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'system_health'
        ordering = ['-timestamp']