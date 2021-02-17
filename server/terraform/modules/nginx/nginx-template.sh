#!/bin/sh
set -euo pipefail
test -n "$NGINX_SSL_NAME"

logging() {
  cat <<'EOF'
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;
EOF
}

cat <<EOF
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    $(logging)

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    server {
        listen 443 ssl;
        ssl_certificate /etc/ssl/${NGINX_SSL_NAME}.pem;
        ssl_certificate_key /etc/ssl/${NGINX_SSL_NAME}.key;
        location / {
            proxy_pass http://127.0.0.1:3000;
        }
    }
}
EOF
