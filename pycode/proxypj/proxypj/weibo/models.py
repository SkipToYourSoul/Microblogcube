# -*- coding: utf-8 -*-
from django.db import models
import taskmanager
import logging
from django.utils.encoding import smart_unicode

class AccessToken(models.Model):
    uid = models.BigIntegerField(primary_key=True)
    accessToken = models.CharField(max_length=60)
    expireIn = models.BigIntegerField()
    dataState = models.CharField(max_length=30)  # uncrawled,crawling, crawled
    lastCrawlTime = models.DateTimeField()
    
def getAccessTokenByUid(uid):
    q = AccessToken.objects.filter(uid=long(uid))
    if q:
        return q.get()
    else:
        return None

def insertAccessToken(uid, accessToken, expireIn, dataState, lastCrawlTime):
    record = getAccessTokenByUid(uid)
    if not(record is None):
        record.accessToken = accessToken.encode('utf-8', 'ignore')
        record.expireIn = expireIn
        record.dataState = dataState
        record.lastCrawlTime = lastCrawlTime
    else:
        record = AccessToken(uid=long(uid), accessToken=accessToken, expireIn=expireIn,
                          dataState=dataState, lastCrawlTime=lastCrawlTime)
    record.save()

    
class ExSocialGraph(models.Model):
    uid = models.BigIntegerField()
    name = models.CharField(max_length=30)
    # friends = db.ListProperty(long, required=True)
    friends = models.TextField()
    edges = models.TextField()

def queryExSocialGraphByUid(uid):
    q = ExSocialGraph.objects.filter(uid=long(uid))
    if q:
        return q.get()
    else:
        return None

def insertExSocialGraph(uid, uname, friends, edges):
    record = queryExSocialGraphByUid(uid)
    friends = u";".join(friends)
    edges = u";".join(edges)
    edges = smart_unicode(edges, errors='ignore')
    friends = smart_unicode(friends, errors='ignore')
    logging.debug("start insertExSocialGraph ")
    if not(record is None):
        # logging.debug("update ExSocialGraph:%s;%s;%s;%s;" % (uid, uname, friends, edges))
        record.name = uname
        record.friends = friends
        record.edges = edges
    else:
        # logging.debug("insertExSocialGraph:%s;%s;%s;%s;" % (uid, uname, friends, edges))
        record = ExSocialGraph(uid=long(uid), name=uname, friends=friends, edges=edges)
    record.save()

