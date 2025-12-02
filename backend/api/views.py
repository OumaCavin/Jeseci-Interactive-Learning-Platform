"""
API Views for Jeseci Interactive Learning Platform

Views that orchestrate the Multi-Agent System through Jac walkers.
"""
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserProfile, Lesson, Quiz, Concept, LearningProgress
from .serializers import (
    UserProfileSerializer, LessonSerializer, QuizSerializer,
    ConceptSerializer, LearningProgressSerializer
)
from jac_layer.jac_manager import JacManager

logger = logging.getLogger(__name__)

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User management"""
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

class LessonViewSet(viewsets.ModelViewSet):
    """ViewSet for Lesson management"""
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

class QuizViewSet(viewsets.ModelViewSet):
    """ViewSet for Quiz management"""
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

class ConceptViewSet(viewsets.ModelViewSet):
    """ViewSet for Concept management"""
    queryset = Concept.objects.all()
    serializer_class = ConceptSerializer
    permission_classes = [IsAuthenticated]

class ProgressViewSet(viewsets.ModelViewSet):
    """ViewSet for Learning Progress management"""
    queryset = LearningProgress.objects.all()
    serializer_class = LearningProgressSerializer
    permission_classes = [IsAuthenticated]

class InitLearningView(APIView):
    """
    Initialize learning session using SystemOrchestrator
    Triggers init_user_graph walker
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            jac_manager = JacManager()
            
            # Initialize user graph through SystemOrchestrator
            result = jac_manager.execute_walker(
                walker_name='init_user_graph',
                parameters={'user_id': request.user.id}
            )
            
            logger.info(f"Initialized learning session for user {request.user.id}")
            
            return Response({
                'status': 'success',
                'message': 'Learning session initialized successfully',
                'data': result
            })
            
        except Exception as e:
            logger.error(f"Error initializing learning session: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetLessonView(APIView):
    """
    Get lesson content using ContentCurator
    Triggers start_lesson walker
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, lesson_id):
        try:
            jac_manager = JacManager()
            
            # Get lesson through ContentCurator
            result = jac_manager.execute_walker(
                walker_name='start_lesson',
                parameters={
                    'user_id': request.user.id,
                    'lesson_id': lesson_id
                }
            )
            
            logger.info(f"Retrieved lesson {lesson_id} for user {request.user.id}")
            
            return Response({
                'status': 'success',
                'data': result
            })
            
        except Exception as e:
            logger.error(f"Error retrieving lesson {lesson_id}: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RequestQuizView(APIView):
    """
    Generate adaptive quiz using QuizMaster
    Triggers generate_quiz walker with byLLM
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, topic):
        try:
            jac_manager = JacManager()
            
            # Generate quiz through QuizMaster
            result = jac_manager.execute_walker(
                walker_name='generate_quiz',
                parameters={
                    'user_id': request.user.id,
                    'topic': topic
                }
            )
            
            logger.info(f"Generated quiz for topic '{topic}' for user {request.user.id}")
            
            return Response({
                'status': 'success',
                'data': result
            })
            
        except Exception as e:
            logger.error(f"Error generating quiz for topic '{topic}': {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SubmitAnswerView(APIView):
    """
    Submit answer for evaluation using Evaluator
    Triggers evaluate_answer walker with byLLM
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            quiz_id = request.data.get('quiz_id')
            user_answer = request.data.get('answer')
            
            if not quiz_id or not user_answer:
                return Response({
                    'status': 'error',
                    'message': 'Quiz ID and answer are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            jac_manager = JacManager()
            
            # Evaluate answer through Evaluator
            result = jac_manager.execute_walker(
                walker_name='evaluate_answer',
                parameters={
                    'user_id': request.user.id,
                    'quiz_id': quiz_id,
                    'answer': user_answer
                }
            )
            
            logger.info(f"Evaluated answer for quiz {quiz_id} from user {request.user.id}")
            
            return Response({
                'status': 'success',
                'data': result
            })
            
        except Exception as e:
            logger.error(f"Error evaluating answer: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SkillMapView(APIView):
    """
    Get skill map visualization using ProgressTracker
    Triggers skill_map_data walker
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            jac_manager = JacManager()
            
            # Get skill map through ProgressTracker
            result = jac_manager.execute_walker(
                walker_name='get_skill_map',
                parameters={'user_id': request.user.id}
            )
            
            logger.info(f"Retrieved skill map for user {request.user.id}")
            
            return Response({
                'status': 'success',
                'data': result
            })
            
        except Exception as e:
            logger.error(f"Error retrieving skill map: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class JacWalkerView(APIView):
    """
    Direct access to Jac walkers for testing and debugging
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, walker_name):
        try:
            jac_manager = JacManager()
            
            result = jac_manager.execute_walker(
                walker_name=walker_name,
                parameters=request.data
            )
            
            logger.info(f"Executed Jac walker '{walker_name}' for user {request.user.id}")
            
            return Response({
                'status': 'success',
                'data': result
            })
            
        except Exception as e:
            logger.error(f"Error executing Jac walker '{walker_name}': {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HealthCheckView(APIView):
    """
    System health check endpoint
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            # Check Jac layer
            jac_manager = JacManager()
            jac_healthy = jac_manager.health_check()
            
            # Check database connection
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                db_healthy = True
            
            # Check Redis connection
            import redis
            r = redis.Redis.from_url('redis://localhost:6379/0')
            r.ping()
            redis_healthy = True
            
            return Response({
                'status': 'healthy',
                'checks': {
                    'jac_layer': 'healthy' if jac_healthy else 'unhealthy',
                    'database': 'healthy' if db_healthy else 'unhealthy',
                    'redis': 'healthy' if redis_healthy else 'unhealthy'
                },
                'timestamp': '2025-12-02T03:08:23Z'
            })
            
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return Response({
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': '2025-12-02T03:08:23Z'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

class SystemStatsView(APIView):
    """
    System statistics and monitoring endpoint
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            jac_manager = JacManager()
            
            # Get basic statistics
            stats = {
                'active_users': User.objects.filter(is_active=True).count(),
                'total_lessons': Lesson.objects.count(),
                'total_concepts': Concept.objects.count(),
                'total_quizzes': Quiz.objects.count(),
                'completed_sessions': LearningProgress.objects.filter(completed=True).count(),
                'jac_walkers': jac_manager.get_available_walkers(),
                'system_uptime': 'operational',
                'last_updated': '2025-12-02T03:08:23Z'
            }
            
            return Response({
                'status': 'success',
                'data': stats
            })
            
        except Exception as e:
            logger.error(f"Error retrieving system stats: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)