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

from photo_service_root import PhotoServiceRoot
from photo_service_photos import PhotoServicePhotos

def init_service():
  ## TODO:
  return

def cleanup():
  ## TODO:
  return

if __name__ == '__main__':
  conf = {
      '/': {
          'tools.sessions.on': False,
          'tools.staticdir.root': os.path.abspath(os.getcwd())
      },
      '/photos': {
          'request.dispatch': cherrypy.dispatch.MethodDispatcher()
      }
  }

  cherrypy.server.socket_host = '0.0.0.0'
  cherrypy.server.socket_port = 8080

  cherrypy.engine.subscribe('start', init_service)
  cherrypy.engine.subscribe('stop', cleanup)

  service = PhotoServiceRoot()
  service.photos = PhotoServicePhotos()

  cherrypy.quickstart(service, '/photo-service', conf)
