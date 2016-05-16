
/**
 * Module dependencies.
 */

var twitter = require('./twitter');
var User = require('./db-user');
var Seed = require('./db-seed');
var moment = require('moment');
var _ = require('lodash');

/**
 * Find and add followers to database.
 */

exports.follow = function *follow() {
  var users = yield User.find({ followed_at: null }, { sort: { followed_at: -1 }});
  for (var i = 0; i < users.length; i++) {
    try {
      yield twitter.follow(users[i].id);
      yield twitter.mute(users[i].id);
      yield twitter.addToList(users[i].id);
    } catch (e) {
      console.log(e);
      if (e.length > 0 && e[0].code === '108') {
        User.remove({ id: users[i].id });
        continue;
      }
      break;
    }
    users[i].followed_at = new Date;
    yield User.updateById(users[i]._id, users[i]);
  }
  console.log('Done following');
};

/**
 * Find and add followers to database.
 */

exports.unfollow = function *() {
  var users = yield User.find({ followed_at: { $exists: true }});
  for (var i = 0; i < users.length; i++) {
    if (moment().subtract(30, 'days').isBefore(moment(new Date(users[i].followed_at)))) continue;
    users[i].unfollowed = true;
    yield User.updateById(users[i]._id, users[i]);
    try {
      var res = yield twitter.getFriendship(users[i].id);
      if (res.data[0].connections.join('').indexOf('followed_by') >= 0) continue;
      yield twitter.unfollow(users[i].id);
    } catch (e) {
      console.log(e);
      break;
    }
  }
  console.log('Done unfollowing');
};

/**
 * Add seeds (other users whose followers you want to follow.
 */

exports.addSeeds = function *(screen_names) {
  for (var i = 0; i < screen_names.length; i++) {
    yield Seed.add({
      screen_name: screen_names[i],
      cursor: '-1',
      followers_added: 0
    });
  }
};

/**
 * Add followers from seed to database.
 */

exports.addFollowers = function *() {
  var seeds = yield Seed.find({ added: null });
  var followers = [];
  for (var i = 0; i < seeds.length; i++) {
    var err = false;
    while (seeds[i].cursor != '0' && !err) {
      try {
        var res = yield twitter.getFollowers(seeds[i].screen_name, seeds[i].cursor);
        var users = res.data.users;
        seeds[i].followers_added += users.length;
        seeds[i].cursor = res.data.next_cursor_str;
        followers = _.concat(followers, _.filter(users, function(user) {
          var active = !user.default_profile && !user.default_profile_image;
          if (user.status && user.status.created_at) active = active && moment().subtract(7, 'days').isBefore(moment(new Date(user.status.created_at)));
          return active;
        }));
        if (seeds[i].cursor === '0') seeds[i].added = true;
        // err = true; // REMOVE THIS IN PROD.
      } catch (e) {
        console.log(e);
        err = true;
      }
    }
    if (err) i = seeds.length;
  }
  for (var j = 0; j < followers.length; j++) {
    yield User.upsert({
      id: followers[j].id_str,
      screen_name: followers[j].screen_name,
      description: followers[j].description,
      followers: followers[j].followers_count
    });
  }
  for (var k = 0; k < seeds.length; k++) {
    seeds[i].added = true;
    yield Seed.updateById(seeds[i]._id, seeds[i]);
  }
}
