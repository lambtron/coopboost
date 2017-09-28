
/**
 * Module dependencies.
 */

const User = require('./mongo').user

/**
 * Upsert.
 */

User.upsert = async function upsert(user) {
	return await User.findOneAndUpdate({ id: user.id }, user, { upsert: true, new: true })
}

/**
 * Expose `User`.
 */

module.exports = User
