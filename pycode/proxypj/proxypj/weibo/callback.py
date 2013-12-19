# -*- coding: utf-8 -*-
import imodel
from weibo import *
import sys, os
import pytz
import datetime
import logging
from django.conf import settings
from django.http import HttpResponseRedirect

logger = logging.getLogger(__name__)
_DEBUG = True

# 微博授权的回调页面，需要设置用户的社交网络爬取状态：
# TODO:是否需要每次调用request_access_token？
def Callback(request):
    # response.headers.add_header("Set-Cookie", "name=" + r.uid + "; ")
    # redirect(CLUSTER_PAGE % (123))
    # 是否只有access_token改变之后code才会变？
    client = None  
    r = None 
    if not('code' in request.GET):
        logger.warning("code argument is not provided in Callback")
        return HttpResponseRedirect(settings.CLUSTER_PAGE % ("false"))
    
    # for test only
    if settings.TEST:
        imodel.insertAccessToken(long(1), u"sdfasdfasdf", 1231231, u"uncrawled", datetime.datetime.now(pytz.utc))    
        session = request.session
        session.set_expiry(600)  # 十分钟的生命周期
        session['uid'] = long(1)  # 表示该用户登陆成功
        return HttpResponseRedirect(settings.CLUSTER_PAGE % ("true"))
    
    code = request.GET['code']
    try:
        client = APIClient(app_key=settings.APP_KEY, app_secret=settings.APP_SECRET, redirect_uri=settings.CALLBACK_URL)
        r = client.request_access_token(code)
        
        access_token = r.access_token  # 新浪返回的token，类似abc123xyz456
        record = imodel.getAccessTokenByUid(r.uid)
        # logging.debug("r = %s" % (r))
        # logging.debug("record = %s" % (record))
        # logging.debug("callback:%s" % (str(not(record is None) and r.access_token != record.access_token)))
        if record is None or r.access_token != record.accessToken:
            # logging.debug("access token stored")
            if record is None:
                imodel.insertAccessToken(long(r.uid), access_token, r.expires_in, "uncrawled", datetime.datetime.now(pytz.utc))    
            else:
                imodel.insertAccessToken(long(r.uid), access_token, r.expires_in, record.dataState, record.lastCrawlTime)    
        session = request.session
        session.set_expiry(600)  # 十分钟的生命周期
        session['uid'] = long(r.uid)  # 表示该用户登陆成功
        return HttpResponseRedirect(settings.CLUSTER_PAGE % ("true"))
    except Exception, e:
        logger.error("callback:%s" % (str(e)));
        return HttpResponseRedirect(settings.CLUSTER_PAGE % ("false"))

"""
def main():
    run_wsgi_app(application)
if __name__ == "__main__":
    main()
"""
