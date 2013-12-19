# -*- coding: utf-8 -*-
from beaker.middleware import SessionMiddleware
import webapp2
from weibo import *
import model
import sys, os
from jsonp import *
import logging
from weibo import *
from config import *
from appwrapper import *
# 负责处理用户信息的查询
# 用户信息包括：
# 1. 基本的用户profile信息
# 2. 用户社交网络子图

    
class DataStateAction(webapp2.RequestHandler):
    def get(self):
        session = self.request.environ['beaker.session']
        if not(isLogin(session)):
            # logging.error("data is %s" % (data))
            logging.error("login required")   
            jsonp(self, "err", {'error':'login required'})
            return
        # q = db.Query(AccessToken).filter("uid = %s"%(session['uid']))
        token = model.getAccessTokenByUid(session['uid'])
        if not (token is None):
            data = {"dataState":str(token.dataState)}
            jsonp(self, "ok", data)
        else:
            jsonp(self, "err", {"error":"unauthorized"})
        return

class UserInfoAction(webapp2.RequestHandler):
    def get(self):
        # data = {"uid":"234234", "imgUrl":"http://tp1.sinaimg.cn/1707446764/180/39999875542/1", "uname":"xiafan68"}
        # jsonp(self, "ok", data)
        session = self.request.environ['beaker.session']
        if not(isLogin(session)):
            jsonp(self, "err", {'error':'login required'})
            return
       
        # user = model.getUserInfoByUid(session['uid'])
        # if (user):
         #   data = {"uid":user.uid, "imgUrl":user.imgUrl, "uname":user.uname}
          #  jsonp(self, "ok", data)
        # else:
        try:
            token = model.getAccessTokenByUid(session['uid'])
            user = None
            if not(token is None):
                client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
                client.set_access_token(token.accessToken, token.expireIn) 
                user = client.users.show.get(uid=session['uid'], source=APP_KEY)
                # logging.debug(user)
            if not(user is None):   
                jsonp(self, "ok", user)
            else: 
                jsonp(self, "err", {"error":"crawling userinfo failed"})
        except Exception, e :
                jsonp(self, "err", {"error":str(e)})
        
        # self.response.out.write(redirectUrl)
       
class SocialGraphAction(webapp2.RequestHandler):
    def get(self):
        # 按照下面这种格式构造数据返回
        # data={"rows":[['a','b'],['a','c'],['a','e']]}
        # jsonp(self, "ok", data)
        session = self.request.environ['beaker.session']
        if not(isLogin(session)):
            jsonp(self, "err", {"error":"login required"})
            return
        record = model.queryExSocialGraphByUid(session['uid'])
        if not(record is None):
            edges = []
            name = record.name.encode('utf-8', 'ignore')
            # name = str(record.name)
            for friend in record.friends:
                try:
                    edges.append([name, friend.encode('utf-8', 'ignore')])
                    # edges.append([name, str(friend)])
                except Exception, e :
                    logging.error(e)
                    jsonp(self, "err", {"error":"%s" % (str(e))}) 
                    return
            
            for edge in record.edges:
                edge = edge.encode('utf-8', 'ignore')
                # edge = str(edge)
                vertice = edge.split("@")
                edges.append(vertice)
            jsonp(self, "ok", {"rows":edges}) 
        else:
            jsonp(self, "err", {"error":"social graph data is not found"})  
       # self.response.out.write(redirectUrl)
       
class LogoutAction(webapp2.RequestHandler):
    def get(self):
        # 按照下面这种格式构造数据返回
        # data={"rows":[['a','b'],['a','c'],['a','e']]}
        # jsonp(self, "ok", data)
        session = self.request.environ['beaker.session']
        if not(isLogin(session)):
            jsonp(self, "err", {"error":"already logout"})
            return
        session.clear()
        jsonp(self, "or", {})
            
application = app([('/userinfo/datastate', DataStateAction),
                                       ('/userinfo/userinfo', UserInfoAction),
                                       ('/userinfo/socialgraph', SocialGraphAction),
                                       ('/userinfo/logout', LogoutAction)])
