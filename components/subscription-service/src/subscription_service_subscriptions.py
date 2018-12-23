'''
subscription_service_subscriptions.py

Handles requests regarding subscriptions.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os, os.path
from datetime import datetime
import uuid
import logging
import re
import json

import cherrypy
import sqlite3
import hashlib

import config
import common

@cherrypy.expose
class SubscriptionServiceSubscriptions(object):

  def getListOfAllSubscriptions(self):
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT * FROM subscriptions")
      res = common.DBtoDict(r)
      for item in res:
        # Add subscriberurl
        item["url"] = "/subscriptions/%s" % item["uuid"]
      if len(res) == 0:
        return None
      return res

  def mailExists(self, mail):
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT * FROM subscriptions WHERE mail=? LIMIT 1", (mail,))
      if len(r.fetchall()) == 0:
        return False
      else:
        return True

  def getSingleSubscriber(self, uuid):
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT * FROM subscriptions WHERE id=?", (str(uuid),))
      res = common.DBtoDict(r)
      if len(res) > 0:
        return res[0]
      else:
        return {"error": "UUID unknown"}

  @cherrypy.tools.json_out()
  def GET(self, subscriberuuid=None):
    # If no parameter is provided -> error
    if subscriberuuid is None:
      return {"error": "No UUID"}

    # Check if is valid uuid
    try:
      uuid.UUID(subscriberuuid, version=4)
    except ValueError:
      return {"error": "Not a UUID"}

    # Return single subscriber information
    return self.getSingleSubscriber(subscriberuuid)

  @cherrypy.tools.json_out()
  def POST(self, mailaddress, albumid):
    # Check mail validity
    if not re.match(r"[^@]+@[^@]+\.[^@]+", mailaddress):
      logging.warn("Mail address from POST is not a valid mail address.")
      return {"error": "Not a valid mail address"}

    # Check if albumid is valid uuid
    try:
      uuid.UUID(albumid, version=4)
    except ValueError:
      logging.warn("Album ID from POST is not a valid UUID.")
      return {"error": "Not a UUID"}

    info = {"id": str(uuid.uuid4()), "mail": mailaddress, "ip": cherrypy.request.remote.ip, "date-subscribed": str(datetime.utcnow())}

    # If mail not already registered
    if not self.mailExists(info['mail']):
      # Save subscription in DB
      with sqlite3.connect(config.DB_STRING) as c:
        c.execute("INSERT INTO subscriptions VALUES (?, ?, ?, ?)",
          [info['id'], info['mail'], info['ip'], info['date-subscribed']])
      # Place task to add subscription in album service
      taskitem = {"subscription-id": info['id'], "album-id": albumid}
      common.myRedis.lpush("add-subscription-to-album", json.dumps(taskitem)) # Add task to list

      logging.info("Saved new subscription for album %s" % albumid)

      return info
    else:
      return {"error": "You already subscribed!"}

  @cherrypy.tools.json_out()
  def DELETE(self, userid):
    # Delete user from DB
    if len(userid) == 0:
      return {"error": "No user provided for deletion"}
    else:
      with sqlite3.connect(config.DB_STRING) as c:
        c.execute("DELETE FROM subscriptions WHERE id=?", (str(userid),))

      return {"deleted": userid}

  def OPTIONS(self, userid):
    return
