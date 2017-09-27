
/**
 * Module dependencies.
 */

const User = require('./mongo').user

/**
 * Upsert.
 */

User.upsert = async function(user) {
  const res = await User.findOne({ id: user.id })
  if (!res) return await User.insert(user)
  return await User.updateById(user._id, user)
}

/**
 * Expose `User`.
 */

module.exports = User
