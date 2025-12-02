"""
Celery configuration for Jeseci Learning Platform
"""
import os
from celery import Celery
from decouple import config

# Set the default Django settings module for the 'celery' program
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jeseci_platform.settings')

app = Celery('jeseci_platform')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

# Configure broker connection retry behavior to suppress deprecation warnings
app.conf.broker_connection_retry_on_startup = True


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')