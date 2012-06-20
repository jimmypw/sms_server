var redis = require('redis');
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var redisclient = redis.createClient();

redisclient.on('error', function(err) {
  console.log('Error' + err);
});

var server = http.createServer(function(req, res) {
  requrl = url.parse(req.url);
  switch(requrl.pathname){
  case "/sms": 
    // TODO: An absolute bunch of error checking
    var qs = querystring.parse(requrl.query);
    var redismessage = {'number': qs.number, 'message': qs.message};
    redisclient.rpush('messages', JSON.stringify(redismessage));
    break;
  }
  res.end();
});

server.listen(4000);