#!/usr/bin/env bash
set -eEuo pipefail
docker kill "$(docker ps -aq)" || true
docker rm "$(docker ps -aq)" || true
docker network prune --force || true
