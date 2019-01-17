# SimpleWebGallery
Simple photo WebApp that stores, views and shares photos and albums. This is a personal experiment for working with microservices.

## Run dev environment
To run all services using docker compose with the source code directories mounted to their respective containers run:

```bash
docker-compose -f docker-compose-dev.yml up
docker-compose -f docker-compose-dev.yml exec ui-service npm run compile
```

## Run production environment
To have everything running in background with code inside the image and volumes for data persistence run:

```bash
docker-compose up -d
```
