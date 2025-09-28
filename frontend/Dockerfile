# Stage 1: Build the React application
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:alpine

# Copy a custom Nginx configuration (optional, for flexibility)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# --- FIX: Convert CRLF to LF line endings using dos2unix ---
COPY entrypoint.sh /entrypoint.sh

# Install dos2unix, convert the script, and uninstall dosa2unix
RUN apk add --no-cache dos2unix && \
    dos2unix /entrypoint.sh && \
    apk del dos2unix

RUN chmod +x /entrypoint.sh

EXPOSE 80

# Use the entrypoint script to inject variables and start Nginx
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
