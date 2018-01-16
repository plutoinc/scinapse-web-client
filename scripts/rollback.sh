#!/bin/bash

STABLE_VERSION=$(npx sls deploy list -s 'stage' | grep Timestamp | tail -n 2 | head -n 1 | grep -o -E '[0-9]+')
echo "$STABLE_VERSION"
npx sls rollback -s stage -t "$STABLE_VERSION"
