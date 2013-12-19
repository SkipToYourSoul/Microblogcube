# -*- coding: utf-8 -*-
try:
    import json
except:
    import simplejson as json
import logging
from django.http import HttpResponse, HttpResponseRedirect

"""
# 创建一个logger
logger = logging.getLogger('jsonp')
logger.setLevel(logging.DEBUG)
# 再创建一个handler，用于输出到控制台
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
# 定义handler的输出格式
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
# 给logger添加handler
logger.addHandler(ch)
"""
logger = logging.getLogger(__name__)
def jsonp(request, state, data):
    if not('callback' in request.GET):
        return HttpResponseRedirect('/index.html')
    callback = request.GET['callback']  
    resp = {"state":state,
            "result": data}

    respj = json.dumps(resp, encoding="UTF-8", ensure_ascii=False)
    #logger.info("respj");
    #logger.info(respj);
    resps = u'%s(%s);' % (callback, respj)
    #logger.info("resps");
    #logger.info(resps);
    # response = HttpResponse(resps)
    # response['Content-Type'] = "text/javascript" 
    ret = HttpResponse(resps)
    ret['Content-Type'] = "text/javascript"
    ret['charset'] = "UTF-8"
    return ret

def isLogin(session):
    if ("uid" in session):
        return True
    return False
