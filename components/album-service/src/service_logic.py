'''
album_service_root.py

Album service of SimpleWebGallery that manages albums of photos.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import uuid

import cherrypy
import logging
import random
import string
import time

import config
import common

from service_album_handling import *

class AlbumServiceLogic(object):

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def index(self, *args, **kwargs):
    return {"message": "Hello world!",
            "service": config.NAME,
            "version": config.VERSION}

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def getAlbumsInfo(self):
    return getListOfAllAlbums()

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def getAlbumInfo(self, albumid=None):
    # Check if uuid given
    if albumid == None:
      logging.warn("No UUID given in request.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "No UUID given in request."}
    # Check if is valid uuid
    try:
      uuid.UUID(albumid, version=4)
    except ValueError:
      logging.warn("No valid UUID4 given in request.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "No valid UUID4 given in request."}

    return getAlbumInformation(albumid)

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_in()
  @cherrypy.tools.json_out()
  def postAlbum(self):
    input_json = cherrypy.request.json

    if input_json['albumname'] == None:
      cherrypy.response.status = 400 # Bad request
      return {"message": "No album created", "error": "Missing album name"}

    # TODO: Validate album name

    res = {
      "albumid": str(uuid.uuid4()),
      "name": input_json['albumname'],
      "accesscode": ''.join(random.choices(string.ascii_lowercase + string.digits, k=8)),
      "creator": cherrypy.request.remote.ip,
      "timestamp_created": int(time.time())
    }

    # Save new album in DB
    saveNewAlbum(res)

    return {"message": "Success!", "album": res}

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_in()
  @cherrypy.tools.json_out()
  def putAlbum(self):
    input_json = cherrypy.request.json
    # TODO
    return {"error": "Not yet implemented"}

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def deleteCompleteAlbum(self, albumid=None):
    # Check if uuid given
    if albumid == None:
      logging.warn("No UUID given in request.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "No UUID given in request."}
    # Check if is valid uuid
    try:
      uuid.UUID(albumid, version=4)
    except ValueError:
      logging.warn("No valid UUID4 given in request.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "No valid UUID4 given in request."}

    # /album-service/albums/albumid
    # We should delete the complete album
    return deleteCompleteAlbum(albumid)

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def deletePhotosFromAlbum(self, albumid=None):
    # Check if uuid given
    if albumid == None:
      logging.warn("No UUID given in request.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "No UUID given in request."}
    # Check if is valid uuid
    try:
      uuid.UUID(albumid, version=4)
    except ValueError:
      logging.warn("No valid UUID4 given in request.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "No valid UUID4 given in request."}

    # /album-service/albums/albumid/photos
    # We should delete all files from the album
    return deleteAllFilesFromAlbum(albumid)

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def deletePhotoFromAlbum(self, albumid=None, photoid=None):
    # Check if uuid given
    if albumid == None or photoid == None:
      logging.warn("Albumid or photoid missing in request.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "Albumid or photoid missing in request."}
    # Check if is valid uuid
    try:
      uuid.UUID(albumid, version=4)
      uuid.UUID(photoid, version=4)
    except ValueError:
      logging.warn("Albumid or photoid invalid.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "Albumid or photoid invalid."}

    # /album-service/albums/albumid/photos/uuid
    # We should delete a certain file from the album
    return deleteFileFromAlbum(albumid, photoid)

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def deleteSubscriptionFromAlbum(self, albumid=None, subscriptionid=None):
    # Check if uuid given
    if albumid == None or subscriptionid == None:
      logging.warn("Albumid or subscriptionid missing in request.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "Albumid or subscriptionid missing in request."}
    # Check if is valid uuid
    try:
      uuid.UUID(albumid, version=4)
      uuid.UUID(subscriptionid, version=4)
    except ValueError:
      logging.warn("Albumid or subscriptionid invalid.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "Albumid or subscriptionid invalid."}

    # /album-service/albums/albumid/subscriptions/uuid
    # We should delete certain subscriptions from the album
    return deleteSubscriptionFromAlbum(albumid, subscriptionid)

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def getAlbumIdFromAccessCode(self, accesscode=None):
    if accesscode == None:
      logging.warn("Accesscode missing in request.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "Accesscode missing in request."}

    # Check if is valid access code
    if not common.isValidAccessCode(accesscode):
      logging.warn("Invalid accesscode.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "Invalid accesscode."}

    return getAlbumInformationShort(accesscode)
