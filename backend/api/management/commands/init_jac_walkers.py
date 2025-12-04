"""
Django management command to initialize JaC walkers
"""
import os
import sys
import logging
from django.core.management.base import BaseCommand
from django.conf import settings

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Initialize and compile JaC walkers'

    def handle(self, *args, **options):
        """Initialize JaC walkers by ensuring they are properly compiled"""
        self.stdout.write(
            self.style.SUCCESS('🔧 Initializing JaC Walkers...')
        )
        
        try:
            # Import jaclang and compile walkers
            import jaclang
            
            # Get the walkers directory
            walkers_dir = os.path.join(settings.BASE_DIR, 'jac_layer', 'walkers')
            
            if not os.path.exists(walkers_dir):
                self.stdout.write(
                    self.style.ERROR(f'❌ Walkers directory not found: {walkers_dir}')
                )
                return
            
            # List of walker files to check
            walker_files = [
                'orchestrator.jac',
                'content_curator.jac', 
                'quiz_master.jac',
                'evaluator.jac',
                'progress_tracker.jac',
                'motivator.jac'
            ]
            
            compiled_count = 0
            for walker_file in walker_files:
                walker_path = os.path.join(walkers_dir, walker_file)
                if os.path.exists(walker_path):
                    try:
                        # Compile the walker
                        self.stdout.write(f'📝 Compiling {walker_file}...')
                        
                        # The jaclang module should automatically compile .jac files
                        # when they're imported through the import hook
                        module_name = walker_file[:-4]  # Remove .jac extension
                        module_path = f'jac_layer.walkers.{module_name}'
                        
                        # Force import to trigger compilation
                        if module_path not in sys.modules:
                            try:
                                __import__(module_path)
                                self.stdout.write(f'✅ Compiled {walker_file}')
                                compiled_count += 1
                            except ImportError as e:
                                self.stdout.write(
                                    self.style.WARNING(f'⚠️  Warning importing {walker_file}: {e}')
                                )
                        else:
                            self.stdout.write(f'✅ {walker_file} already compiled')
                            compiled_count += 1
                            
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f'❌ Error compiling {walker_file}: {e}')
                        )
                else:
                    self.stdout.write(
                        self.style.ERROR(f'❌ Walker file not found: {walker_path}')
                    )
            
            # Initialize the JaC manager
            try:
                from jac_layer.jac_manager import jac_manager
                jac_manager.health_check()
                self.stdout.write(
                    self.style.SUCCESS(f'✅ JaC Manager initialized successfully!')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f'⚠️  JaC Manager initialization issue: {e}')
                )
            
            self.stdout.write(
                self.style.SUCCESS(f'✅ JaC initialization complete! Compiled {compiled_count} walkers.')
            )
            
        except ImportError:
            self.stdout.write(
                self.style.ERROR('❌ jaclang not installed. Please install: pip install jaclang[all]==0.9.3')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ JaC initialization failed: {e}')
            )
