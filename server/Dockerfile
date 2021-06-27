FROM node:alpine

WORKDIR /server

COPY package.json .
COPY tsconfig.json .
RUN npm install

COPY . .
RUN npm run build


## stage two

FROM node:alpine
WORKDIR /server
RUN npm install --only=production
COPY --from=0 /server/usr .
RUN npm install pm2 -g
ENV PORT=80
EXPOSE 80
CMD ["pm2-runtime", "server.js"]