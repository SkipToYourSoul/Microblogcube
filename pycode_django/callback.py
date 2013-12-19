# -*- coding: utf-8 -*-
from beaker.middleware import SessionMiddleware
import webapp2
import model
from weibo import *
import sys, os
import datetime
import logging
from config import *
from appwrapper import *


_DEBUG = True

    
# 微博授权的回调页面，需要设置用户的社交网络爬取状态：
# TODO:是否需要每次调用request_access_token？
class Callback(webapp2.RequestHandler):
  def get(self):
    # self.response.headers.add_header("Set-Cookie", "name=" + r.uid + "; ")
    # self.redirect(CLUSTER_PAGE % (123))
    # 是否只有access_token改变之后code才会变？
    global client  
    global r 
    code = self.request.get('code')
    try:
        client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
        r = client.request_access_token(code)
        
        access_token = r.access_token  # 新浪返回的token，类似abc123xyz456
        record = model.getAccessTokenByUid(r.uid)
        # logging.debug("r = %s" % (r))
        # logging.debug("record = %s" % (record))
        # logging.debug("callback:%s" % (str(not(record is None) and r.access_token != record.access_token)))
        if record is None or r.access_token != record.accessToken:
            # logging.debug("access token stored")
            if record is None:
                model.insertAccessToken(long(r.uid), access_token, r.expires_in, "uncrawled", datetime.datetime.now())    
            else:
                 model.insertAccessToken(long(r.uid), access_token, r.expires_in, record.dataState, record.lastCrawlTime)    
        session = self.request.environ['beaker.session']
        session['uid'] = long(r.uid)  # 表示该用户登陆成功
        self.redirect(CLUSTER_PAGE % ("true"))
    except Exception, e:
        logging.error("callback:%s" % (str(e)));
        self.redirect(CLUSTER_PAGE % ("false"))
     
application = app([('/callback', Callback)])
"""
def main():
    run_wsgi_app(application)
if __name__ == "__main__":
    main()
"""
