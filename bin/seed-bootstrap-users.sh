#!/usr/bin/env bash

# TODO: doesn't work because webrtc doesn't work inside docker for unknown reason

working_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.." && cd "$working_dir" || exit

docker rm -f "sav3-seed-bootstrap-users" 2> /dev/null

docker run \
  --name "sav3-seed-bootstrap-users" \
  --volume "$(pwd):/app" \
  --workdir "/app" \
  --entrypoint "" \
  --detach \
  --restart "always" \
  --network "host" \
  --log-driver "json-file" \
  --log-opt "max-size=5m" \
  --log-opt "max-file=1" \
  buildkite/puppeteer:5.2.1 \
  node scripts/seed-bootstrap-users

docker logs --tail 10 --follow "sav3-seed-bootstrap-users"
