#!/usr/bin/env bash
set -eEuo pipefail

HERE="$(dirname "${BASH_SOURCE[0]}")"

if [ "${BUILDKITE:-}" ]; then
  GIT_COMMIT=${BUILDKITE_COMMIT:0:7}
  GIT_BRANCH=$BUILDKITE_BRANCH
else
  GIT_COMMIT=$(git rev-parse --short=7 HEAD)
  GIT_BRANCH=$(git symbolic-ref --short HEAD)
fi

# Deal with dependabot tags incompatible with Docker e.g. `dependabot/npm_and_yarn/app/lodash-4.17.19`
GIT_BRANCH=${GIT_BRANCH//\//-}

IMAGE_NAME=mrcide/comet

docker build \
  --build-arg BUILDKITE --build-arg BUILDKITE_BRANCH --build-arg BUILDKITE_BUILD_NUMBER --build-arg BUILDKITE_JOB_ID --build-arg BUILDKITE_BUILD_URL --build-arg BUILDKITE_PROJECT_SLUG --build-arg BUILDKITE_COMMIT \
  --tag "$IMAGE_NAME:$GIT_BRANCH" --tag "$IMAGE_NAME:$GIT_COMMIT" \
  "$HERE"/../src/

if [ "${BUILDKITE:-}" ]; then
  docker push "$IMAGE_NAME:$GIT_BRANCH"
  docker push "$IMAGE_NAME:$GIT_COMMIT"
fi
