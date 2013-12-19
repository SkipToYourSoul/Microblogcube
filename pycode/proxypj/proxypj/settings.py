# -*- coding: utf-8 -*-
# Django settings for proxypj project.
import redis
DEBUG = False
TEMPLATE_DEBUG = DEBUG

# DJANGOTASK设置
DJANGOTASK_DAEMON_THREAD = True

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
    ('xiafan','xiafan68@gmail.com')
)

MANAGERS = ADMINS
"""
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'testdb.db',  # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': '',
        'PASSWORD': '',
        'HOST': '',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',  # Set to empty string for default.
    }
}
"""
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'microblog',  # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'root',
        'PASSWORD': '',
        'HOST': '10.11.1.212',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',  # Set to empty string for default.
    }
}
# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ['database.ecnu.edu.cn']

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = ''

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'x#d39la%*gv0x=!f2n1=_vg2+b6tdp!=up3t88vu&84%mhpc-p'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)
SESSION_COOKIE_AGE = 1800
MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'proxypj.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'proxypj.wsgi.application'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    "/home/microblogcube/proxypj/template"
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'proxypj.weibo',
    # Uncomment the next line to enable the admin:
    # 'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
     'formatters': {
        'simple': {
            'format': '%(levelname)s %(asctime)s %(module)s: %(message)s'
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
                'mail_admins': {
                    'level': 'ERROR',
                    'filters': ['require_debug_false'],
                    'class': 'django.utils.log.AdminEmailHandler'
                },
                 'logfile':{
                            'level':'INFO',
                            'class':'logging.FileHandler',
                            'formatter':'simple',
                            'filename':'/home/microblogcube/proxypj/log/django.log'
                            #'filename':'./django.log'
                            },
                 'console':{
                            'level':'INFO',
                            'class':'logging.StreamHandler',
                            'formatter':'simple',
                            },
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins','logfile'],
            'level': 'ERROR',
            'propagate': True,
        },
        'proxypj.proxy': {
            'handlers': ['logfile', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'proxypj.weibo': {
            'handlers': ['logfile', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
    }
}


# settings for the proxy
SOCKET_TIMEOUT = 60
PROXY_SERVER = 'http://127.0.0.1:8087'

PROXY_SERVERS = ['http://127.0.0.1:8087']
"""
PROXY_SERVERS = ['http://127.0.0.1:8087',
                 'http://127.0.0.1:8088',
                 'http://127.0.0.1:8089',
                 'http://127.0.0.1:8090',
                 'http://127.0.0.1:8091',
                 'http://127.0.0.1:8092',
                 'http://127.0.0.1:8093',
                 'http://127.0.0.1:8094',
                 'http://127.0.0.1:8095',
                 'http://127.0.0.1:8096'
                 ]
"""

GSQL_SERVER = "http://www.google.com/fusiontables/gvizdata"
GVIZ_SERVER = "https://www.googleapis.com/fusiontables/v1/query"
SEARCH_SERVER = "http://mcubesearchapi.appspot.com/search"

# settings for the sina crawler
# APP_KEY = '1773914225'
# APP_SECRET = 'f4343544f7abf4eda601c92a55f241ff'
# CALLBACK_URL = 'http://sinaoauth1.appspot.com/callback'
ZYQ_APP_KEY = '71461248'  # �������Լ���App Key
ZYQ_APP_SECRET = 'f49f8f9333ce82c45d8e6c355ce7956e'  # �������Լ���App Secret
XIAFAN_APP_KEY = "1773914225"
APP_KEY = XIAFAN_APP_KEY
XIAFAN_APP_SECRET = "f4343544f7abf4eda601c92a55f241ff"
APP_SECRET = XIAFAN_APP_SECRET
XIAFAN_CALLBACK_URL = 'http://sinaoauth1.appspot.com/callback'
ECNU_CALLBACK_URL = 'http://database.ecnu.edu.cn/microblogcube/proxy/callback'
CALLBACK_URL = ECNU_CALLBACK_URL

APP_KEY1 = '296882199'  
APP_SECRET1 = '1695e3222429c090a86a4ad5a10f01e7'  
CALLBACK_URL1 = 'http://mblog.city.sina.com.cn/index.php?app=admin&mod=Account&act=callback'


DATABASE_CLUSTER_PAGE = 'http://database.ecnu.edu.cn/microblogcube/cluster.html?login=%s'
GAE_CLUSTER_PAGE = 'http://microblogcube.appspot.com/cluster.html?login=%s'
CLUSTER_PAGE = DATABASE_CLUSTER_PAGE

OAUTH_SERVER = 'http://sinaoauth1.appspot.com/'

MODEL = 'django'
TEST = False

POOL = redis.ConnectionPool(connection_class=redis.UnixDomainSocketConnection, path='/tmp/redis.sock')
# pool = redis.ConnectionPool(host='localhost', port=6379, db=0)
CACHE_EXPIRE=60*60*24*100 #10days