'''
simplewebgallery_web.py

Coming soon!

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os

import cherrypy

# Import controller
from controller.home import HomeController
from controller.album import AlbumController
from controller.admin import AdminController
from controller.pagenotfound import PageNotFoundController

class SimpleWebGallery(object):

  @cherrypy.expose
  def default(self, *args, **kwargs):
    c = PageNotFoundController()
    return c.index()

  @cherrypy.expose
  def index(self):
    # /
    # Home page where access code can be entered
    c = HomeController()
    return c.index()

  @cherrypy.expose
  def album(self, *args, **kwargs):
    c = AlbumController()
    # /album
    # Not valid without further parameters
    if len(args) == 0:
      c = PageNotFoundController()
      return c.index()

    # /album/accessCode
    # Home page of this album. Access code validity is checked in controller
    if len(args) == 1:
      return c.index(args)

    # /album/accessCode/overview
    # Route to get the overview of a certain album
    if len(args) >= 2 and args[1] == "overview":
      return c.overview(args)

    # Everything else is not valid, so:
    c = PageNotFoundController()
    return c.index()

  @cherrypy.expose
  def admin(self, *args, **kwargs):
    c = AdminController()
    # /admin
    # General admin page where albums are listed an new ones can be created
    if len(args) == 0:
      return c.index()

    # /admin/???
    # Is not valid as we need an access code
    if len(args) == 1:
      c = PageNotFoundController()
      return c.index()

    # /admin/album/???
    # Main admin page for a certain album
    if len(args) == 2 and args[0] == "album":
      return c.album_index(args)

    # /admin/album/code/files
    # Files admin page for a certain album
    if len(args) == 3 and args[0] == "album" and args[2] == "files":
      return c.album_files(args)

    # /admin/album/code/subscriptions
    # Subscriptions admin page for a certain album
    if len(args) == 3 and args[0] == "album" and args[2] == "subscriptions":
      return c.album_subscriptions(args)

    # Everything else is not valid, so:
    c = PageNotFoundController()
    return c.index()
