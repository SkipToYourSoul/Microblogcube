# -*- coding: utf-8 -*-
import models
import datetime
import logging
from django.http import HttpResponse

logger=logging.getLogger(__name__)
def test(request):
    token = models.insertAccessToken(uid=1, accessToken=u"夏帆",expireIn=1000, dataState="state", lastCrawlTime=datetime.datetime.now())
    token = models.getAccessTokenByUid(1)
    logger.debug(type(token.accessToken))
    return HttpResponse(u"type is %s"%(token.accessToken))