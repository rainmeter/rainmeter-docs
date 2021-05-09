#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

# init script
PUBLIC_DIR=_generated
GHPAGES_DIR=_ghpages.git
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
YELLOW='\033[1;33m'
WHITE='\033[1;37m'
SET='\033[0m'
pushd "$SCRIPT_DIR"

echo -e "${YELLOW}INFO:${WHITE} Starting build script...${SET}"
sleep 1

# Clean up old files
echo -e "${YELLOW}1/1:${WHITE} Clean up old files${SET}"
if [ -d "$PUBLIC_DIR" ]; then
    rm -rv $PUBLIC_DIR
else
    echo -e "INFO  $PUBLIC_DIR doesn't exist, continuing..."
fi
if [ -d "$GHPAGES_DIR" ]; then
    rm -rv $GHPAGES_DIR -f
else
    echo -e "INFO  $GHPAGES_DIR doesn't exist, continuing..."
fi
hexo clean

echo -e "${YELLOW}INFO:${WHITE} Script finished, will close in 5 seconds...${SET}"
sleep 5