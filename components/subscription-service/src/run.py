'''
run.py

Run file for subscription service.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os, os.path

import cherrypy
import redis
import sqlite3

import common
import config
import message_handlers

from subscription_service_root import SubscriptionServiceRoot
from subscription_service_subscriptions import SubscriptionServiceSubscriptions

def init_service():
  ## Init local data storage
  ## Create directories if not existing yet
  if not os.path.exists(config.DATA_DIR):
    os.makedirs(config.DATA_DIR)
    
  ## Init redis communication
  common.myRedis = redis.Redis(host='redis', port=6379, db=0)
  common.pubSub = common.myRedis.pubsub(ignore_subscribe_messages=True)

  ## Subscribe to channels
  common.pubSub.subscribe(**{'general': message_handlers.handle_general_messages})
  common.pubSub.subscribe(**{'photos': message_handlers.handle_photo_messages})
  common.pubSub.subscribe(**{'albums': message_handlers.handle_album_messages})
  common.pubSub.subscribe(**{'subscribers': message_handlers.handle_subscriber_messages})

  ## Listen for events in separate thread
  common.pubSubThread = common.pubSub.run_in_thread(sleep_time=0.001)

  ## Say hi
  common.myRedis.publish('general', '%s: Here we are!' % config.NAME)

  ## Init DB and create tables if not yet existing
  with sqlite3.connect(config.DB_STRING) as con:
    con.execute("CREATE TABLE IF NOT EXISTS general (key, value)")
    con.execute("CREATE TABLE IF NOT EXISTS subscriptions (uuid, mail, ip, dateSubscribed)")

  ## Check DB version
  with sqlite3.connect(config.DB_STRING) as con:
    r = con.execute("SELECT value FROM general WHERE key='version' LIMIT 1")
    res = r.fetchall()
    if len(res) == 0:
      con.execute("INSERT INTO general VALUES (?, ?)", ["version", config.VERSION])
    elif config.VERSION == res[0][0]:
      # Program and DB run same version, everything OK!
      pass
    else:
      # Different versions! Please migrate!
      # TODO
      print("Running ? v? with DB v?! Exiting...", (config.NAME, config.VERSION, res[0][0]))
      sys.exit(100)

def cleanup():
  ## Stop redis PubSub Thread:
  common.pubSubThread.stop()
  return

if __name__ == '__main__':
  conf = {
      '/': {
          'tools.sessions.on': False,
          'tools.staticdir.root': os.path.abspath(os.getcwd())
      },
      '/subscriptions': {
          'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
          'tools.response_headers.on': True,
          'tools.response_headers.headers': [('Content-Type', 'application/json')]
      }
  }

  cherrypy.server.socket_host = '0.0.0.0'
  cherrypy.server.socket_port = 8080

  cherrypy.engine.subscribe('start', init_service)
  cherrypy.engine.subscribe('stop', cleanup)

  service = SubscriptionServiceRoot()
  service.subscriptions = SubscriptionServiceSubscriptions()

  cherrypy.quickstart(service, '/subscription-service', conf)
