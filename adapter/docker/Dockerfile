FROM node:alpine
WORKDIR /app
COPY ./package.json ./index.js /app/
RUN npm install --only=production --omit=dev && apk add --no-cache sqlite
EXPOSE 8787
CMD ["npm", "run", "start"]