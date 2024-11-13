FROM node:20-alpine

# Install necessary packages
RUN apk add --no-cache sudo python3 gcc g++

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create a new user with sudo privileges
RUN adduser -D -h /home/username username && \
    echo 'username:password' | chpasswd && \
    addgroup username wheel && \
    echo '%wheel ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

# Create code directory and set permissions
RUN mkdir -p /app/code && chown username:username /app/code

# Switch to the new user
USER username

CMD ["npm", "start"]
