
/**
 * Module dependencies.
 */

var tasks = require('../lib/tasks');
var co = require('co');

/**
 * Follow.
 */

co(function *() {
  yield tasks.follow();
  process.exit(0);
});

// node ./tasks/follow.js