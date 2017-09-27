
/**
 * Module dependencies.
 */

const config = require('./config.js')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * Set models.
 */

const Seed = new Schema({ screen_name: String, cursor: String, followers_added: Number })
const SeedModel = mongoose.model('Seed', Seed)
const User = new Schema({ id: String, screen_name: String, description: String, followers: Number, followed_at: { type: Date, default: Date.now }, unfollowed: Boolean })
const UserModel = mongoose.model('User', User)

/**
 * Set variables.
 */

const mongo_url = config.mongo_uri
mongoose.Promise = global.Promise

/**
 * Connect.
 */

mongoose.connect(mongo_url, { 
  useMongoClient: true,
	// sets how many times to try reconnecting
	reconnectTries: Number.MAX_VALUE,
	// sets the delay between every retry (milliseconds)
	reconnectInterval: 1000 
});

/**
 * Expose models.
 */

exports.seed = SeedModel
exports.user = UserModel

/**
 * Error handling.
 */

mongoose.connection.on('error', function(err) {
	console.error('Connection error', err)
})

mongoose.connection.once('open', function() {
  console.info('Mongoose connected')
});
