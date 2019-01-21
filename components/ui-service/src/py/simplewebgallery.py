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

  def getRoutesDispatcher(self):
    d = cherrypy.dispatch.RoutesDispatcher()

    d.connect('home_index', '/',
              controller=HomeController(),
              action='index',
              conditions=dict(method=['GET']))

    d.connect('album_index', '/album/{access_code}',
              controller=AlbumController(),
              action='index',
              conditions=dict(method=['GET']))

    d.connect('album_overview', '/album/{access_code}/overview',
              controller=AlbumController(),
              action='overview',
              conditions=dict(method=['GET']))

    d.connect('admin_index', '/admin',
              controller=AdminController(),
              action='index',
              conditions=dict(method=['GET']))

    d.connect('admin_album_index', '/admin/album/{access_code}',
              controller=AdminController(),
              action='album_index',
              conditions=dict(method=['GET']))

    d.connect('admin_album_files', '/admin/album/{access_code}/files',
              controller=AdminController(),
              action='album_files',
              conditions=dict(method=['GET']))

    d.connect('admin_album_subscriptions', '/admin/album/{access_code}/subscriptions',
              controller=AdminController(),
              action='album_subscriptions',
              conditions=dict(method=['GET']))

    return d
