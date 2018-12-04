#!/bin/bash

# Only create container if no container with this name is already there
if [ ! "$(docker ps -q -f name=swg-ui-service)" ]; then
  docker run --rm -d --name swg-ui-service -p 8081:8080 -v $(pwd):/usr/src/app -w /usr/src/app swg-ui-service-dev
fi

# Install node modules if they are not already there
if [ ! -d "node_modules" ]; then
  docker exec -ti swg-ui-service npm install
fi

# npm start
docker exec -ti swg-ui-service npm start
