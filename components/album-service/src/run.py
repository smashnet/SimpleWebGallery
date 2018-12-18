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

import cherrypy
import redis
import sqlite3

import common
import config
import message_handlers

from album_service_root import AlbumServiceRoot
from album_service_albums import AlbumServiceAlbums
from album_service_accesscode import AlbumServiceAccessCode
from add_file_to_album_task_processor import AddFileToAlbumTaskProcessor
from add_subscription_to_album_task_processor import AddSubscriptionToAlbumTaskProcessor

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
    con.execute("CREATE TABLE IF NOT EXISTS albums (albumid, name, accesscode, creator, created)")
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
  conf = {
      '/': {
          'tools.sessions.on': False,
          'tools.staticdir.root': os.path.abspath(os.getcwd())
      },
      '/albums': {
          'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
          'tools.response_headers.on': True,
          'tools.response_headers.headers': [('Content-Type', 'application/json')],
          'tools.CORS.on': True
      },
      '/accesscode': {
          'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
          'tools.response_headers.on': True,
          'tools.response_headers.headers': [('Content-Type', 'application/json')],
          'tools.CORS.on': True
      }
  }

  cherrypy.server.socket_host = '0.0.0.0'
  cherrypy.server.socket_port = 8080

  cherrypy.engine.subscribe('start', init_service)
  cherrypy.engine.subscribe('stop', cleanup)

  service = AlbumServiceRoot()
  service.albums = AlbumServiceAlbums()
  service.accesscode = AlbumServiceAccessCode()

  cherrypy.tools.CORS = cherrypy.Tool('before_finalize', CORS)
  cherrypy.quickstart(service, '/album-service', conf)
