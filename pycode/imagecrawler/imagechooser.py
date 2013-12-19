#!/usr/bin/env python
#encoding=utf-8
import cStringIO, urllib2, Image
import math

#print im.format, im.size, im.mode
#判断是否选择当前img
prefSize=700*700

def choose(kw, rawImg, url, title):
    #url = 'http://www.01happy.com/wp-content/uploads/2012/09/bg.png'
    #file = urllib2.urlopen(url)
    try:
        tmpIm = cStringIO.StringIO(rawImg)
        im = Image.open(tmpIm)
    except Exception,e:
        return False
    
    if  math.fabs(im.size[0]-500) < 400 and math.fabs(im.size[1]-500) < 300:
        return True
    return False