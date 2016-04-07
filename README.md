
# Coopboost

> Grow your twitter audience.

## Deploy

First, [create a Twitter application](https://apps.twitter.com/) and grab the:
- consumer key
- consumer secret
- access token (you'll need to click "Create my access token")
- access token secret

Then, deploy below and provide the above tokens in the setup process.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?env[TWITTER_CONSUMER_KEY]=&env[TWITTER_CONSUMER_SECRET]=&env[TWITTER_ACCESS_TOKEN_KEY]=&env[TWITTER_ACCESS_TOKEN_SECRET])

Finally, seed your database with some Twitter accounts _whose followers you want_, i.e. Twitter accounts who are like you. (This bot will follow those accounts' followers with the intention that they'll look at your profile and follow you back.)

```ssh
$ heroku node ./tasks/add-seeds.js segment,keen_io,startupljackson
```

And you're done!

## How does it work?

The cron job is in `./clock.js` and it determines when to initiate the `bot()`. Then, three things happen:

- given a list of twitter users, add their followers to a data store
- get the followers from the data store and follow them
- check the database for followers who haven't followed back within 30 days and unfollow them

The cronjob in `./clock.js` is set to kick off this process each hour on the hour starting from 10am to 4pm pacific time. Feel free to update this to your liking. If you want to find out when your twitter followers are most active, check out this free tool, [Tweriod](http://www.tweriod.com/). If you need help constructing cronJobs, [check out this nifty tool](http://www.cronmaker.com/).

## Manually triggering tasks

You can manually kick off tasks from the terminal.

### Seeding database with accounts whose followers you want

```ssh
$ heroku node ./tasks/add-seeds.js segment,keen_io,startupljackson
```

The last parameter here are Twitter usernames delimited by commas. You can put as many as you want here. There are no notifications if all of these followers are added to the queue, so check back every once in a while to make sure the bot has followers to follow.

### Adding followers

```ssh
$ heroku node ./tasks/add-followers.js
```

This will go through the database of seed accounts and add their followers to another database of accounts to follow.

### Following

```ssh
$ heroku node ./tasks/follow.js
```

This will go through the database of accounts to follow and follow them.

### Unfollowing

```ssh
$ heroku node ./tasks/unfollow.js
```

This will go through the database of accounts, find the accounts that were followed, check if they've followed back, and if not, unfollow them.

## What next?

- Adding keywords to find tweets to favorite
- Searching through the profile of users who follow me, then sending a targeted DM (or is that era over and now perceived as super spammy?)

## Questions or complaints?

Tweet at me [@andyjiang](https://twitter.com/andyjiang).

