from .base import *
from django.conf import settings

DEBUG = True

ALLOWED_HOSTS = ['d9a44f15ccbe.ngrok.io', 'localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}