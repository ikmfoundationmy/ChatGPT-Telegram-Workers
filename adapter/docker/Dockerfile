FROM node:18-alpine

WORKDIR /app

COPY package.json index.js ./

RUN apk add --no-cache git && \
    npm install --production && \
    npm cache clean --force

EXPOSE 8787

CMD ["node", "index.js"]