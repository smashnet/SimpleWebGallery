'''
thumbnail_service_logic.py

Handles requests regarding thumbnails.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os
import uuid

import cherrypy
import sqlite3

import config
import common

class ThumbnailServiceLogic(object):

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def index(self, *args, **kwargs):
    return {"message": "Hello world!",
            "service": config.NAME,
            "version": config.VERSION}

  @cherrypy.tools.accept(media='application/json')
  def getThumbnail(self, thumbid=None, size=config.THUMB_SIZES[1]):
    # Check if uuid is None
    if thumbid == None:
      return "No thumbid given"
    # Check if is valid thumbid
    try:
      uuid.UUID(thumbid, version=4)
    except ValueError:
      return "Not a valid thumbid"

    # Check if is valid size
    if int(size) in config.THUMB_SIZES:
      # Get file information from DB
      with sqlite3.connect(config.DB_STRING) as c:
        r = c.execute("SELECT * FROM thumbnails WHERE thumbid=?", (str(thumbid),))
        res = common.DBtoDict(r)
        with open(config.THUMB_DIR + "/%s_%s%s" % (res['thumbid'], size, res['extension']), "rb") as the_file:
          cherrypy.response.headers['Content-Type'] = 'image/jpeg'
          return the_file.read()
