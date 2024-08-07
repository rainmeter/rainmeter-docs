#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
pushd "$SCRIPT_DIR"

hexo clean
hexo generate
(cd ./public && postcss css/rainmeter.css --replace)
