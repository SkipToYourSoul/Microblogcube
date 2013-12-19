# encoding:utf-8
import urllib
import urllib2
import cookielib

# 阻止urllib2自动重定向
class RedirectHandler(urllib2.HTTPRedirectHandler):
    def http_error_301(self, req, fp, code, msg, headers):
        print("http_error_301 code:%s, message:%s, headers:%s"(code, msg, headers))
        result = urllib2.HTTPRedirectHandler.http_error_301(self, req, fp, code, msg, headers)              
        result.status = code                                
        return result 
    def http_error_302(self, req, fp, code, msg, headers):
        print("http_error_302 code:%s, message:%s, headers:%s"(code, msg, headers))
        result = urllib2.HTTPRedirectHandler.http_error_302(self, req, fp, code, msg, headers)              
        result.status = code    
    def http_response(self, request, response):
        print("nodirection")
        return response
    



# 修改超时
urllib2.socket.setdefaulttimeout(60)

keys = ['Location', 'QUERY_STRING', 'CONTENT_LENGTH', 'HTTP_ACCEPT_ENCODING', 'REQUEST_METHOD', 'HTTP_USER_AGENT']

def proxy(url):
    #request = urllib2.Request('http://sinaoauth1.appspot.com/account/signin')
    #f = opener.open(request)
    #return
    """
    1. 获取请求的cookie
    2. 拼接请求的url
    """
    proxy_handler = urllib2.ProxyHandler({'http':'http://127.0.0.1:8087'})
    cj = cookielib.CookieJar()
    opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj),proxy_handler)
    # 下面的url.quote至关重要，否则发出去的查询可能由于没有转义而无法解析

    print("url is %s" % (url))
    req = urllib2.Request(url)

    # 设置meta
    # for key in request.META:
    #    req.add_header(key, request.META[key])
    # opener.addheaders = headers


    # logger.debug("meta:%s"%(str(request.META)))

    print ("launch request")
    ret = None
    try:
        resp = opener.open(req)    
        print("query launched: resp url is %s" % (resp.url))
        data = resp.read()
        #print data
        print resp.info()
        # logger.debug("data is %s"%(str(data)))
        # for key in resp.info():
       
        # logger.debug("info:%s"%(str(resp.info())))
    except Exception, e:
        print(e)
