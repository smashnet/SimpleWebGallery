'''
delete_thumbs_task_processor.py

Processes tasks to delete thumbnails (e.g. after album or file deletion)

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
import sqlite3
import os

import config
import common

class DeleteThumbsTaskProcessor(threading.Thread):

  def __init__(self):
    threading.Thread.__init__(self)
    self.myRedis = redis.Redis(host='redis', port=6379, db=0)
    logging.basicConfig(level=logging.DEBUG)

  def run(self):
    while True:
      logging.info("Waiting for next delete-thumbs task.")

      task = self.myRedis.brpoplpush('delete-thumbs', 'delete-thumbs-processing')
      metadata = json.loads(task)

      logging.info("DELETE-THUMBS: Task found. Deleting thumbs for files %s" % ','.join('"%s"'%x for x in metadata))

      # Delete thumbs from storage
      with sqlite3.connect(config.DB_STRING) as c:
        for thumbid in metadata:
          r = c.execute("SELECT * FROM thumbnails WHERE thumbid=?", (str(thumbid),))
          res = common.DBtoDict(r)
          if res == {}:
            return {"error": "The thumbnail with the provided id does not exist"}

          # Delete thumbs from storage
          try:
            for size in config.THUMB_SIZES:
              os.remove(config.THUMB_DIR + "/%s_%s%s" %(res['thumbid'], str(size), res['extension']))
          except FileNotFoundError:
            logging.warn("File %s%s already gone" % (res['fileid'],res['extension']))

          # Delete thumbs from DB
          c.execute("DELETE FROM thumbnails WHERE thumbid=?", (str(thumbid),))

      ## If successful, remove task from processing list
      logging.info("Removing task from processing list")
      res = self.myRedis.lrem('delete-thumbs-processing', 0 , task)
