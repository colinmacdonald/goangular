/*jshint node:true */

'use strict';

var Hipchatter = require('hipchatter');
var _ = require('lodash');

var HIPCHAT_TOKEN = process.env.HIPCHAT_TOKEN;
var BRANCH = process.env.TRAVIS_BRANCH;
var ROOMS = process.env.ROOMS.split(/,\s?/);

var hipchatter = new Hipchatter(HIPCHAT_TOKEN, 'https://api.hipchat.com/v2/');

var message = 'Update of <a href="http://github.com/goinstant/goangular/' +
              'releases/tag/' + BRANCH +'">GoAngular:' + BRANCH +'</a> to ' +
              '<a href="https://cdn.goinstant.net/integrations/goangular/' +
              BRANCH + '/goangular.js">Production</a> was successful!';

var opts = {
  message: message,
  color: 'purple',
  token: HIPCHAT_TOKEN
};

_.each(ROOMS, function(room) {
  hipchatter.notify(room, opts, function() {});
});
