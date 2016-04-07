
/**
 * Module dependencies.
 */

var wrap = require('co-monk');
var db = require('./db');;
var Seed = wrap(db.get('seed'));

/**
 * Expose `Seed`.
 */

module.exports = Seed;

/**
 * Add, but if exists, don't add.
 */

Seed.add = function *(seed) {
  var res = yield this.findOne({ screen_name: seed.screen_name });
  if (res) return;
  return yield this.insert(seed);
};
