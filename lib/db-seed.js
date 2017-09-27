
/**
 * Module dependencies.
 */

const Seed = require('./mongo').seed

/**
 * Add, but if exists, don't add.
 */

Seed.add = async function(seed) {
  const res = await Seed.findOne({ screen_name: seed.screen_name })
  if (res) return
  return await Seed.insert(seed)
};

/**
 * Expose `Seed`.
 */

module.exports = Seed;

