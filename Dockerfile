FROM node:18

WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 4000
CMD [ "node", "build/src/index.js" ]