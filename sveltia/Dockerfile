#
# docker build -t glacieronehealth:24 .
#
FROM node:24

RUN set -x \
  && apt-get update \
  && apt-get install -y --no-install-recommends build-essential python3 make \
    g++ iproute2 hugo ca-certificates socat

# && rm -rf /var/lib/apt/lists/*

