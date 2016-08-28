# AskSusi Messengers

[![Code Climate](https://codeclimate.com/github/fossasia/asksusi_messengers/badges/gpa.svg)](https://codeclimate.com/github/fossasia/asksusi_messengers)
[![Build Status](https://travis-ci.org/fossasia/asksusi_messengers.svg?branch=development)](https://travis-ci.org/fossasia/asksusi_messengers)
[![CircleCI](https://img.shields.io/circleci/project/fossasia/asksusi_messengers.svg?maxAge=2592000?style=flat-square)](https://circleci.com/gh/fossasia/asksusi_messengers)

This is the common repository for the AskSusi chatbots on Social Media platforms. As of now, we have integrated AskSusi on Facebook Messenger, Slack and Telegram.

All of these bots / messengers work from one central ```index.js``` file, and run from one URL (with different paths).

The type of questions Susi can currently answer can be found in [this doc](https://github.com/loklak/loklak_server/blob/development/docs/AskSUSI.md). 

### Messenger Bot for Susi

Susi's Messenger bot can be found [on this page](https://www.facebook.com/asksusisu/). Personal Message the page to speak to Susi.

It's easy for you to create your own facebook messenger bot and integrate susi's API into it. You can read the  [documentation](https://developers.facebook.com/docs/messenger-platform/quickstart) the Messenger team prepared.

Messenger bots uses a web server to process messages it receives or to figure out what messages to send. You also need to have the bot be authenticated to speak with the web server and the bot approved by Facebook to speak with the public.

*Setup the Facebook App*

1. Create or configure a Facebook App or Page here https://developers.facebook.com/apps/
2. In the app go to Messenger tab then click Setup Webhook. Here you will put in the URL of your Heroku server and a token. Make sure to check all the subscription fields. 
![FB Settings](/images/fb_settings.png)
3. Get a Page Access Token and save this somewhere. 
4. Go back to Terminal and type in this command to trigger the Facebbook app to send messages. Remember to use the token you requested earlier.
![FB Settings](/images/susifb_chat.png)

```bash
curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=<PAGE_ACCESS_TOKEN>"
```

![alt text](http://i.imgur.com/6XkLyVL.png "Susi Messenger")

### Slack Bot for Susi

Susi's Slack bot will be up on the App Directory shortly. Talk to it by typing ```@susi``` followed by your message.

![alt text](http://i.imgur.com/FWlMQen.png "Susi Slack")

### Telegram Bot for Susi

Susi's Telegram Bot can be found [here](https://web.telegram.org/#/im?p=@asksusi_bot). 

![alt text](http://i.imgur.com/WXnSiGl.png "Susi Telegram")

Consuming the Susi API with telegram is fairly straightforward in telegram. The use of `botfather` in telegram ensures that the bots can be created with ease. So the first step is to login into telegram with your user account and search and talk to `BotFather`. Bot father would ask a few questions and then provide the required token. You need to save this token and the bot powered by susi is now available.

![Bot Father 1](/images/botfather1.png)

![Bot Father 2](/images/botfather2.png)

Once this is set, you need to update the token using heroku as follows
`heroku config:set TELEGRAM_ACCESS_TOKEN=AVERYLONGTOKEN:GOESOVERHEREFORYOUTORUNSUSIONTELEGRAM`

## Contributions

We are currently adding more bots. Please help us expand Susi on other Social Media platforms. A list of platforms we aim to integrate Susi on can be seen [here](https://github.com/fossasia/asksusi_messengers/issues/1). You can propose and make Susi bots on other platforms too as you like.

As of now, all the bots have been developed in ```node.js``` and ```Express``` for smooth builds and CI. If you wish to add more bots, please append your code in the ```index.js``` file (without altering the other bots), update the ```package.json``` with your ```npm``` dependencies, add the screenshots and the usage / deployment documentation in the ```README.md```, and send a **single** squashed PR containing all these changes.

Thanks!

