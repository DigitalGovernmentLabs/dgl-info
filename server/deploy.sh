#!/bin/sh

git fetch origin master
docker-compose build --no-cache
docker-compose restart
