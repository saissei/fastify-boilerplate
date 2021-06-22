FROM node:lts-buster-slim

WORKDIR /app/
ARG NODE_ENV=production
COPY dist dist
COPY config config
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install
#RUN apt-get update -y && apt upgrade -y

CMD [ "yarn", "start" ]
#CMD [ "tail", "-f", "/dev/null" ]
