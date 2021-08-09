#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

function cleardocker() {
  $HERE/../scripts/clear-docker.sh
}
trap cleardocker EXIT

# Create an image based on the shared build env that compiles and tests the front-end
docker build --tag comet-test-front-end \
	--build-arg GIT_ID=$GIT_ID \
  -f $HERE/test-front-end.dockerfile \
	.

# Run the created image
docker network create $NETWORK
docker run --rm \
    --network=$NETWORK \
    comet-test-front-end
