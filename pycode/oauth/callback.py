# -*- coding: utf-8 -*-
from beaker.middleware import SessionMiddleware
import webapp2
import model
from weibo import *
import sys, os
import datetime
import logging

_DEBUG = True

#APP_KEY = '1773914225'  # 夏帆App Key
#APP_SECRET = 'f4343544f7abf4eda601c92a55f241ff'  # 夏帆
# CALLBACK_URL = 'http://sinaoauth.appspot.com/callback'#�����
#CALLBACK_URL = 'http://sinaoauth1.appspot.com/callback'
APP_KEY = '71461248'#�������Լ���App Key
APP_SECRET = 'f49f8f9333ce82c45d8e6c355ce7956e'#�������Լ���App Secret
CALLBACK_URL = 'http://zqyoauth.appspot.com/callback'
CLUSTER_PAGE = 'http://microblogcube.appspot.com/cluster.html?login=%s'
    
# 微博授权的回调页面，需要设置用户的社交网络爬取状态：
#TODO:是否需要每次调用request_access_token？
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
            model.insertAccessToken(long(r.uid), access_token, r.expires_in, "uncrawled", datetime.datetime.now())    
        
        session = self.request.environ['beaker.session']
        session['uid'] = long(r.uid)  # 表示该用户登陆成功
        self.redirect(CLUSTER_PAGE % ("true"))
    except Exception, e:
        logging.error("callback:%s" % (str(e)));
        self.redirect(CLUSTER_PAGE % ("false"))
     
application = webapp2.WSGIApplication([('/callback', Callback)], debug=True)
session_opts = {
        'session.type': 'ext:google',
        'session.cookie_expires': True,
        'session.auto': True,
        }
application = SessionMiddleware(application, session_opts)

"""
def main():
    run_wsgi_app(application)
if __name__ == "__main__":
    main()
"""
