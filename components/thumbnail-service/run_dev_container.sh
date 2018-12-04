#!/bin/bash

# Only create container if no container with this name is already there
if [ ! "$(docker ps -q -f name=swg-thumbnail-service)" ]; then
  docker run --rm -d --name swg-thumbnail-service -p 8081:8080 -v $(pwd):/usr/src/app -w /usr/src/app swg-thumbnail-service-dev
fi
