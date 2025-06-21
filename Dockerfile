FROM node:20.10.0

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start", "-H", "0.0.0.0"]
