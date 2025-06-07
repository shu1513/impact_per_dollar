FROM node:23.9.0

WORKDIR /usr/src/app

# Copy package files first for layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN echo "VITE_API_URL=$VITE_API_URL" > .env

# Copy rest of the code
COPY . .

# Build TypeScript
RUN npm run build

# Expose app port (optional)
EXPOSE 5173

# Start app
CMD ["npm", "run", "dev"]