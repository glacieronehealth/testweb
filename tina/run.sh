#!/usr/bin/env bash
#
DIR=`dirname $0`
WEBDIR=`realpath $DIR`

# docker build -t glacieronehealth:latest .

docker run -ti --workdir /app \
    --volume "$WEBDIR:/app" \
    --publish "127.0.0.1:3000:3000" \
    --publish "127.0.0.1:4001:4001" \
    --publish "127.0.0.1:4321:4321" \
    --rm \
    --name tina \
    --user `id -u` \
    glacieronehealth:22 bash

