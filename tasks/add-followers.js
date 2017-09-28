
/**
 * Module dependencies.
 */

var tasks = require('../lib/tasks');

/**
 * Add followers.
 */

async function main() {
  await tasks.addFollowers()
  process.exit(0)
}

main()

// node ./tasks/add-followers.js