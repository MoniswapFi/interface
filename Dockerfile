FROM node:20-alpine
WORKDIR /app
COPY src /src/
COPY public /public/
COPY .env /.env
COPY *.ts /
COPY .graphclientrc.yml /
COPY *.json /
COPY *.mjs /
RUN yarn
RUN yarn graph-build && yarn build
EXPOSE 3001
ENTRYPOINT yarn start