'use strict';
/* global require, process, console */

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var http = require("http");
var TelegramBot = require('node-telegram-bot-api');

var app = express();
app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

// recommended to inject access tokens as environmental variables, e.g.
var telegramToken = process.env.TELEGRAM_ACCESS_TOKEN;
// Setup polling way
var bot = new TelegramBot(telegramToken, {polling: true});

app.get('/', function (req, res) {
	res.send('Susi says Hello.');
});

bot.onText(/\/start/, function (msg, match) {
	var fromId = msg.from.id;
	var resp = 'Hi, I am Susi, You can ask me anything !';
	bot.sendMessage(fromId, resp);
});

// Any other message
bot.on('message', function (msg) {
	var chatId = msg.chat.id;
	var queryUrl = 'http://api.asksusi.com/susi/chat.json?q='+encodeURI(msg.text);
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

// Getting Susi up and running.
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));
});
