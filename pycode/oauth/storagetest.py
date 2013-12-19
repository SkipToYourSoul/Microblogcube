# -*- coding: utf-8 -*-
import os
import webapp2
from google.appengine.api import taskqueue
from google.appengine.ext import db
import logging
# 创建一个logger
logger = logging.getLogger('storagetest')
logger.setLevel(logging.DEBUG)
# 再创建一个handler，用于输出到控制台
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
# 定义handler的输出格式
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
# 给logger添加handler
logger.addHandler(ch)

class Counter(db.Model):
    id = db.StringProperty()
    count = db.IntegerProperty()

class StorageCall(webapp2.RequestHandler):
    def get(self):  # should run at most 1/s
        taskqueue.add(url='/test/storage/backend', params={})  # 
        rec = Counter(id="id", count=1)
        rec.put()
        self.response.out.write('nothing') 
        

class StorageBackendTest(webapp2.RequestHandler):
    def post(self):  # should run at most 1/s
        q = db.Query(Counter).filter("id = ", "id")
        count = 0
        for rec in q:
            count += 1
        logger.debug('count:%d' % (count)) 
        
        
application = webapp2.WSGIApplication([('/test/storage/call', StorageCall),
                                       ('/test/storage/backend', StorageBackendTest)],
                              debug=True)
