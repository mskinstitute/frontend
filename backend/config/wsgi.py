"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()

# Automatically apply database migrations on server startup (essential for cloud platforms like Render)
try:
    from django.core.management import call_command
    call_command('migrate', interactive=False)
    print("Database migrations verified and applied successfully on startup.")
except Exception as e:
    print(f"Startup migration notice: {e}", file=sys.stderr)
