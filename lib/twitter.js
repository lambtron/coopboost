
/**
 * Module dependencies.
 */

const Twitter = require('twitter')
const config = require('./config')

/**
 * Twitter credentials
 */

const twitterConfig = {
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
};

/**
 * Define `client`.
 */

const client = new Twitter(twitterConfig);

/**
 * THERE NEEDS TO BE A TWITTER CLIENT THAT THROTTLES ALL OUTBOUND REQUESTS.
 *
 * queue = []
 * a FOR loop that goes through queue and SLEEPS between each request
 *
 * that way, we can use Promise.all on the `tasks` side.
 */



/**
 * Get friendship status promise.
 */

exports.getFriendship = function getFriendship(user_id) {
  return new Promise(function(resolve, reject) {
    client.get('friendships/lookup', { user_id: user_id }, function(err, data, res) {
      if (err) reject(err[0], null);
      if (res.headers['x-rate-limit-remaining'] < 1) reject({ code: 88, message: 'About to exceed rate limit' }, null);
      resolve(null, { data: data, res: res });
    });
  })
}

/**
 * Follow someone promise.
 */

exports.follow = function follow(user_id) {
  return new Promise(function(resolve, reject) {
    client.post('friendships/create', { user_id: user_id }, function(err, data, res) {
      if (err && err[0].code && err[0].code === 160) resolve({});
      if (err) reject(err[0]);
      if (res.headers['x-rate-limit-remaining'] < 1) reject({ code: 88, message: 'About to exceed rate limit' });
      resolve({ data: data, res: res });
    });
  })
}

/**
 * Unfollow someone promise.
 */

exports.unfollow = function unfollow(user_id) {
  return new Promise(function(resolve, reject) {
    client.post('friendships/destroy', { user_id: user_id }, function(err, data, res) {
      if (err) reject(err[0]);
      if (res.headers['x-rate-limit-remaining'] < 1) reject({ code: 88, message: 'About to exceed rate limit' });
      resolve({ data: data, res: res });
    });
  })
}

/**
 * Get followers promise.
 */

exports.getFollowers = function getFollowers(screen_name, cursor) {
  return new Promise(function(resolve, reject) {
    client.get('followers/list', { screen_name: screen_name, cursor: cursor, count: 200 }, function(err, data, res) {
      if (err) reject(err[0]);
      if (res.headers['x-rate-limit-remaining'] < 1) reject({ code: 88, message: 'About to exceed rate limit' });
      resolve({ data: data, res: res });
    })
  })
}

/**
 * Mute someone.
 */

exports.mute = function mute(user_id) {
  return new Promise(function(resolve, reject) {
    client.post('mutes/users/create', { user_id: user_id }, function(err, data, res) {
      if (err) reject(err[0]);
      if (res.headers['x-rate-limit-remaining'] < 1) reject({ code: 88, message: 'About to exceed rate limit' });
      resolve({ data: data, res: res });
    })
  })
}

/**
 * Add someone to list.
 */

exports.addToList = function(user_id) {
  return new Promise(function(resolve, reject) {
    if (config.list_name.length === 0 || config.screen_name.length === 0) resolve(null, {});
    client.post('lists/members/create', { slug: config.list_name, user_id: user_id, owner_screen_name: config.screen_name }, function(err, data, res) {
      if (err && err[0].code && err[0].code === 104) resolve({});
      if (err) reject(err[0]);
      if (res.headers['x-rate-limit-remaining'] < 1) reject({ code: 88, message: 'About to exceed rate limit' });
      reject({ data: data, res: res });
    });
  })
}



