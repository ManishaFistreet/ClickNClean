# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the frontend
RUN npm run build

# Install Vite globally to run preview
RUN npm install -g vite

# Expose the port
EXPOSE 80

# Run Vite preview server on port 80
CMD ["vite", "preview", "--port", "80", "--host", "0.0.0.0"]