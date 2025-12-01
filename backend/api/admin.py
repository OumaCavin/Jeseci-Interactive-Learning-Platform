"""Admin configuration for API models"""

from django.contrib import admin
from .models import (
    UserProfile, Lesson, Quiz, Concept, 
    LearningProgress, UserMastery, LearningSession
)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'learning_style', 'preferred_difficulty', 'created_at']
    list_filter = ['learning_style', 'preferred_difficulty', 'created_at']
    search_fields = ['user__username', 'user__email']

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'difficulty_level', 'estimated_duration', 'is_published', 'created_at']
    list_filter = ['difficulty_level', 'is_published', 'created_at']
    search_fields = ['title', 'description']
    filter_horizontal = ['concepts', 'prerequisites']

@admin.register(Concept)
class ConceptAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'difficulty_level', 'mastery_score', 'last_practiced']
    list_filter = ['category', 'difficulty_level']
    search_fields = ['name', 'description']
    filter_horizontal = ['related_concepts']

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'difficulty_level', 'time_limit', 'is_adaptive', 'created_at']
    list_filter = ['difficulty_level', 'is_adaptive', 'created_at']
    search_fields = ['title', 'description']
    filter_horizontal = ['concepts']

@admin.register(LearningProgress)
class LearningProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'status', 'progress_percentage', 'completed_at']
    list_filter = ['status', 'completed_at']
    search_fields = ['user__username', 'lesson__title']

@admin.register(UserMastery)
class UserMasteryAdmin(admin.ModelAdmin):
    list_display = ['user', 'concept', 'mastery_level', 'confidence_level', 'last_assessment']
    list_filter = ['last_assessment']
    search_fields = ['user__username', 'concept__name']

@admin.register(LearningSession)
class LearningSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'session_type', 'content_title', 'start_time', 'duration_minutes']
    list_filter = ['session_type', 'start_time']
    search_fields = ['user__username', 'content_title']