/* jshint node:true */

'use strict';

var TagChecker = require('./lib/tag_checker');
var S3Deploy = require('./lib/s3_deploy');
var config = require('./config.json');

var TRAVIS_REPO_SLUG = process.env.TRAVIS_REPO_SLUG;
var S3_ID = process.env.AWS_S3_ID;
var S3_SECRET = process.env.AWS_S3_SECRET;

function deploy() {
  deployableBuild(function(err, result) {
    if (err) {
      throw err;
    }

    if (result === false) {
      return;
    }

    config.s3Config = {
      accessKeyId: S3_ID,
      secretAccessKey: S3_SECRET
    };

    var s3Deploy = new S3Deploy(config);

    s3Deploy.setup();
    s3Deploy.deploy(function(err) {
      if(err) {
        console.log(err);
      }

      console.log('deployed!');
    });
  });
}

function deployableBuild(cb) {
  var tagChecker = new TagChecker(config.user, config.repo);
  tagChecker.check(function(err, tagData) {
    if (err) {
      return cb(err);
    }

    if (TRAVIS_REPO_SLUG !== config.user + '/' + config.repo) {
      return cb(null, false);
    }

    if (tagData.isTag === false) {
      return cb(null, false);
    }

    return cb(null, true);
  });
}

deploy();


