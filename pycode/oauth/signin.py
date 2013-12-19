# -*- coding: utf-8 -*-
from beaker.middleware import SessionMiddleware
import webapp2
from weibo import *

#APP_KEY = '1773914225'
#APP_SECRET = 'f4343544f7abf4eda601c92a55f241ff'
#CALLBACK_URL = 'http://sinaoauth1.appspot.com/callback'
APP_KEY = '71461248'#�������Լ���App Key
APP_SECRET = 'f49f8f9333ce82c45d8e6c355ce7956e'#�������Լ���App Secret
CALLBACK_URL = 'http://zqyoauth.appspot.com/callback'
   

class MainPage(webapp2.RequestHandler):
  def get(self):
      global client
      client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
      url = client.get_authorize_url()  
      self.redirect(url)
       
       #self.response.out.write(redirectUrl)
       
       
       
       #code='zqy'
       
       #g='http://oauthbyecnu.appspot.com/?code=40124d0bf922f925ab1fd2d3cffffa13'
       #code=self.request.get('code')
       
       #e = AccessToken(accessToken=u.get('code'))
       #e.put()
      
application = webapp2.WSGIApplication([('/signin', MainPage)], debug=True)
session_opts = {
        'session.type': 'ext:google',
        'session.cookie_expires': True,
        'session.auto': True,
        }
application = SessionMiddleware(application, session_opts)
