FROM node:24-alpine AS build
WORKDIR /app
COPY package.json ./
COPY scripts ./scripts
COPY public ./public
COPY src ./src
RUN npm run build
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package.json server.mjs ./
COPY src ./src
COPY public/payment-links.js public/stories.js ./public/
COPY scripts/start-container.sh ./scripts/start-container.sh
RUN apk add --no-cache su-exec && chmod -R a+rX /app
EXPOSE 3000
CMD ["sh", "scripts/start-container.sh"]
