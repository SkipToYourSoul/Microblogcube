# -*- coding: utf-8 -*-
from beaker.middleware import SessionMiddleware
import webapp2
from weibo import *
from config import *
from jsonp import *
from appwrapper import *
import logging

class SigninAction(webapp2.RequestHandler):
    def get(self):
        global client
        client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
        url = client.get_authorize_url()  
        self.redirect(url)

class LogoutAction(webapp2.RequestHandler):
    def get(self):
        session = self.request.environ['beaker.session']
        if not(isLogin(session)):
            jsonp(self, "err", {'error':'you have already logout'})
            return
        session.delete()
        jsonp(self, "ok", {})
       # self.response.out.write(redirectUrl)
       
       
       
       # code='zqy'
       
       # g='http://oauthbyecnu.appspot.com/?code=40124d0bf922f925ab1fd2d3cffffa13'
       # code=self.request.get('code')
       
       # e = AccessToken(accessToken=u.get('code'))
       # e.put()
      
application = app([('/account/signin', SigninAction), ('/account/logout', LogoutAction)])
