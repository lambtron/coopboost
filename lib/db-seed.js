
/**
 * Module dependencies.
 */

const Seed = require('./mongo').seed

/**
 * Add, but if exists, don't add.
 */

Seed.upsert = async function upsert(seed) {
	return await Seed.findOneAndUpdate({ screen_name: seed.screen_name }, seed, { upsert: true, new: true })
}

/**
 * Expose `Seed`.
 */

module.exports = Seed;

