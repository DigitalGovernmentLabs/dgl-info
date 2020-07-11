FROM node:12-alpine

COPY ./package.json /app/

COPY ./yarn.lock /app/

WORKDIR /app

RUN yarn install --frozen-lockfile

COPY . /app/

RUN yarn build

CMD ["yarn", "pm2:start"]
