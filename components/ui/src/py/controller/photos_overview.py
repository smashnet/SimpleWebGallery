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

from controller.base import BaseController

class PhotosOverviewController(BaseController):

  @cherrypy.expose
  def index(self, mode, startIndex=0):
    # Collect photo thumburls
    template_vars = {}
    template_vars["navlinks"] = [
    {
      "name": "Home",
      "href": "/"
    },
    {
      "name": "Fotos",
      "href": "/overview"
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
    template_vars["bodyclass"] = "class=main"

    if mode == "fullscreen":
      return self.render_template("photos_overview/fullscreen.html", template_vars)
    else:
      return self.render_template("photos_overview/index.html", template_vars)
