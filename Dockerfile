FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all code (including routers, views, config files)
COPY . .

EXPOSE 3000

# Replace this with the actual start command from your package.json scripts
CMD ["npm", "start"]