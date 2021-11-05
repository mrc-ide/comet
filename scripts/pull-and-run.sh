#!/usr/bin/env bash
set -ex

HERE=$(readlink -f "$(dirname $0)")
NETWORK=comet_nw
COMET=comet
GIT_BRANCH=main
$HERE/run-dependencies.sh

COMET_IMAGE=mrcide/$COMET:$GIT_BRANCH

docker pull $COMET_IMAGE

docker run --rm -d \
  --network=$NETWORK \
  --name $COMET \
  -p 8080:8080 \
  $COMET_IMAGE

