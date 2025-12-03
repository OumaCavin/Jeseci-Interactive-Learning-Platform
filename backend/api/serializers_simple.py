"""
Simple API Serializers for Authentication Testing
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile, Lesson, Quiz, Concept, LearningProgress

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'learning_style', 'preferred_difficulty', 'avatar_url']
        read_only_fields = ['id']


class LoginSerializer(serializers.Serializer):
    """Session-based login serializer"""
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        email = attrs.get('email')
        password = attrs.get('password')
        
        if not (username or email):
            raise serializers.ValidationError("Either username or email is required")
        
        if not password:
            raise serializers.ValidationError("Password is required")
        
        # Store the login field for authentication
        login_field = username or email
        attrs['login_field'] = login_field
        
        return attrs


class RegisterSerializer(serializers.ModelSerializer):
    """Session-based registration serializer"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, attrs):
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        
        if password != password_confirm:
            raise serializers.ValidationError("Passwords do not match")
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        return User.objects.create_user(**validated_data)


class UserProfileWithTokensSerializer(serializers.ModelSerializer):
    """Serializer for user profile with session info"""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'learning_style', 'preferred_difficulty', 'avatar_url']
        read_only_fields = ['id', 'username', 'email', 'first_name', 'last_name']


# Simplified serializers for other models (not fully implemented)
class LessonSerializer(serializers.ModelSerializer):
    """Simplified lesson serializer"""
    class Meta:
        model = Lesson
        fields = '__all__'


class QuizSerializer(serializers.ModelSerializer):
    """Simplified quiz serializer"""
    class Meta:
        model = Quiz
        fields = '__all__'


class ConceptSerializer(serializers.ModelSerializer):
    """Simplified concept serializer"""
    class Meta:
        model = Concept
        fields = '__all__'


class LearningProgressSerializer(serializers.ModelSerializer):
    """Simplified progress serializer"""
    class Meta:
        model = LearningProgress
        fields = '__all__'