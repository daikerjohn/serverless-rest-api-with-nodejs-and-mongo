#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR

ASDF=${SCRIPT_DIR}/node_modules/.bin/nodemon

#DEBUG=camapp:* npm start
#DEBUG=camapp:* nodemon -i greenlock.d/ -i sessions/ -i views/ -V app.js

# Works with greenlock
#DEBUG=camapp:* nodemon -i greenlock.d/ -i sessions/ -i views/ -V server.js

# Test without greenlock... use nginx in front!?
#NODE_ENV=production DEBUG=camapp:* nodemon -i greenlock.d/ -i sessions/ -i views/ -V app.js
DEBUG=camapp:* $ASDF -i sessions/ -V dero.js

