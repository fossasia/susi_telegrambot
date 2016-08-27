# AskSusi Messengers

[![Code Climate](https://codeclimate.com/github/fossasia/asksusi_messengers/badges/gpa.svg)](https://codeclimate.com/github/fossasia/asksusi_messengers)
[![Build Status](https://travis-ci.org/fossasia/asksusi_messengers.svg?branch=development)](https://travis-ci.org/fossasia/asksusi_messengers)
[![CircleCI](https://img.shields.io/circleci/project/fossasia/asksusi_messengers.svg?maxAge=2592000?style=flat-square)](https://circleci.com/gh/fossasia/asksusi_messengers)

This is the common repository for the AskSusi chatbots on Social Media platforms. As of now, we have integrated AskSusi on Facebook Messenger, Slack and Telegram.

All of these bots / messengers work from one central ```index.js``` file, and run from one URL (with different paths).

The type of questions Susi can currently answer can be found in [this doc](https://github.com/loklak/loklak_server/blob/development/docs/AskSUSI.md). 

### Messenger Bot for Susi

Susi's Messenger bot can be found [on this page](https://www.facebook.com/asksusisu/). Personal Message the page to speak to Susi.

![alt text](http://i.imgur.com/6XkLyVL.png "Susi Messenger")

### Slack Bot for Susi

Susi's Slack bot will be up on the App Directory shortly. Talk to it by typing ```@susi``` followed by your message.

![alt text](http://i.imgur.com/FWlMQen.png "Susi Slack")

### Telegram Bot for Susi

Susi's Telegram Bot can be found [here](https://web.telegram.org/#/im?p=@asksusi_bot). 

![alt text](http://i.imgur.com/WXnSiGl.png "Susi Telegram")

## Contributions

We are currently adding more bots. Please help us expand Susi on other Social Media platforms. A list of platforms we aim to integrate Susi on can be seen [here](https://github.com/fossasia/asksusi_messengers/issues/1). You can propose and make Susi bots on other platforms too as you like.

As of now, all the bots have been developed in ```node.js``` and ```Express``` for smooth builds and CI. If you wish to add more bots, please append your code in the ```index.js``` file (without altering the other bots), update the ```package.json``` with your ```npm``` dependencies, add the screenshots and the usage / deployment documentation in the ```README.md```, and send a **single** squashed PR containing all these changes.

Thanks!

