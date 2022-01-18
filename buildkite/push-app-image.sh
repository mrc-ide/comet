#!/usr/bin/env bash
set -eEuo pipefail

IMAGE_NAME=mrcide/comet

docker build \
  --build-arg BUILDKITE --build-arg BUILDKITE_BRANCH --build-arg BUILDKITE_BUILD_NUMBER --build-arg BUILDKITE_JOB_ID --build-arg BUILDKITE_BUILD_URL --build-arg BUILDKITE_PROJECT_SLUG --build-arg BUILDKITE_COMMIT --build-arg CODECOV_TOKEN \
  --tag "$IMAGE_NAME:$GIT_BRANCH" --tag "$IMAGE_NAME:$GIT_COMMIT" \
  --network=comet_nw \
  "$HERE"/../src/

if [ "${BUILDKITE:-}" ]; then
  docker push "$IMAGE_NAME:$GIT_BRANCH"
  docker push "$IMAGE_NAME:$GIT_COMMIT"
fi
