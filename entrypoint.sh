#!/bin/sh

# Exit on error
set -e

echo "Starting environment variable injection..."

# List of variables to replace
VARS="VITE_DASHBOARD_API_URL VITE_USER_API_URL VITE_AUTH_SERVER_URL VITE_OIDC_CLIENT_ID VITE_OIDC_REDIRECT_URI"

for var in $VARS; do
    val=$(eval echo \$$var)
    if [ -n "$val" ]; then
        echo "Injecting $var..."
        # Escape for sed
        escaped_val=$(echo "$val" | sed 's/[\/&]/\\&/g')
        # Find all JS files in assets and replace the placeholder
        find /usr/share/nginx/html/assets -name "*.js" -exec sed -i "s|APP_PLACEHOLDER_$var|$escaped_val|g" {} +
    fi
done

echo "Injection complete. Starting Nginx..."
exec "$@"
