# -*- coding: utf-8 -*-
from google.appengine.ext import webapp
from google.appengine.ext import django
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db
from weibo import *
import cgi
import sys, os
import wsgiref.handlers
from google.appengine.ext.webapp import template

import logging

# 创建一个logger
logger = logging.getLogger('test')
logger.setLevel(logging.DEBUG)
# 再创建一个handler，用于输出到控制台
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
# 定义handler的输出格式
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
# 给logger添加handler
logger.addHandler(ch)

class MainPage(webapp.RequestHandler):
    def render(self, template_name, template_values={}):
        values = {
            'request': self.request,
            'application_name': 'test',
            }
    
        values.update(template_values)
    
        directory = os.path.dirname(__file__)
 
        path = os.path.join(directory, os.path.join('', template_name))
        logger.info("finish")
        self.response.out.write(str(template.render(path, values, debug=_DEBUG)))
    
    def get(self):

        for i in range(0,10000):
            logger.info(i)
        self.redirect('http://www.google.com')

application = webapp.WSGIApplication([('/test', MainPage)], debug=True)
def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
