#!/usr/bin/env bash
#
DIR=`dirname $0`
WEBDIR=`realpath $DIR`

# docker build -t glacieronehealth:latest .

docker run -ti --workdir /app \
    --volume "$WEBDIR:/app" \
    --publish "8080:8080" \
    --rm \
    --name sveltia \
    --user `id -u` \
    glacieronehealth:24 bash

