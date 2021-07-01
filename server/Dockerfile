FROM node:alpine

WORKDIR /server

COPY package.json .
COPY tsconfig.json .
RUN npm install --production

COPY . .

RUN npm install typescript -g
RUN npm run build


## stage two

# FROM node:alpine
# WORKDIR /server
COPY  ./src/serviceAccountKey.json ./dist
RUN ls
RUN npm install pm2 -g
ENV PORT=80
EXPOSE 80
CMD ["pm2-runtime", "dist/server.js"]