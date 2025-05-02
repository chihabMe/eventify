#setting up the nodejs apline image 

FROM node:20-alpine

# setting up the working directory

WORKDIR /app

# copying the package.json and package-lock.json files to the working directory
COPY package*.json ./

# this is done to install the dependencies before copying the rest of the files
RUN npm install 

COPY . . 

## generate prisma client

RUN npx prisma generate
# building the application

RUN npm run build

CMD ["node","dist/main"]

# exposing the port 3000
EXPOSE 8000


