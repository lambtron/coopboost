
/**
 * Module dependencies.
 */

const tasks = require('../lib/tasks')

/**
 * Add followers.
 */

async function main() {
	var screen_names = process.argv[2].split(',') || []
	await tasks.addSeeds(screen_names, [])
	process.exit(0);
}

main()

// node ./tasks/add-seeds.js segment,keen_io