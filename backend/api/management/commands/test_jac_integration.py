"""
Django management command to test JaC integration
"""
import os
import sys
import logging
from django.core.management.base import BaseCommand
from django.conf import settings

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Test JaC integration and walker functionality'

    def handle(self, *args, **options):
        """Test JaC integration"""
        self.stdout.write(
            self.style.SUCCESS('🧪 Testing JaC Integration...')
        )
        
        try:
            # Test jaclang import
            try:
                import jaclang
                self.stdout.write(f'✅ jaclang version: {jaclang.__version__ if hasattr(jaclang, "__version__") else "unknown"}')
            except ImportError:
                self.stdout.write(
                    self.style.ERROR('❌ jaclang not available')
                )
                return
            
            # Test JaC manager
            try:
                from jac_layer.jac_manager import jac_manager
                self.stdout.write('✅ JaC Manager imported successfully')
                
                # Test health check
                health_result = jac_manager.health_check()
                if health_result:
                    self.stdout.write('✅ JaC Manager health check passed')
                else:
                    self.stdout.write('⚠️  JaC Manager health check failed')
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'❌ JaC Manager error: {e}')
                )
            
            # Test individual walkers
            walker_modules = [
                'orchestrator',
                'content_curator',
                'quiz_master', 
                'evaluator',
                'progress_tracker',
                'motivator'
            ]
            
            self.stdout.write('\n📋 Testing Walker Modules:')
            for walker in walker_modules:
                try:
                    module_name = f'jac_layer.walkers.{walker}'
                    if module_name in sys.modules:
                        self.stdout.write(f'✅ {walker} - loaded')
                    else:
                        # Try to import
                        __import__(module_name)
                        self.stdout.write(f'✅ {walker} - imported')
                except ImportError as e:
                    self.stdout.write(f'❌ {walker} - failed: {e}')
                except Exception as e:
                    self.stdout.write(f'⚠️  {walker} - warning: {e}')
            
            self.stdout.write(
                self.style.SUCCESS('✅ JaC integration test complete!')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ JaC integration test failed: {e}')
            )
