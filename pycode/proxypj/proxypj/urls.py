# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from proxy.views import *
from weibo.testdb import *
from weibo.userinfo import *
from weibo.callback import *
from weibo.signin import *
from weibo.crawl import *


# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'proxypj.views.home', name='home'),
    # url(r'^proxypj/', include('proxypj.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
                    #代理部分
                       url(r'^gqldata.*', GQLView),
                       url(r'^gvizdata.*', GVizView),
                       url(r'^search.*', SearchView),
                       url(r'test', test),
                       #用户数据查询
                       url(r'^userinfo/datastate.*', DataStateAction),
                       url(r'^userinfo/userinfo.*', UserInfoAction),
                       url(r'^userinfo/socialgraph.*', SocialGraphAction),
                       
                       #数据爬取
                       url(r'^crawl.*', CrawlSocialGraph),
                       url(r'^callback.*', Callback),
                       #登录登出
                       url(r'^account/signin.*', SigninAction),
                       url(r'^account/logout.*', LogoutAction)
)
