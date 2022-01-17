#!/usr/bin/env bash
set -ex

HERE=$(readlink -f "$(dirname $0)")
NETWORK=comet_nw
COMET=comet
PACKAGE_ROOT=$(readlink -f $(dirname $0)/..)
GIT_BRANCH=$(git -C "$PACKAGE_ROOT" symbolic-ref --short HEAD)

$HERE/run-dependencies.sh

COMET_IMAGE=mrcide/$COMET:$GIT_BRANCH

docker pull $COMET_IMAGE

docker run --rm -d \
  --network=$NETWORK \
  --name $COMET \
  -p 8080:8080 \
  $COMET_IMAGE

