'use strict';
/* global require, process, console */

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

// recommended to inject access tokens as environmental variables, e.g.
var token = process.env.FB_PAGE_ACCESS_TOKEN;
// const token = "<PAGE_ACCESS_TOKEN>"

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
	let messageData = {
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

// Getting Susi up and running.
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));
});
