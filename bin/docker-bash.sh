#!/usr/bin/env bash

dockerfile="
FROM buildkite/puppeteer:5.2.1

RUN apt-get update && apt-get install -y git

RUN git config --global user.name 'Tim Templeton' && git config --global user.email 'tim@sav3.org'

ENV REACT_APP_IS_DOCKER=1
"

echo "$dockerfile" | docker build --tag "sav3-react" -

docker run \
  --publish "3000:3000" \
  --volume "$(pwd):/app" \
  --workdir "/app" \
  --rm \
  --entrypoint "bash" \
  --interactive \
  --tty \
  sav3-react
