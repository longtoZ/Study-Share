# Stage 1: Build the Node.js application
from node:22-alpine

workdir /app
copy package.json package-lock.json ./
run npm install
copy . .
expose 3000
cmd ["node", "server.js"]