
/**
 * Module dependencies.
 */

var thunkify = require('thunkify-wrap');
var Twitter = require('twitter');

/**
 * Twitter credentials
 */

var config = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

/**
 * Define `client`.
 */

var client = new Twitter(config);

/**
 * Get friendship status thunk.
 */

exports.getFriendship = function(user_id) {
  return function(fn) {
    client.get('friendships/lookup', { user_id: user_id }, function(err, data, res) {
      if (err) fn(err, null);
      if (res.headers['x-rate-limit-remaining'] < 1) fn([{ code: 88, message: 'About to exceed rate limit' }], null);
      fn(null, { data: data, res: res });
    });
  };
};

/**
 * Follow someone thunk.
 */

exports.follow = function(user_id) {
  return function(fn) {
    client.post('friendships/create', { user_id: user_id }, function(err, data, res) {
      if (err) fn(err, null);
      if (res.headers['x-rate-limit-remaining'] < 1) fn([{ code: 88, message: 'About to exceed rate limit' }], null);
      fn(null, { data: data, res: res });
    });
  };
};

/**
 * Unfollow someone thunk.
 */

exports.unfollow = function(user_id) {
  return function(fn) {
    client.post('friendships/destroy', { user_id: user_id }, function(err, data, res) {
      if (err) fn(err, null);
      if (res.headers['x-rate-limit-remaining'] < 1) fn([{ code: 88, message: 'About to exceed rate limit' }], null);
      fn(null, { data: data, res: res });
    });
  };
};

/**
 * Get followers thunk.
 */

exports.getFollowers = function(screen_name, cursor) {
  return function(fn) {
    client.get('followers/list', { screen_name: screen_name, cursor: cursor, count: 200 }, function(err, data, res) {
      if (err) fn(err, null);
      if (res.headers['x-rate-limit-remaining'] < 1) fn([{ code: 88, message: 'About to exceed rate limit' }], null);
      fn(null, { data: data, res: res });
    });
  };
};
