
/**
 * Module dependencies.
 */

var tasks = require('../lib/tasks');
var co = require('co');

/**
 * Add followers.
 */

co(function *() {
  var screen_names = process.argv[2].split(',') || [];
  yield tasks.addSeeds(screen_names, []);
  process.exit(0);
});

// node ./tasks/add-seeds.js segment,keen_io