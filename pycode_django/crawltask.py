# -*- coding: utf-8 -*-
import webapp2
import model
from weibo import *
import sys, os
from jsonp import *
from datetime import datetime
import logging
from time import time, sleep
import Queue
from config import *
import threading

def crawlState(tokenTuple, state):
    tokenTuple.lastCrawlTime = datetime.now()
    tokenTuple.dataState = state
    tokenTuple.put()     

class CrawlThread(threading.Thread):  
    def __init__(self, uid, workQueue, resultQueue):  
        threading.Thread.__init__(self)  
        self.workQueue = workQueue
        self.resultQueue = resultQueue        
        self.uid = uid
    def run(self):
        start = time()
        counter = 0
        retryCount = 5
        retry = retryCount
        while True :
            u = None
            try :
                u = self.workQueue.get(True, 2)  # waiting for 2s
            except Queue.Empty:
                break
            
            retry = retryCount
            while retry > 0:
                 try:
                    b = client1.friendships.friends.in_common.get(uid=str(u[0]), suid=self.uid)
                    if len(b.users) > 0:  
                      # logger.debug("fetched common friends of %s,%s. length:%d" % (uid, str(u), len(b.users)))
                      posting = set()
                      for u1 in b.users:
                           #posting.add(u1.name.encode("utf-8", "ignore"))
                           posting.add(u1.name)
                      #self.resultQueue.put((u[1].encode("utf-8", "ignore"), posting), True)
                      self.resultQueue.put((u[1], posting), True)
                      counter += 1
                      if counter % 10 == 0:
                          end = time()
                          logging.debug("have crawled in_comm %d, time elapsed:%d" % (counter, end - start))
                    break
                 except Exception, e: 
                     logging.error("crawling comm friends %s" % (str(e)))
                     sleep(1)
                     ex = e
                     retry -= 1
                     continue
            if retry == 0:
                self.workQueue.put(u)
            
        if retry == 0:
            logging.error("crawl followships between friends exception:%s" % (str(ex)))
             
