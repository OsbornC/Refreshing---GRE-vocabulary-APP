require('./db.js');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
 console.log(dbconf);
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/jc7483';
}
const path = require('path');

app.use(express.urlencoded({ extended: false }));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(dbconf);

app.listen(process.env.PORT || 3000);