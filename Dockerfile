# ---- Stage 1: Install dependencies ----
FROM node:20.12-alpine3.18 AS deps
WORKDIR /app
# Copy strictly needed files for dependency installation
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# ---- Stage 2: Build the application ----
FROM node:20.12-alpine3.18 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Use placeholders for environment variables during build
# This allows 'Build Once, Run Anywhere' via runtime injection
ENV VITE_DASHBOARD_API_URL=APP_PLACEHOLDER_VITE_DASHBOARD_API_URL
ENV VITE_USER_API_URL=APP_PLACEHOLDER_VITE_USER_API_URL
ENV VITE_AUTH_SERVER_URL=APP_PLACEHOLDER_VITE_AUTH_SERVER_URL
ENV VITE_OIDC_CLIENT_ID=APP_PLACEHOLDER_VITE_OIDC_CLIENT_ID
ENV VITE_OIDC_REDIRECT_URI=APP_PLACEHOLDER_VITE_OIDC_REDIRECT_URI

RUN npm run build

# ---- Stage 3: Serve with Nginx ----
FROM nginx:1.25.4-alpine AS production

# Set up non-root user for security
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built static files
COPY --from=build --chown=nginx:nginx /app/build/client /usr/share/nginx/html

# Copy and setup entrypoint script for runtime env injection
COPY --chown=nginx:nginx entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:8080/health || exit 1

ENTRYPOINT ["entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]