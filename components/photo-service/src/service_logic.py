'''
service_logic.py

Handles requests regarding photos.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os, os.path
import uuid
import json
import logging
import io
import time
from zipfile import ZipFile

import cherrypy
import sqlite3

import config
import common

from service_file_handling import process_and_store_new_photo

class PhotoServiceLogic(object):

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def index(self, *args, **kwargs):
    return {"message": "Hello world!",
            "service": config.NAME,
            "version": config.VERSION}

  @cherrypy.tools.accept(media='application/json')
  def getPhotosZip(self, photoids=None, zipname=None):
    photosinfo = self.getPhotosInfo(photoids)
    if 'error' in photosinfo:
      return photosinfo
    inmemoryzip = io.BytesIO()
    if zipname is None:
      zipname = time.strftime("%Y-%m-%d_%H-%M-%S", time.gmtime(time.time()+7200))
    # Create zip of requested photos
    with ZipFile(inmemoryzip, "w") as zip:
      # Go through photos
      for photo in photosinfo:
        with open(config.PHOTO_DIR + "/%s%s" % (photo['fileid'], photo['extension']), "rb") as the_file:
          # Set new filename according to date taken or (if not available) date uploaded
          if photo['timestamp_date_time_original'] == 0:
            filename = "%s/%s%s" % (zipname, time.strftime("%Y-%m-%d_%H-%M-%S", time.gmtime(photo["timestamp_uploaded"]+7200)), photo['extension'])
          else:
            filename = "%s/%s%s" % (zipname, time.strftime("%Y-%m-%d_%H-%M-%S", time.gmtime(photo["timestamp_date_time_original"])), photo['extension'])

          zip.writestr(filename, the_file.read())

    cherrypy.response.headers['Content-Disposition'] = 'attachment; filename="%s.zip"' % zipname
    cherrypy.response.headers['Content-Type'] = "application/zip"
    return inmemoryzip.getvalue()

  def getPhotoData(self, photoid=None):
    # Check if uuid given
    if photoid == None:
      cherrypy.response.headers['Content-Type'] = "application/json"
      cherrypy.response.status = 400 # Bad request
      return json.dumps({"error": "No UUID"})
    # Check if is valid uuid
    try:
      uuid.UUID(photoid, version=4)
    except ValueError:
      logging.warn("No UUID4 given in request.")
      cherrypy.response.headers['Content-Type'] = "application/json"
      cherrypy.response.status = 400 # Bad request
      return json.dumps({"error": "No UUID4 given in request."})

    # Get file information from DB
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT * FROM files WHERE fileid=?", (str(photoid),))
      res = common.DBtoDict(r)
      with open(config.PHOTO_DIR + "/%s%s" % (res['fileid'], res['extension']), "rb") as the_file:
        cherrypy.response.headers['Content-Type'] = res['content_type']
        return the_file.read()

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def getPhotoInfo(self, photoid=None):
    # Check if uuid given
    if photoid == None:
      logging.warn("No UUID given in request.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "No UUID given in request."}
    # Check if is valid uuid
    try:
      uuid.UUID(photoid, version=4)
    except ValueError:
      logging.warn("No valid UUID4 given in request.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "No valid UUID4 given in request."}

    # Return file information for single file
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT * FROM files WHERE fileid=?", (str(photoid),))
      res = common.DBtoDict(r)
      return res

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def getPhotosInfo(self, photoids=None):
    # Check if uuid given
    if photoids == None:
      logging.warn("No UUID(s) given in request.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "No UUID(s) given in request."}

    # Sadly, we have to consider files being a single UUID, and not a list of uuids
    # so we have to check and handle this here
    if isinstance(photoids, str):
      # We have a single UUID
      try:
        uuid.UUID(photoids, version=4)
      except ValueError:
        logging.warn("At least one item in JSON content is not a UUID")
        cherrypy.response.status = 400 # Bad request
        return {"error": "At least one item in JSON content is not a UUID"}

      photoids = [photoids]
    else:
      # Check all uuids
      for id in photoids:
        try:
          uuid.UUID(id, version=4)
        except ValueError:
          logging.warn("At least one item in JSON content is not a UUID")
          cherrypy.response.status = 400 # Bad request
          return {"error": "At least one item in JSON content is not a UUID"}

    # Return file information for all files
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT * FROM files WHERE fileid IN (%s) ORDER BY timestamp_date_time_original ASC" % ','.join('"%s"'%x for x in photoids))
      res = common.DBtoList(r)
      return res

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def postPhoto(self, file=None, albumid=None):
    # Check if parameters are given
    if file == None or albumid == None:
      logging.warn("Please check if -file- and -albumid- are provided.")
      cherrypy.response.status = 400 # Bad request
      return {"error": "No -file- or -albumid- provided in POST request."}

    ## Receive file, rotate, get exif information, and store
    info, data = process_and_store_new_photo(file)
    logging.info(info)

    ## Save photo info in DB
    with sqlite3.connect(config.DB_STRING) as c:
      c.execute("INSERT INTO files VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [info['fileid'], info['filename'], info['extension'], info['content_type'], info['md5'], info['uploader'], info['timestamp_date_time_original'], info['timestamp_uploaded']])

    ## Save photo data to redis, key: uuid
    common.myRedis.set(info['fileid'], bytes(data))

    ## Create task to create thumbnails
    taskitem = {"fileid": info['fileid'], "extension": info['extension']}
    common.myRedis.lpush("create-thumbnail", json.dumps(taskitem)) # Add task to list

    ## Create task to add photo to album
    taskitem = {"fileid": info['fileid'], "albumid": albumid}
    common.myRedis.lpush("add-file-to-album", json.dumps(taskitem)) # Add task to list

    return info

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def deletePhoto(self, photoid=None):
    if photoid == None:
      cherrypy.response.status = 400 # Bad request
      return {"error": "No -photoid- provided for deletion."}
    else:
      # Check if is valid uuid
      try:
        uuid.UUID(photoid, version=4)
      except ValueError:
        cherrypy.response.status = 400 # Bad request
        return {"error": "Not a valid UUID"}

      # Get file name info from DB
      with sqlite3.connect(config.DB_STRING) as c:
        r = c.execute("SELECT * FROM files WHERE fileid=?", (str(photoid),))
        res = common.DBtoDict(r)
        if res == {}:
          return {"error": "The photo with the provided id does not exist"}

      # Delete photo from storage
      try:
        os.remove(config.PHOTO_DIR + "/%s%s" % (res['fileid'],res['extension']))
      except FileNotFoundError:
        logging.warn("File %s%s already gone" % (res['fileid'],res['extension']))

      # Delete photos from DB
      with sqlite3.connect(config.DB_STRING) as c:
        c.execute("DELETE FROM files WHERE fileid=?", (str(photoid),))

      return {"message": "Deletion successful", "uuid": photoid}
