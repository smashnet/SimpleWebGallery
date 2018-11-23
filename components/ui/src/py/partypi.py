'''
simplewebgallery.py

Main file of SimpleWebGallery.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os, os.path
import sys

import cherrypy

from simplewebgallery_web import SimpleWebGalleryWeb


if __name__ == '__main__':
  conf_webapp = {
      '/': {
          'tools.sessions.on': False,
          'tools.staticdir.root': os.path.abspath(os.getcwd())
      },
      '/static': {
          'tools.staticdir.on': True,
          'tools.staticdir.dir': './static'
      }
  }

  cherrypy.server.socket_host = '0.0.0.0'
  cherrypy.server.socket_port = 8080

  webapp = SimpleWebGalleryWeb()

  cherrypy.tree.mount(SimpleWebGalleryWeb(), '/', conf_webapp)

  cherrypy.engine.start()
