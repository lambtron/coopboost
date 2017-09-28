
/**
 * Module dependencies.
 */

require('dotenv').config()
const twitter = require('./twitter')
const User = require('./db-user')
const Seed = require('./db-seed')
const moment = require('moment')
const _ = require('lodash')

/**
 * Follow users from database.
 */

exports.follow = async function follow() {
  // Get users.
  var users = await User.find({ followed_at: null }, {}, { sort: { followed_at: -1 }});

  let tasks = []
  for (let i = 0; i < users.length; i++) {
    try {
      await twitter.follow(users[i].id)
      await twitter.mute(users[i].id)
      // await twitter.addToList(users[i].id)
    } catch (e) {
      if (e.length > 0 && e.code === 108) {
        tasks.push(User.remove({ id: users[i].id })) // CONFIRM THIS IS MONGOOSE PROMISIFIED
        continue
      }
      console.log(e)
      break
    }
  }

  users[i].followed_at = new Date
  tasks.push(User.upsert(users[i].id))

  // Perform parallel mongo tasks.
  return await Promise.all(tasks)
}

/**
 * Unfollow users if they meet condition.
 */

exports.unfollow = async function() {
  // Get users who have been followed.
  const users = await User.find({ followed_at: { $exists: true }})

  // Create upsert queue.
  let upserts = [] 

  // Iterate through users and unfollow if met condition.
  for (let i = 0; i < users.length; i++) {
    if (moment().subtract(7, 'days').isBefore(moment(new Date(users[i].followed_at)))) continue

    // Update user status in mongo.
    users[i].unfollowed = true
    upserts.push(User.upsert(users[i].id, users[i]))
    try {
      // If the user did not follow back.
      const res = await twitter.getFriendship(users[i].id)
      if (res.data[0].connections.join('').indexOf('followed_by') >= 0) continue

      // Unfollow.
      await twitter.unfollow(users[i].id)
    } catch (e) {
      console.log(e);
      break;
    }
  }
  console.log('Done unfollowing');
};

/**
 * Add seeds (other users whose followers you want to follow.
 */

exports.addSeeds = async function addSeeds(screen_names) {
  let tasks = []
  for (let i = 0; i < screen_names.length; i++) {
    tasks.push(Seed.upsert({
      screen_name: screen_names[i],
      cursor: '-1',
      followers_added: 0
    }))
  }
  return await Promise.all(tasks)
};

/**
 * Add followers from seed to database.
 */

exports.addFollowers = async function addFollwers() {
  let seeds = await Seed.find({ added: null })
  let followers = []

  let err = false
  for (let i = 0; i < seeds.length; i++) {
    while (seeds[i].cursor != '0' && !err) {
      try {
        const res = await twitter.getFollowers(seeds[i].screen_name, seeds[i].cursor)
        const users = res.data.users

        // Save state for next time.
        seeds[i].followers_added += users.length
        seeds[i].cursor = res.data.next_cursor_str

        // Filter out bots and low-value twitter accounts.
        followers = _.concat(followers, _.filter(users, function(user) {
          let active = !user.default_profile && !user.default_profile_image
          if (user.status && user.status.created_at) active = active && moment().subtract(7, 'days').isBefore(moment(new Date(user.status.created_at)))
          return active
        }))

        // Update for next loop iteration.
        if (seeds[i].cursor === '0') seeds[i].added = true
      } catch (e) {
        err = true
        console.log(e)
      }
    }
  }

  // Update mongo with followers.
  let upserts = []
  for (let j = 0; j < followers.length; j++) {
    upserts.push(User.upsert({
      id: followers[j].id_str,
      screen_name: followers[j].screen_name,
      description: followers[j].description,
      followers: followers[j].followers_count
    }))
  }

  // Update mongo with seeds.
  for (let k = 0; k < i; k++) {
    upserts.push(Seed.upsert(seeds[k].screen_name))
  }

  // Run upserts in parallel.
  return await Promise.all(upserts)
}

/**
 * Handle rejections like a big boy.
 */

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error);
});
