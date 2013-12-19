import os
import webapp2
from google.appengine.api import taskqueue
from google.appengine.ext import db



class Counter(db.Model):
    count = db.IntegerProperty(indexed=False)

class CounterWorker(webapp2.RequestHandler):
    def post(self):  # should run at most 1/s
        uid = self.request.get('uid')
    self.response.out.write('%s' % uid) 

application = webapp2.WSGIApplication([('/worker', CounterWorker)],
                              debug=True)
