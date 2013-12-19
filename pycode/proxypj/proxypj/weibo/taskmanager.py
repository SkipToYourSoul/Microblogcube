# -*- coding: utf-8 -*-
from django.db import models
import logging
logger = logging.getLogger(__name__)

class CrawlTask(models.Model):
    uid = models.BigIntegerField()
    status = models.CharField(max_length=10)

def garbageCollect():
    #logging.info("garbageCollect")
    q = CrawlTask.objects.filter(status="success")
    #logging.info("garbage collect %d task start" % (len(q)))
    if q:
        for rec in q:
            rec.delete()
    #logging.info("garbage collect %d success tasks" % (len(q)))
    
def getCrawlTask(uid):  
    q = CrawlTask.objects.filter(uid=long(uid))
    if q:
        return q.get()
    else:
        return None

def pollCrawkTask(limit):
    q = CrawlTask.objects.filter(status="untouched")
    if q:
        q = q[0:limit]
        logging.info("schedule %d tasks for running" % (len(q)))
        for rec in q:
            rec.status = "running"
            rec.save()
        return q
    else:
        return None
    
def addCrawlTask(uid):
    rec = getCrawlTask(uid)
    if rec:
        return
    else:
        rec = CrawlTask(uid=uid, status="untouched")
        rec.save()

def crawlTaskFail(uid):
    rec = getCrawlTask(uid)
    if rec:
        rec.status = "untouched"    
        rec.save()

def crawlTaskSuccess(uid):
    rec = getCrawlTask(uid)
    if rec:
        rec.status = "success"    
        rec.save()
