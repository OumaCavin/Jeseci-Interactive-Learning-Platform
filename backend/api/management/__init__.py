"""Django management commands for Jac Platform"""

from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Jac Platform management commands'

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('Jac Platform Management Console')
        )
        self.stdout.write('Available commands:')
        self.stdout.write('  python manage.py init_jac_walkers - Initialize Jac walkers')
        self.stdout.write('  python manage.py test_jac_integration - Test Jac integration')
        self.stdout.write('  python manage.py init_jac_walkers --compile - Force compile all walkers')
        self.stdout.write('  python manage.py setup_redis_auth - Configure Redis authentication')