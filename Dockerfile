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
RUN chmod -R a+rX /app
USER node
EXPOSE 3000
CMD ["node", "server.mjs"]
