'''
subscription_service_subscriptions.py

Handles requests regarding subscriptions.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os
import uuid
import logging
import re
import json
import time

import cherrypy
import sqlite3

import config
import common

class SubscriptionServiceLogic(object):

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def index(self, *args, **kwargs):
    return {"message": "Hello world!",
            "service": config.NAME,
            "version": config.VERSION}

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def getSubscription(self, subscriptionid):
    # Check if is valid UUID4
    try:
      uuid.UUID(subscriptionid, version=4)
    except ValueError:
      logging.warn("No UUID4 given in request.")
      return {"error": "No UUID4 given in request."}

    # Return subscription information for given subscriptionids
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT * FROM subscriptions WHERE id='%s'" % subscriptionid)
      res = common.DBtoList(r)
      return res

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def getSubscriptions(self, subscriptionids=None):
    # If no parameter is provided -> error
    if subscriptionids is None:
      logging.warn("No UUID(s) given in request.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "No UUID(s) given in request."}

    # Sadly, we have to consider single subscriptions being a raw UUID,
    # and not a list of a single UUID so we have to check and handle this here
    if isinstance(subscriptionids, str):
      # We have a single UUID, and not a list
      try:
        uuid.UUID(subscriptionids, version=4)
      except ValueError:
        logging.warn("At least one item in JSON content is not a UUID")
        cherrypy.response.status = 400 # Bad request
        return {"error": "At least one item in JSON content is not a UUID"}

      subscriptionids = [subscriptionids]
    else:
      # Check all uuids
      for id in subscriptionids:
        try:
          uuid.UUID(id, version=4)
        except ValueError:
          logging.warn("At least one item in JSON content is not a UUID")
          return {"error": "At least one item in JSON content is not a UUID"}

    # Return subscription information for given subscriptionids
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT * FROM subscriptions WHERE id IN (%s)" % ','.join('"%s"'%x for x in subscriptionids))
      res = common.DBtoList(r)
      return res

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def postSubscription(self, mailaddress, albumid):
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

    info = {"id": str(uuid.uuid4()),
            "mail": mailaddress,
            "ip": cherrypy.request.remote.ip,
            "ts-subscribed": int(time.time())
            }

    # If mail not already registered
    if not self.mailExists(info['mail']):
      # Save subscription in DB
      with sqlite3.connect(config.DB_STRING) as c:
        c.execute("INSERT INTO subscriptions VALUES (?, ?, ?, ?)",
          [info['id'], info['mail'], info['ip'], info['ts-subscribed']])
      # Place task to add subscription in album service
      taskitem = {"subscription-id": info['id'], "album-id": albumid}
      common.myRedis.lpush("add-subscription-to-album", json.dumps(taskitem)) # Add task to list

      logging.info("Saved new subscription for album %s" % albumid)

      return info
    else:
      logging.warn("Mail address %s is already subscriber in album %s" % (info['mail'], albumid))
      cherrypy.response.status = 409 # Conflict
      return {"error": "You already subscribed to this album!"}

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def putSubscription(self, subscriptionid, mail=None, albumid=None):
    return subscriptionid

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def deleteSubscription(self, subscriptionid):
    # Delete user from DB
    if len(subscriptionid) == 0:
      return {"error": "No subscription id provided for deletion"}
    else:
      with sqlite3.connect(config.DB_STRING) as c:
        c.execute("DELETE FROM subscriptions WHERE id=?", (str(subscriptionid),))

      return {"deleted": subscriptionid}

  def mailExists(self, mail):
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT * FROM subscriptions WHERE mail=? LIMIT 1", (mail,))
      if len(r.fetchall()) == 0:
        return False
      else:
        return True

  @cherrypy.tools.json_out()
  def GET(self, subscriptionid=None, subscriptions=None):
    # If no parameter is provided -> error
    if subscriptionid is None and subscriptions is None:
      return {"error": "No UUID"}

    # Check if is valid uuid
    if subscriptions is not None:
      # Sadly, we have to consider single subscriptions being a raw UUID,
      # and not a list of with a single UUID so we have to check and handle this here
      if isinstance(subscriptions, str):
        # We have a single UUID
        try:
          uuid.UUID(subscriptions, version=4)
        except ValueError:
          logging.warn("At least one item in JSON content is not a UUID")
          return {"error": "At least one item in JSON content is not a UUID"}

        theSingleUUID = subscriptions
        subscriptions = []
        subscriptions.append(theSingleUUID)
      else:
        # Check all uuids
        for id in subscriptions:
          try:
            uuid.UUID(id, version=4)
          except ValueError:
            logging.warn("At least one item in JSON content is not a UUID")
            return {"error": "At least one item in JSON content is not a UUID"}

      # Return subscription information for given subscriptionids
      with sqlite3.connect(config.DB_STRING) as c:
        r = c.execute("SELECT * FROM subscriptions WHERE id IN (%s)" % ','.join('"%s"'%x for x in subscriptions))
        res = common.DBtoList(r)
        return res
    else:
      try:
        uuid.UUID(subscriptionid, version=4)
      except ValueError:
        logging.warn("Not a valid UUID")
        return {"error": "Not a valid uuid"}

      # Return file information for single file
      with sqlite3.connect(config.DB_STRING) as c:
        r = c.execute("SELECT * FROM subscriptions WHERE id=?", (str(subscriptionid),))
        res = common.DBtoDict(r)
        return res

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

    info = {"id": str(uuid.uuid4()),
            "mail": mailaddress,
            "ip": cherrypy.request.remote.ip,
            "ts-subscribed": int(time.time())
            }

    # If mail not already registered
    if not self.mailExists(info['mail']):
      # Save subscription in DB
      with sqlite3.connect(config.DB_STRING) as c:
        c.execute("INSERT INTO subscriptions VALUES (?, ?, ?, ?)",
          [info['id'], info['mail'], info['ip'], info['ts-subscribed']])
      # Place task to add subscription in album service
      taskitem = {"subscription-id": info['id'], "album-id": albumid}
      common.myRedis.lpush("add-subscription-to-album", json.dumps(taskitem)) # Add task to list

      logging.info("Saved new subscription for album %s" % albumid)

      return info
    else:
      logging.warn("Mail address %s is already subscriber in album %s" % (info['mail'], albumid))
      return {"error": "You already subscribed!"}
