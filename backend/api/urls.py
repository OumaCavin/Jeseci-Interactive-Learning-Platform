"""
API URLs Configuration - Session Authentication Version

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
    
    # System Health and Monitoring
    path('health/', views.HealthCheckView.as_view(), name='health_check'),
]