class CrawlWorker(webapp2.RequestHandler):
    def crawlCommFriend(self, uid, workQueue, resultQueue):
        return self.crawlCommFriendMt(uid, workQueue, resultQueue)
        #return True
    def crawlCommFriendMt(self, uid, workQueue, resultQueue):
        logging.debug("multithread crawl procedure has started with %d tasks" % (workQueue.qsize()));
        while not(workQueue.empty()):
            try:
                workers = []
                for i in range(0, 10):
                    worker = CrawlThread(uid, workQueue, resultQueue)
                    worker.start()
                    workers.append(worker)
                logging.debug("all crawl threads have started");
                for worker in workers:
                    worker.join();
                logging.debug("all crawl threads have ended");
            except Exception, e:
                logging.error(e)
        logging.debug("multithread crawl procedure has ended");
        return True
    
    def crawlCommFriendSt(self, uid, workQueue, resultQueue):
        # x:a->b a->x b->x 
        # 获取 好友中与授权用户中共同关注的人
        counter = 0
        start = time()
        retryCount = 5
        for u in workQueue:
            retry = retryCount
            while retry > 0:
                 try:
                    b = client1.friendships.friends.in_common.get(uid=str(u), suid=uid)
                    if len(b.users) > 0:  
                      # logger.debug("fetched common friends of %s,%s. length:%d" % (uid, str(u), len(b.users)))
                      posting = set()
                      for u1 in b.users:
                           posting.add(long(u1.id)) 
                      resultQueue.put((long(u), posting))
                      counter += 1
                      if counter % 10 == 0:
                          end = time()
                          logging.debug("have crawled in_comm %d, time elapsed:%d" % (counter, end - start))
                    break
                 except Exception, e: 
                     logging.error("crawling comm friends %s" % (str(e)))
                     sleep(1)
                     ex = e
                     retry -= 1
                     continue
            if retry == 0:
                break
            
        if retry == 0:
            crawlState(tokenTuple, "uncrawled")
            logging.error("crawl followships between friends exception:%s" % (str(ex)))
            return False
        return True
    
    def post(self):  # should run at most 1/s
        uid = self.request.get('uid')
        logging.debug("start crawling uid:%s in the backend" % (str(uid)))
        global client  
        global client1
        global r
        retryCount = 5
        # 读取uid的code
        tokenTuple = model.getAccessTokenByUid(uid)
        if tokenTuple is None:
            logging.error("CounterWorker:oops, authorization token is missed.")
            return    
        
        crawlState(tokenTuple, "crawling")
        adjMatrix = {}
        # code = self.request.get('code')
        retry = retryCount
        ex = None
        while retry > 0:
            try:
                client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
                client.set_access_token(tokenTuple.accessToken, tokenTuple.expireIn)
                client1 = APIClient(app_key=APP_KEY1, app_secret=APP_SECRET1, redirect_uri=CALLBACK_URL1)
                client1.set_access_token('2.00q1QngBmNsuODc494aab9ffbftYqB', 2619960)
                break
            except Exception, e : 
                retry -= 1
                logging.error("require access code:%s" % str(e))
                ex = e
                
        if retry == 0:
            crawlState(tokenTuple, "uncrawled")
            logging.error("CounterWorker:require APIClient exception%s" % (str(ex)))
            return
        
        retry = retryCount
        ex = None
        user = None
        while retry > 0:
            try:
                user = client.users.show.get(uid=uid, source=APP_KEY)
                break
            except Exception, e : 
                retry -= 1
                logging.error("get user information error%s" % str(e))
                ex = e
    
        uname = None
        if not(user is None):   
            #uname = user.name.encode("utf-8", "ignore")
            uname = user.name
        else: 
             crawlState(tokenTuple, "uncrawled")
             logging.error("get user information failed: error%s" % (str(ex)))
             return
         
        resFriends = []
        resCommonFriends = []
        
        # 获取授权用户的好友
        retry = retryCount
        start = time()
        workQueue = Queue.Queue()
        friends = []
        cursor = 0
        while (True):
            while retry > 0:
                try:
                    # f = client.friendships.friends.ids.get(uid=uid, count=str(2000))
                    f = client.friendships.friends.get(uid=uid, count=str(200), cursor=cursor)
                    if len(f.users) > 0:
                        cursor = f.next_cursor
                        for u in f.users:
                            #friends.append(u.name.encode('utf-8', 'ignore')) 
                            friends.append(u.name) 
                            workQueue.put((u.id, u.name))
                        logging.debug("fetched friends of %s. length:%d" % (uid, len(f.users)))
                        break
                    else:
                        cursor = 0
                        break
                except Exception, e: 
                    logging.error("crawling friendship:%s" % str(e))
                    ex = e
                    retry -= 1     
            if cursor == 0:
                break
        if retry == 0:
            crawlState(tokenTuple, "uncrawled")
            logging.error("crawl friends failed:%s" % (str(ex)))
            return    
        
        end = time()
        logger.debug("crawling friendship costs:%s s" % (end - start))             
        
        resultQueue = Queue.Queue()
        if not(self.crawlCommFriend(uid, workQueue, resultQueue)):
            crawlState(tokenTuple, "uncrawled")
            logging.debug("crawl failed") 
            return
        # 存储数据
        # TODO:
                               
        edges = []
        while not(resultQueue.empty()):
            tuple = resultQueue.get()
            for end in tuple[1]:
                edges.append("%s@%s" % (tuple[0], end))
        
        model.insertExSocialGraph(uid, uname, friends, edges)
        # record = model.getAccessTokenByUid(uid)
        crawlState(tokenTuple, "crawled")
        logging.debug("crawl success")  
        # self.response.redirect("/crawlsuccess")
        
application = webapp2.WSGIApplication([('/backendworker', CrawlWorker)],
                              debug=True)
