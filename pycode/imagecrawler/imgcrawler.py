#encoding=utf-8
#1. 关键词配置文件： 关键词列表，每行一个关键词，#开头为注释
#2. 项目配置文件：
import ConfigParser
import json
import logging
import sys
import os 
import socket
import urllib
import imagechooser
import time 
import datetime
import http

socket.setdefaulttimeout(100)
URL_PATTERN = "http://image.baidu.com/i?tn=baiduimagejson&ct=201326592&cl=2&lm=-1&st=-1&fm=result&fr=&sf=1&fmq=1349413075627_R&pv=&ic=0&nc=1&z=&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&ie=utf-8&word=%s#z=2&rn=%s&pn=%s"
# 再创建一个handler，用于输出到控制台  
ch = logging.StreamHandler()  
ch.setLevel(logging.DEBUG)  
logger = logging.getLogger() 
logger.addHandler(ch)
logger.setLevel("INFO")

class IMGCrawler:
    def __init__(self):
        cf = ConfigParser.ConfigParser()
        cf.read("./config")
        self.imgDir = cf.get("store", "imgdir")
        self.kwFile = cf.get("seed", "kwlist")
        logger.info("imgdir:"+self.imgDir)
        logger.info("kwlist file:" + self.kwFile)
        self.checkDir(self.imgDir)
        
    def search(self, kw, limit):
        url = (URL_PATTERN)%(kw, 5, 1)
        res= http.get(url)
        if res.info().getheader('Content-Type').find("java")!= -1:
            return res.read()
        else:
            #需要输入验证码
            return http.handleSiteBlock(url, res.read())
         #  return None
    
    def checkDir(self, dir):
        if os.path.isdir(dir): 
            pass 
        else: 
            os.mkdir(dir)
            
    def crawlImg(self, url):
        try:
            respHtml = http.get(url).read()
            return respHtml
        except Exception, e:
            logger.error('Error code:%s'%(e))
        return None
    
    def storeImg(self, im, file):
        try:
            respHtml = http.get(url).read()
            binfile = open(file, "wb");
            binfile.write(respHtml);
            binfile.close();
            return True
        except Exception, e:
            logger.error('Error code:%s'%(e))
        return False
    
    def crawlImg1(self, url , file):
        try:
            urllib.urlretrieve(imgRec['objURL'], (self.imgDir+"/%s/%d.jpg")%(line, i))
        except IOError:
            return False
        return True
    
    def crawl(self):
        kwFile = open(self.kwFile,"r")
        failList=[]
        imgInfoFile = open(self.imgDir+"imgMap.txt", "w")
        line = kwFile.readline()
        cont = True
        try:
            while cont:    
                if not line.startswith("#"):
                    line = line.rstrip().replace(" ", "")
                    if len(line) == 0:
                        break
                    dataFetched = False
                    while not dataFetched:
                        try:
                            time.sleep(2)
                            ret = self.search(line, 5)
                            logger.info(ret)
                            ret = ret.decode("gb18030"); 
                            obj = json.loads(ret)
                            dataFetched=True
                        except  Exception,e: 
                            logger.error("exception search: %s"%(e))
                            time.sleep(2)
                    
                    if not dataFetched:
                        failList.append(line)
                        continue
        
                    self.checkDir(self.imgDir+"/%s"%(line))
                    imgUrls=[]
                    for imgRec in obj['data']:
                        if imgRec.has_key('objURL'):
                            logger.info("cralwing %s, url:%s"%(line, imgRec['objURL']))
                            
                            starttime = datetime.datetime.now()
                            im = self.crawlImg(imgRec['objURL'])
                            endtime = datetime.datetime.now()
                            interval=(endtime - starttime).seconds
                            #抛弃延时太长的图片
                            if (interval < 5 and not(im is None) and imagechooser.choose(line, im, imgRec['objURL'], imgRec['fromPageTitleEnc'])):
                                imgUrls.append(imgRec['objURL'])
                                if len(imgUrls) >=2:
                                    break
                    imgInfoFile.write("%s\t%s\n"%(imgUrls[0], imgUrls[1]))
                try:
                    line = kwFile.readline()
                except EOFError,e:  
                    cont = False
        finally:
            imgInfoFile.close()
            
if __name__ == "__main__":
    cralwer = IMGCrawler()
    cralwer.crawl()