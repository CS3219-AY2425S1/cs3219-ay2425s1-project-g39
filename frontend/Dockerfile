# Use a Node.js image to build the React app
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Ensure TypeScript is installed
RUN npm install typescript

# Copy the rest of the application
COPY . .
