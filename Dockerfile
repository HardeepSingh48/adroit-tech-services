# Stage 1: Build career portal
FROM node:20-alpine AS career-builder
WORKDIR /app/career
COPY adroit-tech-career/package*.json ./
RUN npm ci
COPY adroit-tech-career ./
RUN npm run build

# Stage 2: Build main frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY adroit-tech-frontend/package*.json ./
RUN npm ci
COPY adroit-tech-frontend ./
RUN npm run build

# Stage 3: Serve with Nginx
FROM nginx:alpine
# Copy main site assets
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
# Copy career portal assets to /portal/ subfolder
COPY --from=career-builder /app/career/dist /usr/share/nginx/html/portal
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
