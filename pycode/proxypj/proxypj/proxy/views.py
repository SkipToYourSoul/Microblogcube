# encoding:utf-8
# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect
from django.conf import settings
import urllib
import urllib2
import cookielib
import logging
import random
import cache

logger = logging.getLogger(__name__)

# 阻止urllib2自动重定向
class RedirectHandler(urllib2.HTTPRedirectHandler):
    def http_error_301(self, req, fp, code, msg, headers):
        logger.info("http_error_301 code:%s, message:%s, headers:%s"(code, msg, headers))
        result = urllib2.HTTPRedirectHandler.http_error_301(self, req, fp, code, msg, headers)              
        result.status = code                                
        return result 
    def http_error_302(self, req, fp, code, msg, headers):
        logger.info("http_error_302 code:%s, message:%s, headers:%s"(code, msg, headers))
        result = urllib2.HTTPRedirectHandler.http_error_302(self, req, fp, code, msg, headers)              
        result.status = code    
    def http_response(self, request, response):
        logger.info("nodirection")
        return response

"""
抽取查询
返回的结果：（查询类型，查询语句）
sql
tq
"""
queryType = ["sql", "tq"]
def extractQuery(request):
    for query in queryType:
        if (query in request.GET):
            return (query, request.GET[query].encode('utf-8', 'ignore'))
    return [None, None]


# 修改超时
urllib2.socket.setdefaulttimeout(settings.SOCKET_TIMEOUT)


keys = ['Location', 'QUERY_STRING', 'CONTENT_LENGTH', 'HTTP_ACCEPT_ENCODING', 'REQUEST_METHOD', 'HTTP_USER_AGENT']



def proxy(request, target):
    """
    从redis中预取数据
    """
    query = extractQuery(request)
    cacheRet = cache.readCache(query[1])
    if not(cacheRet is None):
        ret = HttpResponse(cacheRet)
        ret['Content-Type'] = "text/javascript"
        return ret
        
    """
    1. 获取请求的cookie
    2. 拼接请求的url
    """
    proxy_server = settings.PROXY_SERVERS[random.randint(0, len(settings.PROXY_SERVERS) - 1)]
    logger.info("proxy %s is used" % (proxy_server))
    proxy_handler = urllib2.ProxyHandler({'http' : proxy_server})
    redirect_handler = urllib2.HTTPRedirectHandler()
    cj = cookielib.CookieJar()
    opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj), proxy_handler) 
# 拼接请求的url
    params = "?"
    # 下面的url.quote至关重要，否则发出去的查询可能由于没有转义而无法解析
    
    for key in request.GET:
        params = "".join([params,
                          str(key.encode('utf-8', 'ignore')),
                          "=" ,
                          urllib.quote(str(request.GET[key].encode('utf-8', 'ignore'))),
                          "&"])
    if len(params) > 0:
        params = params[0:-1]
    url = target + params

    # logger.info("url is %s" % (url))
    req = urllib2.Request(url)
 
 # 设置cookie
    cookie = ""
    for key in request.COOKIES:
        cookie = "".join([cookie,
                          str(key.encode('utf-8', 'ignore')),
                          "=",
                          str(request.COOKIES[key].encode('utf-8', 'ignore')),
                          ";"])
    if len(cookie) > 0:
        cookie = cookie[0:-1]
        logger.debug("cookie is %s" % (cookie))
        req.add_header('Cookie', cookie)
    # headers = []
    # headers.append(("Cookie", cookie))
    
    # logger.info("cookie is %s" % (cookie))
# 设置meta
    # for key in request.META:
    #    req.add_header(key, request.META[key])
 
    for key in keys:
        if key in request.META:
            # headers.append((key, request.META[key]))
            # logger.info("%s:%s" % (key, request.META[key]))
            req.add_header(key, request.META[key])
 
    # opener.addheaders = headers


    # logger.debug("meta:%s"%(str(request.META)))

    logger.debug("launch request")
    ret = None
    try:
        resp = opener.open(req)    
        # logger.info("query launched: resp url is %s" % (resp.url))
        logging.debug("resp:%s" % (resp.info()))
        if url == resp.url:
            data = resp.read()
            
            """
            更新redis中的数据
            """
            cache.updateCache(query[1], data)

            ret = HttpResponse(data)
            # logger.debug("data is %s"%(str(data)))
            # for key in resp.info():
            ret['Content-Type'] = resp.info()['Content-Type']
            if 'Set-Cookie' in resp.info():
                ret['Set-Cookie'] = resp.info()['Set-Cookie']
            
            # logger.debug("info:%s"%(str(resp.info())))
        else:
            logging.debug("redirect encoutered")
            ret = HttpResponseRedirect(resp.url)
            # ret['Cookie'] = resp.info()['Cookie']
    except Exception, e:
        logger.error(e)
        ret = HttpResponse("alert('%s');" % (str(e)))
        ret['Content-Type'] = "text/javascript"
    return ret
"""
#这个方案不可行，由于oautho在callback之后需要redirect，但是database的域名和oauth的域名不一致，
#导致cookie无法设置，因此session无法使用
def DataStateAction(request):
    return proxy(request, settings.OAUTH_SERVER + 'userinfo/datastate')
def UserInfoAction(request):
    return proxy(request, settings.OAUTH_SERVER + 'userinfo/userinfo')
def SocialGraphAction(request):
    return proxy(request, settings.OAUTH_SERVER + 'userinfo/socialgraph')
def CrawlSocialGraph(request):
    return proxy(request, settings.OAUTH_SERVER + 'crawl')


# 这个不会被调用
def Callback(request):
    return proxy(request, settings.OAUTH_SERVER + 'callback')

def SigninAction(request):
    return proxy(request, settings.OAUTH_SERVER + 'account/signin')
def LogoutAction(request):
    return proxy(request, settings.OAUTH_SERVER + 'account/logout')
"""
def GQLView(request):
    return proxy(request, settings.GSQL_SERVER)
def GVizView(request):
    return proxy(request, settings.GVIZ_SERVER)
def SearchView(request):
    return proxy(request, settings.SEARCH_SERVER)
