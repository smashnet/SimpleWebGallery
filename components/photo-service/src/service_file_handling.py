'''
service_file_handling.py

How to process new files.

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

def extractExif(image):
  image_tags = image._getexif()
  return {name: image_tags[id] for id, name in ExifTags.TAGS.items() if id in image_tags}

def process_and_store_new_photo(file):
  img_uuid = str(uuid.uuid4())

  ## ------- Read data -------
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

  image = Image.open(io.BytesIO(whole_data))

  ## ------- Read exif and correct orientation -------
  exif = extractExif(image)
  try:
    # Do rotation
    if exif['Orientation'] == 3:
      image=image.rotate(180, expand=True)
    elif exif['Orientation'] == 6:
      image=image.rotate(270, expand=True)
    elif exif['Orientation'] == 8:
      image=image.rotate(90, expand=True)
  except (AttributeError, KeyError, IndexError) as e:
    # No orientation in exif
    logging.warn("No Orientation in EXIF data. File ID: %s, Error: %s" % (img_uuid, str(e)))
    pass

  try:
    # Get DateTimeOriginal
    date_time_original_ts = time.mktime(datetime.strptime(exif['DateTimeOriginal'], "%Y:%m:%d %H:%M:%S").timetuple())
  except (AttributeError, KeyError, IndexError) as e:
    # No DateTimeOriginal in exif data
    logging.warn("No DateTimeOriginal in EXIF data. File ID: %s, Error: %s" % (img_uuid, str(e)))
    date_time_original_ts = 0.0
    pass

  fn, filext = os.path.splitext(file.filename)
  ## ------- Collect file information -------
  info = {"fileid": img_uuid,
          "filename": fn,
          "extension": filext,
          "content_type": str(file.content_type),
          "md5": filehash.hexdigest(),
          "uploader": cherrypy.request.remote.ip,
          "timestamp_date_time_original": date_time_original_ts,
          "timestamp_uploaded": int(time.time())
          }

  ## ------- Save file to storage -------
  image.save(config.PHOTO_DIR + "/%s%s" % (info['fileid'], info['extension']), quality=90, optimize=True)

  ## ------- Return info and data -------
  with open(config.PHOTO_DIR + "/%s%s" % (info['fileid'], info['extension']), "rb") as the_file:
    return info, the_file.read()
