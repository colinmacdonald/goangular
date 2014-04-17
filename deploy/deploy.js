/* jshint node:true */

'use strict';

var TagChecker = require('./lib/tag_checker');
var S3Deploy = require('./lib/s3_deploy');

var TRAVIS_REPO_SLUG = process.env.TRAVIS_REPO_SLUG;

var USER = 'colinmacdonald';
var REPO = 'goangular';
var SOURCE = '../dist';
var NAMESPACE = 'integrations';
var CDN = 'https://cdn.goinstant.net/' + NAMESPACE + '/';
var TEMPLATE = null;

var BUCKET = 'goangular-travis-test';
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

    var config = {
      source: SOURCE,
      namespace: NAMESPACE,
      user: USER,
      repo: REPO,
      cdn: CDN,
      teplate: TEMPLATE,
      bucket: BUCKET,
      s3Config: {
        accessKeyId: S3_ID,
        secretAccessKey: S3_SECRET
      }
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
  var tagChecker = new TagChecker(USER, REPO);
  tagChecker.check(function(err, tagData) {
    if (err) {
      return cb(err);
    }

    if (TRAVIS_REPO_SLUG !== USER + '/' + REPO) {
      return cb(null, false);
    }

    if (tagData.isTag === false) {
      return cb(null, false);
    }

    return cb(null, true);
  });
}

deploy();


