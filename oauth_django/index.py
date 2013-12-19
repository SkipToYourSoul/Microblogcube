
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import cgi
import sys, os
import wsgiref.handlers
from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.ext.webapp import template


_DEBUG = True


class BaseRequestHandler(webapp.RequestHandler):
  """"""
  def render(self, template_name, template_values={}):
    values = {
      'request': self.request,
      'application_name': 'test',
    }
    values.update(template_values)
    directory = os.path.dirname(__file__)
 
    path = os.path.join(directory, os.path.join('', template_name))
    self.response.out.write(str(template.render(path, values, debug=_DEBUG)))
 
class IndexPage(BaseRequestHandler):
  def get(self):
      
   
      
   data= self.request.cookies.get('friend')
  
  #for p in data:
   self.response.out.write('%s' % data) 

   #self.render('welcome.html', {
     # 'title': 'welcome',
     # 'data': data
   # })


application = webapp.WSGIApplication([
  ('/welcome', IndexPage)
], debug=_DEBUG)


def main():
  wsgiref.handlers.CGIHandler().run(application)
 
if __name__ == '__main__':
  main() 