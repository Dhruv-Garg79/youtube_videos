FROM node:14-alpine as base

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json .env.dev ./

COPY ./src ./src

EXPOSE 3000

RUN yarn install

CMD ["yarn", "run", "build:dev"]
