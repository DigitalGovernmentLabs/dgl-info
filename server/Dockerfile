FROM node:12-alpine

COPY . /app

RUN yarn install --frozen-lockfile

RUN yarn build

CMD ["yarn", "pm2:start"]
