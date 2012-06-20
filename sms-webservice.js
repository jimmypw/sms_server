var redis = require('redis');
var http = require('http');
var url = require('url');
var crypto = require('crypto');
var querystring = require('querystring');

var secretKey = "7g24uibt92hu4tn924uh0294ubng0nb";
var redisclient = redis.createClient();

redisclient.on('error', function(err) {
  console.log('Error' + err);
});

var server = http.createServer(function(_req, _res) {
  var hmac = crypto.createHmac('sha1', secretKey);
  hmac.update(_req.url);
  if (hmac.digest('hex') === _req.headers.auth) {
    processRequest(_req, _res)
  }
  _res.end();
});

function processRequest(_req, _res) {
  var requrl = url.parse(_req.url);
  switch(requrl.pathname){
  case "/sms": 
    // TODO: An absolute bunch of error checking
    var qs = querystring.parse(requrl.query);
    var redismessage = {'number': qs.number, 'message': qs.message};
    redisclient.rpush('messages', JSON.stringify(redismessage));
    break;
  }
}


server.listen(4000);