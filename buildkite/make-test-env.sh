#!/usr/bin/env bash
set -e
HERE=$(dirname $0)
. $HERE/common

docker build -f $HERE/shared-test-env.dockerfile \
    -t $TEST_ENV_TAG \
    .

# We have to push this so it's available to other build steps
docker push $TEST_ENV_TAG
