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

import cherrypy
import redis
import sqlite3

import common
import config
import message_handlers

from photo_service_root import PhotoServiceRoot
from photo_service_photos import PhotoServicePhotos
from photo_service_rawcontent import PhotoServiceRawContent
from delete_files_task_processor import DeleteFilesTaskProcessor

def CORS():
  if cherrypy.request.method == 'OPTIONS':
    # preflign request
    # see http://www.w3.org/TR/cors/#cross-origin-request-with-preflight-0
    cherrypy.response.headers['Access-Control-Allow-Methods'] = 'POST,GET,DELETE'
    cherrypy.response.headers['Access-Control-Allow-Headers'] = 'cache-control,x-requested-with'
    cherrypy.response.headers['Access-Control-Allow-Origin']  = '*'
    # tell CherryPy no avoid normal handler
    return True
  else:
    cherrypy.response.headers['Access-Control-Allow-Origin'] = '*'

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
    con.execute("CREATE TABLE IF NOT EXISTS files (fileid, filename, extension, content_type, md5, uploader, timestamp_date_time_original timestamp, uploaded)")

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
  conf = {
      '/': {
          'tools.sessions.on': False,
          'tools.staticdir.root': os.path.abspath(os.getcwd())
      },
      '/photos': {
          'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
          'tools.CORS.on': True
      },
      '/rawcontent': {
          'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
          'tools.CORS.on': True
      }
  }

  cherrypy.server.socket_host = '0.0.0.0'
  cherrypy.server.socket_port = 8080

  cherrypy.engine.subscribe('start', init_service)
  cherrypy.engine.subscribe('stop', cleanup)

  service = PhotoServiceRoot()
  service.photos = PhotoServicePhotos()
  service.rawcontent = PhotoServiceRawContent()

  cherrypy.tools.CORS = cherrypy.Tool('before_finalize', CORS)
  cherrypy.quickstart(service, '/photo-service', conf)
