#!/bin/sh
set -eu
# Only fixed, public narration assets are written here. Drop root before serving requests.
cache_dir="${NARRATION_CACHE_DIR:-/tmp/anaia-narration}"
if [ -z "${NARRATION_CACHE_DIR:-}" ] && [ -n "${RAILWAY_VOLUME_MOUNT_PATH:-}" ]; then
 cache_dir="$RAILWAY_VOLUME_MOUNT_PATH/story-narration"
fi
mkdir -p "$cache_dir"
chown node:node "$cache_dir"
chmod 700 "$cache_dir"
export NARRATION_CACHE_DIR="$cache_dir"
exec su-exec node node server.mjs
