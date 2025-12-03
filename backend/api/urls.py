"""
API URLs Configuration - Session Authentication Version

Routes all API endpoints for the Jeseci Interactive Learning Platform.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'lessons', views.LessonViewSet)
router.register(r'quizzes', views.QuizViewSet)
router.register(r'concepts', views.ConceptViewSet)
router.register(r'progress', views.ProgressViewSet)

urlpatterns = [
    # Core Learning Platform Endpoints
    path('', include(router.urls)),
    
    # Authentication Endpoints
    path('auth/login/', views.LoginView.as_view(), name='auth_login'),
    path('auth/register/', views.RegisterView.as_view(), name='auth_register'),
    path('auth/logout/', views.LogoutView.as_view(), name='auth_logout'),
    path('auth/refresh/', views.RefreshTokenView.as_view(), name='auth_refresh'),
    path('auth/profile/', views.UserProfileView.as_view(), name='auth_profile'),
    
    # Multi-Agent System Integration Endpoints
    path('init_learning/', views.InitLearningView.as_view(), name='init_learning'),
    path('get_lesson/<int:lesson_id>/', views.GetLessonView.as_view(), name='get_lesson'),
    path('request_quiz/<str:topic>/', views.RequestQuizView.as_view(), name='request_quiz'),
    path('submit_answer/', views.SubmitAnswerView.as_view(), name='submit_answer'),
    path('skill_map/', views.SkillMapView.as_view(), name='skill_map'),
    
    # Jac Walkers Direct Access (for testing/debugging)
    path('jac/walker/init_user_graph/', views.JacWalkerView.as_view(), {'walker_name': 'init_user_graph'}, name='jac_walker_init'),
    path('jac/walker/start_lesson/', views.JacWalkerView.as_view(), {'walker_name': 'start_lesson'}, name='jac_walker_start_lesson'),
    path('jac/walker/generate_quiz/', views.JacWalkerView.as_view(), {'walker_name': 'generate_quiz'}, name='jac_walker_generate_quiz'),
    path('jac/walker/evaluate_answer/', views.JacWalkerView.as_view(), {'walker_name': 'evaluate_answer'}, name='jac_walker_evaluate'),
    path('jac/walker/suggest_next_step/', views.JacWalkerView.as_view(), {'walker_name': 'suggest_next_step'}, name='jac_walker_suggest'),
    
    # System Health and Monitoring
    path('health/', views.HealthCheckView.as_view(), name='health_check'),
    path('stats/', views.SystemStatsView.as_view(), name='system_stats'),
]