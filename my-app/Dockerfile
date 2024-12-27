# Base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source and public directories
COPY ./src ./src
COPY ./public ./public

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npx", "serve", "-s", "build"]
