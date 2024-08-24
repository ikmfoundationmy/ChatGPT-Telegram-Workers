FROM node:18

WORKDIR /app
COPY package.json index.js 

RUN apk add --no-cache sqlite

EXPOSE 8787
CMD ["node", "index.js"]

