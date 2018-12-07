'''
album_service_albums.py

Album service of SimpleWebGallery that manages albums of photos.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os, os.path
from datetime import datetime
import uuid
import random
import string

import cherrypy
import sqlite3
import hashlib

import config
import common

@cherrypy.expose
class AlbumServiceAlbums(object):

  @staticmethod
  def albumExists(accessCode):
    return True
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT * FROM albums WHERE accessCode=? LIMIT 1", (accessCode,))
      if len(r.fetchall()) == 0:
        return False
      else:
        return True

  @staticmethod
  def getAlbumInformation(accessCode):
    return {}
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT uuid, name, accesscode, creator, dateCreated FROM albums WHERE accesscode=?", (accessCode,))
      res = common.DBtoDict(r)
      return res

  @staticmethod
  def getListOfAllAlbums():
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT uuid, name, accesscode, creator, dateCreated FROM albums")
      res = common.DBtoDict(r)
      if len(res) == 0:
        return None
      return res

  def saveNewAlbum(self, info):
    with sqlite3.connect(config.DB_STRING) as c:
      # TODO: 
      c.execute("INSERT INTO albums VALUES (?, ?, ?, ?)",
        [res['id'], res['mail'], res['ip'], res['dateSubscribed']])

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def GET(self, uuid=None):
    # Check if is valid uuid
    try:
      uuid.UUID(uuid, version=4)
    except ValueError:
      return "Not a valid uuid"

    # TODO
    return {}

  @cherrypy.tools.json_out()
  def POST(self, albumname=None):
    # TODO: Create new album with random accesscode and return information as JSON
    if albumname == None:
      return {"message": "No album created", "error": "Missing album name"}

    # TODO: Validate album name

    res = {
      "uuid": str(uuid.uuid4()),
      "name": albumname,
      "accesscode": ''.join(random.choices(string.ascii_lowercase + string.digits, k=8)),
      "creator": cherrypy.request.remote.ip,
      "created": str(datetime.utcnow())
    }

    # Save new album in DB
    self.saveNewAlbum(res)

    return res

  @cherrypy.tools.json_out()
  def PUT(self, file):
    # TODO
    return {}

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def DELETE(self, uuid=None):
    # Check if is valid uuid
    try:
      uuid.UUID(uuid, version=4)
    except ValueError:
      return "Not a valid uuid"

    # TODO
    return {}

  def OPTIONS(self):
    return None
