# Use Node base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app source code (routers, views, tsconfig, etc.)
COPY . .

# Build your TypeScript code (assuming you have a build script in package.json)
RUN npm run build

# Expose the port your Express app listens on (change 3000 to whatever your app uses)
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]