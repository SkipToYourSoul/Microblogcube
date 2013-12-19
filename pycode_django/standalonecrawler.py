# -*- coding: utf-8 -*-
from weibo import *
import logging
from time import time
from config import *

logger = logging.getLogger('crawl')
logger.setLevel(logging.DEBUG)
# 再创建一个handler，用于输出到控制台
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
# 定义handler的输出格式
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
# 给logger添加handler
logger.addHandler(ch)

def crawl():
    uid = "1707446764"
    adjMatrix = {}
    # code = self.request.get('code')
    retry = 3
    ex = None

    while retry > 0:
        try:
            client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
            client.set_access_token("2.00wtQYrBlHKDwBc1dc10c060iezTAB", 1540000314)
            client1 = APIClient(app_key=APP_KEY1, app_secret=APP_SECRET1, redirect_uri=CALLBACK_URL1)
            client1.set_access_token('2.00S_AdnBmNsuOD02128879a2R9Q_9E', 2619804)
            break
        except Exception, e : 
            retry -= 1
            logger.error("require access code:%s" % str(e))
            ex = e
            continue
    
    if retry == 0:
        logger.error("require APIClient exception%s" % (str(ex)))
        return
    
    resFriends = []
    resCommonFriends = []
    
    # 获取授权用户的好友
    retry = 3
    start = time()
    cursor = 0
    friends = []
    while (True):
        while retry > 0:
            try:
                # f = client.friendships.friends.ids.get(uid=uid, count=str(2000))
                f = client.friendships.friends.get(uid=uid, count=str(200), cursor=cursor)
                if len(f.users) > 0:
                    cursor = f.next_cursor
                    for u in f.users:
                        print u.name.encode('utf-8','ignore')
                    logging.debug("fetched friends of %s. length:%d" % (uid, len(f.users)))
                    break
                else:
                    cursor = 0
                    break
            except Exception, e: 
                logging.error("crawling friendship:%s" % str(e))
                ex = e
                retry -= 1     
        if cursor == 0:
            break  
        
    if retry == 0:
        logger.debug("crawl friends failed:%s s" % (str(ex)))
        return
    return
    # x:a->b a->x b->x 
    # 获取 好友中与授权用户中共同关注的人  
    sum = 0  
    for u in f.ids:
        retry = 3
        while retry > 0:
             try:
                start = time()
                b = client1.friendships.friends.in_common.get(uid=str(u), suid=uid)
                if len(b.users) > 0:  
                  # logging.debug("fetched common friends of %s,%s. length:%d" % (uid, str(u), len(b.users)))
                  adjMatrix[long(u)] = set()
                  for u1 in b.users:
                       adjMatrix[long(u)].add(long(u1.id)) 
                end = time()
                logger.debug("crawling one common friend costs:%s s" % (end - start))
                sum += (end - start)
                break
             except Exception, e: 
                 logger.error("crawling comm friends %s" % (str(e)))
                 ex = e
                 retry -= 1
                 continue
        if retry == 0:
            break
    logger.debug("crawling common friend totally costs:%s s" % (sum))
    logger.debug("crawling common friend average costs:%s s" % (sum / len(f.ids)))

    

