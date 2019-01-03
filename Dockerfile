FROM node:10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN yarn

ENTRYPOINT yarn start

EXPOSE 3000
