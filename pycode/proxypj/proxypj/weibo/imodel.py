# -*- coding: utf-8 -*-
from django.conf import settings
getAccessTokenByUid = None
insertAccessToken = None

queryExSocialGraphByUid = None
insertExSocialGraph = None

if settings.MODEL == 'google':
    import gmodel
    getAccessTokenByUid = gmodel.getAccessTokenByUid
    insertAccessToken = gmodel.insertAccessToken
    queryExSocialGraphByUid = gmodel.queryExSocialGraphByUid
    insertExSocialGraph = gmodel.insertExSocialGraph
    
elif settings.MODEL == 'django':
    import models
    getAccessTokenByUid = models.getAccessTokenByUid
    insertAccessToken = models.insertAccessToken
    queryExSocialGraphByUid = models.queryExSocialGraphByUid
    insertExSocialGraph = models.insertExSocialGraph

