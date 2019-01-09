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
      template_vars["albums"] = albums
    return self.render_template("admin/index.html", template_vars)

  '''
  /admin/album/accessCode
  Admin page for a certain album
  '''
  @cherrypy.expose
  def album_index(self, args=None):
    template_vars = {"bodyclass": "class=main"}
    template_vars["title"] = {
    "name": "SWG - Administration",
    "href": "/admin"
    }
    # args[0] -> "album"
    # args[1] -> accessCode

    # Check if is valid access code
    if len(args) < 2 or not common.isValidAccessCode(args[1]):
      return self.render_template("admin/wrongAccessCode.html", template_vars)

    # Resolve access code to id. Returns {} if no album with this code exists
    r = requests.get("http://album-service:8080/album-service/accesscode/%s" % args[1])
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
      "created": albuminfo['created'].split('.')[0],
      "amount_files": len(albuminfo['files']),
      "amount_subscriptions": len(albuminfo['subscriptions']),
      "edit_files_url": "/admin/album/%s/files" % albuminfo['accesscode'],
      "edit_subscriptions_url": "/admin/album/%s/subscriptions" % albuminfo['accesscode'],
      "delete_album_url": "/album-service/albums/%s" % albummeta['albumid']
    }

    return self.render_template("admin/album_index.html", template_vars)

  '''
  /admin/album/accessCode/files
  Admin page to see and delete files for a certain album
  '''
  @cherrypy.expose
  def album_files(self, args=None):
    template_vars = {"bodyclass": "class=main"}
    template_vars["title"] = {
    "name": "SWG - Administration",
    "href": "/admin"
    }
    # TODO
    return self.render_template("admin/album_files.html", template_vars)

  '''
  /admin/album/accessCode/subscriptions
  Admin page to see and delete subscrptions for a certain album
  '''
  @cherrypy.expose
  def album_subscriptions(self, args=None):
    template_vars = {"bodyclass": "class=main"}
    template_vars["title"] = {
    "name": "SWG - Administration",
    "href": "/admin"
    }
    # TODO
    return self.render_template("admin/album_subscriptions.html", template_vars)
