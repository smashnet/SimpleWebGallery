#!/bin/bash

# Only create container if no container with this name is already there
if [ ! "$(docker ps -q -f name=swp-album-service)" ]; then
  docker run --rm -d --name swp-album-service -p 8081:8080 -v $(pwd):/usr/src/app -w /usr/src/app swp-album-service-dev
fi

# Install node modules if they are not already there
#if [ ! -d "node_modules" ]; then
#  docker exec -ti swp-album-service npm install
#fi

# npm start
#docker exec -ti swp-album-service npm start
