"""
API URLs Configuration - Complete Implementation

Routes all API endpoints for the Jeseci Interactive Learning Platform.
"""
from django.urls import path
from . import views

urlpatterns = [
    # Authentication Endpoints
    path('auth/login/', views.LoginView.as_view(), name='auth_login'),
    path('auth/register/', views.RegisterView.as_view(), name='auth_register'),
    path('auth/logout/', views.LogoutView.as_view(), name='auth_logout'),
    
    # Password Reset Endpoints
    path('auth/password-reset/', views.PasswordResetRequestView.as_view(), name='auth_password_reset'),
    path('auth/password-reset-confirm/', views.PasswordResetConfirmView.as_view(), name='auth_password_reset_confirm'),
    
    # Admin API Endpoints
    path('admin/stats/', views.AdminStatsView.as_view(), name='admin_stats'),
    path('admin/activity/', views.AdminActivityView.as_view(), name='admin_activity'),
    path('admin/users/', views.AdminUsersView.as_view(), name='admin_users'),
    path('admin/users/<uuid:user_id>/', views.AdminUserDetailView.as_view(), name='admin_user_detail'),
    path('admin/content/', views.AdminContentView.as_view(), name='admin_content'),
    path('admin/analytics/', views.AdminAnalyticsView.as_view(), name='admin_analytics'),
    path('admin/agents/', views.AdminAgentsView.as_view(), name='admin_agents'),
    path('admin/system-health/', views.AdminSystemHealthView.as_view(), name='admin_system_health'),
    
    # Learning API Endpoints
    path('api/achievements/', views.AchievementsView.as_view(), name='achievements'),
    path('api/user/<uuid:user_id>/badges/', views.UserBadgesView.as_view(), name='user_badges'),
    path('api/modules/<uuid:module_id>/content/', views.ModuleContentView.as_view(), name='module_content'),
    
    # System Health and Monitoring
    path('health/', views.HealthCheckView.as_view(), name='health_check'),
]