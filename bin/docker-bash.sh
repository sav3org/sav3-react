#!/usr/bin/env bash

docker run \
  --publish "3000:3000" \
  --volume "$(pwd):/app" \
  --workdir "/app" \
  --rm \
  --entrypoint "bash" \
  --interactive \
  --tty \
  node:12.20.0
