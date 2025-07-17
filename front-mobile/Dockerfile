FROM node:18-alpine

# Install dependencies for Expo
RUN apk add --no-cache git

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose Expo ports
EXPOSE 19000 19001 19002 8081

# Create a script to handle the custom Expo command
RUN echo '#!/bin/sh\nnpx expo start --dev-client --scheme korpor-front --port 19000' > /usr/local/bin/start-expo.sh && \
    chmod +x /usr/local/bin/start-expo.sh

# Health check for Expo development server
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:19000/ || exit 1

CMD ["/usr/local/bin/start-expo.sh"] 