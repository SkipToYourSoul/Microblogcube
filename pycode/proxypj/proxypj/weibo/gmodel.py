# -*- coding: utf-8 -*-
from google.appengine.ext import db

class AccessToken(db.Model):
    uid = db.IntegerProperty(required=True)
    accessToken = db.StringProperty(indexed=False)
    expireIn = db.IntegerProperty(indexed=False)
    dataState = db.StringProperty(indexed=False)  # uncrawled,crawling, crawled
    lastCrawlTime = db.DateTimeProperty(indexed=False)
    
def getAccessTokenByUid(uid):
    q = db.Query(AccessToken).filter("uid = " , long(uid))
    return q.get()

def insertAccessToken(uid, accessToken, expireIn, dataState, lastCrawlTime):
    record = getAccessTokenByUid(uid)
    if not(record is None):
        record.accessToken = accessToken
        record.expireIn = expireIn
        record.dataState = dataState
        record.lastCrawlTime = lastCrawlTime
    else:
        record = AccessToken(uid=long(uid), accessToken=accessToken, expireIn=expireIn,
                          dataState=dataState, lastCrawlTime=lastCrawlTime)
    record.put()

class SocialGraph(db.Model):
    start = db.StringProperty()
    end = db.StringProperty()
    
class ExSocialGraph(db.Model):
    uid = db.IntegerProperty(required=True)
    name = db.StringProperty(required=True)
    # friends = db.ListProperty(long, required=True)
    friends = db.ListProperty(unicode, required=True)
    edges = db.ListProperty(unicode, required=True, indexed=False)

def queryExSocialGraphByUid(uid):
    q = db.Query(ExSocialGraph).filter("uid = " , long(uid))
    return q.get()

def insertExSocialGraph(uid, uname, friends, edges):
    record = queryExSocialGraphByUid(uid)
    if not(record is None):
        record.name = uname
        record.friends = friends
        record.edges = edges
    else:
        record = ExSocialGraph(uid=long(uid), name=uname, friends=friends, edges=edges)
    record.put()

# deprecated:用户相关信息,在线爬取
class UserInfo(db.Model):
    uid = db.IntegerProperty(required=True)
    imgUrl = db.StringProperty(indexed=False)
    uname = db.StringProperty(indexed=False)

def insertUserInfo(uid, imgUrl, uname):    
    record = Userinfo(uid=long(uid), imgUrl=imgUrl, uname=uname)
    record.put()

def getUserInfoByUid(uid):
    q = db.Query(UserInfo).filter("uid = ", uid)
    return q.get()
