
/**
 * Module dependencies.
 */

const tasks = require('../lib/tasks')

/**
 * Follow.
 */

async function main() {
  await tasks.follow()
  process.exit(0)
}

main()

// node ./tasks/follow.js