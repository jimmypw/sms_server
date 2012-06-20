var secretKey = "7g24uibt92hu4tn924uh0294ubng0nb";
var crypto = require('crypto');
var hmac = crypto.createHmac('sha1', secretKey);
hmac.update("/foo?sms=baa&dubas=dbqqb");
console.log(hmac.digest('hex'));