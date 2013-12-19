# -*- coding: utf-8 -*-
from beaker.middleware import SessionMiddleware
import webapp2
import model
from weibo import *
import sys, os
from jsonp import *
from datetime import datetime
from google.appengine.api import taskqueue
from config import *
from appwrapper import *

"""
TODO:这里in_comm的接口调用每个小时有10000(或者1000)的限制。而一个人的粉丝有200多吧，
这样子的话估计最多也就有50个人可以使用这个服务。
"""
# 创建一个logger
logger = logging.getLogger('crawl')
logger.setLevel(logging.DEBUG)
# 再创建一个handler，用于输出到控制台
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
# 定义handler的输出格式
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
# 给logger添加handler
logger.addHandler(ch)

_DEBUG = True

def crawlState(tokenTuple, state):
    tokenTuple.lastCrawlTime = datetime.now()
    tokenTuple.dataState = state
    tokenTuple.put()
    
class CrawlSocialGraph(webapp2.RequestHandler):
    def handle_exception(self, exception, debug):
         # Log the error.
        logger.exception(exception)
        jsonp(self, "err", {"error":str(exception)})
        
    def get(self):
        session = self.request.environ['beaker.session']
        if not(isLogin(session)):
            # logging.error("data is %s" % (data))
            jsonp(self, "err", {"error":"login required"})
            return    
        
        # 读取uid的code
        tokenTuple = model.getAccessTokenByUid(session['uid'])
        if tokenTuple is None:
            logging.error("CounterWorker:oops, authorization token is missed.")
            return    
        
        timeDelta = datetime.now() - tokenTuple.lastCrawlTime    
        if timeDelta.days < 1:
            if tokenTuple.dataState == "crawled":
                jsonp(self, "err", {"error":"hey, you just crawled yesterday!!!"})
                return
            elif tokenTuple.dataState == "crawling":
                jsonp(self, "err", {"error":"hey, you are crawling yesterday!!!"})
                return
        
        taskqueue.add(queue_name="crawlqueue", url='/backendworker',
                      params={'uid': session['uid'], 'access_token':tokenTuple.accessToken, 'expireIn':tokenTuple.expireIn}
                      , target='crawlbackend')  # 
        crawlState(tokenTuple, "crawling")
        logging.debug("submit crawl task success")
        jsonp(self, "ok", {})    

class CrawlSuccess(webapp2.RequestHandler):
    def get(self):
        session = self.request.environ['beaker.session']
        if not(isLogin(session)):
            # logging.error("data is %s" % (data))
            jsonp(self, "err", {"error":"login required"})
            return    
        
        # 读取uid的code
        tokenTuple = model.getAccessTokenByUid(uid)
        if tokenTuple is None:
            logging.error("CounterWorker:oops, authorization token is missed.")
            return    
        crawlState(tokenTuple, "crawled")

application = app([('/crawlsuccess.*', CrawlSuccess),
                                       ('/crawl.*', CrawlSocialGraph)])
"""
def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
"""
