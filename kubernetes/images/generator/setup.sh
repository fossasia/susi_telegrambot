#!/bin/bash
git clone ${REPOSITORY} susi_telegrambot
cd susi_telegrambot
git checkout ${BRANCH}

if [ -v COMMIT_HASH ]; then
    git reset --hard ${COMMIT_HASH}
fi

rm -rf .git
npm install --no-shrinkwrap
