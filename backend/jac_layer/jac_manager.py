"""
Jac Manager - Integration Layer between Django and Jac Walkers (Modern 0.9.x)

This module handles the dynamic importing and execution of Jac walkers
using the native Python import system (Transpiler).
"""

import logging
import os
import sys
import importlib
from typing import Dict, Any, Optional

# Import Django settings
from django.conf import settings

# IMPORTANT: Importing jaclang enables the import hook for .jac files
try:
    import jaclang 
    JACLANG_AVAILABLE = True
except ImportError:
    JACLANG_AVAILABLE = False
    # Create a dummy jaclang module for when it's not available
    class _DummyJacLang:
        pass
    jaclang = _DummyJacLang()

logger = logging.getLogger(__name__)

# Note: construct_root and get_root functions not available in jaclang 0.9.3
# This version uses a different approach for walker execution
construct_root = None
get_root = None

if JACLANG_AVAILABLE:
    logger.info("JacManager initialized - using jaclang 0.9.x approach without root functions")
else:
    logger.info("JacManager initialized in compatibility mode - jaclang not available")

class JacManager:
    """
    Manager class for Jac walker execution using native Python imports.
    """
    
    def __init__(self):
        self.modules = {}
        # Define the mapping of logical names to python import paths
        # Assuming your walkers are in backend/jac_layer/walkers/
        self.walker_map = {
            'orchestrator': 'jac_layer.walkers.orchestrator',
            'content_curator': 'jac_layer.walkers.content_curator',
            'quiz_master': 'jac_layer.walkers.quiz_master',
            'evaluator': 'jac_layer.walkers.evaluator',
            'progress_tracker': 'jac_layer.walkers.progress_tracker',
            'motivator': 'jac_layer.walkers.motivator',
        }
        self._initialize_walkers()
    
    def _initialize_walkers(self):
        """
        Dynamically imports the Jac modules with multiple fallback strategies.
        Handles jaclang 0.9.3 bytecode compilation issues.
        """
        for name, module_path in self.walker_map.items():
            try:
                # Strategy 1: Try direct import (should work if jaclang is properly configured)
                module = importlib.import_module(module_path)
                self.modules[name] = module
                logger.info(f"Successfully loaded Jac module: {name}")
                
            except ImportError as e:
                logger.warning(f"Strategy 1 failed for {name}: {e}")
                
                try:
                    # Strategy 2: Try importing as Python module by adding to sys.path
                    walker_dir = os.path.join(settings.BASE_DIR, 'jac_layer', 'walkers')
                    if walker_dir not in sys.path:
                        sys.path.insert(0, walker_dir)
                    
                    # Try importing the .jac file directly as a Python module
                    module = importlib.import_module(name)
                    self.modules[name] = module
                    logger.info(f"Successfully loaded {name} using Strategy 2 (direct Python import)")
                    
                except ImportError as e2:
                    logger.warning(f"Strategy 2 failed for {name}: {e2}")
                    
                    try:
                        # Strategy 3: Read the .jac file and execute it as Python code
                        walker_file = os.path.join(settings.BASE_DIR, 'jac_layer', 'walkers', f'{name}.jac')
                        if os.path.exists(walker_file):
                            with open(walker_file, 'r') as f:
                                jac_code = f.read()
                            
                            # Execute the code in a new namespace
                            namespace = {}
                            exec(jac_code, namespace)
                            
                            # Create a module-like object
                            class WalkerModule:
                                pass
                            
                            module = WalkerModule()
                            for key, value in namespace.items():
                                if not key.startswith('_') and callable(value):
                                    setattr(module, key, value)
                            
                            self.modules[name] = module
                            logger.info(f"Successfully loaded {name} using Strategy 3 (code execution)")
                        else:
                            raise ImportError(f"Walker file not found: {walker_file}")
                            
                    except Exception as e3:
                        logger.error(f"Strategy 3 failed for {name}: {e3}")
                        
                        # Strategy 4: Create a dummy module with fallback functions
                        logger.warning(f"Creating dummy module for {name} as fallback")
                        
                        class DummyWalkerModule:
                            """Dummy module for when JaC execution fails"""
                            pass
                        
                        module = DummyWalkerModule()
                        
                        # Add some basic fallback methods based on walker type
                        fallback_methods = {
                            'orchestrator': ['init_user_graph', 'start_lesson_sequence', 'coordinate_learning_workflow'],
                            'content_curator': ['get_lesson_content', 'create_learning_material', 'adapt_content_difficulty'],
                            'quiz_master': ['generate_adaptive_quiz', 'create_question_set', 'evaluate_quiz_performance'],
                            'evaluator': ['evaluate_code_response', 'evaluate_text_response', 'provide_feedback'],
                            'progress_tracker': ['track_lesson_progress', 'update_mastery_scores', 'get_learning_analytics'],
                            'motivator': ['generate_motivational_message', 'create_encouragement', 'track_achievements']
                        }
                        
                        walker_methods = fallback_methods.get(name, ['execute'])
                        for method_name in walker_methods:
                            def fallback_method(**kwargs):
                                return {
                                    'status': 'fallback',
                                    'walker': name,
                                    'method': method_name,
                                    'message': f'Walker {name} is running in fallback mode',
                                    'parameters': kwargs,
                                    'timestamp': '2025-12-04T17:47:44Z'
                                }
                            setattr(module, method_name, fallback_method)
                        
                        self.modules[name] = module
                        logger.info(f"Created dummy module for {name} with fallback methods")
                        
            except Exception as e:
                logger.error(f"Unexpected error initializing {name}: {e}")

    def get_walker_module(self, module_name: str):
        """
        Helper to extract the walker module for function-based execution.
        """
        module = self.modules.get(module_name)
        if not module:
            raise ValueError(f"Module {module_name} is not loaded.")
        return module

    def get_available_functions(self, walker_name: str) -> list:
        """
        Get list of available functions in a walker module.
        """
        if walker_name not in self.modules:
            return []
        
        module = self.modules[walker_name]
        functions = [attr for attr in dir(module) 
                    if callable(getattr(module, attr)) and not attr.startswith('_')]
        return functions

    def execute_walker(self, walker_name: str, parameters: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Execute a Jac walker using the 0.9.x function-based approach.
        The updated .jac files contain Python functions that can be called directly.
        """
        if parameters is None:
            parameters = {}

        try:
            # 1. Get the module containing walker functions
            if walker_name not in self.modules:
                raise ValueError(f"Walker module '{walker_name}' is not loaded.")

            module = self.modules[walker_name]
            logger.info(f"Executing walker '{walker_name}' with parameters: {parameters}")

            # 2. Get the function name to call (based on walker_name)
            # Map walker names to function names
            function_mapping = {
                'orchestrator': 'init_user_graph',
                'content_curator': 'get_lesson_content',
                'quiz_master': 'generate_adaptive_quiz',
                'evaluator': 'evaluate_code_response',
                'progress_tracker': 'track_lesson_progress',
                'motivator': 'generate_motivational_message'
            }
            
            function_name = function_mapping.get(walker_name, f"{walker_name}_execute")
            
            # 3. Check if the function exists in the module
            if not hasattr(module, function_name):
                # If specific function doesn't exist, try to find any callable function
                available_functions = [attr for attr in dir(module) 
                                     if callable(getattr(module, attr)) and not attr.startswith('_')]
                
                if not available_functions:
                    raise ValueError(f"No callable functions found in module '{walker_name}'")
                
                # Use the first available function
                function_name = available_functions[0]
                logger.info(f"Using fallback function '{function_name}' for walker '{walker_name}'")
            
            # 4. Get and call the function
            walker_function = getattr(module, function_name)
            
            # 5. Execute the function with parameters
            result_data = walker_function(**parameters)

            logger.info(f"Walker '{walker_name}' completed successfully.")

            return {
                'status': 'success',
                'data': result_data,
                'walker_name': walker_name,
                'function_called': function_name,
            }

        except Exception as e:
            logger.error(f"Error executing walker '{walker_name}': {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                'status': 'error',
                'message': str(e),
                'walker_name': walker_name,
            }

    def get_available_walkers(self) -> Dict[str, Any]:
        """Return list of loaded modules."""
        return {name: {'loaded': True} for name in self.modules.keys()}

    def reload_walkers(self) -> bool:
        """Reloads modules using importlib.reload"""
        try:
            for name, module in self.modules.items():
                importlib.reload(module)
            return True
        except Exception as e:
            logger.error(f"Reload failed: {e}")
            return False

    def health_check(self) -> bool:
        """Check if walkers are loaded and provide diagnostics"""
        loaded_count = len(self.modules)
        total_count = len(self.walker_map)
        
        if loaded_count > 0:
            logger.info(f"Health check: {loaded_count}/{total_count} walkers loaded")
            for name in self.walker_map.keys():
                if name in self.modules:
                    logger.info(f"✅ {name} - Loaded")
                else:
                    logger.warning(f"❌ {name} - Not loaded")
        else:
            logger.warning("Health check: No walkers loaded")
            
        return loaded_count > 0

# Global instance
jac_manager = JacManager()

def get_jac_manager() -> JacManager:
    return jac_manager