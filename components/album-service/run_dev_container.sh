#!/bin/bash

# Only create container if no container with this name is already there
if [ ! "$(docker ps -q -f name=swg-album-service)" ]; then
  docker run --rm --name swg-album-service -p 8081:8080 -v $(pwd):/usr/src/app -w /usr/src/app swg-album-service-dev
fi
