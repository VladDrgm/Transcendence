# # Dockerfile for Nest.js backend

# # Use a Node.js base image
# FROM node:14-alpine

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# COPY package*.json ./
# RUN npm install

# # Copy app source code
# COPY . .

# # Expose port 3000
# EXPOSE 3000

# # Start the app
# CMD ["npm", "start"]

# Dockerfile for Nest.js backend

# Use a Node.js base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json separately to leverage Docker cache
COPY package*.json package-lock*.json ./

# Install app dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

