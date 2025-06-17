# frontend/Dockerfile

# ---- Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of your app and set environment variable
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY . .
RUN echo "VITE_API_URL=$VITE_API_URL" > .env

# Build for production
RUN npm run build

# ---- Serve Stage ----
FROM nginx:stable-alpine

# Copy built files from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
