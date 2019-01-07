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
import json

import cherrypy
import sqlite3
import hashlib

import config
import common

@cherrypy.expose
class AlbumServiceAlbums(object):

  def getAlbumInformation(self, uuid):
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT albumid, name, accesscode, creator, created FROM albums WHERE albumid=?", (uuid,))
      res = common.DBtoDict(r)
      if res == {}:
        # Album does not exist
        return {}

      album = res

      # If the album exists, get files and subscription information
      r = c.execute("SELECT fileid FROM album_files WHERE albumid=?", (uuid,))
      res = common.DBtoList(r)
      fileids = [item['fileid'] for item in res]
      album['files'] = fileids

      r = c.execute("SELECT subscriptionid FROM album_subscriptions WHERE albumid=?", (uuid,))
      res = common.DBtoList(r)
      subscriptionids = [item['subscriptionid'] for item in res]
      album['subscriptions'] = subscriptionids

      return album

  def getListOfAllAlbums(self):
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT albumid, name, accesscode, creator, created FROM albums")
      res = common.DBtoList(r)
      if len(res) == 0:
        return None
      return res

  def saveNewAlbum(self, info):
    with sqlite3.connect(config.DB_STRING) as c:
      # TODO:
      c.execute("INSERT INTO albums VALUES (?, ?, ?, ?, ?)",
        [info['albumid'], info['name'], info['accesscode'], info['creator'], info['created']])

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def GET(self, albumid=None):
    if albumid == None:
      return self.getListOfAllAlbums()

    # Check if is valid uuid
    try:
      uuid.UUID(albumid, version=4)
    except ValueError:
      return "Not a valid uuid"

    return self.getAlbumInformation(albumid)

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_in()
  @cherrypy.tools.json_out()
  def POST(self):
    input_json = cherrypy.request.json

    if input_json['albumname'] == None:
      return {"message": "No album created", "error": "Missing album name"}

    # TODO: Validate album name

    res = {
      "albumid": str(uuid.uuid4()),
      "name": input_json['albumname'],
      "accesscode": ''.join(random.choices(string.ascii_lowercase + string.digits, k=8)),
      "creator": cherrypy.request.remote.ip,
      "created": str(datetime.utcnow())
    }

    # Save new album in DB
    self.saveNewAlbum(res)

    return res

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def PUT(self, file):
    # TODO
    return {}

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def DELETE(self, albumid=None):
    if albumid == None:
      return {"error": "No UUID given"}

    # Check if is valid uuid
    try:
      uuid.UUID(albumid, version=4)
    except ValueError:
      return {"error": "Not a valid UUID"}

    # Place task to delete files and thumbs from this album
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT fileid FROM album_files WHERE albumid=?", (albumid,))
      res = common.DBtoList(r)
      fileids = [item['fileid'] for item in res]
      common.myRedis.lpush("delete-files", json.dumps(fileids)) # Add task to list
      common.myRedis.lpush("delete-thumbs", json.dumps(fileids)) # Add task to list

    # Place task to delete subscriptions for this album
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT subscriptionid FROM album_subscriptions WHERE albumid=?", (albumid,))
      res = common.DBtoList(r)
      subscriptionids = [item['subscriptionid'] for item in res]
      common.myRedis.lpush("delete-subscriptions", json.dumps(subscriptionids)) # Add task to list

    # Delete from album_subscriptions
    with sqlite3.connect(config.DB_STRING) as c:
      c.execute("DELETE FROM album_subscriptions WHERE albumid=?", (str(albumid),))
    # Delete from album_files
    with sqlite3.connect(config.DB_STRING) as c:
      c.execute("DELETE FROM album_files WHERE albumid=?", (str(albumid),))
    # Delete from albums
    with sqlite3.connect(config.DB_STRING) as c:
      c.execute("DELETE FROM albums WHERE albumid=?", (str(albumid),))

    return {"message": "Album deleted", "error": "OK"}

  def OPTIONS(self):
    return None
