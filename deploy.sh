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

# Get old commits from Github repo
echo -e "${YELLOW}1/5:${WHITE} Clone old commits${SET}"
# check if _ghpages.git folder doesn't exist
if [ -d "$GHPAGES_DIR" ]; then
    rm -rv $GHPAGES_DIR -f
else
    echo -e "INFO  $GHPAGES_DIR doesn't exist, continuing..."
fi
git clone --bare -b gh-pages \
    git@github.com:rainmeter/rainmeter-docs.git $GHPAGES_DIR

# Clean up old files
echo -e "${YELLOW}2/5:${WHITE} Clean up old files${SET}"
if [ -d "$PUBLIC_DIR" ]; then
    rm -rv $PUBLIC_DIR
else
    echo -e "INFO  $PUBLIC_DIR doesn't exist, continuing..."
fi
hexo clean

# Generate blog
echo -e "${YELLOW}3/5:${WHITE} Generate blog files${SET}"
hexo generate

# Run PostCSS
echo -e "${YELLOW}4/5:${WHITE} Run PostCSS${SET}"
cd $PUBLIC_DIR
postcss css/rainmeter.css --replace --verbose

# Deploy to Github Pages
echo -e "${YELLOW}5/5:${WHITE} Deploy to Github Pages${SET}"
cd $SCRIPT_DIR
export GIT_DIR=$PWD/"$GHPAGES_DIR"
export GIT_WORK_TREE=$PWD/"$PUBLIC_DIR"

git config core.autocrlf false
git fetch --force origin gh-pages
git reset --mixed FETCH_HEAD
git checkout -- CNAME
git add -A .
git commit -m "Update"
git push origin gh-pages

echo -e "${YELLOW}INFO:${WHITE} Script finished, will close in 5 seconds...${SET}"
sleep 5