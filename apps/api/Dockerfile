# FROM node:20-alpine
#FROM node:lts-alpine3.17
#FROM node:slim
FROM node:20-alpine 

# RUN apt-get update -y \
# && apt-get install -y openssl



WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy prisma schema before the rest of the code
COPY prisma ./prisma/

# Generate Prisma client during build
RUN npx prisma generate

# Now copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Command is now overridden by docker-compose
CMD ["node", "dist/main"]
