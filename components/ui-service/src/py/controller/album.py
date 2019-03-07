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
import json
import time

import common
import config
from controller.base import BaseController

class AlbumController(BaseController):

  def _prepare_template_vars_album_overview(self, files):
    photos = []
    for file in files:
      fileinfo = file
      fileinfo['thumburl'] = "/thumbnail-service/thumbnails/%s" % file['fileid']
      fileinfo['fileurl'] = "/photo-service/rawcontent/%s" % file['fileid']
      photos.append(fileinfo)
    if photos is not []:
      # Prune dateUploaded
      for item in photos:
        item["uploaded"] = time.strftime("%d %b %Y %H:%M:%S", time.gmtime(item["timestamp_uploaded"]))
        if item["timestamp_date_time_original"] != 0:
          item["taken"] = time.strftime("%d %b %Y %H:%M:%S", time.gmtime(item["timestamp_date_time_original"]))
        else:
          item["taken"] = "Date unknown"
    return photos

  @cherrypy.expose
  def index(self, access_code=''):
    template_vars = {}
    template_vars["bodyclass"] = "class=main"
    # Check args
    # access_code should be the 8-digit-access-code
    # Check if is valid access code
    if not common.isValidAccessCode(access_code):
      return self.render_template("album/wrongAccessCode.html", template_vars)

    # Resolve access code to id. Returns {} if no album with this code exists
    r = requests.get("http://album-service:8080/album-service/accesscode/%s" % access_code)
    if r.json() == {}:
      return self.render_template("album/wrongAccessCode.html", template_vars)

    albummeta = r.json()

    # Get album information
    r = requests.get("http://album-service:8080/album-service/albums/%s" % albummeta['albumid'])
    albuminfo = r.json()
    template_vars['album_id'] = albuminfo['albumid']
    template_vars['album_name'] = albuminfo['name']
    template_vars['album_accesscode'] = albuminfo['accesscode']
    template_vars['album_created'] = time.strftime("%d %b %Y %H:%M:%S", time.gmtime(albuminfo["timestamp_created"]))
    template_vars['album_amount_photos'] = len(albuminfo['files'])
    template_vars['album_amount_subscriptions'] = len(albuminfo['subscriptions'])

    # create photo upload url
    template_vars["photo_upload_url"] = "/photo-service/photos"
    template_vars["register_subscription_url"] = "/subscription-service/subscriptions"


    # Set nav items
    template_vars["navlinks"] = [
    {
      "name": "Home",
      "href": "/album/%s/" % access_code
    },
    {
      "name": "Fotos",
      "href": "/album/%s/overview" % access_code
    }
    ]

    template_vars['album_index_url'] = "/album/%s" % access_code
    template_vars['share_link_subject'] = "SimpleWebGallery shared album: %s" % albuminfo['name']
    template_vars['share_link_body'] = "Hi there,%%0D%%0A%%0D%%0Asomebody shared this great album with you: %s%%0D%%0A%%0D%%0ALink: %s%s%%0D%%0AAccess code: %s%%0D%%0A%%0D%%0ABest regards,%%0D%%0ASimpleWebGallery" % (albuminfo['name'], "http://" + config.PUBLIC_URL, template_vars['album_index_url'], access_code)

    return self.render_template("album/index.html", template_vars)

  @cherrypy.expose
  def overview(self, access_code):
    template_vars = {}
    template_vars["bodyclass"] = "class=main"

    # access_code should be the 8-digit-access-code
    if not common.isValidAccessCode(access_code):
      return self.render_template("album/wrongAccessCode.html", template_vars)

    # Resolve access code to id. Returns {} if no album with this code exists
    r = requests.get("http://album-service:8080/album-service/accesscode/%s" % access_code)
    if r.json() == {}:
      return self.render_template("album/wrongAccessCode.html", template_vars)

    albummeta = r.json()

    # Get album information
    r = requests.get("http://album-service:8080/album-service/albums/%s" % albummeta['albumid'])
    albuminfo = r.json()

    if len(albuminfo['files']) > 0:
      # Get file information
      r = requests.get("http://photo-service:8080/photo-service/photos", params={"photoids": albuminfo['files']})
      files = r.json()

      # Prepare template_vars
      template_vars['photos'] = self._prepare_template_vars_album_overview(files)

    template_vars["navlinks"] = [
    {
      "name": "Home",
      "href": "/album/%s" % access_code
    },
    {
      "name": "Fotos",
      "href": "/album/%s/overview" % access_code
    }
    ]

    template_vars['album_index_url'] = "/album/%s" % access_code

    return self.render_template("album/overview.html", template_vars)
