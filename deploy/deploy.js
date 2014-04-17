/* jshint node:true */

'use strict';

var config = require('./config.json');
var S3Deploy = require('./lib/s3_deploy');

function deploy() {
  var s3Deploy = new S3Deploy(config);

  s3Deploy.deploy(function(err) {
    if(err) {
      throw err;
    }

    console.log('deploy successful!');
  });
}

deploy();


