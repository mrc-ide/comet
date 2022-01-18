#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common
. $HERE/build-app-image

function cleardocker() {
  $HERE/../scripts/clear-docker.sh
}
trap cleardocker EXIT

# Run all dependencies
$HERE/../scripts/run-dependencies.sh

# Test against running app image
docker run -d \
    --network=$NETWORK \
    -p 8080:8080 \
    --name=comet \
    $IMAGE_NAME:$GIT_BRANCH

# Create an image based on the shared test env that runs browser tests
docker build --tag comet-test-e2e \
	--build-arg GIT_ID=$GIT_ID \
  -f $HERE/test-e2e.dockerfile \
	.

# Ensure that comet is available
for _ in $(seq 30); do
    if [[ "$(curl --silent http://localhost:8321)" == *"comet"* ]]; then
        break
    fi
    sleep 6
done

docker run --rm \
    --network=$NETWORK \
    comet-test-e2e


