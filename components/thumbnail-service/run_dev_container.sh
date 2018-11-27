#!/bin/bash

# Only create container if no container with this name is already there
if [ ! "$(docker ps -q -f name=swp-thumbnail-service)" ]; then
  docker run --rm -d --name swp-thumbnail-service -p 8081:8080 -v $(pwd):/usr/src/app -w /usr/src/app swp-thumbnail-service-dev
fi
