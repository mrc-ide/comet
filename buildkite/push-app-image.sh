#!/usr/bin/env bash
set -eEuo pipefail

HERE=$(realpath "$(dirname $0)")
. $HERE/common
. $HERE/build-app-image

if [ "${BUILDKITE:-}" ]; then
  docker push "$IMAGE_NAME:$GIT_BRANCH"
  docker push "$IMAGE_NAME:$GIT_COMMIT"
fi
