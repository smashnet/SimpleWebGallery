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
    # Check if is valid access code
    if len(args) == 0 or not common.isValidAccessCode(args[0]):
      return self.render_template("album/wrongAccessCode.html", template_vars)

    # Resolve access code to id. Returns {} if no album with this code exists
    r = requests.get("http://album-service:8080/album-service/accesscode/%s" % args[0])
    if r.json() == {}:
      return self.render_template("album/wrongAccessCode.html", template_vars)

    albummeta = r.json()

    # Get album information
    r = requests.get("http://album-service:8080/album-service/albums/%s" % albummeta['albumid'])
    albuminfo = r.json()
    template_vars['album_id'] = albuminfo['albumid']
    template_vars['album_name'] = albuminfo['name']
    template_vars['album_accesscode'] = albuminfo['accesscode']
    template_vars['album_created'] = albuminfo['created'].split('.')[0]
    template_vars['album_amount_photos'] = len(albuminfo['files'])
    template_vars['album_amount_subscriptions'] = len(albuminfo['subscriptions'])

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

    # Resolve access code to id. Returns {} if no album with this code exists
    r = requests.get("http://album-service:8080/album-service/accesscode/%s" % args[0])
    if r.json() == {}:
      return self.render_template("album/wrongAccessCode.html", template_vars)

    albummeta = r.json()

    # Get album information
    r = requests.get("http://album-service:8080/album-service/albums/%s" % albummeta['albumid'])
    albuminfo = r.json()

    # TODO: Get list of photos
    # photo.thumburl
    # photo.photourl
    # photo.uploaded
    photos = []
    for fileid in albuminfo['files']:
      r = requests.get("http://photo-service:8080/photo-service/photos/%s" % fileid)
      fileinfo = r.json()
      fileinfo['thumburl'] = "http://%s/thumbnail-service/thumbnails/%s" % (config.THUMBNAIL_SERVICE_URL, fileid)
      fileinfo['fileurl'] = "http://%s/photo-service/rawcontent/%s" % (config.PHOTO_SERVICE_URL, fileid)
      photos.append(fileinfo)
    if photos is not []:
      template_vars["photos"] = photos
      # Prune dateUploaded
      for item in template_vars["photos"]:
        item["uploaded"] = item["uploaded"].split('.')[0]

    # check if fullscreen
    if len(args) > 2 and args[2] == "fullscreen":
      template_vars["fullscreen"] = True
    else:
      template_vars["fullscreen"] = False

    # Collect photo thumburls
    template_vars["navlinks"] = [
    {
      "name": "Home",
      "href": "/album/%s" % args[0]
    },
    {
      "name": "Fotos",
      "href": "/album/%s/overview" % args[0]
    }
    ]

    template_vars['album_index_url'] = "/album/%s" % args[0]

    if template_vars["fullscreen"]:
      return self.render_template("album/fullscreen.html", template_vars)
    else:
      return self.render_template("album/overview.html", template_vars)
