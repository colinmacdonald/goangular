/*jshint node:true */

'use strict';

var hipchat = require('node-hipchat');
var _ = require('lodash');

var TagChecker = require('./tag_checker');

var HIPCHAT_TOKEN = process.env.HIPCHAT_TOKEN;
var TAG = process.env.TRAVIS_BRANCH;
var ROOMS = process.env.ROOMS.split(/,\s?/);
var TEMPLATE = 'Update of <a href="http://github.com/<%- user %>/<%- repo %>/' +
               'releases/tag/<%- tag %>"><%- repo %>:<%- tag %><%- latest %>' +
               '</a> to <a href="<%- cdn %><%- repo %>/<%- tag %>/<%- repo %>' +
               '.js">Production</a> was successful!';

module.exports = HipchatNotify;

function HipchatNotify(user, repo, cdn, template) {
  this._HC = new hipchat(HIPCHAT_TOKEN);
  this._tagChecker = new TagChecker(user, repo);

  this._user = user;
  this._repo = repo;
  this._cdn = cdn;
  this._template = template || TEMPLATE;
}

HipchatNotify.prototype.sendDeployMessage = function(cb) {
  var self = this;

  cb = _.isFunction(cb) ? cb : function() {};

  this._tagChecker.check(function(err, tagData) {
    if (err) {
      return cb(err);
    }

    var vars = {
      user: self._user,
      repo: self._repo,
      cdn: self._cdn,
      tag: TAG,
      latest: tagData.isLatest ? '/latest' : null
    };

    var message = _.template(self._template, vars);

    var params = {
      from: 'Travis CI',
      message: message,
      color: 'purple'
    };

    _.each(ROOMS, function(room) {
      params.room = room;

      self._HC.postMessage(params, function(data) {
        var err = null;

        if (data.status !== 'sent') {
          err = new Error('Hipchat message failed');
        }

        cb(err);
      });
    });
  });
};
