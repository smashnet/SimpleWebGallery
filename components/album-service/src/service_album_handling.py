'''
album_service_root.py

Album service of SimpleWebGallery that manages albums of photos.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os, os.path
from datetime import datetime
import uuid

import cherrypy
import sqlite3
import hashlib
import json

import config
import common

def getAlbumInformation(uuid):
  with sqlite3.connect(config.DB_STRING) as c:
    r = c.execute("SELECT albumid, name, accesscode, creator, timestamp_created FROM albums WHERE albumid=?", (uuid,))
    album = common.DBtoDict(r)
    if album == {}: return {}

    # Get files information
    r = c.execute("SELECT fileid FROM album_files WHERE albumid=?", (uuid,))
    res = common.DBtoList(r)
    fileids = [item['fileid'] for item in res]
    album['files'] = fileids
    # Get subscription information
    r = c.execute("SELECT subscriptionid FROM album_subscriptions WHERE albumid=?", (uuid,))
    res = common.DBtoList(r)
    subscriptionids = [item['subscriptionid'] for item in res]
    album['subscriptions'] = subscriptionids

    return album

def getAlbumInformationShort(accesscode):
  with sqlite3.connect(config.DB_STRING) as c:
    r = c.execute("SELECT albumid, name FROM albums WHERE accesscode=?", (accesscode,))
    res = common.DBtoDict(r)
    return res

def getListOfAllAlbums():
  with sqlite3.connect(config.DB_STRING) as c:
    r = c.execute("SELECT albums.albumid, \
                          albums.name, \
                          albums.accesscode, \
                          albums.creator, \
                          albums.timestamp_created, \
                          COUNT(album_files.fileid) AS number_of_files, \
                          COUNT(DISTINCT album_subscriptions.subscriptionid) AS number_of_subscriptions \
                          FROM albums \
                          LEFT JOIN album_files ON albums.albumid=album_files.albumid \
                          LEFT JOIN album_subscriptions ON albums.albumid=album_subscriptions.albumid \
                          GROUP BY albums.albumid;")
    res = common.DBtoList(r)
    if len(res) == 0: return None
    return res

def saveNewAlbum(info):
  with sqlite3.connect(config.DB_STRING) as c:
    c.execute("INSERT INTO albums VALUES (?, ?, ?, ?, ?)",
      [info['albumid'], info['name'], info['accesscode'], info['creator'], info['timestamp_created']])

def deleteCompleteAlbum(albumid):
  # Place task to delete files and thumbs from this album
  with sqlite3.connect(config.DB_STRING) as c:
    r = c.execute("SELECT fileid FROM album_files WHERE albumid=?", (albumid,))
    res = common.DBtoList(r)
    fileids = [item['fileid'] for item in res]
    common.myRedis.lpush("delete-files", json.dumps(fileids)) # Add task to list

  # Place task to delete subscriptions for this album
  with sqlite3.connect(config.DB_STRING) as c:
    r = c.execute("SELECT subscriptionid FROM album_subscriptions WHERE albumid=?", (albumid,))
    res = common.DBtoList(r)
    subscriptionids = [item['subscriptionid'] for item in res]
    common.myRedis.lpush("delete-subscriptions", json.dumps(subscriptionids)) # Add task to list

  # Delete from album_subscriptions
  with sqlite3.connect(config.DB_STRING) as c:
    c.execute("DELETE FROM album_subscriptions WHERE albumid=?", (str(albumid),))
  # Delete from album_files
  with sqlite3.connect(config.DB_STRING) as c:
    c.execute("DELETE FROM album_files WHERE albumid=?", (str(albumid),))
  # Delete from albums
  with sqlite3.connect(config.DB_STRING) as c:
    c.execute("DELETE FROM albums WHERE albumid=?", (str(albumid),))

  return {"message": "Album deleted", "error": "OK"}

def deleteFileFromAlbum(albumid, itemid):
  # Place task to delete file
  common.myRedis.lpush("delete-files", json.dumps([itemid])) # Add task to list

  # Delete file from album_files
  with sqlite3.connect(config.DB_STRING) as c:
    c.execute("DELETE FROM album_files WHERE albumid=? AND fileid=?", (str(albumid),str(itemid)))
  return {"message": "File %s deleted from album %s" % (itemid, albumid), "error": "OK"}

def deleteAllFilesFromAlbum(albumid):
  with sqlite3.connect(config.DB_STRING) as c:
    # Get file IDs
    r = c.execute("SELECT fileid FROM album_files WHERE albumid=?", (albumid,))
    res = common.DBtoList(r)
    fileids = [item['fileid'] for item in res]
    # Delete files from album
    query = "DELETE FROM album_files WHERE albumid=\"%s\" AND fileid IN (%s)" % (albumid ,','.join('"%s"'%x for x in fileids))
    r = c.execute(query)

    # Place task to delete files system wide
    common.myRedis.lpush("delete-files", json.dumps(fileids)) # Add task to list
  return {"message": "All files deleted from album %s" % albumid}

def deleteSubscriptionFromAlbum(albumid, itemid):
  # Place task to delete subscription
  common.myRedis.lpush("delete-subscriptions", json.dumps([itemid])) # Add task to list

  # Delete file from album_files
  with sqlite3.connect(config.DB_STRING) as c:
    c.execute("DELETE FROM album_subscriptions WHERE albumid=? AND subscriptionid=?", (str(albumid),str(itemid)))
  return {"message": "Subscription %s deleted from album %s" % (itemid, albumid), "error": "OK"}
