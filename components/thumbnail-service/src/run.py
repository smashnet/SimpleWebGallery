'''
run.py

Run file for thumbnail service.

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
import logging

import common
import config

from thumbnail_service_root import ThumbnailServiceRoot
from thumbnail_service_thumbnails import ThumbnailServiceThumbnails
from create_thumbnail_task_processor import CreateThumbnailTaskProcessor
from delete_thumbs_task_processor import DeleteThumbsTaskProcessor

def init_service():
  ## Init local data storage
  ## Create directories if not existing yet
  if not os.path.exists(config.THUMB_DIR):
    os.makedirs(config.THUMB_DIR)

  ## Init redis communication
  common.myRedis = redis.Redis(host='redis', port=6379, db=0)

  ## Listen on redis channel _create-thumbnail_ for new tasks
  common.taskThread = CreateThumbnailTaskProcessor()
  common.taskThread.daemon = True
  common.taskThread.start()

  ## Listen on redis channel _delete-thumbs_ for new tasks
  common.deleteThumsTaskThread = DeleteThumbsTaskProcessor()
  common.deleteThumsTaskThread.daemon = True
  common.deleteThumsTaskThread.start()

  ## Init DB and create tables if not yet existing
  with sqlite3.connect(config.DB_STRING) as con:
    con.execute("CREATE TABLE IF NOT EXISTS general (key, value)")
    con.execute("CREATE TABLE IF NOT EXISTS thumbnails (thumbid, extension, created)")

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
      logging.critical("Running %s v%s with DB v%s! Exiting..." % (config.NAME, config.VERSION, res[0][0]))
      sys.exit(100)

def cleanup():
  common.taskThread.join(timeout=1.0)
  common.deleteThumsTaskThread.join(timeout=1.0)
  return

if __name__ == '__main__':
  conf = {
      '/': {
          'tools.sessions.on': False,
          'tools.staticdir.root': os.path.abspath(os.getcwd())
      },
      '/thumbnails': {
          'request.dispatch': cherrypy.dispatch.MethodDispatcher()
      }
  }

  cherrypy.server.socket_host = '0.0.0.0'
  cherrypy.server.socket_port = 8080

  cherrypy.engine.subscribe('start', init_service)
  cherrypy.engine.subscribe('stop', cleanup)

  service = ThumbnailServiceRoot()
  service.thumbnails = ThumbnailServiceThumbnails()

  cherrypy.quickstart(service, '/thumbnail-service', conf)
