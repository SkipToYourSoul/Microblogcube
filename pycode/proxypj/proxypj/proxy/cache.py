# encoding:utf-8
import logging
import redis
from django.conf import settings
logger = logging.getLogger(__name__)
"""
从缓存中读取数据
TODO 是否需要进行压缩？
"""
def readCache(key):
    if not(key is None):
      r = redis.StrictRedis(connection_pool=settings.POOL)
      cacheR = r.get(key)
      if not(cacheR is None):
          logger.debug("cache hit%s" % (cacheR))
          return cacheR
    return None


def updateCache(key, value):
    if not(key is None):
        logger.debug("query:%s; cache updated" % (key))
        r = redis.StrictRedis(connection_pool=settings.POOL)
        r.setex(key, settings.CACHE_EXPIRE, value)