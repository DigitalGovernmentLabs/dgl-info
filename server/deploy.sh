#!/bin/sh

docker-compose build --no-cache
docker-compose down --rmi all
docker-compose up -d
