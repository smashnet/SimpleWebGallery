'''
common.py

Holds severals functions commonly used in SimpleWebGallery.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import config
import requests
import json

def DBtoDict(res):
  descs = [desc[0] for desc in res.description]
  item = res.fetchone()
  if item == None:
    return {}
  else:
    return dict(zip(descs, item))

def DBtoList(res):
  descs = [desc[0] for desc in res.description]
  intermediate = res.fetchall()
  return [dict(zip(descs, item)) for item in intermediate]

def isValidAccessCode(access_code):
  if access_code == None or len(access_code) != 8:
    return False
  for char in access_code:
    if char not in config.ACCESS_CODE_CHARS:
      return False
  return True

def albumExists(accessCode):
  res = requests.get("http://album-service:8080/album-service/accesscode/%s" % accessCode)
  print(res.json())
  if res.json() == {}:
    return False
  else:
    return True
