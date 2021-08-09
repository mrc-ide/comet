#!/usr/bin/env bash
set -ex
HERE=$(realpath "$(dirname $0)")
. $HERE/common

function cleardocker() {
  $HERE/../scripts/clear-docker.sh
}
trap cleardocker EXIT

# Create an image based on the shared build env that runs back-end tests
docker build --tag=comet-test-back-end \
  --build-arg GIT_ID=$GIT_ID \
  -f $HERE/test-back-end.dockerfile \
  .

$HERE/../scripts/run-dependencies.sh

# Ensure that cometr is available
for _ in $(seq 30); do
    if [[ "$(curl --silent http://localhost:8321)" == *"cometr"* ]]; then
        break
    fi
    sleep 6
done

# Run the build env image to run gradle tests
docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --network=comet_nw \
    comet-test-back-end
