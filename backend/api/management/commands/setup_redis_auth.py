"""
Django management command to configure Redis authentication
"""
import os
import subprocess
import logging
from django.core.management.base import BaseCommand
from django.conf import settings

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Configure Redis authentication for Celery'

    def add_arguments(self, parser):
        parser.add_argument(
            '--password',
            type=str,
            help='Redis password to set',
        )
        parser.add_argument(
            '--generate',
            action='store_true',
            help='Generate a secure random password',
        )
        parser.add_argument(
            '--test-connection',
            action='store_true',
            help='Test Redis connection after configuration',
        )

    def handle(self, *args, **options):
        """Configure Redis authentication"""
        self.stdout.write(
            self.style.SUCCESS('🔧 Configuring Redis Authentication...')
        )
        
        # Get or generate password
        if options['generate']:
            import secrets
            password = secrets.token_urlsafe(32)
            self.stdout.write('🔐 Generated new secure password')
        elif options['password']:
            password = options['password']
            self.stdout.write('🔐 Using provided password')
        else:
            # Try to get password from environment or existing config
            password = os.getenv('REDIS_PASSWORD', '')
            if not password:
                self.stdout.write(
                    self.style.ERROR('❌ No password provided. Use --password or --generate')
                )
                return
            else:
                self.stdout.write('🔐 Using existing environment password')
        
        # Save password to environment file
        env_file = os.path.join(settings.BASE_DIR, '..', '.env')
        self.save_redis_password_to_env(env_file, password)
        
        # Test Redis connection if requested
        if options['test_connection']:
            self.test_redis_connection(password)
        
        self.stdout.write(
            self.style.SUCCESS('✅ Redis authentication configured!')
        )
        self.stdout.write(
            self.style.WARNING('⚠️  Remember to restart Celery worker after configuration')
        )

    def save_redis_password_to_env(self, env_file, password):
        """Save Redis password to .env file"""
        env_content = []
        
        # Read existing .env or create new
        if os.path.exists(env_file):
            with open(env_file, 'r') as f:
                env_content = f.readlines()
        
        # Update or add REDIS_PASSWORD
        password_line = f'REDIS_PASSWORD={password}\\n'
        found_password = False
        
        for i, line in enumerate(env_content):
            if line.startswith('REDIS_PASSWORD='):
                env_content[i] = password_line
                found_password = True
                break
        
        if not found_password:
            env_content.append(password_line)
        
        # Write back to file
        with open(env_file, 'w') as f:
            f.writelines(env_content)
        
        self.stdout.write(f'💾 Saved password to {env_file}')

    def test_redis_connection(self, password):
        """Test Redis connection with new password"""
        try:
            import redis
            r = redis.Redis(host='localhost', port=6379, password=password, decode_responses=True)
            r.ping()
            self.stdout.write('✅ Redis connection test successful!')
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Redis connection test failed: {e}')
            )
