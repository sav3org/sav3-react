#!/usr/bin/env bash

working_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.." && cd "$working_dir" || exit

docker rm -f "sav3-seed-bootstrap-users" 2> /dev/null

docker run \
  --name "sav3-seed-bootstrap-users" \
  --volume "$(pwd):/app" \
  --workdir "/app" \
  --entrypoint "" \
  --tty \
  --restart "always" \
  buildkite/puppeteer:5.2.1 \
  node scripts/seed-bootstrap-users
