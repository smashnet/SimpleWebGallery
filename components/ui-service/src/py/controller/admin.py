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
    "name": "SimpleWebGallery - Administration",
    "href": "/admin"
    }
    # Set navbar links
    template_vars["navlinks"] = []
    # Set admin area links# Set navbar links
    template_vars["adminlinks"] = []

    # Set album create url
    template_vars["album_create_url"] = "/album-service/albums"

    # Get albums
    r = requests.get("http://album-service:8080/album-service/albums")
    albums = r.json()
    if albums is not None:
      for album in albums:
        album['url_view'] = "/album/%s" % album['accesscode']
        album['url_edit'] = "/admin/album/%s" % album['accesscode']
        album['url_delete'] = "/album-service/albums/%s" % album['albumid']
      template_vars["albums"] = albums
    return self.render_template("admin/index.html", template_vars)

  '''
  /admin/album/accessCode
  Admin page for a certain album
  '''
  @cherrypy.expose
  def album_index(self, args=None):
    template_vars = {"bodyclass": "class=main"}
    # TODO
    return self.render_template("admin/album_index.html", template_vars)

  '''
  /admin/album/accessCode/files
  Admin page to see and delete files for a certain album
  '''
  @cherrypy.expose
  def album_files(self, args=None):
    template_vars = {"bodyclass": "class=main"}
    # TODO
    return self.render_template("admin/album_files.html", template_vars)

  '''
  /admin/album/accessCode/subscriptions
  Admin page to see and delete subscrptions for a certain album
  '''
  @cherrypy.expose
  def album_subscriptions(self, args=None):
    template_vars = {"bodyclass": "class=main"}
    # TODO
    return self.render_template("admin/album_subscriptions.html", template_vars)
