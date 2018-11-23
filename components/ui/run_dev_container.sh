#!/bin/bash

# Only create container if no container with this name is already there
if [ ! "$(docker ps -q -f name=simplewebgallery-docker-dev)" ]; then
  docker run --rm -d --name simplewebgallery-docker-dev -p 8081:8080 -v $(pwd):/usr/src/app -w /usr/src/app simplewebgallery-dev
fi

# Install node modules if they are not already there
if [ ! -d "node_modules" ]; then
  docker exec -ti simplewebgallery-docker-dev npm install
fi

# npm start
docker exec -ti simplewebgallery-docker-dev npm start
