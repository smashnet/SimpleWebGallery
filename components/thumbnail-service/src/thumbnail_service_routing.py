'''
thumbnail_service_routing.py

Contains the routing logic for the thumbnail service.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os

import cherrypy

# Import controller
from thumbnail_service_logic import ThumbnailServiceLogic

class ThumbnailServiceRouting(object):

  def getRoutesDispatcher(self):
    d = cherrypy.dispatch.RoutesDispatcher()

    d.connect('service_index_info', '/',
              controller=ThumbnailServiceLogic(),
              action='index',
              conditions=dict(method=['GET']))

    d.connect('get_thumbnail', '/thumbnails/{thumbid}',
              controller=ThumbnailServiceLogic(),
              action='getThumbnail',
              conditions=dict(method=['GET']))

    d.connect('get_thumbnail', '/thumbnails/{thumbid}/{size}',
              controller=ThumbnailServiceLogic(),
              action='getThumbnail',
              conditions=dict(method=['GET']))

    return d
