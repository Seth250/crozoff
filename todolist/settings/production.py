from .base import *
import django_heroku
import dj_database_url

DEBUG = False

ALLOWED_HOSTS = ['crozapp.herokuapp.com']

DATABASES = {
    'default': {}
}

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# SECURITY
# CORS_REPLACE_HTTPS_REFERER      = True
# HOST_SCHEME                     = "https://"
# SECURE_HSTS_SECONDS             = 1000000
# SECURE_FRAME_DENY               = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

SECURE_SSL_REDIRECT = True

SECURE_HSTS_INCLUDE_SUBDOMAINS  = True

CSRF_COOKIE_SECURE = True

SESSION_COOKIE_SECURE = True

django_heroku.settings(locals())
