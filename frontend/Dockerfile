# Stage 1: Build the React application
from node:22-alpine as build

workdir /app

copy package.json package-lock.json ./
run npm install
copy . .
run npm run build

# Stage 2: Serve the React application with Nginx
from nginx:alpine
copy --from=build /app/build /usr/share/nginx/html
expose 80
cmd ["nginx", "-g", "daemon off;"]