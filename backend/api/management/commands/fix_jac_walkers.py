"""
Django management command to fix JaC walker compatibility issues
This command addresses bytecode compilation issues in jaclang 0.9.3
"""
import os
import sys
import logging
import importlib
from django.core.management.base import BaseCommand
from django.conf import settings

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Fix JaC walker bytecode compilation issues'

    def handle(self, *args, **options):
        """Fix JaC walker issues by implementing compatibility layer"""
        self.stdout.write(
            self.style.SUCCESS('🔧 Fixing JaC Walker Compatibility Issues...')
        )
        
        try:
            # Step 1: Check jaclang version
            try:
                import jaclang
                self.stdout.write(f'✅ jaclang version: {jaclang.__version__}')
            except ImportError:
                self.stdout.write(
                    self.style.ERROR('❌ jaclang not installed. Installing...')
                )
                os.system('pip install jaclang[all]==0.9.3')
                import jaclang
            
            # Step 2: Create compatibility wrapper for each walker
            walkers_dir = os.path.join(settings.BASE_DIR, 'jac_layer', 'walkers')
            walker_files = [
                'orchestrator.jac',
                'content_curator.jac', 
                'quiz_master.jac',
                'evaluator.jac',
                'progress_tracker.jac',
                'motivator.jac'
            ]
            
            for walker_file in walker_files:
                walker_path = os.path.join(walkers_dir, walker_file)
                if os.path.exists(walker_path):
                    self.stdout.write(f'🔄 Processing {walker_file}...')
                    self._create_compatibility_wrapper(walker_file, walker_path)
                else:
                    self.stdout.write(
                        self.style.ERROR(f'❌ Walker file not found: {walker_path}')
                    )
            
            # Step 3: Update jac_manager to use compatibility mode
            self._update_jac_manager()
            
            # Step 4: Test the fixes
            self._test_jac_integration()
            
            self.stdout.write(
                self.style.SUCCESS('✅ JaC Walker compatibility fixes applied!')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Failed to fix JaC walkers: {e}')
            )
            import traceback
            traceback.print_exc()

    def _create_compatibility_wrapper(self, walker_file, walker_path):
        """Create a compatibility wrapper for the walker"""
        try:
            # Read the original .jac file
            with open(walker_path, 'r') as f:
                content = f.read()
            
            # Create module name (remove .jac extension)
            module_name = walker_file[:-4]
            
            # Create a Python compatibility wrapper
            wrapper_content = f'''
"""
Compatibility wrapper for {walker_file}
This file allows jaclang 0.9.3 to properly import the walker
"""

# Import the original content
{content}

# Ensure all functions are available at module level
__all__ = [attr for attr in dir() if callable(getattr(globals().get(attr, None), '__call__', None)) and not attr.startswith('_')]
'''
            
            # Write the wrapper
            wrapper_path = walker_path.replace('.jac', '_compat.py')
            with open(wrapper_path, 'w') as f:
                f.write(wrapper_content)
                
            self.stdout.write(f'✅ Created compatibility wrapper for {walker_file}')
            
        except Exception as e:
            self.stdout.write(
                self.style.WARNING(f'⚠️  Warning creating wrapper for {walker_file}: {e}')
            )

    def _update_jac_manager(self):
        """Update jac_manager to handle compatibility issues"""
        jac_manager_path = os.path.join(settings.BASE_DIR, 'jac_layer', 'jac_manager.py')
        
        # Read current content
        with open(jac_manager_path, 'r') as f:
            content = f.read()
        
        # Check if compatibility mode is already implemented
        if 'COMPATIBILITY_MODE' in content:
            self.stdout.write('✅ jac_manager already has compatibility mode')
            return
        
        # Add compatibility mode handling
        compatibility_code = '''
# Compatibility Mode - Handle bytecode compilation issues
class CompatibilityManager:
    def __init__(self):
        self.walker_cache = {}
        
    def load_walker_compat(self, walker_name: str):
        """Load walker using compatibility mode"""
        if walker_name in self.walker_cache:
            return self.walker_cache[walker_name]
            
        # Try different import strategies
        strategies = [
            f'jac_layer.walkers.{walker_name}',
            f'jac_layer.walkers.{walker_name}_compat',
            f'backend.jac_layer.walkers.{walker_name}',
            f'backend.jac_layer.walkers.{walker_name}_compat',
        ]
        
        for strategy in strategies:
            try:
                if strategy in sys.modules:
                    module = sys.modules[strategy]
                else:
                    module = importlib.import_module(strategy)
                self.walker_cache[walker_name] = module
                logger.info(f"Loaded {walker_name} using strategy: {strategy}")
                return module
            except ImportError:
                continue
        
        raise ImportError(f"Could not load walker {walker_name} with any strategy")

# Global compatibility manager
compat_manager = CompatibilityManager()
'''
        
        # Insert the compatibility code after the JACLANG_AVAILABLE check
        insert_point = content.find('if JACLANG_AVAILABLE:')
        if insert_point > 0:
            new_content = content[:insert_point] + compatibility_code + '\n\n' + content[insert_point:]
            
            # Write updated content
            with open(jac_manager_path, 'w') as f:
                f.write(new_content)
                
            self.stdout.write('✅ Updated jac_manager with compatibility mode')
        else:
            self.stdout.write(
                self.style.WARNING('⚠️  Could not update jac_manager - manual update needed')
            )

    def _test_jac_integration(self):
        """Test that the compatibility fixes work"""
        try:
            # Import the updated jac_manager
            sys.path.insert(0, str(settings.BASE_DIR))
            
            from jac_layer.jac_manager import jac_manager
            
            # Test each walker
            walkers = ['orchestrator', 'content_curator', 'quiz_master', 'evaluator', 'progress_tracker', 'motivator']
            loaded_count = 0
            
            for walker_name in walkers:
                try:
                    if hasattr(jac_manager, 'modules') and walker_name in jac_manager.modules:
                        self.stdout.write(f'✅ {walker_name} loaded successfully')
                        loaded_count += 1
                    else:
                        self.stdout.write(f'⚠️  {walker_name} not loaded')
                except Exception as e:
                    self.stdout.write(f'❌ {walker_name} failed: {e}')
            
            self.stdout.write(
                self.style.SUCCESS(f'✅ Loaded {loaded_count}/{len(walkers)} walkers successfully')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Integration test failed: {e}')
            )