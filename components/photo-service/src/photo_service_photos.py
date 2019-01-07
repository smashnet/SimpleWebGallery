'''
photo_service_photos.py

Handles requests regarding photos.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os, os.path
from datetime import datetime
import uuid
import json
import logging
import io

import cherrypy
import sqlite3
import hashlib
from PIL import Image, ExifTags

import config
import common

@cherrypy.expose
class PhotoServicePhotos(object):

  def receive_new_photo(self, file):
    size = 0
    whole_data = bytearray()
    filehash = hashlib.md5()

    while True:
      data = file.file.read(8192)
      filehash.update(data)
      whole_data += data # Save data chunks in ByteArray whole_data

      if not data:
        break
      size += len(data)

    img_uuid = str(uuid.uuid4())
    fn, filext = os.path.splitext(file.filename)
    res = {"fileid": img_uuid, "filename": fn, "extension": filext, "content_type": str(file.content_type), "md5": filehash.hexdigest(), "uploader": cherrypy.request.remote.ip, "uploaded": str(datetime.utcnow())}
    return res, whole_data

  def rotate_and_store(self, info, data):
    # Rotate image based on exif orientation
    try:
      image=Image.open(io.BytesIO(data))
      for orientation in ExifTags.TAGS.keys():
        if ExifTags.TAGS[orientation]=='Orientation':
          break
      exif=dict(image._getexif().items())

      if exif[orientation] == 3:
        image=image.rotate(180, expand=True)
      elif exif[orientation] == 6:
        image=image.rotate(270, expand=True)
      elif exif[orientation] == 8:
        image=image.rotate(90, expand=True)

    except (AttributeError, KeyError, IndexError):
      # cases: image don't have getexif
      pass

    image.save(config.PHOTO_DIR + "/%s%s" % (info['fileid'], info['extension']))
    image.close()

    with open(config.PHOTO_DIR + "/%s%s" % (info['fileid'], info['extension']), "rb") as the_file:
      return the_file.read()

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def GET(self, photouuid=None, files=None):
    # Check if uuid given
    if photouuid == None and files == None:
      return {"error": "No UUID given"}

    # Check if is valid uuid
    if files is not None:
      # Sadly, we have to consider files being a single UUID, and not a list of uuids
      # so we have to check and handle this here
      if isinstance(files, str):
        # We have a single UUID
        try:
          uuid.UUID(files, version=4)
        except ValueError:
          logging.warn("At least one item in JSON content is not a UUID")
          return {"error": "At least one item in JSON content is not a UUID"}

        theSingleUUID = files
        files = []
        files.append(theSingleUUID)
      else:
        # Check all uuids
        for id in files:
          try:
            uuid.UUID(id, version=4)
          except ValueError:
            logging.warn("At least one item in JSON content is not a UUID")
            return {"error": "At least one item in JSON content is not a UUID"}

      # Return file information for all files
      with sqlite3.connect(config.DB_STRING) as c:
        r = c.execute("SELECT * FROM files WHERE fileid IN (%s)" % ','.join('"%s"'%x for x in files))
        res = common.DBtoList(r)
        return res
    else:
      try:
        uuid.UUID(photouuid, version=4)
      except ValueError:
        logging.warn("Not a valid UUID")
        return {"error": "Not a valid uuid"}

      # Return file information for single file
      with sqlite3.connect(config.DB_STRING) as c:
        r = c.execute("SELECT * FROM files WHERE fileid=?", (str(photouuid),))
        res = common.DBtoDict(r)
        return res

  @cherrypy.tools.json_out()
  def POST(self, file, albumid):
    ## Receive file
    info, data = self.receive_new_photo(file)

    ## Rotate image if necessary, and write to storage
    rotated_data = self.rotate_and_store(info, data)

    ## Save photo in DB
    with sqlite3.connect(config.DB_STRING) as c:
      c.execute("INSERT INTO files VALUES (?, ?, ?, ?, ?, ?, ?)",
        [info['fileid'], info['filename'], info['extension'], info['content_type'], info['md5'], info['uploader'], info['uploaded']])

    ## Create task to create thumbnails
    common.myRedis.set(info['fileid'], bytes(rotated_data)) # Save data to redis, key: uuid
    taskitem = {"fileid": info['fileid'], "extension": info['extension']}
    common.myRedis.lpush("create-thumbnail", json.dumps(taskitem)) # Add task to list

    ## Create task to add photo to album
    taskitem = {"fileid": info['fileid'], "albumid": albumid}
    common.myRedis.lpush("add-file-to-album", json.dumps(taskitem)) # Add task to list

    return info

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def DELETE(self, photouuid):
    if len(photouuid) == 0:
      return {"error": "No photos provided for deletion"}
    else:
      # Check if is valid uuid
      try:
        uuid.UUID(photouuid, version=4)
      except ValueError:
        return {"error": "Not a valid UUID"}

      # Delete photos from storage
      with sqlite3.connect(config.DB_STRING) as c:
        r = c.execute("SELECT * FROM files WHERE fileid=?", (str(photouuid),))
        res = common.DBtoDict(r)
        if res == {}:
          return {"error": "The photo with the provided id does not exist"}
      try:
        os.remove(config.PHOTO_DIR + "/%s%s" % (res['fileid'],res['extension']))
      except FileNotFoundError:
        print("File %s%s already gone" % (res['fileid'],res['extension']))

      # Delete photos from DB
      with sqlite3.connect(config.DB_STRING) as c:
        c.execute("DELETE FROM files WHERE uuid=?", (str(photouuid),))

      return {"message": "Deletion successful", "uuid": photouuid}

  def OPTIONS(self):
    return None
