
/**
 * Module dependencies.
 */

var User = require('./db-user');
var Seed = require('./db-seed');
var tasks = require('./tasks');

/**
 * Main bot.
 */

module.exports = function *() {
  var res = yield User.find({ followed_at: null });
  if (res.length < 500) yield tasks.addFollowers();
  yield tasks.follow();
  yield tasks.unfollow();
};
