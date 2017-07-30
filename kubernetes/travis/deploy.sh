export DEPLOY_BRANCH=${DEPLOY_BRANCH:-development}

export REPOSITORY="https://github.com/${TRAVIS_REPO_SLUG}.git"

sudo rm -f /usr/bin/git-credential-gcloud.sh
sudo rm -f /usr/bin/bq
sudo rm -f /usr/bin/gsutil
sudo rm -f /usr/bin/gcloud
rm -rf node_modules

curl https://sdk.cloud.google.com | bash;
source ~/.bashrc
gcloud components install kubectl

gcloud config set compute/zone us-central1-b
openssl aes-256-cbc -K $encrypted_324c873b2450_key -iv $encrypted_324c873b2450_iv -in ./kubernetes/travis/susi-telegrambot-e467bca1e540.json.enc -out susi-telegrambot-e467bca1e540.json -d
mkdir -p lib
gcloud auth activate-service-account --key-file susi-telegrambot-e467bca1e540.json
export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/susi-telegrambot-e467bca1e540.json
gcloud config set project susi-telegrambot
gcloud container clusters get-credentials bots
cd kubernetes/images/generator
docker build --build-arg COMMIT_HASH=$TRAVIS_COMMIT --build-arg BRANCH=$DEPLOY_BRANCH --build-arg REPOSITORY=$REPOSITORY --no-cache -t aliayubkhan/susi_telegrambot:$TRAVIS_COMMIT .
docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker tag aliayubkhan/susi_telegrambot:$TRAVIS_COMMIT aliayubkhan/susi_telegrambot:latest
docker push aliayubkhan/susi_telegrambot
kubectl set image deployment/susi-telegrambot --namespace=web susi-telegrambot=aliayubkhan/susi_telegrambot:$TRAVIS_COMMIT
rm -rf $GOOGLE_APPLICATION_CREDENTIALS
