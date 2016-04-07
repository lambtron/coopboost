
/**
 * Module dependencies.
 */

var tasks = require('../lib/tasks');
var co = require('co');

/**
 * Unfollow.
 */

co(function *() {
  yield tasks.unfollow();
  process.exit(0);
});

// node ./tasks/unfollow.js