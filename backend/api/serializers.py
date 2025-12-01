"""
API Serializers for Jeseci Interactive Learning Platform

Serializers for converting complex data types to/from Python objects.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Lesson, Quiz, Concept, LearningProgress

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'learning_style', 'preferred_difficulty', 'avatar_url']
        read_only_fields = ['id']

class LessonSerializer(serializers.ModelSerializer):
    """Serializer for Lesson model"""
    concepts = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'description', 'content', 'difficulty_level',
            'estimated_duration', 'concepts', 'prerequisites', 'is_published',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class ConceptSerializer(serializers.ModelSerializer):
    """Serializer for Concept model"""
    related_concepts = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Concept
        fields = [
            'id', 'name', 'description', 'category', 'difficulty_level',
            'related_concepts', 'mastery_score', 'last_practiced',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'mastery_score', 'last_practiced', 'created_at', 'updated_at']

class QuizSerializer(serializers.ModelSerializer):
    """Serializer for Quiz model"""
    concepts = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description', 'questions', 'concepts',
            'difficulty_level', 'time_limit', 'is_adaptive',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class LearningProgressSerializer(serializers.ModelSerializer):
    """Serializer for LearningProgress model"""
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    
    class Meta:
        model = LearningProgress
        fields = [
            'id', 'user', 'lesson', 'lesson_title', 'status',
            'progress_percentage', 'time_spent', 'completed_at',
            'quiz_score', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']