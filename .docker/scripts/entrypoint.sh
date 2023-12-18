#!/bin/bash

# validate env vars are set VERSION, CLIENT
if [ -z "$VERSION" ]; then
  echo "VERSION env var is not set"
  exit 1
fi

if [ -z "$CLIENT" ]; then
  echo "CLIENT env var is not set"
  exit 1
fi


cd /app

sh /scripts/build.sh

node /scripts/upload.js
