'''
album_service_accesscode.py

Album service of SimpleWebGallery that manages albums of photos.

This part is responsible of resolving accesscodes to uuids.

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
class AlbumServiceAccessCode(object):

  def getAlbumInformation(self, accesscode):
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT albumid, name FROM albums WHERE accesscode=?", (accesscode,))
      res = common.DBtoDict(r)
      return res

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def GET(self, accesscode=None):
    if accesscode == None:
      return "No access code given"

    # Check if is valid access code
    if not common.isValidAccessCode(accesscode):
      return "Not a valid access code"

    return self.getAlbumInformation(accesscode)

  def OPTIONS(self):
    return None
