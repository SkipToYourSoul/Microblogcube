from beaker.middleware import SessionMiddleware
import webapp2

def app(handlers):
    app = webapp2.WSGIApplication(handlers, debug=True)
    session_opts = {
            'session.type': 'ext:google',
            'session.cookie_expires': 300,
            'session.auto': True
            # 'session.time_out':300,
            }
    app = SessionMiddleware(app, session_opts)
    return app
