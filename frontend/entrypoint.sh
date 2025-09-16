#!/bin/sh
# Generate config.js with runtime environment variables
cat << EOF > /usr/share/nginx/html/config.js
window.env = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-https://api.example.com}",
  VITE_STRIPE_CLIENT_ID: "${VITE_STRIPE_CLIENT_ID:-client_default}",
  VITE_GOOGLE_CLIENT_ID: "${VITE_GOOGLE_CLIENT_ID:-google_default}",
};
EOF

# Inject <script> tag into index.html to load config.js
sed -i '/<head>/a <script src="/config.js"></script>' /usr/share/nginx/html/index.html

# Start Nginx
exec "$@"