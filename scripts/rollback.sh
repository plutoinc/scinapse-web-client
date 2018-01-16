#!/bin/bash

STABLE_VERSION=$(npx sls deploy list -s 'prod' | grep Timestamp | tail -n 2 | head -n 1 | grep -o -E '[0-9]+')
echo "$STABLE_VERSION"
npx sls rollback -s prod -t "$STABLE_VERSION"
