"""Jac Layer module for Jeseci Interactive Learning Platform"""

__version__ = '1.0.0'
__author__ = 'Cavin Otieno'
__description__ = 'Jac Programming Language Multi-Agent System Layer'

from .jac_manager import JacManager, jac_manager, get_jac_manager

__all__ = [
    'JacManager',
    'jac_manager', 
    'get_jac_manager'
]