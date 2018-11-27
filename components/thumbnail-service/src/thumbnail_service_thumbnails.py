'''
thumbnail_service_thumbnails.py

Handles requests regarding thumbnails.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os, os.path
from datetime import datetime
import uuid

import cherrypy
import sqlite3
import hashlib

import config
import common

@cherrypy.expose
class ThumbnailServiceThumbnails(object):

  @staticmethod
  def getThumbURLs():
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT uuid FROM files")
      intermediate = r.fetchall()
      return ["/thumbnail/%s" % item[0] for item in intermediate]

  @cherrypy.tools.accept(media='application/json')
  def GET(self, uuid=None, size=config.THUMB_SIZES[0]):
    # Check if uuid is None
    if uuid == None:
      return "No uuid given"
    # Check if is valid uuid
    try:
      uuid.UUID(uuid, version=4)
    except ValueError:
      return "Not a valid uuid"

    # Check if is valid size
    if size in config.THUMB_SIZES:
      # Get file information from DB
      with sqlite3.connect(config.DB_STRING) as c:
        r = c.execute("SELECT * FROM files WHERE uuid=?", (str(uuid),))
        res = r.fetchone()
        fn, filext = os.path.splitext(res[1])
        with open(config.PHOTO_THUMBS_DIR + "/%s_%s%s" % (uuid, size, filext), "rb") as the_file:
          cherrypy.response.headers['Content-Type'] = 'image/jpeg'
          return the_file.read()
