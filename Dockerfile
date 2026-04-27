# Stage 1: Build the React application
FROM node:20-alpine as build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application and build
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the build output from the first stage to Nginx's public folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration to handle React routing and the PORT environment variable
COPY nginx.conf /etc/nginx/conf.d/default.conf

# The script below replaces the 80 placeholder in the Nginx config with the 
# actual PORT environment variable provided by Cloud Run at runtime.
CMD ["/bin/sh", "-c", "sed -i 's/listen 80;/listen '\"$PORT\"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
