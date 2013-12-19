# -*- coding: utf-8 -*-
try:
    import json
except:
    import simplejson as json
import logging

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

def jsonp(handle, state, data):
    callback = handle.request.get('callback')    
    resp = {"state":state,
             "result": data}
    respj = json.dumps(resp, encoding="UTF-8")
    resps = '%s(%s);' % (callback, str(respj))
    #logger.error(resps)
    # response = HttpResponse(resps)
    # response['Content-Type'] = "text/javascript" 
    handle.response.headers['Content-Type'] = "text/javascript"
    handle.response.headers['charset'] = "UTF-8"
    handle.response.out.write(resps)

def isLogin(session):
    if ("uid" in session):
        return True
    return False