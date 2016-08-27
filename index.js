'use strict';
/* global require, process, console */

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

var TelegramBot = require('node-telegram-bot-api');
var SlackBot = require('slackbots');
var Slack = require('node-slackr')
app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

// recommended to inject access tokens as environmental variables, e.g.
var token = process.env.FB_PAGE_ACCESS_TOKEN;
var telegramToken = process.env.TELEGRAM_ACCESS_TOKEN;
var slack_webhook_url = process.env.SLACK_WEBHOOK_URL;
// Setup polling way
var bot = new TelegramBot(telegramToken, {polling: true});
// const token = "<PAGE_ACCESS_TOKEN>"
var slack_token = process.env.SLACK_TOKEN;
var slack_bot = new SlackBot({
	token: slack_token, 
	name: 'susi'
})
var payload;
var slack = new Slack(slack_webhook_url);

// FACEBOOK SERVICE FOR SUSI
// ----------------------------------------------------------------------------------------------------------------

function sendTextMessage(sender, text) {
	var messageData = { text:text };
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		}
	});
}

function sendGenericMessage(sender, title, subtitle, image_url) {
	var messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": title,
					"subtitle": subtitle,
					"image_url": image_url
				}]
			}
		}
	};
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

app.get('/', function (req, res) {
	res.send('Susi says Hello.');
});

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong token');
});

// to post data
app.post('/webhook/', function (req, res) {
	var messaging_events = req.body.entry[0].messaging
	for (var i = 0; i < messaging_events.length; i++) {
		var event = req.body.entry[0].messaging[i];
		var sender = event.sender.id;
		if (event.message && event.message.text) {
			var text = event.message.text;
			if (text === 'image') {
				// Sample testing URL
				sendGenericMessage(sender, 'Map Location', 'This is the location', 'http://loklak.org/vis/map.png?mlat=17.77262&mlon=78.2728192&zoom=12');
				// Images are sent similar to this.
				// Implement actual logic later here.
				continue
			}

			// Construct the query for susi
			var queryUrl = 'http://loklak.org/api/susi.json?q='+encodeURI(text);
			var message = '';
			// Wait until done and reply
			request({
				url: queryUrl,
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					message = body.answers[0].actions[0].expression;
					sendTextMessage(sender, message);
				} else {
					message = 'Oops, Looks like Susi is taking a break, She will be back soon';
					sendTextMessage(sender, message);
				}
			});
			// sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		if (event.postback) {
			var text = JSON.stringify(event.postback);
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token);
			continue;
		}
	}
	res.sendStatus(200)
})


// TELEGRAM SERVICE FOR SUSI
// ----------------------------------------------------------------------------------------------------------------
// Matches /start 
bot.onText(/\/start/, function (msg, match) {
	var fromId = msg.from.id;
	var resp = 'Hi, I am Susi, You can ask me anything !';
	bot.sendMessage(fromId, resp);
});

// Any other message
bot.on('message', function (msg) {
	var chatId = msg.chat.id;
	var queryUrl = 'http://loklak.org/api/susi.json?q='+encodeURI(msg.text);
	var message = '';
	// Wait until done and reply
	if (msg.text !== '/start') {
		request({
			url: queryUrl,
			json: true
		}, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				message = body.answers[0].actions[0].expression;
				bot.sendMessage(chatId, message);
			} else {
				message = 'Oops, Looks like Susi is taking a break, She will be back soon';
				bot.sendMessage(chatId, message);
			}
		});
	}
});

//SLACK SERVICE FOR SUSI
//-----------------------------------------------------------------------------------------------------------------
function slackbot(){
	slack_bot.on('message', function(data){
		var slackdata = data;
		var msg, channel, output, user;
		if(Object.keys(slackdata).length > 0){
			if('text' in slackdata && slackdata['username'] != 'susi'){
				msg = data['text'];
				channel = data['channel']
			}
			else {
				msg = null;
				channel = null;
			}
		}
		if(msg != null && channel !=null){
			var botid = '<@U1UK6DANT>:' 
			if (msg.split(" ")[0] != botid){
			//do nothing
		} else{
			var apiurl = 'http://loklak.org/api/susi.json?q=' + msg;
			var payload;
			request(apiurl, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					var data = JSON.parse(body);
					if(data.answers[0].actions.length == 1){
						var susiresponse = data.answers[0].actions[0].expression;
						payload = {
							text: susiresponse,
							channel: channel
						}
						slack.notify(payload)

					} else if(data.answers[0].actions.length == 2 && data.answers[0].actions[1].type == "table"){
						payload = {
							text: data.answers[0].actions[0].expression + " (" + data.answers[0].data.length + " results)",
							channel: channel
						}
						slack.notify(payload)
						for(var i = 0; i < data.answers[0].data.length; ++i){
							var response = data.answers[0].data[i];
							var ansstring = "";
							for(var resp in response){
								ansstring += (resp + ": " + response[resp] + ", ");
							}
							payload = {
								text: ansstring,
								channel: channel
							}
							slack.notify(payload);
						}
					}
				}
			});
		}
	}
});
}
// Getting Susi up and running.
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));
	slackbot();
});
