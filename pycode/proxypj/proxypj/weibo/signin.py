# -*- coding: utf-8 -*-
from weibo import *
from jsonp import *
from django.conf import settings
import logging
from django.http import HttpResponseRedirect


def SigninAction(request):
    client = APIClient(app_key=settings.APP_KEY, app_secret=settings.APP_SECRET, redirect_uri=settings.CALLBACK_URL)
    url = client.get_authorize_url()  
    return HttpResponseRedirect(url)

def LogoutAction(request):
    session = request.session
    if not(isLogin(session)):
        return jsonp(request, "err", {'error':'you have already logout'})
    session.clear()
    return jsonp(request, "ok", {})
       # response.out.write(redirectUrl)
       
       
       
       # code='zqy'
       
       # g='http://oauthbyecnu.appspot.com/?code=40124d0bf922f925ab1fd2d3cffffa13'
       # code=request.get('code')
       
       # e = AccessToken(accessToken=u.get('code'))
       # e.put()

