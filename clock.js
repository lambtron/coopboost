
/**
 * Module dependencies.
 */

var CronJob = require('cron').CronJob;
var bot = require('./lib/bot');
var co = require('co');

/**
 * Initiate Cronjob.
 */

new CronJob({
  cronTime: "0 18,19,20,21,22,23,24 * * *", // every hour
  onTick: co(bot()),
  start: true,
  timeZone: "America/Los_Angeles"
});
