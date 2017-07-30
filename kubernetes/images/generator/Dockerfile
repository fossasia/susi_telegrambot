FROM node:boron

ARG COMMIT_HASH
ARG BRANCH
ARG REPOSITORY

ENV COMMIT_HASH ${COMMIT_HASH:-null}
ENV BRANCH ${BRANCH:-development}
ENV REPOSITORY ${REPOSITORY:-https://github.com/AliAyub007/susi_telegrambot.git}
ENV INSTALL_PATH /telegram

RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY . .

RUN bash setup.sh

WORKDIR $INSTALL_PATH/susi_telegrambot

CMD [ "npm", "start" ]
