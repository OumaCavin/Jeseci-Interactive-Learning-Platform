"""
Simple API Views for Authentication Testing
"""
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from rest_framework import status, permissions, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserProfile
from .serializers import LoginSerializer, RegisterSerializer

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