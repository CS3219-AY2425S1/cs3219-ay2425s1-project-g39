#!/bin/bash
envsubst '\$USER_SERVICE_ADDR \$QUESTION_SERVICE_ADDR \$MATCH_NOTIFICATION_SERVICE_ADDR \$COLLABORATION_SERVICE_ADDR \$COMMUNICATION_SERVICE_ADDR \$HISTORY_SERVICE_ADDR \$CODE_EXECUTION_SERVICE_ADDR \$DOMAIN_NAME'< /tmp/default.conf > /etc/nginx/conf.d/default.conf
mkdir -p /etc/nginx/conf.d/templates
envsubst '\$DOMAIN_NAME' < /tmp/templates/api.conf > /etc/nginx/conf.d/templates/api.conf
cp /tmp/templates/socket.conf /etc/nginx/conf.d/templates/socket.conf
nginx -g 'daemon off;'
