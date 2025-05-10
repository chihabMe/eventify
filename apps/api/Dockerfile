FROM node:20-alpine AS build

RUN apk add --no-cache openssl

WORKDIR /app


COPY package.json package-lock.json* ./


## produciton install
RUN npm ci

# Prisma generation
COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/generated ./generated

# exposing the 8000 port
EXPOSE 8000

CMD ["node","dist/main"]

