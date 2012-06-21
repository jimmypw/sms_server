var secretKey = "7g24uibt92hu4tn924uh0294ubng0nb";
var crypto = require('crypto');
var hmac = crypto.createHmac('sha1', secretKey);
hmac.update(process.argv[2]);
console.log(hmac.digest('hex'));