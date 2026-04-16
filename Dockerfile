# ---- Stage 1: Install dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# ---- Stage 2: Build the application ----
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args for Vite env variables (baked in at build time)
ARG VITE_DASHBOARD_API_URL
ARG VITE_USER_API_URL
ARG VITE_AUTH_SERVER_URL
ARG VITE_OIDC_CLIENT_ID
ARG VITE_OIDC_REDIRECT_URI

ENV VITE_DASHBOARD_API_URL=$VITE_DASHBOARD_API_URL
ENV VITE_USER_API_URL=$VITE_USER_API_URL
ENV VITE_AUTH_SERVER_URL=$VITE_AUTH_SERVER_URL
ENV VITE_OIDC_CLIENT_ID=$VITE_OIDC_CLIENT_ID
ENV VITE_OIDC_REDIRECT_URI=$VITE_OIDC_REDIRECT_URI

RUN npm run build

# ---- Stage 3: Serve with Nginx ----
FROM nginx:alpine AS production

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from the build stage
COPY --from=build /app/build/client /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]