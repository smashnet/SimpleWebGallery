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
import time

import cherrypy
import sqlite3
import hashlib
from PIL import Image, ExifTags

import config
import common

@cherrypy.expose
class PhotoServicePhotos(object):

  def receive_new_photo(self, file):
    img_uuid = str(uuid.uuid4())
    # ------- Read data -------
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

    # ------- Read exif and correct orientation -------
    try:
      image=Image.open(io.BytesIO(whole_data))
      orientation_key = None
      date_time_original_key = None
      for key in ExifTags.TAGS.keys():
        if ExifTags.TAGS[key] == "Orientation":
          orientation_key = key
        if ExifTags.TAGS[key] == "DateTimeOriginal":
          date_time_original_key = key

      exif=dict(image._getexif().items())

      # Do rotation
      if exif[orientation_key] == 3:
        image=image.rotate(180, expand=True)
      elif exif[orientation_key] == 6:
        image=image.rotate(270, expand=True)
      elif exif[orientation_key] == 8:
        image=image.rotate(90, expand=True)
    except (AttributeError, KeyError, IndexError) as e:
      # No orientation in exif
      logging.info("No orientation in EXIF data", img_uuid)
      pass

    try:
      # Get DateTimeOriginal
      if date_time_original_key == None:
        # Image has no DateTimeOriginal set
        date_time_original_ts = 0.0
      else:
        date_time_original_ts = time.mktime(datetime.strptime(exif[date_time_original_key], "%Y:%m:%d %H:%M:%S").timetuple())

    except (AttributeError, KeyError, IndexError) as e:
      # cases: image don't have getexif
      logging.warn("Image does not have EXIF:", img_uuid)
      date_time_original_ts = 0.0
      pass

    fn, filext = os.path.splitext(file.filename)
    info = {"fileid": img_uuid, "filename": fn, "extension": filext, "content_type": str(file.content_type), "md5": filehash.hexdigest(), "uploader": cherrypy.request.remote.ip, "timestamp_date_time_original": date_time_original_ts, "timestamp_uploaded": int(time.time())}

    image.save(config.PHOTO_DIR + "/%s%s" % (info['fileid'], info['extension']))
    image.close()

    with open(config.PHOTO_DIR + "/%s%s" % (info['fileid'], info['extension']), "rb") as the_file:
      return info, the_file.read()

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
        r = c.execute("SELECT * FROM files WHERE fileid IN (%s) ORDER BY timestamp_date_time_original ASC" % ','.join('"%s"'%x for x in files))
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
    ## Receive file, rotate, get exif information, and store
    info, data = self.receive_new_photo(file)
    logging.info(info)

    ## Save photo in DB
    with sqlite3.connect(config.DB_STRING) as c:
      c.execute("INSERT INTO files VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [info['fileid'], info['filename'], info['extension'], info['content_type'], info['md5'], info['uploader'], info['timestamp_date_time_original'], info['timestamp_uploaded']])

    ## Create task to create thumbnails
    common.myRedis.set(info['fileid'], bytes(data)) # Save data to redis, key: uuid
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
        c.execute("DELETE FROM files WHERE fileid=?", (str(photouuid),))

      return {"message": "Deletion successful", "uuid": photouuid}

  def OPTIONS(self):
    return None
