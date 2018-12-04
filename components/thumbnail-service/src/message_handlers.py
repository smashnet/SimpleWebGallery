'''
message_handlers.py

Handlers for received messages from redis.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import config
import common

def handle_general_messages(message):
  print("GENERAL MESSAGE HANDLER:", message)

def handle_photo_messages(message):
  print("PHOTO MESSAGE HANDLER:", message)

def handle_album_messages(message):
  print("ALBUM MESSAGE HANDLER:", message)

def handle_subscriber_messages(message):
  print("SUBSCRIBER MESSAGE HANDLER:", message)
