"""
Jac Manager - Integration Layer between Django and Jac Walkers

This module provides the bridge between Django views and the Jac programming language
agents. It handles compilation, execution, and management of Jac walkers.
"""

import logging
import os
import sys
import importlib.util
from pathlib import Path
from typing import Dict, Any, Optional
from jaclang.jac_interpreter import JacInterpreter
from jaclang import jac_file_to_py

logger = logging.getLogger(__name__)

class JacManager:
    """
    Manager class for Jac walker execution and integration with Django
    """
    
    def __init__(self):
        """Initialize the Jac Manager with compilation settings"""
        self.jac_files_path = Path(__file__).parent / 'walkers'
        self.compiled_modules = {}
        self.walker_registry = {}
        self._initialize_walkers()
    
    def _initialize_walkers(self):
        """Initialize and register all available Jac walkers"""
        try:
            # Load main orchestrator walker
            orchestrator_path = self.jac_files_path / 'orchestrator.jac'
            if orchestrator_path.exists():
                self._compile_and_register_walker('orchestrator', orchestrator_path)
                logger.info("Loaded orchestrator walker")
            
            # Load agent walkers
            agent_files = {
                'content_curator': 'content_curator.jac',
                'quiz_master': 'quiz_master.jac',
                'evaluator': 'evaluator.jac',
                'progress_tracker': 'progress_tracker.jac',
                'motivator': 'motivator.jac',
            }
            
            for agent_name, filename in agent_files.items():
                walker_path = self.jac_files_path / filename
                if walker_path.exists():
                    self._compile_and_register_walker(agent_name, walker_path)
                    logger.info(f"Loaded {agent_name} walker")
                    
        except Exception as e:
            logger.error(f"Error initializing walkers: {str(e)}")
            raise
    
    def _compile_and_register_walker(self, walker_name: str, jac_path: Path):
        """Compile Jac file to Python and register the walker"""
        try:
            # Convert Jac to Python code
            python_code = jac_file_to_py(str(jac_path))
            
            # Execute the Python code in a module context
            module_name = f"{walker_name}_walker"
            spec = importlib.util.spec_from_loader(module_name, loader=None)
            module = importlib.util.module_from_spec(spec)
            
            # Execute the compiled code
            exec(python_code, module.__dict__)
            
            # Store the compiled module
            self.compiled_modules[walker_name] = module
            
            # Register walkers from the module
            if hasattr(module, 'WALKERS'):
                for walker_info in module.WALKERS:
                    walker_full_name = f"{walker_name}.{walker_info['name']}"
                    self.walker_registry[walker_full_name] = {
                        'walker_info': walker_info,
                        'module': module,
                        'compiled_code': python_code
                    }
                    
        except Exception as e:
            logger.error(f"Error compiling walker {walker_name}: {str(e)}")
            raise
    
    def execute_walker(self, walker_name: str, parameters: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Execute a Jac walker with given parameters
        
        Args:
            walker_name: Name of the walker to execute
            parameters: Dictionary of parameters to pass to the walker
            
        Returns:
            Dictionary containing the result of walker execution
        """
        if walker_name not in self.walker_registry:
            raise ValueError(f"Walker '{walker_name}' not found. Available walkers: {list(self.walker_registry.keys())}")
        
        try:
            walker_info = self.walker_registry[walker_name]['walker_info']
            module = self.walker_registry[walker_name]['module']
            
            # Get the walker function
            walker_func = getattr(module, walker_info['name'])
            
            # Execute the walker
            logger.info(f"Executing walker '{walker_name}' with parameters: {parameters}")
            
            if parameters:
                result = walker_func(**parameters)
            else:
                result = walker_func()
            
            # Convert result to dictionary if needed
            if hasattr(result, '__dict__'):
                result_dict = result.__dict__
            elif isinstance(result, (list, tuple)):
                result_dict = {'result': result}
            elif isinstance(result, dict):
                result_dict = result
            else:
                result_dict = {'result': str(result)}
            
            logger.info(f"Walker '{walker_name}' completed successfully")
            return {
                'status': 'success',
                'data': result_dict,
                'walker_name': walker_name,
                'execution_time': '2025-12-02T03:08:23Z'
            }
            
        except Exception as e:
            logger.error(f"Error executing walker '{walker_name}': {str(e)}")
            return {
                'status': 'error',
                'message': str(e),
                'walker_name': walker_name,
                'execution_time': '2025-12-02T03:08:23Z'
            }
    
    def get_available_walkers(self) -> Dict[str, Any]:
        """
        Get list of all available walkers
        
        Returns:
            Dictionary mapping walker names to their information
        """
        walkers_info = {}
        for walker_name, walker_data in self.walker_registry.items():
            walkers_info[walker_name] = {
                'name': walker_name,
                'description': walker_data['walker_info'].get('description', 'No description'),
                'parameters': walker_data['walker_info'].get('parameters', [])
            }
        return walkers_info
    
    def health_check(self) -> bool:
        """
        Check if Jac layer is healthy and functioning
        
        Returns:
            Boolean indicating if Jac layer is healthy
        """
        try:
            # Test basic walker execution
            test_result = self.execute_walker('orchestrator.init_user_graph', {'test': True})
            return test_result['status'] == 'success'
        except Exception as e:
            logger.error(f"Jac layer health check failed: {str(e)}")
            return False
    
    def reload_walkers(self) -> bool:
        """
        Reload all walkers from Jac files
        
        Returns:
            Boolean indicating if reload was successful
        """
        try:
            self.compiled_modules.clear()
            self.walker_registry.clear()
            self._initialize_walkers()
            logger.info("All walkers reloaded successfully")
            return True
        except Exception as e:
            logger.error(f"Error reloading walkers: {str(e)}")
            return False

# Global instance for use across the application
jac_manager = JacManager()

def get_jac_manager() -> JacManager:
    """Get the global Jac manager instance"""
    return jac_manager