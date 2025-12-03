"""
Comprehensive API Serializers for Jeseci Interactive Learning Platform
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from datetime import timedelta
from .models import UserProfile, Lesson, Quiz, Concept, LearningProgress, LearningSession, UserMastery, Achievement, UserAchievement, Badge, UserBadge, SystemLog, AIAgent, SystemHealth

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
    password_confirm = serializers.CharField(write_only=True, required=True)
    
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


# Password Reset Serializers
class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request"""
    email = serializers.EmailField(required=True)
    
    def validate_email(self, value):
        # Check if user exists with this email
        if not User.objects.filter(email=value).exists():
            # Don't reveal whether email exists or not for security
            return value
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation"""
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True, required=True)
    
    def validate(self, attrs):
        password = attrs.get('new_password')
        password_confirm = attrs.get('new_password_confirm')
        
        if password != password_confirm:
            raise serializers.ValidationError("Passwords do not match")
        
        return attrs


# Admin API Serializers
class AdminStatsSerializer(serializers.Serializer):
    """Serializer for admin dashboard statistics"""
    totalUsers = serializers.IntegerField()
    totalPaths = serializers.IntegerField()
    totalModules = serializers.IntegerField()
    totalLessons = serializers.IntegerField()
    activeUsers = serializers.IntegerField()
    completionRate = serializers.FloatField()
    totalSessions = serializers.IntegerField()
    avgStudyTime = serializers.FloatField()
    systemHealth = serializers.FloatField()
    activeAgents = serializers.IntegerField()
    totalAgents = serializers.IntegerField()
    agentTasks = serializers.IntegerField()
    responseTime = serializers.FloatField()


class RecentActivitySerializer(serializers.Serializer):
    """Serializer for recent activity logs"""
    id = serializers.CharField()
    type = serializers.ChoiceField(choices=[
        'user_registration', 'path_completion', 'module_completion', 
        'agent_action', 'system_alert', 'login', 'logout', 'quiz_completion'
    ])
    message = serializers.CharField()
    timestamp = serializers.DateTimeField()
    user = serializers.CharField(allow_null=True, required=False)
    severity = serializers.ChoiceField(choices=['low', 'medium', 'high', 'critical'], required=False)
    metadata = serializers.DictField(required=False)


class AgentSerializer(serializers.ModelSerializer):
    """Serializer for AI agents"""
    class Meta:
        model = AIAgent
        fields = [
            'id', 'name', 'agent_type', 'status', 'description', 'tasks', 
            'uptime', 'performance', 'response_time', 'last_active', 
            'health_score', 'queue_size', 'capabilities', 'config'
        ]


class SystemHealthSerializer(serializers.Serializer):
    """Serializer for system health metrics"""
    overall_status = serializers.ChoiceField(choices=['healthy', 'degraded', 'unhealthy', 'offline'])
    health_score = serializers.FloatField()
    active_sessions = serializers.IntegerField()
    system_metrics = serializers.SerializerMethodField()
    agents = serializers.SerializerMethodField()
    
    def get_system_metrics(self, obj):
        return {
            'cpu_usage': obj.cpu_usage,
            'memory_usage': obj.memory_usage,
            'disk_usage': obj.disk_usage,
            'network_latency': obj.network_latency
        }
    
    def get_agents(self, obj):
        # Return current agent statuses
        agents = AIAgent.objects.filter(is_active=True)
        return {
            agent.id: {
                'status': agent.status,
                'last_active': agent.last_active.isoformat() if agent.last_active else None,
                'queue_size': agent.queue_size,
                'uptime_hours': agent.uptime // 3600 if agent.uptime else 0,
                'health_score': agent.health_score
            }
            for agent in agents
        }


class UserManagementSerializer(serializers.Serializer):
    """Serializer for user management data"""
    id = serializers.CharField()
    username = serializers.CharField()
    email = serializers.EmailField()
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    role = serializers.ChoiceField(choices=['student', 'instructor', 'admin', 'moderator'])
    status = serializers.ChoiceField(choices=['active', 'inactive', 'suspended'])
    lastActive = serializers.SerializerMethodField()
    totalPoints = serializers.IntegerField()
    level = serializers.IntegerField()
    completedPaths = serializers.SerializerMethodField()
    studyTime = serializers.IntegerField()
    joinDate = serializers.DateTimeField(source='date_joined')
    
    def get_lastActive(self, obj):
        # Get last activity from UserProfile or LearningSession
        profile = getattr(obj, 'profile', None)
        if profile and profile.updated_at:
            return profile.updated_at.isoformat()
        
        last_session = LearningSession.objects.filter(user=obj).order_by('-start_time').first()
        return last_session.start_time.isoformat() if last_session else obj.date_joined.isoformat()
    
    def get_completedPaths(self, obj):
        # Count completed learning paths (simplified)
        return LearningProgress.objects.filter(
            user=obj, 
            status='completed',
            progress_percentage=100.0
        ).count()


class ContentManagementSerializer(serializers.Serializer):
    """Serializer for content management"""
    id = serializers.CharField()
    title = serializers.CharField()
    type = serializers.ChoiceField(choices=['learning_path', 'module', 'lesson', 'assessment'])
    status = serializers.ChoiceField(choices=['draft', 'published', 'archived'])
    modules = serializers.IntegerField()
    completionRate = serializers.FloatField()
    learners = serializers.IntegerField()
    avgScore = serializers.FloatField()
    lastUpdated = serializers.DateTimeField(source='updated_at')
    createdBy = serializers.CharField(source='created_by.username')
    difficulty = serializers.ChoiceField(choices=['beginner', 'intermediate', 'advanced'])
    tags = serializers.ListField(child=serializers.CharField())


class LearningAnalyticsSerializer(serializers.Serializer):
    """Serializer for learning analytics"""
    pathId = serializers.CharField()
    pathName = serializers.CharField()
    totalEnrollments = serializers.IntegerField()
    completions = serializers.IntegerField()
    avgCompletionTime = serializers.FloatField()
    avgScore = serializers.FloatField()
    dropOffPoints = serializers.ListField(child=serializers.DictField())
    performanceByDifficulty = serializers.DictField()
    monthlyProgress = serializers.ListField(child=serializers.DictField())


# Learning API Serializers
class AchievementSerializer(serializers.ModelSerializer):
    """Serializer for achievements"""
    class Meta:
        model = Achievement
        fields = [
            'id', 'name', 'description', 'icon', 'difficulty', 'category', 
            'rarity', 'points', 'criteria_type', 'criteria_value', 
            'criteria_operator', 'is_active'
        ]


class UserAchievementSerializer(serializers.ModelSerializer):
    """Serializer for user achievements with progress"""
    achievement = AchievementSerializer(read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = [
            'id', 'achievement', 'progress', 'is_unlocked', 
            'unlocked_at', 'created_at', 'updated_at'
        ]


class BadgeSerializer(serializers.ModelSerializer):
    """Serializer for badges"""
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'icon', 'color', 'requirements', 'is_active']


class UserBadgeSerializer(serializers.ModelSerializer):
    """Serializer for user badges"""
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'earned_at', 'metadata']


class ModuleContentSerializer(serializers.Serializer):
    """Serializer for module content"""
    id = serializers.CharField()
    title = serializers.CharField()
    type = serializers.CharField()
    content = serializers.DictField()


# User creation and management serializers
class AdminUserCreateSerializer(serializers.ModelSerializer):
    """Serializer for admin user creation"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
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
        user = User.objects.create_user(**validated_data)
        
        # Create user profile
        UserProfile.objects.get_or_create(user=user)
        
        return user


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for admin user updates"""
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'is_active']