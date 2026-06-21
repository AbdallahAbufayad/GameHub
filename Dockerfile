# 1. Build stage for TypeScript
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Compiles your TypeScript to JavaScript (make sure you have a build script in package.json)
RUN npm run build 

# 2. Production execution stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
# Copy the compiled JS files and your views folder containing your EJS templates
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/views ./views

EXPOSE 3000
CMD ["node", "dist/index.js"]