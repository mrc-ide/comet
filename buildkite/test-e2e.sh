#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

function cleardocker() {
  $HERE/../scripts/clear-docker.sh
}
trap cleardocker EXIT

# Run all dependencies
$HERE/../scripts/run-dependencies.sh

# TODO: shared script to buld app image, also called from push-image
# Test against running app image
  GIT_COMMIT=$(git rev-parse --short=7 HEAD)
IMAGE_NAME=mrcide/comet
docker build \
  --build-arg BUILDKITE --build-arg BUILDKITE_BRANCH \
  --build-arg BUILDKITE_BUILD_NUMBER --build-arg BUILDKITE_JOB_ID \
  --build-arg BUILDKITE_BUILD_URL \
  --build-arg BUILDKITE_PROJECT_SLUG \
  --build-arg BUILDKITE_COMMIT --build-arg CODECOV_TOKEN \
  --tag "$IMAGE_NAME:$GIT_BRANCH" --tag "$IMAGE_NAME:$GIT_COMMIT" \
  --network=$NETWORK \
  "$HERE"/../src/

docker run -d \
    --network=$NETWORK \
    -p 8080:8080 \
    --name=comet \
    $IMAGE_NAME:$GIT_BRANCH

# Ensure that comet is available
for _ in $(seq 30); do
    if [[ "$(curl --silent http://localhost:8321)" == *"comet"* ]]; then
        break
    fi
    sleep 6
done


# Create an image based on the shared build env that compiles and tests the front-end
docker build --tag comet-test-e2e \
	--build-arg GIT_ID=$GIT_ID \
  -f $HERE/test-e2e.dockerfile \
	.

# Run the created image
docker run --rm \
    --network=$NETWORK \
    comet-test-e2e


