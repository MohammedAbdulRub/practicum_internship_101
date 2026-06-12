FROM node:20-alpine

WORKDIR /app

COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node src/    ./src/
COPY --chown=node:node public/ ./public/

ENV NODE_ENV=production
EXPOSE 3000

USER node

CMD ["node", "src/index.js"]
