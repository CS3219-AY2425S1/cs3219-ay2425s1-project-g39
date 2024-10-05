#!/bin/bash
envsubst '\$USER_SERVICE_ADDR \$QUESTION_SERVICE_ADDR' < /tmp/default.conf > /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'
