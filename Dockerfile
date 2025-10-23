# ---------- Dev (для локалки с hot-reload) ----------
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 9001
CMD ["npm","run","start:dev"]

# ---------- Build (TS -> dist) ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ---------- Prod deps (только prod зависимости) ----------
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# ---------- Runtime (Production) ----------
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
# безопаснее не root
RUN addgroup -S app && adduser -S app -G app
USER app

# кладём только нужное
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

EXPOSE 9001
CMD ["npm","run","start:prod"]

