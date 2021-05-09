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
echo -e "${YELLOW}1/3:${WHITE} Clean up old files${SET}"
if [ -d "$PUBLIC_DIR" ]; then
    rm -rv $PUBLIC_DIR
else
    echo -e "INFO  $PUBLIC_DIR doesn't exist, continuing..."
fi
hexo clean

# Generate blog
echo -e "${YELLOW}2/3:${WHITE} Generate blog files${SET}"
hexo generate

# Run PostCSS
echo -e "${YELLOW}3/3:${WHITE} Run PostCSS${SET}"
cd $PUBLIC_DIR
postcss css/style.css --replace --verbose

echo -e "${YELLOW}INFO:${WHITE} Script finished, will close in 5 seconds...${SET}"
sleep 5