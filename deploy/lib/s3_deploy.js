/* jshint node: true */

'use strict';

var AWS = require('aws-sdk');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

var TagChecker = require('./tag_checker');
var HipchatNotify = require('./hipchat_notify');

var TAG = process.env.TRAVIS_BRANCH;
var LATEST = 'latest';

module.exports = S3Deploy;

function S3Deploy(config) {
  this._source = config.source;
  this._user = config.user;
  this._repo = config.repo;
  this._cdn = config.cdn;
  this._template = config._template || null;
  this._latestTag = false;

  var path = config.namespace + '/' + this._repo;
  this._bucket = config.bucket;
  this._s3Config = config.s3Config;

  this._keys = {
    tag: path + '/' + TAG + '/',
    latest: path + '/' + LATEST + '/'
  };

  this._hipchatNotify = new HipchatNotify(this._user, this._repo, this._cdn,
                                          this._template);
  this._tagChecker = new TagChecker(this._user, this._repo);
  this._s3 = null;

  _.bindAll(this, [
    '_isLatest',
    '_getFileNames',
    '_uploadFiles',
    '_uploadFile'
  ]);
}

S3Deploy.prototype.setup = function() {
  AWS.config.update(this._s3Config);

  this._s3 = new AWS.S3();
};

S3Deploy.prototype.deploy = function(cb) {
  var self = this;

  var tasks = [
    _.bind(this._isLatest, this),
    _.bind(this._getFileNames, this),
    _.bind(this._uploadFiles, this)
  ];

  async.waterfall(tasks, function() {
    self._hipchatNotify.sendDeployMessage(cb);
  });
};

S3Deploy.prototype._getFileNames = function (cb) {
  fs.readdir(this._source, function(err, fileNames) {
    if (err) {
      return cb(err);
    }

    cb(null, fileNames);
  });
};

S3Deploy.prototype._isLatest = function(cb) {
  var self = this;

  this._tagChecker.check(function(err, tagData) {
    if (err) {
      return cb(err);
    }

    self._latestTag = tagData.isLatest;

    return cb();
  });
};

S3Deploy.prototype._uploadFiles = function(fileNames, cb) {
  var self = this;

  async.each(fileNames, function(fileName, done) {
    fs.readFile(self._source + '/' + fileName, function(err, data) {
      if (err) {
        return cb(err);
      }

      var tasks = [
        _.bind(self._uploadFile, self, data, self._keys.tag + fileName)
      ];

      if (self._latestTag) {
        tasks.push(_.bind(self._uploadFile, self, data,
                   self._keys.latest + fileName));
      }

      async.parallel(tasks, function(err) {
        done(err);
      });
    });
  }, cb);
};

S3Deploy.prototype._uploadFile = function(data, dest, cb) {
  var params = {
    Bucket: this._bucket,
    Key: dest,
    Body: data
  };

  this._s3.putObject(params, cb);
};
