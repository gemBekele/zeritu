#!/bin/bash
# Load NVM and use Node.js 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20 || nvm use default

# Start the backend server
exec node dist/server.js

