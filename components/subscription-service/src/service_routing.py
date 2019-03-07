'''
thumbnail_service_routing.py

Contains the routing logic for the thumbnail service.

Author: Nicolas Inden
eMail: nico@smashnet.de
GPG-Key-ID: B2F8AA17
GPG-Fingerprint: A757 5741 FD1E 63E8 357D  48E2 3C68 AE70 B2F8 AA17
License: MIT License
'''

import os

import cherrypy

# Import controller
from service_logic import SubscriptionServiceLogic

class SubscriptionServiceRouting(object):

  def getRoutesDispatcher(self):
    d = cherrypy.dispatch.RoutesDispatcher()

    d.connect('service_index_info', '/',
              controller=SubscriptionServiceLogic(),
              action='index',
              conditions=dict(method=['GET']))

    d.connect('get_multiple_subscriptions', '/subscriptions',
              controller=SubscriptionServiceLogic(),
              action='getSubscriptions',
              conditions=dict(method=['GET']))

    d.connect('get_subscription', '/subscriptions/{subscriptionid}',
              controller=SubscriptionServiceLogic(),
              action='getSubscription',
              conditions=dict(method=['GET']))

    d.connect('post_subscription', '/subscriptions',
              controller=SubscriptionServiceLogic(),
              action='postSubscription',
              conditions=dict(method=['POST']))

    d.connect('put_subscription', '/subscriptions/{subscriptionid}',
              controller=SubscriptionServiceLogic(),
              action='putSubscription',
              conditions=dict(method=['PUT']))

    d.connect('delete_subscription', '/subscriptions/{subscriptionid}',
              controller=SubscriptionServiceLogic(),
              action='deleteSubscription',
              conditions=dict(method=['DELETE']))

    return d
