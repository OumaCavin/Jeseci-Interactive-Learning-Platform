"""
API Serializers for Jeseci Interactive Learning Platform

Serializers for converting complex data types to/from Python objects.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
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

class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            from django.contrib.auth import authenticate
            user = authenticate(username=username, password=password)
            
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            if not user.is_verified and hasattr(user, 'userprofile'):
                # If you have email verification
                raise serializers.ValidationError('Email not verified')
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include username and password')

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Password and password confirmation don't match.")
        
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError("Username already exists.")
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError("Email already exists.")
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileWithTokensSerializer(serializers.ModelSerializer):
    """Serializer for user profile with JWT tokens"""
    tokens = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'learning_style', 'preferred_difficulty', 'avatar_url', 'tokens']
        read_only_fields = ['id', 'username', 'email', 'tokens']
    
    def get_tokens(self, obj):
        """Generate JWT tokens for the user"""
        refresh = RefreshToken.for_user(obj.user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }