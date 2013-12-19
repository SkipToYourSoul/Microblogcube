# -*- coding: utf-8 -*-
import imodel
import sys, os
from jsonp import *
import logging
from weibo import *
from django.conf import settings
#import jeba
# 负责处理用户信息的查询
# 用户信息包括：
# 1. 基本的用户profile信息
# 2. 用户社交网络子图
logger=logging.getLogger(__name__)

def HomeTimelineAction(request):
    session = request.session
    if not(isLogin(session)):
        # logger.error("data is %s" % (data))
        logger.error("login required")   
        return jsonp(request, "err", {'error':'login required'})
        
    try:
        token = imodel.getAccessTokenByUid(session['uid'])
        user = None
        if not(token is None):
            client = APIClient(app_key=settings.APP_KEY, app_secret=settings.APP_SECRET, redirect_uri=settings.CALLBACK_URL)
            client.set_access_token(token.accessToken, token.expireIn) 
            timeline = client.statuses.home_timeline.get(source=settings.APP_KEY)
            data=[]
            for status in timeline.statuses:
                #words = jeba.cur_for_search(status.text)
                data.append((status.user.name, words))
           
            #logger.info(user)
        if not(user is None):   
            return jsonp(request, "ok", data)
        else: 
           return jsonp(request, "err", {"error":"crawl home timeline failed"})
    except Exception, e :
         raise e

def DataStateAction(request):
    session = request.session
    if not(isLogin(session)):
        # logger.error("data is %s" % (data))
        logger.error("login required")   
        return jsonp(request, "err", {'error':'login required'})
        
    # q = db.Query(AccessToken).filter("uid = %s"%(session['uid']))
    token = imodel.getAccessTokenByUid(session['uid'])
    if not (token is None):
        data = {"dataState":str(token.dataState)}
        return jsonp(request, "ok", data)
    else:
        return jsonp(request, "err", {"error":"unauthorized"})
    

def UserInfoAction(request):
    
     # data = {"uid":"234234", "imgUrl":"http://tp1.sinaimg.cn/1707446764/180/39999875542/1", "uname":"xiafan68"}
     # jsonp(request, "ok", data)
     session = request.session
     if not(isLogin(session)):
         return jsonp(request, "err", {'error':'login required'})
         
    
     # user = model.getUserInfoByUid(session['uid'])
     # if (user):
      #   data = {"uid":user.uid, "imgUrl":user.imgUrl, "uname":user.uname}
       #  jsonp(request, "ok", data)
     # else:
     try:
         token = imodel.getAccessTokenByUid(session['uid'])
         user = None
         if not(token is None):
             client = APIClient(app_key=settings.APP_KEY, app_secret=settings.APP_SECRET, redirect_uri=settings.CALLBACK_URL)
             client.set_access_token(token.accessToken, token.expireIn) 
             user = client.users.show.get(uid=session['uid'], source=settings.APP_KEY)
             #logger.info(user)
         if not(user is None):   
             return jsonp(request, "ok", user)
         else: 
            return jsonp(request, "err", {"error":"crawling userinfo failed"})
     except Exception, e :
         raise e
            #return jsonp(request, "err", {"error":str(e)})
        
        # response.out.write(redirectUrl)
       
def SocialGraphAction(request):
        # 按照下面这种格式构造数据返回
        # data={"rows":[['a','b'],['a','c'],['a','e']]}
        # jsonp(request, "ok", data)
        session = request.session
        if not(isLogin(session)):
            return jsonp(request, "err", {"error":"login required"})
            
        record = imodel.queryExSocialGraphByUid(session['uid'])
        if not(record is None):
            edgeArr = []
            name = record.name#.encode('utf-8', 'ignore')
            friends = record.friends#.encode('utf-8', 'ignore')
            friends = friends.split(';')
            # name = str(record.name)
            for friend in friends:
                try:
                    edgeArr.append([name, friend])
                    # edges.append([name, str(friend)])
                except Exception, e :
                    logger.error(e)
                    return jsonp(request, "err", {"error":"%s" % (str(e))}) 
            logger.info("friends parsed")        
            edges = record.edges#.encode('utf-8', 'ignore')
            edges = edges.split(';')
            #logger.info("edges:%s"%(edges))
            for edge in edges:
                #logger.info("edge:%s"%(edge))
                #if (isinstance(edge, basestring) or isinstance(edge, unicode)):
                vertice = edge.split("@")
                edgeArr.append(vertice)
            logger.info("edges parsed")  
            return jsonp(request, "ok", {"rows":edgeArr}) 
        else:
            return jsonp(request, "err", {"error":"social graph data is not found"})  
       # response.out.write(redirectUrl)


