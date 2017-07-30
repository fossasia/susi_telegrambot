export DEPLOY_BRANCH=${DEPLOY_BRANCH:-development}

export REPOSITORY="https://github.com/${TRAVIS_REPO_SLUG}.git"

if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_REPO_SLUG" != "fossasia/susi_telegrambot" -o  "$TRAVIS_BRANCH" != "$DEPLOY_BRANCH" ]; then
    echo "Skip production deployment for a very good reason."
    exit 0
fi

echo ">>> Removing gcoud files"
sudo rm -f /usr/bin/git-credential-gcloud.sh
sudo rm -f /usr/bin/bq
sudo rm -f /usr/bin/gsutil
sudo rm -f /usr/bin/gcloud
rm -rf node_modules

echo ">>> Installing new files"
curl https://sdk.cloud.google.com | bash;
source ~/.bashrc
gcloud components install kubectl

echo ">>> Decrypting credentials and authenticating gcloud account"
gcloud config set compute/zone us-central1-b
openssl aes-256-cbc -K $encrypted_2f15b474e042_key -iv $encrypted_2f15b474e042_iv -in ./kubernetes/travis/susi-telegrambot-e467bca1e540.json.enc -out susi-telegrambot-e467bca1e540.json -d
mkdir -p lib
gcloud auth activate-service-account --key-file susi-telegrambot-e467bca1e540.json
export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/susi-telegrambot-e467bca1e540.json
gcloud config set project susi-telegrambot
gcloud container clusters get-credentials bots
echo ">>> Building Docker image"
cd kubernetes/images/generator
docker build --build-arg COMMIT_HASH=$TRAVIS_COMMIT --build-arg BRANCH=$DEPLOY_BRANCH --build-arg REPOSITORY=$REPOSITORY --no-cache -t fossasia/susi_telegrambot:$TRAVIS_COMMIT .
docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker tag fossasia/susi_telegrambot:$TRAVIS_COMMIT fossasia/susi_telegrambot:latest-$DEPLOY_BRANCH
echo ">>> Pushing docker image"
docker push fossasia/susi_telegrambot
echo ">>> Updating deployment"
kubectl set image deployment/susi-telegrambot --namespace=web susi-telegrambot=fossasia/susi_telegrambot:$TRAVIS_COMMIT
rm -rf $GOOGLE_APPLICATION_CREDENTIALS
