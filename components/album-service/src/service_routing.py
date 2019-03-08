'''
service_routing.py

Contains the routing logic for the album service.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import cherrypy

# Import controller
from service_logic import AlbumServiceLogic

class AlbumServiceRouting(object):

  def getRoutesDispatcher(self):
    d = cherrypy.dispatch.RoutesDispatcher()

    d.connect('service_index_info', '/',
              controller=AlbumServiceLogic(),
              action='index',
              conditions=dict(method=['GET']))

    d.connect('get_albums', '/albums',
              controller=AlbumServiceLogic(),
              action='getAlbumsInfo',
              conditions=dict(method=['GET']))

    d.connect('get_album', '/albums/{albumid}',
              controller=AlbumServiceLogic(),
              action='getAlbumInfo',
              conditions=dict(method=['GET']))

    d.connect('post_album', '/albums',
              controller=AlbumServiceLogic(),
              action='postAlbum',
              conditions=dict(method=['POST']))

    d.connect('put_album', '/albums/{albumid}',
              controller=AlbumServiceLogic(),
              action='putAlbum',
              conditions=dict(method=['PUT']))

    d.connect('delete_complete_album', '/albums/{albumid}',
              controller=AlbumServiceLogic(),
              action='deleteCompleteAlbum',
              conditions=dict(method=['DELETE']))

    d.connect('delete_photos_from_album', '/albums/{albumid}/photos',
              controller=AlbumServiceLogic(),
              action='deletePhotosFromAlbum',
              conditions=dict(method=['DELETE']))

    d.connect('delete_photo_from_album', '/albums/{albumid}/photos/{photoid}',
              controller=AlbumServiceLogic(),
              action='deletePhotoFromAlbum',
              conditions=dict(method=['DELETE']))

    d.connect('delete_subscription_from_album', '/albums/{albumid}/subscriptions/{subscriptionid}',
              controller=AlbumServiceLogic(),
              action='deleteSubscriptionFromAlbum',
              conditions=dict(method=['DELETE']))

    d.connect('get_albumid_from_access_code', '/resolveid/{accesscode}',
              controller=AlbumServiceLogic(),
              action='getAlbumIdFromAccessCode',
              conditions=dict(method=['GET']))

    return d
