
/**
 * Module dependencies.
 */

var tasks = require('../lib/tasks');
var co = require('co');

/**
 * Add followers.
 */

co(function *() {
  yield tasks.addFollowers();
  process.exit(0);
});

// node ./tasks/add-followers.js