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

import config
from controller.base import BaseController

class AdminController(BaseController):

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
    template_vars["album_create_url"] = "http://%s/album-service/albums" % config.ALBUM_SERVICE_URL

    # Album fake:
    template_vars["albums"] = [
    {
      "uuid": "123",
      "name": "hello world",
      "accesscode": "12345678",
      "creator": "172.20.0.1",
      "dateCreated": "07.12.2018 - 14:52Uhr"
    }
    ]
    return self.render_template("admin/index.html", template_vars)
