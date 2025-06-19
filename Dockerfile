# 🔧 Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

# Allow passing VITE_* variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build using production mode (so it uses .env.production)
RUN npm run build

# 🧊 Production stage
FROM nginx:alpine AS production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Custom nginx config
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
