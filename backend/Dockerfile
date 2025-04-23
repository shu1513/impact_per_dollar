# Start from node base image
FROM node:23.9.0

# Set working directory
WORKDIR /usr/src/app

# Remove any old build files
RUN rm -rf node_modules build

# Copy package files first for layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy rest of the code
COPY . .

# Build TypeScript
RUN npm run build

# Expose app port (optional)
EXPOSE 3000

# Start app
CMD ["npm", "start"]

