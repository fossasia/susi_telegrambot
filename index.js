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
				if(body.answers[0].actions.length == 3 &&  body.answers[0].actions[2].type == "map" ){
					var latitude = body.answers[0].actions[2].latitude;
					var longitude = body.answers[0].actions[2].longitude;
					bot.sendMessage(chatId, message);
					setTimeout(function(){
						bot.sendLocation(chatId,latitude,longitude);
					}, 1000);
				}
				else if(isURL(message) && message.includes("jpg")){
					bot.sendPhoto(chatId, message);
				}else {
					bot.sendMessage(chatId, message);
				}
				
			} else {
				message = 'Oops, Looks like Susi is taking a break, She will be back soon';
				bot.sendMessage(chatId, message);
			}
		});
	}
});

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

// Getting Susi up and running.
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));
});

