# -*- coding: utf-8 -*-
import imodel
from weibo import *
import sys, os
from jsonp import *
import pytz
from datetime import datetime
from django.conf import settings
import taskmanager

"""
TODO:这里in_comm的接口调用每个小时有10000(或者1000)的限制。而一个人的粉丝有200多吧，
这样子的话估计最多也就有50个人可以使用这个服务。

# 创建一个logger
logger = logger.getLogger('crawl')
logger.setLevel(logger.DEBUG)
# 再创建一个handler，用于输出到控制台
ch = logger.StreamHandler()
ch.setLevel(logger.DEBUG)
# 定义handler的输出格式
formatter = logger.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
# 给logger添加handler
logger.addHandler(ch)
"""

logger=logging.getLogger(__name__)
_DEBUG = True

def crawlState(tokenTuple, state):
    tokenTuple.lastCrawlTime = datetime.now(pytz.utc)
    tokenTuple.dataState = state
    tokenTuple.save()
    
def CrawlSocialGraph(request):
    if settings.TEST:
        uid = long(request.GET['uid'])
        taskmanager.addCrawlTask(uid)
        return jsonp(request, "ok", {"ok":""})   
    
    session = request.session
    if not(isLogin(session)):
        # logger.error("data is %s" % (data))
       return jsonp(request, "err", {"error":"login required"})
            
    
    # 读取uid的code
    tokenTuple = imodel.getAccessTokenByUid(session['uid'])
    if tokenTuple is None:
        logger.error("CounterWorker:oops, authorization token is missed.")
        return jsonp(request, "err", {"error":"CounterWorker:oops, authorization token is missed."})   
    
    timeDelta = datetime.now(pytz.utc) - tokenTuple.lastCrawlTime    
    if timeDelta.days < 1:
        if tokenTuple.dataState == "crawled":
            return jsonp(request, "err", {"error":"hey, you just crawled yesterday!!!"})
            
        elif tokenTuple.dataState == "crawling":
            return jsonp(request, "err", {"error":"hey, you are crawling yesterday!!!"})
            
    
    taskmanager.addCrawlTask(session['uid'])
    crawlState(tokenTuple, "crawling")
    logger.debug("submit crawl task success")
    return jsonp(request, "ok", {})    

"""
def CrawlSuccess(request):
    session = request.environ['beaker.session']
    if not(isLogin(session)):
        # logger.error("data is %s" % (data))
        jsonp(request, "err", {"error":"login required"})
        return    
    
    # 读取uid的code
    tokenTuple = imodel.getAccessTokenByUid(uid)
    if tokenTuple is None:
        logger.error("CounterWorker:oops, authorization token is missed.")
        return    
    crawlState(tokenTuple, "crawled")
"""
