#!/usr/bin/env sh
set -eu

envsubst '${API_AUTH_HOST} ${API_HOST}' < /etc/nginx/default.conf.template > /etc/nginx/nginx.conf

exec "$@"
