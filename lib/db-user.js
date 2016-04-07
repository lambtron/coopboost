
/**
 * Module dependencies.
 */

var wrap = require('co-monk');
var db = require('./db');;
var User = wrap(db.get('user'));

/**
 * Expose `User`.
 */

module.exports = User;

/**
 * Upsert.
 */

User.upsert = function *(user) {
  var res = yield this.findOne({ id: user.id });
  if (!res) return yield this.insert(user);
  return yield this.updateById(user._id, user);
};
