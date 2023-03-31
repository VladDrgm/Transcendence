# Use a Node.js base image
FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port 3001
EXPOSE 3001

# Start the app
CMD ["npm", "start"]
