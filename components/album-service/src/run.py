'''
run.py

Run file for album service.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os, os.path
import sys

import cherrypy
import redis
import sqlite3

import common
import config

from service_routing import AlbumServiceRouting

from add_file_to_album_task_processor import AddFileToAlbumTaskProcessor
from add_subscription_to_album_task_processor import AddSubscriptionToAlbumTaskProcessor

def init_service():
  ## Init local data storage
  ## Create directories if not existing yet
  if not os.path.exists(config.DATA_DIR):
    os.makedirs(config.DATA_DIR)

  ## Init redis communication
  common.myRedis = redis.Redis(host='redis', port=6379, db=0)

  ## Listen on redis channel _add-file-to-album_ for new tasks
  common.addFileTaskThread = AddFileToAlbumTaskProcessor()
  common.addFileTaskThread.daemon = True
  common.addFileTaskThread.start()

  ## Listen on redis channel _add-subscription-to-album_ for new tasks
  common.addSubscriptionTaskThread = AddSubscriptionToAlbumTaskProcessor()
  common.addSubscriptionTaskThread.daemon = True
  common.addSubscriptionTaskThread.start()

  ## Init DB and create tables if not yet existing
  with sqlite3.connect(config.DB_STRING) as con:
    con.execute("CREATE TABLE IF NOT EXISTS general (key, value)")
    con.execute("CREATE TABLE IF NOT EXISTS albums (albumid, name, accesscode, creator, timestamp_created timestamp)")
    con.execute("CREATE TABLE IF NOT EXISTS album_files (albumid, fileid)")
    con.execute("CREATE TABLE IF NOT EXISTS album_subscriptions (albumid, subscriptionid)")

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
  common.addFileTaskThread.join(timeout=1.0)
  common.addSubscriptionTaskThread.join(timeout=1.0)
  return True

if __name__ == '__main__':
  service_routing = AlbumServiceRouting()

  conf = {
      '/': {
          'tools.sessions.on': False,
          'request.dispatch': service_routing.getRoutesDispatcher()
      }
  }

  cherrypy.server.socket_host = '0.0.0.0'
  cherrypy.server.socket_port = 8080

  cherrypy.engine.subscribe('start', init_service)
  cherrypy.engine.subscribe('stop', cleanup)

  cherrypy.quickstart(None, '/album-service', conf)
