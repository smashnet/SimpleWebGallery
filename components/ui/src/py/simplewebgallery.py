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
from controller.photos_overview import PhotosOverviewController
from controller.slideshow import SlideshowController
from controller.photos_admin import PhotosAdminController
from controller.subscriptions_admin import SubscriptionsAdminController

class SimpleWebGallery(object):

  @cherrypy.expose
  def default(self, *args, **kwargs):
    return open('src/views/404.html')

  @cherrypy.expose
  def index(self):
    c = HomeController()
    return c.index()

  @cherrypy.expose
  def album(self, *args, **kwargs):
    c = AlbumController()
    # Route to get the overview of a certain album, e.g. /album/12345678/overview
    if len(args) >= 2 and args[1] == "overview":
      return c.overview(args)
    # Route to post a new photo to a certain album, e.g. /album/12345678/photo
    if len(args) >= 2 and args[1] == "photo":
      return c.post_photo(args, kwargs["file"])
    return c.index(args)

  @cherrypy.expose
  def overview(self, mode=None, startIndex=0):
    c = PhotosOverviewController()
    return c.index(mode, startIndex)

  @cherrypy.expose
  def slideshow(self, startIndex=0):
    c = SlideshowController()
    return c.index(startIndex)

  @cherrypy.expose
  def admin(self, section=None):
    if section == "photos":
      c = PhotosAdminController()
      return c.index()
    if section == "subscriptions":
      c = SubscriptionsAdminController()
      return c.index()
    c = AdminController()
    return c.index()
