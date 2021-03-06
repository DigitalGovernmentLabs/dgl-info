#!/bin/sh

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
NODE_MODULES_DIR="$(dirname "$SCRIPT_DIR")/node_modules"
"$NODE_MODULES_DIR/.bin/ts-node" -T -r "$NODE_MODULES_DIR/tsconfig-paths/register.js" "$@"
