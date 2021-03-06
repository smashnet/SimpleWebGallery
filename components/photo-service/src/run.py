'''
run.py

Run file for photo service.

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

from service_routing import PhotoServiceRouting

from delete_files_task_processor import DeleteFilesTaskProcessor

def init_service():
  ## Init local data storage
  ## Create directories if not existing yet
  if not os.path.exists(config.PHOTO_DIR):
    os.makedirs(config.PHOTO_DIR)

  ## Init redis communication
  common.myRedis = redis.Redis(host='redis', port=6379, db=0)

  ## Listen on redis channel _delete-files_ for new tasks
  common.deleteFilesTaskThread = DeleteFilesTaskProcessor()
  common.deleteFilesTaskThread.daemon = True
  common.deleteFilesTaskThread.start()

  ## Init DB and create tables if not yet existing
  with sqlite3.connect(config.DB_STRING) as con:
    con.execute("CREATE TABLE IF NOT EXISTS general (key, value)")
    con.execute("CREATE TABLE IF NOT EXISTS files (fileid, filename, extension, content_type, md5, uploader, timestamp_date_time_original timestamp, timestamp_uploaded timestamp)")

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
  common.deleteFilesTaskThread.join(timeout=1.0)
  return

if __name__ == '__main__':
  service_routing = PhotoServiceRouting()

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

  cherrypy.quickstart(None, '/photo-service', conf)
