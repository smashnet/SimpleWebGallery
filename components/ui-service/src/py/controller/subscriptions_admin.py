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

class SubscriptionsAdminController(BaseController):

  @cherrypy.expose
  def index(self):
    # Collect photo thumburls
    template_vars = {}
    template_vars["title"] = {
    "name": "SimpleWebGallery - Administration",
    "href": "/admin"
    }
    # Set navbar links
    template_vars["navlinks"] = [
    {
      "name": "Home",
      "href": "/"
    },
    {
      "name": "Fotos",
      "href": "/admin/photos"
    },
    {
      "name": "Subscriptions",
      "href": "/admin/subscriptions"
    }
    ]

    # TODO: Get information from SubscriptionService
    subs = None
    if subs is not None:
      template_vars["subscriptions"] = subs
      # Prune dateUploaded
      for item in template_vars["subscriptions"]:
        item["dateSubscribed"] = item["dateSubscribed"].split('.')[0]
    template_vars["bodyclass"] = "class=main"
    return self.render_template("subscriptions_admin/index.html", template_vars)
