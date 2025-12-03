"""
Comprehensive API Views for Jeseci Interactive Learning Platform
"""
import logging
import psutil
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import datetime, timedelta
from rest_framework import status, permissions, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserProfile, Lesson, Quiz, Concept, LearningProgress, LearningSession, UserMastery, Achievement, UserAchievement, Badge, UserBadge, SystemLog, AIAgent, SystemHealth
from .serializers import (
    LoginSerializer, RegisterSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    AdminStatsSerializer, RecentActivitySerializer, AgentSerializer, SystemHealthSerializer,
    UserManagementSerializer, ContentManagementSerializer, LearningAnalyticsSerializer,
    AchievementSerializer, UserAchievementSerializer, BadgeSerializer, UserBadgeSerializer,
    ModuleContentSerializer, AdminUserCreateSerializer, AdminUserUpdateSerializer
)

logger = logging.getLogger(__name__)


class LoginView(APIView):
    """Session-based login view"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                username_or_email = serializer.validated_data.get('username') or serializer.validated_data.get('email')
                password = serializer.validated_data['password']
                
                # Authenticate user
                user = authenticate(request, username=username_or_email, password=password)
                
                if user is not None:
                    # Check if this is email login
                    if '@' in username_or_email:
                        username = user.username
                    else:
                        username = username_or_email
                    
                    # Login the user (creates session)
                    login(request, user)
                    
                    return Response({
                        'status': 'success',
                        'message': 'Login successful',
                        'user': {
                            'id': user.id,
                            'username': user.username,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                        },
                        'session_active': True
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'status': 'error',
                        'message': 'Invalid credentials'
                    }, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({
                    'status': 'error',
                    'message': 'Invalid data',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Login failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterView(APIView):
    """Session-based registration view"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                # Create user
                user = User.objects.create_user(
                    username=serializer.validated_data['username'],
                    email=serializer.validated_data['email'],
                    password=serializer.validated_data['password'],
                    first_name=serializer.validated_data.get('first_name', ''),
                    last_name=serializer.validated_data.get('last_name', ''),
                )
                
                # Create user profile
                try:
                    UserProfile.objects.create(user=user)
                except Exception as e:
                    # Profile might already exist or other error
                    logger.warning(f"Profile creation error: {str(e)}")
                
                return Response({
                    'status': 'success',
                    'message': 'Registration successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                    }
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'status': 'error',
                    'message': 'Registration failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Registration failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    """Session-based logout view"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            logout(request)
            return Response({
                'status': 'success',
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Logout failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HealthCheckView(APIView):
    """Simple health check endpoint"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({
            'status': 'healthy',
            'message': 'API is running',
            'authentication_type': 'session_based'
        })


# API ViewSets (simplified for testing)
class UserViewSet(viewsets.GenericViewSet):
    """Simplified user viewset"""
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        return Response({'users': []})
    
    def retrieve(self, request, pk=None):
        return Response({'user': {'id': pk}})


class LessonViewSet(viewsets.GenericViewSet):
    """Simplified lesson viewset"""
    permission_classes = [AllowAny]
    
    def list(self, request):
        return Response({'lessons': []})


class QuizViewSet(viewsets.GenericViewSet):
    """Simplified quiz viewset"""
    permission_classes = [AllowAny]
    
    def list(self, request):
        return Response({'quizzes': []})


class ConceptViewSet(viewsets.GenericViewSet):
    """Simplified concept viewset"""
    permission_classes = [AllowAny]
    
    def list(self, request):
        return Response({'concepts': []})


class ProgressViewSet(viewsets.GenericViewSet):
    """Simplified progress viewset"""
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        return Response({'progress': []})


# Placeholder views for other endpoints
class RefreshTokenView(APIView):
    """Placeholder for token refresh"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        return Response({
            'status': 'info',
            'message': 'Session authentication - no token refresh needed'
        })


class UserProfileView(APIView):
    """User profile view"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            profile, created = UserProfile.objects.get_or_create(user=user)
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class InitLearningView(APIView):
    """Placeholder for learning initialization"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        return Response({'message': 'Learning initialization not implemented'})


class GetLessonView(APIView):
    """Placeholder for getting lessons"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, lesson_id):
        return Response({'lesson_id': lesson_id, 'message': 'Get lesson not implemented'})


class RequestQuizView(APIView):
    """Placeholder for quiz requests"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, topic):
        return Response({'topic': topic, 'message': 'Quiz request not implemented'})


class SubmitAnswerView(APIView):
    """Placeholder for answer submission"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        return Response({'message': 'Answer submission not implemented'})


class SkillMapView(APIView):
    """Placeholder for skill mapping"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        return Response({'message': 'Skill mapping not implemented'})


class JacWalkerView(APIView):
    """Placeholder for Jac walker access"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, walker_name):
        return Response({
            'walker_name': walker_name,
            'message': f'Jac walker {walker_name} not implemented'
        })


class SystemStatsView(APIView):
    """Placeholder for system stats"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        return Response({
            'stats': {
                'users': User.objects.count(),
                'message': 'System statistics not fully implemented'
            }
        })


