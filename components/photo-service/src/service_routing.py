'''
service_routing.py

Contains the routing logic for the photo service.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os

import cherrypy

# Import controller
from service_logic import PhotoServiceLogic

class PhotoServiceRouting(object):

  def getRoutesDispatcher(self):
    d = cherrypy.dispatch.RoutesDispatcher()

    d.connect('service_index_info', '/',
              controller=PhotoServiceLogic(),
              action='index',
              conditions=dict(method=['GET']))

    d.connect('get_photo_data', '/rawcontent/{photoid}',
              controller=PhotoServiceLogic(),
              action='getPhotoData',
              conditions=dict(method=['GET']))

    d.connect('get_photo_info', '/photos/{photoid}',
              controller=PhotoServiceLogic(),
              action='getPhotoInfo',
              conditions=dict(method=['GET']))

    d.connect('get_photos_info', '/photos',
              controller=PhotoServiceLogic(),
              action='getPhotosInfo',
              conditions=dict(method=['GET']))

    d.connect('post_photo', '/photos',
              controller=PhotoServiceLogic(),
              action='postPhoto',
              conditions=dict(method=['POST']))

    d.connect('delete_photo', '/photos/{photoid}',
              controller=PhotoServiceLogic(),
              action='deletePhoto',
              conditions=dict(method=['DELETE']))

    return d
