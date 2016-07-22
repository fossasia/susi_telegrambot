var request = require('request');

var queryUrl = 'http://localhost:9000/api/susi.json?q=Hi I am Sudheesh';

request({
    url: queryUrl,
    json: true
}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        return body.answers[0].actions[0].expression;
    }
});
