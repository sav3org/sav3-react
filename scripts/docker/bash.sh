#!/usr/bin/env bash

working_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../.." && cd "$working_dir" || exit

dockerfile="
FROM buildkite/puppeteer:5.2.1

RUN apt-get update && apt-get install -y git

RUN git config --global user.name 'Tim Templeton' && git config --global user.email 'tim@sav3.org'

ENV REACT_APP_IS_DOCKER=1
"

echo "$dockerfile" | docker build --tag "sav3-react" -

docker rm -f "sav3-react" 2> /dev/null

docker run \
  --name "sav3-react" \
  --publish "3000:3000" \
  --volume "$(pwd):/app" \
  --workdir "/app" \
  --rm \
  --entrypoint "bash" \
  --interactive \
  --tty \
  sav3-react