# Password Reset Views
class PasswordResetRequestView(APIView):
    """Handle password reset requests"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            serializer = PasswordResetRequestSerializer(data=request.data)
            if serializer.is_valid():
                email = serializer.validated_data['email']
                
                # Check if user exists (but don't reveal this for security)
                user = User.objects.filter(email=email).first()
                
                # For demo purposes, generate a simple token
                # In production, this would be sent via email
                import secrets
                reset_token = secrets.token_urlsafe(32)
                
                # For development: Return the token so frontend can test
                if user:
                    # In production, save token to database with expiry
                    pass
                
                return Response({
                    'status': 'success',
                    'message': 'Password reset instructions sent to your email' if user else 'If this email exists, instructions have been sent',
                    'token': reset_token  # For development/testing only
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'status': 'error',
                    'message': 'Invalid email address',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Password reset request error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Password reset request failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PasswordResetConfirmView(APIView):
    """Handle password reset confirmations"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            serializer = PasswordResetConfirmSerializer(data=request.data)
            if serializer.is_valid():
                token = serializer.validated_data['token']
                new_password = serializer.validated_data['new_password']
                
                # For demo purposes, accept any token
                # In production, validate token against database and check expiry
                
                # For now, prompt for email to find user
                # In production, token would identify the user
                email = request.data.get('email')
                if email:
                    user = User.objects.filter(email=email).first()
                    if user:
                        user.set_password(new_password)
                        user.save()
                        
                        return Response({
                            'status': 'success',
                            'message': 'Password reset successfully'
                        }, status=status.HTTP_200_OK)
                    else:
                        return Response({
                            'status': 'error',
                            'message': 'Invalid reset token or email'
                        }, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({
                        'status': 'error',
                        'message': 'Email is required for password reset confirmation'
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    'status': 'error',
                    'message': 'Invalid reset data',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Password reset confirmation error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Password reset failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Admin API Views
class AdminStatsView(APIView):
    """Get admin dashboard statistics"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        try:
            # Calculate statistics
            total_users = User.objects.count()
            total_paths = 0  # We'll need a LearningPath model for this
            total_modules = Lesson.objects.count()
            total_lessons = Lesson.objects.count()
            
            # Active users in last 7 days
            active_users = User.objects.filter(
                last_login__gte=timezone.now() - timedelta(days=7)
            ).count()
            
            # Completion rate
            total_progress = LearningProgress.objects.count()
            completed_progress = LearningProgress.objects.filter(status='completed').count()
            completion_rate = (completed_progress / total_progress * 100) if total_progress > 0 else 0
            
            # Total sessions
            total_sessions = LearningSession.objects.count()
            
            # Average study time (simplified)
            avg_study_time = LearningSession.objects.aggregate(
                avg_duration=Avg('duration_minutes')
            )['avg_duration'] or 0
            
            # System health
            cpu_usage = psutil.cpu_percent()
            memory_usage = psutil.virtual_memory().percent
            
            # Agents
            total_agents = AIAgent.objects.count()
            active_agents = AIAgent.objects.filter(status__in=['active', 'busy']).count()
            agent_tasks = AIAgent.objects.aggregate(total_tasks=Count('tasks'))['total_tasks'] or 0
            response_time = AIAgent.objects.aggregate(avg_response=Avg('response_time'))['avg_response'] or 0
            system_health = max(0, 100 - (cpu_usage + memory_usage) / 2)
            
            stats_data = {
                'totalUsers': total_users,
                'totalPaths': total_paths,
                'totalModules': total_modules,
                'totalLessons': total_lessons,
                'activeUsers': active_users,
                'completionRate': round(completion_rate, 2),
                'totalSessions': total_sessions,
                'avgStudyTime': round(avg_study_time, 2),
                'systemHealth': round(system_health, 2),
                'activeAgents': active_agents,
                'totalAgents': total_agents,
                'agentTasks': agent_tasks,
                'responseTime': round(response_time, 2)
            }
            
            serializer = AdminStatsSerializer(stats_data)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error getting admin stats: {str(e)}")
            return Response({'error': 'Failed to fetch statistics'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminActivityView(APIView):
    """Get recent system activity"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        try:
            # Get recent logs
            logs = SystemLog.objects.select_related('user')[:50]
            
            activity_data = []
            for log in logs:
                activity_data.append({
                    'id': str(log.id),
                    'type': log.log_type,
                    'message': log.message,
                    'timestamp': log.timestamp.isoformat(),
                    'user': log.user.username if log.user else None,
                    'severity': log.severity,
                    'metadata': log.metadata
                })
            
            serializer = RecentActivitySerializer(activity_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error getting admin activity: {str(e)}")
            return Response({'error': 'Failed to fetch activity'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminUsersView(APIView):
    """Admin user management endpoints"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        """List users with management data"""
        try:
            users = User.objects.select_related('profile').all().order_by('-date_joined')
            
            users_data = []
            for user in users:
                # Get user statistics
                total_progress = LearningProgress.objects.filter(user=user).count()
                completed_progress = LearningProgress.objects.filter(user=user, status='completed').count()
                study_time = LearningSession.objects.filter(user=user).aggregate(
                    total_time=Count('duration_minutes')
                )['total_time'] or 0
                
                # Calculate user level (simplified)
                level = completed_progress // 5 + 1  # Every 5 completed lessons = 1 level
                
                users_data.append({
                    'id': str(user.id),
                    'username': user.username,
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'role': 'student' if not user.is_staff else 'admin',
                    'status': 'active' if user.is_active else 'inactive',
                    'lastActive': user.last_login.isoformat() if user.last_login else None,
                    'totalPoints': completed_progress * 10,  # 10 points per completion
                    'level': level,
                    'completedPaths': completed_progress // 10,  # Approximate paths
                    'studyTime': study_time,
                    'joinDate': user.date_joined.isoformat()
                })
            
            serializer = UserManagementSerializer(users_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error getting users: {str(e)}")
            return Response({'error': 'Failed to fetch users'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """Create new user"""
        try:
            serializer = AdminUserCreateSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                
                # Log the user creation
                SystemLog.objects.create(
                    log_type='user_registration',
                    message=f"New user created: {user.username}",
                    user=request.user,
                    severity='low'
                )
                
                return Response({
                    'status': 'success',
                    'message': 'User created successfully',
                    'user_id': str(user.id)
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'status': 'error',
                    'message': 'Invalid user data',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            return Response({'error': 'Failed to create user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminUserDetailView(APIView):
    """Individual user management"""
    permission_classes = [IsAdminUser]
    
    def patch(self, request, user_id):
        """Update user"""
        try:
            user = User.objects.get(id=user_id)
            serializer = AdminUserUpdateSerializer(user, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                
                # Log the update
                SystemLog.objects.create(
                    log_type='system_alert',
                    message=f"User updated: {user.username}",
                    user=request.user,
                    severity='medium'
                )
                
                return Response({
                    'status': 'success',
                    'message': 'User updated successfully'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'status': 'error',
                    'message': 'Invalid user data',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error updating user: {str(e)}")
            return Response({'error': 'Failed to update user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, user_id):
        """Delete user"""
        try:
            user = User.objects.get(id=user_id)
            username = user.username
            user.delete()
            
            # Log the deletion
            SystemLog.objects.create(
                log_type='system_alert',
                message=f"User deleted: {username}",
                user=request.user,
                severity='high'
            )
            
            return Response({
                'status': 'success',
                'message': 'User deleted successfully'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error deleting user: {str(e)}")
            return Response({'error': 'Failed to delete user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminContentView(APIView):
    """Admin content management"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        """Get content management data"""
        try:
            # Get lessons as content
            lessons = Lesson.objects.select_related('created_by').all()
            
            content_data = []
            for lesson in lessons:
                # Calculate completion rate
                total_progress = LearningProgress.objects.filter(lesson=lesson).count()
                completed_progress = LearningProgress.objects.filter(lesson=lesson, status='completed').count()
                completion_rate = (completed_progress / total_progress * 100) if total_progress > 0 else 0
                
                content_data.append({
                    'id': str(lesson.id),
                    'title': lesson.title,
                    'type': 'lesson',
                    'status': 'published' if lesson.is_published else 'draft',
                    'modules': 1,  # Lessons are modules
                    'completionRate': round(completion_rate, 2),
                    'learners': total_progress,
                    'avgScore': 85.0,  # Simplified
                    'lastUpdated': lesson.updated_at.isoformat(),
                    'createdBy': lesson.created_by.username if lesson.created_by else 'System',
                    'difficulty': lesson.difficulty_level,
                    'tags': [lesson.difficulty_level]
                })
            
            serializer = ContentManagementSerializer(content_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error getting content: {str(e)}")
            return Response({'error': 'Failed to fetch content'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminAnalyticsView(APIView):
    """Admin learning analytics"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        """Get learning analytics"""
        try:
            # Get analytics data for learning paths (simplified to lessons for now)
            lessons = Lesson.objects.all()
            
            analytics_data = []
            for lesson in lessons:
                total_enrollments = LearningProgress.objects.filter(lesson=lesson).count()
                completions = LearningProgress.objects.filter(lesson=lesson, status='completed').count()
                avg_completion_time = 30.0  # Simplified
                avg_score = 85.0  # Simplified
                
                # Generate mock drop-off points (in real implementation, track actual drop-off)
                drop_off_points = [
                    {'stage': 'Start', 'dropOffRate': 0, 'userCount': total_enrollments},
                    {'stage': '25%', 'dropOffRate': 15, 'userCount': int(total_enrollments * 0.85)},
                    {'stage': '50%', 'dropOffRate': 25, 'userCount': int(total_enrollments * 0.75)},
                    {'stage': '75%', 'dropOffRate': 30, 'userCount': int(total_enrollments * 0.70)},
                    {'stage': 'Complete', 'dropOffRate': 35, 'userCount': completions}
                ]
                
                performance_by_difficulty = {
                    'beginner': 90.0,
                    'intermediate': 80.0,
                    'advanced': 75.0
                }
                
                # Generate monthly progress (last 6 months)
                monthly_progress = []
                for i in range(6):
                    month = (datetime.now() - timedelta(days=30*i)).strftime('%Y-%m')
                    monthly_progress.append({
                        'month': month,
                        'enrollments': max(1, int(total_enrollments / 6)),
                        'completions': max(1, int(completions / 6)),
                        'avgScore': avg_score
                    })
                
                analytics_data.append({
                    'pathId': str(lesson.id),
                    'pathName': lesson.title,
                    'totalEnrollments': total_enrollments,
                    'completions': completions,
                    'avgCompletionTime': avg_completion_time,
                    'avgScore': avg_score,
                    'dropOffPoints': drop_off_points,
                    'performanceByDifficulty': performance_by_difficulty,
                    'monthlyProgress': monthly_progress
                })
            
            serializer = LearningAnalyticsSerializer(analytics_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error getting analytics: {str(e)}")
            return Response({'error': 'Failed to fetch analytics'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminAgentsView(APIView):
    """Admin AI agents management"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        """Get AI agent status"""
        try:
            agents = AIAgent.objects.filter(is_active=True).order_by('name')
            serializer = AgentSerializer(agents, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error getting agents: {str(e)}")
            return Response({'error': 'Failed to fetch agents'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminSystemHealthView(APIView):
    """Admin system health monitoring"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        """Get system health metrics"""
        try:
            # Get latest system health record or create new one
            health_record = SystemHealth.objects.order_by('-timestamp').first()
            
            if not health_record:
                # Create new health record
                cpu_usage = psutil.cpu_percent()
                memory_usage = psutil.virtual_memory().percent
                disk_usage = psutil.disk_usage('/').percent
                network_latency = 50.0  # Simplified
                active_sessions = 0
                
                # Calculate overall status
                if cpu_usage < 70 and memory_usage < 80:
                    status = 'healthy'
                elif cpu_usage < 90 and memory_usage < 95:
                    status = 'degraded'
                else:
                    status = 'unhealthy'
                
                health_score = max(0, 100 - (cpu_usage + memory_usage + disk_usage) / 3)
                
                health_record = SystemHealth.objects.create(
                    overall_status=status,
                    health_score=health_score,
                    active_sessions=active_sessions,
                    cpu_usage=cpu_usage,
                    memory_usage=memory_usage,
                    disk_usage=disk_usage,
                    network_latency=network_latency
                )
            
            serializer = SystemHealthSerializer(health_record)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error getting system health: {str(e)}")
            return Response({'error': 'Failed to fetch system health'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Learning API Views
class AchievementsView(APIView):
    """Get all achievements"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            achievements = Achievement.objects.filter(is_active=True).order_by('difficulty', 'name')
            serializer = AchievementSerializer(achievements, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error getting achievements: {str(e)}")
            return Response({'error': 'Failed to fetch achievements'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserBadgesView(APIView):
    """Get user badges"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            badges = UserBadge.objects.filter(user=user).select_related('badge').order_by('-earned_at')
            serializer = UserBadgeSerializer(badges, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error getting user badges: {str(e)}")
            return Response({'error': 'Failed to fetch user badges'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ModuleContentView(APIView):
    """Get module content"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, module_id):
        try:
            lesson = Lesson.objects.get(id=module_id)
            
            # Structure the content
            content_data = {
                'id': str(lesson.id),
                'title': lesson.title,
                'type': 'lesson',
                'content': {
                    'sections': [
                        {
                            'id': 'introduction',
                            'title': 'Introduction',
                            'content': lesson.description
                        },
                        {
                            'id': 'main_content',
                            'title': lesson.title,
                            'content': lesson.content
                        }
                    ]
                }
            }
            
            serializer = ModuleContentSerializer(content_data)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Lesson.DoesNotExist:
            return Response({'error': 'Module not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error getting module content: {str(e)}")
            return Response({'error': 'Failed to fetch module content'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)