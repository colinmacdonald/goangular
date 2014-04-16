/*jshint node:true */

'use strict';

var hipchat = require('node-hipchat');
var _ = require('lodash');

var HIPCHAT_TOKEN = process.env.HIPCHAT_TOKEN;
var BRANCH = process.env.TRAVIS_BRANCH;
var ROOMS = process.env.ROOMS.split(/,\s?/);
var IS_LATEST = parseInt(process.env.IS_LATEST);
var LATEST = IS_LATEST !== 0 ? '/latest' : '';

var HC = new hipchat(HIPCHAT_TOKEN);

var message = 'Update of <a href="http://github.com/goinstant/goangular/' +
              'releases/tag/' + BRANCH +'">GoAngular:' + BRANCH + LATEST +
              '</a> to <a href="https://cdn.goinstant.net/integrations/' +
              'goangular/' + BRANCH + '/goangular.js">Production</a> was ' +
              'successful!';

var params = {
  from: 'Travis CI',
  message: message,
  color: 'purple'
};

_.each(ROOMS, function(room) {
  params.room = room;

  HC.postMessage(params, function() {});
});
