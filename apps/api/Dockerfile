FROM node:20-alpine AS build

WORKDIR /app

# Only copy files you actually have
COPY package.json ./
# If you generate a lock‑file later, switch to `npm ci` here
RUN npm install

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

CMD ["npm", "run","start:prod"]

