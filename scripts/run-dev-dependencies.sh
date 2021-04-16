#!/usr/bin/env bash
set -ex

HERE=$(dirname "$0")
API=cometr
NETWORK=comet_nw
"$HERE"/run-dependencies.sh

# From now on, if the user presses Ctrl+C we should teardown gracefully
trap cleanup INT
trap cleanup ERR
function cleanup() {
  docker kill $API
  docker network rm $NETWORK
}

# Wait for Ctrl+C
echo "Ready to use. Press Ctrl+C to teardown."
sleep infinity
