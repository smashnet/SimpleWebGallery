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
    res = {"id": img_uuid, "filename": fn, "extension": filext, "content_type": str(file.content_type), "md5": filehash.hexdigest(), "uploader": cherrypy.request.remote.ip, "dateUploaded": str(datetime.utcnow())}
    return res, whole_data

  def rotate_if_necessary(self, info):
    # Rotate image based on exif orientation
    try:
      image=Image.open(config.PHOTO_DIR + "/%s%s" % (info['id'], info['extension']))
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
      image.save(config.PHOTO_DIR + "/%s%s" % (info['id'], info['extension']))
      image.close()

    except (AttributeError, KeyError, IndexError):
      # cases: image don't have getexif
      pass

  @cherrypy.tools.accept(media='application/json')
  def GET(self, photouuid=None):
    # Check if uuid given
    if photouuid == None:
      return "No uuid given"
    # Check if is valid uuid
    try:
      uuid.UUID(photouuid, version=4)
    except ValueError:
      return "Not a valid uuid"

    # Get file information from DB
    with sqlite3.connect(config.DB_STRING) as c:
      r = c.execute("SELECT * FROM files WHERE uuid=?", (str(photouuid),))
      res = r.fetchone()
      fn, filext = os.path.splitext(res[1])
      with open(config.PHOTO_DIR + "/%s%s" % (photouuid, filext), "rb") as the_file:
        cherrypy.response.headers['Content-Type'] = res[3]
        return the_file.read()

  @cherrypy.tools.json_out()
  def POST(self, file):
    ## Receive file
    info, data = self.receive_new_photo(file)

    print(file)
    print(info)

    ## Write to storage
    with open(config.PHOTO_DIR + "/%s%s" % (info["id"],info["extension"]), "wb") as written_file:
      written_file.write(data)

    ## Rotate image if necessary
    self.rotate_if_necessary(info)

    ## Save photo in DB
    with sqlite3.connect(config.DB_STRING) as c:
      c.execute("INSERT INTO files VALUES (?, ?, ?, ?, ?, ?, ?)",
        [info['id'], info['filename'], info['extension'], info['content_type'], info['md5'], info['uploader'], info['dateUploaded']])

    ## Create task to create thumbnails
    common.myRedis.set(info['id'], bytes(data)) # Save data to redis, key: uuid
    taskitem = {"uuid": info['id']}
    common.myRedis.lpush("create-thumbnail", json.dumps(taskitem)) # Add task to list

    ##TODO: Create task to add photo to album
    taskitem = {"uuid": info['id'], "album": "0"}
    common.myRedis.lpush("add-to-album", json.dumps(taskitem)) # Add task to list

    return info

  @cherrypy.tools.accept(media='application/json')
  @cherrypy.tools.json_out()
  def DELETE(self, photouuid):
    if len(photouuid) == 0:
      return {"error": "No photos provided for deletion"}
    else:
      if photouuid == "all":
        self.deleteAllPhotos()
      else:
        # Check if is valid uuid
        try:
          uuid.UUID(photouuid, version=4)
        except ValueError:
          return "Not a valid uuid"
        # Delete photos from storage
        with sqlite3.connect(config.DB_STRING) as c:
          r = c.execute("SELECT filename FROM files WHERE uuid=?", (str(photouuid),))
          filename = r.fetchone()
          if filename is None:
            return {"error": "The photo with the provided id does not exist"}
        try:
          os.remove(config.PHOTO_DIR + "/%s" % str(filename[0]))
        except FileNotFoundError:
          print("File %s already gone" % str(filename[0]))

        # Delete photos from DB
        with sqlite3.connect(config.DB_STRING) as c:
          c.execute("DELETE FROM files WHERE uuid=?", (str(photouuid),))


        return {"deleted": photouuid}

  def OPTIONS(self):
    return None
