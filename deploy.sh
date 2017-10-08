#!/bin/bash

set -o errexit -o pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
pushd "$script_dir"

if [ ! -d "_ghpages.git" ]; then
    git clone --bare -b gh-pages \
        git@github.com:rainmeter/rainmeter-docs.git _ghpages.git
fi

rm -rf _generated
hexo generate

export GIT_DIR=$PWD/_ghpages.git
export GIT_WORK_TREE=$PWD/_generated

git config core.autocrlf false
git fetch --force origin gh-pages
git reset --mixed FETCH_HEAD
git checkout -- .nojekyll CNAME
git add -A .
git commit -m "Update"
git push origin gh-pages

popd
