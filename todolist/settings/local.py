from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

INTERNAL_IPS = ['localhost', '127.0.0.1']

INSTALLED_APPS.insert(-2, 'debug_toolbar')

MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}