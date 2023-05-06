#!/bin/bash

find . -maxdepth 1 -iname '*.js' -exec node -c {} \+
if [[ "$?" == "0" ]]; then
  sls offline start --host 0.0.0.0
fi
