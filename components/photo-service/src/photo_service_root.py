'''
photo_service_root.py

Photo service of SimpleWebGallery that handles photos.

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

class PhotoServiceRoot(object):

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  @cherrypy.expose
  def index(self, *args, **kwargs):
    return {"message": "Hello world!",
            "service": config.NAME,
            "version": config.VERSION}

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  @cherrypy.expose
  def default(self, *args, **kwargs):
    return {"message": "Page not found"}
