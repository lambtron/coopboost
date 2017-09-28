
/**
 * Module dependencies.
 */

const tasks = require('../lib/tasks');

/**
 * Unfollow.
 */

async function main() {
  await tasks.unfollow()
  process.exit(0)
}

main()

// node ./tasks/unfollow.js