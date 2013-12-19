from django.conf.urls.defaults import patterns, include, url
from search import searchView
from upload import process_upload_file
import settings
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'djtest.views.home', name='home'),
    # url(r'^djtest/', include('djtest.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
                       ( r'^resources/(.*)$',
                         'django.views.static.serve',
                         { 'document_root': settings.MEDIA_ROOT } ),
                       url(r'^search.*', searchView),
                       url(r'^upload.*', process_upload_file)
)
