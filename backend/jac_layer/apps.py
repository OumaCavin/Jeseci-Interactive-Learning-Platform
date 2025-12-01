"""Jac Layer application configuration"""

from django.apps import AppConfig

class JacLayerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'jac_layer'
    verbose_name = 'Jac Programming Language Layer'
    description = 'Multi-Agent System with Jac Programming Language'

    def ready(self):
        """Initialize Jac Layer when the app is ready"""
        try:
            from .jac_manager import jac_manager
            jac_manager.health_check()
        except Exception as e:
            # Log warning but don't fail - Jac layer will be initialized on demand
            pass