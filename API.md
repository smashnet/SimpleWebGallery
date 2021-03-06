# SimpleWebGallery - API Documentation

## SimpleWebGallery - Web API
The SimpleWebGallery Web API is used by the web app itself to navigate through the different pages of the website.

* User area
```bash
/ - Hello page (here you can enter your album access code)
/album/{accesscode} - Index of certain album
/album/{accesscode}/overview - Image overview of certain album
/album/{accesscode}/overview/fullscreen - Fullscreen image overview of certain album
/album/{accesscode}/slideshow - Automatic fullscreen slideshow of certain album
```

* Admin area
```bash
/admin - choose what to administrate
/admin/albums/ - administrate all albums
/admin/album/{uuid} - administrate certain album
/admin/subscriptions - administrate all subscriptions
/admin/subscriptions/album/{uuid} - administrate subscriptions of a certain album
```

## SimpleWebGallery - Services API
The SimpleWebGallery services API. In order to be scalable, lots of things in the background are not as coupled as one might think. This is the API used in the background to GET, POST, DELETE resources:

### AlbumService
```
GET /api/album-service/albums
  -> Get JSON list of all albums (all information except photoUUIDs)
POST /api/album-service/albums
  -> Create new album, and return album uuid
GET /api/album-service/albums/{uuid}
  -> Get information of album with given UUID. Information contains
    -> albumid
    -> name
    -> accesscode
    -> creator
    -> created
    -> {"photos": [uuids]}
    -> {"subscriptions": [uuids]}
PUT /api/album-service/albums/{uuid}
  -> Add information to album with given UUID
DELETE /api/album-service/albums/{uuid}
  -> Delete album with given UUID

  GET /api/album-service/accessCode
    -> Get albumid and name of album with given accesscode
```

### PhotoService
```
GET /api/photo-service/photo/{uuid}(/json)
  -> Retrieve JSON information for photo with given UUID. Information contains:
    -> fileid
    -> filename
    -> content_type
    -> md5
    -> uploader
    -> uploaded
GET /api/photo-service/photo/{uuid}/raw
  -> Retrieve raw data photo of given UUID, and original file name
DELETE /api/photo-service/photo/{uuid}
  -> Delete photo with given UUID
POST /api/photo-service/photo
  -> Post new photo. Required additional information: {"album": albumUUID}. The album must exist.
```

### ThumbnailService
You can only GET thumbnails via API. New thumbnails are automatically generated as soon as the ThumbnailService retrieves new photos over the message broker. They are also automatically deleted as soon as the photo-deleted message comes over the message broker.
```
GET /api/thumbnail-service/thumbnail/{uuid}(/???px)
  -> Retrieve raw data thumbnail of size ???px. Possible sizes are:
    -> 128px
    -> 512px
    -> 1024px
```

### SubscrptionService
```
GET /api/subscription-service/subscription/{uuid}
  -> Retrieve JSON information for subscription with given UUID. Information contains:
    -> subscriptionid
    -> email
    -> ip
    -> itemid
    -> subscribed
DELETE /api/subscription-service/subscription/{uuid}
  -> Delete given subscription completely.
POST /api/subscription-service/subscription
  -> Create new subscription. Requires information:
    -> email
    -> itemid
```
