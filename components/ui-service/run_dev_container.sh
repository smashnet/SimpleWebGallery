#!/bin/bash

# Only create container if no container with this name is already there
if [ ! "$(docker ps -q -f name=swp-ui-service)" ]; then
  docker run --rm -d --name swp-ui-service -p 8081:8080 -v $(pwd):/usr/src/app -w /usr/src/app swp-ui-service-dev
fi

# Install node modules if they are not already there
if [ ! -d "node_modules" ]; then
  docker exec -ti swp-ui-service npm install
fi

# npm start
docker exec -ti swp-ui-service npm start
