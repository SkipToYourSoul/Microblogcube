# encoding=utf-8
import urllib
import urllib2
import cookielib
import re
import logging
from lxml import etree
from lxml.html import fromstring, tostring,submit_form

ch = logging.StreamHandler()  
ch.setLevel(logging.DEBUG)  
logger = logging.getLogger() 
logger.addHandler(ch)
logger.setLevel("INFO")
def get(url):
    logger.info("launch query:" + url)
    user_agent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 Chrome/24.0.1271.64 Safari/537.11'    
    headers = {'User-Agent':user_agent,
              'Accept':'text/html;q=0.9,*/*;q=0.8',
                   'Accept-Charset':'gb18030,utf-8;q=0.7,*;q=0.3',
                   # 'Accept-Encoding':'gzip',
                   'Connection':'close',
                   'Referer':None  # 注意如果依然不能抓取的话，这里可以设置抓取网站的host
                   }
        
    cookie_support = urllib2.HTTPCookieProcessor(cookielib.CookieJar())
    opener = urllib2.build_opener(cookie_support, urllib2.HTTPHandler)
    urllib2.install_opener(opener)   
    req = urllib2.Request(url, None, headers)    
    response = urllib2.urlopen(req)
    return response

def post(url, data, referer):
    logger.info("launch query:" + url)
    user_agent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 Chrome/24.0.1271.64 Safari/537.11'    
    headers = {'User-Agent':user_agent,
              'Accept':'text/html;q=0.9,*/*;q=0.8',
                   'Accept-Charset':'gb18030,utf-8;q=0.7,*;q=0.3',
                   # 'Accept-Encoding':'gzip',
                   'Connection':'close',
                   'Referer':referer  # 注意如果依然不能抓取的话，这里可以设置抓取网站的host
                   }
        
    cookie_support = urllib2.HTTPCookieProcessor(cookielib.CookieJar())
    opener = urllib2.build_opener(cookie_support, urllib2.HTTPHandler)
    urllib2.install_opener(opener)  
         
    data = urllib.urlencode(data)    
    req = urllib2.Request(url, data, headers)    
    response = urllib2.urlopen(req)
    return response

# 处理需要验证码的情况
def handleSiteBlock(url, page):
    data = {"url": 'sdf', "vcode":'sdf', "id":'sdf', "di":'sdf', "verifycode":'sdf'}
    #re.find(r"<input type=\"hidden\" name=\"url\" value=\"*?\" [^>]*>")
    print page    
    tree = etree.HTML(page)
    r = tree.xpath('//div[./@id="vf"]/form/@action')
    url = r[0]
    r = tree.xpath('//input[@type="hidden"][@name="url"]/@value')
    data['url'] = r[0]
    r = tree.xpath('//input[@type="hidden"][@name="vcode"]/@value')
    data['vcode'] = r[0]
    r = tree.xpath('//input[@type="hidden"][@name="id"]/@value')
    data['id'] = r[0]
    r = tree.xpath('//input[@type="hidden"][@name="di"]/@value')
    data['di'] = r[0]
    r = tree.xpath('//input[@type="hidden"][@name="verifycode"]/@value')
    data['verifycode'] = r[0]
    return post(url, data, url)
#<img src="http://verify.baidu.com/cgi-bin/genimg?405F337975374C617586AF6AA757444CEEA46E9BDF5C13A3BC49F126894C7A587D76771ADF9ADB60A443FB00F7B88833A46703767504" width="120" height="40">
#<form action="http://verify.baidu.com/verify">
#<input type="hidden" name="url" value="http://image.baidu.com/i?tn=baiduimagejson&ct=201326592&cl=2&lm=-1&st=-1&fm=result&fr=&sf=1&fmq=1349413075627_R&pv=&ic=0&nc=1&z=&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&ie=utf-8&word=3B大战">
#<input type="hidden" name="vcode" value="405F337975374C617586AF6AA757444CEEA46E9BDF5C13A3BC49F126894C7A587D76771ADF9ADB60A443FB00F7B88833A46703767504">
#<input type="hidden" name="id" value="1380087316">
#<input type="hidden" name="di" value="d026d20ba1148bdb">
#<input type="text" size="6" maxlength="10" name="verifycode" id="kw">    
#<input type="submit" value="�ύ">
if __name__=="__main__":
    file = open("verify.html")
    xml = ""
    for line in file:
        xml += line
    tree = fromstring(xml)
    #print xml
   # r = tree.xpath('//form')
    form = tree.forms[0]
    print tree.xpath('//div[@id="vf"]/img/@src')[0]
    #submit_form(page.forms[1])
    #print "--"+form.attrib['action']
    verifyCode = raw_input("输入验证码：")
    form.fields["verifycode"]=verifyCode
    print submit_form(form).read()