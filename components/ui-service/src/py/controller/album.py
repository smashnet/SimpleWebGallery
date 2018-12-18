'''
album.py

Controller to deliver web functionality for albums.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import cherrypy
import requests
from datetime import datetime

import common
import config
from controller.base import BaseController

class AlbumController(BaseController):

  @cherrypy.expose
  def index(self, args=None):
    template_vars = {}
    template_vars["bodyclass"] = "class=main"
    # Check args
    # args[0] should be the 8-digit-access-code
    # TODO: Check with AlbumService if album with this code exists
    if len(args) == 0 or not common.isValidAccessCode(args[0]):
      return self.render_template("album/wrongAccessCode.html", template_vars)

    # create photo upload url
    template_vars["photo_upload_url"] = "http://%s/photo-service/photos" % config.PHOTO_SERVICE_URL

    # Set nav items
    template_vars["navlinks"] = [
    {
      "name": "Home",
      "href": "/"
    },
    {
      "name": "Fotos",
      "href": "/album/%s/overview" % args[0]
    }
    ]

    # TODO: Get album information
    template_vars['album_name'] = "Test title"
    template_vars['album_accesscode'] = "12345678"
    template_vars['album_created'] = str(datetime.utcnow())
    template_vars['album_amount_photos'] = 42
    template_vars['album_amount_subscriptions'] = 84

    return self.render_template("album/index.html", template_vars)

  @cherrypy.expose
  def overview(self, args=None):
    template_vars = {}
    template_vars["bodyclass"] = "class=main"
    # args[0] -> accessCode
    # args[1] -> "overview"
    # args[2] -> "fullscreen"

    # args[0] should be the 8-digit-access-code
    # TODO: Check with AlbumService if album with this code exists
    if len(args) == 0 or not common.isValidAccessCode(args[0]):
      return self.render_template("album/wrongAccessCode.html", template_vars)

    # check if fullscreen
    if len(args) > 2 and args[2] == "fullscreen":
      template_vars["fullscreen"] = True
    else:
      template_vars["fullscreen"] = False

    # Collect photo thumburls
    template_vars["navlinks"] = [
    {
      "name": "Home",
      "href": "/"
    },
    {
      "name": "Fotos",
      "href": "/album/%s/overview" % args[0]
    }
    ]

    # TODO: Get list of photos
    photos = None
    if photos is not None:
      template_vars["photos"] = photos
      template_vars["startIndex"] = startIndex
      # Prune dateUploaded
      for item in template_vars["photos"]:
        item["dateUploaded"] = item["dateUploaded"].split('.')[0]

    if template_vars["fullscreen"]:
      return self.render_template("album/fullscreen.html", template_vars)
    else:
      return self.render_template("album/overview.html", template_vars)
