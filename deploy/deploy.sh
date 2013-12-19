#deploy the backend
scp -r /Users/xiafan/Documents/workspace/EventDemo/pycode/proxypj root@10.11.1.212:/home/microblogcube
#deploy the frontend
scp -r /Users/xiafan/Documents/workspace/EventDemo/www/www root@10.11.1.212:/home/microblogcube



from testproxy import *
proxy('http://sinaoauth1.appspot.com/account/signin')


import urllib2, httplib,cookielib
proxy_handler = urllib2.ProxyHandler({'http':'http://127.0.0.1:8087'})
cj = cookielib.CookieJar()
opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj),proxy_handler)
request = urllib2.Request('http://sinaoauth1.appspot.com/account/signin')
f = opener.open(request)
f.url
f.headers.dict
