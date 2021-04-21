#!/usr/bin/env bash
set -xeEuo pipefail

HERE=$(dirname "$0")
API=cometr
NETWORK=comet_nw
"$HERE"/run-dependencies.sh

# From now on, if the user presses Ctrl+C we should teardown gracefully
function cleanup() {
  docker kill $API
  docker network rm $NETWORK
}
trap cleanup EXIT

# Wait for Ctrl+C
echo "Ready to use. Press Ctrl+C to teardown."
sleep infinity
