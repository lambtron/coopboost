
/**
 * Module dependencies.
 */

var Twitter = require('twitter');
var config = require('./config');

/**
 * Twitter credentials
 */

var twitterConfig = {
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
};

/**
 * Define `client`.
 */

var client = new Twitter(twitterConfig);

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
      if (err && err[0].code && err[0].code === 160) fn(null, { data: {}, res: {} });
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

/**
 * Mute someone.
 */

exports.mute = function(user_id) {
  return function(fn) {
    client.post('mutes/users/create', { user_id: user_id }, function(err, data, res) {
      if (err) fn(err, null);
      if (res.headers['x-rate-limit-remaining'] < 1) fn([{ code: 88, message: 'About to exceed rate limit' }], null);
      fn(null, { data: data, res: res });
    });
  };
};

/**
 * Add someone to list.
 */

exports.addToList = function(user_id) {
  return function(fn) {
    if (config.list_name.length === 0 || config.screen_name.length === 0) fn(null, {});
    client.post('lists/members/create', { slug: config.list_name, user_id: user_id, owner_screen_name: config.screen_name }, function(err, data, res) {
      if (err && err[0].code && err[0].code === 104) fn(null, { data: {}, res: {} });
      if (err) fn(err, null);
      if (res.headers['x-rate-limit-remaining'] < 1) fn([{ code: 88, message: 'About to exceed rate limit' }], null);
      fn(null, { data: data, res: res });
    });
  };
};
