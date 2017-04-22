require('dotenv').load();
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');
const Promise = require('bluebird');
const cors = require('cors');
const bodyParser = require('body-parser');
const AccessToken = require('twilio').AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const app = express();
const jsonParser = bodyParser.json();
const client = require('twilio')(config.accountSid, config.authToken);
const keyGenerate = Promise.promisify(client.keys.create);

//uncomment below for production build
// const httpsOptions = {
//   cert: fs.readFileSync(config.sslCert),
//   key: fs.readFileSync(config.sslKey)
// }

app.use(cors());
app.use(jsonParser);

app.all('/', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

let genKey;
keyGenerate({friendlyName: 'KindredApp'}).then((key, err) => {
  genKey = key;
  console.log(genKey);
});


app.get('/api/twilio', (req, res) => {
  //api/token?q=s
  var identity = req.query.q;
  console.log(identity);
  console.log('key is', genKey);
  var token = new AccessToken(
    config.accountSid,
    genKey.sid,
    genKey.secret
  );

  token.identity = identity;

  var grant = new VideoGrant();
  grant.configurationProfileSid = config.rtcProfileSid;
  token.addGrant(grant);

  res.send({
    identity: identity,
    token: token.toJwt()
  });
});


//development server
app.listen(config.PORT, () => {
  console.log(`I'm listening at ${config.PORT}.`);
});

//production server
// https.createServer(httpsOptions, app)
//   .listen(config.PORT, () => {
//     console.log(`App is listening at port ${config.PORT}.`);
//   });
