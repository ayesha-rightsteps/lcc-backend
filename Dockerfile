FROM node:20-slim AS server-base
WORKDIR /usr/src/app
COPY ./package*.json ./

FROM server-base AS server

ENV NODE_ENV=production

RUN npm ci --omit=dev

COPY . .

RUN chown -R node:node /usr/src/app

USER node

EXPOSE 5000

CMD ["npm", "start"]
