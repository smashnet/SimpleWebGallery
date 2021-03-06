'''
simplewebgallery.py

Main file of SimpleWebGallery.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import cherrypy
import requests
import time

import common
from controller.base import BaseController

class AdminController(BaseController):

  '''
  /admin
  General admin page where albums are listed and can be created.
  '''
  @cherrypy.expose
  def index(self):
    template_vars = {"bodyclass": "class=main"}
    template_vars["title"] = {
    "name": "SWG - Administration",
    "href": "/admin"
    }

    # Set album create url
    template_vars["create_album_url"] = "/album-service/albums"

    # Get albums
    r = requests.get("http://album-service:8080/album-service/albums")
    albums = r.json()
    if albums is not None:
      for album in albums:
        album['view_url'] = "/album/%s" % album['accesscode']
        album['edit_url'] = "/admin/album/%s" % album['accesscode']
        album['delete_url'] = "/album-service/albums/%s" % album['albumid']
        album['timestamp_created'] = time.strftime("%d %b %Y %H:%M:%S", time.gmtime(album["timestamp_created"]))
      template_vars["albums"] = albums
    return self.render_template("admin/index.html", template_vars)

  '''
  /admin/album/accessCode
  Admin page for a certain album
  '''
  @cherrypy.expose
  def album_index(self, access_code=None):
    template_vars = {"bodyclass": "class=main"}
    template_vars["title"] = {
    "name": "SWG - Administration",
    "href": "/admin"
    }

    # Check if is valid access code
    if not common.isValidAccessCode(access_code):
      return self.render_template("admin/wrongAccessCode.html", template_vars)

    # Resolve access code to id. Returns {} if no album with this code exists
    r = requests.get("http://album-service:8080/album-service/resolveid/%s" % access_code)
    if r.json() == {}:
      return self.render_template("admin/wrongAccessCode.html", template_vars)

    albummeta = r.json()

    # Get album information
    r = requests.get("http://album-service:8080/album-service/albums/%s" % albummeta['albumid'])
    albuminfo = r.json()

    template_vars['album'] = {
      "id": albuminfo['albumid'],
      "name": albuminfo['name'],
      "access_code": albuminfo['accesscode'],
      "creator": albuminfo['creator'],
      "created": time.strftime("%d %b %Y %H:%M:%S", time.gmtime(albuminfo["timestamp_created"])),
      "amount_files": len(albuminfo['files']),
      "amount_subscriptions": len(albuminfo['subscriptions']),
      "edit_files_url": "/admin/album/%s/files" % albuminfo['accesscode'],
      "edit_subscriptions_url": "/admin/album/%s/subscriptions" % albuminfo['accesscode'],
      "delete_album_url": "/album-service/albums/%s" % albummeta['albumid']
    }

    # Set nav items
    template_vars["navlinks"] = [
    {
      "name": "Back",
      "href": "/admin"
    }
    ]

    return self.render_template("admin/album_index.html", template_vars)

  '''
  /admin/album/accessCode/files
  Admin page to see and delete files for a certain album
  '''
  @cherrypy.expose
  def album_files(self, access_code=None):
    template_vars = {"bodyclass": "class=main"}
    template_vars["title"] = {
    "name": "SWG - Administration",
    "href": "/admin"
    }

    # access_code should be the 8-digit-access-code
    if not common.isValidAccessCode(access_code):
      return self.render_template("album/wrongAccessCode.html", template_vars)

    # Resolve access code to id. Returns {} if no album with this code exists
    r = requests.get("http://album-service:8080/album-service/resolveid/%s" % access_code)
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

      photos = []
      for file in files:
        fileinfo = file
        fileinfo['thumb_url'] = "/thumbnail-service/thumbnails/%s" % file['fileid']
        fileinfo['file_url'] = "/photo-service/rawcontent/%s" % file['fileid']
        fileinfo['delete_url'] = "/album-service/albums/%s/photos/%s" % (albummeta['albumid'],file['fileid'])
        photos.append(fileinfo)
      if photos is not []:
        template_vars["photos"] = photos
        # Prune dateUploaded
        for item in template_vars["photos"]:
          item["uploaded"] = time.strftime("%d %b %Y %H:%M:%S", time.gmtime(item["timestamp_uploaded"]))
          if item["timestamp_date_time_original"] != 0:
            item["taken"] = time.strftime("%d %b %Y %H:%M:%S", time.gmtime(item["timestamp_date_time_original"]))
          else:
            item["taken"] = "Date unknown"

    # Set nav items
    template_vars["navlinks"] = [
    {
      "name": "Back",
      "href": "/admin/album/%s" % access_code
    }
    ]

    template_vars['album_index_url'] = "/album/%s" % access_code
    template_vars['delete_all_url'] = "/album-service/albums/%s/photos" % albummeta['albumid']

    return self.render_template("admin/album_files.html", template_vars)

  '''
  /admin/album/accessCode/subscriptions
  Admin page to see and delete subscrptions for a certain album
  '''
  @cherrypy.expose
  def album_subscriptions(self, access_code=None):
    template_vars = {"bodyclass": "class=main"}
    template_vars["title"] = {
    "name": "SWG - Administration",
    "href": "/admin"
    }

    if not common.isValidAccessCode(access_code):
      return self.render_template("album/wrongAccessCode.html", template_vars)

    # Resolve access code to id. Returns {} if no album with this code exists
    r = requests.get("http://album-service:8080/album-service/resolveid/%s" % access_code)
    if r.json() == {}:
      return self.render_template("album/wrongAccessCode.html", template_vars)

    albummeta = r.json()

    # Get album information
    r = requests.get("http://album-service:8080/album-service/albums/%s" % albummeta['albumid'])
    albuminfo = r.json()

    if len(albuminfo['subscriptions']) > 0:
      # Get file information
      r = requests.get("http://subscription-service:8080/subscription-service/subscriptions", params={"subscriptionids": albuminfo['subscriptions']})
      subscriptions = r.json()

      for sub in subscriptions:
        if sub['timestamp_subscribed'] != 0:
          sub['date_subscribed'] = time.strftime("%d %b %Y %H:%M:%S", time.gmtime(sub['timestamp_subscribed']))
        else:
          sub['date_subscribed'] = "Date unknown"
        sub['delete_url'] = "/album-service/albums/%s/subscriptions/%s" % (albummeta['albumid'],sub['id'])

      template_vars['subscriptions'] = subscriptions

    # Set nav items
    template_vars["navlinks"] = [
    {
      "name": "Back",
      "href": "/admin/album/%s" % access_code
    }
    ]

    return self.render_template("admin/album_subscriptions.html", template_vars)
