'''
delete_files_task_processor.py

Processes tasks to delete files (e.g. after album deletion)

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

import config
import common

class DeleteFilesTaskProcessor(threading.Thread):

  def __init__(self):
    threading.Thread.__init__(self)
    self.myRedis = redis.Redis(host='redis', port=6379, db=0)
    logging.basicConfig(level=logging.DEBUG)

  def run(self):
    while True:
      logging.info("Waiting for next delete-files task.")

      task = self.myRedis.brpoplpush('delete-files', 'delete-files-processing')
      metadata = json.loads(task)
      logging.info(metadata)

      logging.info("Task found, processing...")

      ## TODO

      ## If successful, remove task from processing list
      logging.info("Removing task from processing list")
      res = self.myRedis.lrem('add-file-to-album-processing', 0 , task)
