# -*- coding: utf-8 -*-
from proxypj.weibo import models

import sys, time, os, atexit
import logging
from signal import SIGTERM


from django.core.management.base import BaseCommand
from django.utils.daemonize import become_daemon

from proxypj.weibo import crawltask

LOG_FORMAT = '%(asctime)s %(process)d:%(name)s %(levelname)s: %(message)s'
LOG_DATEFMT = '%Y-%m-%d %H:%M:%S %Z'

def _log_file():
    from django.conf import settings
    if hasattr(settings, 'TASKS_LOG_FILE'):
        return settings.TASKS_LOG_FILE
    else:
        return '/tmp/django-tasks.log'



#
# This class is inspired by http://www.jejik.com/articles/2007/02/a_simple_unix_linux_daemon_in_python/ ,
# which was been put in the public domain by its author, Sander Marechal (http://www.jejik.com),
# see http://www.jejik.com/articles/2007/02/a_simple_unix_linux_daemon_in_python/#c6
# 
#

class Daemon:
    def __init__(self, pidfile):
        self.pidfile = pidfile

    def daemonize(self):
        sys.stdout.flush()
        sys.stderr.flush()
        # TODO: give feedback to the user, on whether the daemon was started successfully,
        # i.e. verify that the daemon was started correctly.
        # This needs to be done in the *parent* process:
        # it  probably requires patching become_daemon, since we would have 
        # to add some processing *before* the sys.exit() for the parent.
        # This processing (a callback function ?) would likely wait for a few seconds while checking for the creation of the pidfile,
        # then wait another few seconds that the pid actually continues existing: if it doesn't continue existing, 
        # it would simply print an error.       
        become_daemon()

        atexit.register(self._delpid)
        self._setpid()

    def _delpid(self):
        try:
            os.remove(self.pidfile)
        except:
            pass

    def _setpid(self):
        file(self.pidfile, 'w+').write("%d\n" % os.getpid())
        
    def _getpid(self):
        try:
            pf = file(self.pidfile, 'r')
            pid = int(pf.read().strip())
            pf.close()
        except IOError:
            pid = None
        return pid

    def start(self):
        pid = self._getpid()
        if pid:
            try:
                os.getsid(pid)
                sys.stderr.write("Daemon already running.\n")
            except:
                sys.stderr.write("pidfile %s already exists, but daemon is not running. Delete pidfile and retry.\n" % self.pidfile)
            sys.exit(1)
    
        self.daemonize()
        self.run()

    def stop(self):
        self.stopWorkers()
        pid = self._getpid()
        if not pid:
            sys.stderr.write("pidfile %s does not exist, cannot stop daemon.\n" % self.pidfile)
            return  # not an error in a restart

        # TODO: maybe give feedback to the user, on whether the daemon was stopped successfully ?
        try:
            while 1:
                os.kill(pid, SIGTERM)
                time.sleep(0.1)
        except OSError, err:
            err = str(err)
            if err.find("No such process") > 0:
                if os.path.exists(self.pidfile):
                    os.remove(self.pidfile)
            else:
                print str(err)
                sys.exit(1)

    def restart(self):
        self.stop()
        self.start()

    def run(self):
        pass

    def stopWorkers(self):
        pass

from proxypj.weibo import taskmanager
from proxypj.weibo.crawltask import CrawlWorker
from Queue import Queue

class TaskDaemon(Daemon):
    def __init__(self, pidPath):
        Daemon.__init__(self, pidPath)
        self.stopWork = False
        self.queue = Queue()
        self.workers = []
    
    def stopWorkers(self):
        self.stopWork = True
        for worker in self.workers:
            worker.join()
  
    def run(self):
        for handler in list(logging.getLogger().handlers):
            logging.getLogger().removeHandler(handler)

        if _log_file():
            logging.basicConfig(level=logging.DEBUG,
                                format=LOG_FORMAT,
                                datefmt=LOG_DATEFMT,
                                filename=_log_file())
        else:
            logging.basicConfig(level=logging.DEBUG)
        self.schedue()
    def schedue(self):
        for i in range(0, 10):
            worker = CrawlWorker(self)
            worker.start()
            self.workers.append(worker)
        logging.info("daemon initialize complete")
        logging.info('start schedule')
        while True:
            #删除已经完成的任务
            taskmanager.garbageCollect()
            if self.queue.qsize() > 10:
                logging.info('too many tasks')
                time.sleep(60)
                continue
            
            try:
                logging.info("pollCrawkTask")
                tasks = taskmanager.pollCrawkTask(10)
                if tasks is None:
                    logging.info('scheduler is idle')
                    time.sleep(10)
                    continue
                
                for task in tasks:
                    logging.info("task is recieved;%s:%s" % (task.uid, task.status))
                    self.queue.put(task.uid)
                    logging.info("task is recieved;%s:%s" % (task.uid, task.status))
            except Exception, e:
                logging.error(e)
            
                
class Command(BaseCommand):
    def handle(self, *args, **options):
        if len(args) == 1 and args[0] in ['start', 'stop', 'restart', 'run']:

            if args[0] in ['start', 'restart']:
                if _log_file():
                    print "Logging to %s" % _log_file()
            elif args[0] == 'run':
                # when running, force logging to console only
                from django.conf import settings
                settings.TASKS_LOG_FILE = ''
                
            daemon = TaskDaemon(os.path.join(os.getenv('TEMP') if (os.name == 'nt') else '/tmp',
                                             'django-taskd.pid'))
            getattr(daemon, args[0])()
        else:
            return "Usage: %s %s start|stop|restart|run\n" % (sys.argv[0], sys.argv[1])
