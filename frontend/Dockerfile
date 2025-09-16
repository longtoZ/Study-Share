# Stage 1: Build the React application
from node:22-alpine as build

workdir /app

copy package.json package-lock.json ./
run npm install
copy . .
run npm run build

# Stage 2: Serve the React application with Nginx
from nginx:alpine

copy --from=build /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration (optional, for flexibility)
copy nginx.conf /etc/nginx/conf.d/default.conf

# Create a script to generate config.js at runtime
copy entrypoint.sh /entrypoint.sh
run chmod +x /entrypoint.sh

expose 80

# Use the entrypoint script to inject variables and start Nginx
entrypoint ["/entrypoint.sh"]
cmd ["nginx", "-g", "daemon off;"]