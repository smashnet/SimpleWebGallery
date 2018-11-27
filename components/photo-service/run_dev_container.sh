#!/bin/bash

# Only create container if no container with this name is already there
if [ ! "$(docker ps -q -f name=swp-photo-service)" ]; then
  docker run --rm --name swp-photo-service -p 8081:8080 -v $(pwd):/usr/src/app -w /usr/src/app swp-photo-service-dev
fi
