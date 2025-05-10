FROM node:20-alpine AS build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy lockfile and package.json
COPY package.json pnpm-lock.yaml ./

# Install deps
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Prisma generation (if needed)
RUN npx prisma generate

# Build your app
RUN pnpm build

# --- Runtime stage ---
FROM node:20-alpine AS runtime

WORKDIR /app

# Install pnpm again if needed at runtime
RUN npm install -g pnpm

# Copy built app and deps
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/generated ./generated
COPY --from=build /app/dist ./dist

CMD ["node", "dist/main"]
