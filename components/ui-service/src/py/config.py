'''
config.py

Config file of SimpleWebGallery.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os, os.path

NAME = "ui-service"
VERSION = "0.0.1"
DATA_DIR = os.path.abspath(os.getcwd()) + "/%s-data/" % NAME
DB_STRING = DATA_DIR + "database.db"

# Further service dependent configuration:
PHOTO_DIR = DATA_DIR + "img/"
PHOTO_THUMBS_DIR = DATA_DIR + "thumbs/"
VIEWS_PATH = os.path.abspath(os.getcwd()) + "/src/views"
ACCESS_CODE_CHARS = "0123456789abcdefghijklmnopqrstuvwxzy"
