#!/usr/bin/env bash
set -xeEuo pipefail

docker network prune -f

HERE=$(realpath "$(dirname "$0")")
NETWORK=comet_nw
API=cometr
COMETR_VERSION=$(<"$HERE"/../src/config/cometr_version)

REGISTRY=mrcide

COMETR_IMAGE=$REGISTRY/$API:$COMETR_VERSION

docker network create $NETWORK
docker pull "$COMETR_IMAGE"

docker run --rm -d \
  --network=$NETWORK \
  --name=$API \
  -p 8321:8321 \
  "$COMETR_IMAGE"
