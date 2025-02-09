FROM node:20-alpine
WORKDIR /dapp
COPY src /src/
COPY public /public/
COPY .env.mainnet /.env
COPY *.ts /
COPY .graphclientrc.yml /
COPY *.json /
COPY *.mjs /
RUN yarn
RUN yarn graph-build && yarn build
EXPOSE 3000
ENTRYPOINT export SCENE=mainnet && yarn start