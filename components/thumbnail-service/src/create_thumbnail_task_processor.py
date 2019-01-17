'''
message_handlers.py

Handlers for received messages from redis.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''
import threading
import redis
import logging
import json
import hashlib
from PIL import Image, ExifTags
import io
from datetime import datetime
import sqlite3

import config
import common

class CreateThumbnailTaskProcessor(threading.Thread):

  def __init__(self):
    threading.Thread.__init__(self)
    self.myRedis = redis.Redis(host='redis', port=6379, db=0)
    logging.basicConfig(level=logging.DEBUG)

  def run(self):
    while True:
      logging.info("Waiting for next create-thumbnail task.")

      task = self.myRedis.brpoplpush('create-thumbnail', 'create-thumbnail-processing')
      metadata = json.loads(task)

      logging.info("CREATE-THUMBNAIL: Task found. Creating thumbs for file %s" % metadata['fileid'])

      # Get file data from redis
      logging.info("Receiving file data from redis")
      filedata = self.myRedis.get(metadata['fileid'])

      ## Create thumbs and write to storage
      self.createThumbsAndStore(metadata, filedata)

      ## Store thumb information to DB
      with sqlite3.connect(config.DB_STRING) as c:
        c.execute("INSERT INTO thumbnails VALUES (?, ?, ?)",
          [metadata['fileid'], metadata['extension'], str(datetime.utcnow())])

      ## Deleting key with file data from redis
      logging.info("Removing file data from redis")
      res = self.myRedis.delete(metadata['fileid'])

      ## If successful, remove task from processing list
      logging.info("Finished creating thumbs for file %s" % metadata['fileid'])
      res = self.myRedis.lrem('create-thumbnail-processing', 0 , task)

  def createThumbsAndStore(self, meta, filedata):
    image = Image.open(io.BytesIO(filedata))

    for size in config.THUMB_SIZES:
      logging.info("Creating %spx thumbnail..." % size)
      mysize = size, size
      fn, filext = meta['fileid'], meta['extension']
      thumb = image.copy()
      thumb.thumbnail(mysize)
      thumb.save(config.THUMB_DIR + "/%s_%s%s" %(fn, str(size), filext), quality=90, optimize=True)
