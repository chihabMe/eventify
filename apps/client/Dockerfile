FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build



#FROM nginx:stable-alpine

#COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
#COPY --from=builder /app/dist /usr/share/nginx/html
