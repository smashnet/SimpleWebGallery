'''
config.py

Config file of SimpleWebGallerys album service.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os, os.path

NAME = "photo-service"
VERSION = "0.0.1"
DB_STRING = os.path.abspath(os.getcwd()) + "/%s-data/database.db" % NAME

# Further service dependent configuration:
