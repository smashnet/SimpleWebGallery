'''
add_subscription_to_album_task_processor.py

Processes tasks to add subscriptions to albums

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

class AddSubscriptionToAlbumTaskProcessor(threading.Thread):

  def __init__(self):
    threading.Thread.__init__(self)
    self.myRedis = redis.Redis(host='redis', port=6379, db=0)
    logging.basicConfig(level=logging.DEBUG)

  def run(self):
    while True:
      logging.info("Waiting for next add-subscription-to-album task.")

      task = self.myRedis.brpoplpush('add-subscription-to-album', 'add-subscription-to-album-processing')
      metadata = json.loads(task)
      logging.info(metadata)

      logging.info("Task found, processing...")

      ## Add subscription to album in DB
      with sqlite3.connect(config.DB_STRING) as c:
        c.execute("INSERT INTO album_subscriptions VALUES (?, ?)",
          [metadata['album-id'], metadata['subscription-id']])

      ## If successful, remove task from processing list
      logging.info("Removing task from processing list")
      self.myRedis.lrem('add-subscription-to-album-processing', 0 , task)
