'''
photo_service_rawcontent.py

Handles requests regarding photos.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os, os.path
from datetime import datetime
import uuid
import json
import logging
import io

import cherrypy
import sqlite3
import hashlib
from PIL import Image, ExifTags

import config
import common

@cherrypy.expose
class PhotoServiceRawContent(object):

  def GET(self, fileid=None):
    # Check if uuid given
    if fileid == None:
      return "No uuid given"
    # Check if is valid uuid
    try:
      uuid.UUID(fileid, version=4)
    except ValueError:
      return "Not a valid uuid"

    # Get file information from DB
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT * FROM files WHERE fileid=?", (str(fileid),))
      res = common.DBtoDict(r)
      with open(config.PHOTO_DIR + "/%s%s" % (res['fileid'], res['extension']), "rb") as the_file:
        cherrypy.response.headers['Content-Type'] = res['content_type']
        return the_file.read()

  def OPTIONS(self):
    return None
