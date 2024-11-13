# Use nginx image to serve the build files
FROM nginx:1.26.0-alpine3.19

# Add bash for boot cmd
RUN apk add bash

# Add nginx.conf to container
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx default.conf /tmp/default.conf
COPY --chown=nginx:nginx templates/ /tmp/templates/
COPY --chown=nginx:nginx start.sh /app/start.sh

# set workdir
WORKDIR /app

# permissions and nginx user for tightened security
RUN chmod -R 755 /app && chown -R nginx:nginx /app && \
    chmod -R 755 /tmp && chown -R nginx:nginx /tmp && \
    chmod -R 755 /var/cache/nginx && chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /var/log/nginx && chown -R nginx:nginx /var/log/nginx && \
    chmod -R 755 /etc/nginx/conf.d && chown -R nginx:nginx /etc/nginx/conf.d
    
RUN touch /var/run/nginx.pid && chown -R nginx:nginx /var/run/nginx.pid

# # Uncomment to keep the nginx logs inside the container - Leave commented for logging to stdout and stderr
# RUN mkdir -p /var/log/nginx
# RUN unlink /var/log/nginx/access.log \
#     && unlink /var/log/nginx/error.log \
#     && touch /var/log/nginx/access.log \
#     && touch /var/log/nginx/error.log \
#     && chown nginx /var/log/nginx/*log \
#     && chmod 644 /var/log/nginx/*log

USER nginx

CMD ["nginx", "-g", "'daemon off;'"]